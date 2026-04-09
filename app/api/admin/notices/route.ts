import { NextRequest } from 'next/server';
import { ZodError } from 'zod';
import {
  internalErrorResponse,
  successResponse,
  unauthorizedResponse,
  validationErrorResponse,
} from '@/lib/api-response';
import { getAuthenticatedUser } from '@/lib/auth-guard';
import { createAdminClient } from '@/lib/supabase/admin';
import { createNoticeSchema } from '@/lib/validations/notice';

// GET /api/admin/notices — 공지 목록
export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return unauthorizedResponse();

    const { searchParams } = request.nextUrl;
    const search = searchParams.get('search');
    const page = Math.max(1, Number(searchParams.get('page') ?? '1'));
    const limit = Math.min(100, Number(searchParams.get('limit') ?? '20'));

    const supabase = createAdminClient();
    let query = supabase
      .from('notices')
      .select('id, title, is_pinned, view_count, created_at, updated_at', { count: 'exact' })
      .order('is_pinned', { ascending: false })
      .order('created_at', { ascending: false });

    if (search) query = query.ilike('title', `%${search}%`);

    query = query.range((page - 1) * limit, page * limit - 1);

    const { data, error, count } = await query;

    if (error) return internalErrorResponse(error.message);

    return successResponse({ notices: data, total: count, page, limit });
  } catch {
    return internalErrorResponse();
  }
}

// POST /api/admin/notices — 공지 등록
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return unauthorizedResponse();

    const body = await request.json();
    const input = createNoticeSchema.parse(body);

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('notices')
      .insert(input)
      .select()
      .single();

    if (error) return internalErrorResponse(error.message);

    return successResponse({ notice: data }, 201);
  } catch (error) {
    if (error instanceof ZodError) return validationErrorResponse(error);
    return internalErrorResponse();
  }
}
