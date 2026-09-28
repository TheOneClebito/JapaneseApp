'use strict';
// ============================================================
//  SPRITES — pixel art gerada por código (sem arquivos de imagem)
// ============================================================
const TS = 16;
const JP_FONT = '"Hiragino Maru Gothic ProN","Hiragino Sans","Hiragino Kaku Gothic ProN","Yu Gothic UI","Yu Gothic","YuGothic","Meiryo","Noto Sans JP",sans-serif';
function mkCanvas(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
function _px(g, x, y, w, h, c) { g.fillStyle = c; g.fillRect(x, y, w, h); }
function shade(hex, amt) {
  const n = parseInt(hex.slice(1), 16);
  let r = n >> 16, gg = (n >> 8) & 255, b = n & 255;
  const f = v => clamp(Math.round(amt < 0 ? v * (1 + amt) : v + (255 - v) * amt), 0, 255);
  return '#' + ((1 << 24) | (f(r) << 16) | (f(gg) << 8) | f(b)).toString(16).slice(1);
}

// ---------- Tiles ----------
function paintGrass(g, v) {
  _px(g, 0, 0, 16, 16, '#62b44c');
  const r = mulberry32(1000 + v);
  for (let i = 0; i < 10; i++) _px(g, Math.floor(r() * 16), Math.floor(r() * 16), 1, 1, r() < .5 ? '#56a342' : '#7ac861');
  for (let i = 0; i < 2; i++) { const x = Math.floor(r() * 13) + 1, y = Math.floor(r() * 12) + 3; _px(g, x, y, 1, 2, '#4d973c'); _px(g, x + 1, y - 1, 1, 2, '#4d973c'); }
}
function paintTall(g, f) {
  paintGrass(g, 3);
  for (let row = 0; row < 2; row++) {
    const by = 8 + row * 7;
    for (let x = 0; x < 16; x += 4) {
      const bx = x + (row ? 2 : 0), o = (f + row) % 2;
      _px(g, bx, by - 4, 1, 5, '#2c7427'); _px(g, bx + 2, by - 4, 1, 5, '#2c7427');
      _px(g, bx + 1, by - 6 + o, 1, 7 - o, '#3c9434'); _px(g, bx + 1, by - 6 + o, 1, 1, '#a4ec74');
    }
  }
}
function paintTree(g) {
  paintGrass(g, 1);
  _px(g, 7, 11, 2, 4, '#6b4020'); _px(g, 6, 14, 4, 1, '#4a2a12');
  for (let y = 0; y < 13; y++) for (let x = 0; x < 16; x++) {
    const dx = x - 7.5, dy = y - 6.5, d = dx * dx + dy * dy * 1.1;
    if (d < 44) { let c = '#2e7d32'; if (d > 31) c = '#1d5723'; else if (dx < -1 && dy < -1) c = '#46a84a'; if (dx < -2.5 && dy < -2.5 && d < 20) c = '#7ccf6a'; _px(g, x, y, 1, 1, c); }
  }
}
function paintWater(g, f) {
  _px(g, 0, 0, 16, 16, '#3a7fd8');
  const r = mulberry32(77);
  for (let i = 0; i < 5; i++) { const x = (Math.floor(r() * 16) + f * 2) % 16, y = Math.floor(r() * 15); _px(g, x, y, 3, 1, '#86c8ff'); }
  _px(g, 0, 0, 16, 1, '#5a9ae8');
}
function paintPath(g, v) {
  _px(g, 0, 0, 16, 16, '#dcb97c');
  const r = mulberry32(300 + v);
  for (let i = 0; i < 8; i++) _px(g, Math.floor(r() * 16), Math.floor(r() * 16), 1, 1, r() < .5 ? '#c49f63' : '#eed4a2');
}
function paintFlowers(g) {
  paintGrass(g, 2);
  [[3, 4, '#ff5a6a'], [10, 3, '#ffe45a'], [6, 10, '#ffffff'], [12, 11, '#ff5a6a']].forEach(([x, y, c]) => {
    _px(g, x, y - 1, 1, 1, c); _px(g, x - 1, y, 1, 1, c); _px(g, x + 1, y, 1, 1, c); _px(g, x, y + 1, 1, 1, c); _px(g, x, y, 1, 1, '#ffc400');
  });
}
function paintRock(g) {
  _px(g, 0, 0, 16, 16, '#6b6570');
  const r = mulberry32(55);
  for (let i = 0; i < 14; i++) _px(g, Math.floor(r() * 15), Math.floor(r() * 16), 2, 1, r() < .5 ? '#57515c' : '#827c88');
  _px(g, 0, 0, 16, 2, '#8a8490'); _px(g, 0, 14, 16, 2, '#48434d'); _px(g, 5, 4, 1, 4, '#48434d'); _px(g, 11, 8, 1, 4, '#48434d');
}
function paintCaveFloor(g, v) {
  _px(g, 0, 0, 16, 16, '#3d3747');
  const r = mulberry32(900 + v);
  for (let i = 0; i < 8; i++) _px(g, Math.floor(r() * 16), Math.floor(r() * 16), 1, 1, r() < .5 ? '#322d3b' : '#4b4557');
}
function paintBoulder(g) {
  paintCaveFloor(g, 1);
  for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) {
    const dx = x - 7.5, dy = y - 8.5, d = dx * dx + dy * dy;
    if (d < 34) { let c = '#6e6878'; if (d > 24) c = '#4e4858'; else if (dx < -1 && dy < -1) c = '#8e889a'; _px(g, x, y, 1, 1, c); }
  }
}
function paintSign(g) {
  paintGrass(g, 0);
  _px(g, 7, 9, 2, 6, '#6b4020'); _px(g, 2, 3, 12, 7, '#7a4a22'); _px(g, 3, 4, 10, 5, '#c9955a');
  _px(g, 4, 5, 8, 1, '#6b4020'); _px(g, 4, 7, 6, 1, '#6b4020');
}
function paintChest(g, open, theme) {
  (theme === 'cave' ? paintCaveFloor : paintGrass)(g, 0);
  _px(g, 2, 6, 12, 8, '#8a4a1e'); _px(g, 2, 13, 12, 1, '#5a2a0e');
  if (!open) { _px(g, 2, 3, 12, 4, '#a85a24'); _px(g, 2, 3, 12, 1, '#c87a3a'); _px(g, 2, 7, 12, 1, '#e8c040'); _px(g, 7, 6, 2, 3, '#f4d860'); }
  else { _px(g, 2, 2, 12, 3, '#5a2a0e'); _px(g, 3, 7, 10, 5, '#2a1408'); }
}
const ROOF = { a: ['#c8453a', '#8e2a22', '#ee7a6e'], b: ['#3a6fc8', '#224a8e', '#72a2ee'], c: ['#4a8a4a', '#2e5e2e', '#80bc80'], d: ['#d8843a', '#9a5820', '#f4ae66'], s: ['#d64032', '#7e1a14', '#f5826e'] };
function paintRoof(g, k) {
  const [b, d, l] = ROOF[k];
  _px(g, 0, 0, 16, 16, b);
  for (let y = 3; y < 16; y += 4) _px(g, 0, y, 16, 1, d);
  for (let y = 0; y < 16; y += 4) for (let x = ((y / 4) % 2) * 4; x < 16; x += 8) _px(g, x, y, 1, 3, shade(b, -0.12));
  _px(g, 0, 0, 16, 1, l);
}
function paintWall(g, win) {
  _px(g, 0, 0, 16, 16, '#efe2c4');
  _px(g, 0, 0, 16, 2, '#8a6a44'); _px(g, 0, 14, 16, 2, '#7a5a38'); _px(g, 0, 0, 1, 16, '#8a6a44'); _px(g, 15, 0, 1, 16, '#8a6a44');
  if (win) { _px(g, 4, 4, 8, 7, '#5a3a1a'); _px(g, 5, 5, 6, 5, '#8fd0ff'); _px(g, 7, 5, 1, 5, '#5a3a1a'); _px(g, 5, 7, 6, 1, '#5a3a1a'); _px(g, 5, 5, 2, 1, '#d8f0ff'); }
}
const DOOR_COLOR = { I: '#9a3a2a', M: '#2a4a9a', J: '#c8303a', P: '#4a6a3a', H: '#6b4a2a' };
function paintDoor(g, k) { paintWall(g, false); _px(g, 3, 3, 10, 13, '#3a2412'); _px(g, 4, 4, 8, 12, DOOR_COLOR[k]); _px(g, 4, 4, 8, 1, shade(DOOR_COLOR[k], .3)); _px(g, 10, 10, 1, 1, '#f4d860'); }
function paintCaveMouth(g) {
  paintRock(g);
  _px(g, 0, 4, 16, 12, '#1a1522');
  const gr = g.createLinearGradient(0, 4, 0, 16); gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(1, 'rgba(0,0,0,.6)');
  g.fillStyle = gr; g.fillRect(0, 4, 16, 12);
  _px(g, 0, 3, 16, 1, '#48434d');
}
function paintExit(g) {
  paintCaveFloor(g, 0);
  const gr = g.createLinearGradient(0, 0, 0, 16); gr.addColorStop(0, 'rgba(255,240,180,0)'); gr.addColorStop(1, 'rgba(255,240,180,.75)');
  g.fillStyle = gr; g.fillRect(0, 0, 16, 16);
}

