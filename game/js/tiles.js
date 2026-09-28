'use strict';
// ============================================================
//  TILES — arte do "Ninja Adventure Asset Pack" (CC0)
//  por Pixel-Boy e AAA · https://pixel-boy.itch.io/ninja-adventure-asset-pack
//  Terreno com auto-borda (terra/água), objetos com profundidade, personagens.
// ============================================================
const ART = { ready: false, img: {} };
const ART_FILES = {
  floor: 'assets/tiles/TilesetFloor.png', nature: 'assets/tiles/TilesetNature.png', house: 'assets/tiles/TilesetHouse.png',
  water: 'assets/tiles/TilesetWater.png', relief: 'assets/tiles/TilesetRelief.png', element: 'assets/tiles/TilesetElement.png',
  detail: 'assets/tiles/TilesetFloorDetail.png', chest: 'assets/tiles/Chest.png',
};
// visual (LOOKS) → personagem do pacote
const CHAR_SPRITE = {
  hero: 'Boy', sensei: 'Master', kid: 'Child', granny: 'OldWoman', priest: 'Monk', girl: 'Woman', traveler: 'Hunter',
  hiker: 'OldMan', girl2: 'Princess', badgeguy: 'Villager2', trainer: 'NinjaBlue', boss: 'Samurai',
  trainer2: 'NinjaRed', trainer3: 'NinjaGreen', fighter: 'FighterWhite', villager: 'Villager', villager3: 'Villager3', villager4: 'Villager4',
  noble: 'Noble', monk2: 'Monk2', tengu: 'Tengu', samurai2: 'SamuraiBlue', shaman: 'Shaman', masked: 'NinjaMasked', oldman2: 'OldMan2',
  inspector: 'Inspector', cat: 'Cat', cat2: 'CatBlack',
};
// efeitos de golpe (quadros lado a lado)
const FX_META = { Flam: 8, Water: 11, Plant: 10, Rock: 14, Thunder: 8, Spark: 9, CutX: 4, Shield: 6 };
const ELEM_FX = { '火': 'Flam', '水': 'Water', '木': 'Plant', '土': 'Rock', '金': 'Thunder' };
function loadArt() {
  const load = (key, src) => new Promise(res => { const im = new Image(); im.onload = () => { ART.img[key] = im; res(true); }; im.onerror = () => res(false); im.src = src; });
  const jobs = Object.keys(ART_FILES).map(k => load(k, ART_FILES[k]))
    .concat(Object.keys(CHAR_SPRITE).map(k => load('ch_' + k, `assets/chars/${CHAR_SPRITE[k]}/SpriteSheet.png`)))
    .concat(Object.keys(FX_META).map(k => load('fx_' + k, `assets/fx/${k}.png`)));
  return Promise.all(jobs).then(r => (ART.ready = r.every(Boolean)));
}
const faceURL = look => CHAR_SPRITE[look] ? `assets/chars/${CHAR_SPRITE[look]}/Faceset.png` : null;
function tl(g, key, tx, ty, dx, dy, T, w = 1, h = 1) { g.drawImage(ART.img[key], tx * 16, ty * 16, w * 16, h * 16, dx, dy, w * T, h * T); }

// ---------- auto-borda (vizinhos N=1 L=2 S=4 O=8) ----------
const MASK_OFF = { 0: [3, 3], 1: [3, 2], 2: [0, 3], 3: [0, 2], 4: [3, 0], 5: [3, 1], 6: [0, 0], 7: [0, 1], 8: [2, 3], 9: [2, 2], 10: [1, 3], 11: [1, 2], 12: [2, 0], 13: [2, 1], 14: [1, 0], 15: [1, 1] };
function neighborMask(x, y, same) {
  const s = (xx, yy) => { if (yy < 0 || yy >= W.h || xx < 0 || xx >= W.w) return true; return same(W.rows[yy][xx]); };
  return (s(x, y - 1) ? 1 : 0) | (s(x + 1, y) ? 2 : 0) | (s(x, y + 1) ? 4 : 0) | (s(x - 1, y) ? 8 : 0);
}
function autotile(g, key, ox, oy, x, y, same, dx, dy, T) {
  const [ax, ay] = MASK_OFF[neighborMask(x, y, same)];
  tl(g, key, ox + ax, oy + ay, dx, dy, T);
}
const GRASS_V = [[0, 12], [0, 12], [0, 12], [0, 12], [1, 12], [2, 12], [3, 12], [4, 12], [2, 11], [3, 11]];
const CAVE_V = [[11, 19], [11, 19], [12, 19], [13, 19], [14, 19], [15, 19]];
// chão por tema: preenchimento + origem do bloco de caminho com borda
const GROUND = {
  grass:    { fill: GRASS_V, path: [0, 7] },
  forest:   { fill: [[11, 12], [11, 12], [11, 12], [12, 12], [13, 12], [14, 12], [15, 12]], path: [11, 7] },
  mountain: { fill: [[0, 5], [0, 5], [0, 5], [1, 5], [2, 5], [3, 5], [4, 5]], path: [0, 0] },
};
const isPath = c => c === '=';
const isWater = c => c === '~';
const isRock = c => c === '#';

