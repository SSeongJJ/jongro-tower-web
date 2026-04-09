import { z } from 'zod';

export const createNoticeSchema = z.object({
  title: z.string().min(1, '제목은 필수입니다').max(100),
  content: z.string().min(1, '내용은 필수입니다'),
  is_pinned: z.boolean().optional().default(false),
  image_urls: z.array(z.string().url()).optional().default([]),
});

export const updateNoticeSchema = createNoticeSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: '수정할 필드가 없습니다' },
);

export type CreateNoticeInput = z.infer<typeof createNoticeSchema>;
export type UpdateNoticeInput = z.infer<typeof updateNoticeSchema>;
