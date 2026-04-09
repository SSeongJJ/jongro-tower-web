'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { Upload } from 'lucide-react'
import { useAdminFloorMaps, useUploadFloorMap } from '@/lib/hooks/use-floor-maps'
import { useToast } from '@/components/common/toast'
import { FLOORS, FLOOR_LABELS, MAX_IMAGE_SIZE } from '@/lib/utils'
import { TableSkeleton } from '@/components/common/skeleton'
import type { Floor } from '@/types'

const FLOOR_MAP_MAX = 10 * 1024 * 1024 // 10MB

export default function FloorMapsPage() {
  const { data: floorMaps, isLoading } = useAdminFloorMaps()
  const uploadMutation = useUploadFloorMap()
  const { showToast } = useToast()
  const [uploading, setUploading] = useState<Floor | null>(null)

  const handleUpload = async (floor: Floor, file: File) => {
    if (file.size > FLOOR_MAP_MAX) {
      showToast('파일 크기는 10MB 이하여야 합니다', 'error')
      return
    }
    setUploading(floor)
    try {
      await uploadMutation.mutateAsync({ floor, file })
      showToast(`${FLOOR_LABELS[floor]} 도면이 업로드되었습니다`)
    } catch (e: unknown) {
      showToast(e instanceof Error ? e.message : '업로드에 실패했습니다', 'error')
    } finally {
      setUploading(null)
    }
  }

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 mb-6">도면 관리</h1>

      {isLoading ? (
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <TableSkeleton rows={4} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {FLOORS.map((floor) => {
            const map = floorMaps?.find((m) => m.floor === floor)
            const isUploading = uploading === floor

            return (
              <FloorMapCard
                key={floor}
                floor={floor}
                imageUrl={map?.image_url}
                updatedAt={map?.updated_at}
                isUploading={isUploading}
                onUpload={handleUpload}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}

function FloorMapCard({
  floor,
  imageUrl,
  updatedAt,
  isUploading,
  onUpload,
}: {
  floor: Floor
  imageUrl?: string
  updatedAt?: string
  isUploading: boolean
  onUpload: (floor: Floor, file: File) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) onUpload(floor, file)
    e.target.value = ''
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <div className="p-4 border-b border-gray-50 flex items-center justify-between">
        <div>
          <p className="font-semibold text-gray-900">{FLOOR_LABELS[floor]} 도면</p>
          {updatedAt && (
            <p className="text-xs text-gray-400 mt-0.5">
              최종 업데이트: {new Date(updatedAt).toLocaleDateString('ko-KR')}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-[#1A1A2E] border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          <Upload className="w-3.5 h-3.5" />
          {isUploading ? '업로드 중...' : imageUrl ? '교체' : '업로드'}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png"
          onChange={handleChange}
          className="hidden"
        />
      </div>

      <div className="p-4">
        {imageUrl ? (
          <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-gray-100">
            <Image
              src={imageUrl}
              alt={`${FLOOR_LABELS[floor]} 도면`}
              fill
              className="object-contain"
            />
          </div>
        ) : (
          <div
            className="aspect-[4/3] rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center cursor-pointer hover:border-[#C4A265] transition-colors"
            onClick={() => inputRef.current?.click()}
          >
            <div className="text-center text-gray-400">
              <Upload className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm">도면 이미지 업로드</p>
              <p className="text-xs mt-0.5">JPG/PNG, 최대 10MB</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
