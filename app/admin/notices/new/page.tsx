import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import NoticeForm from '../_components/notice-form'

export const metadata: Metadata = {
  title: '공지 등록 | 종로타워 CMS',
}

export default function NewNoticePage() {
  return (
    <div>
      <Link
        href="/admin/notices"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-[#1A1A2E] transition-colors mb-5"
      >
        <ChevronLeft className="w-4 h-4" />
        공지 관리
      </Link>
      <h1 className="text-xl font-bold text-gray-900 mb-6">공지 등록</h1>
      <NoticeForm />
    </div>
  )
}
