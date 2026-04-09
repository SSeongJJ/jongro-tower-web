'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import dynamic from 'next/dynamic'
import { useToast } from '@/components/common/toast'
import { useCreateNotice, useUpdateNotice } from '@/lib/hooks/use-notices'
import type { Notice, NoticeFormValues } from '@/types'

// TipTap 에디터는 SSR 비활성화 (document 접근 필요)
const RichEditor = dynamic(() => import('./rich-editor'), { ssr: false })

const noticeSchema = z.object({
  title: z.string().min(1, '제목을 입력하세요').max(200, '제목은 200자 이하여야 합니다'),
  content: z.string().min(1, '내용을 입력하세요'),
})

interface NoticeFormProps {
  notice?: Notice
}

export default function NoticeForm({ notice }: NoticeFormProps) {
  const router = useRouter()
  const { showToast } = useToast()
  const createMutation = useCreateNotice()
  const updateMutation = useUpdateNotice(notice?.id ?? 0)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<NoticeFormValues>({
    resolver: zodResolver(noticeSchema),
    defaultValues: {
      title: notice?.title ?? '',
      content: notice?.content ?? '',
    },
  })

  const content = watch('content')

  const onSubmit = async (values: NoticeFormValues) => {
    try {
      if (notice) {
        await updateMutation.mutateAsync(values)
        showToast('공지가 수정되었습니다')
      } else {
        await createMutation.mutateAsync(values)
        showToast('공지가 등록되었습니다')
      }
      router.push('/admin/notices')
    } catch (e: unknown) {
      showToast(e instanceof Error ? e.message : '오류가 발생했습니다', 'error')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 bg-white rounded-xl border border-gray-100 p-6">
      {/* 제목 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          제목 <span className="text-red-500">*</span>
        </label>
        <input
          {...register('title')}
          className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#C4A265]/30 focus:border-[#C4A265] transition-colors"
          placeholder="공지 제목 입력"
        />
        {errors.title && (
          <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>
        )}
      </div>

      {/* 본문 에디터 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          내용 <span className="text-red-500">*</span>
        </label>
        <div className="border border-gray-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-[#C4A265]/30 focus-within:border-[#C4A265]">
          <RichEditor
            content={content}
            onChange={(html) => setValue('content', html, { shouldValidate: true })}
          />
        </div>
        {errors.content && (
          <p className="text-xs text-red-500 mt-1">{errors.content.message}</p>
        )}
      </div>

      {/* 버튼 */}
      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={() => router.push('/admin/notices')}
          className="px-5 py-2.5 text-sm font-medium text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          취소
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-5 py-2.5 text-sm font-medium text-white bg-[#1A1A2E] rounded-lg hover:bg-[#1A1A2E]/90 transition-colors disabled:opacity-50"
        >
          {isSubmitting ? '저장 중...' : notice ? '수정 완료' : '등록'}
        </button>
      </div>
    </form>
  )
}
