// 종로타워 리테일 소개 웹사이트 — 공통 타입 정의

export type Floor = '2F' | '1F' | 'B1' | 'B2'

export type ShopCategory = '식음료' | '패션' | '서비스' | '편의시설' | '기타'

export interface Shop {
  id: number
  name: string
  floor: Floor
  category: ShopCategory
  image_url: string
  hours: string | null
  phone: string | null
  location_desc: string | null
  order: number
  is_recommended: boolean
  is_deleted: boolean
  created_at: string
}

export interface Notice {
  id: number
  title: string
  content: string
  created_at: string
}

export interface NoticeListItem {
  id: number
  title: string
  created_at: string
}

export interface FloorMap {
  floor: Floor
  image_url: string
  updated_at: string
}

export interface Slide {
  id: number
  image_url: string
  alt_text: string
  link_url: string | null
  order: number
  is_active: boolean
}

// API 응답 래퍼
export interface ApiResponse<T> {
  data: T
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
  }
}

export interface ApiError {
  error: {
    code: string
    message: string
  }
}

// 폼 스키마용 타입
export interface ShopFormValues {
  name: string
  floor: Floor
  category: ShopCategory
  hours: string
  phone: string
  location_desc: string
  order: number
  is_recommended: boolean
  image?: File | null
}

export interface NoticeFormValues {
  title: string
  content: string
}

export interface PasswordFormValues {
  current_password: string
  new_password: string
  confirm_password: string
}

export interface LoginFormValues {
  email: string
  password: string
}
