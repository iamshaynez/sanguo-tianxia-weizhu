// tests/e2e/seats.spec.js —— 牌桌武将席位与多人布局
import { test, expect } from '@playwright/test';
import { newGame, enterBattle } from './helpers.js';

test('牌桌使用原版头像,席位可打开完整武将卡', async ({ page }) => {
  await newGame(page, 'fast=1&seed=SEAT01&chapter=hulao&omen=sow&stage=boss&opp=600');
  await page.click('#openPage');
  await enterBattle(page, 'boss');
  const portrait = page.locator('#oppPlate .portrait-img');
  await expect(portrait).toHaveAttribute('data-skin', 'lvbu');
  await expect(portrait).toHaveAttribute('src', './assets/portraits/san9/No_004.jpg');
  await expect.poll(() => portrait.evaluate(img => img.naturalWidth)).toBe(240);
  await expect(page.locator('#oppChar svg')).toHaveCount(0);

  await page.click('#oppPlate .seat-profile');
  await expect(page.locator('#bossIntro')).toHaveClass(/show/);
  await expect(page.locator('#bossIntroName')).toHaveText('吕布');
  await expect(page.locator('#bossIntroBio')).toHaveText('天下第一,不肯低头。');
  await expect(page.locator('#bossIntroTraits [data-trait]')).toHaveCount(6);
  await expect(page.locator('#introSkip')).toContainText('合 卷');
  await page.click('#introSkip');
  await expect(page.locator('#bossIntro')).toBeHidden();
  await expect(page.locator('#battle')).toBeVisible();
});

test('六人桌复用五个对手席位,公共牌区不被挤压', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/tests/fixtures/seat-layout.html');
  await expect(page.locator('.opponent-seat')).toHaveCount(5);
  await expect(page.locator('#oppChar')).toHaveAttribute('data-seat-count', '5');
  await expect(page.locator('[data-seat-id="zhuge"] .seat-card')).toHaveClass(/is-active/);
  await expect(page.locator('.opponent-seat .portrait-img')).toHaveCount(5);
  await expect.poll(() => page.locator('.opponent-seat .portrait-img').evaluateAll(imgs => imgs.every(img => img.naturalWidth === 240))).toBe(true);

  const dock = await page.locator('#oppChar').boundingBox();
  const table = await page.locator('#table').boundingBox();
  expect(dock.x).toBeGreaterThanOrEqual(0);
  expect(dock.x + dock.width).toBeLessThanOrEqual(1440);
  expect(dock.y + dock.height).toBeLessThan(table.y);

  await page.setViewportSize({ width: 390, height: 844 });
  const mobileDock = await page.locator('#oppChar').boundingBox();
  const mobileTable = await page.locator('#table').boundingBox();
  expect(mobileDock.x).toBeGreaterThanOrEqual(0);
  expect(mobileDock.x + mobileDock.width).toBeLessThanOrEqual(390);
  expect(mobileDock.y + mobileDock.height).toBeLessThan(mobileTable.y);
  expect(await page.locator('#oppChar').evaluate(el => el.scrollWidth > el.clientWidth)).toBe(true);

  await expect.poll(async () => {
    const active = await page.locator('[data-seat-id="zhuge"]').boundingBox();
    return active.x >= 0 && active.x + active.width <= 390;
  }).toBe(true);
  const last = page.locator('[data-seat-id="simayi"]');
  await last.scrollIntoViewIfNeeded();
  const lastBox = await last.boundingBox();
  expect(lastBox.x).toBeGreaterThanOrEqual(0);
  expect(lastBox.x + lastBox.width).toBeLessThanOrEqual(390);
});
