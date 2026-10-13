/**
 * HaNoi Realty Service Worker
 * Version: 1.0.0
 * Comprehensive offline caching, background resilience, and PWA capabilities.
 */

const CACHE_VERSION = 'hanoi-realty-v1';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const RUNTIME_CACHE = `${CACHE_VERSION}-runtime`;
const MAP_CACHE = `${CACHE_VERSION}-maps`;

// Critical assets to pre-cache on install
const PRECACHE_URLS = [
  '/offline',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/icon.svg',
  '/manifest.webmanifest',
];

// Install: pre-cache offline shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

// Activate: cleanup obsolete caches and claim clients
self.addEventListener('activate', (event) => {
  const allowedCaches = [STATIC_CACHE, RUNTIME_CACHE, MAP_CACHE];
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => !allowedCaches.includes(name))
            .map((name) => caches.delete(name))
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event handler
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // 1. Skip non-GET requests and internal Next dev / webpack hot-reloads
  if (request.method !== 'GET') return;
  if (url.pathname.startsWith('/_next/webpack-hmr')) return;

  // 2. Do not cache payment routes, auth callbacks, or external webhook APIs
  if (
    url.pathname.startsWith('/api/payment') ||
    url.pathname.startsWith('/auth/callback') ||
    url.pathname.startsWith('/api/sync-user')
  ) {
    return;
  }

  // 3. Navigation requests (HTML pages) -> Network first, fallback to cache, then /offline
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(RUNTIME_CACHE).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(async () => {
          // If offline, try matching from runtime cache
          const cachedPage = await caches.match(request);
          if (cachedPage) return cachedPage;

          // If not in cache, fallback to pre-cached /offline page
          const offlinePage = await caches.match('/offline');
          if (offlinePage) return offlinePage;

          return new Response('Offline - Vui lòng kiểm tra kết nối mạng.', {
            status: 503,
            headers: { 'Content-Type': 'text/plain; charset=utf-8' },
          });
        })
    );
    return;
  }

  // 4. Map tile images (Carto, OpenStreetMap, Mapbox tiles) -> Cache first with 7-day freshness
  if (
    url.hostname.includes('tile.openstreetmap.org') ||
    url.hostname.includes('basemaps.cartocdn.com') ||
    url.hostname.includes('tiles.mapbox.com') ||
    url.hostname.includes('api.mapbox.com')
  ) {
    event.respondWith(
      caches.open(MAP_CACHE).then(async (cache) => {
        const cachedTile = await cache.match(request);
        if (cachedTile) return cachedTile;

        try {
          const networkTile = await fetch(request);
          if (networkTile && networkTile.status === 200) {
            cache.put(request, networkTile.clone());
          }
          return networkTile;
        } catch {
          return cachedTile || new Response('', { status: 408 });
        }
      })
    );
    return;
  }

  // 5. Next.js static chunks, fonts, and images -> Stale-While-Revalidate
  if (
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.startsWith('/icons/') ||
    url.hostname.includes('fonts.googleapis.com') ||
    url.hostname.includes('fonts.gstatic.com')
  ) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        const fetchPromise = fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const responseClone = networkResponse.clone();
              caches.open(STATIC_CACHE).then((cache) => {
                cache.put(request, responseClone);
              });
            }
            return networkResponse;
          })
          .catch(() => cachedResponse);

        return cachedResponse || fetchPromise;
      })
    );
    return;
  }

  // Default: Network with Cache Fallback
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response && response.status === 200 && response.type === 'basic') {
          const clone = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, clone));
        }
        return response;
      })
      .catch(() => caches.match(request))
  );
});

// Push notification listener
self.addEventListener('push', (event) => {
  let data = {
    title: 'HaNoi Realty',
    body: 'Có cập nhật mới về bất động sản và quy hoạch Hà Nội.',
    url: '/',
  };

  try {
    if (event.data) {
      data = event.data.json();
    }
  } catch {
    if (event.data) {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: '/icons/icon-192.png',
    badge: '/icons/favicon-32.png',
    vibrate: [100, 50, 100],
    data: {
      url: data.url || '/',
    },
    actions: [
      { action: 'open', title: 'Xem chi tiết' },
      { action: 'close', title: 'Đóng' },
    ],
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

// Notification click handler: navigate to target URL
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || '/';

  event.waitUntil(
    self.clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url === targetUrl && 'focus' in client) {
            return client.focus();
          }
        }
        if (self.clients.openWindow) {
          return self.clients.openWindow(targetUrl);
        }
      })
  );
});
