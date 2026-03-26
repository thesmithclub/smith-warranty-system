// ============================================
// GitHub API 동기화 모듈
// 관리자 페이지에서 등록한 대리점/제품을
// GitHub testing/ 폴더에 자동으로 저장합니다.
//
// 사용 방법:
//   config.js의 GITHUB_SYNC_CONFIG.token에
//   GitHub Personal Access Token을 입력하세요.
//   (Settings > Developer settings > PATs > Fine-grained tokens)
//   권한: Contents - Read and write
// ============================================

const GitHubSync = (() => {
  function isConfigured() {
    return (
      typeof GITHUB_SYNC_CONFIG !== 'undefined' &&
      GITHUB_SYNC_CONFIG.token &&
      GITHUB_SYNC_CONFIG.token !== 'YOUR_GITHUB_TOKEN'
    );
  }

  function apiBase() {
    const { owner, repo } = GITHUB_SYNC_CONFIG;
    return `https://api.github.com/repos/${owner}/${repo}/contents`;
  }

  function authHeaders() {
    return {
      Authorization: `Bearer ${GITHUB_SYNC_CONFIG.token}`,
      'Content-Type': 'application/json',
    };
  }

  // 파일 현재 상태 조회 (SHA 필요)
  async function getFile(path) {
    const { branch } = GITHUB_SYNC_CONFIG;
    const res = await fetch(`${apiBase()}/${path}?ref=${branch}`, {
      headers: authHeaders(),
    });
    if (res.status === 404) return { sha: null };
    if (!res.ok) throw new Error(`GitHub GET 실패: ${res.status}`);
    const data = await res.json();
    return { sha: data.sha };
  }

  // 파일 생성/업데이트
  async function putFile(path, content, sha, message) {
    const { branch } = GITHUB_SYNC_CONFIG;
    // JSON → UTF-8 문자열 → base64 (한글 포함 안전 처리)
    const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(content, null, 2))));
    const body = { message, content: encoded, branch };
    if (sha) body.sha = sha;

    const res = await fetch(`${apiBase()}/${path}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(`GitHub PUT 실패: ${res.status} ${err.message || ''}`);
    }
    return res.json();
  }

  // 대리점 목록 동기화 → testing/dealers.json
  async function syncDealers() {
    if (!isConfigured()) {
      console.info('[GitHubSync] 토큰 미설정 — 동기화 건너뜀');
      return;
    }
    const users = getUsers().filter(u => u.role === 'dealer');
    // 비밀번호 제외하고 저장
    const dealers = users.map(({ password, ...rest }) => rest);
    const { sha } = await getFile('testing/dealers.json');
    await putFile('testing/dealers.json', dealers, sha, '[테스트] 대리점 데이터 동기화');
    console.info('[GitHubSync] testing/dealers.json 업데이트 완료');
  }

  // 제품 목록 동기화 → testing/products.json
  async function syncProducts() {
    if (!isConfigured()) {
      console.info('[GitHubSync] 토큰 미설정 — 동기화 건너뜀');
      return;
    }
    const products = getProducts();
    const { sha } = await getFile('testing/products.json');
    await putFile('testing/products.json', products, sha, '[테스트] 제품 데이터 동기화');
    console.info('[GitHubSync] testing/products.json 업데이트 완료');
  }

  return { syncDealers, syncProducts };
})();
