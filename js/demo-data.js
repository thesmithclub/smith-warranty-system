// ============================================
// 데모 모드 - Supabase 없이 로컬 테스트용
// localStorage 기반 Mock Supabase Client
// ============================================

const DEMO_MODE = true; // Supabase 미설정 시 자동 활성화

// ── 초기 테스트 데이터 시드 ──
const SEED_DATA = {
  // 제품마다 사용 가능한 농도 목록이 다름
  products: [
    { id: 'prod-01', name: 'BELLA',              specs: ['15','17','21','30'],       active: true },
    { id: 'prod-02', name: 'FLUX',               specs: ['10','15','20','30'],       active: true },
    { id: 'prod-03', name: 'VEGA',               specs: ['10','15','20'],            active: true },
    { id: 'prod-04', name: 'T1',                 specs: ['15','20','25','35'],       active: true },
    { id: 'prod-05', name: 'T2',                 specs: ['15','20','30'],            active: true },
    { id: 'prod-06', name: 'Premium',            specs: ['15','20','30','40'],       active: true },
    { id: 'prod-07', name: 'Prestige',           specs: ['15','20','30'],            active: true },
    { id: 'prod-08', name: 'DETLA',              specs: ['5','10','15','20'],        active: true },
    { id: 'prod-09', name: 'ML Signature',       specs: ['15','20','30'],            active: true },
    { id: 'prod-10', name: 'ML Classic',         specs: ['15','20'],                 active: true },
    { id: 'prod-11', name: 'ML Signature Green', specs: ['20','30'],                 active: true },
    { id: 'prod-12', name: 'Authentic T',        specs: ['15','20','30','40','50'],  active: true },
    { id: 'prod-13', name: 'Authentic L',        specs: ['15','20','30','40','50','70'], active: true },
  ],
  users: [
    {
      id: 'admin-001',
      email: 'admin',
      password: '1234',
      role: 'admin',
      dealer_name: '더 스미스 본사',
      dealer_phone: '02-1234-5678',
      dealer_address: '서울특별시 강남구 테헤란로 123',
    },
    {
      id: 'dealer-a085',
      email: 'a085',
      password: '1234',
      role: 'dealer',
      dealer_name: 'A085 대리점',
      dealer_phone: '',
      dealer_address: '',
      joined_at: '2026-03-26',
      active: true,
    },
    {
      id: 'dealer-001',
      email: 'dealer@thesmith.com',
      password: 'dealer1234',
      role: 'dealer',
      dealer_name: '전포대리점',
      dealer_phone: '051-806-5540',
      dealer_address: '47305 부산 부산진구 전포대로 198 (전포동)',
      joined_at: '2024-03-01',
      active: true,
    },
    {
      id: 'dealer-002',
      email: 'gangnam@thesmith.com',
      password: 'dealer1234',
      role: 'dealer',
      dealer_name: '강남대리점',
      dealer_phone: '02-555-1234',
      dealer_address: '서울특별시 강남구 역삼동 123-4',
      joined_at: '2024-06-15',
      active: true,
    },
    {
      id: 'dealer-003',
      email: 'suwon@thesmith.com',
      password: 'dealer1234',
      role: 'dealer',
      dealer_name: '수원대리점',
      dealer_phone: '031-777-8888',
      dealer_address: '경기도 수원시 팔달구 인계로 56',
      joined_at: '2025-01-10',
      active: true,
    },
    {
      id: 'dealer-004',
      email: 'daegu@thesmith.com',
      password: 'dealer1234',
      role: 'dealer',
      dealer_name: '대구대리점',
      dealer_phone: '053-444-5678',
      dealer_address: '대구광역시 수성구 범어동 99',
      joined_at: '2025-04-20',
      active: true,
    },
  ],
  inventory: [
    // dealer-001 (전포대리점)
    { id:'inv-d1-01', dealer_id:'dealer-001', product_name:'BELLA',   spec:'15', quantity:5,  used_meters:0 },
    { id:'inv-d1-02', dealer_id:'dealer-001', product_name:'BELLA',   spec:'17', quantity:3,  used_meters:0 },
    { id:'inv-d1-03', dealer_id:'dealer-001', product_name:'FLUX',    spec:'10', quantity:4,  used_meters:0 },
    { id:'inv-d1-04', dealer_id:'dealer-001', product_name:'FLUX',    spec:'20', quantity:2,  used_meters:0 },
    { id:'inv-d1-05', dealer_id:'dealer-001', product_name:'VEGA',    spec:'15', quantity:6,  used_meters:0 },
    // dealer-002 (강남대리점)
    { id:'inv-d2-01', dealer_id:'dealer-002', product_name:'BELLA',   spec:'15', quantity:10, used_meters:0 },
    { id:'inv-d2-02', dealer_id:'dealer-002', product_name:'BELLA',   spec:'21', quantity:7,  used_meters:0 },
    { id:'inv-d2-03', dealer_id:'dealer-002', product_name:'T1',      spec:'20', quantity:8,  used_meters:0 },
    { id:'inv-d2-04', dealer_id:'dealer-002', product_name:'T1',      spec:'35', quantity:3,  used_meters:0 },
    { id:'inv-d2-05', dealer_id:'dealer-002', product_name:'Premium', spec:'20', quantity:5,  used_meters:0 },
    // dealer-003 (수원대리점)
    { id:'inv-d3-01', dealer_id:'dealer-003', product_name:'VEGA',    spec:'10', quantity:3,  used_meters:0 },
    { id:'inv-d3-02', dealer_id:'dealer-003', product_name:'VEGA',    spec:'20', quantity:4,  used_meters:0 },
    { id:'inv-d3-03', dealer_id:'dealer-003', product_name:'T2',      spec:'15', quantity:9,  used_meters:0 },
    { id:'inv-d3-04', dealer_id:'dealer-003', product_name:'T2',      spec:'30', quantity:2,  used_meters:0 },
    // dealer-004 (대구대리점)
    { id:'inv-d4-01', dealer_id:'dealer-004', product_name:'FLUX',    spec:'15', quantity:7,  used_meters:0 },
    { id:'inv-d4-02', dealer_id:'dealer-004', product_name:'DETLA',   spec:'10', quantity:5,  used_meters:0 },
    { id:'inv-d4-03', dealer_id:'dealer-004', product_name:'DETLA',   spec:'15', quantity:3,  used_meters:0 },
  ],
  warranties: [
    {
      id: 'warranty-001',
      warranty_number: '26-SC-0325-0001',
      customer_name: '최•도',
      customer_car: 'EV4',
      car_number: '1523',
      customer_phone: '01084843140',
      customer_address: '부산광역시 해운대구',
      car_vin: 'S015017',
      service_date: '2026-03-25',
      service_price: 1090000,
      front_product: 'BELLA',   front_spec: '30',
      side1_product: 'BELLA',   side1_spec: '15',
      side2_product: 'BELLA',   side2_spec: '15',
      side3_product: '',         side3_spec: '',
      rear_product: 'BELLA',    rear_spec: '15',
      glass_roof_product: '',    glass_roof_spec: '',
      panorama_product: '',      panorama_spec: '',
      dealer_id: 'dealer-001',
      installer_name: '탁언경',
      shop_name: '전포대리점',
      shop_phone: '051-806-5540',
      shop_address: '47305 부산 부산진구 전포대로 198 (전포동)',
      warranty_image_url: null,
      kakao_sent: true,
      sms_sent: false,
      created_at: '2026-03-25T09:00:00Z',
      updated_at: '2026-03-25T09:00:00Z',
    },
    {
      id: 'warranty-002',
      warranty_number: '26-SC-0310-2841',
      customer_name: '이민준',
      customer_car: '아이오닉6',
      car_number: '34나 5678',
      customer_phone: '01023456789',
      customer_address: '서울특별시 강남구',
      car_vin: 'KMHC041KBNU123456',
      service_date: '2026-03-10',
      service_price: 850000,
      front_product: 'VEGA',   front_spec: '20',
      side1_product: 'VEGA',   side1_spec: '15',
      side2_product: 'VEGA',   side2_spec: '15',
      side3_product: '',        side3_spec: '',
      rear_product: 'VEGA',    rear_spec: '15',
      glass_roof_product: '',   glass_roof_spec: '',
      panorama_product: '',     panorama_spec: '',
      dealer_id: 'dealer-002',
      installer_name: '김강남',
      shop_name: '강남대리점',
      shop_phone: '02-555-1234',
      shop_address: '서울특별시 강남구 역삼동 123-4',
      warranty_image_url: null,
      kakao_sent: true,
      sms_sent: false,
      created_at: '2026-03-10T11:00:00Z',
      updated_at: '2026-03-10T11:00:00Z',
    },
    {
      id: 'warranty-003',
      warranty_number: '26-SC-0301-1122',
      customer_name: '박지현',
      customer_car: 'GV80',
      car_number: '12가 9999',
      customer_phone: '01099887766',
      customer_address: '서울특별시 서초구',
      car_vin: 'KMHCN81BPNU987654',
      service_date: '2026-03-01',
      service_price: 1450000,
      front_product: 'BELLA',      front_spec: '30',
      side1_product: 'BELLA',      side1_spec: '15',
      side2_product: 'BELLA',      side2_spec: '15',
      side3_product: 'BELLA',      side3_spec: '15',
      rear_product: 'BELLA',       rear_spec: '15',
      glass_roof_product: 'FLUX',  glass_roof_spec: '20',
      panorama_product: '',        panorama_spec: '',
      dealer_id: 'dealer-002',
      installer_name: '김강남',
      shop_name: '강남대리점',
      shop_phone: '02-555-1234',
      shop_address: '서울특별시 강남구 역삼동 123-4',
      warranty_image_url: null,
      kakao_sent: false,
      sms_sent: false,
      created_at: '2026-03-01T14:00:00Z',
      updated_at: '2026-03-01T14:00:00Z',
    },
    {
      id: 'warranty-004',
      warranty_number: '26-SC-0315-3399',
      customer_name: '정수원',
      customer_car: '쏘렌토',
      car_number: '56다 1234',
      customer_phone: '01055443322',
      customer_address: '경기도 수원시',
      car_vin: 'KNAGM4A77D5123456',
      service_date: '2026-03-15',
      service_price: 720000,
      front_product: 'T1',    front_spec: '25',
      side1_product: 'T1',    side1_spec: '15',
      side2_product: 'T1',    side2_spec: '15',
      side3_product: '',       side3_spec: '',
      rear_product: 'T1',     rear_spec: '20',
      glass_roof_product: '',  glass_roof_spec: '',
      panorama_product: '',    panorama_spec: '',
      dealer_id: 'dealer-003',
      installer_name: '박수원',
      shop_name: '수원대리점',
      shop_phone: '031-777-8888',
      shop_address: '경기도 수원시 팔달구 인계로 56',
      warranty_image_url: null,
      kakao_sent: true,
      sms_sent: false,
      created_at: '2026-03-15T10:30:00Z',
      updated_at: '2026-03-15T10:30:00Z',
    },
  ],
};

