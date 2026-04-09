'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu } from 'lucide-react'
import { cn } from '@/lib/utils'
import MobileDrawer from './mobile-drawer'

const NAV_ITEMS = [
  { href: '/floors', label: '층별안내' },
  { href: '/floor-map', label: '플로어맵' },
  { href: '/location', label: '오시는길' },
  { href: '/parking', label: '주차안내' },
  { href: '/notices', label: '공지사항' },
]

export default function Header() {
  const pathname = usePathname()
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-30 bg-[#1A1A2E] shadow-md">
        <div className="max-w-[1200px] mx-auto px-4 h-16 flex items-center justify-between">
          {/* 로고 */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-[#C4A265] font-bold text-xl tracking-tight">
              종로타워
            </span>
          </Link>

          {/* PC 네비게이션 */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'px-4 py-2 text-sm font-medium rounded-lg transition-colors',
                  pathname.startsWith(item.href)
                    ? 'text-[#C4A265]'
                    : 'text-gray-300 hover:text-white'
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* 모바일 햄버거 */}
          <button
            className="md:hidden text-gray-300 hover:text-white transition-colors p-2"
            onClick={() => setDrawerOpen(true)}
            aria-label="메뉴 열기"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      <MobileDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  )
}
