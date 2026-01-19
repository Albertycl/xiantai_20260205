import { test, expect } from '@playwright/test';

test.describe('Tokyo Fuji Travel Map', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('Map tab loads correctly', async ({ page }) => {
    // Map tab should be active by default
    await expect(page.locator('text=地圖視圖')).toBeVisible();

    // Map container should be visible
    await expect(page.locator('.leaflet-container')).toBeVisible();

    // Day selector should be visible
    await expect(page.locator('text=Day 1')).toBeVisible();
  });

  test('Itinerary tab loads correctly', async ({ page }) => {
    // Click itinerary tab
    await page.click('text=行程細節');

    // Wait for content
    await expect(page.locator('text=詳細行程細節')).toBeVisible();

    // Check for day filter buttons
    await expect(page.locator('text=全部行程')).toBeVisible();
  });

  test('Booking tab loads correctly', async ({ page }) => {
    // Click booking tab
    await page.click('text=住宿預訂');

    // Wait for content
    await expect(page.locator('text=住宿預訂管理')).toBeVisible();
  });

  test('Flight tab loads correctly', async ({ page }) => {
    // Click flight tab
    await page.click('text=機票資訊');

    // Wait for content
    await expect(page.locator('text=機票資訊')).toBeVisible();
  });

  test('Checklist tab loads correctly', async ({ page }) => {
    // Click checklist tab
    await page.click('text=攜帶清單');

    // Wait for content
    await expect(page.locator('text=出發前確認所有必需品')).toBeVisible();

    // Check for login button
    await expect(page.locator('text=登入編輯')).toBeVisible();

    // Check for expand/collapse buttons
    await expect(page.locator('text=全部展開')).toBeVisible();
    await expect(page.locator('text=全部收合')).toBeVisible();
  });

  test('Checklist login and edit functionality', async ({ page }) => {
    // Go to checklist tab
    await page.click('text=攜帶清單');

    // Click login button
    await page.click('text=登入編輯');

    // Login modal should appear
    await expect(page.locator('text=登入以編輯清單')).toBeVisible();

    // Enter credentials
    await page.fill('input[placeholder="請輸入帳號"]', 'yvonne');
    await page.fill('input[placeholder="請輸入密碼"]', 'neihu');

    // Click login
    await page.click('button:has-text("登入"):not(:has-text("編輯"))');

    // Should be logged in - check for user indicator
    await expect(page.locator('text=yvonne')).toBeVisible();

    // Reset button should be visible when logged in
    await expect(page.locator('text=重置全部')).toBeVisible();
  });

  test('Export tab loads correctly', async ({ page }) => {
    // Click export tab
    await page.click('text=匯出資料');

    // Wait for content
    await expect(page.locator('text=資料匯出')).toBeVisible();
  });

  test('Weather overlay works', async ({ page }) => {
    // Click weather button
    await page.click('text=氣候預測');

    // Weather panel should appear
    await expect(page.locator('text=1 月平均氣候預測')).toBeVisible();
  });

  test('Sidebar opens and closes on mobile', async ({ page, viewport }) => {
    if (viewport && viewport.width < 768) {
      // On mobile, sidebar might be hidden initially or have menu button
      const menuButton = page.locator('button').filter({ has: page.locator('svg') }).first();

      // Check if sidebar is visible
      const sidebar = page.locator('aside');
      const isVisible = await sidebar.isVisible();

      if (!isVisible) {
        // Click menu to open sidebar
        await menuButton.click();
        await expect(sidebar).toBeVisible();
      }

      // Close sidebar by clicking overlay or close button
      const closeButton = page.locator('aside button').first();
      await closeButton.click();
    }
  });

  test('Checklist category expand/collapse', async ({ page }) => {
    // Go to checklist tab
    await page.click('text=攜帶清單');

    // Click expand all
    await page.click('text=全部展開');

    // All categories should show items - check for one item from each category
    await expect(page.locator('text=護照')).toBeVisible();

    // Click collapse all
    await page.click('text=全部收合');

    // Items should be hidden (category headers still visible)
    await expect(page.locator('text=重要證件、票券與行前安排')).toBeVisible();
  });
});
