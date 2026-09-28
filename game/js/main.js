'use strict';
// ============================================================
//  MAIN — estado, save, controles, loop, transições, título
// ============================================================
const SAVE_KEY = 'kotodama.v1';
const GAME_VERSION = '1.2';
// limpa o cache do jogo, remove o service worker e recarrega a versão mais nova (o save é mantido)
async function forceUpdate() {
  toast('🔄 Atualizando…', 5000);
  saveGame();
  try {
    const ks = await caches.keys();
    await Promise.all(ks.filter(k => k.startsWith('kotodama-')).map(k => caches.delete(k)));
    const regs = await navigator.serviceWorker.getRegistrations();
    await Promise.all(regs.filter(r => /\/game\/$/.test(r.scope)).map(r => r.unregister()));
    const files = ['./', './index.html', './js/util.js', './js/data.js', './js/sprites.js', './js/tiles.js', './js/quiz.js', './js/world.js', './js/battle.js', './js/ui.js', './js/solitaire.js', './js/main.js',
      '../kanji-list.js', '../kanji-words.js', '../kanji-strokes.js', '../vocab-decks.js', '../verbs.js'];
    await Promise.all(files.map(u => fetch(u, { cache: 'reload' }).catch(() => {})));
  } catch (e) {}
  location.reload();
}
const G = { save: null, scene: 'title', busy: false, tile: 32, dpr: 1, w: 0, h: 0, safeTop: 0, flash: 0, flashCb: null, fade: 0, fadeDir: 0, fadeCb: null };
const cv = $('#cv'), ctx = cv.getContext('2d');

// ---------- Save ----------
function newSave() {
  return {
    v: 2, map: 'village', x: 7, y: 6, dir: 'left', party: [], box: [],
    items: { ofuda: 0, kusuri: 2, onigiri: 0, okashi: 0 }, money: 300,
    badges: { owned: {}, eq: {} }, flags: {}, dex: {}, stats: {},
    opts: { answer: isTouch() ? 'mc' : 'type', sound: true, voice: true }, play: 0,
  };
}
function loadSave() {
  try {
    const raw = localStorage.getItem(SAVE_KEY); if (!raw) return null;
    const s = JSON.parse(raw), d = newSave();
    for (const k in d) if (s[k] === undefined) s[k] = d[k];
    for (const k in d.opts) if (s.opts[k] === undefined) s.opts[k] = d.opts[k];
    for (const k in d.items) if (s.items[k] === undefined) s.items[k] = d.items[k];
    if (!s.badges.eq) s.badges.eq = {}; if (!s.badges.owned) s.badges.owned = {};
    if (!s.v || s.v < 2) { s.badges.eq.romaji = false; s.v = 2; } // romaji deixa de vir ligado (agora é botão por fala)
    s.party = s.party.filter(i => SPECIES[i.sp]); s.box = s.box.filter(i => SPECIES[i.sp]);
    if (!MAPS[s.map]) Object.assign(s, { map: 'village', x: 7, y: 6 });
    return s;
  } catch (e) { return null; }
}
function saveGame() { if (!G.save) return; try { localStorage.setItem(SAVE_KEY, JSON.stringify(G.save)); } catch (e) {} }

// ---------- Controles ----------
const KEYMAP = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right', w: 'up', s: 'down', a: 'left', d: 'right', W: 'up', S: 'down', A: 'left', D: 'right' };
const Input = {
  keys: [], touchDir: null, block: false,
  dir() { if (this.block) return null; if (this.touchDir) return this.touchDir; return this.keys.length ? this.keys[this.keys.length - 1] : null; },
  clearHold() { this.block = this.keys.length > 0 || !!this.touchDir; },
  release() { if (!this.keys.length && !this.touchDir) this.block = false; },
};
window.addEventListener('keydown', e => {
  const tag = (e.target && e.target.tagName) || '';
  if (tag === 'INPUT' || tag === 'TEXTAREA') return;
  audioUnlock();
  const d = KEYMAP[e.key];
  if (d && G.scene === 'world') { if (!Input.keys.includes(d)) Input.keys.push(d); e.preventDefault(); return; }
  if (e.repeat) return;
  if (['Enter', ' ', 'z', 'Z'].includes(e.key)) { if (G.scene === 'world' && !UI.isOpen) { e.preventDefault(); onAction(); } }
  else if (['Escape', 'x', 'X'].includes(e.key)) onMenuKey();
});
window.addEventListener('keyup', e => { const d = KEYMAP[e.key]; if (d) { Input.keys = Input.keys.filter(k => k !== d); Input.release(); } });
window.addEventListener('blur', () => { Input.keys = []; Input.touchDir = null; Input.release(); });
function onAction() {
  if (Dialog.open) { Dialog.next(); return; }
  if (UI.isOpen || G.scene !== 'world') return;
  worldInteract();
}
function onMenuKey() {
  if (G.scene !== 'world' || Dialog.open) return;
  if (UI.isOpen) { if ($('.pclose')) { sfx('cancel'); UI.close(); } return; }
  UI.openMenu();
}
const dpad = $('#dpad');
function dpadSet(e) {
  const r = dpad.getBoundingClientRect(), x = e.clientX - (r.left + r.width / 2), y = e.clientY - (r.top + r.height / 2);
  Input.touchDir = Math.hypot(x, y) < 14 ? null : (Math.abs(x) > Math.abs(y) ? (x > 0 ? 'right' : 'left') : (y > 0 ? 'down' : 'up'));
  dpad.className = Input.touchDir ? 'act-' + Input.touchDir : '';
}
dpad.addEventListener('pointerdown', e => { audioUnlock(); try { dpad.setPointerCapture(e.pointerId); } catch (_) {} dpadSet(e); e.preventDefault(); });
dpad.addEventListener('pointermove', e => { if (e.buttons || e.pointerType === 'touch') dpadSet(e); });
const dpadEnd = () => { Input.touchDir = null; dpad.className = ''; Input.release(); };
dpad.addEventListener('pointerup', dpadEnd); dpad.addEventListener('pointercancel', dpadEnd);
$('#abtn').addEventListener('pointerdown', e => { e.preventDefault(); audioUnlock(); onAction(); });
$('#menubtn').addEventListener('click', () => {
  audioUnlock();
  if (UI.isOpen) { if ($('.pclose')) { sfx('cancel'); UI.close(); } }
  else if (!Dialog.open && G.scene === 'world' && !G.busy) UI.openMenu();
});
$('#hud').addEventListener('click', () => { if (G.scene === 'world' && !G.busy) UI.openParty(); });
if (isTouch()) document.body.classList.add('touch');

