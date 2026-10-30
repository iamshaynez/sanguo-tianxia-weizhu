// tests/e2e/threekingdoms.spec.js —— 三国古风 UX:残卷、山河行军图、通用武将卡
import { test, expect } from '@playwright/test';
import { newGame, enterBattle, confirmBriefing } from './helpers.js';

async function seedAnnals(page) {
  await page.addInitScript(() => {
    localStorage.setItem('yxj_v1', JSON.stringify({
      pages: {}, endings: [], apocWins: 0,
      annals: { lvbu: { seen: 2, won: 1, tells: { strong: { n: 1, hit: 1 } } } },
    }));
  });
}

test.describe('三国古风界面', () => {
  test('开卷是汉末残卷,而非通用扑克大厅', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#intro h1')).toHaveText('三国：天下为注');
    await expect(page.locator('.intro-seal')).toHaveText('汉');
    await expect(page.locator('.intro-landscape')).toBeVisible();
    await expect(page.locator('.intro-era')).toContainText('残卷');
  });

  test('题记给出行军路线,地图绘有山河与可读地名', async ({ page }) => {
    await newGame(page, 'fast=1&omen=sow&chapter=taoyuan');
    await expect(page.locator('#pageRoute')).toContainText('涿郡');
    await expect(page.locator('#pageRoute')).toContainText('广宗');
    await page.click('#openPage');
    await expect(page.locator('#map')).toBeVisible();
    await expect(page.locator('#mapSvg .map-river')).toHaveCount(1);
    expect(await page.locator('#mapSvg .terrain-mountain').count()).toBeGreaterThanOrEqual(3);
    await expect(page.locator('#mapSvg .nlabel').first()).toContainText('涿郡');
  });
});

