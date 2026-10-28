import { HAND_NAMES, SUIT_RED, cardName, suitOf } from './poker.js';

const $ = id => document.getElementById(id);
const percent = value => value > 0 && value < 0.001 ? '<0.1%' : `${(value * 100).toFixed(1)}%`;

function drawRow(draw, detailed = false) {
  const row = document.createElement('div');
  row.className = detailed ? 'odds-draw-detail' : 'odds-draw-preview';
  const head = document.createElement('div');
  head.className = 'odds-draw-head';
  const name = document.createElement('b');
  name.textContent = draw.name;
  const value = document.createElement('strong');
  value.textContent = percent(draw.probability);
  head.append(name, value);
  row.appendChild(head);

  const meta = document.createElement('small');
  meta.textContent = `${draw.outs.length} outs${detailed ? ` · 下一张 ${percent(draw.nextProbability)}` : ''}`;
  row.appendChild(meta);
  if (detailed) {
    const cards = document.createElement('div');
    cards.className = 'odds-outs';
    cards.setAttribute('aria-label', `${draw.name}补牌:${draw.outs.map(cardName).join('、')}`);
    for (const id of draw.outs) {
      const card = document.createElement('span');
      card.textContent = cardName(id);
      card.classList.toggle('red', SUIT_RED[suitOf(id)]);
      cards.appendChild(card);
    }
    row.appendChild(cards);
  }
  return row;
}

export function createOddsPanel() {
  const root = $('oddsPanel'), details = $('oddsDetails'), detailsBody = document.querySelector('.odds-details-body');

  function positionDetails() {
    if (!details.open) return;
    detailsBody.classList.remove('odds-open-up');
    detailsBody.style.maxHeight = '';
    const rect = details.getBoundingClientRect();
    const below = window.innerHeight - rect.bottom - 26;
    const above = rect.top - 26;
    const openUp = below < 280 && above > below;
    detailsBody.classList.toggle('odds-open-up', openUp);
    detailsBody.style.maxHeight = `${Math.max(100, openUp ? above : below)}px`;
  }
  details.addEventListener('toggle', positionDetails);
  addEventListener('resize', positionDetails);

  function clear() {
    root.classList.add('hidden');
    root.dataset.state = 'idle';
    details.open = false;
  }

  function pending() {
    root.classList.remove('hidden');
    root.dataset.state = root.dataset.state === 'ready' ? 'refreshing' : 'loading';
    $('oddsStatus').textContent = '推演中';
  }

  function render(result) {
    root.classList.remove('hidden');
    root.dataset.state = 'ready';
    root.dataset.street = String(result.street);
    root.dataset.opponents = String(result.opponents);
    $('oddsStatus').textContent = `${result.opponents} 名对手 · 公开信息`;
    $('oddsWin').textContent = percent(result.equity.win);
    $('oddsTie').textContent = percent(result.equity.tie);
    $('oddsShare').textContent = percent(result.equity.e);
    $('oddsShareWrap').classList.toggle('hidden', result.opponents === 1);

    const preview = $('oddsDrawPreview');
    preview.replaceChildren();
    const empty = result.street === 0 ? '翻牌后推演听牌与 outs'
      : result.street === 5 ? '公共牌已齐 · 无后续听牌'
        : result.draws.length ? '' : '暂无下一张可提升的牌型';
    if (empty) {
      const text = document.createElement('p');
      text.className = 'odds-empty';
      text.textContent = empty;
      preview.appendChild(text);
    } else {
      for (const draw of result.draws.slice(0, 2)) preview.appendChild(drawRow(draw));
    }

    const draws = $('oddsDraws');
    draws.replaceChildren();
    if (result.draws.length) for (const draw of result.draws) draws.appendChild(drawRow(draw, true));
    else {
      const text = document.createElement('p');
      text.className = 'odds-empty';
      text.textContent = empty;
      draws.appendChild(text);
    }

    $('oddsDistributionMethod').textContent = result.distribution.exact
      ? `穷举 ${result.distribution.runouts} 种` : `模拟 ${result.distribution.runouts} 次`;
    const distribution = $('oddsDistribution');
    distribution.replaceChildren();
    result.distribution.categories.forEach((probability, cat) => {
      const cell = document.createElement('div');
      cell.className = 'odds-dist-cell';
      const label = document.createElement('span');
      label.textContent = HAND_NAMES[cat];
      const value = document.createElement('b');
      value.textContent = percent(probability);
      const track = document.createElement('i');
      const fill = document.createElement('i');
      fill.style.width = `${Math.max(probability > 0 ? 2 : 0, probability * 100)}%`;
      track.appendChild(fill);
      cell.append(label, value, track);
      distribution.appendChild(cell);
    });
  }

  function error() {
    root.classList.remove('hidden');
    root.dataset.state = 'error';
    $('oddsStatus').textContent = '推演暂不可用';
  }

  details.addEventListener('keydown', event => {
    if (event.key === 'Escape') { details.open = false; details.querySelector('summary').focus(); }
  });
  return { clear, pending, render, error };
}
