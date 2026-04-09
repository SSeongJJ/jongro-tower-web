import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronLeft, Clock, Phone, MapPin } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { FLOOR_LABELS } from '@/lib/utils'
import type { Shop } from '@/types'

interface Props {
  params: Promise<{ floorId: string; shopId: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { shopId } = await params
  const supabase = await createClient()
  const { data } = await supabase
    .from('shops')
    .select('name')
    .eq('id', Number(shopId))
    .single()
  return { title: data?.name ?? '매장 상세' }
}

export default async function ShopDetailPage({ params }: Props) {
  const { floorId, shopId } = await params
  const supabase = await createClient()

  const { data: shop } = await supabase
    .from('shops')
    .select('*')
    .eq('id', Number(shopId))
    .eq('is_deleted', false)
    .single()

  if (!shop) notFound()

  const shopData = shop as Shop

  return (
    <div className="max-w-[800px] mx-auto px-4 py-8">
      {/* 뒤로가기 */}
      <Link
        href={`/floors?floor=${floorId}`}
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-[#C4A265] transition-colors mb-6"
      >
        <ChevronLeft className="w-4 h-4" />
        층별안내로 돌아가기
      </Link>

      <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
        {/* 매장 이미지 */}
        <div className="relative aspect-[16/9] bg-gray-100">
          <Image
            src={shopData.image_url}
            alt={shopData.name}
            fill
            className="object-cover"
            sizes="(max-width: 800px) 100vw, 800px"
            priority
          />
        </div>

        <div className="p-6 space-y-4">
          {/* 헤더 */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-gray-900">{shopData.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-[#C4A265] font-medium">
                  {FLOOR_LABELS[shopData.floor] ?? shopData.floor}
                </span>
                <span className="text-gray-300">·</span>
                <span className="text-sm text-gray-500">{shopData.category}</span>
              </div>
            </div>
          </div>

          {/* 상세 정보 */}
          <div className="border-t border-gray-100 pt-4 space-y-3">
            {shopData.hours && (
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">운영시간</p>
                  <p className="text-sm text-gray-700">{shopData.hours}</p>
                </div>
              </div>
            )}
            {shopData.phone && (
              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">전화번호</p>
                  <a
                    href={`tel:${shopData.phone}`}
                    className="text-sm text-[#C4A265] hover:underline"
                  >
                    {shopData.phone}
                  </a>
                </div>
              </div>
            )}
            {shopData.location_desc && (
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">위치</p>
                  <p className="text-sm text-gray-700">{shopData.location_desc}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
