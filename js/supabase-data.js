// ============================================
// Supabase 연동 데이터 레이어
// demo-data.js를 대체하는 실제 Supabase 클라이언트
// ============================================

const SUPABASE_URL = 'https://kmnakugkpqupomeirmyk.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImttbmFrdWdrcHF1cG9tZWlybXlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxMDAyNzcsImV4cCI6MjA5MTY3NjI3N30.h8hjnlNflEw6HceplrMMaxjdpStvnWOxXDSv9cubHms';

// 실제 Supabase 클라이언트 (내부용)
const _sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ── 인메모리 캐시 ──
let _users          = [];
let _warranties     = [];
let _inventory      = [];
let _products       = [];
let _deductionConfig = {
  roll_length: 33,
  positions: { front:1.5, side1:0.5, side2:0.3, side3:0.2, rear:1.0, glass_roof:0.7, panorama:1.4 }
};
let _popups         = [];
let _inventoryLogs  = [];
let _initialized    = false;

// ── 캐시 초기화 (페이지 로드 시 한 번 호출) ──
async function initSupabaseData(dealerId, role) {
  try {
    const isAdmin = role === 'admin';

    // 병렬 로드
    const [
      usersRes,
      warrantiesRes,
      inventoryRes,
      productsRes,
      configRes,
      popupsRes,
      logsRes,
    ] = await Promise.all([
      _sb.from('dealer_accounts').select('*').order('joined_at', { ascending: false }),
      _sb.from('warranties').select('*').order('created_at', { ascending: false }),
      isAdmin
        ? _sb.from('inventory').select('*')
        : _sb.from('inventory').select('*').eq('dealer_id', dealerId),
      _sb.from('products').select('*').order('sort_order', { ascending: true }),
      _sb.from('deduction_config').select('*').eq('id', 1).single(),
      _sb.from('popups').select('*').order('created_at', { ascending: false }),
      isAdmin
        ? _sb.from('inventory_logs').select('*').order('created_at', { ascending: false }).limit(500)
        : _sb.from('inventory_logs').select('*').eq('dealer_id', dealerId).order('created_at', { ascending: false }).limit(200),
    ]);

    if (usersRes.data)      _users          = usersRes.data;
    if (warrantiesRes.data) _warranties     = warrantiesRes.data;
    if (inventoryRes.data)  _inventory      = inventoryRes.data;
    if (productsRes.data)   _products       = productsRes.data;
    if (configRes.data)     _deductionConfig = configRes.data;
    if (popupsRes.data)     _popups         = popupsRes.data;
    if (logsRes.data)       _inventoryLogs  = logsRes.data;

    _initialized = true;
  } catch (e) {
    console.error('[Supabase] initSupabaseData 오류:', e);
  }
}

// ── 사용자(대리점 계정) ──
function getUsers() {
  // dealer_accounts의 username을 email로 매핑 (기존 코드 호환)
  return _users.map(u => ({ ...u, email: u.username || u.email || '' }));
}

function saveUsers(users) {
  const oldIds  = new Set(_users.map(u => u.id));
  const newIds  = new Set(users.map(u => u.id));

  _users = users;

  (async () => {
    // 삭제된 사용자 처리
    for (const id of [...oldIds].filter(id => !newIds.has(id))) {
      await _sb.from('dealer_accounts').delete().eq('id', id);
    }
    // 추가/수정된 사용자 upsert
    for (const u of users) {
      const row = {
        id:             u.id,
        username:       u.email || u.username || '',
        password:       u.password || '',
        role:           u.role || 'dealer',
        dealer_name:    u.dealer_name || '',
        dealer_phone:   u.dealer_phone || '',
        dealer_address: u.dealer_address || '',
        active:         u.active !== false,
        joined_at:      u.joined_at || new Date().toISOString().split('T')[0],
      };
      await _sb.from('dealer_accounts').upsert(row, { onConflict: 'id' });
    }
  })().catch(e => console.error('[Supabase] saveUsers 오류:', e));
}

// ── 보증서 ──
function getWarranties() { return _warranties; }

function saveWarranties(ws) {
  _warranties = ws;
  // 보증서는 개별 update/insert로 처리하므로 여기서는 캐시만 갱신
}

// ── 재고 ──
function getInventory() { return _inventory; }

