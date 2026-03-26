-- ============================================
-- THE SMITH 보증서 시스템 - Supabase DB 스키마
-- ============================================

-- 대리점/관리자 프로필 테이블
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'dealer' CHECK (role IN ('admin', 'dealer')),
  dealer_name TEXT NOT NULL,        -- 시공점명
  dealer_phone TEXT,                 -- 연락처
  dealer_address TEXT,               -- 주소
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 보증서 테이블
CREATE TABLE IF NOT EXISTS warranties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  warranty_number TEXT UNIQUE NOT NULL,   -- 보증번호 (예: 26-SC-0325-3140)

  -- 고객 정보
  customer_name TEXT NOT NULL,            -- 고객성명
  customer_car TEXT NOT NULL,             -- 고객차종
  car_number TEXT NOT NULL,               -- 차량번호
  customer_phone TEXT NOT NULL,           -- 연락처
  customer_address TEXT,                  -- 고객주소
  car_vin TEXT,                           -- 차대번호

  -- 서비스 정보
  service_date DATE NOT NULL,             -- 시공일자
  service_price INTEGER NOT NULL,         -- 시공가격

  -- 시공위치별 제품/사양 (NULL이면 해당 위치 미시공)
  front_product TEXT,                     -- 전면 제품명
  front_spec TEXT,                        -- 전면 제품사양

  side1_product TEXT,                     -- 측면1열 제품명
  side1_spec TEXT,                        -- 측면1열 제품사양

  side2_product TEXT,                     -- 측면2열 제품명
  side2_spec TEXT,                        -- 측면2열 제품사양

  side3_product TEXT,                     -- 측면3열 제품명
  side3_spec TEXT,                        -- 측면3열 제품사양

  rear_product TEXT,                      -- 후면 제품명
  rear_spec TEXT,                         -- 후면 제품사양

  glass_roof_product TEXT,                -- 글래스루프 제품명
  glass_roof_spec TEXT,                   -- 글래스루프 제품사양

  panorama_product TEXT,                  -- 파노라마 제품명
  panorama_spec TEXT,                     -- 파노라마 제품사양

  -- 시공업체 정보 (등록 시점 스냅샷)
  dealer_id UUID REFERENCES profiles(id),
  installer_name TEXT NOT NULL,           -- 시공자
  shop_name TEXT NOT NULL,                -- 시공점명
  shop_phone TEXT NOT NULL,               -- 시공점 연락처
  shop_address TEXT NOT NULL,             -- 시공점 주소

  -- 발송/이미지
  warranty_image_url TEXT,                -- 생성된 보증서 이미지 URL (Supabase Storage)
  kakao_sent BOOLEAN DEFAULT FALSE,       -- 카카오톡 발송 여부
  kakao_sent_at TIMESTAMPTZ,             -- 발송 시각
  sms_sent BOOLEAN DEFAULT FALSE,         -- SMS 발송 여부

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- RLS (Row Level Security) 정책
-- ============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE warranties ENABLE ROW LEVEL SECURITY;

-- profiles: 본인 데이터만 읽기/수정, admin은 전체
CREATE POLICY "본인 프로필 조회" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "본인 프로필 수정" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "관리자 전체 프로필 조회" ON profiles
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- warranties: 대리점은 본인 등록분만, admin은 전체
CREATE POLICY "대리점 본인 보증서 조회" ON warranties
  FOR SELECT USING (dealer_id = auth.uid());

CREATE POLICY "대리점 보증서 등록" ON warranties
  FOR INSERT WITH CHECK (dealer_id = auth.uid());

CREATE POLICY "대리점 본인 보증서 수정" ON warranties
  FOR UPDATE USING (dealer_id = auth.uid());

CREATE POLICY "관리자 전체 보증서 조회" ON warranties
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- 고객 공개 조회 (보증번호 + 연락처 조합으로 조회)
CREATE POLICY "고객 보증서 공개 조회" ON warranties
  FOR SELECT USING (true);

-- ============================================
-- 보증번호 자동 생성 함수
-- ============================================
CREATE OR REPLACE FUNCTION generate_warranty_number()
RETURNS TEXT AS $$
DECLARE
  year_short TEXT;
  month_day TEXT;
  seq TEXT;
  new_number TEXT;
BEGIN
  year_short := TO_CHAR(NOW(), 'YY');
  month_day := TO_CHAR(NOW(), 'MMDD');
  seq := LPAD(FLOOR(RANDOM() * 9000 + 1000)::TEXT, 4, '0');
  new_number := year_short || '-SC-' || month_day || '-' || seq;
  RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 샘플 데이터 (테스트용 - 필요시 주석 해제)
-- ============================================
-- INSERT INTO warranties (warranty_number, customer_name, ...) VALUES (...);
