'use client'

import { useState } from 'react'
import ShopCard from '@/components/common/shop-card'
import FloorTabs from '@/components/common/floor-tabs'
import EmptyState from '@/components/common/empty-state'
import type { Shop, Floor } from '@/types'

interface ShopGridProps {
  shops: Shop[]
}

export default function ShopGrid({ shops }: ShopGridProps) {
  const [selectedFloor, setSelectedFloor] = useState<Floor | 'all'>('all')

  const filtered =
    selectedFloor === 'all'
      ? shops
      : shops.filter((s) => s.floor === selectedFloor)

  return (
    <div>
      <div className="mb-6">
        <FloorTabs selected={selectedFloor} onChange={setSelectedFloor} />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          message="등록된 매장이 없습니다"
          description={
            selectedFloor === 'all'
              ? '아직 등록된 매장이 없습니다'
              : `${selectedFloor} 매장이 없습니다`
          }
        />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((shop) => (
            <ShopCard key={shop.id} shop={shop} />
          ))}
        </div>
      )}
    </div>
  )
}
