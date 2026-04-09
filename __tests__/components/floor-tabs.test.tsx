/**
 * FloorTabs 컴포넌트 단위 테스트
 * TC: F05-01~02, F11-01~02, F27-02
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { FloorTabs } from '@/components/floor-tabs';

const FLOORS = ['전체', '1F', '2F', '3F', 'B1'];

describe('FloorTabs', () => {
  // --------------------------------------------------
  // 정상 케이스
  // --------------------------------------------------

  it('F05-01: 초기 진입 시 "전체" 탭이 active 상태이다', () => {
    const onSelect = vi.fn();
    render(<FloorTabs floors={FLOORS} selected="전체" onSelect={onSelect} />);

    const activeTab = screen.getByRole('tab', { name: '전체' });
    expect(activeTab).toHaveAttribute('aria-selected', 'true');
  });

  it('F05-02: 층 탭 클릭 시 onSelect 콜백이 해당 층 값으로 호출된다', () => {
    const onSelect = vi.fn();
    render(<FloorTabs floors={FLOORS} selected="전체" onSelect={onSelect} />);

    fireEvent.click(screen.getByRole('tab', { name: '2F' }));
    expect(onSelect).toHaveBeenCalledWith('2F');
  });

  it('F11-02 / F27-02: 선택된 탭 변경 시 해당 탭만 active 상태가 된다', () => {
    const onSelect = vi.fn();
    const { rerender } = render(
      <FloorTabs floors={FLOORS} selected="전체" onSelect={onSelect} />
    );

    rerender(<FloorTabs floors={FLOORS} selected="2F" onSelect={onSelect} />);

    expect(screen.getByRole('tab', { name: '2F' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tab', { name: '전체' })).toHaveAttribute('aria-selected', 'false');
  });

  it('모든 층 탭이 렌더링된다', () => {
    render(<FloorTabs floors={FLOORS} selected="전체" onSelect={vi.fn()} />);

    FLOORS.forEach((floor) => {
      expect(screen.getByRole('tab', { name: floor })).toBeInTheDocument();
    });
  });

  // --------------------------------------------------
  // 접근성
  // --------------------------------------------------

  it('탭 목록에 role="tablist" 속성이 있다', () => {
    render(<FloorTabs floors={FLOORS} selected="전체" onSelect={vi.fn()} />);
    expect(screen.getByRole('tablist')).toBeInTheDocument();
  });
});
