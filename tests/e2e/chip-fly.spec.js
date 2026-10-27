// chip-fly.spec.js —— 筹码飞行起点回归(确定性)
// 背景:place() 的"瞬移到起点"靠 .no-anim 类,但 CSS 只给 .card 定义过豁免,
// 筹码(.stack)从未生效——place(from,true) 变成 0.42s 过渡,每个筹码都从
// 无 transform 的原点(牌桌左上角,对手角落)起跳横扫桌面,赢家结算看起来
// 像筹码推给对面。修复:补 .stack.no-anim 规则。
// 断言原理:CSS 过渡期间 getBoundingClientRect 返回插值位置;加了 no-anim
// 则同步等于目标位。在页面内复刻 place() 序列即可确定性验证,不依赖
// 牌局随机(意图泄露用 Math.random,赢法不可种子复现)。
import { test, expect } from '@playwright/test';
import { waitAppReady } from './helpers.js';

test('筹码瞬移豁免生效:首帧即落目标位,且正常态保留飞行动画', async ({ page }) => {
  await page.goto('/?fast=1&chapter=hulao&tutorial=0');
  await waitAppReady(page);
  await page.evaluate(() => document.getElementById('startBtn').click());
  await expect(page.locator('#page')).toBeVisible();
  await page.evaluate(() => document.getElementById('openPage').click());
  await page.waitForFunction(() => !document.getElementById('map').classList.contains('hidden') || !document.getElementById('omenModal').classList.contains('hidden'));
  await page.waitForTimeout(200);
  await page.evaluate(() => { const m = document.getElementById('omenModal'); if (!m.classList.contains('hidden')) m.querySelector('#omenBox button')?.click(); });
  await expect(page.locator('#map')).toBeVisible();
  await page.evaluate(() => document.querySelector('#mapSvg .node.avail')?.dispatchEvent(new MouseEvent('click', { bubbles: true })));
  await expect(page.locator('#battleBriefing')).toBeVisible({ timeout: 15_000 });
  await page.click('#briefingEnter');
  await page.waitForFunction(() => document.getElementById('bossIntro').classList.contains('show')).catch(() => {});
  await page.evaluate(() => { const s = document.getElementById('introSkip'); if (s) s.click(); });
  await expect(page.locator('#battle')).toBeVisible({ timeout: 30_000 });

  const result = await page.evaluate(() => {
    const layer = document.getElementById('cardLayer');
    const lr = layer.getBoundingClientRect();
    const el = document.createElement('div');
    el.className = 'stack fly';
    document.getElementById('cardLayer').appendChild(el);
    const normal = getComputedStyle(el);
    const out = {
      flyTransition: `${normal.transitionProperty} ${normal.transitionDuration}`,
      noAnimTransition: '',
      immediateRect: null,
      expected: [lr.x + 300, lr.y + 200],
    };
    // 复刻 battle.js place() 的 immediate 序列
    el.classList.add('no-anim');
    el.style.transform = 'translate(300px, 200px)';
    void el.offsetHeight;
    out.noAnimTransition = `${getComputedStyle(el).transitionProperty} ${getComputedStyle(el).transitionDuration}`;
    const r = el.getBoundingClientRect();
    out.immediateRect = [r.x, r.y];
    el.remove();
    return out;
  });

  // 飞行筹码正常态必须有 transform 过渡(动画本身保留)
  expect(result.flyTransition).toContain('transform');
  // no-anim 豁免下,首帧位置必须即刻等于目标(修复前停在原点附近)
  expect(result.noAnimTransition).toContain('none');
  expect(Math.abs(result.immediateRect[0] - result.expected[0])).toBeLessThan(2);
  expect(Math.abs(result.immediateRect[1] - result.expected[1])).toBeLessThan(2);
});
