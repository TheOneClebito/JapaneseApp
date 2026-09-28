'use strict';
// ============================================================
//  UTILITÁRIOS — DOM, aleatoriedade, romaji, correção, voz, sons
// ============================================================
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const rnd = (a, b) => a + Math.random() * (b - a);
const rint = (a, b) => Math.floor(rnd(a, b + 1));
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;
function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
function shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
function wpick(items, wf) {
  let tot = 0; const ws = items.map(it => { const w = Math.max(0, wf(it)); tot += w; return w; });
  let r = Math.random() * tot;
  for (let i = 0; i < items.length; i++) { r -= ws[i]; if (r <= 0) return items[i]; }
  return items[items.length - 1];
}
function esc(s) { return String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
function hashStr(s) { let h = 2166136261; for (const ch of String(s)) { h ^= ch.codePointAt(0); h = Math.imul(h, 16777619); } return h >>> 0; }
function mulberry32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const isTouch = () => (window.matchMedia && matchMedia('(pointer:coarse)').matches) || ('ontouchstart' in window);

// ---------- Romaji ----------
const ROMA = {
  'あ':'a','い':'i','う':'u','え':'e','お':'o','か':'ka','き':'ki','く':'ku','け':'ke','こ':'ko',
  'が':'ga','ぎ':'gi','ぐ':'gu','げ':'ge','ご':'go','さ':'sa','し':'shi','す':'su','せ':'se','そ':'so',
  'ざ':'za','じ':'ji','ず':'zu','ぜ':'ze','ぞ':'zo','た':'ta','ち':'chi','つ':'tsu','て':'te','と':'to',
  'だ':'da','ぢ':'ji','づ':'zu','で':'de','ど':'do','な':'na','に':'ni','ぬ':'nu','ね':'ne','の':'no',
  'は':'ha','ひ':'hi','ふ':'fu','へ':'he','ほ':'ho','ば':'ba','び':'bi','ぶ':'bu','べ':'be','ぼ':'bo',
  'ぱ':'pa','ぴ':'pi','ぷ':'pu','ぺ':'pe','ぽ':'po','ま':'ma','み':'mi','む':'mu','め':'me','も':'mo',
  'や':'ya','ゆ':'yu','よ':'yo','ら':'ra','り':'ri','る':'ru','れ':'re','ろ':'ro','わ':'wa','を':'wo','ん':'n',
  'ぁ':'a','ぃ':'i','ぅ':'u','ぇ':'e','ぉ':'o',
  'きゃ':'kya','きゅ':'kyu','きょ':'kyo','しゃ':'sha','しゅ':'shu','しょ':'sho','ちゃ':'cha','ちゅ':'chu','ちょ':'cho',
  'にゃ':'nya','にゅ':'nyu','にょ':'nyo','ひゃ':'hya','ひゅ':'hyu','ひょ':'hyo','みゃ':'mya','みゅ':'myu','みょ':'myo',
  'りゃ':'rya','りゅ':'ryu','りょ':'ryo','ぎゃ':'gya','ぎゅ':'gyu','ぎょ':'gyo','じゃ':'ja','じゅ':'ju','じょ':'jo',
  'びゃ':'bya','びゅ':'byu','びょ':'byo','ぴゃ':'pya','ぴゅ':'pyu','ぴょ':'pyo',
  'ふぁ':'fa','ふぃ':'fi','ふぇ':'fe','ふぉ':'fo','てぃ':'ti','でぃ':'di','うぃ':'wi','うぇ':'we','ゔ':'vu'
};
function toHira(s) {
  return [...String(s || '')].map(ch => { const c = ch.codePointAt(0); return (c >= 0x30A1 && c <= 0x30F6) ? String.fromCodePoint(c - 0x60) : ch; }).join('');
}
function kanaToRomaji(s) {
  if (!s) return '';
  const a = [...toHira(s)];
  let out = '';
  for (let i = 0; i < a.length; i++) {
    const c = a[i], n = a[i + 1];
    if (n && ROMA[c + n]) { out += ROMA[c + n]; i++; continue; }
    if (c === 'っ') { const nn = a[i + 1]; const r = nn ? (ROMA[nn] || '') : ''; out += r ? r[0] : 't'; continue; }
    if (c === 'ー') { const last = out.slice(-1); if ('aeiou'.includes(last)) out += last; continue; }
    out += (ROMA[c] != null) ? ROMA[c] : c;
  }
  return out;
}
// forma canônica tolerante (mesma regra do app de estudo)
function romajiCanon(s) {
  let r = kanaToRomaji(s || '').toLowerCase();
  r = r.replace(/[\s　、。，．,\.！!？\?「」『』~〜・…\-’'）（()]/g, '');
  const rep = [['sya','sha'],['syu','shu'],['syo','sho'],['tya','cha'],['tyu','chu'],['tyo','cho'],
    ['zya','ja'],['zyu','ju'],['zyo','jo'],['jya','ja'],['jyu','ju'],['jyo','jo'],
    ['si','shi'],['ti','chi'],['tu','tsu'],['hu','fu'],['zi','ji'],['di','ji'],['du','zu']];
  rep.forEach(([a, b]) => { r = r.split(a).join(b); });
  r = r.split('wo').join('o').split('wa').join('ha').split('he').join('e').split('nn').join('n');
  r = r.replace(/([aiueo])\1+/g, '$1').split('ou').join('o');
  return r;
}
function lev(a, b) {
  const m = a.length, n = b.length; if (!m) return n; if (!n) return m;
  let prev = Array.from({ length: n + 1 }, (_, i) => i), cur = new Array(n + 1);
  for (let i = 1; i <= m; i++) {
    cur[0] = i;
    for (let j = 1; j <= n; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    [prev, cur] = [cur, prev];
  }
  return prev[n];
}
// 'exact' | 'close' | 'wrong'
function checkTyped(input, accepts) {
  const ci = romajiCanon(input);
  if (!ci) return 'wrong';
  let best = 99;
  for (const a of accepts) { const ca = romajiCanon(a); if (!ca) continue; if (ca === ci) return 'exact'; best = Math.min(best, lev(ci, ca)); }
  return (best <= 1 && ci.length >= 4) ? 'close' : 'wrong';
}

// ---------- Leituras / markup {漢字|よみ} ----------
function cleanReading(r) { return String(r).replace(/^[-‐]/, '').replace(/[()（）]/g, ''); }
function readingStem(r) { return String(r).replace(/^[-‐]/, '').split(/[(（]/)[0]; }
const isKanji = ch => /[一-鿿々]/.test(ch);
let _learned = null;
function learned() { if (!_learned) _learned = new Set((window.KANJI_DEX || []).map(k => k.c)); return _learned; }
function markupKana(s) { return String(s || '').replace(/\{([^|}]+)\|([^}]+)\}/g, '$2'); }
function markupBase(s) { return String(s || '').replace(/\{([^|}]+)\|([^}]+)\}/g, '$1'); }
// furigana: sempre nos kanji não aprendidos; em todos se force=true
function jpHTML(s, force) {
  const L = learned();
  return esc(s).replace(/\{([^|}]+)\|([^}]+)\}/g, (m, k, r) => {
    const unl = [...k].some(ch => isKanji(ch) && !L.has(ch));
    return (force || unl) ? `<ruby>${k}<rt>${r}</rt></ruby>` : k;
  });
}

