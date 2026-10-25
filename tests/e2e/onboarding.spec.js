import { test, expect } from '@playwright/test';

async function readSave(page) {
  return page.evaluate(() => JSON.parse(localStorage.getItem('yxj_v1') || '{}'));
}

test.describe('分步开卷与渐进引导', () => {
  test('新玩家四短节入卷,完成状态刷新后保留', async ({ page }) => {
    await page.goto('/?fast=1');
    await page.click('#startBtn');
    await expect(page.locator('#introStep')).toContainText('1 / 4');
    await expect(page.locator('#introStory')).toContainText('二十枚野史朱印');
    for (const step of [2, 3, 4]) {
      await page.click('#startBtn');
      await expect(page.locator('#introStep')).toContainText(`${step} / 4`);
    }
    await expect(page.locator('#introStory')).toContainText('天时');
    await page.click('#startBtn');
    await expect(page.locator('#scroll')).toBeVisible();
    expect((await readSave(page)).tutorial.introDone).toBe(true);
    await page.reload();
    await page.click('#startBtn');
    await expect(page.locator('#scroll')).toBeVisible();
    await expect(page.locator('#prologueSkip')).toBeHidden();
  });

  test('可跳过背景,目录也能重温开卷', async ({ page }) => {
    await page.goto('/?fast=1');
    await page.click('#startBtn');
    await page.click('#prologueSkip');
    await expect(page.locator('#scroll')).toBeVisible();
    await page.click('#replayIntroBtn');
    await expect(page.locator('#intro')).toBeVisible();
    await expect(page.locator('#introStep')).toContainText('1 / 4');
    await page.click('#prologueSkip');
    await expect(page.locator('#scroll')).toBeVisible();
  });

  test('旧存档迁移不丢回目与列传,也不强制重播序章', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('yxj_v1', JSON.stringify({
        pages: { hulao: 'yeshi' }, endings: [], flags: { legacy: true }, apocWins: 2,
        annals: { lvbu: { seen: 2, won: 1, tells: {} } },
      }));
    });
    await page.goto('/?fast=1');
    await page.click('#startBtn');
    await expect(page.locator('#scroll')).toBeVisible();
    const save = await readSave(page);
    expect(save.version).toBe(2);
    expect(save.pages.hulao).toBe('yeshi');
    expect(save.annals.lvbu.seen).toBe(2);
    expect(save.flags.legacy).toBe(true);
    expect(save.story).toEqual({ seen: {}, choices: {}, facts: {}, clues: {}, outcomes: {} });
    await page.click('#annalsBtn');
    await expect(page.locator('.annalCard[data-gen="lvbu"]')).toBeVisible();
  });

  test('窄屏开卷可推进,按钮留在可视区', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/?fast=1');
    await page.click('#startBtn');
    const box = await page.locator('#startBtn').boundingBox();
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(390);
    expect(box.y + box.height).toBeLessThanOrEqual(844);
    await page.click('#prologueSkip');
    await expect(page.locator('#scroll')).toBeVisible();
  });

  test('机制提示落在真实页面与天时选择上,可不再提示', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('yxj_v1', JSON.stringify({ tutorial: { introDone: true, steps: {}, skipped: false } }));
    });
    await page.goto('/?fast=1&chapter=hulao');
    await page.click('#startBtn');
    await expect(page.locator('#coachTitle')).toHaveText('第一回怎么读');
    await page.click('#coachClose');
    await page.click('#openPage');
    await expect(page.locator('#omenModal')).toBeVisible();
    await expect(page.locator('#coachTitle')).toHaveText('天时只需选一项');
    await page.click('#coachNever');
    await page.click('#omenBox button');
    await expect(page.locator('#map')).toBeVisible();
    await expect(page.locator('#coachmark')).toBeHidden();
    expect((await readSave(page)).tutorial.skipped).toBe(true);
  });
});
