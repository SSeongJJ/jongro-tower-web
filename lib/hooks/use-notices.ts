'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Notice, NoticeListItem, NoticeFormValues } from '@/types'

// 공지 목록 (관리자)
export function useAdminNotices(search?: string) {
  return useQuery({
    queryKey: ['admin', 'notices', { search }],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (search) params.set('search', search)

      const res = await fetch(`/api/admin/notices?${params}`)
      if (!res.ok) throw new Error('공지 목록을 불러오지 못했습니다')
      const json = await res.json()
      return json.data as NoticeListItem[]
    },
    staleTime: 5 * 60 * 1000,
  })
}

// 공지 단건 (관리자)
export function useAdminNotice(id: number) {
  return useQuery({
    queryKey: ['admin', 'notices', id],
    queryFn: async () => {
      const res = await fetch(`/api/admin/notices/${id}`)
      if (!res.ok) throw new Error('공지를 불러오지 못했습니다')
      const json = await res.json()
      return json.data as Notice
    },
    enabled: !!id,
  })
}

// 공지 등록
export function useCreateNotice() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (values: NoticeFormValues) => {
      const res = await fetch('/api/admin/notices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error?.message || '공지 등록에 실패했습니다')
      }
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'notices'] })
    },
  })
}

// 공지 수정
export function useUpdateNotice(id: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (values: NoticeFormValues) => {
      const res = await fetch(`/api/admin/notices/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error?.message || '공지 수정에 실패했습니다')
      }
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'notices'] })
    },
  })
}

// 공지 삭제
export function useDeleteNotice() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/admin/notices/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('공지 삭제에 실패했습니다')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'notices'] })
    },
  })
}
