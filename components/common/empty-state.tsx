import { PackageOpen } from 'lucide-react'

interface EmptyStateProps {
  message?: string
  description?: string
  action?: React.ReactNode
}

export default function EmptyState({
  message = '데이터가 없습니다',
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <PackageOpen className="w-12 h-12 text-gray-300 mb-4" />
      <p className="text-base font-medium text-gray-500">{message}</p>
      {description && (
        <p className="text-sm text-gray-400 mt-1">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
