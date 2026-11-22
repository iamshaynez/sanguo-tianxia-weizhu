// network.spec.js —— 首屏弱网反馈、失败重试与章节剧本离线内联
import { test, expect } from '@playwright/test';
import { newGame } from './helpers.js';

const APP_ENTRY = /\/(?:src\/main|assets\/main-[A-Z0-9]+)\.js(?:\?.*)?$/;
const STORY_DATA = /\/(?:src\/story-data\/(?:scroll-[1-4]|briefings)|assets\/chunks\/(?:scroll-[1-4]|briefings)-[A-Z0-9]+)\.js(?:\?.*)?$/;

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
    // index.html 带 modulepreload 主包:首个被拦请求是预加载(静默失败,不触发
    // import reject),abort 必须持续到点重试之前,否则 import 二次请求直接放行。
    let attempts = 0;
    let armed = false;
    await page.route(APP_ENTRY, async route => {
      attempts++;
      if (!armed) await route.abort('failed');
      else await route.continue();
    });
    await page.goto('/?tutorial=0', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('#bootMessage')).toContainText('加载未完成');
    await expect(page.locator('#bootRetry')).toBeVisible();
    await expect(page.locator('#startBtn')).toBeDisabled();
    armed = true; // 重试=整页 reload,放行重载后的预加载与 import
    await page.click('#bootRetry');
    await expect(page.locator('#bootStatus')).toBeHidden();
    await expect(page.locator('#startBtn')).toBeEnabled();
    expect(attempts).toBeGreaterThanOrEqual(2);
    await page.click('#startBtn');
    await expect(page.locator('#scroll')).toBeVisible();
    await expect(page.locator('#scrollList .chip')).toHaveCount(51);
    await expect(page.locator('#errBox')).toBeEmpty();
  });

  test('章节剧本内联首包:开卷与点章全程零剧本网络请求,题记完整立现', async ({ page }) => {
    // 架构已改为离线优先:story-data 静态打包进主包(见 src/story-data/runtime.js),
    // 不再有按需章节下载与重试流程。保留本用例钉住「点章不产生任何网络请求」。
    const storyRequests = [];
    page.on('request', request => {
      if (STORY_DATA.test(request.url())) storyRequests.push(request.url());
    });
    await newGame(page);
    expect(storyRequests).toEqual([]);
    await page.click('[data-ch="taoyuan"]');
    await expect(page.locator('#page')).toBeVisible();
    await expect(page.locator('#pageRecord')).toContainText('黄巾起事');
    await expect(page.locator('#pageColdOpen')).not.toBeEmpty();
    expect(storyRequests).toEqual([]);
    await expect(page.locator('#errBox')).toBeEmpty();
  });
});
