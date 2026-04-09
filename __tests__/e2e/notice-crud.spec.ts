/**
 * E2E 테스트 — 공지사항 CRUD 플로우
 * TC: F18-01~08, F19-01~02, F20-01~02, F21-01~02, F16-01~04, F17-01~04
 *
 * 전제: 로그인된 상태에서 실행 (storageState 사용)
 */

import { test, expect, Page } from '@playwright/test';

test.use({ storageState: 'playwright/.auth/admin.json' });

async function createNotice(
  page: Page,
  options: { title: string; content?: string; isPinned?: boolean }
) {
  await page.goto('/admin/notices/new');
  await page.fill('[name="title"]', options.title);

  // 리치텍스트 에디터 (contenteditable 영역)
  const editor = page.locator('[data-testid="rich-editor"]');
  await editor.click();
  await editor.type(options.content ?? '테스트 공지 내용입니다.');

  if (options.isPinned) {
    await page.check('[name="is_pinned"]');
  }

  await page.click('button[type="submit"]');
  await expect(page.getByText('저장되었습니다')).toBeVisible();
}

test.describe('공지사항 CRUD', () => {
  // --------------------------------------------------
  // 공지 등록 (F18)
  // --------------------------------------------------

  test('F18-01: 제목+내용 입력 후 저장하면 사용자 공지 목록에 노출된다', async ({ page }) => {
    const title = `E2E 공지 ${Date.now()}`;
    await createNotice(page, { title });

    await page.goto('/notices');
    await expect(page.getByText(title)).toBeVisible();
  });

  test('F18-08: is_pinned 체크 후 등록하면 공지 목록 최상단에 고정 노출된다', async ({
    page,
  }) => {
    const title = `고정 공지 E2E ${Date.now()}`;
    await createNotice(page, { title, isPinned: true });

    await page.goto('/notices');
    // 고정 공지는 목록 최상단
    const firstNotice = page.locator('[data-testid="notice-row"]').first();
    await expect(firstNotice).toContainText(title);
    await expect(firstNotice.getByTestId('pinned-badge')).toBeVisible();
  });

  test('F18-05: 제목 미입력 저장 시 에러 메시지를 표시한다', async ({ page }) => {
    await page.goto('/admin/notices/new');
    await page.click('button[type="submit"]');

    await expect(page.getByText('제목을 입력해주세요')).toBeVisible();
  });

  test('F18-07: 제목 101자 입력 저장 시 에러 메시지를 표시한다', async ({ page }) => {
    await page.goto('/admin/notices/new');
    await page.fill('[name="title"]', 'a'.repeat(101));
    await page.click('button[type="submit"]');

    await expect(page.getByText('제목은 100자 이내로 입력해주세요')).toBeVisible();
  });

  // --------------------------------------------------
  // 공지 목록 조회 (F19)
  // --------------------------------------------------

  test('F19-02: 제목 검색어 입력 시 해당 공지만 필터링된다', async ({ page }) => {
    await page.goto('/admin/notices');
    await page.fill('[placeholder*="검색"]', 'E2E 공지');

    const rows = page.locator('[data-testid="notice-row"]');
    const count = await rows.count();
    for (let i = 0; i < count; i++) {
      await expect(rows.nth(i)).toContainText('E2E 공지');
    }
  });

  // --------------------------------------------------
  // 공지 수정 (F20)
  // --------------------------------------------------

  test('F20-02: 내용 변경 후 저장하면 사용자 화면에도 반영된다', async ({ page }) => {
    const originalTitle = `수정 전 공지 ${Date.now()}`;
    const updatedTitle = `수정 후 공지 ${Date.now()}`;
    await createNotice(page, { title: originalTitle });

    await page.goto('/admin/notices');
    await page.fill('[placeholder*="검색"]', originalTitle);
    await page.click('[data-testid="edit-button"]');

    // 제목 변경
    await page.fill('[name="title"]', updatedTitle);
    await page.click('button[type="submit"]');
    await expect(page.getByText('저장되었습니다')).toBeVisible();

    // 사용자 공지 목록 확인
    await page.goto('/notices');
    await expect(page.getByText(updatedTitle)).toBeVisible();
    await expect(page.getByText(originalTitle)).not.toBeVisible();
  });

  // --------------------------------------------------
  // 공지 삭제 (F21)
  // --------------------------------------------------

  test('F21-01: 삭제 확인 후 공지가 삭제되고 사용자 화면에서도 미노출된다', async ({ page }) => {
    const title = `삭제 대상 공지 ${Date.now()}`;
    await createNotice(page, { title });

    await page.goto('/admin/notices');
    await page.fill('[placeholder*="검색"]', title);
    await page.click('[data-testid="delete-button"]');
    await page.click('button:has-text("삭제")');

    await expect(page.getByText(title)).not.toBeVisible();

    await page.goto('/notices');
    await expect(page.getByText(title)).not.toBeVisible();
  });

  test('F21-02: 삭제 취소 시 공지가 유지된다', async ({ page }) => {
    await page.goto('/admin/notices');
    const firstRow = page.locator('[data-testid="notice-row"]').first();
    const title = await firstRow.locator('[data-testid="notice-title"]').textContent();

    await firstRow.locator('[data-testid="delete-button"]').click();
    await page.click('button:has-text("취소")');

    await expect(page.getByText(title!)).toBeVisible();
  });

  // --------------------------------------------------
  // 사용자 공지 목록 (F16)
  // --------------------------------------------------

  test('F16-02: 2페이지 클릭 시 11번째 이후 공지가 표시된다', async ({ page }) => {
    await page.goto('/notices');
    // 2페이지 버튼 클릭
    await page.click('[aria-label="2 페이지"]');

    // URL 파라미터 또는 렌더 내용으로 페이지 전환 확인
    await expect(page.locator('[data-testid="notice-row"]').first()).not.toBeEmpty();
    await expect(page.locator('[aria-current="page"]')).toHaveText('2');
  });

  // --------------------------------------------------
  // 공지 상세 (F17)
  // --------------------------------------------------

  test('F17-01: 공지 상세 페이지에서 제목, 등록일, 본문이 표시된다', async ({ page }) => {
    const title = `상세 확인 공지 ${Date.now()}`;
    const content = '상세 페이지 본문 내용';
    await createNotice(page, { title, content });

    await page.goto('/notices');
    await page.click(`text=${title}`);

    await expect(page.getByRole('heading', { name: title })).toBeVisible();
    await expect(page.getByText(content)).toBeVisible();
    await expect(page.getByTestId('notice-date')).toBeVisible();
  });

  test('F17-02: "목록으로" 클릭 시 공지 목록으로 이동한다', async ({ page }) => {
    await page.goto('/notices');
    const firstNotice = page.locator('[data-testid="notice-row"]').first();
    await firstNotice.click();

    await page.click('text=목록으로');
    await expect(page).toHaveURL(/\/notices$/);
  });
});
