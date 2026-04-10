import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Store, Megaphone, Image, Map } from 'lucide-react'

export const metadata: Metadata = {
  title: '대시보드 | 종로타워 CMS',
}

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  const [
    { count: shopCount },
    { count: noticeCount },
    { count: slideCount },
  ] = await Promise.all([
    supabase.from('shops').select('*', { count: 'exact', head: true }).eq('is_deleted', false),
    supabase.from('notices').select('*', { count: 'exact', head: true }),
    supabase.from('slides').select('*', { count: 'exact', head: true }).eq('is_active', true),
  ])

  const cards = [
    {
      label: '등록 매장',
      value: shopCount ?? 0,
      icon: Store,
      href: '/admin/shops',
      color: 'text-blue-600 bg-blue-50',
    },
    {
      label: '공지사항',
      value: noticeCount ?? 0,
      icon: Megaphone,
      href: '/admin/notices',
      color: 'text-green-600 bg-green-50',
    },
    {
      label: '활성 슬라이드',
      value: slideCount ?? 0,
      icon: Image,
      href: '/admin/slides',
      color: 'text-amber-600 bg-amber-50',
    },
    {
      label: '도면 관리',
      value: '바로가기',
      icon: Map,
      href: '/admin/floor-maps',
      color: 'text-purple-600 bg-purple-50',
    },
  ]

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 mb-6">대시보드</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => {
          const Icon = card.icon
          return (
            <Link
              key={card.href}
              href={card.href}
              className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-shadow"
            >
              <div className={`w-10 h-10 rounded-lg ${card.color} flex items-center justify-center mb-3`}>
                <Icon className="w-5 h-5" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              <p className="text-sm text-gray-500 mt-0.5">{card.label}</p>
            </Link>
          )
        })}
      </div>

      <div className="mt-8 bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-700">
        <p className="font-medium mb-1">관리자 안내</p>
        <p>슬라이더, 매장, 공지사항, 도면을 관리할 수 있습니다. 좌측 메뉴를 이용하세요.</p>
      </div>
    </div>
  )
}
