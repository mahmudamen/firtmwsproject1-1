self.addEventListener('install', e => {
  const timeStamp = Date.now();
  e.waitUntil(
    caches.open('restaurant').then(cache => {
      return cache.addAll([
        `/`,
        `/index.html?timestamp=${timeStamp}`,
       '/restaurant.html?timestamp=${timeStamp}',
       '/css/styles.css?timestamp=${timeStamp}',
       '/js/dbhelper.js?timestamp=${timeStamp}',
	   '/js/restaurant_info.js?timestamp=${timeStamp}',
	   '/js/img/1.jpg?timestamp=${timeStamp}',
	   
      ])
          .then(() => self.skipWaiting());
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request, {ignoreSearch: true}).then(response => {
      return response || fetch(event.request);
    })
  );
});