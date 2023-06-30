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
  try {
    let response = await fetch(url, options);


    let game = await response.json();

    const detailsContainer = document.querySelector('#game-det-container');

    let imagen = '';

    if (game.images.length === 0) {
      imagen = '../img/placeholder.webp';
    } else {
      imagen = game.images[0].src;
    }

    const image = document.createElement('img');
    image.classList.add('det-img');
    image.src = imagen;
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
  } catch (error) {
    console.error('An error occurred while loading the game detail:', error);
    let gameContainer = document.getElementById('game-det-container');
    gameContainer.innerHTML += `
    <div class="col-12 text-center">
        <h1>An error ocurred</h1>
        <a href="../index.html" class="btn btn-primary">Reload</a>
    </div>
  `;

  }
};

GameDetail();




