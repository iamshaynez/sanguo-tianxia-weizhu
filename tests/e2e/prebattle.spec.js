// prebattle.spec.js —— 史实底稿、逐战战书、展卷顺序与叙事可达性
import { test, expect } from '@playwright/test';
import { CHAPTERS } from '../../src/chapters.js';
import { rosterOf, roundConfig } from '../../src/encounters.js';
import {
  newGame, clickAvailNode, enterBattle, confirmBriefing,
  installDriver, stopDriver, waitButtons,
} from './helpers.js';

async function openBossBriefing(page, id, params = '') {
  const omen = params.includes('omen=') ? '' : '&omen=sow';
  await newGame(page, `fast=1&chapter=${id}&stage=boss${omen}${params ? '&' + params : ''}`);
  await expect(page.locator('#pageRecord')).not.toBeEmpty();
  await expect(page.locator('#pageSource')).not.toBeEmpty();
  await page.click('#openPage');
  await clickAvailNode(page, 'boss');
  await expect(page.locator('#battleBriefing')).toBeVisible();
}

test.describe('首次开卷与史实边界', () => {
  test('序章说清玩家是被请入局的读卷人', async ({ page }) => {
    await page.goto('/?tutorial=1');
    await page.click('#startBtn');
    await expect(page.locator('#introStory')).toContainText('残卷外的读卷人');
    await expect(page.locator('#introStory')).toContainText('不是让你无名顶替刘备或关羽');
    await expect(page.locator('#introPoints')).toContainText('史籍底稿与演义边界');
  });

  test('博望标明史事年代差异,归晋使用 280 年灭吴语境', async ({ page }) => {
    await newGame(page, 'fast=1&chapter=bowang&omen=sow');
    await expect(page.locator('#pageRecord')).toContainText('建安七年');
    await expect(page.locator('#pageRecord')).toContainText('早于三顾诸葛');
    await expect(page.locator('#pageAdaptation')).toContainText('演义时间线');

    await newGame(page, 'fast=1&chapter=guijin&omen=sow');
    await expect(page.locator('#pageYear')).toHaveText('太康元年');
    await expect(page.locator('#pageEra')).toHaveText('280 年');
    await expect(page.locator('#pageRecord')).toContainText('王濬');
    await expect(page.locator('#pageRecord')).toContainText('孙皓出降');
  });

  test('白帝城会同时读取麦城与夷陵结果,不再虚构夷陵未烧', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('yxj_v1', JSON.stringify({ pages: { maicheng: 'yeshi', yiling: 'history' } }));
    });
    await newGame(page, 'fast=1&chapter=baidicheng&omen=sow');
    await expect(page.locator('#pageColdOpen')).toContainText('夷陵的火却仍旧烧过');
    await expect(page.locator('#pageColdOpen')).not.toContainText('夷陵也没烧起来');
  });
});

