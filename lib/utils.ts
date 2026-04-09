import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

export const FLOORS = ['2F', '1F', 'B1', 'B2'] as const

export const CATEGORIES = ['식음료', '패션', '서비스', '편의시설', '기타'] as const

export const MAX_IMAGE_SIZE = 5 * 1024 * 1024 // 5MB

export const FLOOR_LABELS: Record<string, string> = {
  '2F': '2층',
  '1F': '1층',
  B1: 'B1층',
  B2: 'B2층',
}
