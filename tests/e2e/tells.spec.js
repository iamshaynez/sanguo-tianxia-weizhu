// tells.spec.js —— 破绽系统的台面呈现:两层气泡、立绘履历角标、真实牌局接线
import { test, expect } from '@playwright/test';
import { installDriver, waitAppReady } from './helpers.js';
import { TELL_LINE_POOLS } from '../../src/tell-lines.js';

// ?stage=boss 直达虎牢关底:题记→天时→行军图→关底战书→吕布亮相→应战入桌
async function enterLubuBattle(page) {
  await page.goto('/?fast=1&seed=TELL1&chapter=hulao&stage=boss&omen=sow&tutorial=0');
  await waitAppReady(page);
  await page.evaluate(() => document.getElementById('startBtn').click());
  await expect(page.locator('#page')).toBeVisible();
  await page.evaluate(() => document.getElementById('openPage').click());
  await page.waitForFunction(() => !document.getElementById('map').classList.contains('hidden') || !document.getElementById('omenModal').classList.contains('hidden'));
  await page.waitForTimeout(200);
  await page.evaluate(() => { const m = document.getElementById('omenModal'); if (!m.classList.contains('hidden')) m.querySelector('#omenBox button')?.click(); });
  await expect(page.locator('#map')).toBeVisible();
  await page.evaluate(() => { document.querySelector('#mapSvg .node.avail')?.dispatchEvent(new MouseEvent('click', { bubbles: true })); });
  await expect(page.locator('#battleBriefing')).toBeVisible({ timeout: 15_000 });
  await page.click('#briefingEnter');
  await expect(page.locator('#bossIntro')).toHaveClass(/show/, { timeout: 30_000 });
  await page.click('#introSkip');
  await expect(page.locator('#battle')).toBeVisible({ timeout: 30_000 });
}

test.describe('破绽气泡与履历角标', () => {
  test('两层气泡:台词层+注解层,限时隐没;意图配色生效', async ({ page }) => {
    await enterLubuBattle(page);
    await page.evaluate(() => {
      window.__tellUI.show({ line: '关某在此,自管来。', note: '丹凤眼微睁，抚须不语 · 识破1/2', tone: 'equity', dur: 2.5, id: 'opponent' });
    });
    const bubble = page.locator('#oppChar .seat-bubble').first();
    await expect(bubble).toBeVisible();
    await expect(bubble.locator('b')).toHaveText('关某在此,自管来。');
    await expect(bubble.locator('i')).toHaveText('丹凤眼微睁，抚须不语 · 识破1/2');
    await page.evaluate(() => {
      window.__tellUI.show({ line: '你敢不敢跟?!', note: '指尖泄了密——他在演', tone: 'intent', dur: 1, id: 'opponent' });
    });
    await expect(bubble).toHaveClass(/is-intent/);
    await page.waitForTimeout(1600);
    // 淡出走 opacity,元素仍占位:断言透明而非不可见
    await expect(bubble).toHaveCSS('opacity', '0');
  });

  test('履历角标:识破命中与诓骗计数,多次诓骗转红档,清空可隐', async ({ page }) => {
    await enterLubuBattle(page);
    const badge = page.locator('#oppChar .seat-record').first();
    await page.evaluate(() => window.__tellUI.record({ n: 4, hit: 3, lies: 1 }, 'opponent'));
    await expect(badge).toBeVisible();
    await expect(badge).toHaveText('识破3/4 诓1');
    await expect(badge).toHaveAttribute('data-lies', '1');
    await page.evaluate(() => window.__tellUI.record({ n: 9, hit: 3, lies: 6 }, 'opponent'));
    await expect(badge).toHaveText('识破3/9 诓6');
    await expect(badge).toHaveAttribute('data-lies', '6');
    await page.evaluate(() => window.__tellUI.record(null, 'opponent'));
    await expect(badge).toBeHidden();
  });

  test('真实牌局:吕布破绽出现时,台词来自词池且注解带签名动作或履历', async ({ page }) => {
    test.setTimeout(240_000);
    await enterLubuBattle(page);
    await installDriver(page, 'station');
    // 意图泄露用 Math.random,牌局不可按种子复现:本局打完可能直接回行军图,
    // 补一个自动续战循环(打完点下一个节点),并在页内等满 150 秒。
    await page.evaluate(() => {
      window.__reenter = setInterval(() => {
        const battle = document.getElementById('battle');
        if (!battle || battle.classList.contains('hidden')) {
          const node = document.querySelector('#mapSvg .node.avail');
          if (node) node.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        }
      }, 600);
    });
    const pools = {
      famous: Object.values(TELL_LINE_POOLS.FAMOUS.lvbu).flat(),
    };
    const seen = await page.evaluate(async ({ famous }) => {
      const bubble = document.querySelector('#oppChar .seat-bubble');
      let spoke = null;
      const deadline = Date.now() + 150_000;
      while (Date.now() < deadline) {
        const b = bubble?.querySelector('b')?.textContent || '';
        if (b && !bubble.classList.contains('hidden') && bubble.style.opacity !== '0') {
          if (famous.includes(b)) { spoke = { b, note: bubble.querySelector('i')?.textContent || '' }; break; }
        }
        await new Promise(r => setTimeout(r, 200));
      }
      return spoke;
    }, { famous: pools.famous });
    await page.evaluate(() => clearInterval(window.__reenter));
    expect(seen).not.toBeNull();
    const tells = ['画戟横于膝上,指节发白', '赤兔不安地刨蹄', '识破', '指尖泄了密', '按兵太久'];
    expect(tells.some(t => seen.note.includes(t))).toBe(true);
  });
});
