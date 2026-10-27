// social.spec.js —— 分享者可见的 Twitter/Open Graph 大图契约与真实图片可用性
import { test, expect } from '@playwright/test';

const SHARE_IMAGE = 'https://san.xiaowenz.com/assets/og-card-v1.jpg';

test('Twitter 与 Open Graph 使用同一套标题、描述和 1200×630 可访问大图', async ({ page }) => {
  const pageRequests = [];
  page.on('request', request => pageRequests.push(request.url()));
  await page.goto('/');
  const expected = {
    'meta[property="og:type"]': ['property', 'website'],
    'meta[property="og:site_name"]': ['property', '三国：天下为注'],
    'meta[property="og:title"]': ['property', '三国：天下为注｜牌可验，史可改'],
    'meta[property="og:description"]': ['property', '三国古风德州扑克战役：翻开残卷，与群雄对局，以牌为刃，重写意难平。'],
    'meta[property="og:url"]': ['property', 'https://san.xiaowenz.com/'],
    'meta[property="og:image"]': ['property', SHARE_IMAGE],
    'meta[property="og:image:secure_url"]': ['property', SHARE_IMAGE],
    'meta[property="og:image:type"]': ['property', 'image/jpeg'],
    'meta[property="og:image:width"]': ['property', '1200'],
    'meta[property="og:image:height"]': ['property', '630'],
    'meta[name="twitter:card"]': ['name', 'summary_large_image'],
    'meta[name="twitter:title"]': ['name', '三国：天下为注｜牌可验，史可改'],
    'meta[name="twitter:description"]': ['name', '三国古风德州扑克战役：翻开残卷，与群雄对局，以牌为刃，重写意难平。'],
    'meta[name="twitter:image"]': ['name', SHARE_IMAGE],
  };
  for (const [selector, [, content]] of Object.entries(expected)) {
    await expect(page.locator(selector)).toHaveCount(1);
    await expect(page.locator(selector)).toHaveAttribute('content', content);
  }
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://san.xiaowenz.com/');
  await expect(page.locator('meta[property="og:image:alt"]')).toHaveAttribute('content', /三国：天下为注/);
  await expect(page.locator('meta[name="twitter:image:alt"]')).toHaveAttribute('content', /三国：天下为注/);

  expect(pageRequests.filter(url => url.includes('og-card-'))).toEqual([]);

  const imagePath = new URL(SHARE_IMAGE).pathname;
  const response = await page.request.get(imagePath);
  expect(response.ok()).toBeTruthy();
  expect(response.headers()['content-type']).toBe('image/jpeg');
  expect((await response.body()).length).toBeLessThan(5 * 1024 * 1024);
  const dimensions = await page.evaluate(async path => {
    const image = new Image();
    image.src = path;
    await image.decode();
    return { width: image.naturalWidth, height: image.naturalHeight };
  }, imagePath);
  expect(dimensions).toEqual({ width: 1200, height: 630 });
});
