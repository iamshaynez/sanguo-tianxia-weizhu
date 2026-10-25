// tests/e2e/generals.spec.js —— 武将出场 L1-L5:签名破绽/台词/造型/列传/专属机制
import { test, expect } from '@playwright/test';
import {
  newGame, enterBattle, installDriver, stopDriver, loc,
} from './helpers.js';

// 大关测试用 ?stage=boss 直达关卡(行军图前段置竟),聚焦关卡本身

test.describe('L1/L2/L3:破绽、台词、造型', () => {
  test('吕布:开场白、原版头像、激将签名台词', async ({ page }) => {
    test.setTimeout(240_000);
    await newGame(page, 'fast=1&seed=GEN10&opp=60&omen=keenEye&chapter=hulao&stage=boss');
    await page.click('#openPage');
    await enterBattle(page, 'boss');
    // 开场白(第一手,不被发牌词抢话)
    await expect(page.locator('#bubble')).toContainText('天下无双', { timeout: 20_000 });
    // 牌桌席位与入场卡使用同一张原版头像
    await expect(page.locator('#oppPlate .portrait-img')).toHaveAttribute('data-skin', 'lvbu');
    await expect(page.locator('#oppPlate .portrait-img')).toHaveAttribute('src', './assets/portraits/san9/No_004.jpg');
    // 激将签名台词(心性 25,一点就着 → 暴怒句)
    await page.click('#tauntBtn');
    await expect(page.locator('#bubble')).toContainText('方天画戟');
  });

  test('签名破绽入图鉴:画戟横膝/赤兔刨蹄', async ({ page }) => {
    test.setTimeout(300_000);
    await newGame(page, 'fast=1&seed=GEN11&opp=200&omen=keenEye&chapter=hulao&stage=boss');
    await page.click('#openPage');
    await enterBattle(page, 'boss');
    await installDriver(page, 'station'); // 跟注站必达摊牌
    await expect(loc.codexItems(page).first()).toBeVisible({ timeout: 240_000 });
    const text = await page.locator('#codexList').textContent();
    expect(text).toMatch(/画戟横于膝上|赤兔不安地刨蹄/);
    expect(text).toMatch(/命中|假动作/);
    await stopDriver(page);
  });
});

test.describe('L4:列传', () => {
  test('观阵录:战绩入账、六维分档、出场回目、刷新不丢', async ({ page }) => {
    test.setTimeout(300_000);
    await newGame(page, 'fast=1&seed=GEN12&opp=60&omen=keenEye&chapter=hulao&stage=boss');
    await page.click('#openPage');
    await enterBattle(page, 'boss');
    // 打完关卡(司机全压流,胜负都入账;结算留给本用例验收)
    await installDriver(page, 'maniac', { autoSettle: false });
    await page.waitForFunction(() =>
      !document.getElementById('settle').classList.contains('hidden'), { timeout: 240_000 });
    await stopDriver(page);
    await page.evaluate(() => {
      const r = document.getElementById('settleRetry');
      if (r && r.style.display !== 'none') { r.click(); return; }
      document.getElementById('settleHome')?.click();
    });
    await page.waitForFunction(() =>
      !document.getElementById('scroll').classList.contains('hidden')
      || !document.getElementById('map').classList.contains('hidden'), { timeout: 30_000 });
    if (await page.locator('#scroll').isVisible()) {
      await page.click('#annalsBtn');
      await expect(page.locator('#annalsModal')).toBeVisible();
      const card = page.locator('.annalCard[data-gen="lvbu"]');
      await expect(card).toBeVisible();
      await expect(card.locator('.annalName')).toHaveText('吕布');
      await expect(card.locator('.annalRec')).toContainText('胜');
      await expect(card.locator('.annalBody')).toContainText('出场:虎牢');
      await expect(card.locator('.annalBody')).toContainText('万夫不当');
      await page.click('#annalsClose');
      // 刷新不丢(等开卷过渡完成;?chapter= 直达题记则先回目录)
      await page.reload();
      await page.click('#startBtn');
      await expect(page.locator('#scroll:not(.hidden), #page:not(.hidden)').first()).toBeVisible();
      if (await page.locator('#page').isVisible()) await page.click('#pageBack');
      await page.click('#annalsBtn');
      await expect(page.locator('.annalCard[data-gen="lvbu"]')).toBeVisible();
    } else {
      // 败北翻页重开中:直接验收持久化记录
      const a = await page.evaluate(() => JSON.parse(localStorage.getItem('yxj_v1')).annals.lvbu);
      expect(a.seen).toBeGreaterThanOrEqual(1);
    }
  });
});

test.describe('L5:专属机制与演出', () => {
  test('大关演出:白门楼关卡浮现吕布·困兽', async ({ page }) => {
    test.setTimeout(120_000);
    await newGame(page, 'fast=1&seed=GEN13&opp=60&omen=keenEye&chapter=baimenlou&stage=boss');
    await page.click('#openPage');
    const p = enterBattle(page, 'boss');
    await expect(page.locator('#bossIntro')).toHaveClass(/show/, { timeout: 30_000 });
    await expect(page.locator('#bossIntroName')).toHaveText('吕布 · 困兽');
    await expect(page.locator('#bossIntroRule')).not.toBeEmpty();
    await p;
  });

  test('七进七出:长坂坡清台后半仓再战', async ({ page }) => {
    test.setTimeout(300_000);
    await newGame(page, 'fast=1&seed=GEN14&chips=80&bossopp=99999&omen=sow&chapter=changban&stage=boss');
    await page.click('#openPage');
    await enterBattle(page, 'boss');
    await installDriver(page, 'maniac');
    await expect(page.locator('#bannerMain')).toContainText('七进七出', { timeout: 240_000 });
    await stopDriver(page);
  });

  test('白衣全谎:麦城前三手的摊牌破绽全是假动作', async ({ page }) => {
    test.setTimeout(300_000);
    await newGame(page, 'fast=1&seed=GEN15&opp=200&omen=keenEye&chapter=maicheng&stage=boss');
    await page.click('#openPage');
    await enterBattle(page, 'boss');
    await installDriver(page, 'station');
    await expect(loc.codexItems(page).first()).toBeVisible({ timeout: 240_000 });
    // 前三手(全谎窗口)内入册的条目应全部为假动作
    const items = await page.locator('#codexList li:not(.empty)').allTextContents();
    const early = items.filter(t => /第[1-3]手/.test(t));
    expect(early.length).toBeGreaterThanOrEqual(1);
    for (const t of early) expect(t).toContain('假动作');
    await stopDriver(page);
  });

  test('秋风起:五丈原第十手,他等到了', async ({ page }) => {
    test.setTimeout(300_000);
    await newGame(page, 'fast=1&seed=GEN16&chips=4000&opp=4000&omen=keenEye&chapter=wuzhangyuan&stage=boss');
    await page.click('#openPage');
    await enterBattle(page, 'boss');
    await installDriver(page, 'station'); // 深筹码拉扯到第十手
    await expect(page.locator('#bannerMain')).toContainText('秋风起', { timeout: 240_000 });
    await stopDriver(page);
  });
});