function saveInventory(data) {
  _inventory = data;

  (async () => {
    for (const item of data) {
      const row = {
        dealer_id:    item.dealer_id,
        product_name: item.product_name,
        spec:         item.spec,
        quantity:     item.quantity || 0,
        used_meters:  item.used_meters || 0,
        updated_at:   new Date().toISOString(),
      };
      if (item.id && !item.id.startsWith('inv-new')) {
        // 기존 항목 update
        await _sb.from('inventory').update(row).eq('id', item.id);
      } else {
        // 신규 항목 upsert
        await _sb.from('inventory').upsert({ ...row }, { onConflict: 'dealer_id,product_name,spec' });
        // id 반영
        const { data: created } = await _sb.from('inventory').select('id').eq('dealer_id', row.dealer_id).eq('product_name', row.product_name).eq('spec', row.spec).single();
        if (created) item.id = created.id;
      }
    }
  })().catch(e => console.error('[Supabase] saveInventory 오류:', e));
}

// ── 재고 변동 이력 ──
function getInventoryLogs() { return _inventoryLogs; }

function saveInventoryLogs(logs) { _inventoryLogs = logs; }

function addInventoryLog(dealerId, productName, spec, delta, type, note) {
  const log = {
    id:           'log-' + Date.now() + Math.random().toString(36).slice(2, 6),
    dealer_id:    dealerId,
    product_name: productName,
    spec:         String(spec).replace('%', ''),
    delta,
    type,
    note:         note || '',
    created_at:   new Date().toISOString(),
  };
  _inventoryLogs.unshift(log);

  // Supabase에 비동기 저장 (id는 서버 생성 uuid)
  const sbRow = { dealer_id: log.dealer_id, product_name: log.product_name, spec: log.spec, delta: log.delta, type: log.type, note: log.note };
  _sb.from('inventory_logs').insert(sbRow).catch(e => console.error('[Supabase] addInventoryLog 오류:', e));
}

// ── 1롤 차감 설정 ──
const DEFAULT_DEDUCTION_CONFIG = {
  roll_length: 33,
  positions: { front:1.5, side1:0.5, side2:0.3, side3:0.2, rear:1.0, glass_roof:0.7, panorama:1.4 }
};

function getDeductionConfig() { return _deductionConfig; }

function saveDeductionConfig(cfg) {
  _deductionConfig = cfg;
  const row = { id: 1, roll_length: cfg.roll_length, positions: cfg.positions, updated_at: new Date().toISOString() };
  _sb.from('deduction_config').update(row).eq('id', 1)
    .catch(e => console.error('[Supabase] saveDeductionConfig 오류:', e));
}

// ── 재고 미터 차감 (보증서 등록 시 호출) ──
function deductInventoryMeters(dealerId, positions) {
  const cfg = getDeductionConfig();
  const inv = getInventory();
  let changed = false;

  for (const pos of positions) {
    if (!pos.product_name || !pos.spec) continue;
    const meters  = cfg.positions[pos.key] || 0;
    if (meters === 0) continue;

    const specVal = pos.spec.replace('%', '');
    let item = inv.find(i =>
      i.dealer_id    === dealerId &&
      i.product_name === pos.product_name &&
      i.spec         === specVal
    );
    if (!item) {
      item = { id: 'inv-new-' + Date.now() + Math.random(), dealer_id: dealerId, product_name: pos.product_name, spec: specVal, quantity: 0, used_meters: 0 };
      inv.push(item);
    }
    if (item.used_meters === undefined) item.used_meters = 0;
    item.used_meters = Math.round((item.used_meters + meters) * 100) / 100;
    addInventoryLog(dealerId, pos.product_name, specVal, -meters, 'deduct', `보증서 시공 차감 (${pos.key})`);
    changed = true;
  }

  if (changed) saveInventory(inv);
}

// ── 잔여 미터 계산 ──
function getRemainingMeters(item) {
  const cfg   = getDeductionConfig();
  const total = (item.quantity || 0) * cfg.roll_length;
  const used  = item.used_meters || 0;
  return Math.round((total - used) * 100) / 100;
}

// ── 제품 ──
function getProducts()  { return _products; }
function getSpecs()     { return []; } // products.specs 배열에서 읽음

