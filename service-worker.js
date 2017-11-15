var dataCacheName = 'weatherData-v7';
var cacheName = 'weatherPWA-step-7-1';
var filesToCache = [
    'https://maaaiiio0108.github.io/maaaiiio.github.io/',
    'https://maaaiiio0108.github.io/maaaiiio.github.io/index.html',
    'https://maaaiiio0108.github.io/maaaiiio.github.io/scripts/app.js',
    'https://maaaiiio0108.github.io/maaaiiio.github.io/styles/inline.css',
    '/https://maaaiiio0108.github.io/maaaiiio.github.io/images/clear.png',
    '/https://maaaiiio0108.github.io/maaaiiio.github.io/images/cloudy-scattered-showers.png',
    '/https://maaaiiio0108.github.io/maaaiiio.github.io/images/cloudy.png',
    '/https://maaaiiio0108.github.io/maaaiiio.github.io/images/fog.png',
    '/https://maaaiiio0108.github.io/maaaiiio.github.io/images/ic_add_white_24px.svg',
    '/https://maaaiiio0108.github.io/maaaiiio.github.io/images/ic_refresh_white_24px.svg',
    '/https://maaaiiio0108.github.io/maaaiiio.github.io/images/partly-cloudy.png',
    '/https://maaaiiio0108.github.io/maaaiiio.github.io/images/rain.png',
    '/https://maaaiiio0108.github.io/maaaiiio.github.io/images/scattered-showers.png',
    '/https://maaaiiio0108.github.io/maaaiiio.github.io/images/sleet.png',
    '/https://maaaiiio0108.github.io/maaaiiio.github.io/images/snow.png',
    '/https://maaaiiio0108.github.io/maaaiiio.github.io/images/thunderstorm.png',
    '/https://maaaiiio0108.github.io/maaaiiio.github.io/images/wind.png'
];

self.addEventListener('install', function(e) {
    console.log('[ServiceWorker] Install');
    e.waitUntil(
        caches.open(cacheName).then(function(cache) {
            console.log('[ServiceWorker] Caching app shell');
            return cache.addAll(filesToCache);
        })
    );
});

self.addEventListener('activate', function(e) {
    console.log('[ServiceWorker] Activate');
    e.waitUntil(
        caches.keys().then(function(keyList) {
            return Promise.all(keyList.map(function(key) {
                if (key !== cacheName && key !== dataCacheName) {
                    console.log('[ServiceWorker] Removing old cache', key);
                    return caches.delete(key);
                }
            }));
        })
    );
});

self.addEventListener('fetch', function(e) {
    console.log('[ServiceWorker] Fetch', e.request.url);
    var dataUrl = 'https://publicdata-weather.firebaseio.com/';
    if (e.request.url.indexOf(dataUrl) === 0) {
        e.respondWith(
            fetch(e.request)
            .then(function(response) {
                return caches.open(dataCacheName).then(function(cache) {
                    cache.put(e.request.url, response.clone());
                    console.log('[ServiceWorker] Fetched&Cached Data');
                    return response;
                });
            })
        );
    } else {
        e.respondWith(
            caches.match(e.request).then(function(response) {
                return response || fetch(e.request);
            })
        );
    }
});