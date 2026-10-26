// run.spec.js —— 残卷推进:行军图、事件、兵败批注、改写持久化、大关回与终局
import { test, expect } from '@playwright/test';
import {
  newGame, openChapter, enterBattle, clickAvailNode,
  installDriver, stopDriver, waitBattleEnd, winChapter,
} from './helpers.js';

// 预置补全度(用户视角:这些页面此前已被改写)
const seedProgress = (pages, endings = []) => page => page.addInitScript(
  ([p, e]) => localStorage.setItem('yxj_v1', JSON.stringify({ pages: p, endings: e })),
  [pages, endings]);

test.describe('行军图与事件', () => {
  test('战斗胜利:节点完成、筹码继承、章节事件与关底解锁', async ({ page }) => {
    await newGame(page, 'fast=1&seed=RUN01&opp=120');
    await openChapter(page, 'taoyuan');
    const chipsBefore = parseInt(await page.locator('#runChips').textContent(), 10);
    await enterBattle(page);
    await installDriver(page, 'maniac');
    await waitBattleEnd(page);
    await stopDriver(page);
    await expect(page.locator('#map')).toBeVisible();
    // 首节点完成,下一段(辎重·桃林)解锁
    await expect(page.locator('#mapSvg .node.done')).toHaveCount(1);
    await expect(page.locator('#mapSvg .node.avail')).toHaveClass(/t-chest/);
    // 筹码继承(已变化)
    const chipsAfter = parseInt(await page.locator('#runChips').textContent(), 10);
    expect(chipsAfter).not.toBe(chipsBefore);
    // 桃林章节事件:选择乡勇退路,军资不因重复点击而变化
    await clickAvailNode(page, 'chest');
    await expect(page.locator('#eventModal')).toBeVisible();
    await expect(page.locator('#eventBox')).toContainText('桃林');
    await page.click('[data-choice="village-rearguard"]');
    await expect(page.locator('#runChips')).toHaveText(String(chipsAfter));
    // 关卡解锁
    await expect(page.locator('#mapSvg .node.avail')).toHaveClass(/t-boss/);
  });
});

test.describe('兵败与批注', () => {
  test('兵败:批注浮现、原卷入账、翻页重开同一页', async ({ page }) => {
    test.setTimeout(300_000);
    await newGame(page, 'fast=1&seed=RUN02&chips=80&opp=5000');
    await openChapter(page, 'taoyuan');
    await enterBattle(page);
    await installDriver(page, 'maniac', { autoSettle: false }); // 全压送死;结算留给本用例亲手验收
    await expect(page.locator('#settle')).toBeVisible({ timeout: 120_000 });
    await stopDriver(page);
    await expect(page.locator('#settleTitle')).toHaveText('这一页,兵败');
    await expect(page.locator('#settleNote')).toContainText('同生共死');
    await expect(page.locator('#settleClue')).toContainText('互救不是三人一起全押');
    await expect(page.locator('#settleHistory')).toContainText('原卷:黄巾起');
    // 正史入账
    const st = await page.evaluate(() => JSON.parse(localStorage.getItem('yxj_v1')).pages.taoyuan);
    expect(st).toBe('history');
    // 翻页重开:回到同一页行军图,节点重置
    await page.click('#settleRetry');
    await expect(page.locator('#map')).toBeVisible();
    await expect(page.locator('#mapSvg .node.done')).toHaveCount(0);
    await expect(page.locator('#mapSvg .node.avail')).toHaveCount(1);
  });
});

