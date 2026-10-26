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

test.describe('武将卡响应式', () => {
  // 背景:≤640px 左右分栏下立绘列宽高比 1:4.4,方图 cover 后仅露 22% 宽竖条;
  // 横幅 cover 又会上下裁剪。改上下布局 + 正方立绘盒 contain:整幅素材零裁剪。
  for (const [w, h] of [[390, 844], [320, 568]]) {
    test(`宽 ${w}px:武将卡立绘为正方完整展示(contain),卡片与入阵按钮入屏`, async ({ page }) => {
      await page.setViewportSize({ width: w, height: h });
      await page.goto('/?fast=1&chapter=hulao&stage=boss&omen=sow&tutorial=0');
      await page.waitForTimeout(500);
      await page.evaluate(() => document.getElementById('startBtn').click());
      await page.waitForFunction(() => !document.getElementById('page').classList.contains('hidden'));
      await page.evaluate(() => document.getElementById('openPage').click());
      await page.waitForFunction(() => !document.getElementById('map').classList.contains('hidden') || !document.getElementById('omenModal').classList.contains('hidden'));
      await page.waitForTimeout(200);
      await page.evaluate(() => { const m = document.getElementById('omenModal'); if (!m.classList.contains('hidden')) m.querySelector('#omenBox button')?.click(); });
      await page.waitForFunction(() => !document.getElementById('map').classList.contains('hidden'));
      await page.waitForTimeout(300);
      await page.evaluate(() => { const n = document.querySelector('#mapSvg .node.avail'); if (n) n.dispatchEvent(new MouseEvent('click', { bubbles: true })); });
      await page.waitForFunction(() => !document.getElementById('battleBriefing').classList.contains('hidden'));
      await page.evaluate(() => document.getElementById('briefingEnter').click());
      await page.waitForFunction(() => document.getElementById('bossIntro').classList.contains('show'));

      const m = await page.evaluate(() => {
        const art = document.querySelector('.general-art').getBoundingClientRect();
        const card = document.querySelector('.general-card').getBoundingClientRect();
        const skip = document.getElementById('introSkip').getBoundingClientRect();
        const fit = getComputedStyle(document.querySelector('.general-art .portrait-img')).objectFit;
        return { aspect: art.width / art.height, fit, vh: innerHeight, cardBottom: card.bottom, skipBottom: skip.bottom, skipTop: skip.top };
      });
      // 正方立绘盒 + contain:全身零裁剪(240×240 方图在方盒内完整显示)
      expect(m.aspect).toBeGreaterThan(0.9);
      expect(m.aspect).toBeLessThan(1.1);
      expect(m.fit).toBe('contain');
      expect(m.cardBottom).toBeLessThanOrEqual(m.vh + 1);
      expect(m.skipBottom).toBeLessThanOrEqual(m.vh);
      expect(m.skipTop).toBeGreaterThanOrEqual(0);
    });
  }
});

test.describe('战书与谁争锋立绘', () => {
  async function openBriefing(page, chapter) {
    await page.goto(`/?fast=1&chapter=${chapter}&stage=boss&omen=sow&tutorial=0`);
    await page.waitForTimeout(500);
    await page.evaluate(() => document.getElementById('startBtn').click());
    await page.waitForFunction(() => !document.getElementById('page').classList.contains('hidden'));
    await page.evaluate(() => document.getElementById('openPage').click());
    await page.waitForFunction(() => !document.getElementById('map').classList.contains('hidden') || !document.getElementById('omenModal').classList.contains('hidden'));
    await page.waitForTimeout(200);
    await page.evaluate(() => { const m = document.getElementById('omenModal'); if (!m.classList.contains('hidden')) m.querySelector('#omenBox button')?.click(); });
    await page.waitForFunction(() => !document.getElementById('map').classList.contains('hidden'));
    await page.waitForTimeout(300);
    await page.evaluate(() => { const n = document.querySelector('#mapSvg .node.avail'); if (n) n.dispatchEvent(new MouseEvent('click', { bubbles: true })); });
    await page.waitForFunction(() => !document.getElementById('battleBriefing').classList.contains('hidden'));
  }

  async function versusMetrics(page) {
    return page.evaluate(() => {
      const cards = [...document.querySelectorAll('.briefing-enemy-art')].map(el => {
        const r = el.getBoundingClientRect();
        return { aspect: r.width / r.height, width: r.width };
      });
      const enter = document.getElementById('briefingEnter').getBoundingClientRect();
      return { cards, vh: innerHeight, enterBottom: enter.bottom, enterTop: enter.top };
    });
  }

  // 背景:≤640px 旧版立绘盒固定 72px 高,单将卡被 flex-grow 撑满整行(300px),
  // 240×240 方图 cover 后仅露顶部约 24% 高,面部被裁。修复:卡片限宽 156px
  // + 立绘正方盒(aspect-ratio 1/1),原图零裁剪。桌面 70×82 竖盒保持不变。
  for (const [w, h] of [[390, 844], [320, 568]]) {
    test(`宽 ${w}px:单将立绘正方完整,入阵按钮在屏内`, async ({ page }) => {
      await page.setViewportSize({ width: w, height: h });
      await openBriefing(page, 'hulao');
      const m = await versusMetrics(page);
      expect(m.cards).toHaveLength(1);
      expect(m.cards[0].aspect).toBeGreaterThan(0.95);
      expect(m.cards[0].aspect).toBeLessThan(1.05);
      expect(m.cards[0].width).toBeLessThanOrEqual(157);
      expect(m.enterBottom).toBeLessThanOrEqual(m.vh);
      expect(m.enterTop).toBeGreaterThanOrEqual(0);
    });
  }

  test('宽 390px:双将横排各为正方完整立绘', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await openBriefing(page, 'xianshan');
    const m = await versusMetrics(page);
    expect(m.cards).toHaveLength(2);
    for (const card of m.cards) {
      expect(card.aspect).toBeGreaterThan(0.95);
      expect(card.aspect).toBeLessThan(1.05);
    }
    expect(m.enterBottom).toBeLessThanOrEqual(m.vh);
  });

  test('桌面 1280px:竖向小卡布局不变', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await openBriefing(page, 'hulao');
    const m = await versusMetrics(page);
    expect(m.cards).toHaveLength(1);
    expect(m.cards[0].width).toBeLessThanOrEqual(72);
    expect(m.cards[0].aspect).toBeGreaterThan(0.8);
    expect(m.cards[0].aspect).toBeLessThan(0.9);
  });
});
