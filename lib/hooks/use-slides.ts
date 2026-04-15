'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Slide } from '@/types'

// 슬라이드 목록 (관리자)
export function useAdminSlides() {
  return useQuery({
    queryKey: ['admin', 'slides'],
    queryFn: async () => {
      const res = await fetch('/api/admin/slides')
      if (!res.ok) throw new Error('슬라이드 목록을 불러오지 못했습니다')
      const json = await res.json()
      return json.data.slides as Slide[]
    },
    staleTime: 5 * 60 * 1000,
  })
}

// 슬라이드 등록
export function useCreateSlide() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await fetch('/api/admin/slides', {
        method: 'POST',
        body: formData,
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error?.message || '슬라이드 등록에 실패했습니다')
      }
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'slides'] })
    },
  })
}

// 슬라이드 수정
export function useUpdateSlide(id: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await fetch(`/api/admin/slides/${id}`, {
        method: 'PUT',
        body: formData,
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error?.message || '슬라이드 수정에 실패했습니다')
      }
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'slides'] })
    },
  })
}

// 슬라이드 삭제
export function useDeleteSlide() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/admin/slides/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('슬라이드 삭제에 실패했습니다')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'slides'] })
    },
  })
}