function saveProducts(prods) {
  _products = prods;
  (async () => {
    // 삭제된 제품 처리
    const { data: existing } = await _sb.from('products').select('id');
    const existingIds = new Set((existing || []).map(p => p.id));
    const newIds      = new Set(prods.map(p => p.id));

    for (const id of [...existingIds].filter(id => !newIds.has(id))) {
      await _sb.from('products').delete().eq('id', id);
    }
    for (const p of prods) {
      const row = { id: p.id, name: p.name, specs: p.specs || [], active: p.active !== false, sort_order: p.sort_order || 0 };
      await _sb.from('products').upsert(row, { onConflict: 'id' });
    }
  })().catch(e => console.error('[Supabase] saveProducts 오류:', e));
}

// ── 팝업 ──
function getPopups()    { return _popups; }

function savePopups(ps) {
  const oldIds = new Set(_popups.map(p => p.id));
  const newIds = new Set(ps.map(p => p.id));
  _popups = ps;

  (async () => {
    for (const id of [...oldIds].filter(id => !newIds.has(id))) {
      await _sb.from('popups').delete().eq('id', id);
    }
    for (const p of ps) {
      await _sb.from('popups').upsert({ id: p.id, title: p.title, content: p.content, active: p.active !== false }, { onConflict: 'id' });
    }
  })().catch(e => console.error('[Supabase] savePopups 오류:', e));
}

// ── 활성 제품 이름 목록 (드롭다운용) ──
function getActiveProductNames() {
  return ['', ...getProducts().filter(p => p.active !== false).map(p => p.name)];
}

// ── 특정 제품명에 해당하는 농도 목록 ──
function getSpecsByProductName(name) {
  if (!name) return [];
  const prod = getProducts().find(p => p.name === name && p.active !== false);
  return prod ? (prod.specs || []) : [];
}

// ============================================
// supabaseClient — 외부 공개용 래퍼
// from('profiles') → dealer_accounts 자동 변환
// auth는 dealer_accounts 기반 자체 구현
// ============================================
const supabaseClient = {

  // ── 인증 ──
  auth: {
    async signInWithPassword({ email, password }) {
      const { data, error } = await _sb
        .from('dealer_accounts')
        .select('*')
        .eq('username', email)
        .eq('password', password)
        .single();

      if (error || !data) {
        return { data: {}, error: { message: '아이디 또는 비밀번호가 올바르지 않습니다.' } };
      }
      if (data.role === 'dealer' && data.active === false) {
        return { data: {}, error: { message: '비활성화된 대리점 계정입니다. 관리자에게 문의하세요.' } };
      }

      const session = { user: { id: data.id, email: data.username } };
      localStorage.setItem('sb_session', JSON.stringify(session));
      localStorage.setItem('sb_user_role', data.role); // nav 즉시 적용용
      return { data: { session }, error: null };
    },

    async getSession() {
      const raw = localStorage.getItem('sb_session');
      if (!raw) return { data: { session: null } };
      return { data: { session: JSON.parse(raw) } };
    },

    async signOut() {
      localStorage.removeItem('sb_session');
      localStorage.removeItem('sb_user_role');
      return { error: null };
    },
  },

  // ── 데이터베이스 ──
  from(table) {
    // 'profiles' 테이블 → dealer_accounts 자동 매핑
    if (table === 'profiles') {
      return new ProfilesQuery();
    }
    return _sb.from(table);
  },

  // ── 스토리지 ──
  get storage() { return _sb.storage; },

  // ── Edge Functions ──
  functions: {
    async invoke(name, { body } = {}) {
      return _sb.functions.invoke(name, { body });
    },
  },
};

// ── profiles 테이블 → dealer_accounts 변환 쿼리 ──
class ProfilesQuery {
  constructor() {
    this._query = _sb.from('dealer_accounts');
    this._single = false;
    this._filters = [];
  }

  select(cols) { return this; }

  eq(col, val) {
    this._filters.push({ col, val });
    return this;
  }

  single() { this._single = true; return this; }

  then(resolve) { return this._execute().then(resolve); }

  async _execute() {
    let q = _sb.from('dealer_accounts').select('id,role,dealer_name,dealer_phone,dealer_address,username,active,joined_at');
    for (const f of this._filters) {
      q = q.eq(f.col, f.val);
    }
    if (this._single) q = q.single();
    const { data, error } = await q;
    // username → email 매핑 (기존 코드 호환)
    if (Array.isArray(data)) {
      return { data: data.map(r => ({ ...r, email: r.username })), error };
    }
    if (data) return { data: { ...data, email: data.username }, error };
    return { data, error };
  }
}
