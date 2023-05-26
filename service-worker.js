

self.addEventListener('install', function(installation) {
    self.skipWaiting();
    installation.waitUntil(
        caches
            .open('DVGS Cache')
            .then(cache => {
                cache.addAll([
                    './',
                    './index.html',
                    './css/styles.css',
                    './css/bootstrap/bootstrap.css',
                    './js/script.js',
                    './js/product_detail.js',
                    './js/bootstrap/bootstrap.js'

                ]);
            })
    )
});

self.addEventListener('activate', function(activation) {
    console.log('Service Worker has been activated');

});


self.addEventListener('fetch', function(loader) {
    loader.respondWith(
        caches.match(loader.request)
            .then(response => {
                if (response) {
                    return response;
                }
                return fetch(loader.request);
            })
    );
});
