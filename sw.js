const CACHE_NAME = 'jule-cache-v1'; // Bei jeder Änderung (Code oder Icon) Version hochzählen
const urlsToCache = [
  './index.html',
  './manifest.json',
  './icon.png',
  'https://unpkg.com/react@18/umd/react.production.min.js',
  'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js',
  'https://unpkg.com/@babel/standalone/babel.min.js',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap',
  'https://www.transparenttextures.com/patterns/wood-pattern.png'
];

// Installation: Lädt die Dateien in den Cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting()) // Erzwingt, dass der neue SW sofort aktiv wird
  );
});

// Aktivierung: Hier findet die automatische Bereinigung statt
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // Wenn der gefundene Cache nicht dem aktuellen CACHE_NAME entspricht, löschen
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim()) // Übernimmt sofort die Kontrolle über alle offenen Tabs
  );
});

// Strategie: Erst im Cache suchen, dann im Netzwerk
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});