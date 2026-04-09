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
import { createShopSchema } from '@/lib/validations/shop';

// GET /api/admin/shops — 매장 목록 (관리자용, is_deleted 포함)
export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return unauthorizedResponse();

    const { searchParams } = request.nextUrl;
    const floor = searchParams.get('floor');
    const search = searchParams.get('search');
    const page = Math.max(1, Number(searchParams.get('page') ?? '1'));
    const limit = Math.min(100, Number(searchParams.get('limit') ?? '20'));

    const supabase = createAdminClient();
    let query = supabase
      .from('shops')
      .select('*', { count: 'exact' })
      .order('order', { ascending: true });

    if (floor) query = query.eq('floor', floor);
    if (search) query = query.ilike('name', `%${search}%`);

    query = query.range((page - 1) * limit, page * limit - 1);

    const { data, error, count } = await query;

    if (error) return internalErrorResponse(error.message);

    return successResponse({ shops: data, total: count, page, limit });
  } catch {
    return internalErrorResponse();
  }
}

// POST /api/admin/shops — 매장 등록
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return unauthorizedResponse();

    const body = await request.json();
    const input = createShopSchema.parse(body);

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('shops')
      .insert(input)
      .select()
      .single();

    if (error) return internalErrorResponse(error.message);

    return successResponse({ shop: data }, 201);
  } catch (error) {
    if (error instanceof ZodError) return validationErrorResponse(error);
    return internalErrorResponse();
  }
}
