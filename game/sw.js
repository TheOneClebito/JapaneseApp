// Service worker do jogo — funciona offline e se atualiza sozinho.
const CACHE = 'kotodama-v4';
const CHARS = ['Boy', 'Child', 'Hunter', 'Master', 'Monk', 'NinjaBlue', 'OldMan', 'OldWoman', 'Princess', 'Samurai', 'Villager2', 'Woman',
  'NinjaRed', 'NinjaGreen', 'FighterWhite', 'Villager', 'Villager3', 'Villager4', 'Noble', 'Monk2', 'Tengu', 'SamuraiBlue', 'Shaman', 'NinjaMasked', 'OldMan2', 'Inspector', 'Cat', 'CatBlack'];
const FX = ['Flam', 'Water', 'Plant', 'Rock', 'Thunder', 'Spark', 'CutX', 'Shield'];
const TILES = ['Chest', 'TilesetElement', 'TilesetFloor', 'TilesetFloorDetail', 'TilesetHouse', 'TilesetNature', 'TilesetRelief', 'TilesetWater'];
const ASSETS = [
  './', './index.html', './manifest.webmanifest',
  './js/util.js', './js/data.js', './js/sprites.js', './js/tiles.js', './js/quiz.js', './js/world.js', './js/chapters.js', './js/training.js',
  './js/battle.js', './js/ui.js', './js/solitaire.js', './js/main.js',
  './icons/icon-192.png', './icons/icon-512.png', './icons/apple-touch-icon.png',
  '../hanzi-writer.min.js', '../kanji-strokes.js', '../kanji-list.js', '../kanji-words.js',
  '../vocab-decks.js', '../verbs.js', '../drills-data.js', '../kanji-sentences.js', '../writing-sentences.js',
  '../reading-texts.js', '../tatoeba-sentences.js', '../fonts/pressstart.woff2',
  ...TILES.map(t => `./assets/tiles/${t}.png`),
  ...CHARS.flatMap(c => [`./assets/chars/${c}/SpriteSheet.png`, `./assets/chars/${c}/Faceset.png`]),
  ...FX.map(f => `./assets/fx/${f}.png`),
  // as músicas (assets/music) não entram aqui: baixam quando tocam
];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  // só apaga caches antigos DO JOGO (o app de estudo tem os dele)
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k.startsWith('kotodama-') && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.origin !== self.location.origin) return;
  e.respondWith(caches.open(CACHE).then(cache => cache.match(e.request).then(cached => {
    const net = fetch(e.request).then(res => { if (res && res.status === 200) cache.put(e.request, res.clone()); return res; }).catch(() => cached);
    return cached || net;
  })));
});
