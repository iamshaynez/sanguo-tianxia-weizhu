// tests/e2e/persona.spec.js —— 人格基座的用户可见行为:激将相性由六维心性驱动
import { test, expect } from '@playwright/test';
import { newGame, openChapter, enterBattle, loc } from './helpers.js';

test.describe('人格基座:激将相性', () => {
  test('心性 90:不动声色,情绪灯不亮', async ({ page }) => {
    // traits 顺序:武勇,智谋,诈术,胆识,耐性,心性
    await newGame(page, 'fast=1&seed=PER01&omen=keenEye&traits=50,50,50,50,50,90');
    await openChapter(page, 'taoyuan');
    await enterBattle(page);
    await expect(page.locator('#tauntBtn')).toBeEnabled();
    await page.click('#tauntBtn');
    await expect(loc.tiltDotsOn(page)).toHaveCount(0);
    await expect(page.locator('#bubble')).toContainText('不动声色');
    await expect(page.locator('#tauntBtn')).toBeDisabled();
  });

  test('心性 10:一点就着,情绪灯双倍亮起', async ({ page }) => {
    await newGame(page, 'fast=1&seed=PER02&omen=keenEye&traits=50,50,50,50,50,10');
    await openChapter(page, 'taoyuan');
    await enterBattle(page);
    await expect(page.locator('#tauntBtn')).toBeEnabled();
    await page.click('#tauntBtn');
    await expect(loc.tiltDotsOn(page)).toHaveCount(2);
    await expect(page.locator('#tauntBtn')).toBeDisabled();
  });

  test('默认人格:激将一次,情绪灯亮一盏(回归)', async ({ page }) => {
    await newGame(page, 'fast=1&seed=PER03&omen=keenEye');
    await openChapter(page, 'taoyuan');
    await enterBattle(page);
    await page.click('#tauntBtn');
    await expect(loc.tiltDotsOn(page)).toHaveCount(1);
  });
});
