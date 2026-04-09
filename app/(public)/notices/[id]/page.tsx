import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { formatDate } from '@/lib/utils'
import type { Notice } from '@/types'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase
    .from('notices')
    .select('title')
    .eq('id', Number(id))
    .single()
  return { title: data?.title ?? '공지사항' }
}

export default async function NoticeDetailPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const { data: notice } = await supabase
    .from('notices')
    .select('*')
    .eq('id', Number(id))
    .single()

  if (!notice) notFound()

  const noticeData = notice as Notice

  return (
    <div className="max-w-[800px] mx-auto px-4 py-8">
      <Link
        href="/notices"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-[#C4A265] transition-colors mb-6"
      >
        <ChevronLeft className="w-4 h-4" />
        목록으로
      </Link>

      <article className="bg-white rounded-xl border border-gray-100 p-6 md:p-8">
        <header className="border-b border-gray-100 pb-4 mb-6">
          <h1 className="text-xl font-bold text-gray-900 mb-2">
            {noticeData.title}
          </h1>
          <p className="text-sm text-gray-400">
            {formatDate(noticeData.created_at)}
          </p>
        </header>

        {/* 리치텍스트 HTML 렌더링 */}
        <div
          className="prose prose-sm max-w-none text-gray-700 [&_img]:rounded-lg [&_a]:text-[#C4A265]"
          dangerouslySetInnerHTML={{ __html: noticeData.content }}
        />
      </article>
    </div>
  )
}
