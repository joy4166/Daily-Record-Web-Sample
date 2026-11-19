/* ============================================================================
   Service Worker — 종합사회복지관 · 주간보호시설 일일 활동 기록 샘플
   Network-First for app shell (fresh updates immediately; offline cache fallback)
   ============================================================================ */

const CACHE_NAME = 'welfare-daily-record-sample-v2';
const PRECACHE_URLS = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './firebase-config.js',
  './manifest.webmanifest',
  './icon.svg',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS.map((u) => new Request(u, { cache: 'reload' }))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  // External APIs (Firestore, gstatic SDK, Pretendard CDN) bypass SW cache logic
  if (url.origin !== self.location.origin) {
    return;
  }

  const networkPromise = req.mode === 'navigate'
    ? fetch(req)
    : fetch(req.url, { cache: 'no-cache' });

  event.respondWith(
    networkPromise
      .then((res) => {
        if (res && res.status === 200) {
          const clone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, clone)).catch(() => {});
        }
        return res;
      })
      .catch(() =>
        caches.match(req).then((cached) => cached || (req.mode === 'navigate' ? caches.match('./index.html') : undefined))
      )
  );
});