const TILE_INFO = {
  '.': { walk: 1 }, ',': { walk: 1, grass: 1 }, 'f': { walk: 1 }, '=': { walk: 1 }, '_': { walk: 1, caveFloor: 1 },
  'L': { walk: 1 }, 'X': { walk: 1 },
  'T': {}, '~': {}, '#': {}, 'R': {}, 'S': { sign: 1 }, 'C': { chest: 1 },
  'k': {}, 'u': {}, 'q': {}, 'o': {}, // cerejeira, arbusto, pedra, poste de torii (sólidos)
  'a': {}, 'b': {}, 'c': {}, 'd': {}, 's': {}, 'w': {},
  'I': { door: 'inn' }, 'M': { door: 'shop' }, 'J': { door: 'shrine' }, 'P': { door: 'prof' }, 'H': { door: 'house' },
};
const _tileCache = {};
function getTile(ch, theme, x, y, t, open) {
  const anim = (ch === '~' || ch === ',') ? (Math.floor(t * 2) % 2) : 0;
  const v = (ch === '.' || ch === '=' || ch === '_') ? (hashStr(x * 131 + y * 7) % 4) : 0;
  const win = ch === 'w' ? ((x + y) % 2) : 0;
  const key = ch + '|' + theme + '|' + anim + '|' + v + '|' + win + '|' + (open ? 1 : 0);
  if (_tileCache[key]) return _tileCache[key];
  const c = mkCanvas(TS, TS), g = c.getContext('2d');
  switch (ch) {
    case '.': paintGrass(g, v); break;
    case ',': paintTall(g, anim); break;
    case 'f': paintFlowers(g); break;
    case '=': paintPath(g, v); break;
    case 'T': case 'k': case 'u': paintTree(g); break;
    case 'q': paintBoulder(g); break;
    case 'o': paintGrass(g, v); break;
    case '~': paintWater(g, anim); break;
    case '#': paintRock(g); break;
    case '_': paintCaveFloor(g, v); break;
    case 'R': paintBoulder(g); break;
    case 'S': paintSign(g); break;
    case 'C': paintChest(g, open, theme); break;
    case 'a': case 'b': case 'c': case 'd': case 's': paintRoof(g, ch); break;
    case 'w': paintWall(g, win); break;
    case 'I': case 'M': case 'J': case 'P': case 'H': paintDoor(g, ch); break;
    case 'L': paintCaveMouth(g); break;
    case 'X': paintExit(g); break;
    default: _px(g, 0, 0, 16, 16, '#000');
  }
  return (_tileCache[key] = c);
}

