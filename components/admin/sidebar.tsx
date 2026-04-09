'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  Store,
  Megaphone,
  Map,
  Lock,
  Image,
  LogOut,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'

const NAV_ITEMS = [
  { href: '/admin', label: '대시보드', icon: LayoutDashboard, exact: true },
  { href: '/admin/shops', label: '매장 관리', icon: Store },
  { href: '/admin/notices', label: '공지 관리', icon: Megaphone },
  { href: '/admin/floor-maps', label: '도면 관리', icon: Map },
  { href: '/admin/slides', label: '슬라이더 관리', icon: Image },
  { href: '/admin/password', label: '비밀번호 변경', icon: Lock },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href
    return pathname.startsWith(href)
  }

  return (
    <aside className="w-60 bg-[#1A1A2E] min-h-screen flex flex-col">
      {/* 로고 영역 */}
      <div className="p-6 border-b border-white/10">
        <Link href="/admin" className="block">
          <p className="text-[#C4A265] font-bold text-lg">종로타워</p>
          <p className="text-gray-400 text-xs mt-0.5">관리자 CMS</p>
        </Link>
      </div>

      {/* 네비게이션 */}
      <nav className="flex-1 p-3 space-y-0.5">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href, item.exact)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                active
                  ? 'bg-[#C4A265]/20 text-[#C4A265]'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* 로그아웃 */}
      <div className="p-3 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          로그아웃
        </button>
      </div>
    </aside>
  )
}
