/**
 * ShopCard 컴포넌트 단위 테스트
 * TC: F02-01~04, F05-03
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ShopCard } from '@/components/shop-card';
import { createMockShop } from '../setup';

describe('ShopCard', () => {
  const defaultShop = createMockShop();

  // --------------------------------------------------
  // 정상 케이스
  // --------------------------------------------------

  it('F05-03: 매장명, 카테고리, 대표 이미지를 렌더링한다', () => {
    render(<ShopCard shop={defaultShop} />);

    expect(screen.getByText(defaultShop.name)).toBeInTheDocument();
    expect(screen.getByText(defaultShop.category)).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAttribute('alt', defaultShop.name);
  });

  it('F02-02: 카드 클릭 시 onSelect 콜백을 호출한다', () => {
    const onSelect = vi.fn();
    render(<ShopCard shop={defaultShop} onSelect={onSelect} />);

    fireEvent.click(screen.getByRole('article'));
    expect(onSelect).toHaveBeenCalledWith(defaultShop.id);
  });

  it('F07-09: is_recommended=true일 때 추천 배지를 표시한다', () => {
    const recommendedShop = createMockShop({ is_recommended: true });
    render(<ShopCard shop={recommendedShop} />);

    expect(screen.getByText(/추천/)).toBeInTheDocument();
  });

  it('F07-10: is_recommended=false일 때 추천 배지를 표시하지 않는다', () => {
    render(<ShopCard shop={defaultShop} />);

    expect(screen.queryByText(/추천/)).not.toBeInTheDocument();
  });

  // --------------------------------------------------
  // 예외 케이스
  // --------------------------------------------------

  it('F02-04: 이미지 로드 실패 시 플레이스홀더 이미지로 대체된다', () => {
    render(<ShopCard shop={defaultShop} />);

    const img = screen.getByRole('img');
    fireEvent.error(img);

    expect(img).toHaveAttribute('src', expect.stringContaining('placeholder'));
  });

  // --------------------------------------------------
  // 반응형
  // --------------------------------------------------

  it('모바일 뷰에서도 매장 정보가 정상 렌더링된다', () => {
    // jsdom은 실제 CSS 미적용이므로 렌더링 여부만 확인
    render(<ShopCard shop={defaultShop} />);
    expect(screen.getByText(defaultShop.name)).toBeVisible();
  });
});
