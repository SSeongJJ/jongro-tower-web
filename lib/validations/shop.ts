import { z } from 'zod';

const SHOP_CATEGORIES = ['식음료', '뷰티', '패션', '편의점', '서비스'] as const;
const FLOORS = ['2F', '1F', 'B1', 'B2'] as const;

export const createShopSchema = z.object({
  name: z.string().min(1, '매장명은 필수입니다').max(50),
  category: z.enum(SHOP_CATEGORIES, { message: '유효하지 않은 카테고리입니다' }),
  floor: z.enum(FLOORS, { message: '유효하지 않은 층입니다' }),
  hours: z.string().max(100).nullable().optional(),
  phone: z
    .string()
    .regex(/^[0-9\-\+\(\)\s]*$/, '전화번호 형식이 올바르지 않습니다')
    .max(20)
    .nullable()
    .optional(),
  location_desc: z.string().max(200).nullable().optional(),
  image_url: z.string().url('유효하지 않은 이미지 URL입니다'),
  is_recommended: z.boolean().optional().default(false),
  is_active: z.boolean().optional().default(true),
  order: z.number().int().min(0).optional().default(0),
});

export const updateShopSchema = createShopSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: '수정할 필드가 없습니다' },
);

export type CreateShopInput = z.infer<typeof createShopSchema>;
export type UpdateShopInput = z.infer<typeof updateShopSchema>;
