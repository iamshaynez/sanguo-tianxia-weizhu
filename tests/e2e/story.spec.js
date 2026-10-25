import { test, expect } from '@playwright/test';
import { newGame, clickAvailNode, installDriver, stopDriver } from './helpers.js';

async function save(page) {
  return page.evaluate(() => JSON.parse(localStorage.getItem('yxj_v1') || '{}'));
}

test.describe('章回剧情与故人记忆', () => {
  test('虎牢冷开场、故人名单与专属地图选择真实生效', async ({ page }) => {
    await newGame(page, 'fast=1&seed=ST01&chapter=hulao&omen=sow&node=m1');
    await expect(page.locator('#pageColdOpen')).toContainText('刘备');
    await expect(page.locator('#pageCast')).toContainText('关羽');
    await expect(page.locator('#pageObjective')).toContainText('虎牢关');
    await page.click('#openPage');
    await clickAvailNode(page, 'chest');
    await expect(page.locator('#eventBox')).toContainText('三英旧约');
    await expect(page.locator('#eventBox')).toContainText('他的强，不在每一手都进');
    await page.click('[data-choice="allies"]');
    await expect(page.locator('#runChips')).toHaveText('1100');
    const state = await save(page);
    expect(state.story.choices['hulao.three-heroes']).toBe('allies');
    expect(state.story.facts.hulao_allies).toBe(true);
    expect(state.story.seen['hulao.three-heroes']).toBe(1);
  });

  test('白门楼改写会改变煮酒开场与曹操入场', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('yxj_v1', JSON.stringify({
        pages: { hulao: 'yeshi', baimenlou: 'yeshi' },
        annals: { lvbu: { seen: 2, won: 1, tells: {} } },
        tutorial: { introDone: true, steps: {}, skipped: true },
      }));
    });
    await newGame(page, 'fast=1&seed=ST02&chapter=zhujiu&omen=sow&stage=boss&intro=1');
    await expect(page.locator('#pageColdOpen')).toContainText('白门楼上你替他选了一条活路');
    await page.click('#openPage');
    await clickAvailNode(page, 'boss');
    await expect(page.locator('#bossIntro')).toHaveClass(/show/);
    await expect(page.locator('#bossIntroBio')).toContainText('白门楼');
    await expect(page.locator('#bossIntroQuote')).toContainText('奉先未死');
  });

  test('named 连战与第三顾都有独立的当前轮剧情', async ({ page }) => {
    await newGame(page, 'fast=1&seed=ST04&chapter=qianli&omen=sow&stage=boss&round=5&intro=1');
    await page.click('#openPage');
    await clickAvailNode(page, 'boss');
    await expect(page.locator('#bossIntroName')).toHaveText('秦琪 · 黄河渡');
    await expect(page.locator('#bossIntroBio')).toContainText('黄河渡口');

    await newGame(page, 'fast=1&seed=ST05&chapter=sangu&omen=sow&stage=boss&round=3&intro=1');
    await page.click('#openPage');
    await clickAvailNode(page, 'boss');
    await expect(page.locator('#battle')).toBeVisible();
    await expect(page.locator('#bannerSub')).toContainText('胜后会不会狂');
  });

  test('窄屏长剧情页保留启程入口且不越界', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await newGame(page, 'fast=1&seed=ST06&chapter=changban&omen=sow');
    await expect(page.locator('#pageColdOpen')).toContainText('赵云');
    const book = await page.locator('.page-book').boundingBox();
    expect(book.x).toBeGreaterThanOrEqual(0);
    expect(book.x + book.width).toBeLessThanOrEqual(390);
    expect(book.y).toBeGreaterThanOrEqual(0);
    expect(book.y + book.height).toBeLessThanOrEqual(844);
    await expect(page.locator('#openPage')).toBeVisible();
  });

  test('兵败留下史鉴,翻页重开时真实减少假破绽', async ({ page }) => {
    test.setTimeout(240_000);
    await newGame(page, 'fast=1&seed=ST03&chips=80&bossopp=5000&chapter=hulao&stage=boss&omen=sow');
    await page.click('#openPage');
    await installDriver(page, 'maniac', { autoSettle: false });
    await clickAvailNode(page, 'boss');
    await expect(page.locator('#settle')).toBeVisible({ timeout: 150_000 });
    await stopDriver(page);
    await expect(page.locator('#settleNote')).toContainText('第五张公共牌');
    await expect(page.locator('#settleClue')).toContainText('假破绽会减少');
    expect((await save(page)).story.clues.hulao).toBe(true);
    await page.click('#settleRetry');
    await expect(page.locator('#marchInfo')).toContainText('史鉴生效');
  });
});
