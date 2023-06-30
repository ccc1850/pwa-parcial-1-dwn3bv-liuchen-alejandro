/* REGISTRAR EL SERVICE WORKER */
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
      navigator.serviceWorker.register('./../service-worker.js')
        .then(function() {
          console.log('Service Worker succesfully registered');
        })
        .catch(function(error) {
          console.log('Service Worker registration failed:', error);
        });
    });
  }

  const testproduct = () => {
    console.log('test');
  }

/* CONSEGUIR EL ID DEL ITEM DESDE LA URL */
const producto = new URLSearchParams(window.location.search);
let itemId = producto.get('id');
itemId = parseInt(itemId);

/* DEFINIR LA API DEL DETALLE DE JUEGO ESPECIFICO */
let url = `https://www.dvgame.store/wp-json/wc/v3/products/${itemId}?consumer_key=ck_abf915fddd29f466658601d0f0651dfc25f34928&consumer_secret=cs_e0a0f5526c5813d8a02751b412010541c65a9a11`;
let options = {
	method: 'GET'
};



/* FUNCION QUE MUESTRA LOS DATOS DEL JUEGO SELECCIONADO */
const GameDetail = async () => {
    let response = await fetch(url, options);

    let gameContainer = document.getElementById('game-container');

    if (!response.ok) {
        gameContainer.innerHTML += `
        <div class="col-12 text-center">
            <h1>An error ocurred</h1>
            <a href="index.html" class="btn btn-primary">Reload</a>
        </div>
        `;

      return;
    }

    let game = await response.json();
        


    const detailsContainer = document.querySelector('#game-det-container');
    
    const image = document.createElement('img');
    image.classList.add('det-img');
    image.src = game.images[0].src;
    image.alt = game.name;
    detailsContainer.appendChild(image);
    
    const detBody = document.createElement('div');
    detBody.classList.add('det-body');
    detailsContainer.appendChild(detBody);
    
    const title = document.createElement('h1');
    title.classList.add('det-title');
    title.textContent = game.name;
    detBody.appendChild(title);
    
    const description = document.createElement('div');
    description.classList.add('det-text');
    description.innerHTML = game.description;
    detBody.appendChild(description);
    
    const price = document.createElement('p');
    price.classList.add('det-price');
    price.innerHTML = `Price: <span class="green">$${game.price}</span>`;
    detBody.appendChild(price);

    
    const addToCartBtn = document.createElement('button');
    addToCartBtn.classList.add('btn', 'btn-primary');
    addToCartBtn.textContent = 'Add to Cart';
    const detailsForCart = [game.name, game.price];
    addToCartBtn.addEventListener('click', () => {
      AddToCart(detailsForCart);
    });
    detBody.appendChild(addToCartBtn);
}

GameDetail();

const RemoveFromCart = (game) => {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  const index = cart.findIndex(item => item[0] === game);
  if (index !== -1) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    const cartList = document.querySelector('.cart-list');
    cartList.innerHTML = '';
    if(cart.length === 0) {
      const emptyCart = document.createElement("p");
      emptyCart.className = "empty-cart";
      emptyCart.textContent = "Your cart is empty";
      cartList.appendChild(emptyCart);
      return
    }
    cart.forEach(game => {

      const cartItem = document.createElement("div");
      cartItem.className = "cart-item";
      cartItem.innerHTML = `
        <p class="cart-item-title">${game[0]}</p>
        <p class="cart-item-price">$${game[1]}</p>
        <button class="btn btn-danger" onclick="RemoveFromCart('${game[0]}')">Remove</button>
      `;
      cartList.appendChild(cartItem);
    }
    );
  }
}

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
        <button class="btn btn-danger" onclick="RemoveFromCart('${game[0]}')">Remove</button>
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
      overlay.style.display = "none";
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
}



