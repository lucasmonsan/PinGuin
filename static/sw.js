const CACHE_NAME = 'locallist-v1';
const STATIC_ASSETS = [
	'/',
	'/manifest.json',
	'/icon-192.png',
	'/icon-512.png'
];

// Install - cache static assets
self.addEventListener('install', (event) => {
	event.waitUntil(
		caches.open(CACHE_NAME).then((cache) => {
			return cache.addAll(STATIC_ASSETS);
		})
	);
	self.skipWaiting();
});

// Activate - cleanup old caches
self.addEventListener('activate', (event) => {
	event.waitUntil(
		caches.keys().then((cacheNames) => {
			return Promise.all(
				cacheNames
					.filter((name) => name !== CACHE_NAME)
					.map((name) => caches.delete(name))
			);
		})
	);
	self.clients.claim();
});

// Fetch - network first, fallback to cache
self.addEventListener('fetch', (event) => {
	// Skip cross-origin requests
	if (!event.request.url.startsWith(self.location.origin)) {
		return;
	}

	// Skip API calls (always need fresh data)
	if (event.request.url.includes('/api/')) {
		return;
	}

	event.respondWith(
		fetch(event.request)
			.then((response) => {
				// Clone response to cache
				const responseToCache = response.clone();
				caches.open(CACHE_NAME).then((cache) => {
					cache.put(event.request, responseToCache);
				});
				return response;
			})
			.catch(() => {
				// Network failed, try cache
				return caches.match(event.request);
			})
	);
});

