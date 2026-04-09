/**
 * Toast 컴포넌트 단위 테스트
 * TC: UI-01, UI-04
 */

import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Toast } from '@/components/toast';

describe('Toast', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // --------------------------------------------------
  // 정상 케이스
  // --------------------------------------------------

  it('UI-01: message를 전달하면 토스트가 표시된다', () => {
    render(<Toast message="저장되었습니다" isVisible={true} />);

    expect(screen.getByText('저장되었습니다')).toBeInTheDocument();
  });

  it('UI-01: 3초 후 onClose 콜백이 호출된다', () => {
    const onClose = vi.fn();
    render(<Toast message="저장되었습니다" isVisible={true} onClose={onClose} duration={3000} />);

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('isVisible=false일 때 토스트가 표시되지 않는다', () => {
    render(<Toast message="저장되었습니다" isVisible={false} />);

    expect(screen.queryByText('저장되었습니다')).not.toBeInTheDocument();
  });

  // --------------------------------------------------
  // 에러 토스트
  // --------------------------------------------------

  it('type="error"일 때 에러 스타일이 적용된다', () => {
    render(<Toast message="삭제에 실패했습니다" isVisible={true} type="error" />);

    const toast = screen.getByRole('alert');
    expect(toast).toHaveClass('error');
  });

  it('type="success"일 때 성공 스타일이 적용된다 (기본값)', () => {
    render(<Toast message="저장되었습니다" isVisible={true} type="success" />);

    const toast = screen.getByRole('alert');
    expect(toast).toHaveClass('success');
  });

  // --------------------------------------------------
  // 접근성
  // --------------------------------------------------

  it('토스트에 role="alert" 속성이 있다', () => {
    render(<Toast message="저장되었습니다" isVisible={true} />);

    expect(screen.getByRole('alert')).toBeInTheDocument();
  });
});
