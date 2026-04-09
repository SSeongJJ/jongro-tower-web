import Image from 'next/image'
import Link from 'next/link'
import type { Shop } from '@/types'
import { FLOOR_LABELS } from '@/lib/utils'

interface ShopCardProps {
  shop: Shop
  variant?: 'default' | 'compact'
}

export default function ShopCard({ shop, variant = 'default' }: ShopCardProps) {
  return (
    <Link
      href={`/floors/${shop.floor}/shops/${shop.id}`}
      className="group block rounded-xl overflow-hidden border border-gray-100 bg-white hover:shadow-md transition-shadow"
    >
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <Image
          src={shop.image_url}
          alt={shop.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        {/* 층 배지 */}
        <span className="absolute top-2 left-2 bg-[#1A1A2E]/80 text-white text-xs font-medium px-2 py-0.5 rounded-full">
          {FLOOR_LABELS[shop.floor] ?? shop.floor}
        </span>
      </div>
      <div className="p-3">
        <p className="text-sm font-semibold text-gray-900 truncate">{shop.name}</p>
        {variant === 'default' && (
          <p className="text-xs text-gray-500 mt-0.5">{shop.category}</p>
        )}
      </div>
    </Link>
  )
}
