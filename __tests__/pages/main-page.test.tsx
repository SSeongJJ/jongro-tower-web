/**
 * 메인 페이지 통합 테스트 스켈레톤
 * TC: F01-01~08, F02-01~07, F24-01~03
 *
 * 실제 구현 시 @/app/page 경로와 Supabase mock 데이터를 맞춰 수정.
 */

import { render, screen, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import MainPage from '@/app/page';
import { createMockShop, createMockSlider, createMockNotice } from '../setup';

// Supabase 응답 모킹 헬퍼
function mockSupabaseData({
  sliders = [createMockSlider()],
  shops = [createMockShop({ is_recommended: true })],
  notices = [createMockNotice()],
}: {
  sliders?: ReturnType<typeof createMockSlider>[];
  shops?: ReturnType<typeof createMockShop>[];
  notices?: ReturnType<typeof createMockNotice>[];
} = {}) {
  const supabase = vi.mocked(await import('@/lib/supabase/client')).createClient();
  vi.mocked(supabase.from).mockImplementation((table: string) => {
    const base = {
      select: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
    };
    if (table === 'sliders') {
      return { ...base, then: vi.fn().mockResolvedValue({ data: sliders, error: null }) } as any;
    }
    if (table === 'shops') {
      return { ...base, then: vi.fn().mockResolvedValue({ data: shops, error: null }) } as any;
    }
    if (table === 'notices') {
      return { ...base, then: vi.fn().mockResolvedValue({ data: notices, error: null }) } as any;
    }
    return base as any;
  });
}

describe('MainPage', () => {
  beforeEach(() => {
    mockSupabaseData();
  });

  // --------------------------------------------------
  // 슬라이더
  // --------------------------------------------------

  it('F01-01: 슬라이더가 렌더링된다', async () => {
    render(<MainPage />);

    await waitFor(() => {
      expect(screen.getByTestId('hero-slider')).toBeInTheDocument();
    });
  });

  it('F01-06: 슬라이더 데이터 0건 시 플레이스홀더를 표시한다', async () => {
    mockSupabaseData({ sliders: [] });
    render(<MainPage />);

    await waitFor(() => {
      expect(screen.getByTestId('slider-placeholder')).toBeInTheDocument();
    });
  });

  // --------------------------------------------------
  // 추천 매장 섹션
  // --------------------------------------------------

  it('F02-01: 추천 매장 카드가 렌더링된다', async () => {
    const shops = [
      createMockShop({ id: 's1', name: '매장A', is_recommended: true }),
      createMockShop({ id: 's2', name: '매장B', is_recommended: true }),
    ];
    mockSupabaseData({ shops });
    render(<MainPage />);

    await waitFor(() => {
      expect(screen.getByText('매장A')).toBeInTheDocument();
      expect(screen.getByText('매장B')).toBeInTheDocument();
    });
  });

  it('F02-03: 추천 매장 0건 시 EmptyState를 표시한다', async () => {
    mockSupabaseData({ shops: [] });
    render(<MainPage />);

    await waitFor(() => {
      expect(screen.getByText('현재 등록된 매장이 없습니다')).toBeInTheDocument();
    });
  });

  it('F02-06: 추천 매장이 order 오름차순으로 정렬된다', async () => {
    const shops = [
      createMockShop({ id: 's1', name: '두번째', order: 2, is_recommended: true }),
      createMockShop({ id: 's2', name: '첫번째', order: 1, is_recommended: true }),
    ];
    mockSupabaseData({ shops: shops.sort((a, b) => a.order - b.order) });
    render(<MainPage />);

    await waitFor(() => {
      const cards = screen.getAllByTestId('shop-card');
      expect(cards[0]).toHaveTextContent('첫번째');
      expect(cards[1]).toHaveTextContent('두번째');
    });
  });

  // --------------------------------------------------
  // 최신 공지 섹션
  // --------------------------------------------------

  it('F24-01: 최신 공지 3건이 렌더링된다', async () => {
    const notices = [
      createMockNotice({ id: 'n1', title: '공지1' }),
      createMockNotice({ id: 'n2', title: '공지2' }),
      createMockNotice({ id: 'n3', title: '공지3' }),
    ];
    mockSupabaseData({ notices });
    render(<MainPage />);

    await waitFor(() => {
      expect(screen.getByText('공지1')).toBeInTheDocument();
      expect(screen.getByText('공지2')).toBeInTheDocument();
      expect(screen.getByText('공지3')).toBeInTheDocument();
    });
  });

  it('F24-03: 공지 0건 시 최신 공지 섹션이 렌더링되지 않는다', async () => {
    mockSupabaseData({ notices: [] });
    render(<MainPage />);

    await waitFor(() => {
      expect(screen.queryByTestId('latest-notices')).not.toBeInTheDocument();
    });
  });
});
