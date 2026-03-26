// ============================================
// Supabase 설정
// ============================================
const SUPABASE_URL = 'YOUR_SUPABASE_URL';       // 예: https://xxxx.supabase.co
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';

// Supabase 미설정 시 → 데모 모드(demo-data.js)의 Mock Client 사용
// supabaseClient는 demo-data.js에서 이미 선언됨
if (SUPABASE_URL !== 'YOUR_SUPABASE_URL') {
  // 실제 Supabase 연결 시 아래 줄 활성화
  // window.supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

// ============================================
// GitHub 동기화 설정 (testing/ 폴더 데이터 저장용)
// ============================================
const GITHUB_SYNC_CONFIG = {
  token: 'YOUR_GITHUB_TOKEN',   // GitHub Personal Access Token (repo 쓰기 권한 필요)
  owner: 'thesmithclub',
  repo: 'smith-warranty-system',
  branch: 'main',
};

// ============================================
// 솔라피 설정 (나중에 입력)
// ============================================
const SOLAPI_CONFIG = {
  apiKey: 'YOUR_SOLAPI_API_KEY',
  apiSecret: 'YOUR_SOLAPI_API_SECRET',
  senderPhone: 'YOUR_SENDER_PHONE_NUMBER',   // 발신번호 (등록된 번호)
  kakaoChannelId: 'YOUR_KAKAO_CHANNEL_ID',   // 카카오 비즈니스 채널 ID
};

// ============================================
// 제품 목록 (드롭다운용)
// ============================================
const PRODUCTS = [
  '', 'BELLA', 'FLUX', 'VEGA', 'T1', 'T2',
  'Premium', 'Prestige', 'DETLA',
  'ML Signature', 'ML Classic', 'ML Signature Green',
  'Authentic T', 'Authentic L'
];

// 제품사양 목록 (VLT%)
const SPECS = ['', '5', '10', '15', '20', '25', '30', '35', '40', '50', '70'];

// 시공위치 목록
const POSITIONS = [
  { key: 'front',      label: '전면' },
  { key: 'side1',      label: '측면 1열' },
  { key: 'side2',      label: '측면 2열' },
  { key: 'side3',      label: '측면 3열' },
  { key: 'rear',       label: '후면' },
  { key: 'glass_roof', label: '글래스루프' },
  { key: 'panorama',   label: '파노라마' },
];

// ============================================
// 유틸 함수
// ============================================

// 날짜 포맷 (YYYY-MM-DD)
function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' })
    .replace(/\. /g, '-').replace('.', '');
}

// 금액 포맷 (1,090,000 원)
function formatPrice(price) {
  if (!price) return '';
  return Number(price).toLocaleString('ko-KR') + ' 원';
}

// 연락처 마스킹 (01084843140 → 0108484****)
function maskPhone(phone) {
  if (!phone) return '';
  // 하이픈 있는 형식
  if (phone.includes('-')) return phone.replace(/(\d{3}-\d{4}-)(\d{4})/, '$1****');
  // 숫자만 있는 형식 (11자리)
  if (phone.length >= 10) return phone.slice(0, -4) + '****';
  return phone;
}

// 세션 체크 및 리디렉션
async function requireAuth(redirectTo = '../index.html') {
  const { data: { session } } = await supabaseClient.auth.getSession();
  if (!session) {
    window.location.href = redirectTo;
    return null;
  }
  return session;
}

// 현재 유저 프로필 조회
async function getCurrentProfile() {
  const session = await requireAuth();
  if (!session) return null;

  const { data, error } = await supabaseClient
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single();

  if (error) console.error('프로필 조회 오류:', error);
  return data;
}

// 로그아웃
async function logout() {
  await supabaseClient.auth.signOut();
  window.location.href = '../index.html';
}
