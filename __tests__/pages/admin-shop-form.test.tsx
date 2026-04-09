/**
 * CMS 매장 등록/수정 폼 통합 테스트 스켈레톤
 * TC: F07-01~10, F09-01~04
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import ShopFormPage from '@/app/admin/shops/new/page';
import { createMockShop } from '../setup';

describe('ShopFormPage — 매장 등록', () => {
  const fillRequiredFields = async () => {
    await userEvent.type(screen.getByLabelText(/매장명/), '새 매장');
    await userEvent.selectOptions(screen.getByLabelText(/층/), '2F');
    await userEvent.selectOptions(screen.getByLabelText(/카테고리/), 'FOOD');
  };

  const uploadImage = async (sizeBytes = 1024 * 1024, type = 'image/jpeg') => {
    const file = new File(['(binary)'], 'shop.jpg', { type });
    Object.defineProperty(file, 'size', { value: sizeBytes });

    const input = screen.getByLabelText(/대표 이미지/) as HTMLInputElement;
    await userEvent.upload(input, file);
  };

  // --------------------------------------------------
  // 정상 케이스
  // --------------------------------------------------

  it('F07-01: 필수값 모두 입력 후 저장 → 등록 완료 토스트 표시', async () => {
    render(<ShopFormPage />);
    await fillRequiredFields();
    await uploadImage();
    fireEvent.click(screen.getByRole('button', { name: /저장/ }));

    await waitFor(() => {
      expect(screen.getByText('저장되었습니다')).toBeInTheDocument();
    });
  });

  it('F07-02: 이미지 파일 선택 직후 미리보기가 표시된다', async () => {
    render(<ShopFormPage />);
    await uploadImage();

    await waitFor(() => {
      expect(screen.getByTestId('image-preview')).toBeInTheDocument();
    });
  });

  it('F07-09: is_recommended 체크 후 저장 시 추천 매장으로 등록된다', async () => {
    const mockInsert = vi.fn().mockResolvedValue({ data: [{ id: 'new-shop' }], error: null });
    // Supabase insert mock에서 is_recommended=true 포함 여부 확인
    render(<ShopFormPage />);
    await fillRequiredFields();
    await uploadImage();
    fireEvent.click(screen.getByLabelText(/추천 매장/));
    fireEvent.click(screen.getByRole('button', { name: /저장/ }));

    await waitFor(() => {
      // insert 호출 시 is_recommended: true 포함
      expect(mockInsert).toHaveBeenCalledWith(
        expect.objectContaining({ is_recommended: true })
      );
    });
  });

  // --------------------------------------------------
  // 예외 케이스 — 유효성 검증
  // --------------------------------------------------

  it('F07-03: 매장명 미입력 저장 시 에러 메시지를 표시한다', async () => {
    render(<ShopFormPage />);
    fireEvent.click(screen.getByRole('button', { name: /저장/ }));

    await waitFor(() => {
      expect(screen.getByText('매장명을 입력해주세요')).toBeInTheDocument();
    });
  });

  it('F07-04: 층 미선택 저장 시 에러 메시지를 표시한다', async () => {
    render(<ShopFormPage />);
    await userEvent.type(screen.getByLabelText(/매장명/), '새 매장');
    fireEvent.click(screen.getByRole('button', { name: /저장/ }));

    await waitFor(() => {
      expect(screen.getByText('층을 선택해주세요')).toBeInTheDocument();
    });
  });

  it('F07-05: 이미지 미첨부 저장 시 에러 메시지를 표시한다', async () => {
    render(<ShopFormPage />);
    await fillRequiredFields();
    // 이미지 업로드 생략
    fireEvent.click(screen.getByRole('button', { name: /저장/ }));

    await waitFor(() => {
      expect(screen.getByText('대표 이미지를 등록해주세요')).toBeInTheDocument();
    });
  });

  it('F07-06: 5MB 초과 이미지 선택 시 에러 메시지를 표시한다', async () => {
    render(<ShopFormPage />);
    await uploadImage(6 * 1024 * 1024); // 6MB

    await waitFor(() => {
      expect(screen.getByText('이미지 크기가 5MB를 초과합니다')).toBeInTheDocument();
    });
  });

  it('F07-07: GIF 형식 이미지 선택 시 에러 메시지를 표시한다', async () => {
    render(<ShopFormPage />);
    await uploadImage(100 * 1024, 'image/gif');

    await waitFor(() => {
      expect(screen.getByText('JPG, PNG 형식만 업로드 가능합니다')).toBeInTheDocument();
    });
  });

  it('F07-08: 매장명 51자 입력 후 저장 시 에러 메시지를 표시한다', async () => {
    render(<ShopFormPage />);
    await userEvent.type(screen.getByLabelText(/매장명/), 'a'.repeat(51));
    fireEvent.click(screen.getByRole('button', { name: /저장/ }));

    await waitFor(() => {
      expect(screen.getByText('매장명은 50자 이내로 입력해주세요')).toBeInTheDocument();
    });
  });
});

describe('ShopFormPage — 매장 수정', () => {
  it('F09-01: 수정 폼 진입 시 기존 데이터가 프리필된다', async () => {
    const shop = createMockShop({ name: '기존 매장명', floor: '2F' });
    render(<ShopFormPage shopId={shop.id} />);

    await waitFor(() => {
      expect(screen.getByDisplayValue('기존 매장명')).toBeInTheDocument();
      expect(screen.getByDisplayValue('2F')).toBeInTheDocument();
    });
  });

  it('F09-04: 수정 폼에서 필수값 삭제 후 저장 시 동일 에러를 표시한다', async () => {
    const shop = createMockShop({ name: '기존 매장명' });
    render(<ShopFormPage shopId={shop.id} />);

    await waitFor(() => screen.getByDisplayValue('기존 매장명'));
    await userEvent.clear(screen.getByLabelText(/매장명/));
    fireEvent.click(screen.getByRole('button', { name: /저장/ }));

    await waitFor(() => {
      expect(screen.getByText('매장명을 입력해주세요')).toBeInTheDocument();
    });
  });
});
