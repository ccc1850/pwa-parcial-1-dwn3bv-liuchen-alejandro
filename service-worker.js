

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

self.addEventListener('push', function(event) {
    console.log('Push message received', event);
    var title = 'Push message';
    var options = {
        body: 'The Message',
        icon: 'img/icon.png',
        tag: 'my-tag',
        actions: [
            { action: 'yes', title: 'Si' },
            { action: 'no', title: 'No' }
        ]
    };
    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});