// ── localStorage 초기화 (버전 기반 — 구조 변경 시 자동 리셋) ──
const DEMO_VERSION = 'v7'; // 구조 바뀔 때 올려주세요

function initDemoData() {
  if (localStorage.getItem('demo_version') !== DEMO_VERSION) {
    // 버전 불일치 → 전체 리셋
    localStorage.setItem('demo_users',     JSON.stringify(SEED_DATA.users));
    localStorage.setItem('demo_warranties',JSON.stringify(SEED_DATA.warranties));
    localStorage.setItem('demo_products',  JSON.stringify(SEED_DATA.products));
    localStorage.setItem('demo_version',   DEMO_VERSION);
    localStorage.setItem('demo_initialized', '1');
  }
}

function getUsers()     { return JSON.parse(localStorage.getItem('demo_users') || '[]'); }
function saveUsers(users){ localStorage.setItem('demo_users', JSON.stringify(users)); }
function getWarranties(){ return JSON.parse(localStorage.getItem('demo_warranties') || '[]'); }
function saveWarranties(ws){ localStorage.setItem('demo_warranties', JSON.stringify(ws)); }

// 제품/사양 getter & setter
function getProducts()  { initDemoData(); return JSON.parse(localStorage.getItem('demo_products') || '[]'); }
function getSpecs()     { initDemoData(); return JSON.parse(localStorage.getItem('demo_specs') || '[]'); }
function saveProducts(p){ localStorage.setItem('demo_products', JSON.stringify(p)); }
function saveSpecs(s)   { localStorage.setItem('demo_specs',    JSON.stringify(s)); }

