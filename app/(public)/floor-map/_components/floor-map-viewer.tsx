'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import FloorTabs from '@/components/common/floor-tabs'
import EmptyState from '@/components/common/empty-state'
import type { FloorMap, Floor, Shop } from '@/types'

interface FloorMapViewerProps {
  floorMaps: FloorMap[]
  shops: Pick<Shop, 'id' | 'name' | 'floor' | 'category'>[]
}

export default function FloorMapViewer({ floorMaps, shops }: FloorMapViewerProps) {
  const availableFloors = floorMaps.map((m) => m.floor)
  const defaultFloor = availableFloors[0] ?? '1F'
  const [selectedFloor, setSelectedFloor] = useState<Floor | 'all'>(defaultFloor)

  const currentMap = floorMaps.find((m) => m.floor === selectedFloor)
  const currentShops = shops.filter((s) => s.floor === selectedFloor)

  return (
    <div>
      <div className="mb-6">
        <FloorTabs
          selected={selectedFloor}
          onChange={setSelectedFloor}
          showAll={false}
        />
      </div>

      {currentMap ? (
        <div className="space-y-6">
          {/* 도면 이미지 */}
          <div className="relative w-full rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
            <Image
              src={currentMap.image_url}
              alt={`${selectedFloor} 플로어맵`}
              width={1200}
              height={800}
              className="w-full h-auto object-contain"
              priority
            />
          </div>

          {/* 범례 */}
          {currentShops.length > 0 && (
            <div>
              <h2 className="text-base font-semibold text-gray-900 mb-3">
                {selectedFloor} 매장 목록
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {currentShops.map((shop) => (
                  <Link
                    key={shop.id}
                    href={`/floors/${shop.floor}/shops/${shop.id}`}
                    className="flex items-center gap-3 px-4 py-2.5 rounded-lg border border-gray-100 bg-white hover:border-[#C4A265] hover:shadow-sm transition-all"
                  >
                    <span className="text-sm font-medium text-gray-800 flex-1 truncate">
                      {shop.name}
                    </span>
                    <span className="text-xs text-gray-400 shrink-0">{shop.category}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <EmptyState
          message="도면이 등록되지 않았습니다"
          description="관리자에게 문의하세요"
        />
      )}
    </div>
  )
}
