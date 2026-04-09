/**
 * Pagination 컴포넌트 단위 테스트
 * TC: F16-01, F16-02
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Pagination } from '@/components/pagination';

describe('Pagination', () => {
  // --------------------------------------------------
  // 정상 케이스
  // --------------------------------------------------

  it('F16-01: 전체 페이지 번호가 렌더링된다', () => {
    render(<Pagination currentPage={1} totalPages={5} onPageChange={vi.fn()} />);

    [1, 2, 3, 4, 5].forEach((page) => {
      expect(screen.getByRole('button', { name: String(page) })).toBeInTheDocument();
    });
  });

  it('F16-01: 현재 페이지 번호가 active 상태로 표시된다', () => {
    render(<Pagination currentPage={2} totalPages={5} onPageChange={vi.fn()} />);

    expect(screen.getByRole('button', { name: '2' })).toHaveAttribute('aria-current', 'page');
  });

  it('F16-02: 페이지 번호 클릭 시 onPageChange가 해당 번호로 호출된다', () => {
    const onPageChange = vi.fn();
    render(<Pagination currentPage={1} totalPages={5} onPageChange={onPageChange} />);

    fireEvent.click(screen.getByRole('button', { name: '3' }));
    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it('1페이지일 때 이전 버튼이 disabled 상태이다', () => {
    render(<Pagination currentPage={1} totalPages={5} onPageChange={vi.fn()} />);

    expect(screen.getByRole('button', { name: /이전/ })).toBeDisabled();
  });

  it('마지막 페이지일 때 다음 버튼이 disabled 상태이다', () => {
    render(<Pagination currentPage={5} totalPages={5} onPageChange={vi.fn()} />);

    expect(screen.getByRole('button', { name: /다음/ })).toBeDisabled();
  });

  // --------------------------------------------------
  // 예외 케이스
  // --------------------------------------------------

  it('F16-04: totalPages=0이면 컴포넌트를 렌더링하지 않는다', () => {
    const { container } = render(
      <Pagination currentPage={1} totalPages={0} onPageChange={vi.fn()} />
    );

    expect(container.firstChild).toBeNull();
  });

  it('totalPages=1이면 페이지네이션을 렌더링하지 않는다', () => {
    const { container } = render(
      <Pagination currentPage={1} totalPages={1} onPageChange={vi.fn()} />
    );

    expect(container.firstChild).toBeNull();
  });

  // --------------------------------------------------
  // 접근성
  // --------------------------------------------------

  it('nav 요소에 aria-label이 있다', () => {
    render(<Pagination currentPage={1} totalPages={5} onPageChange={vi.fn()} />);

    expect(screen.getByRole('navigation', { name: /페이지/ })).toBeInTheDocument();
  });
});