test.describe('通用武将卡', () => {
  test('无名遭遇战也有短亮相,六维来自本场对手', async ({ page }) => {
    await newGame(page, 'fast=1&seed=TK01&chapter=bowang&omen=sow');
    await page.click('#openPage');
    const entered = enterBattle(page, 'battle');
    await expect(page.locator('#bossIntro')).toHaveClass(/show/);
    await expect(page.locator('#bossIntro')).toHaveAttribute('data-kind', 'skirmish');
    await expect(page.locator('#bossIntroName')).toHaveText('曹军前锋');
    await expect(page.locator('#bossIntro .portrait-img')).toBeVisible();
    await expect(page.locator('#bossIntroTraits [data-trait]')).toHaveCount(6);
    await page.click('#introSkip');
    await entered;
    await expect(page.locator('#bossIntro')).toBeHidden();
  });

  test('亮相时连续点击同一军令,也只开启一场战斗', async ({ page }) => {
    await newGame(page, 'fast=1&seed=TK05&chapter=taoyuan&omen=sow');
    await page.click('#openPage');
    await page.evaluate(() => {
      const node = document.querySelector('#mapSvg .node.avail');
      for (let i = 0; i < 5; i++) node.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
    await expect(page.locator('#battleBriefing')).toBeVisible();
    await confirmBriefing(page);
    await expect(page.locator('#bossIntro')).toHaveClass(/show/);
    await page.click('#introSkip');
    await expect(page.locator('#battle')).toBeVisible();
    await expect(page.locator('#blindLabel')).toContainText('第 1 手');
    await page.waitForTimeout(1200); // 让任何误开的重复入场也全部落到牌桌
    await expect(page.locator('#cardLayer .card')).toHaveCount(4);
    await expect(page.locator('#errBox')).toBeEmpty();
  });

  test('吕布亮相:原版头像、小传、六维与战法同屏,可点击应战', async ({ page }) => {
    await newGame(page, 'fast=1&seed=TK02&chapter=hulao&omen=sow&stage=boss&opp=60');
    await page.click('#openPage');
    const entered = enterBattle(page, 'boss');
    await expect(page.locator('#bossIntro')).toHaveClass(/show/, { timeout: 30_000 });
    await expect(page.locator('#bossIntro')).toHaveAttribute('data-kind', 'boss');
    await expect(page.locator('#bossIntroName')).toHaveText('吕布');
    await expect(page.locator('#bossIntroBio')).toHaveText('虎牢关前，他把“天下无双”当作最短的战书。');
    await expect(page.locator('#bossIntro .portrait-img')).toHaveAttribute('data-skin', 'lvbu');
    await expect(page.locator('#bossIntro .portrait-img')).toHaveAttribute('src', './assets/portraits/san9/No_004.jpg');
    await expect(page.locator('#bossIntro .general-art svg')).toHaveCount(0);
    await expect.poll(() => page.locator('#bossIntro .portrait-img').evaluate(img => img.naturalWidth)).toBe(240);
    await expect(page.locator('#bossIntroTraits [data-trait]')).toHaveCount(6);
    await expect(page.locator('#bossIntroRule')).not.toBeEmpty();
    await expect(page.locator('#introSkip')).toBeVisible();
    await page.click('#introSkip');
    await entered;
    await expect(page.locator('#bossIntro')).toBeHidden();
    await expect(page.locator('#bannerMain')).toHaveText('吕布');
    await expect(page.locator('#bannerSub')).toContainText('你的筹码');
    if (await page.locator('#bubble').isVisible()) {
      const plate = await page.locator('#oppPlate').boundingBox();
      const bubble = await page.locator('#bubble').boundingBox();
      const overlap = Math.max(0, Math.min(plate.x + plate.width, bubble.x + bubble.width) - Math.max(plate.x, bubble.x))
        * Math.max(0, Math.min(plate.y + plate.height, bubble.y + bubble.height) - Math.max(plate.y, bubble.y));
      expect(overlap).toBe(0);
    }
  });

  test('观阵录复用同一立绘和六维语言', async ({ page }) => {
    await seedAnnals(page);
    await newGame(page, 'fast=1');
    await page.click('#annalsBtn');
    const card = page.locator('.annalCard[data-gen="lvbu"]');
    await expect(card).toBeVisible();
    await expect(card.locator('.portrait-img')).toHaveAttribute('data-skin', 'lvbu');
    await expect(card.locator('.portrait-img')).toHaveAttribute('src', './assets/portraits/san9/No_004.jpg');
    await expect(card.locator('.annalTraits [data-trait]')).toHaveCount(6);
    await expect(card.locator('.annalBody')).toContainText('万夫不当');
  });

  test('窄屏武将卡不越界,应战入口仍可见', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await newGame(page, 'seed=TK03&chapter=hulao&omen=sow&stage=boss&opp=60');
    await page.click('#openPage');
    const entered = enterBattle(page, 'boss');
    await expect(page.locator('#bossIntro')).toHaveClass(/show/, { timeout: 30_000 });
    const card = await page.locator('#generalIntroCard').boundingBox();
    expect(card.x).toBeGreaterThanOrEqual(0);
    expect(card.x + card.width).toBeLessThanOrEqual(390);
    expect(card.y).toBeGreaterThanOrEqual(0);
    expect(card.y + card.height).toBeLessThanOrEqual(844);
    await page.waitForTimeout(850); // 等入场定格,检查立绘没有被动画带出画像区
    const art = await page.locator('#bossIntro .general-art').boundingBox();
    const portrait = await page.locator('#bossIntro .portrait-img').boundingBox();
    expect(portrait.x).toBeGreaterThanOrEqual(art.x - 1);
    expect(portrait.x + portrait.width).toBeLessThanOrEqual(art.x + art.width + 1);
    await expect(page.locator('#introSkip')).toBeVisible();
    await page.click('#introSkip');
    await entered;
  });

  test('窄屏牌桌:行军标题不折行,行动不竖排,名牌不压手牌', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await newGame(page, 'fast=1&seed=TK04&chapter=hulao&omen=sow&stage=boss&opp=60');
    await page.click('#openPage');
    const marchTitle = await page.locator('#marchTitle').boundingBox();
    expect(marchTitle.height).toBeLessThan(32);
    await enterBattle(page, 'boss');
    await expect(page.locator('#actions')).toBeVisible();
    const visibleActions = page.locator('#actions button').filter({ visible: true });
    for (const button of await visibleActions.all()) {
      await expect(button).toHaveCSS('white-space', 'nowrap');
      const box = await button.boundingBox();
      expect(box.x).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width).toBeLessThanOrEqual(390);
    }
    const cards = await page.locator('#cardLayer .card.big').all();
    const boxes = await Promise.all(cards.map(c => c.boundingBox()));
    const plate = await page.locator('#youPlate').boundingBox();
    const overlaps = boxes.map(box => Math.max(0, Math.min(plate.x + plate.width, box.x + box.width) - Math.max(plate.x, box.x))
      * Math.max(0, Math.min(plate.y + plate.height, box.y + box.height) - Math.max(plate.y, box.y)));
    expect(overlaps).toEqual([0, 0]);
    // 手机端运势标签让位于种子行(顶部右栏);隐藏即无重叠,可见时才需断言
    const opp = await page.locator('#oppPlate').boundingBox();
    const luck = await page.locator('#luckLabel');
    if (await luck.isVisible()) {
      const luckBox = await luck.boundingBox();
      const topOverlap = Math.max(0, Math.min(opp.x + opp.width, luckBox.x + luckBox.width) - Math.max(opp.x, luckBox.x))
        * Math.max(0, Math.min(opp.y + opp.height, luckBox.y + luckBox.height) - Math.max(opp.y, luckBox.y));
      expect(topOverlap).toBe(0);
    } else {
      await expect(luck).toBeHidden();
    }
    const playerPile = await page.locator('#stStackP').boundingBox();
    const oppPile = await page.locator('#stStackO').boundingBox();
    expect(playerPile.x + playerPile.width).toBeLessThanOrEqual(390);
    expect(oppPile.x).toBeGreaterThanOrEqual(0);
  });
});
