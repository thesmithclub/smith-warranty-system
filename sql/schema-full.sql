-- ============================================================
-- THE SMITH 보증서 시스템 — 전체 Supabase 스키마 (v2)
-- Supabase Dashboard > SQL Editor에서 실행하세요.
-- ============================================================

-- ── 대리점 계정 테이블 (Supabase Auth 미사용, 자체 인증) ──
CREATE TABLE IF NOT EXISTS dealer_accounts (
  id           TEXT PRIMARY KEY,               -- 'admin-001', 'dealer-a085' 등
  username     TEXT UNIQUE NOT NULL,           -- 로그인 ID ('admin', 'a085')
  password     TEXT NOT NULL,                  -- 비밀번호 (내부용)
  role         TEXT NOT NULL DEFAULT 'dealer' CHECK (role IN ('admin','dealer')),
  dealer_name  TEXT NOT NULL,
  dealer_phone TEXT,
  dealer_address TEXT,
  joined_at    DATE DEFAULT CURRENT_DATE,
  active       BOOLEAN DEFAULT TRUE,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ── 보증서 테이블 ──
CREATE TABLE IF NOT EXISTS warranties (
  id                   TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  warranty_number      TEXT UNIQUE NOT NULL,
  customer_name        TEXT NOT NULL,
  customer_car         TEXT NOT NULL,
  car_number           TEXT,
  customer_phone       TEXT NOT NULL,
  customer_address     TEXT,
  car_vin              TEXT,
  service_date         DATE NOT NULL,
  service_price        INTEGER NOT NULL,
  front_product        TEXT, front_spec TEXT,
  side1_product        TEXT, side1_spec TEXT,
  side2_product        TEXT, side2_spec TEXT,
  side3_product        TEXT, side3_spec TEXT,
  rear_product         TEXT, rear_spec TEXT,
  glass_roof_product   TEXT, glass_roof_spec TEXT,
  panorama_product     TEXT, panorama_spec TEXT,
  dealer_id            TEXT REFERENCES dealer_accounts(id),
  installer_name       TEXT NOT NULL,
  shop_name            TEXT NOT NULL,
  shop_phone           TEXT,
  shop_address         TEXT,
  warranty_image_url   TEXT,
  kakao_sent           BOOLEAN DEFAULT FALSE,
  kakao_sent_at        TIMESTAMPTZ,
  sms_sent             BOOLEAN DEFAULT FALSE,
  archived             BOOLEAN DEFAULT FALSE,
  created_at           TIMESTAMPTZ DEFAULT NOW(),
  updated_at           TIMESTAMPTZ DEFAULT NOW()
);

-- ── 제품 테이블 ──
CREATE TABLE IF NOT EXISTS products (
  id         TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name       TEXT UNIQUE NOT NULL,
  specs      TEXT[] NOT NULL DEFAULT '{}',
  active     BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── 재고 테이블 ──
CREATE TABLE IF NOT EXISTS inventory (
  id           TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  dealer_id    TEXT NOT NULL REFERENCES dealer_accounts(id) ON DELETE CASCADE,
  product_name TEXT NOT NULL,
  spec         TEXT NOT NULL,
  quantity     INTEGER DEFAULT 0,
  used_meters  NUMERIC(10,2) DEFAULT 0,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(dealer_id, product_name, spec)
);

-- ── 재고 변동 이력 ──
CREATE TABLE IF NOT EXISTS inventory_logs (
  id           TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  dealer_id    TEXT NOT NULL REFERENCES dealer_accounts(id) ON DELETE CASCADE,
  product_name TEXT NOT NULL,
  spec         TEXT NOT NULL,
  delta        NUMERIC(10,2) NOT NULL,
  type         TEXT NOT NULL CHECK (type IN ('in','deduct','adjust')),
  note         TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ── 1롤 차감 설정 (단일 행) ──
CREATE TABLE IF NOT EXISTS deduction_config (
  id          INTEGER PRIMARY KEY DEFAULT 1,
  roll_length NUMERIC(10,2) DEFAULT 33,
  positions   JSONB DEFAULT '{
    "front":1.5,"side1":0.5,"side2":0.3,"side3":0.2,
    "rear":1.0,"glass_roof":0.7,"panorama":1.4
  }'::jsonb,
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── 팝업 설정 ──
CREATE TABLE IF NOT EXISTS popups (
  id         TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title      TEXT,
  content    TEXT,
  active     BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- RLS 설정 (내부 도구 — anon 키로 전체 접근 허용)
-- ============================================================
ALTER TABLE dealer_accounts  ENABLE ROW LEVEL SECURITY;
ALTER TABLE warranties       ENABLE ROW LEVEL SECURITY;
ALTER TABLE products         ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory        ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_logs   ENABLE ROW LEVEL SECURITY;
ALTER TABLE deduction_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE popups           ENABLE ROW LEVEL SECURITY;

-- anon 전체 허용 정책
CREATE POLICY "anon_all" ON dealer_accounts  FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_all" ON warranties       FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_all" ON products         FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_all" ON inventory        FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_all" ON inventory_logs   FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_all" ON deduction_config FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_all" ON popups           FOR ALL TO anon USING (true) WITH CHECK (true);

-- ── 기본 차감 설정 삽입 ──
INSERT INTO deduction_config (id, roll_length, positions)
VALUES (1, 33, '{
  "front":1.5,"side1":0.5,"side2":0.3,"side3":0.2,
  "rear":1.0,"glass_roof":0.7,"panorama":1.4
}')
ON CONFLICT (id) DO NOTHING;
