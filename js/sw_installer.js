/* REGISTRAR EL SERVICE WORKER */
if ('serviceWorker' in navigator) {
    if(navigator.serviceWorker.controller) {
        let installButton = document.getElementById('install-button');
        installButton.display = "none";
    }
    else {
        window.addEventListener('load', function() {
            let installButton = document.getElementById('install-button');
    
            installButton.addEventListener('click', function() {
              installButton.disabled = true;
    
              navigator.serviceWorker.register('service-worker.js')
                .then(function(registration) {
                  console.log('Service Worker registered with scope:', registration.scope);
                  installButton.textContent = 'Se instalo el service worker!';
                  setTimeout('installButton.display = "none"', 3000);
                })
                .catch(function(error) {
                  console.log('Service Worker registration failed:', error);
                  installButton.textContent = 'Installation Failed';
                  installButton.disabled = false;
                });
            });
          });
        }
  }