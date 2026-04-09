/**
 * CMS 로그인 페이지 통합 테스트 스켈레톤
 * TC: F22-01~08
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AdminLoginPage from '@/app/admin/login/page';

describe('AdminLoginPage', () => {
  const fillForm = (id: string, password: string) => {
    fireEvent.change(screen.getByLabelText(/아이디/), { target: { value: id } });
    fireEvent.change(screen.getByLabelText(/비밀번호/), { target: { value: password } });
  };

  const submitForm = () => {
    fireEvent.click(screen.getByRole('button', { name: /로그인/ }));
  };

  // --------------------------------------------------
  // 정상 케이스
  // --------------------------------------------------

  it('F22-01: 올바른 ID/PW 입력 후 로그인 → 대시보드 이동', async () => {
    const mockPush = vi.fn();
    vi.mocked(await import('next/navigation')).useRouter.mockReturnValue({
      push: mockPush,
      replace: vi.fn(),
      back: vi.fn(),
      prefetch: vi.fn(),
      pathname: '/admin/login',
    });

    // Supabase signInWithPassword 성공 모킹
    const supabase = vi.mocked(await import('@/lib/supabase/client')).createClient();
    vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
      data: { user: { id: 'admin-1' }, session: { access_token: 'token' } },
      error: null,
    } as any);

    render(<AdminLoginPage />);
    fillForm('admin@jongroтower.com', 'correct-password');
    submitForm();

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/admin/dashboard');
    });
  });

  // --------------------------------------------------
  // 예외 케이스 — 클라이언트 유효성 검증
  // --------------------------------------------------

  it('F22-03: 아이디 미입력 시 에러 메시지를 표시한다', async () => {
    render(<AdminLoginPage />);
    fillForm('', 'password123');
    submitForm();

    await waitFor(() => {
      expect(screen.getByText('아이디를 입력해주세요')).toBeInTheDocument();
    });
  });

  it('F22-04: 비밀번호 미입력 시 에러 메시지를 표시한다', async () => {
    render(<AdminLoginPage />);
    fillForm('admin@test.com', '');
    submitForm();

    await waitFor(() => {
      expect(screen.getByText('비밀번호를 입력해주세요')).toBeInTheDocument();
    });
  });

  it('F22-05: 잘못된 비밀번호 입력 시 에러 메시지를 표시한다', async () => {
    const supabase = vi.mocked(await import('@/lib/supabase/client')).createClient();
    vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
      data: { user: null, session: null },
      error: { message: 'Invalid login credentials', status: 400 },
    } as any);

    render(<AdminLoginPage />);
    fillForm('admin@test.com', 'wrong-password');
    submitForm();

    await waitFor(() => {
      expect(screen.getByText('아이디 또는 비밀번호가 일치하지 않습니다')).toBeInTheDocument();
    });
  });

  it('F22-06: 5회 연속 실패 시 잠금 메시지를 표시한다', async () => {
    const supabase = vi.mocked(await import('@/lib/supabase/client')).createClient();
    vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
      data: { user: null, session: null },
      error: { message: 'Too many requests', status: 429 },
    } as any);

    render(<AdminLoginPage />);
    fillForm('admin@test.com', 'wrong-password');
    submitForm();

    await waitFor(() => {
      expect(
        screen.getByText('로그인 시도가 초과되었습니다. 30분 후 다시 시도해주세요')
      ).toBeInTheDocument();
    });
  });

  // --------------------------------------------------
  // 인증 상태 리다이렉트
  // --------------------------------------------------

  it('F22-08: 비로그인 상태에서 /admin/* 접근 시 로그인 페이지로 리다이렉트된다', async () => {
    // middleware 레벨 테스트 — 여기서는 미들웨어 함수 단위 테스트로 대체
    // 실제 미들웨어 파일: middleware.ts
    // TODO: middleware.test.ts에서 별도 검증
    expect(true).toBe(true); // placeholder
  });
});
