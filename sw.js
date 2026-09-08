const CACHE_NAME = 'stockeo-static-v2';
const CORE = ['./', './index.html', './css/framer-snapshot.css', './css/motion.css', './js/catalog.js', './js/motion.js', './manifest.json'];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => (key.startsWith('stockeo-static-') || key.startsWith('linetech-cache-')) && key !== CACHE_NAME).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  const {request} = event;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;
  if (request.mode === 'navigate' || url.pathname.endsWith('/data/products.json')) {
    event.respondWith(fetch(request).then(response => {
      if (response.ok) { const copy = response.clone(); event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.put(request, copy))); }
      return response;
    }).catch(() => caches.match(request).then(cached => cached || Response.error())));
    return;
  }
  if (!/\/(?:assets|images|css|js)\//.test(url.pathname)) return;
  event.respondWith(caches.match(request).then(cached => cached || fetch(request).then(response => {
    if (response.ok) { const copy = response.clone(); event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.put(request, copy))); }
    return response;
  })));
});
