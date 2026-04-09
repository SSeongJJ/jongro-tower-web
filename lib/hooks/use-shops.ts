'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Shop, Floor } from '@/types'

// 매장 목록 조회 (관리자용)
export function useAdminShops(search?: string, floor?: Floor) {
  return useQuery({
    queryKey: ['admin', 'shops', { search, floor }],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (search) params.set('search', search)
      if (floor) params.set('floor', floor)

      const res = await fetch(`/api/admin/shops?${params}`)
      if (!res.ok) throw new Error('매장 목록을 불러오지 못했습니다')
      const json = await res.json()
      return json.data as Shop[]
    },
    staleTime: 5 * 60 * 1000,
  })
}

// 매장 단건 조회 (관리자용)
export function useAdminShop(id: number) {
  return useQuery({
    queryKey: ['admin', 'shops', id],
    queryFn: async () => {
      const res = await fetch(`/api/admin/shops/${id}`)
      if (!res.ok) throw new Error('매장 정보를 불러오지 못했습니다')
      const json = await res.json()
      return json.data as Shop
    },
    enabled: !!id,
  })
}

// 매장 등록
export function useCreateShop() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await fetch('/api/admin/shops', {
        method: 'POST',
        body: formData,
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error?.message || '매장 등록에 실패했습니다')
      }
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'shops'] })
    },
  })
}

// 매장 수정
export function useUpdateShop(id: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await fetch(`/api/admin/shops/${id}`, {
        method: 'PUT',
        body: formData,
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error?.message || '매장 수정에 실패했습니다')
      }
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'shops'] })
    },
  })
}

// 매장 삭제
export function useDeleteShop() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/admin/shops/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('매장 삭제에 실패했습니다')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'shops'] })
    },
  })
}
