-- ============================================================
-- 종로타워 초기 데이터 시딩
-- ============================================================

-- 층 도면 초기 레코드 (이미지 미등록 상태)
INSERT INTO floor_maps (floor, image_url) VALUES
  ('2F', ''),
  ('1F', ''),
  ('B1', ''),
  ('B2', '')
ON CONFLICT (floor) DO NOTHING;

-- 관리자 계정은 Supabase Auth로 별도 생성:
-- supabase auth create-user --email admin@jongrotower.com --password [초기비밀번호]
-- 또는 Supabase 대시보드 Authentication > Users에서 직접 생성
