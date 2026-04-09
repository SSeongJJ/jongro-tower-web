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
import { updateNoticeSchema } from '@/lib/validations/notice';

type RouteContext = { params: Promise<{ id: string }> };

// PUT /api/admin/notices/[id] — 공지 수정
export async function PUT(request: NextRequest, { params }: RouteContext) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return unauthorizedResponse();

    const { id } = await params;
    const body = await request.json();
    const input = updateNoticeSchema.parse(body);

    const supabase = createAdminClient();

    const { data: existing } = await supabase
      .from('notices')
      .select('id')
      .eq('id', id)
      .eq('is_deleted', false)
      .single();

    if (!existing) return notFoundResponse('공지사항');

    const { data, error } = await supabase
      .from('notices')
      .update(input)
      .eq('id', id)
      .select()
      .single();

    if (error) return internalErrorResponse(error.message);

    return successResponse({ notice: data });
  } catch (error) {
    if (error instanceof ZodError) return validationErrorResponse(error);
    return internalErrorResponse();
  }
}

// DELETE /api/admin/notices/[id] — 공지 소프트 삭제
export async function DELETE(_request: NextRequest, { params }: RouteContext) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return unauthorizedResponse();

    const { id } = await params;
    const supabase = createAdminClient();

    const { data: existing } = await supabase
      .from('notices')
      .select('id')
      .eq('id', id)
      .eq('is_deleted', false)
      .single();

    if (!existing) return notFoundResponse('공지사항');

    const { error } = await supabase
      .from('notices')
      .update({ is_deleted: true, deleted_at: new Date().toISOString() })
      .eq('id', id);

    if (error) return internalErrorResponse(error.message);

    return successResponse({ message: '공지사항이 삭제되었습니다' });
  } catch {
    return internalErrorResponse();
  }
}
