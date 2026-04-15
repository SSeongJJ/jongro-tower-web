'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { FloorMap, Floor } from '@/types'

// 도면 목록 (관리자)
export function useAdminFloorMaps() {
  return useQuery({
    queryKey: ['admin', 'floor-maps'],
    queryFn: async () => {
      const res = await fetch('/api/admin/floor-maps')
      if (!res.ok) throw new Error('도면 목록을 불러오지 못했습니다')
      const json = await res.json()
      return json.data.floorMaps as FloorMap[]
    },
    staleTime: 60 * 60 * 1000, // 1시간
  })
}

// 도면 업로드/교체
export function useUploadFloorMap() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ floor, file }: { floor: Floor; file: File }) => {
      const formData = new FormData()
      formData.append('image', file)

      const res = await fetch(`/api/admin/floor-maps/${floor}`, {
        method: 'PUT',
        body: formData,
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error?.message || '도면 업로드에 실패했습니다')
      }
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'floor-maps'] })
    },
  })
}