test.describe('改写与持久化', () => {
  test('整页改写:野史结算、目录盖章、刷新不丢', async ({ page }) => {
    test.setTimeout(360_000);
    await newGame(page, 'fast=1&seed=RUN03&opp=120');
    await openChapter(page, 'taoyuan');
    const won = await winChapter(page, 'taoyuan');
    expect(won).toBeTruthy();
    await expect(page.locator('#scroll')).toBeVisible();
    await expect(page.locator('[data-ch="taoyuan"]')).toHaveClass(/st-yeshi/);
    await expect(page.locator('#codexProgress')).toContainText('已改写 1 / 50');
    // 刷新后仍在
    await page.reload();
    await page.click('#startBtn');
    await expect(page.locator('[data-ch="taoyuan"]')).toHaveClass(/st-yeshi/);
  });

  test('抉择页:赢下华容道,刀落或刀未落皆入野史', async ({ page }) => {
    test.setTimeout(360_000);
    await newGame(page, 'fast=1&seed=RUN04&opp=100&chapter=huarong');
    await expect(page.locator('#page')).toBeVisible();
    await page.click('#openPage');
    const won = await winChapter(page, 'huarong');
    expect(won).toBeTruthy();
    const st = await page.evaluate(() => JSON.parse(localStorage.getItem('yxj_v1')).pages.huarong);
    expect(['yeshi', 'yeshiB', 'yeshiAB']).toContain(st);
  });

  test('连战页:千里走单骑,五阵连破', async ({ page }) => {
    test.setTimeout(540_000); // 必须大于 winChapter 的 480s 自主作战预算,留出清理时间
    await newGame(page, 'fast=1&seed=RUN05&chips=5000&opp=20&chapter=qianli');
    await page.click('#openPage');
    const won = await winChapter(page, 'qianli', { maxMs: 480_000 });
    expect(won).toBeTruthy();
    const st = await page.evaluate(() => JSON.parse(localStorage.getItem('yxj_v1')).pages.qianli);
    expect(['yeshi', 'yeshiB', 'yeshiAB']).toContain(st);
  });
});

test.describe('大关回与终局', () => {
  const GATES = { baimenlou: 'yeshi', changban: 'yeshi', maicheng: 'yeshi', wuzhangyuan: 'yeshi' };
  const FILL = Object.fromEntries(
    ['taoyuan', 'sishui', 'hulao', 'fengyiting', 'yuanshemen', 'wancheng',
      'zhujiu', 'qianli', 'guandu', 'sangu', 'bowang',
      'shezhan', 'caochuan', 'chibi', 'huarong', 'sanqi',
      'xianshan', 'jieqiao', 'shenting', 'baima', 'nanjun', 'tongguan',
      'ruxu', 'jiameng', 'daodan', 'xiaoyaojin'].map(id => [id, 'yeshi']));

  test('大关回全改写:解锁余卷,但野史不足时写卷人不现', async ({ page }) => {
    await seedProgress({ ...GATES })(page);
    await newGame(page);
    await expect(page.locator('.scrollGroup.locked')).toHaveCount(1);
    await expect(page.locator('[data-ch="zhujiu"]')).not.toHaveClass(/locked/);
    await expect(page.locator('[data-ch="zuizhong"]')).toHaveClass(/locked/);
  });

  test('终局门槛:野史满三十,最后一页浮现', async ({ page }) => {
    await seedProgress({ ...GATES, ...FILL })(page); // 4 大关回 + 26 = 30
    await newGame(page);
    await expect(page.locator('.scrollGroup.locked')).toHaveCount(0);
    await expect(page.locator('[data-ch="zuizhong"]')).not.toHaveClass(/locked/);
    await expect(page.locator('#codexProgress')).toContainText('最后一页已现');
  });

  test('写卷人:封卷、还史、撕卷三种署名,撕卷接入无终稿', async ({ page }) => {
    test.setTimeout(360_000);
    await seedProgress({ ...GATES, ...FILL })(page);
    await newGame(page, 'fast=1&seed=RUN06&opp=80');
    await openChapter(page, 'zuizhong');
    const won = await winChapter(page, 'zuizhong');
    expect(won).toBeTruthy();
    await expect(page.locator('#finale')).toBeVisible();
    await expect(page.locator('#finaleQ button')).toHaveCount(3);
    await expect(page.locator('#finaleQ')).toContainText('封卷');
    await expect(page.locator('#finaleQ')).toContainText('还史');
    await expect(page.locator('#finaleQ')).toContainText('撕卷');
    await page.click('#finaleQ button >> nth=2');
    await expect(page.locator('#finaleText')).toContainText('无终稿');
    await page.click('#finaleHome');
    await expect(page.locator('#scroll')).toBeVisible();
    const endings = await page.evaluate(() => JSON.parse(localStorage.getItem('yxj_v1')).endings);
    expect(endings).toEqual(['unwritten']);
    await expect(page.locator('#apocBtn')).toBeVisible();
  });
});
