import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import ShopForm from '../../_components/shop-form'
import type { Shop } from '@/types'

interface Props {
  params: Promise<{ id: string }>
}

export const metadata: Metadata = {
  title: '매장 수정 | 종로타워 CMS',
}

export default async function EditShopPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const { data: shop } = await supabase
    .from('shops')
    .select('*')
    .eq('id', Number(id))
    .single()

  if (!shop) notFound()

  return (
    <div>
      <Link
        href="/admin/shops"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-[#1A1A2E] transition-colors mb-5"
      >
        <ChevronLeft className="w-4 h-4" />
        매장 관리
      </Link>
      <h1 className="text-xl font-bold text-gray-900 mb-6">매장 수정</h1>
      <ShopForm shop={shop as Shop} />
    </div>
  )
}
