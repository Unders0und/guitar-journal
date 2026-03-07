const CACHE = 'guitar-journal-v1';
const ASSETS = [
  '/guitar-journal/',
  '/guitar-journal/index.html',
  '/guitar-journal/manifest.json',
  '/guitar-journal/icon-192.png',
  '/guitar-journal/icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(response => {
        if (e.request.url.startsWith(self.location.origin)) {
          caches.open(CACHE).then(cache => cache.put(e.request, response.clone()));
        }
        return response;
      });
    }).catch(() => caches.match('/guitar-journal/index.html'))
  );
});
