/**
 * E2E 테스트 — 인증 플로우
 * TC: F22-01, F22-02, F22-07, F22-08, NF-05~08
 *
 * Playwright 기반. baseURL은 playwright.config.ts에서 설정.
 * 환경변수: TEST_ADMIN_EMAIL, TEST_ADMIN_PASSWORD (CI 환경에서 주입)
 */

import { test, expect } from '@playwright/test';

const ADMIN_EMAIL = process.env.TEST_ADMIN_EMAIL ?? 'admin@jongrotower.com';
const ADMIN_PASSWORD = process.env.TEST_ADMIN_PASSWORD ?? 'test-password-123';

test.describe('CMS 인증 플로우', () => {
  // --------------------------------------------------
  // 비인증 접근 제어 (NF-05, NF-06)
  // --------------------------------------------------

  test('NF-05: 비로그인 상태에서 /admin/shops 접근 시 로그인 페이지로 리다이렉트된다', async ({
    page,
  }) => {
    await page.goto('/admin/shops');
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test('NF-06: 비로그인 상태에서 /admin/notices 접근 시 로그인 페이지로 리다이렉트된다', async ({
    page,
  }) => {
    await page.goto('/admin/notices');
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test('NF-08: 로그인 후 /admin/login 접근 시 대시보드로 리다이렉트된다', async ({ page }) => {
    // 로그인 수행
    await page.goto('/admin/login');
    await page.fill('[name="email"]', ADMIN_EMAIL);
    await page.fill('[name="password"]', ADMIN_PASSWORD);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/admin\/dashboard/);

    // 다시 로그인 페이지 접근
    await page.goto('/admin/login');
    await expect(page).toHaveURL(/\/admin\/dashboard/);
  });

  // --------------------------------------------------
  // 정상 로그인/로그아웃
  // --------------------------------------------------

  test('F22-01: 올바른 ID/PW로 로그인하면 대시보드로 이동한다', async ({ page }) => {
    await page.goto('/admin/login');
    await page.fill('[name="email"]', ADMIN_EMAIL);
    await page.fill('[name="password"]', ADMIN_PASSWORD);
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/\/admin\/dashboard/);
    // 대시보드 통계 카드 확인
    await expect(page.getByTestId('dashboard-stats')).toBeVisible();
  });

  test('F22-02: 로그아웃 클릭 시 토큰이 삭제되고 로그인 페이지로 이동한다', async ({ page }) => {
    // 로그인
    await page.goto('/admin/login');
    await page.fill('[name="email"]', ADMIN_EMAIL);
    await page.fill('[name="password"]', ADMIN_PASSWORD);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/admin\/dashboard/);

    // 로그아웃
    await page.click('[data-testid="logout-button"]');
    await expect(page).toHaveURL(/\/admin\/login/);

    // 세션 쿠키/localStorage 삭제 확인
    const cookies = await page.context().cookies();
    const authCookie = cookies.find((c) => c.name.includes('supabase') || c.name.includes('auth'));
    expect(authCookie).toBeUndefined();
  });

  // --------------------------------------------------
  // 로그인 실패
  // --------------------------------------------------

  test('F22-05: 잘못된 비밀번호로 로그인하면 에러 메시지를 표시한다', async ({ page }) => {
    await page.goto('/admin/login');
    await page.fill('[name="email"]', ADMIN_EMAIL);
    await page.fill('[name="password"]', 'wrong-password-xyz');
    await page.click('button[type="submit"]');

    await expect(page.getByText('아이디 또는 비밀번호가 일치하지 않습니다')).toBeVisible();
    await expect(page).toHaveURL(/\/admin\/login/);
  });
});
