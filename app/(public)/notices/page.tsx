import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import Pagination from '@/components/common/pagination'
import EmptyState from '@/components/common/empty-state'
import { formatDate } from '@/lib/utils'
import type { NoticeListItem } from '@/types'

export const metadata: Metadata = {
  title: '공지사항',
}

const LIMIT = 10

interface Props {
  searchParams: Promise<{ page?: string }>
}

export default async function NoticesPage({ searchParams }: Props) {
  const { page } = await searchParams
  const currentPage = Math.max(1, Number(page ?? 1))
  const supabase = await createClient()

  // 전체 개수 조회
  const { count } = await supabase
    .from('notices')
    .select('*', { count: 'exact', head: true })

  const total = count ?? 0
  const totalPages = Math.ceil(total / LIMIT)
  const offset = (currentPage - 1) * LIMIT

  const { data: notices } = await supabase
    .from('notices')
    .select('id, title, created_at')
    .order('created_at', { ascending: false })
    .range(offset, offset + LIMIT - 1)

  return (
    <div className="max-w-[800px] mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">공지사항</h1>

      {notices && notices.length > 0 ? (
        <>
          <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-100">
            {(notices as NoticeListItem[]).map((notice, idx) => (
              <Link
                key={notice.id}
                href={`/notices/${notice.id}`}
                className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors"
              >
                <span className="text-sm text-gray-400 w-10 shrink-0 text-right">
                  {total - offset - idx}
                </span>
                <span className="text-sm font-medium text-gray-800 flex-1 truncate">
                  {notice.title}
                </span>
                <span className="text-xs text-gray-400 shrink-0">
                  {formatDate(notice.created_at)}
                </span>
              </Link>
            ))}
          </div>

          <ClientPagination currentPage={currentPage} totalPages={totalPages} />
        </>
      ) : (
        <EmptyState message="등록된 공지사항이 없습니다" />
      )}
    </div>
  )
}

// 클라이언트 페이지네이션 (URL 파라미터 변경용)
function ClientPagination({
  currentPage,
  totalPages,
}: {
  currentPage: number
  totalPages: number
}) {
  'use client'
  // 서버 컴포넌트에서 직접 Link를 생성하는 방식으로 처리
  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-center gap-1 mt-8">
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <Link
          key={page}
          href={`/notices?page=${page}`}
          className={`w-9 h-9 rounded-lg text-sm font-medium flex items-center justify-center transition-colors ${
            page === currentPage
              ? 'bg-[#C4A265] text-white'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          {page}
        </Link>
      ))}
    </div>
  )
}
