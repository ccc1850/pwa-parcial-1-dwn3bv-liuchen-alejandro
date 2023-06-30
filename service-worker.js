

self.addEventListener('install', function(installation) {
    self.skipWaiting();
    installation.waitUntil(
        caches
            .open('DVGS Cache')
            .then(cache => {
                cache.addAll([
                    './',
                    './index.html',
                    './views/product_detail.html',
                    './views/add_product_form.html',
                    './css/styles.css',
                    './css/bootstrap/bootstrap.css',
                    './js/script.js',
                    './js/product_detail.js',
                    './js/bootstrap/bootstrap.js',
                    './js/cart.js',
                    './js/sw_installer.js',
                    './js/add_product_form.js',
                    './img/logo-red.png',
                    './img/logo.png',

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
        icon: 'favicon-32x32.png',
    };
    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});