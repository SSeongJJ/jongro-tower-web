import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import ShopCard from '@/components/common/shop-card'
import { formatDate } from '@/lib/utils'
import HeroSlider from './_components/hero-slider'
import type { Shop, Notice, Slide } from '@/types'

export const metadata: Metadata = {
  title: '종로타워 리테일',
}

export default async function MainPage() {
  const supabase = await createClient()

  // 슬라이드 조회
  const { data: slides } = await supabase
    .from('slides')
    .select('*')
    .eq('is_active', true)
    .order('order', { ascending: true })

  // 추천 매장 조회
  const { data: shops } = await supabase
    .from('shops')
    .select('*')
    .eq('is_recommended', true)
    .eq('is_deleted', false)
    .order('order', { ascending: true })
    .limit(4)

  // 최신 공지 3건
  const { data: notices } = await supabase
    .from('notices')
    .select('id, title, created_at')
    .order('created_at', { ascending: false })
    .limit(3)

  return (
    <div>
      {/* S01-1: 히어로 슬라이더 */}
      <HeroSlider slides={(slides ?? []) as Slide[]} />

      {/* S01-2: 추천 매장 */}
      <section className="max-w-[1200px] mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">추천 매장</h2>
          <Link
            href="/floors"
            className="text-sm text-[#C4A265] hover:underline font-medium"
          >
            전체보기
          </Link>
        </div>
        {shops && shops.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {shops.map((shop) => (
              <ShopCard key={shop.id} shop={shop as Shop} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400 py-8 text-center">
            등록된 추천 매장이 없습니다
          </p>
        )}
      </section>

      {/* S01-3: 최신 공지 */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">공지사항</h2>
            <Link
              href="/notices"
              className="text-sm text-[#C4A265] hover:underline font-medium"
            >
              전체보기
            </Link>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-100">
            {notices && notices.length > 0 ? (
              (notices as Pick<Notice, 'id' | 'title' | 'created_at'>[]).map((notice) => (
                <Link
                  key={notice.id}
                  href={`/notices/${notice.id}`}
                  className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
                >
                  <span className="text-sm font-medium text-gray-800 truncate flex-1 mr-4">
                    {notice.title}
                  </span>
                  <span className="text-xs text-gray-400 shrink-0">
                    {formatDate(notice.created_at)}
                  </span>
                </Link>
              ))
            ) : (
              <p className="text-sm text-gray-400 py-8 text-center">
                등록된 공지사항이 없습니다
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
