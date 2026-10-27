// table-visuals.spec.js —— 席位盲注角色、多人弃牌收牌与下一手状态复位
import { test, expect } from '@playwright/test';
import {
  newGame, enterBattle, clickAvailNode, confirmBriefing,
  installDriver, stopDriver, waitButtons,
} from './helpers.js';

async function enterChibi(page) {
  await clickAvailNode(page, 'boss');
  await confirmBriefing(page);
  for (const name of ['曹操 · 连舫', '周瑜 · 都督', '诸葛亮 · 借风']) {
    await expect(page.locator('#bossIntro')).toHaveClass(/show/);
    await expect(page.locator('#bossIntroName')).toHaveText(name);
    await page.click('#introSkip');
  }
  await expect(page.locator('#battle')).toBeVisible();
}

test('单挑盲注标到双方席位,下一手庄与大小盲一起轮换', async ({ page }) => {
  await newGame(page, 'fast=1&seed=ROLE1&chapter=taoyuan&omen=sow');
  await page.click('#openPage');
  await enterBattle(page);
  await expect(page.locator('#blindLabel')).toHaveText('小盲 10 · 大盲 20 · 第 1 手');
  await expect(page.locator('#playerRoles [data-role="button"]')).toHaveText('庄');
  await expect(page.locator('#playerRoles [data-role="sb"]')).toHaveText('小盲 10');
  await expect(page.locator('.opponent-seat[data-seat-id="opponent"] [data-role="bb"]')).toHaveText('大盲 20');
  await page.click('#actions [data-act="fold"]');
  await expect(page.locator('#blindLabel')).toContainText('第 2 手', { timeout: 30_000 });
  await expect(page.locator('#playerRoles [data-role="bb"]')).toHaveText('大盲 20');
  await expect(page.locator('#playerRoles [data-role="button"]')).toHaveCount(0);
  await expect(page.locator('.opponent-seat[data-seat-id="opponent"] [data-role="button"]')).toHaveText('庄');
  await expect(page.locator('.opponent-seat[data-seat-id="opponent"] [data-role="sb"]')).toHaveText('小盲 10');
});

test('四人桌角色清晰,玩家弃牌立即收牌并观战,下一手恢复', async ({ page }) => {
  await newGame(page, 'fast=1&seed=ROLE2&chapter=chibi&omen=keenEye&stage=boss&bossopp=300,350,400');
  await page.click('#openPage');
  await enterChibi(page);
  await expect(page.locator('#blindLabel')).toHaveText('小盲 10 · 大盲 20 · 第 1 手 · 4人桌');
  await expect(page.locator('#playerRoles [data-role="button"]')).toHaveText('庄');
  await expect(page.locator('#playerRoles [data-role="sb"], #playerRoles [data-role="bb"]')).toHaveCount(0);
  await expect(page.locator('.opponent-seat[data-seat-id="opponent"] [data-role="sb"]')).toHaveText('小盲 10');
  await expect(page.locator('.opponent-seat[data-seat-id="opponent-2"] [data-role="bb"]')).toHaveText('大盲 20');
  await expect(page.locator('.opponent-seat[data-seat-id="opponent-3"] .seat-roles')).toBeHidden();
  await waitButtons(page);
  await page.click('#actions [data-act="fold"]');
  await expect(page.locator('#youPlate')).toHaveClass(/is-folded/);
  await expect(page.locator('#playerFoldStatus')).toHaveText('已弃牌 · 观战');
  await expect(page.locator('#cardLayer .card[data-seat-id="player"]')).toHaveCount(0);
  await expect(page.locator('#cardLayer .card[data-seat-id]:not(.big)')).not.toHaveCount(0);
  await installDriver(page, 'station');
  try {
    await expect(page.locator('#blindLabel')).toContainText('第 2 手', { timeout: 60_000 });
  } finally {
    await stopDriver(page);
  }
  await expect(page.locator('#youPlate')).not.toHaveClass(/is-folded/);
  await expect(page.locator('#playerFoldStatus')).toBeHidden();
  await expect(page.locator('#cardLayer .card[data-seat-id="player"]')).toHaveCount(2);
});

test('AI 多人中途弃牌后席位持续标识,其两张手牌立即移出桌面', async ({ page }) => {
  test.setTimeout(90_000);
  await newGame(page, 'fast=1&seed=ROLE3&chapter=chibi&omen=keenEye&stage=boss&bossopp=300,350,400');
  await page.click('#openPage');
  await enterChibi(page);
  await installDriver(page, 'maniac');
  const folded = page.locator('.opponent-seat:has(.seat-card.is-folded)').first();
  try {
    await expect(folded).toBeVisible({ timeout: 60_000 });
    await stopDriver(page);
  } finally {
    await stopDriver(page);
  }
  const seatId = await folded.getAttribute('data-seat-id');
  await expect(folded.locator('.seat-fold-status')).toHaveText('已弃牌');
  await expect(folded.locator('.seat-fold-status')).toBeVisible();
  await expect(page.locator(`#cardLayer .card[data-seat-id="${seatId}"]`)).toHaveCount(0);
  await expect(page.locator('#cardLayer .card[data-seat-id]:not(.big)')).not.toHaveCount(0);
});