// ---------- Personagens ----------
function outlined(src, color = '#1a1420') {
  const w = src.width, h = src.height, out = mkCanvas(w, h), g = out.getContext('2d');
  const sil = mkCanvas(w, h), sg = sil.getContext('2d');
  sg.drawImage(src, 0, 0); sg.globalCompositeOperation = 'source-in'; sg.fillStyle = color; sg.fillRect(0, 0, w, h);
  [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dx, dy]) => g.drawImage(sil, dx, dy));
  g.drawImage(src, 0, 0);
  return out;
}
function paintChar(g, L, dir, frame) {
  const P = (x, y, w, h, c) => _px(g, x, y, w, h, c);
  const { skin, hair, shirt, pants } = L, hs = L.style;
  const lo = frame === 1 ? 1 : frame === 2 ? -1 : 0;
  const shoe = '#2a1c14';
  if (dir === 'down' || dir === 'up') {
    P(5, 12, 2, 3 - (lo < 0 ? 1 : 0), pants); P(9, 12, 2, 3 - (lo > 0 ? 1 : 0), pants);
    P(5, 15 - (lo < 0 ? 1 : 0), 2, 1, shoe); P(9, 15 - (lo > 0 ? 1 : 0), 2, 1, shoe);
  } else {
    P(6 + lo, 12, 2, 3, pants); P(8 - lo, 12, 2, 3, shade(pants, -.25)); P(6 + lo, 15, 2, 1, shoe); P(8 - lo, 15, 2, 1, shoe);
  }
  P(4, 7, 8, 5, shirt); P(4, 11, 8, 1, shade(shirt, -.25));
  if (dir === 'down' || dir === 'up') { P(3, 8, 1, 3, shirt); P(12, 8, 1, 3, shirt); P(3, 11, 1, 1, skin); P(12, 11, 1, 1, skin); }
  else { const ax = dir === 'left' ? 9 : 6; P(ax, 8, 1, 3, shade(shirt, -.2)); P(ax, 11, 1, 1, skin); }
  P(4, 1, 8, 7, skin);
  if (hs !== 'bald') {
    P(4, 1, 8, 2, hair);
    if (dir === 'up') P(4, 1, 8, 6, hair);
    else if (dir === 'left') P(8, 1, 4, 5, hair);
    else if (dir === 'right') P(4, 1, 4, 5, hair);
    else { P(4, 3, 1, 2, hair); P(11, 3, 1, 2, hair); }
  } else { P(4, 1, 8, 1, shade(skin, -.12)); if (dir !== 'up') { P(4, 3, 1, 3, hair); P(11, 3, 1, 3, hair); } else P(4, 3, 8, 3, hair); }
  if (hs === 'long') { if (dir === 'up') P(4, 1, 8, 8, hair); else { P(3, 2, 1, 7, hair); P(12, 2, 1, 7, hair); } }
  if (hs === 'bun') P(6, 0, 4, 2, hair);
  if (hs === 'spiky') { P(4, 0, 2, 1, hair); P(7, 0, 2, 1, hair); P(10, 0, 2, 1, hair); }
  if (hs === 'cap' || hs === 'hat') {
    const hc = L.hat; P(4, 0, 8, 3, hc); P(4, 0, 8, 1, shade(hc, .25));
    if (hs === 'cap') { if (dir === 'left') P(1, 2, 3, 1, shade(hc, -.25)); else if (dir === 'right') P(12, 2, 3, 1, shade(hc, -.25)); else if (dir === 'down') P(4, 3, 8, 1, shade(hc, -.25)); }
    else P(2, 2, 12, 1, shade(hc, -.25));
  }
  if (hs === 'eboshi') { P(6, 0, 4, 2, '#1a1a1a'); P(5, 1, 6, 1, '#1a1a1a'); }
  const eye = '#1a1420';
  if (dir === 'down') { P(6, 4, 1, 2, eye); P(9, 4, 1, 2, eye); P(5, 6, 1, 1, '#f5a0a0'); P(10, 6, 1, 1, '#f5a0a0'); }
  else if (dir === 'left') P(5, 4, 1, 2, eye);
  else if (dir === 'right') P(10, 4, 1, 2, eye);
}
const _charCache = {};
function getChar(lookKey, dir, frame) {
  const key = lookKey + '|' + dir + '|' + frame;
  if (_charCache[key]) return _charCache[key];
  const c = mkCanvas(18, 18), g = c.getContext('2d');
  g.translate(1, 1); paintChar(g, LOOKS[lookKey] || LOOKS.hero, dir, frame);
  return (_charCache[key] = outlined(c));
}

