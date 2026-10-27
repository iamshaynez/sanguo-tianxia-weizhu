// sw.js —— 版本化应用壳、全剧情离线、头像按需缓存与安全更新。
const BUILD_CACHE = '__BUILD_CACHE__';
const BUILD_ASSETS = [];
const CACHE_PREFIX = 'sanguo-shell-';
const OFFLINE_PORTRAIT = '/assets/offline-portrait.svg';
const STATIC_ASSETS = [
  '/', '/index.html', '/manifest.webmanifest', OFFLINE_PORTRAIT,
  '/assets/icons/icon-192.png', '/assets/icons/icon-512.png',
  '/assets/icons/icon-maskable-512.png', '/assets/icons/apple-touch-icon.png',
];
const PRECACHE = [...STATIC_ASSETS, ...BUILD_ASSETS];

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(BUILD_CACHE);
    await cache.addAll(PRECACHE);
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names
      .filter(name => name.startsWith(CACHE_PREFIX) && name !== BUILD_CACHE)
      .map(name => caches.delete(name)));
  })());
});

async function navigation(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(BUILD_CACHE);
      await cache.put('/index.html', response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match('/index.html');
    return cached || Response.error();
  }
}

async function cachedOrFetch(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok) {
    const cache = await caches.open(BUILD_CACHE);
    await cache.put(request, response.clone());
  }
  return response;
}

async function portrait(request) {
  try {
    const response = await cachedOrFetch(request);
    if (!response.ok) throw new Error(`头像 ${response.status}`);
    return response;
  } catch (error) {
    const fallback = await caches.match(OFFLINE_PORTRAIT);
    if (fallback) return fallback;
    throw error;
  }
}

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== location.origin || url.pathname === '/sw.js' || url.pathname === '/runtime.json') return;
  if (request.mode === 'navigate') {
    event.respondWith(navigation(request));
  } else if (url.pathname.startsWith('/assets/portraits/')) {
    event.respondWith(portrait(request));
  } else if (url.pathname.startsWith('/assets/') || url.pathname === '/manifest.webmanifest') {
    event.respondWith(cachedOrFetch(request));
  }
});
