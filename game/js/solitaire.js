'use strict';
// ============================================================
//  PACIÊNCIA DOS NÚMEROS — TriPeaks com números em japonês.
//  Jogue uma carta livre se ela for ±1 da carta de baixo (a última
//  com a primeira também vale: 10↔1, 12↔1).
//  Modos: Clássico, Contadores, Dias do mês, Horas e Meses.
// ============================================================
const J10 = ['いち', 'に', 'さん', 'よん', 'ご', 'ろく', 'なな', 'はち', 'きゅう', 'じゅう'];
const K12 = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'];
const SOL_MODES = {
  classic: {
    name: 'Clássico', icon: '🔢', n: 10, desc: 'Números de 1 a 10: kanji, leitura, contador つ e pessoas 人.',
    styles: () => ({
      kanji: K12.slice(0, 10), kana: J10,
      tsu: ['ひとつ', 'ふたつ', 'みっつ', 'よっつ', 'いつつ', 'むっつ', 'ななつ', 'やっつ', 'ここのつ', 'とお'],
      nin: ['ひとり', 'ふたり', 'さんにん', 'よにん', 'ごにん', 'ろくにん', 'ななにん', 'はちにん', 'きゅうにん', 'じゅうにん'],
    }),
  },
  counters: {
    name: 'Contadores', icon: '🍶', n: 10, desc: '本・枚・匹・冊・台・杯・個… cuidado com as mudanças de som (いっぽん, さんびき…)!',
    styles: () => {
      const out = {};
      shuffle((window.COUNTERS_DATA || []).filter(c => c.key !== 'tsu' && c.key !== 'nin').slice()).slice(0, 5).forEach(c => { const r = c.readings.slice(); r.icon = c.icon; out[c.key] = r; });
      return Object.keys(out).length ? out : SOL_MODES.classic.styles();
    },
  },
  days: {
    name: 'Dias do mês', icon: '📅', n: 10, desc: 'Do dia 1 ao 10 — quase todos têm leitura especial: ついたち, ふつか, みっか…',
    styles: () => ({
      kanji: K12.slice(0, 10).map(k => k + '日'),
      kana: ['ついたち', 'ふつか', 'みっか', 'よっか', 'いつか', 'むいか', 'なのか', 'ようか', 'ここのか', 'とおか'],
    }),
  },
  hours: {
    name: 'Horas', icon: '🕐', n: 12, desc: 'De 1 a 12 horas (12↔1 vale). Atenção: よじ, しちじ, くじ!',
    styles: () => ({
      kanji: K12.map(k => k + '時'),
      kana: ['いちじ', 'にじ', 'さんじ', 'よじ', 'ごじ', 'ろくじ', 'しちじ', 'はちじ', 'くじ', 'じゅうじ', 'じゅういちじ', 'じゅうにじ'],
    }),
  },
  months: {
    name: 'Meses', icon: '🗓', n: 12, desc: 'Janeiro a dezembro (12↔1 vale). Atenção: しがつ, しちがつ, くがつ!',
    styles: () => ({
      kanji: K12.map(k => k + '月'),
      kana: ['いちがつ', 'にがつ', 'さんがつ', 'しがつ', 'ごがつ', 'ろくがつ', 'しちがつ', 'はちがつ', 'くがつ', 'じゅうがつ', 'じゅういちがつ', 'じゅうにがつ'],
    }),
  },
};
const COVER = (() => {
  const c = {};
  for (let g = 0; g < 3; g++) c[g] = [3 + 2 * g, 4 + 2 * g];
  for (let k = 0; k < 6; k++) { const g = Math.floor(k / 2), t = k % 2; c[3 + k] = [9 + 3 * g + t, 10 + 3 * g + t]; }
  for (let j = 0; j < 9; j++) c[9 + j] = [18 + j, 19 + j];
  for (let j = 0; j < 10; j++) c[18 + j] = [];
  return c;
})();
function tpPos(i) {
  if (i < 3) return { row: 0, x: 3 * i + 1.5 };
  if (i < 9) { const k = i - 3, g = Math.floor(k / 2), t = k % 2; return { row: 1, x: 3 * g + t + 1 }; }
  if (i < 18) return { row: 2, x: i - 9 + .5 };
  return { row: 3, x: i - 18 };
}

