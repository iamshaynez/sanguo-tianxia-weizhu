// mobile-dock.spec.js —— 手机竖屏底部操作坞回归
// 背景:操作按钮曾以魔法数字各自绝对定位贴底,实测被浏览器工具栏压住、
// 加注档位压攻心/牌型提示、按钮高仅 36px。此文件把操作坞方案钉进回归:
// dvh 锚定 + 贴底成坞 + 触控目标 ≥44px + 战斗时隐藏版本栏。
import { test, expect } from '@playwright/test';
import { newGame, enterBattle, waitButtons } from './helpers.js';

async function settleOmen(page) {
  await page.evaluate(() => {
    const m = document.getElementById('omenModal');
    if (!m.classList.contains('hidden')) m.querySelector('#omenBox button')?.click();
  });
}

const SIZES = [
  { label: '390×844', width: 390, height: 844 },
  { label: '360×640', width: 360, height: 640 },
  { label: '320×568', width: 320, height: 568 },
];

async function boxes(page) {
  return page.evaluate(() => {
    const rect = sel => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { top: r.top, left: r.left, bottom: r.bottom, right: r.right, width: r.width, height: r.height };
    };
    const overlap = (a, b) => !a || !b ? false
      : a.top < b.bottom && b.top < a.bottom && a.left < b.right && b.left < a.right;
    const raiseOpts = rect('#raiseOpts');
    const taunt = rect('#tauntBtn');
    const handLabel = rect('#handLabel');
    const actions = rect('#actions');
    return {
      battle: rect('#battle'),
      dock: rect('#actionDock'),
      actions,
      overlaps: {
        raiseTaunt: overlap(raiseOpts, taunt),
        raiseHand: overlap(raiseOpts, handLabel),
        raiseActions: overlap(raiseOpts, actions),
        actionsHand: overlap(actions, handLabel),
      },
      appVersionShown: getComputedStyle(document.querySelector('.app-version')).display !== 'none',
      actionButtons: [...document.querySelectorAll('#actions button')]
        .filter(b => b.style.display !== 'none')
        .map(b => b.getBoundingClientRect().height),
      innerHeight,
      innerWidth,
    };
  });
}

test.describe('手机竖屏操作坞', () => {
  for (const size of SIZES) {
    test(`竖屏 ${size.label}:按钮入坞贴底可点,档位不压邻居,版本栏让位`, async ({ page }) => {
      await page.setViewportSize({ width: size.width, height: size.height });
      await newGame(page, 'fast=1&chapter=taoyuan&omen=sow');
      await page.click('#openPage');
      await page.evaluate(() => {
        const m = document.getElementById('omenModal');
        if (!m.classList.contains('hidden')) m.querySelector('#omenBox button')?.click();
      });
      await enterBattle(page);
      await waitButtons(page);

      // 战斗屏随动态视口(dvh)铺满,操作坞与按钮完整入屏
      const closed = await boxes(page);
      expect(Math.abs(closed.battle.height - closed.innerHeight)).toBeLessThanOrEqual(1);
      expect(closed.dock.bottom).toBeLessThanOrEqual(closed.battle.bottom + 1);
      expect(closed.dock.top).toBeGreaterThanOrEqual(0);
      expect(closed.actions.bottom).toBeLessThanOrEqual(closed.innerHeight);
      // 触控目标:主操作按钮 ≥44px(方案 48px,留余量)
      expect(closed.actionButtons.length).toBeGreaterThan(0);
      for (const h of closed.actionButtons) expect(h).toBeGreaterThanOrEqual(44);
      // 战斗时版本栏让出拇指热区
      expect(closed.appVersionShown).toBe(false);

      // 打开加注档位:与攻心/牌型/主操作零重叠
      const hasRaise = await page.evaluate(() => {
        const b = document.querySelector('#actions button[data-act="raise"]');
        return !!b && b.style.display !== 'none';
      });
      if (hasRaise) {
        await page.click('#actions button[data-act="raise"]');
        await expect(page.locator('#raiseOpts:not(.hidden)')).toBeVisible();
        const opened = await boxes(page);
        expect(opened.overlaps.raiseTaunt).toBe(false);
        expect(opened.overlaps.raiseHand).toBe(false);
        expect(opened.overlaps.raiseActions).toBe(false);
        expect(opened.overlaps.actionsHand).toBe(false);
        expect(opened.actions.top).toBeGreaterThanOrEqual(0);
        expect(opened.actions.bottom).toBeLessThanOrEqual(opened.innerHeight);
      }
    });
  }
});

test.describe('手机竖屏顶部布局', () => {
  for (const size of SIZES) {
    test(`竖屏 ${size.label}:状态条一行、气泡入卡、破绽簿不与底池相撞`, async ({ page }) => {
      await page.setViewportSize({ width: size.width, height: size.height });
      await newGame(page, 'fast=1&chapter=taoyuan&omen=sow');
      await page.click('#openPage');
      await settleOmen(page);
      await enterBattle(page);
      await waitButtons(page);

      // 顶部一行状态条:盲注(左)与种子(右)同排不重叠,全部入屏
      const geo = await page.evaluate(() => {
        const rect = id => {
          const el = document.getElementById(id);
          if (!el) return null;
          const r = el.getBoundingClientRect();
          return { top: r.top, left: r.left, bottom: r.bottom, right: r.right };
        };
        const overlap = (a, b) => !a || !b ? false
          : a.top < b.bottom && b.top < a.bottom && a.left < b.right && b.left < a.right;
        const blind = rect('blindLabel');
        const seed = rect('seedLabel');
        const codex = rect('codex');
        const pot = rect('potLabel');
        return {
          blindInTopBar: !!document.querySelector('#topBar > #blindLabel'),
          inScreen: [blind, seed, codex].every(r => r && r.left >= 0 && r.right <= innerWidth && r.top >= 0 && r.bottom <= innerHeight),
          blindSeed: overlap(blind, seed),
          codexPot: overlap(codex, pot),
        };
      });
      expect(geo.blindInTopBar).toBe(true);
      expect(geo.inScreen).toBe(true);
      expect(geo.blindSeed).toBe(false);
      expect(geo.codexPot).toBe(false);

      // 强制弹破绽气泡(长驻 30s):收进席位卡内,不再下溢压破绽簿/底池标签
      await page.evaluate(() => window.__tellUI.show({
        line: '关某在此,自管来。', note: '丹凤眼微睁，抚须不语 · 识破1/2', tone: 'equity', dur: 30, id: 'opponent',
      }));
      await page.waitForTimeout(300);
      const bubbleGeo = await page.evaluate(() => {
        const rect = sel => {
          const el = document.querySelector(sel);
          const r = el.getBoundingClientRect();
          return { top: r.top, left: r.left, bottom: r.bottom, right: r.right };
        };
        const overlap = (a, b) => a.top < b.bottom && b.top < a.bottom && a.left < b.right && b.left < a.right;
        const bubble = rect('.seat-bubble');
        return {
          bubble,
          inSeat: bubble.top >= rect('.opponent-seat').top - 1 && bubble.bottom <= rect('.opponent-seat').bottom + 1
            && bubble.left >= rect('.opponent-seat').left - 1 && bubble.right <= rect('.opponent-seat').right + 1,
          hitsCodex: overlap(bubble, rect('#codex')),
          hitsPot: overlap(bubble, rect('#potLabel')),
        };
      });
      expect(bubbleGeo.inSeat).toBe(true);
      expect(bubbleGeo.hitsCodex).toBe(false);
      expect(bubbleGeo.hitsPot).toBe(false);
    });
  }
});
