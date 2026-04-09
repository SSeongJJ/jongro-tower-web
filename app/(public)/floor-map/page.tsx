import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import FloorMapViewer from './_components/floor-map-viewer'
import type { FloorMap, Shop } from '@/types'

export const metadata: Metadata = {
  title: '플로어맵',
}

export default async function FloorMapPage() {
  const supabase = await createClient()

  const { data: floorMaps } = await supabase
    .from('floor_maps')
    .select('*')
    .order('floor', { ascending: false })

  const { data: shops } = await supabase
    .from('shops')
    .select('id, name, floor, category')
    .eq('is_deleted', false)
    .order('order', { ascending: true })

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">플로어맵</h1>
      <FloorMapViewer
        floorMaps={(floorMaps ?? []) as FloorMap[]}
        shops={(shops ?? []) as Pick<Shop, 'id' | 'name' | 'floor' | 'category'>[]}
      />
    </div>
  )
}
