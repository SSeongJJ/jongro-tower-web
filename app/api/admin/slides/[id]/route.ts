import { NextRequest } from 'next/server';
import { ZodError } from 'zod';
import {
  internalErrorResponse,
  notFoundResponse,
  successResponse,
  unauthorizedResponse,
  validationErrorResponse,
} from '@/lib/api-response';
import { getAuthenticatedUser } from '@/lib/auth-guard';
import { createAdminClient } from '@/lib/supabase/admin';
import { updateSlideSchema } from '@/lib/validations/slide';

type RouteContext = { params: Promise<{ id: string }> };

// PUT /api/admin/slides/[id] — 슬라이더 수정
export async function PUT(request: NextRequest, { params }: RouteContext) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return unauthorizedResponse();

    const { id } = await params;
    const body = await request.json();
    const input = updateSlideSchema.parse(body);

    const supabase = createAdminClient();

    const { data: existing } = await supabase
      .from('slides')
      .select('id')
      .eq('id', id)
      .single();

    if (!existing) return notFoundResponse('슬라이드');

    const { data, error } = await supabase
      .from('slides')
      .update(input)
      .eq('id', id)
      .select()
      .single();

    if (error) return internalErrorResponse(error.message);

    return successResponse({ slide: data });
  } catch (error) {
    if (error instanceof ZodError) return validationErrorResponse(error);
    return internalErrorResponse();
  }
}

// DELETE /api/admin/slides/[id] — 슬라이더 삭제 (하드 삭제)
export async function DELETE(_request: NextRequest, { params }: RouteContext) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return unauthorizedResponse();

    const { id } = await params;
    const supabase = createAdminClient();

    const { data: existing } = await supabase
      .from('slides')
      .select('id')
      .eq('id', id)
      .single();

    if (!existing) return notFoundResponse('슬라이드');

    const { error } = await supabase.from('slides').delete().eq('id', id);

    if (error) return internalErrorResponse(error.message);

    return successResponse({ message: '슬라이드가 삭제되었습니다' });
  } catch {
    return internalErrorResponse();
  }
}
