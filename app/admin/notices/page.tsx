'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus, Pencil, Trash2, Search } from 'lucide-react'
import { useAdminNotices, useDeleteNotice } from '@/lib/hooks/use-notices'
import { useToast } from '@/components/common/toast'
import ConfirmDialog from '@/components/common/confirm-dialog'
import EmptyState from '@/components/common/empty-state'
import { TableSkeleton } from '@/components/common/skeleton'
import { formatDate } from '@/lib/utils'

export default function AdminNoticesPage() {
  const [search, setSearch] = useState('')
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const { data: notices, isLoading, isError } = useAdminNotices(search || undefined)
  const deleteMutation = useDeleteNotice()
  const { showToast } = useToast()

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      await deleteMutation.mutateAsync(deleteId)
      showToast('공지가 삭제되었습니다')
    } catch (e: unknown) {
      showToast(e instanceof Error ? e.message : '삭제에 실패했습니다', 'error')
    } finally {
      setDeleteId(null)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">공지 관리</h1>
        <Link
          href="/admin/notices/new"
          className="inline-flex items-center gap-2 bg-[#1A1A2E] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#1A1A2E]/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          공지 등록
        </Link>
      </div>

      {/* 검색 */}
      <div className="mb-4">
        <div className="relative max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="search"
            placeholder="제목 검색"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#C4A265]/30 focus:border-[#C4A265]"
          />
        </div>
      </div>

      {/* 테이블 */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="p-4">
            <TableSkeleton rows={6} />
          </div>
        ) : isError ? (
          <p className="text-sm text-red-500 p-6 text-center">데이터를 불러오지 못했습니다</p>
        ) : !notices || notices.length === 0 ? (
          <EmptyState message="등록된 공지사항이 없습니다" />
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">제목</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium w-28">등록일</th>
                <th className="text-right px-4 py-3 text-gray-500 font-medium w-20">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {notices.map((notice) => (
                <tr key={notice.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900">{notice.title}</td>
                  <td className="px-4 py-3 text-gray-500">{formatDate(notice.created_at)}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex gap-1">
                      <Link
                        href={`/admin/notices/${notice.id}/edit`}
                        className="p-1.5 text-gray-400 hover:text-[#1A1A2E] hover:bg-gray-100 rounded-lg transition-colors"
                        aria-label="수정"
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => setDeleteId(notice.id)}
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
        message="해당 공지를 삭제하시겠습니까?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        isLoading={deleteMutation.isPending}
      />
    </div>
  )
}