function getInventory() {
  const raw = localStorage.getItem('smith_inventory');
  if (raw) return JSON.parse(raw);
  const initial = JSON.parse(JSON.stringify(SEED_DATA.inventory));
  localStorage.setItem('smith_inventory', JSON.stringify(initial));
  return initial;
}

function saveInventory(data) {
  localStorage.setItem('smith_inventory', JSON.stringify(data));
}

// ── 1롤 차감 설정 ──
const DEFAULT_DEDUCTION_CONFIG = {
  roll_length: 33,
  positions: {
    front:      1.5,
    side1:      0.5,
    side2:      0.3,
    side3:      0.2,
    rear:       1.0,
    glass_roof: 0.7,
    panorama:   1.4,
  }
};
function getDeductionConfig() {
  const raw = localStorage.getItem('smith_deduction_config');
  if (raw) return JSON.parse(raw);
  return JSON.parse(JSON.stringify(DEFAULT_DEDUCTION_CONFIG));
}
function saveDeductionConfig(cfg) {
  localStorage.setItem('smith_deduction_config', JSON.stringify(cfg));
}

// 재고 미터 차감 (보증서 등록 시 호출)
function deductInventoryMeters(dealerId, positions) {
  // positions: [{ key, product_name, spec }]
  const cfg = getDeductionConfig();
  const inv = getInventory();
  let changed = false;

  for (const pos of positions) {
    if (!pos.product_name || !pos.spec) continue;
    const meters = cfg.positions[pos.key] || 0;
    if (meters === 0) continue;

    // spec 값에서 '%' 제거
    const specVal = pos.spec.replace('%', '');
    let item = inv.find(i =>
      i.dealer_id === dealerId &&
      i.product_name === pos.product_name &&
      i.spec === specVal
    );
    if (!item) {
      // 재고 없으면 생성 (마이너스 허용)
      item = { id: 'inv-' + Date.now() + Math.random(), dealer_id: dealerId, product_name: pos.product_name, spec: specVal, quantity: 0, used_meters: 0 };
      inv.push(item);
    }
    if (item.used_meters === undefined) item.used_meters = 0;
    item.used_meters = Math.round((item.used_meters + meters) * 100) / 100;
    changed = true;
  }

  if (changed) saveInventory(inv);
}

