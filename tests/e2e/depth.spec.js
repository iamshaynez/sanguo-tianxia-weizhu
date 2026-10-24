// tests/e2e/depth.spec.js —— 深度层:全回演出 / 执子之手 / 页间因果 / 残卷无终稿
import { test, expect } from '@playwright/test';
import { newGame, enterBattle, installDriver, stopDriver, waitButtons } from './helpers.js';

const seedProgress = (pages, endings = []) => page => page.addInitScript(
  ([p, e]) => localStorage.setItem('yxj_v1', JSON.stringify({ pages: p, endings: e, annals: {}, apocWins: 0 })),
  [pages, endings]);

test.describe('全回开场演出', () => {
  test('普通回关卡也有入场:虎牢浮现吕布(轻量版)', async ({ page }) => {
    await newGame(page, 'fast=1&seed=DP10&chapter=hulao&omen=sow&stage=boss&opp=60');
    await page.click('#openPage');
    const p = enterBattle(page, 'boss');
    await expect(page.locator('#bossIntro')).toHaveClass(/show/, { timeout: 30_000 });
    await expect(page.locator('#bossIntroName')).toHaveText('吕布');
    // 普通回:非大关样式
    await expect(page.locator('#bossIntro')).not.toHaveClass(/gate/);
    await p;
  });
});

test.describe('执子之手', () => {
  test('五丈原改写后解锁:执丞相之名,攻心化为观星', async ({ page }) => {
    test.setTimeout(240_000);
    await seedProgress({ wuzhangyuan: 'yeshi' })(page);
    await newGame(page, 'fast=1&seed=DP11&chapter=wuzhangyuan&omen=sow&stage=boss&opp=60');
    await expect(page.locator('#pageAlt')).toBeVisible();
    await expect(page.locator('#pageAlt')).toHaveText('执子之手');
    await page.click('#pageAlt');
    await enterBattle(page, 'boss');
    // 名牌与按钮让位
    await expect(page.locator('#youName')).toHaveText('诸葛亮');
    await expect(page.locator('#tauntBtn')).toHaveText('观 星');
    // 观星:洞悉其真实之势(首手发牌后)
    await waitButtons(page);
    await page.click('#tauntBtn');
    await expect(page.locator('#bubble')).toContainText('其势实为', { timeout: 10_000 });
    await expect(page.locator('#tauntBtn')).toBeDisabled();
  });

  test('未改写五丈原时,执子之手不出现', async ({ page }) => {
    await newGame(page, 'fast=1&seed=DP12&chapter=wuzhangyuan&omen=sow');
    await expect(page.locator('#page')).toBeVisible();
    await expect(page.locator('#pageAlt')).toBeHidden();
  });
});

test.describe('页间因果', () => {
  test('麦城已改:夷陵题记随变', async ({ page }) => {
    await seedProgress({ maicheng: 'yeshi' })(page);
    await newGame(page, 'fast=1&seed=DP13&chapter=yiling&omen=sow');
    await expect(page.locator('#page')).toBeVisible();
    await expect(page.locator('#pagePremise')).toHaveText('若荆州无恙,何来这一场大火。');
    await expect(page.locator('#pageNote')).toContainText('麦城既改');
  });

  test('麦城未改:夷陵保持原题记', async ({ page }) => {
    await newGame(page, 'fast=1&seed=DP14&chapter=yiling&omen=sow');
    await expect(page.locator('#page')).toBeVisible();
    await expect(page.locator('#pagePremise')).toHaveText('若七百里连营,不在林中。');
  });
});

test.describe('残卷无终稿(NG+)', () => {
  test('通关后开放:随机外传页,胜场入账', async ({ page }) => {
    test.setTimeout(300_000);
    await seedProgress({}, ['问他:你是谁?'])(page);
    await newGame(page, 'fast=1&seed=DP15&chips=2000&bossopp=1&omen=sow&stage=boss');
    await expect(page.locator('#apocBtn')).toBeVisible();
    await page.click('#apocBtn');
    await expect(page.locator('#page')).toBeVisible();
    await expect(page.locator('#pageName')).toContainText('外传 ·');
    await page.click('#openPage');
    await enterBattle(page, 'boss');
    await expect(page.locator('#oppName')).toContainText('· 夜行');
    // 一枚筹码的关隘:全压流必然碾过
    await installDriver(page, 'maniac');
    await page.waitForFunction(() =>
      !document.getElementById('settle').classList.contains('hidden')
      || !document.getElementById('scroll').classList.contains('hidden'), { timeout: 240_000 });
    await stopDriver(page);
    // 亲手合上结算(计数在点「回目录」时落账)
    await page.evaluate(() => {
      const st = document.getElementById('settle');
      if (!st.classList.contains('hidden')) {
        document.getElementById('settleHome')?.click();
      }
    });
    await page.waitForFunction(() =>
      !document.getElementById('scroll').classList.contains('hidden'), { timeout: 30_000 });
    const wins = await page.evaluate(() => JSON.parse(localStorage.getItem('yxj_v1')).apocWins || 0);
    expect(wins).toBeGreaterThanOrEqual(1);
  });

  test('未通关时,无终稿不现', async ({ page }) => {
    await newGame(page, 'fast=1&seed=DP16');
    await expect(page.locator('#scroll')).toBeVisible();
    await expect(page.locator('#apocBtn')).toBeHidden();
  });
});
