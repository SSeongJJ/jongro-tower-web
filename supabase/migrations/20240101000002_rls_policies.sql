-- ============================================================
-- RLS(Row Level Security) 정책
-- anon: 공개 데이터 읽기만
-- authenticated: 관리자 전체 권한
-- ============================================================

-- ============================================================
-- shops
-- ============================================================
ALTER TABLE shops ENABLE ROW LEVEL SECURITY;

CREATE POLICY "shops_anon_select"
  ON shops FOR SELECT
  TO anon
  USING (is_deleted = false AND is_active = true);

CREATE POLICY "shops_auth_all"
  ON shops FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- notices
-- ============================================================
ALTER TABLE notices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "notices_anon_select"
  ON notices FOR SELECT
  TO anon
  USING (is_deleted = false);

CREATE POLICY "notices_auth_all"
  ON notices FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- floor_maps
-- ============================================================
ALTER TABLE floor_maps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "floor_maps_anon_select"
  ON floor_maps FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "floor_maps_auth_all"
  ON floor_maps FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- slides
-- ============================================================
ALTER TABLE slides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "slides_anon_select"
  ON slides FOR SELECT
  TO anon
  USING (is_active = true);

CREATE POLICY "slides_auth_all"
  ON slides FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- Storage 버킷 생성
-- ============================================================
INSERT INTO storage.buckets (id, name, public)
VALUES
  ('shop-images',    'shop-images',    true),
  ('floor-maps',     'floor-maps',     true),
  ('slide-images',   'slide-images',   true),
  ('notice-images',  'notice-images',  true)
ON CONFLICT (id) DO NOTHING;

-- Storage: anon 읽기
CREATE POLICY "shop_images_anon_read"
  ON storage.objects FOR SELECT
  TO anon
  USING (bucket_id = 'shop-images');

CREATE POLICY "floor_maps_anon_read"
  ON storage.objects FOR SELECT
  TO anon
  USING (bucket_id = 'floor-maps');

CREATE POLICY "slide_images_anon_read"
  ON storage.objects FOR SELECT
  TO anon
  USING (bucket_id = 'slide-images');

CREATE POLICY "notice_images_anon_read"
  ON storage.objects FOR SELECT
  TO anon
  USING (bucket_id = 'notice-images');

-- Storage: authenticated 전체 권한
CREATE POLICY "storage_auth_all"
  ON storage.objects FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
