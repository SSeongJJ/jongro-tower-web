import { z } from 'zod';

const FLOORS = ['2F', '1F', 'B1', 'B2'] as const;

export const updateFloorMapSchema = z.object({
  image_url: z.string().url('유효하지 않은 이미지 URL입니다'),
});

export const floorParamSchema = z.object({
  floor: z.enum(FLOORS, { message: '유효하지 않은 층입니다 (2F/1F/B1/B2)' }),
});

export type UpdateFloorMapInput = z.infer<typeof updateFloorMapSchema>;
