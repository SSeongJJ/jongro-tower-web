import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import NoticeForm from '../../_components/notice-form'
import type { Notice } from '@/types'

interface Props {
  params: Promise<{ id: string }>
}

export const metadata: Metadata = {
  title: '공지 수정 | 종로타워 CMS',
}

export default async function EditNoticePage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const { data: notice } = await supabase
    .from('notices')
    .select('*')
    .eq('id', Number(id))
    .single()

  if (!notice) notFound()

  return (
    <div>
      <Link
        href="/admin/notices"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-[#1A1A2E] transition-colors mb-5"
      >
        <ChevronLeft className="w-4 h-4" />
        공지 관리
      </Link>
      <h1 className="text-xl font-bold text-gray-900 mb-6">공지 수정</h1>
      <NoticeForm notice={notice as Notice} />
    </div>
  )
}