const Solitaire = {
  s: null, mode: 'classic',
  open() {
    G.busy = true; G.scene = 'cards';
    Music.play('dojo');
    const el = document.createElement('div'); el.id = 'sol'; $('#game').appendChild(el);
    this.menu();
  },
  menu() {
    this.s = null;
    const best = G.save.solBest || (G.save.solBest = {});
    $('#sol').innerHTML = `<div class="sol-menu pwin">
      <h3>🃏 Paciência dos Números</h3>
      <p class="dim">Toque numa carta livre que seja <b>±1</b> da carta de baixo. Limpe os 3 picos! Sequências longas valem mais 円.</p>
      <div class="sol-modes">${Object.keys(SOL_MODES).map(k => { const m = SOL_MODES[k]; return `<button class="sol-mode" data-m="${k}">
        <span class="smi">${m.icon}</span><span><b>${m.name}</b><small class="dim">${esc(m.desc)}</small></span><span class="smb">${best[k] ? '★ ' + best[k] : ''}</span></button>`; }).join('')}</div>
      <div class="brow"><button class="btn sec" id="sol-out">Voltar</button></div></div>`;
    $$('.sol-mode').forEach(b => b.onclick = () => { sfx('confirm'); this.mode = b.dataset.m; this.deal(); });
    $('#sol-out').onclick = () => this.close();
  },
  deal() {
    const M = SOL_MODES[this.mode], styles = M.styles(), keys = Object.keys(styles);
    const deck = [];
    for (let i = 0; i < 52; i++) deck.push({ v: (i % M.n) + 1, st: pick(keys), id: i });
    shuffle(deck);
    const tab = deck.slice(0, 28).map((c, i) => ({ ...c, i, removed: false, up: i >= 18 }));
    const stock = deck.slice(28);
    this.s = { tab, stock, styles, n: M.n, waste: [stock.pop()], streak: 0, best: 0, score: 0, peaks: 0, help: false, over: false, flash: null };
    this.render();
  },
  label(c) { return this.s.styles[c.st][c.v - 1]; },
  icon(c) { return this.s.styles[c.st].icon || ''; },
  free(i) { const t = this.s.tab[i]; return !t.removed && COVER[i].every(j => this.s.tab[j].removed); },
  adj(a, b) { const d = Math.abs(a - b); return d === 1 || d === this.s.n - 1; },
  hasMove() { const top = this.s.waste[this.s.waste.length - 1]; return this.s.tab.some((t, i) => this.free(i) && this.adj(t.v, top.v)); },
  cardHTML(c, x, y, w, h, cls, attrs = '') {
    const lab = this.label(c), chars = [...lab], len = chars.length;
    // rótulos longos viram duas colunas (lê-se da direita pra esquerda)
    const cols = len > 4 ? 2 : 1, per = Math.ceil(len / cols);
    const text = cols === 2 ? esc(chars.slice(0, per).join('')) + '<br>' + esc(chars.slice(per).join('')) : esc(lab);
    const fs = Math.min(w * (cols === 2 ? .38 : .58), (h * .8) / per);
    const ic = this.icon(c);
    return `<div class="card ${cls}" ${attrs} style="left:${x}px;top:${y}px;width:${w}px;height:${h}px">
      <span class="cv jp ${len > 1 ? 'vert' : ''}" style="font-size:${fs}px">${text}</span>
      ${ic ? `<span class="cic">${ic}</span>` : ''}
      ${this.s.help || (this.s.flash && this.s.flash.includes(c.id)) ? `<span class="cd">${c.v}</span>` : ''}</div>`;
  },
  coins() { return Math.floor(this.s.score / 8 * (this.s.help ? .5 : 1)); },
  render() {
    const s = this.s, el = $('#sol'); if (!s) return;
    const bw = Math.min(window.innerWidth - 16, 760), W = Math.floor(bw / 10), H = Math.round(W * 1.42);
    const top = s.waste[s.waste.length - 1];
    let cards = '';
    s.tab.forEach((t, i) => {
      if (t.removed) return;
      const p = tpPos(i), x = p.x * W, y = p.row * H * .52;
      if (!t.up) cards += `<div class="card back" style="left:${x}px;top:${y}px;width:${W}px;height:${H}px"><span>言</span></div>`;
      else cards += this.cardHTML(t, x, y, W, H, this.free(i) ? 'free' : 'blocked', `data-i="${i}"`);
    });
    const boardH = H * .52 * 3 + H;
    const M = SOL_MODES[this.mode];
    el.innerHTML = `
      <div class="sol-top"><b>${M.icon} ${M.name}</b><span>Pontos ${s.score} · 💰 +${this.coins()}円 · Sequência ×${s.streak}</span><button class="btn tiny" id="sol-x">Sair</button></div>
      <div class="sol-rule">Toque numa carta livre que seja <b>±1</b> da carta de baixo (${s.n}↔1 vale). Leia em japonês!</div>
      <div class="sol-board" style="width:${W * 10}px;height:${boardH}px">${cards}</div>
      <div class="sol-bottom">
        <div class="card back stock ${s.stock.length ? '' : 'empty'}" id="sol-stock" style="width:${W * 1.25}px;height:${H * 1.25}px"><span>${s.stock.length}</span></div>
        ${this.cardHTML(top, 0, 0, W * 1.25, H * 1.25, 'waste')}
        <button class="btn tiny ${s.help ? 'on' : ''}" id="sol-help">${s.help ? '🔢 números ON (½ 円)' : '🔢 mostrar números'}</button>
      </div>`;
    $$('.card.free', el).forEach(c => c.onclick = () => this.play(+c.dataset.i));
    $('#sol-stock', el).onclick = () => this.draw();
    $('#sol-help', el).onclick = () => { s.help = !s.help; this.render(); };
    $('#sol-x', el).onclick = () => this.finish(false);
  },
  play(i) {
    const s = this.s; if (!s || s.over) return;
    const t = s.tab[i], top = s.waste[s.waste.length - 1];
    if (!this.adj(t.v, top.v)) {
      sfx('wrong'); s.flash = [t.id, top.id]; s.streak = 0; this.render();
      toast(`<span class="jp">${this.label(t)}</span> = ${t.v} · <span class="jp">${this.label(top)}</span> = ${top.v}`);
      setTimeout(() => { if (this.s === s) { s.flash = null; this.render(); } }, 1400);
      return;
    }
    sfx('flip'); speak(this.label(t));
    t.removed = true; s.waste.push(t); s.streak++; s.best = Math.max(s.best, s.streak); s.score += 10 * s.streak;
    if (s.streak >= 3) sfx('coin');
    s.tab.forEach((c, j) => { if (!c.up && this.free(j)) c.up = true; });
    const peaksNow = [0, 1, 2].filter(j => s.tab[j].removed).length;
    if (peaksNow > s.peaks) { s.score += 50 * (peaksNow - s.peaks); s.peaks = peaksNow; toast('⛰ Pico limpo! +50'); }
    if (s.tab.every(c => c.removed)) { s.score += 200 + s.stock.length * 10; sfx('victory'); return this.finish(true); }
    this.render(); this.checkStuck();
  },
  draw() {
    const s = this.s; if (!s || s.over || !s.stock.length) return;
    sfx('flip'); s.waste.push(s.stock.pop()); s.streak = 0; this.render(); this.checkStuck();
  },
  checkStuck() { if (!this.s.stock.length && !this.hasMove()) setTimeout(() => this.finish(false), 600); },
  finish(won) {
    const s = this.s; if (!s || s.over) return;
    s.over = true;
    const coins = this.coins();
    G.save.money += coins; if (coins) sfx('coin');
    const best = G.save.solBest || (G.save.solBest = {}), rec = s.score > (best[this.mode] || 0);
    if (rec) best[this.mode] = s.score;
    saveGame();
    const el = $('#sol');
    el.innerHTML = `<div class="sol-end pwin">
      <h3>${won ? '🎉 Você limpou os 3 picos!' : '🃏 Fim de jogo'}</h3>
      <p>Pontos: <b>${s.score}</b>${rec ? ' · 🌟 recorde!' : ''} · maior sequência ×${s.best}</p>
      <p>Ganhou <b>${coins}円</b></p>
      <div class="brow"><button class="btn" id="sol-again">Jogar de novo</button><button class="btn sec" id="sol-modes">Modos</button><button class="btn sec" id="sol-out">Voltar</button></div></div>`;
    $('#sol-again', el).onclick = () => this.deal();
    $('#sol-modes', el).onclick = () => this.menu();
    $('#sol-out', el).onclick = () => this.close();
  },
  close() {
    const el = $('#sol'); if (el) el.remove();
    this.s = null; G.scene = 'world'; G.busy = false; Input.clearHold(); refreshHUD();
    Music.play(W.map.music);
  },
};
