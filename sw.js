const cacheName = 'moms-v9';

self.addEventListener('install', event => {
	self.skipWaiting();

	event.waitUntil(
		caches.open(cacheName).then(cache => {
			return cache.addAll([
				'./',
				'index.html',
				'message.html',
				'css/common.css',
				'css/index.css',
				'css/message.css',
				'fonts/Montserrat-Regular.ttf',
				'images/bg.png',
				'images/bg-mobile.png',
				'images/down-arrow.png',
				'js/index.js',
				'js/message.js',
				'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css',
				'https://cdnjs.cloudflare.com/ajax/libs/gsap/1.20.4/TweenLite.min.js',
				'https://cdnjs.cloudflare.com/ajax/libs/gsap/1.20.4/plugins/ScrollToPlugin.min.js',
			]);
		})
	);
});

self.addEventListener('activate', event => {
	event.waitUntil(
		caches.keys().then(keys => Promise.all(
			keys.map(key => key !== cacheName ? caches.delete(key) : Promise.resolve())
		))
	);
});

self.addEventListener('fetch', event => {
	event.respondWith(
		caches.match(event.request).then(response => response || fetch(event.request))
	);
});
