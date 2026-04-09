/**
 * 층별안내 페이지 통합 테스트 스켈레톤
 * TC: F05-01~07, F06-01~05
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import FloorGuidePage from '@/app/floor-guide/page';
import ShopDetailPage from '@/app/floor-guide/[id]/page';
import { createMockShop } from '../setup';

const MOCK_SHOPS = [
  createMockShop({ id: 's1', name: '1층 매장A', floor: '1F' }),
  createMockShop({ id: 's2', name: '2층 매장B', floor: '2F' }),
  createMockShop({ id: 's3', name: '2층 매장C', floor: '2F' }),
];

describe('FloorGuidePage', () => {
  // --------------------------------------------------
  // 탭 필터링
  // --------------------------------------------------

  it('F05-01: 초기 진입 시 "전체" 탭이 선택되고 전체 매장이 표시된다', async () => {
    render(<FloorGuidePage />);

    await waitFor(() => {
      expect(screen.getByRole('tab', { name: '전체' })).toHaveAttribute('aria-selected', 'true');
      expect(screen.getByText('1층 매장A')).toBeInTheDocument();
      expect(screen.getByText('2층 매장B')).toBeInTheDocument();
    });
  });

  it('F05-02: 2F 탭 클릭 시 2층 매장만 표시된다', async () => {
    render(<FloorGuidePage />);

    await waitFor(() => screen.getByText('1층 매장A'));
    fireEvent.click(screen.getByRole('tab', { name: '2F' }));

    await waitFor(() => {
      expect(screen.getByText('2층 매장B')).toBeInTheDocument();
      expect(screen.getByText('2층 매장C')).toBeInTheDocument();
      expect(screen.queryByText('1층 매장A')).not.toBeInTheDocument();
    });
  });

  it('F05-04: 선택 층에 매장 0건 시 EmptyState를 표시한다', async () => {
    render(<FloorGuidePage />);

    await waitFor(() => screen.getByText('1층 매장A'));
    fireEvent.click(screen.getByRole('tab', { name: 'B1' }));

    await waitFor(() => {
      expect(screen.getByText('이 층에 등록된 매장이 없습니다')).toBeInTheDocument();
    });
  });
});

describe('ShopDetailPage', () => {
  // --------------------------------------------------
  // 매장 상세 정보
  // --------------------------------------------------

  it('F06-01: 매장 상세 페이지에 전체 정보가 표시된다', async () => {
    const shop = createMockShop({
      name: '테스트 매장',
      floor: '2F',
      phone: '02-1234-5678',
      hours: '10:00 - 22:00',
    });
    render(<ShopDetailPage params={{ id: shop.id }} />);

    await waitFor(() => {
      expect(screen.getByText('테스트 매장')).toBeInTheDocument();
      expect(screen.getByText('2F')).toBeInTheDocument();
      expect(screen.getByText('02-1234-5678')).toBeInTheDocument();
      expect(screen.getByText('10:00 - 22:00')).toBeInTheDocument();
    });
  });

  it('F06-02: "목록으로" 클릭 시 이전 탭 상태를 보존하며 목록으로 이동한다', async () => {
    const mockRouter = { back: vi.fn(), push: vi.fn() };
    vi.mocked(await import('next/navigation')).useRouter.mockReturnValue(mockRouter as any);

    const shop = createMockShop();
    render(<ShopDetailPage params={{ id: shop.id }} />);

    await waitFor(() => screen.getByText('목록으로'));
    fireEvent.click(screen.getByText('목록으로'));

    expect(mockRouter.back).toHaveBeenCalled();
  });

  it('F06-04: 존재하지 않는 매장 ID일 때 에러 안내를 표시한다', async () => {
    // Supabase에서 null 반환 모킹
    render(<ShopDetailPage params={{ id: 'non-existent-id' }} />);

    await waitFor(() => {
      expect(screen.getByText('매장 정보를 찾을 수 없습니다')).toBeInTheDocument();
    });
  });
});
