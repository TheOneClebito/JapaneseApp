'use strict';
// ============================================================
//  MUNDO — mapa em grade, movimento, NPCs, placas, baús, portas,
//  encontros no mato alto e caverna escura.
// ============================================================
const DIRS = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
const OPP = { up: 'down', down: 'up', left: 'right', right: 'left' };
const MOVE_TIME = 0.17;
const W = { map: null, key: '', rows: [], w: 0, h: 0, npcs: [], banner: 0, steps: 0, player: { x: 0, y: 0, px: 0, py: 0, dir: 'down', moving: false, t: 0, frame: 0 } };

function loadMap(key, x, y, dir) {
  const m = MAPS[key];
  W.key = key; W.map = m; W.rows = m.rows; W.h = m.rows.length; W.w = m.rows[0].length;
  W.npcs = (m.npcs || []).map(n => ({ ...n, hx: n.x, hy: n.y, px: n.x, py: n.y, moving: false, t: 0, frame: 0, next: rnd(1.5, 4) }));
  const p = W.player;
  Object.assign(p, { x, y, px: x, py: y, dir: dir || 'down', moving: false, t: 0, frame: 0 });
  W.steps = 0; W.banner = 2.6;
  G.save.map = key; G.save.x = x; G.save.y = y; G.save.dir = p.dir;
  refreshHUD();
}
function tileAt(x, y) { return (y < 0 || y >= W.h || x < 0 || x >= W.w) ? '#' : W.rows[y][x]; }
function npcAt(x, y) { return W.npcs.find(n => n.x === x && n.y === y); }
function walkable(x, y) { const info = TILE_INFO[tileAt(x, y)] || {}; return !!info.walk && !npcAt(x, y); }
function chestOpen(x, y) { const c = (W.map.chests || {})[x + ',' + y]; return !!(c && G.save.flags[c.flag]); }

function worldUpdate(dt) {
  W.banner = Math.max(0, W.banner - dt);
  const p = W.player;
  W.npcs.forEach(n => updateNpc(n, dt));
  if (p.moving) {
    p.t += dt / MOVE_TIME;
    if (p.t >= 1) { p.moving = false; p.px = p.x; p.py = p.y; p.frame = 0; onArrive(); }
    else { p.px = lerp(p.fx, p.x, p.t); p.py = lerp(p.fy, p.y, p.t); p.frame = p.t < .5 ? (p.parity ? 1 : 2) : 0; }
  }
  if (!p.moving && !G.busy && G.scene === 'world') { const d = Input.dir(); if (d) tryMove(d); }
}
function tryMove(d) {
  const p = W.player; p.dir = d;
  const [dx, dy] = DIRS[d], nx = p.x + dx, ny = p.y + dy;
  const info = TILE_INFO[tileAt(nx, ny)] || {};
  if (info.door) { openDoor(info.door); return; }
  if (walkable(nx, ny)) { p.fx = p.x; p.fy = p.y; p.x = nx; p.y = ny; p.moving = true; p.t = 0; p.parity = !p.parity; }
  else if (!p.bump || performance.now() - p.bump > 320) { sfx('bump'); p.bump = performance.now(); }
}
function onArrive() {
  const p = W.player;
  G.save.x = p.x; G.save.y = p.y; G.save.dir = p.dir;
  const wp = (W.map.warps || []).find(w => w.x === p.x && w.y === p.y);
  if (wp) { sfx('door'); fadeTo(() => { loadMap(wp.to, wp.tx, wp.ty, wp.dir); saveGame(); }); return; }
  const enc = W.map.enc; if (!enc) return;
  const info = TILE_INFO[tileAt(p.x, p.y)] || {};
  if (!(info.grass || (info.caveFloor && W.map.dark))) return;
  W.steps++;
  if (W.steps >= 3 && Math.random() < enc.rate && G.save.party.some(i => i.hp > 0)) {
    W.steps = 0;
    let sp;
    if (enc.rare && Math.random() < .08) sp = wpick(enc.rare.filter(r => SPECIES[r[0]]), r => r[1])[0];
    if (!sp) sp = wpick(enc.pool.filter(c => SPECIES[c]), c => kanjiMissWeight(c));
    G.busy = true;
    flashThen(() => Battle.startWild(sp, rint(enc.lv[0], enc.lv[1])));
  }
}
function updateNpc(n, dt) {
  if (n.moving) {
    n.t += dt / .28;
    if (n.t >= 1) { n.moving = false; n.px = n.x; n.py = n.y; n.frame = 0; }
    else { n.px = lerp(n.fx, n.x, n.t); n.py = lerp(n.fy, n.y, n.t); n.frame = n.t < .5 ? 1 : 0; }
    return;
  }
  if (!n.wander || G.busy) return;
  n.next -= dt; if (n.next > 0) return;
  n.next = rnd(1.5, 4);
  const d = pick(Object.keys(DIRS)), [dx, dy] = DIRS[d], nx = n.x + dx, ny = n.y + dy;
  n.dir = d;
  if (Math.abs(nx - n.hx) > 2 || Math.abs(ny - n.hy) > 2) return;
  if (!(TILE_INFO[tileAt(nx, ny)] || {}).walk || npcAt(nx, ny)) return;
  const p = W.player;
  if ((p.x === nx && p.y === ny) || (p.moving && p.fx === nx && p.fy === ny)) return;
  n.fx = n.x; n.fy = n.y; n.x = nx; n.y = ny; n.moving = true; n.t = 0;
}

