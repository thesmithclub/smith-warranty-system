// ============================================
// 공통 설정 및 유틸 함수
// supabase-data.js 이후에 로드됨
// ============================================

// ── GitHub 동기화 설정 ──
const GITHUB_SYNC_CONFIG = {
  token: 'YOUR_GITHUB_TOKEN',
  owner: 'thesmithclub',
  repo: 'smith-warranty-system',
  branch: 'main',
};

// ── 솔라피 설정 ──
const SOLAPI_CONFIG = {
  apiKey:         'YOUR_SOLAPI_API_KEY',
  apiSecret:      'YOUR_SOLAPI_API_SECRET',
  senderPhone:    'YOUR_SENDER_PHONE_NUMBER',
  kakaoChannelId: 'YOUR_KAKAO_CHANNEL_ID',
};

// ── 제품 목록 (드롭다운용 기본값, 실제는 DB에서 로드) ──
const PRODUCTS = [
  '', 'BELLA', '미러그린', 'VEGA', 'T0', 'T1', 'T1+', 'T2', 'TS',
  '프리미엄', 'DELTA',
  'ML시그니처', 'ML클래식', 'ML시그니처그린',
  'Authentic T', 'Authentic L',
  '미러블루', '솔라가드스페셜',
];

// ── 제품사양 목록 (VLT%) ──
const SPECS = ['', '5', '7', '10', '15', '17', '20', '25', '27', '30', '35', '40', '45', '50', '60', '70'];

// ── 시공위치 목록 ──
const POSITIONS = [
  { key: 'front',      label: '전면' },
  { key: 'side1',      label: '측면 1열' },
  { key: 'side2',      label: '측면 2열' },
  { key: 'side3',      label: '측면 3열' },
  { key: 'rear',       label: '후면' },
  { key: 'glass_roof', label: '글래스루프' },
  { key: 'panorama',   label: '파노라마' },
];

// ── 날짜 포맷 (YYYY-MM-DD) ──
function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' })
    .replace(/\. /g, '-').replace('.', '');
}

// ── 금액 포맷 ──
function formatPrice(price) {
  if (!price) return '';
  return Number(price).toLocaleString('ko-KR') + ' 원';
}

// ── 연락처 마스킹 ──
function maskPhone(phone) {
  if (!phone) return '';
  if (phone.includes('-')) return phone.replace(/(\d{3}-\d{4}-)(\d{4})/, '$1****');
  if (phone.length >= 10) return phone.slice(0, -4) + '****';
  return phone;
}

// ── 세션 체크 및 리디렉션 ──
async function requireAuth(redirectTo = '../index.html') {
  const { data: { session } } = await supabaseClient.auth.getSession();
  if (!session) {
    window.location.href = redirectTo;
    return null;
  }
  return session;
}

// ── 현재 유저 프로필 조회 + 캐시 초기화 ──
async function getCurrentProfile() {
  const session = await requireAuth();
  if (!session) return null;

  const { data, error } = await supabaseClient
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single();

  if (error || !data) {
    console.error('프로필 조회 오류:', error);
    return null;
  }

  // 역할 캐시 (nav 깜빡임 방지용)
  localStorage.setItem('sb_user_role', data.role);

  // 첫 호출 시 Supabase 캐시 초기화
  if (typeof initSupabaseData === 'function') {
    await initSupabaseData(data.id, data.role);
  }

  return data;
}

// ── 로그아웃 ──
async function logout() {
  await supabaseClient.auth.signOut();
  window.location.href = '../index.html';
}
