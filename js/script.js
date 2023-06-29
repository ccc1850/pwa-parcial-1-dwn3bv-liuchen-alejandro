/* REGISTRAR EL SERVICE WORKER */
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
      navigator.serviceWorker.register('service-worker.js')
        .then(function() {
          console.log('Service Worker succesfully registered');
        })
        .catch(function(error) {
          console.log('Service Worker registration failed:', error);
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
            <h1>An error ocurred</h1>
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

        const shortDesc = game.description.slice(0, 100) + '...'

        const card = document.createElement('div');
        card.classList.add('card', 'col-xxl-4', 'col-md-6');
      
        const image = document.createElement('img');
        image.classList.add('card-img');
        image.src = game.images[0].src;
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
        price.innerHTML = `Price: <span class="green">$${game.price}</span>`;
        cardBody.appendChild(price);
      
        const seeMoreLink = document.createElement('a');
        seeMoreLink.href = `views/product_detail.html?id=${game.id}`;
        seeMoreLink.classList.add('btn', 'btn-primary');
        seeMoreLink.textContent = 'See More';
        cardBody.appendChild(seeMoreLink);
      
        const addToCartBtn = document.createElement('button');
        addToCartBtn.classList.add('btn', 'btn-primary');
        addToCartBtn.textContent = 'Add to Cart';
        addToCartBtn.addEventListener('click', () => {
          CartLocalStorage(game.name);
        });
        cardBody.appendChild(addToCartBtn);
      
        gameContainer.appendChild(card);
      });


}

LoadGames();


/* FUNCIONES CARRITO */


/* FUNCION QUE CARGA LOS ITEMS GUARDADOS EN EL CARRITO DE LOCAL STORAGE AL CARRITO */
const LoadCartItems = () => {
    let items = document.getElementsByClassName('cart-items')[0]; // Select the first element with the class 'cart-items'
    let cart = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];
    
    if (cart.length > 0) {
        let itemList = '';
        cart.forEach(item => {
            itemList += `<li>${item}</li>`;
        });
        items.innerHTML = itemList;
    } else {
        items.innerHTML = `<li>No items in cart</li>`;
    }
}

/* FUNCION QUE MUESTRA EL CARRITO Y ACTUALIZA EL PRECIO TOTAL */
const ShowCart = async () => {
    let cart = document.getElementById('cart');
    cart.addEventListener('click', HideCart);
    let innercart = document.getElementById('inner-cart');
    innercart.addEventListener('click', (e) => {
        e.stopPropagation();
    });
    if(cart.style.display == 'none'){
        LoadCartItems();
        cart.style.display = 'block';
    }
    else{
        cart.style.display = 'none';
    }

    let cartTotal = document.getElementById('cart-total');

    let cartItems = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];
    let total = 0;
    cartTotal.innerHTML = `
    <p>Total: <span class="green">$${total}</span></p>
    `;
}

/* FUNCION QUE OCULTA EL CARRITO */
const HideCart = () => {
    let cart = document.getElementById('cart');
    cart.style.display = 'none';
}


/* FUNCION PARA BORRAR ITEMS DEL CARRITO */
const ClearCart = () => {
    localStorage.removeItem('cart');
    LoadCartItems();
    let cartTotal = document.getElementById('cart-total');
    cartTotal.innerHTML = `
    <p>Total: $0</p>
    `;

}



/* FUNCION QUE AGREGA EL ITEM SELECCIONADO Y MANDA UNA NOTIFICACION */
const CartLocalStorage = (item) => {
    let flag = true;
    let cart = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];
    if(cart.length > 0){
        cart.forEach(game => {
            if(game == item){
                let noti = document.createElement('div');
                noti.classList.add('notification');
                noti.innerHTML = `
                <p>This item is already in your cart</p>
                `;
                document.body.appendChild(noti);
                setTimeout(() => {
                    noti.remove();
                }, 3000);
                console.log('Item already in cart');
                flag = false;
                return;
            }
        });
    }
    if(flag){
        gameList.forEach(game => {
            if(game.title == item){
                cart.push(game.title);
                localStorage.setItem('cart', JSON.stringify(cart));
                let noti = document.createElement('div');
                noti.classList.add('notification');
                noti.innerHTML = `
                <p>Item succesfully added to cart</p>
                `;
                document.body.appendChild(noti);
                setTimeout(() => {
                    noti.remove();
                }, 3000);
                console.log('Item added to cart:', game);
            }
        });
    }

}


