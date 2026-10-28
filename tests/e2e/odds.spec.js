import { test, expect } from '@playwright/test';
import {
  newGame, openChapter, enterBattle, clickAvailNode, confirmBriefing, act, loc, waitAppReady,
} from './helpers.js';

async function enableOdds(page) {
  await page.click('#settingsToggle');
  if (!await page.locator('#equityAssist').isChecked()) await page.check('#equityAssist');
  await page.click('#settingsClose');
  await expect(page.locator('#oddsPanel')).toBeVisible();
  await expect(page.locator('#oddsPanel')).toHaveAttribute('data-state', 'ready', { timeout: 30_000 });
}

async function captureWorkerMessages(page) {
  await page.addInitScript(() => {
    window.__oddsMessages = [];
    const original = Worker.prototype.postMessage;
    Worker.prototype.postMessage = function (message, ...args) {
      window.__oddsMessages.push(JSON.parse(JSON.stringify(message)));
      return original.call(this, message, ...args);
    };
  });
}

test('设置开关随存档保存,旧存档默认关闭', async ({ page }) => {
  await newGame(page);
  await page.click('#settingsToggle');
  await expect(page.locator('#equityAssist')).not.toBeChecked();
  await expect(page.locator('#equityAssist')).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.locator('#settingsClose')).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.locator('#equityAssist')).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(page.locator('#settingsClose')).toBeFocused();
  await page.check('#equityAssist');
  await page.click('#settingsClose');
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('yxj_v1')).settings.equityAssist)).toBe(true);
  await page.reload();
  await waitAppReady(page);
  await page.click('#settingsToggle');
  await expect(page.locator('#equityAssist')).toBeChecked();
});

test('牌局内可即时开关,计算消息只含公开信息与未弃牌对手数', async ({ page }) => {
  await captureWorkerMessages(page);
  await newGame(page, 'fast=1&seed=ODDS01&omen=keenEye');
  await openChapter(page, 'taoyuan');
  await enterBattle(page);
  await expect(page.locator('#oddsPanel')).toBeHidden();
  await enableOdds(page);
  await expect(page.locator('#oddsWin')).toContainText('%');
  await expect(page.locator('#oddsDistribution .odds-dist-cell')).toHaveCount(9);
  const payload = await page.evaluate(() => {
    const message = window.__oddsMessages.at(-1);
    return {
      keys: Object.keys(message).sort(), hole: message.hole, board: message.board,
      hero: [...document.querySelectorAll('.card.big')].map(card => Number(card.dataset.cardId)),
    };
  });
  expect(payload.keys).toEqual(['board', 'hole', 'id', 'opponents']);
  expect(payload.board).toEqual([]);
  expect(payload.hole.sort()).toEqual(payload.hero.sort());

  await page.click('#settingsToggle');
  await page.uncheck('#equityAssist');
  await page.click('#settingsClose');
  await expect(page.locator('#oddsPanel')).toBeHidden();
  await enableOdds(page);
  await page.click('#actions [data-act="fold"]');
  await expect(page.locator('#oddsPanel')).toBeHidden();
});

test('翻牌后精确展示 outs 与 1081 种终局,Worker 牌面与公开牌一致', async ({ page }) => {
  await captureWorkerMessages(page);
  await newGame(page, 'fast=1&seed=FLOW01&omen=keenEye');
  await openChapter(page, 'taoyuan');
  await enterBattle(page);
  await enableOdds(page);
  for (let i = 0; i < 8; i++) {
    if (await loc.community(page).count() === 3) break;
    if (await page.locator('#actions:not(.hidden)').count()) await act(page, ['call', 'check']);
    await page.waitForTimeout(750);
  }
  await expect(loc.community(page)).toHaveCount(3);
  await expect(page.locator('#oddsPanel')).toHaveAttribute('data-state', 'ready');
  await expect(page.locator('#oddsPanel')).toHaveAttribute('data-street', '3');
  await expect(page.locator('#oddsDrawPreview .odds-draw-preview')).not.toHaveCount(0);
  await page.locator('#oddsDetails summary').click();
  await expect(page.locator('.odds-details-body')).toBeVisible();
  await expect(page.locator('#oddsDistributionMethod')).toHaveText('穷举 1081 种');
  await expect(page.locator('#oddsDraws .odds-outs').first()).not.toBeEmpty();
  const publicMatch = await page.evaluate(() => {
    const message = window.__oddsMessages.at(-1);
    const board = [...document.querySelectorAll('#cardLayer .card.flipped:not(.big)')].map(card => Number(card.dataset.cardId));
    return JSON.stringify(message.board) === JSON.stringify(board);
  });
  expect(publicMatch).toBe(true);
  for (const size of [{ width: 1280, height: 600 }, { width: 568, height: 320 }]) {
    await page.setViewportSize(size);
    await page.waitForTimeout(150);
    const bounds = await page.locator('.odds-details-body').evaluate(el => ({
      top: el.getBoundingClientRect().top, bottom: el.getBoundingClientRect().bottom,
      clientHeight: el.clientHeight, scrollHeight: el.scrollHeight, viewport: innerHeight,
    }));
    expect(bounds.top).toBeGreaterThanOrEqual(0);
    expect(bounds.bottom).toBeLessThanOrEqual(bounds.viewport);
    expect(bounds.clientHeight).toBeLessThan(bounds.scrollHeight);
  }
});

