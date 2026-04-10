'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import ImageUploader from '@/components/common/image-uploader'
import { useToast } from '@/components/common/toast'
import { useCreateShop, useUpdateShop } from '@/lib/hooks/use-shops'
import { FLOORS, CATEGORIES } from '@/lib/utils'
import type { Shop, ShopFormValues } from '@/types'

const shopSchema = z.object({
  name: z.string().min(1, '매장명을 입력하세요'),
  floor: z.enum(['2F', '1F', 'B1', 'B2'], { required_error: '층을 선택하세요' }),
  category: z.enum(['식음료', '패션', '서비스', '편의시설', '기타'], { required_error: '카테고리를 선택하세요' }),
  hours: z.string().optional().default(''),
  phone: z.string().optional().default(''),
  location_desc: z.string().optional().default(''),
  order: z.coerce.number().int().min(0).default(0),
  is_recommended: z.boolean().default(false),
  image: z.any().optional(),
})

interface ShopFormProps {
  shop?: Shop // 수정 시 기존 데이터
}

export default function ShopForm({ shop }: ShopFormProps) {
  const router = useRouter()
  const { showToast } = useToast()
  const createMutation = useCreateShop()
  const updateMutation = useUpdateShop(shop?.id ?? 0)

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ShopFormValues>({
    resolver: zodResolver(shopSchema) as never,
    defaultValues: shop
      ? {
          name: shop.name,
          floor: shop.floor,
          category: shop.category,
          hours: shop.hours ?? '',
          phone: shop.phone ?? '',
          location_desc: shop.location_desc ?? '',
          order: shop.order,
          is_recommended: shop.is_recommended,
          image: null,
        }
      : {
          name: '',
          floor: '1F',
          category: '식음료',
          hours: '',
          phone: '',
          location_desc: '',
          order: 0,
          is_recommended: false,
          image: null,
        },
  })

  const onSubmit = async (values: ShopFormValues) => {
    const formData = new FormData()
    formData.append('name', values.name)
    formData.append('floor', values.floor)
    formData.append('category', values.category)
    formData.append('hours', values.hours ?? '')
    formData.append('phone', values.phone ?? '')
    formData.append('location_desc', values.location_desc ?? '')
    formData.append('order', String(values.order))
    formData.append('is_recommended', String(values.is_recommended))
    if (values.image) formData.append('image', values.image)

    try {
      if (shop) {
        await updateMutation.mutateAsync(formData)
        showToast('매장이 수정되었습니다')
      } else {
        await createMutation.mutateAsync(formData)
        showToast('매장이 등록되었습니다')
      }
      router.push('/admin/shops')
    } catch (e: unknown) {
      showToast(e instanceof Error ? e.message : '오류가 발생했습니다', 'error')
    }
  }

  const inputClass =
    'w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#C4A265]/30 focus:border-[#C4A265] transition-colors'

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 bg-white rounded-xl border border-gray-100 p-6">
      {/* 매장 이미지 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">매장 이미지</label>
        <Controller
          name="image"
          control={control}
          render={({ field }) => (
            <ImageUploader
              value={shop?.image_url}
              onChange={field.onChange}
              label="이미지 업로드 (JPG/PNG, 5MB)"
            />
          )}
        />
      </div>

      {/* 매장명 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          매장명 <span className="text-red-500">*</span>
        </label>
        <input {...register('name')} className={inputClass} placeholder="매장명 입력" />
        {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
      </div>

      {/* 층 / 카테고리 */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            층 <span className="text-red-500">*</span>
          </label>
          <select {...register('floor')} className={inputClass + ' bg-white'}>
            {FLOORS.map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
          {errors.floor && <p className="text-xs text-red-500 mt-1">{errors.floor.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            카테고리 <span className="text-red-500">*</span>
          </label>
          <select {...register('category')} className={inputClass + ' bg-white'}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category.message}</p>}
        </div>
      </div>

      {/* 운영시간 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">운영시간</label>
        <input {...register('hours')} className={inputClass} placeholder="예: 10:00~22:00" />
      </div>

      {/* 전화번호 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">전화번호</label>
        <input {...register('phone')} className={inputClass} placeholder="예: 02-1234-5678" />
      </div>

      {/* 위치 설명 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">위치 설명</label>
        <input
          {...register('location_desc')}
          className={inputClass}
          placeholder="예: 1층 중앙 에스컬레이터 옆"
        />
      </div>

      {/* 노출 순서 / 추천 */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">노출 순서</label>
          <input {...register('order')} type="number" min="0" className={inputClass} />
        </div>
        <div className="flex items-end pb-0.5">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              {...register('is_recommended')}
              type="checkbox"
              className="w-4 h-4 rounded accent-[#C4A265]"
            />
            <span className="text-sm font-medium text-gray-700">추천 매장으로 설정</span>
          </label>
        </div>
      </div>

      {/* 버튼 */}
      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={() => router.push('/admin/shops')}
          className="px-5 py-2.5 text-sm font-medium text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          취소
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-5 py-2.5 text-sm font-medium text-white bg-[#1A1A2E] rounded-lg hover:bg-[#1A1A2E]/90 transition-colors disabled:opacity-50"
        >
          {isSubmitting ? '저장 중...' : shop ? '수정 완료' : '매장 등록'}
        </button>
      </div>
    </form>
  )
}