// 잔여 미터 계산
function getRemainingMeters(item) {
  const cfg = getDeductionConfig();
  const total = (item.quantity || 0) * cfg.roll_length;
  const used  = item.used_meters || 0;
  return Math.round((total - used) * 100) / 100;
}

// 활성 제품 이름 목록 (드롭다운용)
function getActiveProductNames() {
  return ['', ...getProducts().filter(p => p.active).map(p => p.name)];
}
// 특정 제품명에 해당하는 농도 목록
function getSpecsByProductName(name) {
  if (!name) return [];
  const prod = getProducts().find(p => p.name === name && p.active);
  return prod ? (prod.specs || []) : [];
}

// ── Mock Supabase Client ──
const supabaseClient = {

  // AUTH
  auth: {
    _session: null,

    async signInWithPassword({ email, password }) {
      initDemoData();
      const users = getUsers();
      const user = users.find(u => u.email === email && u.password === password);
      if (!user) return { data: {}, error: { message: '아이디 또는 비밀번호가 올바르지 않습니다.' } };
      if (user.role === 'dealer' && user.active === false) {
        return { data: {}, error: { message: '비활성화된 대리점 계정입니다. 관리자에게 문의하세요.' } };
      }
      const session = { user: { id: user.id, email: user.email } };
      this._session = session;
      localStorage.setItem('demo_session', JSON.stringify(session));
      return { data: { session }, error: null };
    },

    async getSession() {
      initDemoData();
      const raw = localStorage.getItem('demo_session');
      if (!raw) return { data: { session: null } };
      return { data: { session: JSON.parse(raw) } };
    },

    async signOut() {
      localStorage.removeItem('demo_session');
      return { error: null };
    },
  },

  // DATABASE (간단한 쿼리 체이닝 지원)
  from(table) {
    return new MockQuery(table);
  },

  // STORAGE (이미지 업로드 mock)
  storage: {
    from(bucket) {
      return {
        async upload(path, blob) {
          // 실제 업로드 대신 base64 URL로 저장
          return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () => {
              const urls = JSON.parse(localStorage.getItem('demo_storage') || '{}');
              urls[path] = reader.result;
              localStorage.setItem('demo_storage', JSON.stringify(urls));
              resolve({ data: { path }, error: null });
            };
            reader.readAsDataURL(blob);
          });
        },
        getPublicUrl(path) {
          const urls = JSON.parse(localStorage.getItem('demo_storage') || '{}');
          return { data: { publicUrl: urls[path] || '' } };
        },
      };
    },
  },

  // EDGE FUNCTIONS (mock)
  functions: {
    async invoke(name, { body }) {
      console.log('[Demo] Edge Function 호출:', name, body);
      return { data: { success: true, message: '데모 모드: 실제 발송은 Supabase 연결 후 가능합니다.' }, error: null };
    },
  },
};

