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
import { createSlideSchema } from '@/lib/validations/slide';

// GET /api/admin/slides — 슬라이더 목록 (전체, 비활성 포함)
export async function GET() {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return unauthorizedResponse();

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('slides')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) return internalErrorResponse(error.message);

    return successResponse({ slides: data });
  } catch {
    return internalErrorResponse();
  }
}

// POST /api/admin/slides — 슬라이더 등록
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return unauthorizedResponse();

    const body = await request.json();
    const input = createSlideSchema.parse(body);

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('slides')
      .insert(input)
      .select()
      .single();

    if (error) return internalErrorResponse(error.message);

    return successResponse({ slide: data }, 201);
  } catch (error) {
    if (error instanceof ZodError) return validationErrorResponse(error);
    return internalErrorResponse();
  }
}