test('四人桌按三名对手计算并展示期望底池份额', async ({ page }) => {
  await captureWorkerMessages(page);
  await newGame(page, 'fast=1&seed=ODDS04&chapter=chibi&omen=keenEye&stage=boss&bossopp=300,350,400');
  await page.click('#openPage');
  await clickAvailNode(page, 'boss');
  await confirmBriefing(page);
  for (let i = 0; i < 3; i++) {
    await expect(page.locator('#bossIntro')).toHaveClass(/show/);
    await page.click('#introSkip');
  }
  await expect(page.locator('#battle')).toBeVisible();
  await enableOdds(page);
  await expect(page.locator('#oddsPanel')).toHaveAttribute('data-opponents', '3');
  await expect(page.locator('#oddsShareWrap')).toBeVisible();
  expect(await page.evaluate(() => window.__oddsMessages.at(-1).opponents)).toBe(3);
  for (const size of [{ width: 1280, height: 600 }, { width: 800, height: 600 }, { width: 320, height: 568 }]) {
    await page.setViewportSize(size);
    const fits = await page.evaluate(() => {
      const panel = document.getElementById('oddsPanel').getBoundingClientRect();
      const share = document.getElementById('oddsShareWrap').getBoundingClientRect();
      return share.right <= panel.right && panel.right <= innerWidth;
    });
    expect(fits).toBe(true);
  }
});

test('发新街动画期间不展示旧街结果,也不发送中间牌面', async ({ page }) => {
  await captureWorkerMessages(page);
  await newGame(page, 'seed=ODDS05&omen=keenEye');
  await openChapter(page, 'taoyuan');
  await enterBattle(page);
  await enableOdds(page);
  await act(page, ['call', 'check']);
  await expect(loc.community(page)).toHaveCount(1, { timeout: 30_000 });
  await page.evaluate(() => window.dispatchEvent(new Event('odds-setting-change')));
  await expect(page.locator('#oddsPanel')).toBeHidden();
  expect(await page.evaluate(() => window.__oddsMessages.some(message => [1, 2].includes(message.board.length)))).toBe(false);
  await expect(loc.community(page)).toHaveCount(3);
  await expect(page.locator('#oddsPanel')).toHaveAttribute('data-state', 'ready');
  await expect(page.locator('#oddsPanel')).toHaveAttribute('data-street', '3');
});

test('桌面与手机摘要均不遮手牌和行动按钮', async ({ page }) => {
  await newGame(page, 'fast=1&seed=FLOW01&omen=keenEye');
  await openChapter(page, 'taoyuan');
  await enterBattle(page);
  await enableOdds(page);
  for (const size of [{ width: 1280, height: 800 }, { width: 390, height: 844 }, { width: 320, height: 568 }]) {
    await page.setViewportSize(size);
    await page.waitForTimeout(600);
    const overlap = await page.evaluate(() => {
      const panel = document.getElementById('oddsPanel').getBoundingClientRect();
      if (panel.left < 0 || panel.top < 0 || panel.right > innerWidth || panel.bottom > innerHeight) return '面板越界';
      const targets = [...document.querySelectorAll('.card.big'), document.getElementById('actions'), document.getElementById('potLabel')];
      for (const el of targets) {
        if (!el || el.classList.contains('hidden')) continue;
        const r = el.getBoundingClientRect();
        const area = Math.max(0, Math.min(panel.right, r.right) - Math.max(panel.left, r.left))
          * Math.max(0, Math.min(panel.bottom, r.bottom) - Math.max(panel.top, r.top));
        if (area > 0) return `遮挡 ${el.id || '.card.big'}`;
      }
      return '';
    });
    expect(overlap).toBe('');
    if (size.width === 320) await expect(page.locator('#codex')).toBeHidden();
    else await expect(page.locator('#codex')).toBeVisible();
  }
});
