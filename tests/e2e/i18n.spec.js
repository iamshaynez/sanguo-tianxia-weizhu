// tests/e2e/i18n.spec.js —— 多语言切换与本地化完整性 E2E 测试
import { test, expect } from '@playwright/test';

test.describe('多语言 (i18n) 系统验证', () => {
  test.use({ locale: 'zh-CN' });

  test('支持四种语言即时热切换与 UI 响应', async ({ page }) => {
    await page.goto('/');

    // 1. 验证语言选择栏存在
    const langBar = page.locator('#langBar');
    await expect(langBar).toBeVisible();

    // 默认简体中文
    const html = page.locator('html');
    await expect(html).toHaveAttribute('lang', 'zh-CN');
    await expect(page.locator('#startBtn')).toContainText('开 卷');

    // 2. 切换至繁体中文 (zh-TW)
    await page.locator('.lang-btn[data-locale="zh-TW"]').click();
    await expect(html).toHaveAttribute('lang', 'zh-TW');
    await expect(page.locator('#startBtn')).toContainText('開 卷');

    // 3. 切换至日本語 (ja)
    await page.locator('.lang-btn[data-locale="ja"]').click();
    await expect(html).toHaveAttribute('lang', 'ja');
    await expect(page.locator('#startBtn')).toContainText('開 巻');

    // 4. 切换至 English (en)
    await page.locator('.lang-btn[data-locale="en"]').click();
    await expect(html).toHaveAttribute('lang', 'en');
    await expect(page.locator('#startBtn')).toContainText('Open Scroll');

    // 5. 刷新页面后应持久化记忆选定语言 (en)
    await page.reload();
    await expect(html).toHaveAttribute('lang', 'en');
    await expect(page.locator('#startBtn')).toContainText('Open Scroll');

    // 6. 切换回简体中文
    await page.locator('.lang-btn[data-locale="zh-CN"]').click();
    await expect(html).toHaveAttribute('lang', 'zh-CN');
    await expect(page.locator('#startBtn')).toContainText('开 卷');
  });
});
