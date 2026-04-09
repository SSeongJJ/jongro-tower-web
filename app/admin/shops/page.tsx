'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus, Pencil, Trash2, Search } from 'lucide-react'
import { useAdminShops, useDeleteShop } from '@/lib/hooks/use-shops'
import { useToast } from '@/components/common/toast'
import ConfirmDialog from '@/components/common/confirm-dialog'
import EmptyState from '@/components/common/empty-state'
import { TableSkeleton } from '@/components/common/skeleton'
import { FLOOR_LABELS } from '@/lib/utils'
import type { Floor } from '@/types'

const FLOORS: { value: '' | Floor; label: string }[] = [
  { value: '', label: '전체 층' },
  { value: '2F', label: '2층' },
  { value: '1F', label: '1층' },
  { value: 'B1', label: 'B1층' },
  { value: 'B2', label: 'B2층' },
]

export default function AdminShopsPage() {
  const [search, setSearch] = useState('')
  const [floor, setFloor] = useState<'' | Floor>('')
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const { data: shops, isLoading, isError } = useAdminShops(search || undefined, floor || undefined)
  const deleteMutation = useDeleteShop()
  const { showToast } = useToast()

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      await deleteMutation.mutateAsync(deleteId)
      showToast('매장이 삭제되었습니다')
    } catch (e: unknown) {
      showToast(e instanceof Error ? e.message : '삭제에 실패했습니다', 'error')
    } finally {
      setDeleteId(null)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">매장 관리</h1>
        <Link
          href="/admin/shops/new"
          className="inline-flex items-center gap-2 bg-[#1A1A2E] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#1A1A2E]/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          매장 등록
        </Link>
      </div>

      {/* 검색/필터 */}
      <div className="flex gap-3 mb-4">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="search"
            placeholder="매장명 검색"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#C4A265]/30 focus:border-[#C4A265]"
          />
        </div>
        <select
          value={floor}
          onChange={(e) => setFloor(e.target.value as '' | Floor)}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#C4A265]/30 focus:border-[#C4A265] bg-white"
        >
          {FLOORS.map((f) => (
            <option key={f.value} value={f.value}>{f.label}</option>
          ))}
        </select>
      </div>

      {/* 테이블 */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="p-4">
            <TableSkeleton rows={6} />
          </div>
        ) : isError ? (
          <p className="text-sm text-red-500 p-6 text-center">데이터를 불러오지 못했습니다</p>
        ) : !shops || shops.length === 0 ? (
          <EmptyState message="등록된 매장이 없습니다" />
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">매장명</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">층</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">카테고리</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">추천</th>
                <th className="text-right px-4 py-3 text-gray-500 font-medium">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {shops.map((shop) => (
                <tr key={shop.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900">{shop.name}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {FLOOR_LABELS[shop.floor] ?? shop.floor}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{shop.category}</td>
                  <td className="px-4 py-3">
                    {shop.is_recommended ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#C4A265]/10 text-[#C4A265]">
                        추천
                      </span>
                    ) : (
                      <span className="text-gray-300">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex gap-1">
                      <Link
                        href={`/admin/shops/${shop.id}/edit`}
                        className="p-1.5 text-gray-400 hover:text-[#1A1A2E] hover:bg-gray-100 rounded-lg transition-colors"
                        aria-label="수정"
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => setDeleteId(shop.id)}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        aria-label="삭제"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <ConfirmDialog
        isOpen={deleteId !== null}
        message="해당 매장을 삭제하시겠습니까? 삭제 후에는 복구할 수 없습니다."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        isLoading={deleteMutation.isPending}
      />
    </div>
  )
}
