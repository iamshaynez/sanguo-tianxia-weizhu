import { test, expect } from '@playwright/test';
import { newGame, clickAvailNode, confirmBriefing, installDriver, stopDriver } from './helpers.js';

async function enterChibi(page) {
  await clickAvailNode(page, 'boss');
  await confirmBriefing(page);
  for (const name of ['曹操 · 连舫', '周瑜 · 都督', '诸葛亮 · 借风']) {
    await expect(page.locator('#bossIntro')).toHaveClass(/show/);
    await expect(page.locator('#bossIntroName')).toHaveText(name);
    await page.click('#introSkip');
  }
  await expect(page.locator('#battle')).toBeVisible();
  await expect(page.locator('#blindLabel')).toContainText('4人桌');
}

test.describe('真实多人牌桌', () => {
  test('赤壁 1v3:逐将亮相、独立手牌、筹码守恒与定向攻心', async ({ page }) => {
    await newGame(page, 'fast=1&seed=MULTI01&chapter=chibi&omen=keenEye&stage=boss&bossopp=300,350,400');
    await page.click('#openPage');
    await enterChibi(page);
    await expect(page.locator('#oppChar .opponent-seat')).toHaveCount(3);
    await expect(page.locator('#cardLayer .card[data-seat-id]')).toHaveCount(8);
    const cards = await page.locator('#cardLayer .card[data-seat-id]').evaluateAll(els => els.map(el => ({ id: el.dataset.cardId, seat: el.dataset.seatId })));
    expect(new Set(cards.map(card => card.id)).size).toBe(8);
    for (const seat of ['player', 'opponent', 'opponent-2', 'opponent-3']) {
      expect(cards.filter(card => card.seat === seat)).toHaveLength(2);
    }
    const total = await page.evaluate(() => {
      const stacks = [...document.querySelectorAll('.opponent-seat .seat-stack strong')].reduce((sum, el) => sum + Number(el.textContent), 0);
      return Number(document.getElementById('youStack').textContent) + stacks + Number(document.getElementById('potNum').textContent);
    });
    expect(total).toBe(2050);

    await page.locator('.opponent-seat[data-seat-id="opponent-2"] .seat-card').click();
    await expect(page.locator('.opponent-seat[data-seat-id="opponent-2"] .seat-card')).toHaveClass(/is-selected/);
    await page.click('#tauntBtn');
    await expect(page.locator('.opponent-seat[data-seat-id="opponent-2"] .seat-tilt i.on')).not.toHaveCount(0);
    await expect(page.locator('.opponent-seat[data-seat-id="opponent"] .seat-tilt i.on')).toHaveCount(0);
    await expect(page.locator('.opponent-seat[data-seat-id="opponent-3"] .seat-tilt i.on')).toHaveCount(0);

    await installDriver(page, 'station');
    await expect(page.locator('#blindLabel')).toContainText('第 2 手', { timeout: 90_000 });
    await stopDriver(page);
    await expect(page.locator('#errBox')).toBeEmpty();
  });

  test('窄屏 1v3:席位可横滑,手牌与行动按钮不越界', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await newGame(page, 'fast=1&seed=MULTI03&chapter=chibi&omen=keenEye&stage=boss&bossopp=300,350,400');
    await page.click('#openPage');
    await enterChibi(page);
    await expect(page.locator('#oppChar .opponent-seat')).toHaveCount(3);
    await expect(page.locator('#cardLayer .card.big')).toHaveCount(2);
    await expect(page.locator('#actions')).toBeVisible();
    const buttons = await page.locator('#actions button').filter({ visible: true }).all();
    for (const button of buttons) {
      const box = await button.boundingBox();
      expect(box.x).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width).toBeLessThanOrEqual(390);
    }
    const playerCards = await page.locator('#cardLayer .card.big').evaluateAll(els => els.map(el => ({ left: el.getBoundingClientRect().left, right: el.getBoundingClientRect().right })));
    expect(playerCards[1].left).toBeGreaterThan(playerCards[0].right);
    const bannerBox = await page.locator('#bannerSub').boundingBox();
    const potBox = await page.locator('#potLabel').boundingBox();
    expect(bannerBox.y + bannerBox.height).toBeLessThan(potBox.y);
    const dims = await page.locator('#oppChar').evaluate(el => ({ client: el.clientWidth, scroll: el.scrollWidth }));
    expect(dims.scroll).toBeGreaterThanOrEqual(dims.client);
    await expect(page.locator('#errBox')).toBeEmpty();
  });

  test('多人战斗能完成淘汰并返回剧情流程', async ({ page }) => {
    test.setTimeout(240_000);
    await newGame(page, 'fast=1&seed=MULTI02&chapter=chibi&omen=keenEye&stage=boss&bossopp=60');
    await page.click('#openPage');
    await enterChibi(page);
    await installDriver(page, 'maniac');
    await page.waitForFunction(() =>
      !document.getElementById('settle').classList.contains('hidden'), { timeout: 180_000 });
    await stopDriver(page);
    await expect(page.locator('#settleTitle')).toContainText(/改写|兵败/);
    await expect(page.locator('#errBox')).toBeEmpty();
  });
});
