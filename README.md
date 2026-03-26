# Smith Warranty System

스미스 자동차 유리막 코팅 보증서 관리 시스템

## 주요 기능

- **보증서 등록** — 고객 정보, 차량 정보, 시공 정보 입력 및 보증서 발급
- **보증서 조회** — 고객 이름/차량번호로 보증서 검색
- **대리점 관리** — 대리점 계정 생성, 활성/비활성 상태 관리
- **재고 관리** — 제품별 재고 수량 및 잔여 미터 관리
- **1롤 차감 설정** — 시공 위치별 미터 차감 자동 적용
- **통계** — 월별 발급 건수, 대리점별 순위, 시공 위치별 현황

## 페이지 구조

```
/                   → 로그인 페이지
/login/             → 로그인 (리다이렉트)
/search/            → 보증서 조회 (리다이렉트)
/customer/          → 보증서 조회
/admin/dashboard    → 관리자 대시보드
/admin/register     → 보증서 등록
/admin/warranties   → 보증서 목록
/admin/dealers      → 대리점 관리
/admin/inventory    → 재고 현황
/admin/stats        → 통계
/admin/products     → 제품 관리
/admin/deduction-config → 1롤 차감 설정
```

## 기술 스택

- **Frontend**: 순수 HTML/CSS/JavaScript (프레임워크 없음)
- **데이터**: localStorage 기반 Mock DB (추후 Supabase 연동 예정)
- **카카오 발송**: 솔라피 API 연동 예정
- **이미지 캡처**: html2canvas

## 배포

GitHub Pages로 배포 — `main` 브랜치 자동 배포

## 개발 노트

- `js/demo-data.js` — Mock Supabase 구현체 (localStorage 기반)
- `DEMO_VERSION` 변경 시 localStorage 초기화됨
- Supabase/Solapi 실제 연동 시 `js/demo-data.js`를 실제 클라이언트로 교체
