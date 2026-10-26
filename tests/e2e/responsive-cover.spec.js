// responsive-cover.spec.js —— 封面响应式回归:魏蜀吴不压标题,矮屏开卷按钮入屏
// 背景:641-900px 宽度下魏蜀吴原为绝对定位,与标题/副标实测重叠;横屏手机
// (高≤390)下开卷按钮曾整体出屏。此文件把两个教训钉进回归。
import { test, expect } from '@playwright/test';

async function coverBoxes(page) {
  return page.evaluate(() => {
    const rect = sel => { const el = document.querySelector(sel); const r = el.getBoundingClientRect(); return { left: r.left, top: r.top, right: r.right, bottom: r.bottom, shown: getComputedStyle(el).display !== 'none' }; };
    return { kingdoms: rect('.intro-kingdoms'), titleLock: rect('.intro-title-lock'), start: rect('#startBtn') };
  });
}

test.describe('封面响应式', () => {
  for (const width of [660, 740, 820, 900]) {
    test(`宽 ${width}px:魏蜀吴与标题互不遮挡,开卷入屏`, async ({ page }) => {
      await page.setViewportSize({ width, height: 850 });
      await page.goto('/?fast=1&tutorial=0');
      await page.waitForTimeout(600);
      const b = await coverBoxes(page);
      expect(b.start.bottom).toBeLessThanOrEqual(850);
      if (b.kingdoms.shown) {
        const overlapY = Math.min(b.kingdoms.bottom, b.titleLock.bottom) - Math.max(b.kingdoms.top, b.titleLock.top);
        const overlapX = Math.min(b.kingdoms.right, b.titleLock.right) - Math.max(b.kingdoms.left, b.titleLock.left);
        expect(Math.max(0, overlapX) * Math.max(0, overlapY)).toBe(0);
      }
    });
  }

  test('横屏手机(844×390):开卷按钮完整入屏且无横向溢出', async ({ page }) => {
    await page.setViewportSize({ width: 844, height: 390 });
    await page.goto('/?fast=1&tutorial=0');
    await page.waitForTimeout(600);
    const b = await coverBoxes(page);
    expect(b.start.bottom).toBeLessThanOrEqual(390);
    expect(b.start.top).toBeGreaterThanOrEqual(0);
    const overflow = await page.evaluate(() => document.scrollingElement.scrollWidth - innerWidth);
    expect(overflow).toBeLessThanOrEqual(2);
  });

  test('窄屏手机(320×568):标题不溢出横向', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    await page.goto('/?fast=1&tutorial=0');
    await page.waitForTimeout(600);
    const overflow = await page.evaluate(() => document.scrollingElement.scrollWidth - innerWidth);
    expect(overflow).toBeLessThanOrEqual(2);
  });
});
