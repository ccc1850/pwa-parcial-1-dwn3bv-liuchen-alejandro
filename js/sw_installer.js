/* REGISTRAR EL SERVICE WORKER */
if ('serviceWorker' in navigator) {
    if(navigator.serviceWorker.controller) {
        let reminder = document.querySelector('.reminder');
        reminder.style.display = 'none';
    }
    else {
        window.addEventListener('load', function() {
            let reminder = document.querySelector('.reminder');
            let installButton = document.getElementById('install-button');
            reminder.style.display = 'block';

    
            installButton.addEventListener('click', function() {
              installButton.disabled = true;
    
              navigator.serviceWorker.register('service-worker.js')
                .then(function(registration) {
                  console.log('Service Worker registered with scope:', registration.scope);
                  installButton.textContent = 'Se instalo el service worker!';
                  setTimeout(function () {
                    reminder.style.display = 'none';
                  }, 3000);
                })
                .catch(function(error) {
                  console.log('Service Worker registration failed:', error);
                  installButton.textContent = 'No se pudo instalar, por favor vuelva a intentarlo.';
                  installButton.disabled = false;
                });
            });
          });
        }
  }