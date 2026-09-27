'use strict';
// ============================================================
//  PACIÊNCIA DOS NÚMEROS — TriPeaks com números em japonês.
//  Jogue uma carta livre se ela for ±1 da carta de cima (10↔1 também vale).
//  As cartas vêm como kanji (三), leitura (さん), contador つ (みっつ) e 人 (さんにん).
// ============================================================
const NUMS = {
  kanji: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'],
  kana:  ['いち', 'に', 'さん', 'よん', 'ご', 'ろく', 'なな', 'はち', 'きゅう', 'じゅう'],
  tsu:   ['ひとつ', 'ふたつ', 'みっつ', 'よっつ', 'いつつ', 'むっつ', 'ななつ', 'やっつ', 'ここのつ', 'とお'],
  nin:   ['ひとり', 'ふたり', 'さんにん', 'よにん', 'ごにん', 'ろくにん', 'ななにん', 'はちにん', 'きゅうにん', 'じゅうにん'],
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
  s: null,
  open() {
    G.busy = true; G.scene = 'cards';
    const el = document.createElement('div'); el.id = 'sol'; $('#game').appendChild(el);
    this.deal();
  },
  deal() {
    const styles = Object.keys(NUMS);
    const deck = [];
    for (let i = 0; i < 52; i++) deck.push({ v: (i % 10) + 1, st: pick(styles), id: i });
    shuffle(deck);
    const tab = deck.slice(0, 28).map((c, i) => ({ ...c, i, removed: false, up: i >= 18 }));
    const stock = deck.slice(28);
    this.s = { tab, stock, waste: [stock.pop()], streak: 0, score: 0, peaks: 0, help: false, over: false, flash: null };
    this.render();
  },
  label(c) { return NUMS[c.st][c.v - 1]; },
  free(i) { const t = this.s.tab[i]; return !t.removed && COVER[i].every(j => this.s.tab[j].removed); },
  adj(a, b) { const d = Math.abs(a - b); return d === 1 || d === 9; },
  hasMove() { const top = this.s.waste[this.s.waste.length - 1]; return this.s.tab.some((t, i) => this.free(i) && this.adj(t.v, top.v)); },
  cardHTML(c, x, y, w, h, cls, attrs = '') {
    const lab = this.label(c), len = [...lab].length;
    const fs = Math.min(w * .58, (h * .78) / len);
    return `<div class="card ${cls}" ${attrs} style="left:${x}px;top:${y}px;width:${w}px;height:${h}px">
      <span class="cv jp ${len > 1 ? 'vert' : ''}" style="font-size:${fs}px">${lab}</span>
      ${this.s.help || (this.s.flash && this.s.flash.includes(c.id)) ? `<span class="cd">${c.v}</span>` : ''}</div>`;
  },
  render() {
    const s = this.s, el = $('#sol');
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
    const coins = Math.floor(s.score / 8 * (s.help ? .5 : 1));
    el.innerHTML = `
      <div class="sol-top"><b>🃏 Paciência dos Números</b><span>Pontos ${s.score} · 💰 +${coins}円 · Sequência ×${s.streak}</span><button class="btn tiny" id="sol-x">Sair</button></div>
      <div class="sol-rule">Toque numa carta livre que seja <b>±1</b> da carta de baixo (10↔1 vale). Leia os números em japonês!</div>
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
    const s = this.s; if (s.over) return;
    const t = s.tab[i], top = s.waste[s.waste.length - 1];
    if (!this.adj(t.v, top.v)) {
      sfx('wrong'); s.flash = [t.id, top.id]; s.streak = 0; this.render();
      toast(`<span class="jp">${this.label(t)}</span> = ${t.v} · <span class="jp">${this.label(top)}</span> = ${top.v}`);
      setTimeout(() => { if (this.s === s) { s.flash = null; this.render(); } }, 1400);
      return;
    }
    sfx('flip'); t.removed = true; s.waste.push(t); s.streak++; s.score += 10 * s.streak;
    if (s.streak >= 3) sfx('coin');
    s.tab.forEach((c, j) => { if (!c.up && this.free(j)) c.up = true; });
    const peaksNow = [0, 1, 2].filter(j => s.tab[j].removed).length;
    if (peaksNow > s.peaks) { s.score += 50 * (peaksNow - s.peaks); s.peaks = peaksNow; toast('⛰ Pico limpo! +50'); }
    if (s.tab.every(c => c.removed)) { s.score += 200 + s.stock.length * 10; sfx('victory'); return this.finish(true); }
    this.render(); this.checkStuck();
  },
  draw() {
    const s = this.s; if (s.over || !s.stock.length) return;
    sfx('flip'); s.waste.push(s.stock.pop()); s.streak = 0; this.render(); this.checkStuck();
  },
  checkStuck() { if (!this.s.stock.length && !this.hasMove()) setTimeout(() => this.finish(false), 600); },
  finish(won) {
    const s = this.s; if (!s || s.over) return;
    s.over = true;
    const coins = Math.floor(s.score / 8 * (s.help ? .5 : 1));
    G.save.money += coins; if (coins) sfx('coin'); saveGame();
    const el = $('#sol');
    el.innerHTML = `<div class="sol-end pwin">
      <h3>${won ? '🎉 Você limpou os 3 picos!' : '🃏 Fim de jogo'}</h3>
      <p>Pontos: <b>${s.score}</b> · Ganhou <b>${coins}円</b></p>
      <div class="brow"><button class="btn" id="sol-again">Jogar de novo</button><button class="btn sec" id="sol-out">Voltar</button></div></div>`;
    $('#sol-again', el).onclick = () => this.deal();
    $('#sol-out', el).onclick = () => this.close();
  },
  close() {
    const el = $('#sol'); if (el) el.remove();
    this.s = null; G.scene = 'world'; G.busy = false; Input.clearHold(); refreshHUD();
  },
};
