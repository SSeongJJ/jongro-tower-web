/**
 * Vitest + @testing-library/react 공용 설정
 * 종로타워 리테일 웹사이트 — Phase 5 QA
 *
 * 적용 스택: Next.js 14 (App Router), Supabase, TypeScript
 */

import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeAll, vi } from 'vitest';

// 각 테스트 후 DOM 정리
afterEach(() => {
  cleanup();
});

// -------------------------------------------------------
// Next.js App Router 모킹
// -------------------------------------------------------
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    prefetch: vi.fn(),
    pathname: '/',
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
  useParams: () => ({}),
}));

vi.mock('next/image', () => ({
  default: ({
    src,
    alt,
    ...props
  }: {
    src: string;
    alt: string;
    [key: string]: unknown;
  }) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img src={src} alt={alt} {...props} />;
  },
}));

vi.mock('next/link', () => ({
  default: ({
    href,
    children,
    ...props
  }: {
    href: string;
    children: React.ReactNode;
    [key: string]: unknown;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

// -------------------------------------------------------
// Supabase 클라이언트 모킹
// -------------------------------------------------------
vi.mock('@/lib/supabase/client', () => ({
  createClient: vi.fn(() => ({
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: null }),
    })),
    auth: {
      signInWithPassword: vi.fn(),
      signOut: vi.fn(),
      getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
      onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } })),
    },
    storage: {
      from: vi.fn(() => ({
        upload: vi.fn().mockResolvedValue({ data: { path: 'test/image.jpg' }, error: null }),
        getPublicUrl: vi.fn(() => ({ data: { publicUrl: 'https://example.com/image.jpg' } })),
        remove: vi.fn().mockResolvedValue({ data: null, error: null }),
      })),
    },
  })),
}));

// -------------------------------------------------------
// 카카오맵 API 모킹 (window.kakao)
// -------------------------------------------------------
beforeAll(() => {
  Object.defineProperty(window, 'kakao', {
    value: {
      maps: {
        load: vi.fn((callback: () => void) => callback()),
        Map: vi.fn(() => ({
          setCenter: vi.fn(),
          setLevel: vi.fn(),
        })),
        LatLng: vi.fn((lat: number, lng: number) => ({ lat, lng })),
        Marker: vi.fn(() => ({
          setMap: vi.fn(),
          addListener: vi.fn(),
        })),
        InfoWindow: vi.fn(() => ({
          open: vi.fn(),
          close: vi.fn(),
        })),
        event: {
          addListener: vi.fn(),
        },
      },
    },
    writable: true,
  });
});

// -------------------------------------------------------
// IntersectionObserver 모킹 (슬라이더, lazy 이미지 등)
// -------------------------------------------------------
beforeAll(() => {
  const mockIntersectionObserver = vi.fn();
  mockIntersectionObserver.mockReturnValue({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  });
  window.IntersectionObserver = mockIntersectionObserver;
});

// -------------------------------------------------------
// matchMedia 모킹 (반응형 훅 등)
// -------------------------------------------------------
beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
});

// -------------------------------------------------------
// 공용 테스트 픽스처 헬퍼
// -------------------------------------------------------

/** 매장 목 데이터 생성 */
export function createMockShop(overrides = {}) {
  return {
    id: 'shop-001',
    name: '테스트 매장',
    floor: '2F',
    category: 'FOOD',
    phone: '02-1234-5678',
    hours: '10:00 - 22:00',
    description: '테스트 매장 설명입니다.',
    image_url: 'https://example.com/shop.jpg',
    is_recommended: false,
    order: 1,
    created_at: '2024-01-01T00:00:00Z',
    ...overrides,
  };
}

/** 공지 목 데이터 생성 */
export function createMockNotice(overrides = {}) {
  return {
    id: 'notice-001',
    title: '테스트 공지사항',
    content: '<p>공지사항 본문입니다.</p>',
    is_pinned: false,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    ...overrides,
  };
}

/** 슬라이더 목 데이터 생성 */
export function createMockSlider(overrides = {}) {
  return {
    id: 'slider-001',
    image_url: 'https://example.com/slide.jpg',
    alt_text: '슬라이더 이미지',
    order: 1,
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    ...overrides,
  };
}

/** 도면 목 데이터 생성 */
export function createMockFloorMap(overrides = {}) {
  return {
    id: 'floormap-001',
    floor: '1F',
    image_url: 'https://example.com/floor1.jpg',
    updated_at: '2024-01-01T00:00:00Z',
    ...overrides,
  };
}
