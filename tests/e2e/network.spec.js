// network.spec.js —— 首屏弱网反馈、失败重试与章节剧本按需下载
import { test, expect } from '@playwright/test';
import { newGame } from './helpers.js';

const APP_ENTRY = /\/(?:src\/main|assets\/main-[A-Z0-9]+)\.js(?:\?.*)?$/;
const STORY_DATA = /\/(?:src\/story-data\/(?:scroll-[1-4]|briefings)|assets\/chunks\/(?:scroll-[1-4]|briefings)-[A-Z0-9]+)\.js(?:\?.*)?$/;
const SCROLL_ONE = /\/(?:src\/story-data\/scroll-1|assets\/chunks\/scroll-1-[A-Z0-9]+)\.js(?:\?.*)?$/;

test.describe('弱网加载', () => {
  test('入口下载较慢时显示加载状态和慢网提示,完成后可正常开卷', async ({ page }) => {
    let release;
    const gate = new Promise(resolve => { release = resolve; });
    let requestStarted;
    const started = new Promise(resolve => { requestStarted = resolve; });
    await page.route(APP_ENTRY, async route => {
      requestStarted();
      await gate;
      await route.continue();
    });
    const navigation = page.goto('/?tutorial=0', { waitUntil: 'domcontentloaded' });
    try {
      await started;
      await expect(page.locator('#bootStatus')).toBeVisible();
      await expect(page.locator('#startBtn')).toBeDisabled();
      await expect(page.locator('#bootMessage')).toContainText('正在');
      await expect(page.locator('#bootMessage')).toContainText('网络较慢', { timeout: 12_000 });
      release();
      await navigation;
      await expect(page.locator('#bootStatus')).toBeHidden();
      await expect(page.locator('#startBtn')).toBeEnabled();
      await page.click('#startBtn');
      await expect(page.locator('#scroll')).toBeVisible();
    } finally {
      release();
    }
  });

  test('入口模块首次失败后给出重试,点击后恢复且只初始化一次', async ({ page }) => {
    let attempts = 0;
    await page.route(APP_ENTRY, async route => {
      attempts++;
      if (attempts === 1) await route.abort('failed');
      else await route.continue();
    });
    await page.goto('/?tutorial=0', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('#bootMessage')).toContainText('加载未完成');
    await expect(page.locator('#bootRetry')).toBeVisible();
    await expect(page.locator('#startBtn')).toBeDisabled();
    await page.click('#bootRetry');
    await expect(page.locator('#bootStatus')).toBeHidden();
    await expect(page.locator('#startBtn')).toBeEnabled();
    expect(attempts).toBeGreaterThanOrEqual(2);
    await page.click('#startBtn');
    await expect(page.locator('#scroll')).toBeVisible();
    await expect(page.locator('#scrollList .chip')).toHaveCount(51);
    await expect(page.locator('#errBox')).toBeEmpty();
  });

  test('首屏不下载章节剧本,章节资源失败后可重试并看到完整题记', async ({ page }) => {
    const initialStoryRequests = [];
    page.on('request', request => {
      if (STORY_DATA.test(request.url())) initialStoryRequests.push(request.url());
    });
    let scrollOneAttempts = 0;
    await page.route(SCROLL_ONE, async route => {
      scrollOneAttempts++;
      if (scrollOneAttempts === 1) await route.abort('failed');
      else await route.continue();
    });
    await newGame(page);
    expect(initialStoryRequests).toEqual([]);
    expect(scrollOneAttempts).toBe(0);
    await page.click('[data-ch="taoyuan"]');
    await expect(page.locator('#chapterLoadMessage')).toContainText('下载未完成');
    await expect(page.locator('#chapterLoadRetry')).toBeVisible();
    await page.click('#chapterLoadRetry');
    await expect(page.locator('#page')).toBeVisible();
    await expect(page.locator('#pageRecord')).toContainText('黄巾起事');
    await expect(page.locator('#pageColdOpen')).not.toBeEmpty();
    expect(scrollOneAttempts).toBeGreaterThanOrEqual(2);
  });
});