// ---------- Formas verbais ----------
function teForm(v) {
  if (v.type === 'irregular') {
    if (v.kana.endsWith('くる')) return v.kana.slice(0, -2) + 'きて';
    if (v.kana.endsWith('いく')) return v.kana.slice(0, -2) + 'いって';
    if (v.kana.endsWith('する')) return v.kana.slice(0, -2) + 'して';
  }
  if (v.type === 'ichidan') return v.kana.slice(0, -1) + 'て';
  const map = { 'う':'って','つ':'って','る':'って','ぬ':'んで','ぶ':'んで','む':'んで','く':'いて','ぐ':'いで','す':'して' };
  return v.kana.slice(0, -1) + (map[v.kana.slice(-1)] || 'て');
}
function naiForm(v) {
  const k = v.kana;
  if (v.type === 'irregular') {
    if (k.endsWith('くる')) return k.slice(0, -2) + 'こない';
    if (k.endsWith('いく')) return k.slice(0, -2) + 'いかない';
    if (k.endsWith('する')) return k.slice(0, -2) + 'しない';
  }
  if (v.type === 'ichidan') return k.slice(0, -1) + 'ない';
  if (k === 'ある') return 'ない';
  const map = { 'う':'わ','く':'か','ぐ':'が','す':'さ','つ':'た','ぬ':'な','ぶ':'ば','む':'ま','る':'ら' };
  return k.slice(0, -1) + (map[k.slice(-1)] || 'ら') + 'ない';
}
const I_ROW = { 'う': 'い', 'く': 'き', 'ぐ': 'ぎ', 'す': 'し', 'つ': 'ち', 'ぬ': 'に', 'ぶ': 'び', 'む': 'み', 'る': 'り' };
function masuForm(v) {
  const k = v.kana;
  if (v.type === 'irregular') {
    if (k.endsWith('くる')) return k.slice(0, -2) + 'きます';
    if (k.endsWith('する')) return k.slice(0, -2) + 'します';
  }
  if (v.type === 'ichidan') return k.slice(0, -1) + 'ます';
  return k.slice(0, -1) + (I_ROW[k.slice(-1)] || 'り') + 'ます';
}
function taForm(v) { const t = teForm(v); return t.slice(0, -1) + (t.endsWith('で') ? 'だ' : 'た'); }

