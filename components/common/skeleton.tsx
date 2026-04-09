import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-gray-200', className)}
    />
  )
}

// 매장 카드 스켈레톤
export function ShopCardSkeleton() {
  return (
    <div className="rounded-xl overflow-hidden border border-gray-100">
      <Skeleton className="aspect-square w-full" />
      <div className="p-4 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  )
}

// 공지 행 스켈레톤
export function NoticeRowSkeleton() {
  return (
    <div className="flex items-center gap-4 py-4 border-b border-gray-100">
      <Skeleton className="h-4 w-8" />
      <Skeleton className="h-4 flex-1" />
      <Skeleton className="h-4 w-24" />
    </div>
  )
}

// 테이블 스켈레톤
export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-0">
      {Array.from({ length: rows }).map((_, i) => (
        <NoticeRowSkeleton key={i} />
      ))}
    </div>
  )
}
