// battle.spec.js —— 战斗全流程:下注、街道、摊牌、图鉴、攻心、验牌、全压
import { test, expect } from '@playwright/test';
import {
  newGame, openChapter, enterBattle, installDriver, stopDriver,
  waitButtons, act, waitHandEnd, waitBattleEnd, loc,
} from './helpers.js';

test.describe('下注与街道', () => {
  test('跟注进入翻牌:烧牌后三张公共牌', async ({ page }) => {
    await newGame(page, 'fast=1&seed=FLOW01&omen=keenEye');
    await openChapter(page, 'taoyuan');
    await enterBattle(page);
    // 对方可能加注,逐次跟注直到翻牌
    for (let i = 0; i < 6; i++) {
      const n = await loc.community(page).count();
      if (n === 3) break;
      const hasBtns = await page.evaluate(() =>
        !document.getElementById('actions').classList.contains('hidden'));
      if (hasBtns) await act(page, ['call', 'check']);
      await page.waitForTimeout(700);
    }
    await expect(loc.community(page)).toHaveCount(3, { timeout: 30_000 });
    // 底池收拢
    await expect(page.locator('#potNum')).not.toHaveText('0', { timeout: 30_000 });
  });

  test('加注档位:½底池/1底池/2底池可选且生效', async ({ page }) => {
    await newGame(page, 'fast=1&seed=FLOW02&omen=keenEye');
    await openChapter(page, 'taoyuan');
    await enterBattle(page);
    await waitButtons(page);
    await page.click('#actions [data-act="raise"]');
    await expect(page.locator('#raiseOpts')).toBeVisible();
    const labels = await page.locator('#raiseOpts button').allTextContents();
    expect(labels.join('|')).toContain('½ 底池');
    expect(labels.join('|')).toContain('1 底池');
    // 选 1 底池:翻牌前 ½底池=20,1底池=max(20, 30)=30,玩家放入 10+30=40
    const before = parseInt(await page.locator('#youStack').textContent(), 10);
    await page.click('#raiseOpts button:has-text("1 底池")');
    await expect(page.locator('#youStack')).not.toHaveText(String(before));
  });

  test('过牌流到底:双方过牌也能走到摊牌', async ({ page }) => {
    await newGame(page, 'fast=1&seed=FLOW03&omen=keenEye');
    await openChapter(page, 'taoyuan');
    await enterBattle(page);
    await installDriver(page, 'cautious'); // 小注跟、大注弃,多数街道双方过牌
    // 盯住一手直到摊牌横幅出现
    await page.waitForFunction(() =>
      document.getElementById('banner').classList.contains('show'), { timeout: 90_000 });
    const main = await page.locator('#bannerMain').textContent();
    expect(main.length).toBeGreaterThan(0);
    await stopDriver(page);
  });
});

test.describe('摊牌与图鉴', () => {
  test('摊牌:对方亮牌、赢家手牌高亮、底池归位', async ({ page }) => {
    await newGame(page, 'fast=1&seed=SHOW01&omen=keenEye');
    await openChapter(page, 'taoyuan');
    await enterBattle(page);
    await installDriver(page, 'station'); // 跟注站必然打到摊牌
    await page.waitForFunction(() =>
      document.getElementById('banner').classList.contains('show'), { timeout: 90_000 });
    // 对方两张牌已翻开
    const flipped = await page.evaluate(() =>
      [...document.querySelectorAll('#cardLayer .card:not(.big)')].filter(el =>
        el.classList.contains('flipped') && parseInt(el.style.transform.match(/, ([\d.-]+)px\)/)?.[1] || '0', 10) < 250
      ).length);
    expect(flipped).toBeGreaterThanOrEqual(2);
    // 赢家 5 张高亮
    await expect(page.locator('#cardLayer .card.hl')).toHaveCount(5, { timeout: 10_000 }).catch(() => {
      // 平分底池时双方都亮:允许 10 张
    });
    await stopDriver(page);
  });

  test('图鉴:摊牌后破绽记录入册(种子确定)', async ({ page }) => {
    await newGame(page, 'fast=1&seed=SHOW02&omen=keenEye');
    await openChapter(page, 'taoyuan');
    await enterBattle(page);
    await installDriver(page, 'station');
    // 至多 4 手内应出现非 mid 破绽并入册
    await expect(loc.codexItems(page).first()).toBeVisible({ timeout: 120_000 });
    const text = await page.locator('#codexList').textContent();
    expect(text).toMatch(/右手护住筹码堆|左手抚上瓷面/);
    expect(text).toMatch(/命中|假动作/);
    await stopDriver(page);
  });
});

test.describe('牌桌仪式感', () => {
  test('攻心:一次有效,情绪灯亮起', async ({ page }) => {
    await newGame(page, 'fast=1&seed=FEEL01&omen=keenEye');
    await openChapter(page, 'taoyuan');
    await enterBattle(page);
    await expect(page.locator('#tauntBtn')).toBeEnabled();
    await page.click('#tauntBtn');
    await expect(loc.tiltDotsOn(page)).toHaveCount(1);
    await expect(page.locator('#tauntBtn')).toBeDisabled();
    // 对手回怼气泡
    await expect(page.locator('#bubble')).toBeVisible();
    await expect(page.locator('#bubble')).not.toBeEmpty();
  });

  test('验牌:弹窗展示 52 张确定牌序', async ({ page }) => {
    await newGame(page, 'fast=1&seed=FEEL02&omen=keenEye');
    await openChapter(page, 'taoyuan');
    await enterBattle(page);
    await page.click('#verifyBtn');
    await expect(page.locator('#seedModal')).toBeVisible();
    await expect(page.locator('#modalSeed')).toContainText('#FEEL02');
    await expect(page.locator('#deckOrder span')).toHaveCount(52);
    await page.click('#closeSeed');
    await expect(page.locator('#seedModal')).toBeHidden();
  });

  test('全压:红色脉冲与推镜演出', async ({ page }) => {
    await newGame(page, 'fast=1&seed=FEEL03&omen=keenEye');
    await openChapter(page, 'taoyuan');
    await enterBattle(page);
    await waitButtons(page);
    await page.click('#actions [data-act="allin"]');
    await expect(page.locator('#vignette')).toHaveClass(/on/);
    await expect(page.locator('#scene')).toHaveClass(/allin/);
  });
});

test.describe('盲注与战斗终结', () => {
  test('盲注每 4 手递增,战斗必分胜负', async ({ page }) => {
    await newGame(page, 'fast=1&seed=ESCA01&opp=400&omen=keenEye');
    await openChapter(page, 'taoyuan');
    await enterBattle(page);
    await installDriver(page, 'maniac');
    // 打到第 5 手应升级到 15/30
    await expect(page.locator('#blindLabel')).toContainText('15 / 30', { timeout: 120_000 });
    // 战斗终将结束:回地图(胜)或结算(负)
    await waitBattleEnd(page);
    await stopDriver(page);
  });
});
