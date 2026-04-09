import {
  internalErrorResponse,
  successResponse,
  unauthorizedResponse,
} from '@/lib/api-response';
import { getAuthenticatedUser } from '@/lib/auth-guard';
import { createAdminClient } from '@/lib/supabase/admin';

// GET /api/admin/floor-maps — 도면 목록
export async function GET() {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return unauthorizedResponse();

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('floor_maps')
      .select('*')
      .order('floor', { ascending: true });

    if (error) return internalErrorResponse(error.message);

    return successResponse({ floorMaps: data });
  } catch {
    return internalErrorResponse();
  }
}