// ---------- Voz (TTS) ----------
let _voices = [];
function _loadVoices() { try { _voices = speechSynthesis.getVoices() || []; } catch (e) {} }
if (window.speechSynthesis) { _loadVoices(); speechSynthesis.onvoiceschanged = _loadVoices; }
function speak(text) {
  if (!text || !window.speechSynthesis || !(G.save && G.save.opts.voice)) return;
  try {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'ja-JP'; u.rate = 0.9;
    const v = _voices.find(v => /ja[-_]JP/i.test(v.lang)) || _voices.find(v => /^ja/i.test(v.lang));
    if (v) u.voice = v;
    speechSynthesis.speak(u);
  } catch (e) {}
}

// ---------- Som 8-bit (Web Audio, sem arquivos) ----------
let _actx = null;
function audioUnlock() { try { _actx = _actx || new (window.AudioContext || window.webkitAudioContext)(); if (_actx.state === 'suspended') _actx.resume(); } catch (e) {} }
const SFX = {
  select: [[880, 0, .04]],
  confirm: [[660, 0, .06], [990, .06, .08]],
  cancel: [[440, 0, .06], [330, .06, .08]],
  bump: [[110, 0, .07, 'triangle']],
  hit: [[260, 0, .05, 'sawtooth'], [150, .05, .12, 'sawtooth']],
  crit: [[523, 0, .05], [784, .05, .05], [1047, .1, .14]],
  wrong: [[220, 0, .12], [156, .12, .22]],
  heal: [[523, 0, .08], [659, .08, .08], [784, .16, .14]],
  levelup: [[523, 0, .1], [659, .1, .1], [784, .2, .1], [1047, .3, .28]],
  capture: [[784, 0, .08], [988, .08, .08], [1175, .16, .08], [1568, .24, .34]],
  shake: [[300, 0, .06, 'triangle']],
  fail: [[392, 0, .1], [311, .1, .1], [262, .2, .24]],
  encounter: [[392, 0, .06], [523, .06, .06], [659, .12, .06], [784, .18, .06], [1047, .24, .16]],
  guard: [[1200, 0, .04], [900, .04, .07]],
  superguard: [[1319, 0, .05], [1760, .05, .05], [2093, .1, .14]],
  cheer: [[1047, 0, .05], [1319, .05, .05], [1568, .1, .09]],
  coin: [[988, 0, .05], [1319, .05, .14]],
  door: [[330, 0, .06, 'triangle'], [247, .06, .09, 'triangle']],
  victory: [[523, 0, .12], [523, .14, .08], [523, .24, .08], [698, .34, .3], [659, .66, .12], [698, .8, .42]],
  tick: [[1500, 0, .02]],
  flip: [[700, 0, .03, 'triangle']],
};
function sfx(kind) {
  if (G.save && G.save.opts && G.save.opts.sound === false) return;
  try {
    audioUnlock(); if (!_actx) return;
    (SFX[kind] || SFX.select).forEach(([f, t, d, type]) => {
      const o = _actx.createOscillator(), g = _actx.createGain();
      o.type = type || 'square'; o.frequency.value = f;
      const st = _actx.currentTime + t;
      o.connect(g); g.connect(_actx.destination);
      g.gain.setValueAtTime(0.05, st); g.gain.exponentialRampToValueAtTime(0.0001, st + d);
      o.start(st); o.stop(st + d + 0.02);
    });
  } catch (e) {}
}

// ---------- Toast ----------
let _toastT = null;
function toast(msg, ms = 2200) {
  const t = $('#toast'); if (!t) return;
  t.innerHTML = msg; t.classList.add('show');
  clearTimeout(_toastT); _toastT = setTimeout(() => t.classList.remove('show'), ms);
}
