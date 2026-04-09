/**
 * E2E 테스트 — 매장 CRUD 플로우
 * TC: F07-01~10, F08-01~03, F09-01~04, F10-01~03
 *
 * 전제: 로그인된 상태에서 실행 (auth.setup.ts의 storageState 사용)
 */

import { test, expect, Page } from '@playwright/test';
import path from 'path';

// 로그인 상태 재사용 (playwright.config.ts에서 storageState 설정)
test.use({ storageState: 'playwright/.auth/admin.json' });

// 테스트용 이미지 경로
const TEST_IMAGE_PATH = path.join(__dirname, '../fixtures/test-shop.jpg');

async function createShop(
  page: Page,
  options: {
    name: string;
    floor?: string;
    category?: string;
    isRecommended?: boolean;
  }
) {
  await page.goto('/admin/shops/new');
  await page.fill('[name="name"]', options.name);
  await page.selectOption('[name="floor"]', options.floor ?? '2F');
  await page.selectOption('[name="category"]', options.category ?? 'FOOD');
  await page.setInputFiles('input[type="file"]', TEST_IMAGE_PATH);

  if (options.isRecommended) {
    await page.check('[name="is_recommended"]');
  }

  await page.click('button[type="submit"]');
  await expect(page.getByText('저장되었습니다')).toBeVisible();
}

test.describe('매장 CRUD', () => {
  // --------------------------------------------------
  // 매장 등록 (F07)
  // --------------------------------------------------

  test('F07-01: 필수값 모두 입력 후 저장하면 매장 목록에 나타난다', async ({ page }) => {
    const shopName = `E2E 테스트 매장 ${Date.now()}`;
    await createShop(page, { name: shopName });

    await page.goto('/admin/shops');
    await expect(page.getByText(shopName)).toBeVisible();
  });

  test('F07-09: is_recommended 체크 후 등록하면 메인 추천 섹션에 노출된다', async ({ page }) => {
    const shopName = `추천 매장 E2E ${Date.now()}`;
    await createShop(page, { name: shopName, isRecommended: true });

    // 사용자 메인 페이지에서 확인
    await page.goto('/');
    await expect(page.getByText(shopName)).toBeVisible();
  });

  test('F07-10: is_recommended 미체크 등록하면 메인에 미노출, 층별안내에만 노출된다', async ({
    page,
  }) => {
    const shopName = `일반 매장 E2E ${Date.now()}`;
    await createShop(page, { name: shopName, isRecommended: false });

    // 메인 추천 섹션 미노출
    await page.goto('/');
    const mainSection = page.getByTestId('recommended-shops');
    await expect(mainSection.getByText(shopName)).not.toBeVisible();

    // 층별안내에 노출
    await page.goto('/floor-guide');
    await expect(page.getByText(shopName)).toBeVisible();
  });

  // --------------------------------------------------
  // 매장 목록 조회 (F08)
  // --------------------------------------------------

  test('F08-02: 매장명 검색어 입력 시 해당 매장만 필터링된다', async ({ page }) => {
    await page.goto('/admin/shops');
    await page.fill('[placeholder*="검색"]', '테스트 매장');

    // 검색어 미포함 항목 미표시
    const rows = page.locator('table tbody tr');
    const count = await rows.count();
    for (let i = 0; i < count; i++) {
      await expect(rows.nth(i)).toContainText('테스트 매장');
    }
  });

  test('F08-03: 층 필터 선택 시 해당 층 매장만 표시된다', async ({ page }) => {
    await page.goto('/admin/shops');
    await page.selectOption('[data-testid="floor-filter"]', '2F');

    const rows = page.locator('table tbody tr');
    const count = await rows.count();
    for (let i = 0; i < count; i++) {
      await expect(rows.nth(i).getByTestId('shop-floor')).toHaveText('2F');
    }
  });

  // --------------------------------------------------
  // 매장 수정 (F09)
  // --------------------------------------------------

  test('F09-02: 매장명 변경 후 저장하면 사용자 화면에도 반영된다', async ({ page }) => {
    const originalName = `수정 전 매장 ${Date.now()}`;
    const updatedName = `수정 후 매장 ${Date.now()}`;
    await createShop(page, { name: originalName, floor: '1F' });

    // 목록에서 수정 버튼 클릭
    await page.goto('/admin/shops');
    await page.fill('[placeholder*="검색"]', originalName);
    await page.click(`[data-testid="edit-button-${originalName}"]`);

    // 매장명 변경
    await page.fill('[name="name"]', updatedName);
    await page.click('button[type="submit"]');
    await expect(page.getByText('저장되었습니다')).toBeVisible();

    // 사용자 층별안내에서 확인
    await page.goto('/floor-guide');
    await expect(page.getByText(updatedName)).toBeVisible();
    await expect(page.getByText(originalName)).not.toBeVisible();
  });

  // --------------------------------------------------
  // 매장 삭제 (F10)
  // --------------------------------------------------

  test('F10-01: 삭제 확인 모달에서 삭제 클릭 시 매장이 삭제된다', async ({ page }) => {
    const shopName = `삭제 대상 매장 ${Date.now()}`;
    await createShop(page, { name: shopName });

    await page.goto('/admin/shops');
    await page.fill('[placeholder*="검색"]', shopName);
    await page.click(`[data-testid="delete-button"]`);

    // 확인 모달
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.click('button:has-text("삭제")');

    // 성공 토스트 + 목록에서 제거
    await expect(page.getByText(/삭제/)).toBeVisible();
    await expect(page.getByText(shopName)).not.toBeVisible();

    // 사용자 화면에서도 미노출
    await page.goto('/floor-guide');
    await expect(page.getByText(shopName)).not.toBeVisible();
  });

  test('F10-02: 삭제 확인 모달에서 취소 클릭 시 삭제되지 않는다', async ({ page }) => {
    await page.goto('/admin/shops');
    const firstRow = page.locator('table tbody tr').first();
    const shopName = await firstRow.locator('[data-testid="shop-name"]').textContent();

    await firstRow.locator('[data-testid="delete-button"]').click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.click('button:has-text("취소")');

    await expect(page.getByRole('dialog')).not.toBeVisible();
    await expect(page.getByText(shopName!)).toBeVisible();
  });
});