// ---------- Interação ----------
function worldInteract() {
  if (G.busy || G.scene !== 'world' || W.player.moving) return;
  const p = W.player, [dx, dy] = DIRS[p.dir], x = p.x + dx, y = p.y + dy;
  const n = npcAt(x, y);
  if (n) return talkNpc(n);
  const info = TILE_INFO[tileAt(x, y)] || {};
  if (info.sign) { const k = (W.map.signs || {})[x + ',' + y]; if (k) Dialog.show(DLG[k], { name: 'かんばん' }); return; }
  if (info.chest) return openChest(x, y);
  if (info.door) return openDoor(info.door);
}
function talkNpc(n) {
  n.dir = OPP[W.player.dir];
  if (n.id === 'sensei' && !G.save.flags.starter) return startIntro();
  if (n.trainer) {
    const tr = n.trainer;
    if (G.save.flags[tr.flag]) return Dialog.show(DLG[tr.post], { name: n.name });
    if (!G.save.party.some(i => i.hp > 0)) return Dialog.show([{ jp: 'ことだまが つかれて います。やどやで やすんで ください。', pt: 'Seus kotodama estão cansados. Descanse na pousada.' }], { name: n.name });
    return Dialog.show(DLG[tr.pre], { name: n.name, onDone: () => { G.busy = true; flashThen(() => Battle.startTrainer(n)); } });
  }
  Dialog.show(DLG[n.dlg], { name: n.name });
}
function openChest(x, y) {
  const c = (W.map.chests || {})[x + ',' + y]; if (!c) return;
  if (G.save.flags[c.flag]) return Dialog.show(DLG.chestEmpty, { name: '' });
  G.save.flags[c.flag] = true; sfx('capture');
  const got = [];
  for (const k in c.items) { G.save.items[k] = (G.save.items[k] || 0) + c.items[k]; got.push(`${ITEMS[k].jp} ×${c.items[k]}`); }
  if (c.badge) { G.save.badges.owned[c.badge] = true; got.push(`insígnia “${BADGES[c.badge].name}”`); }
  saveGame();
  Dialog.show([{ jp: 'たからばこを あけました！', pt: 'Você abriu o baú! Ganhou: ' + got.join(', ') + '.' }], { name: '', forceTrad: true });
}
function openDoor(kind) {
  if (G.busy) return;
  sfx('door');
  if (kind === 'inn') UI.openInn();
  else if (kind === 'shop') UI.openShop();
  else if (kind === 'shrine') UI.openShrine();
  else if (kind === 'prof') Dialog.show(DLG.profDoor, { name: '' });
  else Dialog.show(DLG.house, { name: '' });
}