// ---------- chão ----------
function drawGroundArt(g, ch, x, y, dx, dy, T) {
  const cave = W.map.theme === 'cave';
  const h = hashStr(x * 7919 + y * 104729);
  const GR = GROUND[W.map.theme] || GROUND.grass;
  if (ch === '=') return autotile(g, 'floor', GR.path[0], GR.path[1], x, y, isPath, dx, dy, T);
  if (ch === '~') return autotile(g, 'water', 0, 6, x, y, isWater, dx, dy, T);
  if (ch === '#') {
    const at = (xx, yy) => (yy < 0 || yy >= W.h || xx < 0 || xx >= W.w) ? true : isRock(W.rows[yy][xx]);
    const base = cave ? 0 : 5; // cinza na caverna, marrom lá fora
    const L = at(x - 1, y), R = at(x + 1, y);
    // face do penhasco: rocha sem rocha embaixo (ou última linha)
    if (!at(x, y + 1) || y === W.h - 1) return tl(g, 'relief', !L ? 4 : !R ? 6 : 5, base + 2, dx, dy, T);
    // topo do platô (9 fatias)
    const row = !at(x, y - 1) ? 0 : !at(x, y + 2) ? 2 : 1;
    const col = !L ? 0 : !R ? 3 : 1 + ((x + y) & 1);
    tl(g, 'relief', col, base + row, dx, dy, T);
    if (cave) { g.fillStyle = 'rgba(22,16,30,.68)'; g.fillRect(dx, dy, T, T); }
    return;
  }
  if (ch === 'L') { tl(g, 'relief', 5, 7, dx, dy, T); return tl(g, 'nature', 7, 13, dx, dy, T); }
  if (cave) {
    const [vx, vy] = CAVE_V[h % CAVE_V.length]; tl(g, 'floor', vx, vy, dx, dy, T);
    if (ch === 'X') { const gr = g.createLinearGradient(0, dy, 0, dy + T); gr.addColorStop(0, 'rgba(255,240,180,0)'); gr.addColorStop(1, 'rgba(255,240,180,.7)'); g.fillStyle = gr; g.fillRect(dx, dy, T, T); }
    return;
  }
  const [vx, vy] = GR.fill[h % GR.fill.length]; tl(g, 'floor', vx, vy, dx, dy, T);
}
// ---------- detalhes rasteiros (flores, mato alto) ----------
function drawFlatArt(g, ch, x, y, dx, dy, T) {
  if (ch === ',') return tl(g, 'nature', 7, 11, dx, dy, T);
  if (ch === 'f') { const h = hashStr(x * 31 + y * 17) % 3; return tl(g, 'detail', [5, 2, 4][h], h === 1 ? 0 : (h === 0 ? 2 : 0), dx, dy, T); }
}
// ---------- objetos com altura (ordenados por profundidade) ----------
// [coluna, linha, largura]: a porta fica sempre na 2ª coluna
const HOUSE_SRC = { P: [0, 0, 4], I: [8, 0, 4], M: [4, 0, 4], J: [12, 0, 4], H: [0, 0, 4], D: [23, 0, 3], Y: [26, 0, 3], N: [16, 0, 3] };
function buildStatics() {
  const out = [];
  for (let y = 0; y < W.h; y++) for (let x = 0; x < W.w; x++) {
    const ch = W.rows[y][x], h = hashStr(x * 131 + y * 977) % 10;
    if (ch === 'T') out.push({ x, y, by: y + 1, k: 'tree', src: h < 7 ? [16, 0] : h < 9 ? [0, 0] : [2, 0] });
    else if (ch === 'k') out.push({ x, y, by: y + 1, k: 'tree', src: [14, 0] });
    else if (ch === 'u') out.push({ x, y, by: y + 1, k: 'one', key: 'nature', src: [10, 9] });
    else if (ch === 'q') out.push({ x, y, by: y + 1, k: 'one', key: 'nature', src: [4, 13] });
    else if (ch === 'R') out.push({ x, y, by: y + 1, k: 'one', key: 'nature', src: [8, 12] });
    else if (ch === 'S') out.push({ x, y, by: y + 1, k: 'one', key: 'element', src: [0, 2] });
    else if (ch === 'C') out.push({ x, y, by: y + 1, k: 'chest' });
    else if (HOUSE_SRC[ch]) out.push({ x: x - 1, y: y - 2, by: y + 1, k: 'house', src: HOUSE_SRC[ch], door: ch, dx: x, dy: y });
  }
  (W.map.objs || []).forEach(o => { if (o.k === 'torii') out.push({ x: o.x, y: o.y, by: o.y + 2, k: 'torii' }); });
  return out;
}
const PLAQUE_ART = { I: '宿', M: '店', J: '社', P: '道', D: '道', Y: '本', N: '店' };
function drawStatic(g, s, ox, oy, T) {
  const sx = s.x * T + ox, sy = s.y * T + oy;
  if (s.k === 'tree') {
    // na floresta as árvores são um pouco menores, pra dar pra ver os corredores do labirinto
    if (W.map.theme === 'forest') return g.drawImage(ART.img.nature, s.src[0] * 16, s.src[1] * 16, 32, 32, sx - T * .25, sy - T * .5, T * 1.5, T * 1.5);
    return tl(g, 'nature', s.src[0], s.src[1], sx - T / 2, sy - T, T, 2, 2);
  }
  if (s.k === 'one') return tl(g, s.key, s.src[0], s.src[1], sx, sy, T);
  if (s.k === 'chest') { const open = chestOpen(s.x, s.y); return g.drawImage(ART.img.chest, open ? 16 : 0, 0, 16, 16, sx, sy, T, T); }
  if (s.k === 'torii') return tl(g, 'house', 0, 5, sx, sy, T, 3, 2);
  if (s.k === 'house') {
    tl(g, 'house', s.src[0], s.src[1], sx, sy, T, s.src[2] || 4, 3);
    const lab = PLAQUE_ART[s.door];
    if (lab) {
      const px = s.dx * T + ox + T / 2, py = (s.dy - 1) * T + oy + T * .62;
      const bw = T * .56, bh = T * .44;
      g.fillStyle = '#fff6dc'; g.strokeStyle = '#3a2412'; g.lineWidth = Math.max(1.5, T / 22);
      g.fillRect(px - bw / 2, py - bh / 2, bw, bh); g.strokeRect(px - bw / 2, py - bh / 2, bw, bh);
      g.fillStyle = '#3a2412'; g.font = `900 ${T * .32}px ${JP_FONT}`; g.textAlign = 'center'; g.textBaseline = 'middle';
      g.fillText(lab, px, py + 1);
    }
  }
}
// ---------- personagens ----------
function drawCharArt(g, look, dir, row, dx, dy, T) {
  const im = ART.img['ch_' + look]; if (!im) return false;
  if (im.width < 64) { // bichinhos: só uma animação parada (2 quadros), virados pro lado que andam
    const f = Math.floor(performance.now() / 450) % Math.max(1, Math.floor(im.width / 16));
    g.save();
    if (dir === 'right') { g.translate(dx + T, 0); g.scale(-1, 1); dx = 0; }
    g.drawImage(im, f * 16, 0, 16, 16, dx, dy + T * .12, T, T);
    g.restore();
    return true;
  }
  const col = { down: 0, up: 1, left: 2, right: 3 }[dir] || 0;
  const rows = Math.max(1, Math.min(4, Math.floor(im.height / 16)));
  g.drawImage(im, col * 16, (row % rows) * 16, 16, 16, dx, dy, T, T);
  return true;
}
// ---------- efeitos de golpe na batalha ----------
// desenha o quadro atual de um efeito (p = 0..1 do progresso)
function drawFxSprite(g, key, x, y, size, p) {
  const im = ART.img['fx_' + key], n = FX_META[key]; if (!im || !n) return false;
  const fw = im.width / n, f = Math.min(n - 1, Math.floor(p * n));
  const s = size / Math.max(fw, im.height);
  g.drawImage(im, f * fw, 0, fw, im.height, x - fw * s / 2, y - im.height * s / 2, fw * s, im.height * s);
  return true;
}
