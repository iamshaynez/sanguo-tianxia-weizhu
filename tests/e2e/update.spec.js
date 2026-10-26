// update.spec.js —— 版本巡检:发现新部署时提示刷新,点击才重载
import { test, expect } from '@playwright/test';

test.describe('版本巡检与自动更新提示', () => {
  test('runtime.json 指纹变化 → 弹出刷新提示,点击重载后提示消失', async ({ page }) => {
    await page.goto('/?fast=1&tutorial=0');
    // 等基线确立(首次巡检只立基线,不弹提示)
    await page.waitForFunction(() => typeof window.__updateBaseline === 'string');
    await expect(page.locator('.update-toast')).toHaveCount(0);

    // 模拟新部署:此后所有 runtime.json 请求都返回新指纹
    await page.route('**/runtime.json*', route =>
      route.fulfill({ json: { version: '1.0.0', commit: 'e2e-new-deploy', startedAt: '2026-10-26T00:00:00Z' } }));
    await page.evaluate(() => window.__probeUpdate());
    const toast = page.locator('.update-toast');
    await expect(toast).toBeVisible();
    await expect(toast.locator('button')).toContainText('刷新');

    // 点击 → location.reload();重载后的新页面以新指纹为基线,不再弹提示
    const reloaded = page.waitForEvent('framenavigated', { timeout: 15_000 });
    await toast.locator('button').click();
    await reloaded;
    await page.waitForFunction(() => typeof window.__updateBaseline === 'string');
    await expect(page.locator('.update-toast')).toHaveCount(0);
  });

  test('基线未变化时不弹提示(回归:巡检不打扰)', async ({ page }) => {
    await page.goto('/?fast=1&tutorial=0');
    await page.waitForFunction(() => typeof window.__updateBaseline === 'string');
    await page.evaluate(() => window.__probeUpdate());
    await page.waitForTimeout(400);
    await expect(page.locator('.update-toast')).toHaveCount(0);
  });
});
