// pwa.spec.js —— 安装元数据、安装入口与真实离线重开
import { test, expect } from '@playwright/test';

test.use({ serviceWorkers: 'allow' });

test('PWA Manifest、方形图标与独立窗口元数据齐备', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('link[rel="manifest"]')).toHaveAttribute('href', '/manifest.webmanifest');
  await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveAttribute('href', '/assets/icons/apple-touch-icon.png');
  const response = await page.request.get('/manifest.webmanifest');
  expect(response.ok()).toBeTruthy();
  const manifest = await response.json();
  expect(manifest.name).toContain('三国：天下为注');
  expect(manifest.short_name).toBe('天下为注');
  expect(manifest.id).toBe('/');
  expect(manifest.start_url).toBe('/');
  expect(manifest.scope).toBe('/');
  expect(manifest.display).toBe('standalone');
  expect(manifest.background_color).toBe('#10130f');
  expect(manifest.theme_color).toBe('#10130f');
  expect(manifest.icons.length).toBeGreaterThanOrEqual(3);
  for (const icon of manifest.icons) {
    const imageResponse = await page.request.get(icon.src);
    expect(imageResponse.ok()).toBeTruthy();
    const [width, height] = icon.sizes.split('x').map(Number);
    const dimensions = await page.evaluate(async src => {
      const image = new Image();
      image.src = src;
      await image.decode();
      return [image.naturalWidth, image.naturalHeight];
    }, icon.src);
    expect(dimensions).toEqual([width, height]);
  }
});

test('支持安装提示时显示安装入口并触发浏览器安装', async ({ page }) => {
  await page.goto('/?tutorial=0');
  await expect(page.locator('#startBtn')).toBeEnabled();
  await page.click('#startBtn');
  await expect(page.locator('#scroll')).toBeVisible();
  await page.evaluate(() => {
    const event = new Event('beforeinstallprompt', { cancelable: true });
    event.prompt = () => { window.__installPrompted = true; return Promise.resolve(); };
    event.userChoice = Promise.resolve({ outcome: 'accepted', platform: 'web' });
    window.dispatchEvent(event);
  });
  const install = page.locator('#pwaInstallBtn');
  await expect(install).toBeVisible();
  await install.click();
  await expect.poll(() => page.evaluate(() => window.__installPrompted)).toBe(true);
  await expect(install).toBeHidden();
});

test('首次缓存后断网也能从图标重开,进入未访问章节并显示离线头像', async ({ page, context }) => {
  test.setTimeout(120_000);
  await page.goto('/?tutorial=0');
  await expect(page.locator('#startBtn')).toBeEnabled();
  await page.evaluate(() => navigator.serviceWorker.ready);
  await expect.poll(() => page.evaluate(async () => {
    const names = await caches.keys();
    for (const name of names) {
      const cache = await caches.open(name);
      const urls = (await cache.keys()).map(request => request.url);
      if (urls.some(url => url.includes('/assets/chunks/scroll-4-')) && urls.some(url => url.endsWith('/assets/offline-portrait.svg'))) return true;
    }
    return false;
  })).toBe(true);
  await page.reload();
  await expect.poll(() => page.evaluate(() => !!navigator.serviceWorker.controller)).toBe(true);

  await context.setOffline(true);
  await page.goto('/?tutorial=0&chapter=guijin&omen=sow', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('#startBtn')).toBeEnabled({ timeout: 30_000 });
  await page.click('#startBtn');
  await expect(page.locator('#page')).toBeVisible({ timeout: 30_000 });
  await expect(page.locator('#pageEra')).toHaveText('280 年');
  await page.click('#openPage');
  await page.locator('#mapSvg .node.avail').dispatchEvent('click');
  await expect(page.locator('#battleBriefing')).toBeVisible();
  await page.click('#briefingEnter');
  await expect(page.locator('#bossIntro')).toHaveClass(/show/);
  await page.click('#introSkip');
  await expect(page.locator('#battle')).toBeVisible();
  await expect.poll(() => page.locator('#oppPlate .portrait-img').evaluate(image => image.complete && image.naturalWidth > 0)).toBe(true);
});
