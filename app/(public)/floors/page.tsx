import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import ShopGrid from './_components/shop-grid'
import type { Shop } from '@/types'

export const metadata: Metadata = {
  title: '층별안내',
}

export default async function FloorsPage() {
  const supabase = await createClient()

  const { data: shops } = await supabase
    .from('shops')
    .select('*')
    .eq('is_deleted', false)
    .order('order', { ascending: true })

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">층별안내</h1>
      <ShopGrid shops={(shops ?? []) as Shop[]} />
    </div>
  )
}
