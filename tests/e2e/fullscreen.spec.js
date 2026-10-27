// fullscreen.spec.js —— 浏览器全屏进出、外部退出与拒绝后的用户反馈
import { test, expect } from '@playwright/test';

test.describe('浏览器全屏', () => {
  test('可进入和退出全屏,浏览器自行退出时按钮状态同步', async ({ page }) => {
    await page.goto('/');
    const toggle = page.locator('#fullscreenToggle');
    await expect(toggle).toBeEnabled();
    await toggle.click();
    await expect.poll(() => page.evaluate(() => !!document.fullscreenElement)).toBe(true);
    await expect(toggle).toContainText('退出全屏');
    await expect(toggle).toHaveAttribute('aria-pressed', 'true');
    await page.evaluate(() => document.exitFullscreen());
    await expect.poll(() => page.evaluate(() => !!document.fullscreenElement)).toBe(false);
    await expect(toggle).toContainText('全 屏');
    await expect(toggle).toHaveAttribute('aria-pressed', 'false');
    await toggle.click();
    await expect.poll(() => page.evaluate(() => !!document.fullscreenElement)).toBe(true);
    await toggle.click();
    await expect.poll(() => page.evaluate(() => !!document.fullscreenElement)).toBe(false);
  });

  test('浏览器拒绝全屏时显示提示,按钮不会卡在等待态', async ({ page }) => {
    await page.addInitScript(() => {
      Element.prototype.requestFullscreen = () => Promise.reject(new DOMException('拒绝', 'NotAllowedError'));
    });
    await page.goto('/');
    const toggle = page.locator('#fullscreenToggle');
    await expect(toggle).toBeEnabled();
    await toggle.click();
    await expect(page.locator('#fullscreenStatus')).toBeVisible();
    await expect(page.locator('#fullscreenStatus')).toContainText('未允许全屏');
    await expect(toggle).toBeEnabled();
    await expect(toggle).toHaveAttribute('aria-pressed', 'false');
  });

  for (const width of [320, 390]) {
    test(`宽 ${width}px:全屏与刷新按钮都在页脚可视范围内`, async ({ page }) => {
      await page.setViewportSize({ width, height: 844 });
      await page.goto('/');
      for (const selector of ['#fullscreenToggle', '#forceRefresh']) {
        const box = await page.locator(selector).boundingBox();
        expect(box.x).toBeGreaterThanOrEqual(0);
        expect(box.x + box.width).toBeLessThanOrEqual(width);
        expect(box.y).toBeGreaterThanOrEqual(0);
        expect(box.y + box.height).toBeLessThanOrEqual(844);
      }
    });
  }
});
