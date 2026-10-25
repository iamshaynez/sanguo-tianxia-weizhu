// smoke.spec.js —— 冒烟:用户第一眼看到的所有东西
import { test, expect } from '@playwright/test';
import { newGame, openChapter, enterBattle, loc } from './helpers.js';

test.describe('冒烟:界面骨架', () => {
  test('标题页呈现品牌与入口', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#intro h1')).toHaveText('三国：天下为注');
    await expect(page.locator('#intro .story')).toContainText('史书只写了沙场');
    await expect(page.locator('#startBtn')).toBeVisible();
    // 背景画布已渲染(非空白)
    const painted = await page.evaluate(() => {
      const c = document.getElementById('backdrop');
      const ctx = c.getContext('2d');
      const d = ctx.getImageData(0, 0, c.width, Math.min(50, c.height)).data;
      for (let i = 3; i < d.length; i += 4) if (d[i] !== 255 && d[i] !== 0) return true;
      return d.some((v, i) => i % 4 === 3 && v > 0);
    });
    expect(painted).toBeTruthy();
  });

  test('页脚显示版本、提交与服务器启动时间且不遮按钮', async ({ page }) => {
    const response = await page.request.get('/runtime.json');
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.version).toBe('1.0.0');
    expect(data.commit).toMatch(/^[0-9a-f]{7,40}$/);
    expect(Number.isFinite(Date.parse(data.startedAt))).toBe(true);
    await page.goto('/');
    await expect(page.locator('#appVersion')).toHaveAttribute('data-status', 'ready');
    await expect(page.locator('#versionNumber')).toHaveText(`v${data.version}+${data.commit.slice(0, 7)}`);
    await expect(page.locator('#serverStartedAt')).toHaveAttribute('datetime', data.startedAt);
    for (const width of [320, 390]) {
      await page.setViewportSize({ width, height: 844 });
      const footer = await page.locator('#appVersion').boundingBox();
      const button = await page.locator('#startBtn').boundingBox();
      const overlap = Math.max(0, Math.min(footer.x + footer.width, button.x + button.width) - Math.max(footer.x, button.x))
        * Math.max(0, Math.min(footer.y + footer.height, button.y + button.height) - Math.max(footer.y, button.y));
      expect(overlap).toBe(0);
    }
  });

  test('旧服务缺少版本文件时页脚明确提示未登记', async ({ page }) => {
    await page.route('**/runtime.json*', route => route.fulfill({ status: 404, body: 'not found' }));
    await page.goto('/');
    await expect(page.locator('#appVersion')).toHaveAttribute('data-status', 'missing');
    await expect(page.locator('#versionNumber')).toHaveText('v1.0.0');
    await expect(page.locator('#serverStartedAt')).toHaveText('启动时间未登记');
  });

  test('正式名称在窄屏完整显示且不越界', async ({ page }) => {
    await page.goto('/');
    for (const width of [320, 390]) {
      await page.setViewportSize({ width, height: 844 });
      await expect(page.locator('#intro h1')).toHaveText('三国：天下为注');
      const title = await page.locator('#intro h1').boundingBox();
      expect(title.x).toBeGreaterThanOrEqual(0);
      expect(title.x + title.width).toBeLessThanOrEqual(width);
      const lock = await page.locator('.intro-title-lock').boundingBox();
      expect(lock.x + lock.width).toBeLessThanOrEqual(width);
    }
  });

  test('残卷目录:四卷齐备,首卷可读,余卷带锁', async ({ page }) => {
    await newGame(page);
    await expect(page.locator('#scroll .screen-title')).toHaveText('英 雄 记');
    await expect(page.locator('#codexProgress')).toContainText('已改写 0 / 32');
    // 五组:四卷 + 最后一页
    await expect(page.locator('.scrollGroup')).toHaveCount(5);
    // 卷一 7 回,首回「桃园」未读态
    await expect(page.locator('.scrollGroup').nth(0).locator('.chip')).toHaveCount(7);
    await expect(page.locator('[data-ch="taoyuan"]')).toHaveClass(/st-unread/);
    // 卷二三四与最后一页带锁
    await expect(page.locator('.scrollGroup.locked')).toHaveCount(4);
  });

  test('翻页题记与行军图:年号、题记、地名节点', async ({ page }) => {
    await newGame(page, 'omen=sow');
    await page.click('[data-ch="taoyuan"]');
    await expect(page.locator('#page')).toBeVisible();
    await expect(page.locator('#pageYear')).toHaveText('中平元年');
    await expect(page.locator('#pageName')).toHaveText('桃园');
    await expect(page.locator('#pagePremise')).toContainText('若乱世始于一场酒');
    await expect(page.locator('#pageNote')).toContainText('写卷人注');
    await page.click('#openPage');
    await expect(page.locator('#map')).toBeVisible();
    // 行军图:涿郡(遭遇战) → 桃林(辎重) → 广宗(关卡)
    await expect(page.locator('#mapSvg .node')).toHaveCount(3);
    await expect(page.locator('#mapSvg .node.avail')).toHaveCount(1);
    await expect(page.locator('#mapSvg .node.avail')).toHaveClass(/t-battle/);
    await expect(page.locator('#mapSvg .nlabel').first()).toContainText('涿郡');
    await expect(page.locator('#mapSvg .node.t-boss')).toHaveCount(1);
  });

  test('战斗骨架:对手、牌桌、HUD 全部就位', async ({ page }) => {
    await newGame(page, 'fast=1&seed=SMOKE1&omen=sow');
    await openChapter(page, 'taoyuan');
    await enterBattle(page);
    await expect(page.locator('#oppName')).toHaveText('黄巾游骑');
    // 席位使用本地三国志9头像,不再渲染傀儡 SVG
    await expect(page.locator('#oppPlate .portrait-img')).toHaveAttribute('data-skin', 'soldier');
    await expect(page.locator('#oppChar svg')).toHaveCount(0);
    // 双方筹码与盲注(遭遇战:对方 500,大盲后 480;夺气天时起手士气 -1)
    await expect(page.locator('#youStack')).toHaveText('990');
    await expect(page.locator('#oppStack')).toHaveText('480');
    await expect(page.locator('#blindLabel')).toHaveText('盲注 10 / 20 · 第 1 手');
    await expect(page.locator('#potNum')).toHaveText('30');
    await expect(loc.tiltDotsOn(page)).toHaveCount(1);
    // 种子与验牌入口
    await expect(page.locator('#seedVal')).toContainText('#SMOKE1');
    await expect(page.locator('#verifyBtn')).toBeVisible();
    // 玩家两张明牌、对方两张暗牌
    await expect(loc.playerCards(page)).toHaveCount(2);
    await expect(page.locator('#cardLayer .card.big.flipped')).toHaveCount(2);
    await expect(loc.oppFaceDown(page)).toHaveCount(2);
    // 翻牌前行动:弃牌/跟注/加注/全压
    await expect(page.locator('#actions')).toBeVisible();
    await expect(page.locator('#actions [data-act="fold"]')).toBeVisible();
    await expect(page.locator('#actions [data-act="call"]')).toContainText('跟注 10');
    await expect(page.locator('#actions [data-act="raise"]')).toBeVisible();
    await expect(page.locator('#actions [data-act="allin"]')).toBeVisible();
  });

  test('布局:手牌与按钮不越界、不互相遮挡', async ({ page }) => {
    await newGame(page, 'fast=1&seed=SMOKE2&omen=sow');
    await openChapter(page, 'taoyuan');
    await enterBattle(page);
    await expect(page.locator('#actions')).toBeVisible();
    const vp = page.viewportSize();
    for (const el of await loc.playerCards(page).all()) {
      const box = await el.boundingBox();
      expect(box.y + box.height).toBeLessThanOrEqual(vp.height);
      expect(box.x).toBeGreaterThanOrEqual(0);
    }
    // 行动按钮不与手牌重叠
    const actBox = await page.locator('#actions').boundingBox();
    for (const el of await loc.playerCards(page).all()) {
      const box = await el.boundingBox();
      const overlap = Math.max(0, Math.min(box.x + box.width, actBox.x + actBox.width) - Math.max(box.x, actBox.x))
        * Math.max(0, Math.min(box.y + box.height, actBox.y + actBox.height) - Math.max(box.y, actBox.y));
      expect(overlap).toBe(0);
    }
  });
});
