-- ============================================================
-- 종로타워 리테일 웹사이트 초기 스키마
-- Supabase Auth 사용: admins/refresh_tokens 테이블 불필요
-- ============================================================

-- ============================================================
-- 카테고리 Enum
-- ============================================================
CREATE TYPE shop_category AS ENUM ('식음료', '뷰티', '패션', '편의점', '서비스');

-- ============================================================
-- shops: 매장
-- ============================================================
CREATE TABLE shops (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,
  category        shop_category NOT NULL,
  floor           TEXT NOT NULL,              -- '2F' | '1F' | 'B1' | 'B2'
  hours           TEXT,
  phone           TEXT,
  location_desc   TEXT,
  image_url       TEXT NOT NULL DEFAULT '',
  is_recommended  BOOLEAN NOT NULL DEFAULT false,
  is_active       BOOLEAN NOT NULL DEFAULT true,
  is_deleted      BOOLEAN NOT NULL DEFAULT false,
  deleted_at      TIMESTAMPTZ,
  "order"         INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 인덱스
CREATE INDEX idx_shops_floor_active    ON shops (floor, is_deleted, is_active);
CREATE INDEX idx_shops_recommended     ON shops (is_recommended, is_deleted);
CREATE INDEX idx_shops_name            ON shops (name);
CREATE INDEX idx_shops_order           ON shops ("order");

-- ============================================================
-- notices: 공지사항
-- ============================================================
CREATE TABLE notices (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT NOT NULL,
  content     TEXT NOT NULL,               -- HTML 본문
  is_pinned   BOOLEAN NOT NULL DEFAULT false,
  view_count  INTEGER NOT NULL DEFAULT 0,
  image_urls  TEXT[] NOT NULL DEFAULT '{}',
  is_deleted  BOOLEAN NOT NULL DEFAULT false,
  deleted_at  TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 인덱스
CREATE INDEX idx_notices_list    ON notices (is_deleted, is_pinned, created_at DESC);
CREATE INDEX idx_notices_title   ON notices (title);

-- ============================================================
-- floor_maps: 층별 도면
-- ============================================================
CREATE TABLE floor_maps (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  floor       TEXT NOT NULL UNIQUE,        -- '2F' | '1F' | 'B1' | 'B2'
  image_url   TEXT NOT NULL DEFAULT '',
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- slides: 메인 슬라이더
-- ============================================================
CREATE TABLE slides (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url       TEXT NOT NULL,
  link_url        TEXT,
  display_order   INTEGER NOT NULL DEFAULT 0,
  is_active       BOOLEAN NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 인덱스
CREATE INDEX idx_slides_active_order ON slides (is_active, display_order);

-- ============================================================
-- updated_at 자동 갱신 트리거
-- ============================================================
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_shops_updated_at
  BEFORE UPDATE ON shops
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_notices_updated_at
  BEFORE UPDATE ON notices
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
