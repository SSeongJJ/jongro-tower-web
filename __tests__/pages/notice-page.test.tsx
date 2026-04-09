/**
 * 공지사항 목록/상세 페이지 통합 테스트 스켈레톤
 * TC: F16-01~04, F17-01~04
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import NoticeListPage from '@/app/notices/page';
import NoticeDetailPage from '@/app/notices/[id]/page';
import { createMockNotice } from '../setup';

// 10건 목 데이터 생성
const MOCK_NOTICES = Array.from({ length: 15 }, (_, i) =>
  createMockNotice({
    id: `notice-${i + 1}`,
    title: `공지사항 ${i + 1}`,
    created_at: new Date(Date.now() - i * 86400000).toISOString(),
  })
);

describe('NoticeListPage', () => {
  it('F16-01: 페이지 진입 시 최신순 10건과 페이지네이션이 표시된다', async () => {
    render(<NoticeListPage />);

    await waitFor(() => {
      // 1~10번 공지 표시
      expect(screen.getByText('공지사항 1')).toBeInTheDocument();
      expect(screen.getByText('공지사항 10')).toBeInTheDocument();
      // 11번은 2페이지이므로 미표시
      expect(screen.queryByText('공지사항 11')).not.toBeInTheDocument();
      // 페이지네이션 UI
      expect(screen.getByRole('navigation', { name: /페이지/ })).toBeInTheDocument();
    });
  });

  it('F16-02: 페이지 2 클릭 시 11~15번 공지가 표시된다', async () => {
    render(<NoticeListPage />);

    await waitFor(() => screen.getByText('공지사항 1'));
    fireEvent.click(screen.getByRole('button', { name: '2' }));

    await waitFor(() => {
      expect(screen.getByText('공지사항 11')).toBeInTheDocument();
      expect(screen.queryByText('공지사항 1')).not.toBeInTheDocument();
    });
  });

  it('F16-04: 공지 0건 시 EmptyState를 표시한다', async () => {
    // 빈 데이터 모킹
    render(<NoticeListPage />);

    await waitFor(() => {
      expect(screen.getByText('등록된 공지사항이 없습니다')).toBeInTheDocument();
      expect(screen.queryByRole('navigation', { name: /페이지/ })).not.toBeInTheDocument();
    });
  });
});

describe('NoticeDetailPage', () => {
  it('F17-01: 공지 상세 페이지에 제목, 등록일, 본문이 표시된다', async () => {
    const notice = createMockNotice({
      title: '중요 공지',
      content: '<p>본문 내용입니다.</p>',
      created_at: '2024-03-01T00:00:00Z',
    });
    render(<NoticeDetailPage params={{ id: notice.id }} />);

    await waitFor(() => {
      expect(screen.getByText('중요 공지')).toBeInTheDocument();
      // dangerouslySetInnerHTML 렌더링 확인
      expect(screen.getByText('본문 내용입니다.')).toBeInTheDocument();
    });
  });

  it('F17-02: "목록으로" 클릭 시 공지 목록으로 이동한다', async () => {
    const mockPush = vi.fn();
    vi.mocked(await import('next/navigation')).useRouter.mockReturnValue({
      push: mockPush,
      back: vi.fn(),
      replace: vi.fn(),
      prefetch: vi.fn(),
      pathname: '/notices/1',
    });

    const notice = createMockNotice();
    render(<NoticeDetailPage params={{ id: notice.id }} />);

    await waitFor(() => screen.getByText('목록으로'));
    fireEvent.click(screen.getByText('목록으로'));

    expect(mockPush).toHaveBeenCalledWith('/notices');
  });

  it('F17-04: 존재하지 않는 공지 ID일 때 에러 안내를 표시한다', async () => {
    render(<NoticeDetailPage params={{ id: 'non-existent' }} />);

    await waitFor(() => {
      expect(screen.getByText('공지사항을 찾을 수 없습니다')).toBeInTheDocument();
    });
  });
});
