const VERSION = 'export-map-v3';
const SHELL = ['/', '/demo', '/offline.html', '/privacy/', '/terms/', '/404.html', '/manifest.webmanifest', '/assets/export-route-768.webp', '/icons/icon-192.png', '/icons/icon-512.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(VERSION).then((cache) => cache.addAll(SHELL)));
});
self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== VERSION).map((key) => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener('message', (event) => { if (event.data === 'SKIP_WAITING') self.skipWaiting(); });
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  // A checkout return token is intentionally handled by the page, never put in
  // Cache Storage. This avoids retaining a private token after URL cleanup.
  if (url.searchParams.has('license')) return;
  if (event.request.mode === 'navigate') {
    const knownPath = url.pathname === '/demo' || url.pathname === '/demo/' ? '/demo' : url.pathname === '/privacy/' || url.pathname === '/terms/' ? url.pathname : '/';
    const cacheKey = new Request(knownPath, { method: 'GET' });
    event.respondWith(fetch(event.request).then((response) => { if (response.ok) { const copy = response.clone(); caches.open(VERSION).then((cache) => cache.put(cacheKey, copy)); } return response; }).catch(async () => (await caches.match(cacheKey)) || caches.match('/offline.html')));
    return;
  }
  event.respondWith(caches.match(event.request).then((cached) => cached || fetch(event.request).then((response) => { if (response.ok) { const copy = response.clone(); caches.open(VERSION).then((cache) => cache.put(event.request, copy)); } return response; })));
});