// ---------- Desenho ----------
const PLAQUE = { I: '宿', M: '店', J: '⛩', P: '先' };
function worldRender(g, w, h, t) {
  const T = G.tile, p = W.player;
  const mw = W.w * T, mh = W.h * T;
  let cx = (p.px + .5) * T - w / 2, cy = (p.py + .5) * T - h / 2;
  cx = mw <= w ? (mw - w) / 2 : clamp(cx, 0, mw - w);
  cy = mh <= h ? (mh - h) / 2 : clamp(cy, 0, mh - h);
  cx = Math.round(cx); cy = Math.round(cy);
  g.fillStyle = W.map.theme === 'cave' ? '#0c0a10' : '#23501f'; g.fillRect(0, 0, w, h);
  const x0 = Math.max(0, Math.floor(cx / T)), y0 = Math.max(0, Math.floor(cy / T));
  const x1 = Math.min(W.w - 1, Math.ceil((cx + w) / T)), y1 = Math.min(W.h - 1, Math.ceil((cy + h) / T));
  for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
    const ch = W.rows[y][x];
    g.drawImage(getTile(ch, W.map.theme, x, y, t, ch === 'C' && chestOpen(x, y)), x * T - cx, y * T - cy, T, T);
  }
  // placas das construções
  for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
    const lab = PLAQUE[W.rows[y][x]]; if (!lab) continue;
    const sx = x * T - cx + T / 2, sy = (y - 1) * T - cy + T * .55;
    g.fillStyle = '#fff6dc'; g.strokeStyle = '#3a2412'; g.lineWidth = Math.max(1.5, T / 20);
    const bw = T * .62, bh = T * .5;
    g.fillRect(sx - bw / 2, sy - bh / 2, bw, bh); g.strokeRect(sx - bw / 2, sy - bh / 2, bw, bh);
    g.fillStyle = '#3a2412'; g.font = `900 ${T * .36}px ${JP_FONT}`; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText(lab, sx, sy + 1);
  }
  const sc = T / 16;
  const ents = W.npcs.map(n => ({ e: n, look: n.look })).concat([{ e: p, look: 'hero' }]).sort((a, b) => a.e.py - b.e.py);
  ents.forEach(({ e, look }) => {
    const sx = e.px * T - cx, sy = e.py * T - cy;
    g.fillStyle = 'rgba(0,0,0,.22)'; g.beginPath(); g.ellipse(sx + T / 2, sy + T * .92, T * .3, T * .1, 0, 0, Math.PI * 2); g.fill();
    g.drawImage(getChar(look, e.dir || 'down', e.frame || 0), sx - sc, sy + T - 17 * sc, 18 * sc, 18 * sc);
    const tx = Math.round(e.px), ty = Math.round(e.py);
    if (tileAt(tx, ty) === ',' && Math.abs(e.px - tx) < .3 && Math.abs(e.py - ty) < .3) {
      g.drawImage(getTile(',', W.map.theme, tx, ty, t), 0, 10, 16, 6, tx * T - cx, ty * T - cy + 10 * sc, T, 6 * sc);
    }
    if (e.trainer && !G.save.flags[e.trainer.flag]) {
      g.fillStyle = '#ffd84a'; g.font = `900 ${T * .45}px system-ui`; g.textAlign = 'center';
      g.fillText('!', sx + T / 2, sy - T * .15 + Math.sin(t * 5) * 2);
    }
  });
  if (W.map.dark) {
    const px = (p.px + .5) * T - cx, py = (p.py + .5) * T - cy;
    const gr = g.createRadialGradient(px, py, T * 2, px, py, T * 5.5);
    gr.addColorStop(0, 'rgba(8,6,12,0)'); gr.addColorStop(1, 'rgba(8,6,12,.9)');
    g.fillStyle = gr; g.fillRect(0, 0, w, h);
  }
  if (W.banner > 0) {
    const a = Math.min(1, W.banner / .4, (2.6 - W.banner) / .3 + .01);
    g.save(); g.globalAlpha = clamp(a, 0, 1);
    const bw = Math.min(w * .8, 340), bx = (w - bw) / 2, by = 14 + (G.safeTop || 0);
    g.fillStyle = 'rgba(20,16,40,.92)'; g.strokeStyle = '#f4e7c3'; g.lineWidth = 3;
    roundRect(g, bx, by, bw, 58, 12); g.fill(); g.stroke();
    g.fillStyle = '#fff'; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.font = `700 22px ${JP_FONT}`; g.fillText(W.map.name, w / 2, by + 22);
    g.fillStyle = '#c9c2e8'; g.font = '600 13px system-ui, sans-serif'; g.fillText(W.map.pt, w / 2, by + 44);
    g.restore();
  }
}
function roundRect(g, x, y, w, h, r) { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }
