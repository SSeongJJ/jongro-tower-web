/**
 * EmptyState 컴포넌트 단위 테스트
 * TC: UI-07, F02-03, F05-04, F16-04, F24-03
 */

import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { EmptyState } from '@/components/empty-state';

describe('EmptyState', () => {
  // --------------------------------------------------
  // 정상 케이스
  // --------------------------------------------------

  it('UI-07: message prop을 받아 텍스트를 렌더링한다', () => {
    render(<EmptyState message="등록된 매장이 없습니다" />);

    expect(screen.getByText('등록된 매장이 없습니다')).toBeInTheDocument();
  });

  it('F05-04: 층 매장 0건 EmptyState 메시지를 렌더링한다', () => {
    render(<EmptyState message="이 층에 등록된 매장이 없습니다" />);

    expect(screen.getByText('이 층에 등록된 매장이 없습니다')).toBeInTheDocument();
  });

  it('F16-04: 공지 0건 EmptyState 메시지를 렌더링한다', () => {
    render(<EmptyState message="등록된 공지사항이 없습니다" />);

    expect(screen.getByText('등록된 공지사항이 없습니다')).toBeInTheDocument();
  });

  // --------------------------------------------------
  // 옵션 props
  // --------------------------------------------------

  it('icon prop을 전달하면 아이콘이 표시된다', () => {
    render(<EmptyState message="데이터 없음" icon="inbox" />);

    expect(screen.getByTestId('empty-icon')).toBeInTheDocument();
  });

  it('action prop을 전달하면 액션 버튼이 표시된다', () => {
    render(
      <EmptyState
        message="등록된 매장이 없습니다"
        action={{ label: '매장 등록', onClick: () => {} }}
      />
    );

    expect(screen.getByRole('button', { name: '매장 등록' })).toBeInTheDocument();
  });

  // --------------------------------------------------
  // 접근성
  // --------------------------------------------------

  it('EmptyState에 role="status" 속성이 있다', () => {
    render(<EmptyState message="데이터 없음" />);

    expect(screen.getByRole('status')).toBeInTheDocument();
  });
});