test.describe('战前展卷仪式', () => {
  test('正常速度:地图到战书到武将卡再到牌桌,略过只结束动画', async ({ page }) => {
    const external = [];
    page.on('request', request => {
      if (/^https?:/.test(request.url()) && !request.url().startsWith('http://127.0.0.1:8619')) external.push(request.url());
    });
    await newGame(page, 'seed=PB01&chapter=taoyuan&omen=sow');
    await page.click('#openPage');
    await page.locator('#mapSvg .node.avail').click();
    await expect(page.locator('#battleBriefing')).toHaveClass(/show/);
    await expect(page.locator('#battle')).toBeHidden();
    await expect(page.locator('#bossIntro')).toBeHidden();
    await expect(page.locator('#briefingTitle')).toHaveText('涿郡 · 乡勇首阵');
    await expect(page.locator('#briefingReason')).toContainText('黄巾游骑逼近乡道');
    await expect(page.locator('#briefingWin')).toContainText('乡道守住');
    await expect(page.locator('#briefingLoss')).toContainText('此页归回原卷');
    await page.click('#briefingSkip');
    await expect(page.locator('#battleBriefing')).toHaveClass(/is-open/);
    await expect(page.locator('#briefingReason')).toBeVisible();
    await expect(page.locator('#battle')).toBeHidden();
    await page.click('#briefingEnter');
    await expect(page.locator('#bossIntro')).toHaveClass(/show/);
    await page.click('#introSkip');
    await expect(page.locator('#battle')).toBeVisible();
    await expect(page.locator('#blindLabel')).toContainText('盲注');
    expect(external).toEqual([]);
    await expect(page.locator('#errBox')).toBeEmpty();
  });

  test('Escape 与返回均不算兵败,劫营等增益直到入席才消耗', async ({ page }) => {
    await openBossBriefing(page, 'taoyuan', 'omen=raid');
    await expect(page.locator('#briefingRoster')).toContainText('军资 700');
    await page.keyboard.press('Escape');
    await expect(page.locator('#battleBriefing')).toBeHidden();
    await expect(page.locator('#mapSvg .node.avail')).toHaveClass(/t-boss/);
    expect(await page.evaluate(() => JSON.parse(localStorage.getItem('yxj_v1')).pages.taoyuan)).toBeUndefined();

    await clickAvailNode(page, 'boss');
    await page.click('#briefingBack');
    await expect(page.locator('#battleBriefing')).toBeHidden();
    await clickAvailNode(page, 'boss');
    await confirmBriefing(page);
    await expect(page.locator('#battle')).toBeVisible();
    await expect(page.locator('#oppStack')).toHaveText('480'); // 劫营后为 500,开牌已扣 20 盲注
    await expect(page.locator('#settle')).toBeHidden();
  });

  test('焦点留在对话框内,背景不可操作,减少动态效果直接给终帧', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await newGame(page, 'seed=PB03&chapter=taoyuan&omen=sow');
    await page.click('#openPage');
    await page.locator('#mapSvg .node.avail').click();
    await expect(page.locator('#battleBriefing')).toHaveClass(/is-open/);
    await expect(page.locator('#briefingSkip')).toBeHidden();
    await expect(page.locator('.briefing-paper')).toHaveCSS('animation-name', 'none');
    await expect(page.locator('#briefingTitle')).toBeFocused();
    expect(await page.locator('#map').evaluate(el => el.inert)).toBe(true);
    await page.keyboard.press('Shift+Tab');
    await expect(page.locator('#briefingEnter')).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(page.locator('#briefingBack')).toBeFocused();
    await page.keyboard.press('Escape');
    expect(await page.locator('#map').evaluate(el => el.inert)).toBe(false);
  });

  test('赤壁战书同屏列出三位对手与三方牌局规则', async ({ page }) => {
    await openBossBriefing(page, 'chibi');
    await expect(page.locator('#briefingRoster .briefing-enemy')).toHaveCount(3);
    await expect(page.locator('#briefingRoster')).toContainText('曹操 · 连舫');
    await expect(page.locator('#briefingRoster')).toContainText('周瑜 · 都督');
    await expect(page.locator('#briefingRoster')).toContainText('诸葛亮 · 借风');
    await expect(page.locator('#briefingReason')).toContainText('三方谋略');
    await expect(page.locator('#briefingRule')).toContainText('三方同桌');
    await expect(page.locator('#briefingEnterDetail')).toContainText('等 3 将');
    await expect(page.locator('#battle')).toBeHidden();
  });

  test('千里第五阵使用秦琪与黄河渡独立战书', async ({ page }) => {
    await openBossBriefing(page, 'qianli', 'round=5');
    await expect(page.locator('#briefingTitle')).toHaveText('黄河渡 · 秦琪');
    await expect(page.locator('#briefingRound')).toContainText('第 5 / 5 阵');
    await expect(page.locator('#briefingRoster')).toContainText('秦琪 · 黄河渡');
    await expect(page.locator('#briefingReason')).toContainText('最后一渡');
    await expect(page.locator('#briefingWin')).toContainText('古城');
  });

  test('真实赢下千里首阵后,第二阵取消仍续接且不重复补给', async ({ page }) => {
    test.setTimeout(180_000);
    await newGame(page, 'fast=1&seed=RUN05&chips=5000&opp=20&chapter=qianli&omen=sow&stage=boss');
    await page.click('#openPage');
    await enterBattle(page, 'boss');
    await installDriver(page, 'maniac', { autoSettle: false, autoBriefing: false });
    await expect(page.locator('#battleBriefing')).toBeVisible({ timeout: 120_000 });
    await stopDriver(page);
    await expect(page.locator('#briefingTitle')).toHaveText('洛阳 · 韩福');
    await expect(page.locator('#briefingRound')).toContainText('第 2 / 5 阵');
    await page.click('#briefingBack');
    await expect(page.locator('#map')).toBeVisible();
    await expect(page.locator('#marchInfo')).toContainText('第 2 / 5 阵');
    const chips = await page.locator('#runChips').textContent();

    await clickAvailNode(page, 'boss');
    await expect(page.locator('#briefingTitle')).toHaveText('洛阳 · 韩福');
    await expect(page.locator('#briefingRound')).toContainText('第 2 / 5 阵');
    await page.click('#briefingBack');
    await expect(page.locator('#runChips')).toHaveText(chips);
    await expect(page.locator('#mapSvg [data-node="m5"]')).toBeFocused();
    await clickAvailNode(page, 'boss');
    await confirmBriefing(page);
    await waitButtons(page);
    await expect(page.locator('#bannerMain')).toHaveText('韩福');
    await expect(page.locator('#bannerSub')).toContainText('韩某敬你之名');
    await expect(page.locator('#errBox')).toBeEmpty();
  });

  test('七擒七阵逐一换文,不是同一段战书重复七次', async ({ page }) => {
    const titles = ['第一擒 · 先赢其勇', '第二擒 · 不服其计', '第三擒 · 旧友与藤甲', '第四擒 · 火不伤其心', '第五擒 · 问服谁', '第六擒 · 同桌明言', '第七擒 · 自定明日'];
    const reasons = new Set();
    for (let round = 1; round <= 7; round++) {
      await openBossBriefing(page, 'qiqin', `round=${round}`);
      await expect(page.locator('#briefingTitle')).toHaveText(titles[round - 1]);
      await expect(page.locator('#briefingRound')).toContainText(`第 ${round} / 7 阵`);
      await expect(page.locator('#briefingRoster')).toContainText('孟获');
      reasons.add(await page.locator('#briefingReason').textContent());
    }
    expect(reasons.size).toBe(7);
  });

  test('320、390 与矮屏横屏均保住滚动正文和入席按钮', async ({ page }) => {
    for (const size of [{ width: 320, height: 568 }, { width: 390, height: 844 }, { width: 740, height: 390 }]) {
      await page.setViewportSize(size);
      await openBossBriefing(page, 'maicheng');
      const shell = await page.locator('.briefing-shell').boundingBox();
      expect(shell.x).toBeGreaterThanOrEqual(0);
      expect(shell.x + shell.width).toBeLessThanOrEqual(size.width);
      expect(shell.y).toBeGreaterThanOrEqual(0);
      expect(shell.y + shell.height).toBeLessThanOrEqual(size.height);
      const enter = await page.locator('#briefingEnter').boundingBox();
      expect(enter.x).toBeGreaterThanOrEqual(0);
      expect(enter.x + enter.width).toBeLessThanOrEqual(size.width);
      expect(enter.y + enter.height).toBeLessThanOrEqual(size.height);
      await expect(page.locator('#briefingLoss')).toBeVisible();
      const scroll = await page.locator('.briefing-body').evaluate(el => ({ client: el.clientHeight, full: el.scrollHeight }));
      if (scroll.full > scroll.client) {
        await page.locator('.briefing-body').evaluate(el => { el.scrollTop = el.scrollHeight; });
        expect(await page.locator('.briefing-body').evaluate(el => el.scrollTop)).toBeGreaterThan(0);
      }
    }
  });

  test('随机外传也有完整战书,但不会冒充正卷史实', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('yxj_v1', JSON.stringify({ pages: {}, endings: ['unwritten'] }));
    });
    await newGame(page, 'fast=1&omen=sow&stage=boss');
    await page.click('#apocBtn');
    await expect(page.locator('#pageHistory')).toBeHidden();
    await page.click('#openPage');
    await clickAvailNode(page, 'boss');
    await expect(page.locator('#battleBriefing')).toBeVisible();
    await expect(page.locator('#briefingSource')).toHaveText('写卷人随机外传');
    await expect(page.locator('#briefingReason')).toContainText('不在旧卷中的对局');
    await expect(page.locator('#briefingWin')).toContainText('不改动正卷三十二回');
  });
});