// ---------- Espíritos de kanji ----------
function roundPoly(g, pts, r) {
  const n = pts.length;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n];
    const a = [p1[0] + (p0[0] - p1[0]) * 0.25, p1[1] + (p0[1] - p1[1]) * 0.25];
    const b = [p1[0] + (p2[0] - p1[0]) * 0.25, p1[1] + (p2[1] - p1[1]) * 0.25];
    if (i === 0) g.moveTo(a[0], a[1]); else g.lineTo(a[0], a[1]);
    g.quadraticCurveTo(p1[0], p1[1], b[0], b[1]);
  }
}
function bodyPath(g, el, w, h) {
  g.beginPath();
  if (el === '水') {
    g.moveTo(0, -h * .52);
    g.bezierCurveTo(w * .16, -h * .32, w * .5, -h * .06, w * .48, h * .12);
    g.bezierCurveTo(w * .45, h * .42, -w * .45, h * .42, -w * .48, h * .12);
    g.bezierCurveTo(-w * .5, -h * .06, -w * .16, -h * .32, 0, -h * .52);
  } else if (el === '火') {
    g.moveTo(-w * .46, h * .1);
    g.bezierCurveTo(-w * .5, -h * .2, -w * .32, -h * .3, -w * .26, -h * .32);
    g.lineTo(-w * .2, -h * .5); g.lineTo(-w * .07, -h * .36); g.lineTo(0, -h * .56); g.lineTo(w * .08, -h * .36);
    g.lineTo(w * .2, -h * .48); g.lineTo(w * .27, -h * .32);
    g.bezierCurveTo(w * .34, -h * .3, w * .5, -h * .18, w * .46, h * .1);
    g.bezierCurveTo(w * .44, h * .42, -w * .44, h * .42, -w * .46, h * .1);
  } else if (el === '金') {
    roundPoly(g, [[-.3, -.44], [.3, -.44], [.48, -.16], [.48, .18], [.32, .4], [-.32, .4], [-.48, .18], [-.48, -.16]].map(([x, y]) => [x * w, y * h]));
  } else if (el === '土') {
    g.ellipse(0, h * .03, w * .52, h * .4, 0, 0, Math.PI * 2);
  } else {
    g.ellipse(0, 0, w * .46, h * .42, 0, 0, Math.PI * 2);
  }
  g.closePath();
}
function drawAura(g, el, s, t, hh, layer) {
  if (layer === 'back') {
    if (el === '水') { g.fillStyle = 'rgba(160,220,255,.85)'; for (let i = 0; i < 3; i++) { const a = t * 1.6 + i * 2.1; g.beginPath(); g.ellipse(Math.cos(a) * s * .6, Math.sin(a) * s * .18 - s * .05, s * .035, s * .05, 0, 0, Math.PI * 2); g.fill(); } }
    if (el === '土') { g.fillStyle = '#7a5a36'; for (let i = 0; i < 3; i++) { const a = t * 1.2 + i * 2.1; g.beginPath(); g.arc(Math.cos(a) * s * .58, s * .36 + Math.sin(a * 2) * s * .02, s * .035, 0, Math.PI * 2); g.fill(); } }
  } else {
    if (el === '火') { for (let i = 0; i < 3; i++) { const p = (t * .9 + i / 3) % 1; g.fillStyle = `rgba(255,${160 + i * 30},60,${1 - p})`; g.beginPath(); g.arc((i - 1) * s * .16 + Math.sin(t * 5 + i) * s * .03, -s * .5 - p * s * .25, s * .04 * (1 - p * .6), 0, Math.PI * 2); g.fill(); } }
    if (el === '木') {
      const sw = Math.sin(t * 2.2) * .25;
      g.save(); g.translate(0, -h_top(s)); g.rotate(sw * .4);
      g.strokeStyle = '#1d6b2a'; g.lineWidth = Math.max(1.5, s * .025); g.beginPath(); g.moveTo(0, 0); g.lineTo(0, -s * .1); g.stroke();
      g.fillStyle = '#6ed85a';
      g.beginPath(); g.ellipse(-s * .07, -s * .12, s * .075, s * .035, -0.5, 0, Math.PI * 2); g.fill();
      g.beginPath(); g.ellipse(s * .07, -s * .12, s * .075, s * .035, 0.5, 0, Math.PI * 2); g.fill();
      g.restore();
    }
    if (el === '金') { for (let i = 0; i < 3; i++) { const p = (Math.sin(t * 3 + i * 2) + 1) / 2; const x = [-.46, .44, .3][i] * s, y = [-.34, -.2, .3][i] * s; g.fillStyle = `rgba(255,250,210,${p})`; const r = s * .045 * p; g.beginPath(); g.moveTo(x, y - r * 2); g.lineTo(x + r * .5, y - r * .5); g.lineTo(x + r * 2, y); g.lineTo(x + r * .5, y + r * .5); g.lineTo(x, y + r * 2); g.lineTo(x - r * .5, y + r * .5); g.lineTo(x - r * 2, y); g.lineTo(x - r * .5, y - r * .5); g.fill(); } }
  }
}
function h_top(s) { return s * .42; }
// o.flip: vira pra esquerda · o.flash: 0..1 brilho de dano · o.alpha · o.scale
function drawSpirit(g, cx, cy, size, c, t, o = {}) {
  const sp = SPECIES[c]; if (!sp) return;
  const E = ELEM[sp.el], hh = hashStr(c);
  const w = size * (0.92 + ((hh >> 3) % 3) * 0.05), h = size;
  const wob = Math.sin(t * 3 + (hh % 10)) * 0.04;
  g.save(); g.translate(cx, cy);
  if (o.scale != null) g.scale(o.scale, o.scale);
  if (o.alpha != null) g.globalAlpha = o.alpha;
  g.fillStyle = 'rgba(0,0,0,.28)'; g.beginPath(); g.ellipse(0, h * .47, w * .42, h * .08, 0, 0, Math.PI * 2); g.fill();
  g.save(); g.scale((o.flip ? -1 : 1) * (1 - wob), 1 + wob);
  drawAura(g, sp.el, size, t, hh, 'back');
  g.fillStyle = E.dark; g.beginPath();
  g.ellipse(-w * .18, h * .4, w * .12, h * .07, 0, 0, Math.PI * 2); g.ellipse(w * .18, h * .4, w * .12, h * .07, 0, 0, Math.PI * 2); g.fill();
  bodyPath(g, sp.el, w, h);
  const gr = g.createRadialGradient(-w * .15, -h * .2, size * .05, 0, 0, size * .62);
  gr.addColorStop(0, E.c2); gr.addColorStop(1, E.c1);
  g.fillStyle = gr; g.fill();
  g.lineWidth = Math.max(2, size * .035); g.strokeStyle = E.dark; g.stroke();
  if (o.flash) { g.fillStyle = `rgba(255,255,255,${o.flash})`; g.fill(); }
  const ey = -h * .17, ex = w * .14, er = size * .055;
  const blink = ((t * 1000 + hh) % 3400) < 130;
  g.fillStyle = '#1a1420';
  if (blink) { g.fillRect(-ex - er, ey, er * 2, er * .45); g.fillRect(ex - er, ey, er * 2, er * .45); }
  else {
    g.beginPath(); g.ellipse(-ex, ey, er * .8, er * 1.1, 0, 0, Math.PI * 2); g.ellipse(ex, ey, er * .8, er * 1.1, 0, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#fff'; g.beginPath(); g.arc(-ex + er * .25, ey - er * .4, er * .3, 0, Math.PI * 2); g.arc(ex + er * .25, ey - er * .4, er * .3, 0, Math.PI * 2); g.fill();
  }
  g.fillStyle = 'rgba(255,110,140,.45)'; g.beginPath();
  g.ellipse(-ex * 1.95, ey + er * 1.7, er * .9, er * .5, 0, 0, Math.PI * 2); g.ellipse(ex * 1.95, ey + er * 1.7, er * .9, er * .5, 0, 0, Math.PI * 2); g.fill();
  drawAura(g, sp.el, size, t, hh, 'front');
  g.restore();
  // kanji na barriga (nunca espelhado)
  const ks = size * (sp.strokes >= 10 ? .34 : sp.strokes >= 7 ? .38 : .42);
  g.font = `900 ${ks}px ${JP_FONT}`; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.lineJoin = 'round'; g.lineWidth = Math.max(2.5, size * .055); g.strokeStyle = E.dark;
  const ky = h * .15 * (1 + wob);
  g.strokeText(c, 0, ky); g.fillStyle = '#fff'; g.fillText(c, 0, ky);
  g.restore();
}
const _iconCache = {};
function spiritIcon(c, px = 64) {
  const key = c + '|' + px;
  if (_iconCache[key]) return _iconCache[key];
  const cv = mkCanvas(px * 2, px * 2), g = cv.getContext('2d');
  drawSpirit(g, px, px * 1.02, px * 1.5, c, 0.6);
  return (_iconCache[key] = cv.toDataURL());
}
const elChip = el => `<span class="el" style="background:${ELEM[el].c1};border-color:${ELEM[el].dark}">${el}</span>`;
