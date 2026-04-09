import { z } from 'zod';

export const createSlideSchema = z.object({
  image_url: z.string().url('유효하지 않은 이미지 URL입니다'),
  link_url: z.string().url('유효하지 않은 링크 URL입니다').nullable().optional(),
  display_order: z.number().int().min(0).optional().default(0),
  is_active: z.boolean().optional().default(true),
});

export const updateSlideSchema = createSlideSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: '수정할 필드가 없습니다' },
);

export type CreateSlideInput = z.infer<typeof createSlideSchema>;
export type UpdateSlideInput = z.infer<typeof updateSlideSchema>;
