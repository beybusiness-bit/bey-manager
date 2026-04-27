/* 베이 관리자 Service Worker */
var CACHE = 'bey-v1';
var ASSETS = ['./','./index.html','./styles.css','./app.js','./manifest.json','./icon-192.png','./icon-512.png'];

self.addEventListener('install', function(e) {
  e.waitUntil(caches.open(CACHE).then(function(c) { return c.addAll(ASSETS); }));
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(keys.filter(function(k) { return k !== CACHE; }).map(function(k) { return caches.delete(k); }));
    })
  );
  self.clients.claim();
});

/* 네트워크 우선, 실패 시 캐시 폴백 (앱 업데이트 즉시 반영) */
self.addEventListener('fetch', function(e) {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request).then(function(r) {
      if (r.ok) {
        var clone = r.clone();
        caches.open(CACHE).then(function(c) { c.put(e.request, clone); });
      }
      return r;
    }).catch(function() {
      return caches.match(e.request);
    })
  );
});

/* 향후 Firebase 푸시 알림용 (현재는 빈 핸들러) */
self.addEventListener('push', function(e) {
  if (!e.data) return;
  try {
    var data = e.data.json();
    e.waitUntil(
      self.registration.showNotification(data.title || '베이 관리자', {
        body: data.body || '',
        icon: './icon-192.png',
        badge: './icon-192.png'
      })
    );
  } catch(err) {}
});

self.addEventListener('notificationclick', function(e) {
  e.notification.close();
  e.waitUntil(clients.openWindow('./'));
});
