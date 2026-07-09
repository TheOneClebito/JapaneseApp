// Service worker — cache-first offline para o app funcionar sem internet.
const CACHE = 'jpstudy-v24';
const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './hanzi-writer.min.js',
  './kanji-strokes.js',
  './kanji-list.js',
  './kanji-words.js',
  './vocab-decks.js',
  './tatoeba-sentences.js',
  './reading-texts.js',
  './writing-sentences.js',
  './jp-dict.js',
  './fonts/pressstart.woff2',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// stale-while-revalidate para arquivos do próprio app:
// responde do cache (rápido / offline) e atualiza em segundo plano.
// Pedidos a outros domínios (ex.: CDN de traços) seguem direto pela rede.
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.origin !== self.location.origin) return;
  e.respondWith(
    caches.open(CACHE).then((cache) =>
      cache.match(e.request).then((cached) => {
        const network = fetch(e.request).then((res) => {
          if (res && res.status === 200) cache.put(e.request, res.clone());
          return res;
        }).catch(() => cached);
        return cached || network;
      })
    )
  );
});
