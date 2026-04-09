'use client'

import { cn } from '@/lib/utils'
import type { Floor } from '@/types'

const FLOORS: { value: Floor | 'all'; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: '2F', label: '2층' },
  { value: '1F', label: '1층' },
  { value: 'B1', label: 'B1층' },
  { value: 'B2', label: 'B2층' },
]

interface FloorTabsProps {
  selected: Floor | 'all'
  onChange: (floor: Floor | 'all') => void
  showAll?: boolean
}

export default function FloorTabs({
  selected,
  onChange,
  showAll = true,
}: FloorTabsProps) {
  const tabs = showAll ? FLOORS : FLOORS.filter((f) => f.value !== 'all')

  return (
    <div className="flex gap-1 bg-gray-100 p-1 rounded-xl overflow-x-auto scrollbar-hide">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value as Floor | 'all')}
          className={cn(
            'flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap',
            selected === tab.value
              ? 'bg-[#C4A265] text-white shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