test.describe('剧情可达性与作用域', () => {
  test('洛阳、官渡、长坂的战斗节点先播见闻,再展战书', async ({ page }) => {
    for (const [id, title] of [['qianli', '洛阳 · 明暗两关'], ['guandu', '官渡 · 真账假账'], ['changban', '长坂坡 · 一桥三令']]) {
      await newGame(page, `fast=1&chapter=${id}&omen=sow&node=m2`);
      await page.click('#openPage');
      await clickAvailNode(page, 'battle');
      await expect(page.locator('#eventBox')).toContainText(title);
      await expect(page.locator('#battleBriefing')).toBeHidden();
      await page.locator('#eventBox [data-choice]').first().click();
      await expect(page.locator('#battleBriefing')).toBeVisible();
      await expect(page.locator('#battle')).toBeHidden();
      await page.keyboard.press('Escape');
      await expect(page.locator('#mapSvg [data-node="m2"]')).toBeFocused();
    }
  });

  test('普通遭遇不消费孔秀开场,真正关底仍能看到', async ({ page }) => {
    await newGame(page, 'fast=1&seed=PB-SCOPE&chapter=qianli&omen=sow');
    await page.click('#openPage');
    await enterBattle(page, 'battle');
    await waitButtons(page);
    await expect(page.locator('#bannerMain')).not.toHaveText('孔秀');
    await expect(page.locator('#bannerSub')).not.toContainText('东岭关只认丞相文凭');

    await openBossBriefing(page, 'qianli', 'seed=PB-SCOPE');
    await confirmBriefing(page);
    await waitButtons(page);
    await expect(page.locator('#bannerMain')).toHaveText('孔秀');
    await expect(page.locator('#bannerSub')).toContainText('东岭关只认丞相文凭');
  });

  test('胜利后可续读下一回,且先落存档再翻页', async ({ page }) => {
    test.setTimeout(180_000);
    await newGame(page, 'fast=1&seed=PB-NEXT&chips=5000&bossopp=1&chapter=taoyuan&omen=sow&stage=boss');
    await page.click('#openPage');
    await enterBattle(page, 'boss');
    await installDriver(page, 'maniac', { autoSettle: false });
    await expect(page.locator('#settle')).toBeVisible({ timeout: 120_000 });
    await stopDriver(page);
    await expect(page.locator('#settleTitle')).toContainText('改写');
    await expect(page.locator('#settleNext')).toHaveText('续读 · 汜水');
    await page.click('#settleNext');
    await expect(page.locator('#page')).toBeVisible();
    await expect(page.locator('#pageName')).toHaveText('汜水');
    expect(await page.evaluate(() => JSON.parse(localStorage.getItem('yxj_v1')).pages.taoyuan)).toBe('yeshi');
  });
});

