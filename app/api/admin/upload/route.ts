import { NextRequest } from 'next/server';
import {
  errorResponse,
  internalErrorResponse,
  successResponse,
  unauthorizedResponse,
} from '@/lib/api-response';
import { getAuthenticatedUser } from '@/lib/auth-guard';
import { createAdminClient } from '@/lib/supabase/admin';

type BucketName = 'shop-images' | 'floor-maps' | 'slide-images' | 'notice-images';

const ALLOWED_BUCKETS: BucketName[] = [
  'shop-images',
  'floor-maps',
  'slide-images',
  'notice-images',
];

const MAX_FILE_SIZE_MAP: Record<BucketName, number> = {
  'shop-images': 5 * 1024 * 1024,     // 5MB
  'floor-maps': 10 * 1024 * 1024,     // 10MB
  'slide-images': 5 * 1024 * 1024,    // 5MB
  'notice-images': 5 * 1024 * 1024,   // 5MB
};

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

// POST /api/admin/upload — 이미지 업로드
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return unauthorizedResponse();

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const bucket = formData.get('bucket') as string | null;

    if (!file) {
      return errorResponse('MISSING_FILE', '파일이 없습니다', 400);
    }

    if (!bucket || !ALLOWED_BUCKETS.includes(bucket as BucketName)) {
      return errorResponse(
        'INVALID_BUCKET',
        `유효한 버킷을 지정하세요: ${ALLOWED_BUCKETS.join(', ')}`,
        400,
      );
    }

    const typedBucket = bucket as BucketName;

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return errorResponse(
        'INVALID_FILE_TYPE',
        '지원하지 않는 파일 형식입니다 (jpeg, png, webp, gif만 허용)',
        400,
      );
    }

    const maxSize = MAX_FILE_SIZE_MAP[typedBucket];
    if (file.size > maxSize) {
      return errorResponse(
        'FILE_TOO_LARGE',
        `파일 크기가 ${maxSize / (1024 * 1024)}MB를 초과합니다`,
        400,
      );
    }

    // 고유 파일명 생성
    const ext = file.name.split('.').pop() ?? 'jpg';
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const filePath = `${user.id}/${fileName}`;

    const supabase = createAdminClient();
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { error: uploadError } = await supabase.storage
      .from(typedBucket)
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      return internalErrorResponse(`업로드 실패: ${uploadError.message}`);
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(typedBucket).getPublicUrl(filePath);

    return successResponse({ url: publicUrl, path: filePath, bucket: typedBucket }, 201);
  } catch {
    return internalErrorResponse();
  }
}
