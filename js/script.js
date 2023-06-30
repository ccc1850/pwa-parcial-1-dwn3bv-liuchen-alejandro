if(window.Notification && Notification.permission !== "denied") {
    setTimeout('Notification.requestPermission()', 5000);
}






/* REGISTRAR EL SERVICE WORKER */
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        var installButton = document.getElementById('install-button');

        installButton.addEventListener('click', function() {
          installButton.disabled = true;

          navigator.serviceWorker.register('service-worker.js')
            .then(function(registration) {
              console.log('Service Worker registered with scope:', registration.scope);
              installButton.textContent = 'Service Worker Installed';
            })
            .catch(function(error) {
              console.log('Service Worker registration failed:', error);
              installButton.textContent = 'Installation Failed';
              installButton.disabled = false;
            });
        });
      });
  }




/* DEFINIR LA API DE LA LISTA DE JUEGOS */
let url = 'https://www.dvgame.store/wp-json/wc/v3/products?per_page=100&consumer_key=ck_abf915fddd29f466658601d0f0651dfc25f34928&consumer_secret=cs_e0a0f5526c5813d8a02751b412010541c65a9a11';
let options = {
	method: 'GET'
};

/* ARRAY EN EL QUE SE GUARDARAN LOS JUEGOS DESEADOS */
let gameList = [];
    

/* FUNCION QUE CONSIGUE JUEGOS DE LA API Y LOS MUESTRA EN LA PAGINA */
const LoadGames = async () => {
    let response = await fetch(url, options);
    let gameContainer = document.getElementById('game-container');

    if (!response.ok) {
        gameContainer.innerHTML += `
        <div class="col-12 text-center">
            <h1>Ocurrio un error cargando los juegos</h1>
            <a href="index.html" class="btn btn-primary">Reload</a>
        </div>
        `;
        let h1 = document.querySelector('.hh1');
        h1.style.display = 'none';
        return;
    }

    let result = await response.json();


    let games = result.map(game => {
            gameList.push(game);
    });




    gameList.forEach(game => {

        const shortDesc = game.description.slice(0, 80) + '...'

        const card = document.createElement('div');
        card.classList.add('card', 'col-xxl-4', 'col-md-6');

        let imagen = '';

        if(game.images.length == 0){
            imagen = 'img/placeholder.webp';
        }
        else{
            imagen = game.images[0].src;
        }
      
        const image = document.createElement('img');
        image.classList.add('card-img');
        image.src = imagen;
        image.alt = game.name;
        card.appendChild(image);
      
        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');
        card.appendChild(cardBody);
      
        const title = document.createElement('h5');
        title.classList.add('card-title');
        title.textContent = game.name;
        cardBody.appendChild(title);
      
        const description = document.createElement('div');
        description.classList.add('card-text');
        description.innerHTML = shortDesc;
        cardBody.appendChild(description);
      
        const price = document.createElement('p');
        price.classList.add('card-price');
        price.innerHTML = `Precio: <span class="green">$${game.price}</span>`;
        cardBody.appendChild(price);
      
        const seeMoreLink = document.createElement('a');
        seeMoreLink.href = `views/product_detail.html?id=${game.id}`;
        seeMoreLink.classList.add('btn', 'btn-primary');
        seeMoreLink.textContent = 'Ver Detalles';
        cardBody.appendChild(seeMoreLink);
      
        const addToCartBtn = document.createElement('button');
        addToCartBtn.classList.add('btn', 'btn-primary', 'add-to-cart-btn');
        addToCartBtn.textContent = 'Agregar al carrito';
        const detailsForCart = [game.name, game.price]
        addToCartBtn.addEventListener('click', () => {
          AddToCart(detailsForCart);
        });
        cardBody.appendChild(addToCartBtn);
      
        gameContainer.appendChild(card);
      });


}

LoadGames();

const notification = (game) => {
    if (Notification.permission === 'granted') {
        let title = 'Agregaste un producto!';
        let body = `${game} se agregó al carrito`;
        let notification = new Notification(title, { body });
    } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                let title = 'Agregaste un producto!';
                let body = `${game} se agregó al carrito`;
                let notification = new Notification(title, { body });
            }
        });
    }
  }


