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
let url = 'https://free-to-play-games-database.p.rapidapi.com/api/games?platform=pc';
let options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': 'c4f9300751msh3ab7447fd37a570p1f7429jsn47187edf1fb6',
		'X-RapidAPI-Host': 'free-to-play-games-database.p.rapidapi.com'
	}
};

/* ARRAY EN EL QUE SE GUARDARAN LOS JUEGOS DESEADOS */
let gameList = [];
    

/* FUNCION QUE CONSIGUE JUEGOS DE LA API Y LOS MUESTRA EN LA PAGINA */
const LoadGames = async () => {
    let response = await fetch(url, options);
    let priceResponse = await fetch('data/prices.json');

    let gameContainer = document.getElementById('game-container');

    if (!response.ok || !priceResponse.ok) {
        gameContainer.innerHTML += `
        <div class="col-12 text-center">
            <h1>An error ocurred</h1>
            <a href="index.html" class="btn btn-primary">Reload</a>
        </div>
        `;
        return;
    }

    let result = await response.json();
    let prices = await priceResponse.json();


    let games = result.map(game => {
        if(game.publisher == 'Activision Blizzard' || game.publisher == 'Electronic Arts' || game.publisher == 'Ubisoft' || game.publisher == 'Valve'){
            gameList.push(game);
        }
    });

    let precios = prices.map(precio => {
        gameList.forEach(game => {
            if(game.id == precio.id){
                game.price = precio.price;
            }
        });
    });




    gameList.forEach(game => {
        gameContainer.innerHTML += `
        <div class="card col-xxl-4 col-md-6">
            <img src="${game.thumbnail}" class="card-img" alt="${game.title}">
            <div class="card-body">
                <h5 class="card-title">${game.title}</h5>
                <p class="card-text">${game.short_description}</p>
                <p class="card-price">Price: <span class="green">$${game.price}</span></p>
                <a href="views/product_detail.html?id=${game.id}" class="btn btn-primary">See More</a>
                <button class="btn btn-primary" onclick="CartLocalStorage('${game.title}')">Add to Cart</button>
            </div>
        </div>
        `;
    }
    );


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
    let response = await fetch('data/prices.json');

    if (!response.ok) {
        cartTotal.innerHTML = `
        <p>An error ocurred loading the prices</p>
        <a href="index.html" class="btn btn-primary">Reload</a>
        `;
        return;
    }
    let prices = await response.json();
    let cartItems = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];
    let total = 0;
    cartItems.forEach(item => {
        prices.forEach(price => {
            if(item == price.title){
                price.price = parseInt(price.price);
                total = price.price + total;
            }
        });
    }
    );
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


