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
import {
  floorParamSchema,
  updateFloorMapSchema,
} from '@/lib/validations/floor-map';

type RouteContext = { params: Promise<{ floor: string }> };

// PUT /api/admin/floor-maps/[floor] — 도면 업로드/교체
export async function PUT(request: NextRequest, { params }: RouteContext) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return unauthorizedResponse();

    const rawParams = await params;
    const { floor } = floorParamSchema.parse(rawParams);

    const body = await request.json();
    const input = updateFloorMapSchema.parse(body);

    const supabase = createAdminClient();

    // 해당 층 도면이 있는지 확인 (seed로 초기화된 상태)
    const { data: existing } = await supabase
      .from('floor_maps')
      .select('id')
      .eq('floor', floor)
      .single();

    if (!existing) return notFoundResponse(`${floor} 도면`);

    const { data, error } = await supabase
      .from('floor_maps')
      .update({ image_url: input.image_url, uploaded_at: new Date().toISOString() })
      .eq('floor', floor)
      .select()
      .single();

    if (error) return internalErrorResponse(error.message);

    return successResponse({ floorMap: data });
  } catch (error) {
    if (error instanceof ZodError) return validationErrorResponse(error);
    return internalErrorResponse();
  }
}
