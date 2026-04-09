import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '페이지를 찾을 수 없습니다',
}

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 text-center">
      <p className="text-7xl font-bold text-[#C4A265] mb-4">404</p>
      <h1 className="text-xl font-semibold text-gray-900 mb-2">
        페이지를 찾을 수 없습니다
      </h1>
      <p className="text-sm text-gray-500 mb-8">
        요청하신 페이지가 존재하지 않거나 이동되었습니다.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 bg-[#1A1A2E] text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-[#1A1A2E]/90 transition-colors"
      >
        메인으로 이동
      </Link>
    </div>
  )
}