// 广度矩阵只验证每回真实 DOM 可达与阵容结构;精确文案由上方独立场景验收。
for (const chapter of CHAPTERS) {
  test(`逐回战书矩阵:${chapter.name} · 关底可展卷`, async ({ page }) => {
    await openBossBriefing(page, chapter.id, 'round=1');
    await expect(page.locator('#page')).toBeHidden();
    await expect(page.locator('#briefingTitle')).not.toBeEmpty();
    await expect(page.locator('#briefingReason')).not.toBeEmpty();
    await expect(page.locator('#briefingWin')).not.toBeEmpty();
    await expect(page.locator('#briefingLoss')).not.toBeEmpty();
    await expect(page.locator('#briefingSource')).not.toBeEmpty();
    const expected = rosterOf(roundConfig(chapter.boss, 1)).length;
    await expect(page.locator('#briefingRoster .briefing-enemy')).toHaveCount(expected);
    await expect(page.locator('#battle')).toBeHidden();
    await expect(page.locator('#settle')).toBeHidden();
    expect(await page.evaluate(id => JSON.parse(localStorage.getItem('yxj_v1')).pages[id], chapter.id)).toBeUndefined();
    await expect.poll(() => page.locator('#briefingRoster .portrait-img').evaluateAll(images => images.every(img => img.complete && img.naturalWidth === 240))).toBe(true);
    await expect(page.locator('#errBox')).toBeEmpty();
  });
}