// ---------- Tela ----------
function resize() {
  const dpr = Math.min(window.devicePixelRatio || 1, 3), w = window.innerWidth, h = window.innerHeight;
  cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
  cv.style.width = w + 'px'; cv.style.height = h + 'px';
  Object.assign(G, { dpr, w, h });
  G.tile = 16 * clamp(Math.floor(Math.min(w / (16 * 11), h / (16 * 9))), 2, 4);
  G.safeTop = Math.max(0, (parseFloat(getComputedStyle($('#hud')).top) || 8) - 8);
  if (Solitaire.s && !Solitaire.s.over) Solitaire.render();
  measureView();
}
// área útil do mapa: entre o HUD (em cima) e os controles de toque (embaixo),
// pra o personagem nunca ficar escondido atrás deles
function measureView() {
  G.viewTop = 0; G.viewBottom = G.h;
  if (document.body.dataset.scene !== G.scene) document.body.dataset.scene = G.scene; // HUD visível antes de medir
  if (G.scene !== 'world') return;
  const hud = $('#hud').getBoundingClientRect(), mb = $('#menubtn').getBoundingClientRect();
  const top = Math.max(hud.bottom, mb.bottom) + 6;
  const dp = $('#dpad').getBoundingClientRect();
  const bottom = (document.body.classList.contains('touch') && dp.height) ? dp.top - 6 : G.h;
  if (bottom - top >= G.tile * 6) { G.viewTop = top; G.viewBottom = bottom; }
}
window.addEventListener('resize', resize);
resize();

// ---------- Transições ----------
// transições pelo relógio real (não dependem da taxa de quadros); o callback também tem um timer de garantia
function flashThen(cb) {
  G.busy = true; G.flashStart = performance.now(); G.flashCb = cb;
  setTimeout(() => { if (G.flashCb === cb) { G.flashStart = 0; G.flashCb = null; cb(); } }, 760);
}
function fadeTo(cb) {
  G.busy = true; G.fadeStart = performance.now(); G.fadeCb = cb;
  setTimeout(() => { if (G.fadeCb === cb) { G.fadeCb = null; cb(); } }, 230);
  setTimeout(() => { G.fadeStart = 0; G.busy = false; Input.clearHold(); }, 470);
}
function drawTransitions(g) {
  const now = performance.now();
  if (G.flashStart) {
    const p = Math.min(1, (now - G.flashStart) / 750);
    if (p < .45) { if (Math.floor(p * 20) % 2 === 0) { g.fillStyle = 'rgba(255,255,255,.75)'; g.fillRect(0, 0, G.w, G.h); } }
    else { const f = (p - .45) / .55, n = 8, hh = G.h / n; g.fillStyle = '#000'; for (let i = 0; i < n; i++) { const x = i % 2 ? G.w * (1 - f) : 0; g.fillRect(x, i * hh, G.w * f, hh + 1); } }
  }
  if (G.fadeStart) {
    const e = (now - G.fadeStart) / 230, a = e < 1 ? e : Math.max(0, 2 - e);
    g.fillStyle = `rgba(8,4,16,${clamp(a, 0, 1)})`; g.fillRect(0, 0, G.w, G.h);
  }
}