// ── Mock Query Builder ──
class MockQuery {
  constructor(table) {
    this.table = table;
    this._filters = [];
    this._order = null;
    this._single = false;
    this._insertData = null;
    this._updateData = null;
    this._action = 'select';
  }

  select(cols) { this._action = 'select'; return this; }

  insert(rows) {
    this._action = 'insert';
    this._insertData = Array.isArray(rows) ? rows : [rows];
    return this;
  }

  update(data) {
    this._action = 'update';
    this._updateData = data;
    return this;
  }

  eq(col, val)   { this._filters.push({ type: 'eq',   col, val }); return this; }
  neq(col, val)  { this._filters.push({ type: 'neq',  col, val }); return this; }
  gte(col, val)  { this._filters.push({ type: 'gte',  col, val }); return this; }
  lte(col, val)  { this._filters.push({ type: 'lte',  col, val }); return this; }
  ilike(col, val){ this._filters.push({ type: 'ilike',col, val }); return this; }

  or(expr) {
    // 간단한 or 파싱 (customer_name.ilike.%검색어%)
    this._filters.push({ type: 'or', expr }); return this;
  }

  order(col, { ascending } = {}) { this._order = { col, ascending }; return this; }
  single() { this._single = true; return this; }
  limit(n) { this._limit = n; return this; }

  // 실제 실행
  then(resolve) { return this._execute().then(resolve); }

  async _execute() {
    initDemoData();

    if (this.table === 'profiles') {
      return this._execProfiles();
    }
    if (this.table === 'warranties') {
      return this._execWarranties();
    }
    return { data: null, error: { message: '알 수 없는 테이블: ' + this.table } };
  }

  _execProfiles() {
    const users = getUsers();
    const session = JSON.parse(localStorage.getItem('demo_session') || 'null');

    if (this._action === 'select') {
      let results = users.map(u => ({
        id: u.id,
        role: u.role,
        dealer_name: u.dealer_name,
        dealer_phone: u.dealer_phone,
        dealer_address: u.dealer_address,
      }));

      // 필터 적용
      for (const f of this._filters) {
        if (f.type === 'eq') results = results.filter(r => r[f.col] == f.val);
      }

      if (this._single) {
        return { data: results[0] || null, error: results[0] ? null : { message: 'No rows found' } };
      }
      return { data: results, error: null };
    }
    return { data: null, error: null };
  }

  _execWarranties() {
    if (this._action === 'insert') {
      const ws = getWarranties();
      const newW = { ...this._insertData[0], id: 'w-' + Date.now(), created_at: new Date().toISOString() };
      ws.unshift(newW);
      saveWarranties(ws);
      return { data: newW, error: null };
    }

    if (this._action === 'update') {
      const ws = getWarranties();
      let target = ws;
      for (const f of this._filters) {
        if (f.type === 'eq') target = target.filter(r => r[f.col] == f.val);
      }
      if (target.length > 0) {
        const idx = ws.findIndex(w => w.id === target[0].id);
        if (idx > -1) ws[idx] = { ...ws[idx], ...this._updateData };
        saveWarranties(ws);
      }
      return { data: null, error: null };
    }

    // SELECT
    let ws = getWarranties();

    // 필터 적용
    for (const f of this._filters) {
      if (f.type === 'eq')   ws = ws.filter(r => String(r[f.col]) === String(f.val));
      if (f.type === 'gte')  ws = ws.filter(r => r[f.col] >= f.val);
      if (f.type === 'lte')  ws = ws.filter(r => r[f.col] <= f.val);
      if (f.type === 'ilike'){
        const keyword = f.val.replace(/%/g,'').toLowerCase();
        ws = ws.filter(r => String(r[f.col]||'').toLowerCase().includes(keyword));
      }
      if (f.type === 'or') {
        const parts = f.expr.split(',');
        ws = ws.filter(row => parts.some(part => {
          const [col, op, rawVal] = part.split('.');
          const val = rawVal.replace(/%/g,'').toLowerCase();
          return String(row[col]||'').toLowerCase().includes(val);
        }));
      }
    }

    // 정렬
    if (this._order) {
      ws.sort((a, b) => {
        const aVal = a[this._order.col], bVal = b[this._order.col];
        return this._order.ascending
          ? aVal > bVal ? 1 : -1
          : aVal < bVal ? 1 : -1;
      });
    }

    if (this._single) {
      return { data: ws[0] || null, error: ws[0] ? null : { message: 'No rows found' } };
    }

    return { data: ws, error: null };
  }
}
