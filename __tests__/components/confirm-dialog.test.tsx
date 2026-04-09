/**
 * ConfirmDialog 컴포넌트 단위 테스트
 * TC: UI-02, UI-03, UI-04, F10-02
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ConfirmDialog } from '@/components/confirm-dialog';

describe('ConfirmDialog', () => {
  const defaultProps = {
    isOpen: true,
    title: '삭제 확인',
    message: '정말 삭제하시겠습니까?',
    onConfirm: vi.fn(),
    onCancel: vi.fn(),
  };

  // --------------------------------------------------
  // 렌더링
  // --------------------------------------------------

  it('UI-02: isOpen=true일 때 모달이 표시된다', () => {
    render(<ConfirmDialog {...defaultProps} />);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('삭제 확인')).toBeInTheDocument();
    expect(screen.getByText('정말 삭제하시겠습니까?')).toBeInTheDocument();
  });

  it('isOpen=false일 때 모달이 표시되지 않는다', () => {
    render(<ConfirmDialog {...defaultProps} isOpen={false} />);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  // --------------------------------------------------
  // 인터랙션
  // --------------------------------------------------

  it('UI-04: 확인 버튼 클릭 시 onConfirm이 호출된다', () => {
    const onConfirm = vi.fn();
    render(<ConfirmDialog {...defaultProps} onConfirm={onConfirm} />);

    fireEvent.click(screen.getByRole('button', { name: /확인|삭제/ }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('UI-03: 취소 버튼 클릭 시 onCancel이 호출된다', () => {
    const onCancel = vi.fn();
    render(<ConfirmDialog {...defaultProps} onCancel={onCancel} />);

    fireEvent.click(screen.getByRole('button', { name: /취소/ }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('F10-02: 취소 버튼 클릭 시 onConfirm은 호출되지 않는다', () => {
    const onConfirm = vi.fn();
    const onCancel = vi.fn();
    render(<ConfirmDialog {...defaultProps} onConfirm={onConfirm} onCancel={onCancel} />);

    fireEvent.click(screen.getByRole('button', { name: /취소/ }));
    expect(onConfirm).not.toHaveBeenCalled();
  });

  // --------------------------------------------------
  // 접근성
  // --------------------------------------------------

  it('다이얼로그에 aria-modal 속성이 있다', () => {
    render(<ConfirmDialog {...defaultProps} />);

    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
  });

  it('ESC 키 입력 시 onCancel이 호출된다', () => {
    const onCancel = vi.fn();
    render(<ConfirmDialog {...defaultProps} onCancel={onCancel} />);

    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });
    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});