// ---------- Título ----------
const titleSpirits = [];
function drawTitle(g, w, h, t) {
  const bg = g.createLinearGradient(0, 0, 0, h); bg.addColorStop(0, '#1a0f30'); bg.addColorStop(1, '#3d1f4c');
  g.fillStyle = bg; g.fillRect(0, 0, w, h);
  for (let i = 0; i < 70; i++) {
    const x = (hashStr('s' + i) % 1000) / 1000 * w, y = (hashStr('y' + i) % 1000) / 1000 * h * .75;
    g.fillStyle = `rgba(255,255,230,${.3 + .7 * Math.abs(Math.sin(t * 1.3 + i))})`; g.fillRect(x, y, 2, 2);
  }
  const ks = Object.keys(SPECIES);
  if (!titleSpirits.length && ks.length) for (let i = 0; i < 7; i++) titleSpirits.push({ c: pick(ks), x: Math.random() * 1.2 - .1, y: .36 + Math.random() * .3, s: .6 + Math.random() * .6, v: .012 + Math.random() * .02, ph: Math.random() * 6 });
  titleSpirits.forEach(o => {
    o.x += o.v * .016; if (o.x > 1.15) { o.x = -.15; o.c = pick(ks); }
    drawSpirit(g, o.x * w, o.y * h + Math.sin(t * 1.5 + o.ph) * 10, Math.min(w, h) * .13 * o.s, o.c, t + o.ph);
  });
  const ts = Math.min(w * .28, h * .19);
  g.textAlign = 'center'; g.textBaseline = 'middle'; g.lineJoin = 'round';
  g.font = `900 ${ts}px ${JP_FONT}`; g.lineWidth = ts * .12; g.strokeStyle = '#2a1030'; g.strokeText('言霊', w / 2, h * .19);
  const lg = g.createLinearGradient(0, h * .12, 0, h * .27); lg.addColorStop(0, '#fff4b8'); lg.addColorStop(1, '#f2a13a');
  g.fillStyle = lg; g.fillText('言霊', w / 2, h * .19);
  const fs = Math.max(13, Math.min(26, w / 18));
  g.font = `${fs}px "Press Start 2P", system-ui`; g.lineWidth = 6; g.strokeText('KOTODAMA QUEST', w / 2, h * .19 + ts * .72);
  g.fillStyle = '#fff'; g.fillText('KOTODAMA QUEST', w / 2, h * .19 + ts * .72);
}

// ---------- Loop ----------
let last = performance.now(), lastSave = 0, errShown = false;
function frame(now) {
  const dt = Math.min(.05, (now - last) / 1000); last = now;
  const t = now / 1000;
  try {
    if (document.body.dataset.scene !== G.scene) { document.body.dataset.scene = G.scene; measureView(); }
    ctx.setTransform(G.dpr, 0, 0, G.dpr, 0, 0); ctx.imageSmoothingEnabled = false;
    if (G.scene === 'title') drawTitle(ctx, G.w, G.h, t);
    else if (G.scene === 'battle') { Battle.update(dt); Battle.render(ctx, G.w, G.h, t); }
    else {
      if (G.scene === 'world') { worldUpdate(dt); G.save.play += dt; if (now - lastSave > 20000) { lastSave = now; saveGame(); } }
      worldRender(ctx, G.w, G.h, t);
    }
    drawTransitions(ctx);
  } catch (err) { if (!errShown) { errShown = true; console.error(err); toast('⚠️ Erro: ' + esc(err.message)); } }
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

// ---------- Início ----------
function startGame(s) {
  G.save = s;
  const tt = $('#title'); if (tt) tt.remove();
  G.scene = 'world'; G.busy = false;
  loadMap(s.map, s.x, s.y, s.dir);
  if (!s.flags.starter) setTimeout(startIntro, 1100);
  else toast('おかえり！ Bem-vindo de volta 👋');
}
const existingSave = loadSave();
if (existingSave) $('#t-cont').style.display = '';
$('#t-ver').textContent = GAME_VERSION;
$('#t-upd').onclick = e => { e.preventDefault(); forceUpdate(); };
$('#t-cont').onclick = () => { audioUnlock(); sfx('confirm'); startGame(existingSave); };
$('#t-new').onclick = () => {
  audioUnlock();
  if (existingSave && !confirm('Começar um jogo novo? O progresso atual do jogo será apagado.')) return;
  sfx('confirm'); const s = newSave(); G.save = s; saveGame(); startGame(s);
};
// carrega a arte (pixel art); se demorar/falhar, o jogo segue com o visual desenhado por código
(function () {
  const btns = ['#t-cont', '#t-new'].map(s => $(s)).filter(Boolean);
  const labels = btns.map(b => b.innerHTML);
  btns.forEach(b => { b.disabled = true; b.innerHTML = 'Carregando…'; });
  let done = false;
  const release = () => { if (done) return; done = true; btns.forEach((b, i) => { b.disabled = false; b.innerHTML = labels[i]; }); };
  setTimeout(release, 4000);
  loadArt().then(ok => { if (ok && W.map) W.statics = buildStatics(); release(); });
})();

// ---------- Offline / atualização ----------
if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  navigator.serviceWorker.register('sw.js').then(r => r.update()).catch(() => {});
  let reloading = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (reloading) return;
    if (G.scene === 'title') { reloading = true; location.reload(); }
    else toast('🔄 Nova versão baixada! Recarregue o jogo quando quiser.', 4000);
  });
}
