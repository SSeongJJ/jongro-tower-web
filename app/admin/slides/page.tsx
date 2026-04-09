'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { Plus, Trash2, GripVertical, Eye, EyeOff } from 'lucide-react'
import { useAdminSlides, useCreateSlide, useDeleteSlide, useUpdateSlide } from '@/lib/hooks/use-slides'
import { useToast } from '@/components/common/toast'
import ConfirmDialog from '@/components/common/confirm-dialog'
import EmptyState from '@/components/common/empty-state'
import { TableSkeleton } from '@/components/common/skeleton'
import type { Slide } from '@/types'

export default function AdminSlidesPage() {
  const { data: slides, isLoading } = useAdminSlides()
  const createMutation = useCreateSlide()
  const deleteMutation = useDeleteSlide()
  const { showToast } = useToast()
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const addInputRef = useRef<HTMLInputElement>(null)

  const handleAdd = async (file: File) => {
    const altText = window.prompt('슬라이드 설명을 입력하세요 (alt text)') ?? ''
    const formData = new FormData()
    formData.append('image', file)
    formData.append('alt_text', altText)
    formData.append('order', String((slides?.length ?? 0) + 1))
    formData.append('is_active', 'true')
    try {
      await createMutation.mutateAsync(formData)
      showToast('슬라이드가 등록되었습니다')
    } catch (e: unknown) {
      showToast(e instanceof Error ? e.message : '등록에 실패했습니다', 'error')
    }
    if (addInputRef.current) addInputRef.current.value = ''
  }

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      await deleteMutation.mutateAsync(deleteId)
      showToast('슬라이드가 삭제되었습니다')
    } catch {
      showToast('삭제에 실패했습니다', 'error')
    } finally {
      setDeleteId(null)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">슬라이더 관리</h1>
        <button
          type="button"
          onClick={() => addInputRef.current?.click()}
          disabled={createMutation.isPending}
          className="inline-flex items-center gap-2 bg-[#1A1A2E] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#1A1A2E]/90 transition-colors disabled:opacity-50"
        >
          <Plus className="w-4 h-4" />
          슬라이드 추가
        </button>
        <input
          ref={addInputRef}
          type="file"
          accept="image/jpeg,image/png"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) handleAdd(file)
          }}
          className="hidden"
        />
      </div>

      {isLoading ? (
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <TableSkeleton rows={3} />
        </div>
      ) : !slides || slides.length === 0 ? (
        <EmptyState
          message="등록된 슬라이드가 없습니다"
          description="슬라이드 추가 버튼으로 이미지를 등록하세요"
        />
      ) : (
        <div className="space-y-3">
          {slides.map((slide) => (
            <SlideItem
              key={slide.id}
              slide={slide}
              onDelete={() => setDeleteId(slide.id)}
            />
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={deleteId !== null}
        message="해당 슬라이드를 삭제하시겠습니까?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        isLoading={deleteMutation.isPending}
      />
    </div>
  )
}

function SlideItem({
  slide,
  onDelete,
}: {
  slide: Slide
  onDelete: () => void
}) {
  const updateMutation = useUpdateSlide(slide.id)
  const { showToast } = useToast()

  const toggleActive = async () => {
    const formData = new FormData()
    formData.append('is_active', String(!slide.is_active))
    try {
      await updateMutation.mutateAsync(formData)
      showToast(slide.is_active ? '비활성화되었습니다' : '활성화되었습니다')
    } catch {
      showToast('변경에 실패했습니다', 'error')
    }
  }

  return (
    <div className="flex items-center gap-4 bg-white rounded-xl border border-gray-100 p-3">
      <GripVertical className="w-4 h-4 text-gray-300 shrink-0" />

      <div className="relative w-20 h-14 rounded-lg overflow-hidden bg-gray-100 shrink-0">
        <Image src={slide.image_url} alt={slide.alt_text} fill className="object-cover" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">
          {slide.alt_text || '(설명 없음)'}
        </p>
        <p className="text-xs text-gray-400 mt-0.5">순서: {slide.order}</p>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <button
          type="button"
          onClick={toggleActive}
          className={`p-1.5 rounded-lg transition-colors ${
            slide.is_active
              ? 'text-green-500 hover:bg-green-50'
              : 'text-gray-400 hover:bg-gray-100'
          }`}
          aria-label={slide.is_active ? '비활성화' : '활성화'}
        >
          {slide.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          aria-label="삭제"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
