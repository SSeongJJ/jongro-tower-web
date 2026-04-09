import { createClient } from '@supabase/supabase-js';

/**
 * Service Role 클라이언트 — API Routes 전용.
 * RLS를 우회하므로 절대 클라이언트 번들에 포함하지 말 것.
 * 서버 사이드(API Route / Server Action)에서만 호출.
 */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}
