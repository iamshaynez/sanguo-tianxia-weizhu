// tests/e2e/practice.spec.js —— 野战练习场:入口、点兵台、战书、等筹码对局与多人布局
import { test, expect } from '@playwright/test';
import { newGame, installDriver, stopDriver, confirmBriefing } from './helpers.js';

// 目录入口与正史并列;进入后落在全屏点兵台
async function enterPracticeScreen(page) {
  await expect(page.locator('#scrollList .practiceGate')).toBeVisible();
  await page.click('[data-practice-gate]');
  await expect(page.locator('#practice')).toBeVisible();
  await expect(page.locator('#scroll')).toBeHidden();
}

test.describe('野战练习场', () => {
  test('目录与正史并列,点兵台分档陈列 33 处战场', async ({ page }) => {
    await newGame(page, 'fast=1');
    // 正史四卷 + 最后一页不受影响;野卷门枢独占一区
    await expect(page.locator('.scrollGroup')).toHaveCount(5);
    await expect(page.locator('.practiceGate-btn .portrait-img')).toHaveCount(4);
    await enterPracticeScreen(page);
    await expect(page.locator('#practiceList .practice-tier')).toHaveCount(7);
    await expect(page.locator('#practiceList .practice-arena')).toHaveCount(33);
    const tiers = page.locator('#practiceList .practice-tier');
    for (let i = 0; i < 7; i++) {
      await expect(tiers.nth(i)).toHaveAttribute('data-size', String(i + 2));
    }
    // 空态:未战,战绩栏为「○ / 未 战」
    await expect(page.locator('.pa-side').first()).toContainText('未 战');
    await expect(page.locator('#practiceStats')).toContainText('尚无战录');
    await page.click('#practiceBack');
    await expect(page.locator('#scroll')).toBeVisible();
    await expect(page.locator('#practice')).toBeHidden();
  });

  test('8 人桌:战书等额军资、七席对局、筹码守恒', async ({ page }) => {
    await newGame(page, 'fast=1&seed=PRAC801');
    await enterPracticeScreen(page);
    await page.locator('[data-arena="taodong"]').click();
    await expect(page.locator('#battleBriefing')).toHaveClass(/show/);
    await expect(page.locator('#briefingKicker')).toContainText('野战战书');
    await expect(page.locator('#briefingRound')).toContainText('8 人同桌 · 军资各 2800');
    await expect(page.locator('#briefingBack')).toContainText('返回选关');
    await expect(page.locator('.briefing-enemy')).toHaveCount(7);
    await confirmBriefing(page);

    await expect(page.locator('#battle')).toBeVisible();
    await expect(page.locator('#blindLabel')).toContainText('8人桌');
    await expect(page.locator('#oppChar .opponent-seat')).toHaveCount(7);
    await expect(page.locator('#oppChar')).toHaveAttribute('data-seat-count', '7');
    await expect(page.locator('#cardLayer .card[data-seat-id]')).toHaveCount(16);
    await expect(page.locator('#seedVal')).toContainText('#practice#taodong');

    const total = await page.evaluate(() => {
      const stacks = [...document.querySelectorAll('.opponent-seat .seat-stack strong')].reduce((sum, el) => sum + Number(el.textContent), 0);
      return Number(document.getElementById('youStack').textContent) + stacks + Number(document.getElementById('potNum').textContent);
    });
    expect(total).toBe(2800 * 8);

    // 自动玩家打几手:引擎在 8 人桌不报错,盲注与席位正常轮转
    await installDriver(page, 'station');
    await expect(page.locator('#blindLabel')).toContainText('第 2 手', { timeout: 120_000 });
    await stopDriver(page);
    await expect(page.locator('#errBox')).toBeEmpty();
  });

  test('战书返回:取消入席回到点兵台', async ({ page }) => {
    await newGame(page, 'fast=1');
    await enterPracticeScreen(page);
    await page.locator('[data-arena="wenjiu"]').click();
    await expect(page.locator('#battleBriefing')).toHaveClass(/show/);
    await expect(page.locator('#briefingReason')).not.toBeEmpty();
    await expect(page.locator('#briefingTitle')).toContainText('汜水关');
    await page.click('#briefingBack');
    await expect(page.locator('#practice')).toBeVisible();
    await expect(page.locator('#battleBriefing')).toBeHidden();
  });

  test('窄屏 8 人桌:席位可横滑,行动按钮不越界', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await newGame(page, 'fast=1&seed=PRAC802');
    await enterPracticeScreen(page);
    await page.locator('[data-arena="jiangdong"]').click();
    await confirmBriefing(page);
    await expect(page.locator('#battle')).toBeVisible();
    await expect(page.locator('#oppChar .opponent-seat')).toHaveCount(7);
    await expect(page.locator('#oppChar')).toHaveCSS('overflow-x', 'auto');
    await expect(page.locator('#actions')).toBeVisible();
    const buttons = await page.locator('#actions button').filter({ visible: true }).all();
    for (const button of buttons) {
      const box = await button.boundingBox();
      expect(box.x).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width).toBeLessThanOrEqual(390);
    }
    // 桌面卡牌层:16 张暗牌都落在桌面范围内
    const cards = await page.locator('#cardLayer .card:not(.big)').evaluateAll(els =>
      els.every(el => { const r = el.getBoundingClientRect(); return r.x >= -60 && r.x + r.width <= 450 && r.y >= 0; }));
    expect(cards).toBe(true);
    await expect(page.locator('#errBox')).toBeEmpty();
  });

  test('1v1 速局打完:练习簿与列传入账,回到点兵台', async ({ page }) => {
    await newGame(page, 'fast=1&seed=PRAC101');
    await enterPracticeScreen(page);
    await page.locator('[data-arena="wenjiu"]').click();
    await confirmBriefing(page);
    // 温酒局:军资 600,盲注 15/30 —— 全压流很快分出胜负
    await installDriver(page, 'maniac');
    await page.waitForFunction(() => {
      const practice = document.getElementById('practice');
      if (!practice || practice.classList.contains('hidden')) return false;
      const side = document.querySelector('#practiceList .practice-arena[data-arena="wenjiu"] .pa-side');
      return !!side && side.textContent.includes('胜');
    }, { timeout: 300_000 });
    await stopDriver(page);
    const side = page.locator('[data-arena="wenjiu"] .pa-side');
    await expect(side).toContainText(/胜/);
    await expect(page.locator('#practiceStats')).toContainText('已战 1 场');
    const save = await page.evaluate(() => JSON.parse(localStorage.getItem('yxj_v1') || '{}'));
    expect(save.practice.wenjiu.seen).toBe(1);
    expect(Object.keys(save.annals)).toContain('huaxiong');
    await expect(page.locator('#errBox')).toBeEmpty();
  });
});
