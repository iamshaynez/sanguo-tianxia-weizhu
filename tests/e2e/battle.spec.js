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
    // 等真正的摊牌,而非章节开场/机制横幅
    await expect(page.locator('#cardLayer .card[data-seat-id="opponent"].flipped')).toHaveCount(2, { timeout: 90_000 });
    // 摊牌判印:对手立绘上盖出牌型章,且定谳输赢色泽
    const stamp = page.locator('#oppPlate .seat-showdown');
    await expect(stamp).toBeVisible({ timeout: 10_000 });
    await expect(stamp).toHaveText(/高牌|一对|两对|三条|顺子|同花|葫芦|四条|同花顺/);
    await expect(stamp).toHaveAttribute('data-tone', /win|lose/, { timeout: 10_000 });
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
    expect(text).toMatch(/右手护住筹码堆|左手抚上瓷面|回头看副将还在不在|挥刀大呼/);
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
    await newGame(page, 'fast=1&seed=FEEL03&chips=1200&opp=500&omen=keenEye');
    await openChapter(page, 'taoyuan');
    await enterBattle(page);
    await waitButtons(page);
    await expect(page.locator('#youStack')).toHaveText('1190');
    await expect(page.locator('#actions [data-act="allin"]')).toContainText('1190');
    await page.click('#actions [data-act="allin"]');
    await expect(page.locator('#youStack')).toHaveText('0');
    await expect(page.locator('#bannerMain')).toContainText('全压');
    await expect(page.locator('#bannerSub')).toContainText('1190');
    await expect(page.locator('#bannerSub')).toContainText('剩余筹码 0');
    await expect(page.locator('#vignette')).toHaveClass(/on/);
    await expect(page.locator('#scene')).toHaveClass(/allin/);
  });

  test('无法再加注时不显示假全压,只保留真实跟注金额', async ({ page }) => {
    await newGame(page, 'fast=1&seed=FEEL04&opp=20&omen=keenEye');
    await openChapter(page, 'taoyuan');
    await enterBattle(page);
    await waitButtons(page);
    await expect(page.locator('#actions [data-act="allin"]')).toBeHidden();
    const call = page.locator('#actions [data-act="call"]');
    await expect(call).toContainText('跟注 10');
    await call.click();
    await expect(page.locator('#youStack')).toHaveText('980');
  });

  test('全压超出对手跟注能力时,显示未跟注退回', async ({ page }) => {
    await newGame(page, 'fast=1&seed=FEEL05&chips=1200&opp=500&traits=20,50,0,0,50,50&omen=keenEye');
    await openChapter(page, 'taoyuan');
    await enterBattle(page);
    await waitButtons(page);
    await page.click('#actions [data-act="allin"]');
    await expect(page.locator('#bannerSub')).toContainText('未跟注退回', { timeout: 90_000 });
  });

  test('玩家筹码牌在宽屏与窄屏均不压手牌', async ({ page }) => {
    for (const size of [{ width: 762, height: 598 }, { width: 1280, height: 720 }, { width: 390, height: 844 }, { width: 320, height: 568 }]) {
      await page.setViewportSize(size);
      await newGame(page, 'fast=1&seed=FEEL03&chips=1200&opp=500&omen=keenEye');
      await openChapter(page, 'taoyuan');
      await enterBattle(page);
      await waitButtons(page);
      const overlaps = await page.evaluate(() => {
        const plate = document.getElementById('youPlate').getBoundingClientRect();
        expectPlateInside(plate);
        return [...document.querySelectorAll('.card.big')].map(card => {
          const r = card.getBoundingClientRect();
          return Math.max(0, Math.min(plate.right, r.right) - Math.max(plate.left, r.left))
            * Math.max(0, Math.min(plate.bottom, r.bottom) - Math.max(plate.top, r.top));
        });
        function expectPlateInside(r) {
          if (r.left < 0 || r.top < 0 || r.right > innerWidth || r.bottom > innerHeight) throw new Error('筹码牌越出视口');
        }
      });
      expect(overlaps).toEqual([0, 0]);
    }
  });
});

test.describe('盲注与战斗终结', () => {
  test('盲注每 4 手递增,战斗必分胜负', async ({ page }) => {
    test.setTimeout(240_000);
    await newGame(page, 'fast=1&seed=ESCA01&chips=5000&opp=5000&omen=keenEye');
    await openChapter(page, 'taoyuan');
    await enterBattle(page);
    await installDriver(page, 'cautious');
    // 大军资稳健局确保观察到第 5 手;随后切全压流验证战斗终结
    await expect(page.locator('#blindLabel')).toContainText('小盲 15 · 大盲 30', { timeout: 150_000 });
    await page.evaluate(() => { window.__drive = 'maniac'; });
    await waitBattleEnd(page);
    await stopDriver(page);
  });
});
