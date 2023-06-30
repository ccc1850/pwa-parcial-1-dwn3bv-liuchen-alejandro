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



/* FUNCIONES CARRITO */

const RemoveFromCart = (game) => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const index = cart.findIndex(item => item[0] === game);
    if (index !== -1) {
      cart.splice(index, 1);
      localStorage.setItem('cart', JSON.stringify(cart));
      const cartList = document.querySelector('.cart-list');
      cartList.innerHTML = '';
      if (cart.length === 0) {
        const emptyCart = document.createElement("p");
        emptyCart.className = "empty-cart";
        emptyCart.textContent = "Your cart is empty";
        cartList.appendChild(emptyCart);
      } else {
        cart.forEach(game => {
          const cartItem = document.createElement("div");
          cartItem.className = "cart-item";
          cartItem.innerHTML = `
            <p class="cart-item-title">${game[0]}</p>
            <p class="cart-item-price">$${game[1]}</p>
            <button class="btn btn-danger" onclick="RemoveFromCart('${game[0]}')">Remove</button>
          `;
          cartList.appendChild(cartItem);
        });
      }
    }
    cart = JSON.parse(localStorage.getItem('cart')) || [];
  };
  
  
  const CartOverlay = () => {
    const overlay = document.createElement("div");
    overlay.className = "overlay";
  
    const cartContent = document.createElement("div");
    cartContent.className = "cart-content";
  
    const cartTitle = document.createElement("p");
    cartTitle.className = "cart-title";
    cartTitle.textContent = "Your Cart";
    cartContent.appendChild(cartTitle);
  
    const cartList = document.createElement("div");
    cartList.className = "cart-list";
    
    let cart = JSON.parse(localStorage.getItem('cart')) ? JSON.parse(localStorage.getItem('cart')) : [];
    if(cart.length === 0) {
      const emptyCart = document.createElement("p");
      emptyCart.className = "empty-cart";
      emptyCart.textContent = "Your cart is empty";
      cartContent.appendChild(emptyCart);
    } 
    else {
      cart.forEach(game => {
        const cartItem = document.createElement("div");
        cartItem.className = "cart-item";
        cartItem.innerHTML = `
          <p class="cart-item-title">${game[0]}</p>
          <p class="cart-item-price">$${game[1]}</p>
          <button class="btn btn-danger" onclick="RemoveFromCart('${game[0]}')">Remover</button>
        `;
        cartList.appendChild(cartItem);
      });
      cartContent.appendChild(cartList);
    }
  
    // Append the cart content to the overlay
    overlay.appendChild(cartContent);
  
    // Append the overlay to the body
    document.body.appendChild(overlay);
  
    // Add a click event listener to the overlay to hide it when clicked
    overlay.addEventListener("click", function(event) {
      if (event.target === overlay) {
        overlay.remove();
      }
    });

  
  }
  
  
  
  /* FUNCION QUE AGREGA EL JUEGO AL CARRITO */
  const AddToCart = (detailsForCart) => {
    let cart = JSON.parse(localStorage.getItem('cart')) ? JSON.parse(localStorage.getItem('cart')) : [];
    if(cart.length > 0 && cart[0][0] === detailsForCart[0]) {
      alert('This item is already in your cart');
      return;
    }
    cart.push(detailsForCart);
    localStorage.setItem('cart', JSON.stringify(cart));
    CartOverlay();
    notification(detailsForCart[0]);
  }
  
  
  
  