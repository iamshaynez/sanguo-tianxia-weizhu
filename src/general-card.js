// general-card.js —— 三国志式武将卡:入场与观阵录共用立绘、六维组件
import { TRAITS, describeTraits } from './persona.js';
import { portraitImage } from './portrait.js';

const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[ch]));

export function traitGrid(traits = {}, { id = '', className = '', compact = false } = {}) {
  const bands = describeTraits(traits);
  const cells = bands.map((b, i) => `<div class="trait-cell" data-trait="${TRAITS[i]}" title="${esc(b.label)}">
    <div class="trait-line"><span>${TRAITS[i]}</span><b>${b.value}</b></div>
    <div class="trait-track"><i style="width:${b.value}%"></i></div>
    ${compact ? '' : `<small>${esc(b.label)}</small>`}
  </div>`).join('');
  return `<div${id ? ` id="${id}"` : ''} class="trait-grid ${className}">${cells}</div>`;
}

export function renderGeneralCard(mount, {
  name, bio = '', quote = '', traits = {}, rule = '', skin = 'default',
  eyebrow = '关 卡', year = '', gate = false, skirmish = false,
}) {
  mount.innerHTML = `
    <div class="general-art">
      <div class="art-sun"></div>
      <div class="art-ink art-ink-a"></div><div class="art-ink art-ink-b"></div>
      ${portraitImage(skin)}
      <span class="art-seal">${gate ? '关' : skirmish ? '遇' : '将'}</span>
      <span class="art-caption">残卷留影</span>
    </div>
    <section class="general-info">
      <div class="general-kicker"><span class="bi-label">${esc(eyebrow)}</span><span>${esc(year)}</span></div>
      <div class="general-title-row"><h2 id="bossIntroName">${esc(name)}</h2><span class="general-faction">汉末</span></div>
      <p id="bossIntroBio">${esc(bio)}</p>
      <div class="general-rule"><span>本回战法</span><p id="bossIntroRule">${esc(rule)}</p></div>
      ${traitGrid(traits, { id: 'bossIntroTraits' })}
      <div class="general-footer">
        <p id="bossIntroQuote">${quote ? `「${esc(quote)}」` : '乱世无路,牌上见。'}</p>
        <button id="introSkip" type="button">${skirmish ? '交 锋' : '应 战'}<small>点击继续</small></button>
      </div>
    </section>`;
}
