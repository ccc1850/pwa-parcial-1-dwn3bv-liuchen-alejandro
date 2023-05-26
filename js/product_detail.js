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


/* CONSEGUIR EL ID DEL ITEM DESDE LA URL */
const producto = new URLSearchParams(window.location.search);
let itemId = producto.get('id');
itemId = parseInt(itemId);

/* DEFINIR LA API DEL DETALLE DE JUEGO ESPECIFICO */
let url = `https://free-to-play-games-database.p.rapidapi.com/api/game?id=${itemId}`;
let options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': 'c4f9300751msh3ab7447fd37a570p1f7429jsn47187edf1fb6',
		'X-RapidAPI-Host': 'free-to-play-games-database.p.rapidapi.com'
	}
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

    let prices = await fetch('../data/prices.json');

    if (!prices.ok) {
      gameContainer.innerHTML += `
      <div class="col-12 text-center">
          <h1>An error ocurred</h1>
          <a href="index.html" class="btn btn-primary">Reload</a>
      </div>
      `;
      return;
    }

    let pricesJson = await prices.json();

    let flag = false;

    pricesJson.forEach(price => {
      if (price.id == game.id) {
        game.price = price.price;
        flag = true;
      }
    });

    if (!flag) {
      gameContainer.innerHTML += `
      <div class="col-12 text-center">
          <h1>This Game isn't available in our store</h1>
          <a href="index.html" class="btn btn-primary">Back to Home</a>
      </div>
      `;

      let commentContainer = document.getElementById('comment-container');
      commentContainer.innerHTML = '';


      return;
    }

        


    gameContainer.innerHTML += `
    <div class="details col-8 d-flex flex-column text-center">
        <img src="${game.thumbnail}" class="det-img" alt="${game.title}">
        <div class="det-body">
            <h1 class="det-title">${game.title}</h1>
            <p class="det-text">${game.short_description}</p>
            <p class="det-price">Price: <span class="green">$${game.price}</span></p>
            <a href="${game.game_url}" class="btn btn-primary">Game Website</a> </br>
            <button class="btn btn-primary" onclick="CartLocalStorage('${game.title}')">Add to Cart</button>
        </div>
    </div>
    `;



}

GameDetail();

/* FUNCION QUE CONSTRUYE EL FORMULARIO PARA COMENTARIOS */
const CommentForm = () => {
    let commentContainer = document.getElementById('comment-container');
    let formDiv = document.createElement('div');
    formDiv.classList.add('form');
    commentContainer.appendChild(formDiv);

    formDiv.innerHTML += `
    <form id="commentForm">

    <h2>Add a comment</h2>

    <label for="author">Your Name:</label>
    <input type="text" id="author" name="author" required>

    <label for="comment">Comment:</label>
    <textarea id="comment" name="comment"  required></textarea>

    <button type="button" class="btn btn-secondary submit-btn" onclick="AddComment()">Submit</button>
    </form>
  `;
}
CommentForm();

/* FUNCION QUE MUESTRA LOS COMENTARIOS EN LA PAGINA DE DETALLES */
const Comments = () => {
    let comments = JSON.parse(localStorage.getItem('comments')) ? JSON.parse(localStorage.getItem('comments')) : {};

    let commentContainer = document.getElementById('comment-container');

    let commentsDiv = document.createElement('div');
    commentsDiv.classList.add('comments');
    commentContainer.appendChild(commentsDiv);

    let h2 = document.createElement('h2');
    h2.innerHTML = 'Comments';
    h2.classList.add('text-center');
    commentsDiv.appendChild(h2);

    if (comments.games) {
        for (let game of comments.games) {
          if (game.id == itemId) {
            for (let comment of game.comments) {
              let commentDiv = document.createElement('div');
              commentDiv.classList.add('comment');
              let createAuthor = document.createElement('h3');
              createAuthor.innerHTML = `Author: ${comment.author}`;
              commentDiv.appendChild(createAuthor);
              let createComment = document.createElement('p');
              createComment.innerHTML = comment.comment;
              commentDiv.appendChild(createComment);
              commentsDiv.appendChild(commentDiv);
            }
          }
        }
      }


}

Comments();

/* FUNCION QUE AGREGA NUEVOS COMENTARIOS */
const AddComment = () => {

    let comments = JSON.parse(localStorage.getItem('comments')) ? JSON.parse(localStorage.getItem('comments')) : {};
    let author = document.getElementById('author').value;
    let comment = document.getElementById('comment').value;
    let newComment = {
        "author": author,
        "comment": comment
    };

    if (comments.games) {
        let foundGame = false;
        for (let game of comments.games) {
          if (game.id == itemId) {
            game.comments.push(newComment);
            foundGame = true;
            break;
          }
        }
        if (!foundGame) {
          let newGame = {
            id: itemId,
            comments: [newComment]
          };
          comments.games.push(newGame);
        }
      } else {
        let newGame = {
          id: itemId,
          comments: [newComment]
        };
        comments.games = [newGame];
      }

    localStorage.setItem('comments', JSON.stringify(comments));
    let commentsDiv = document.querySelector('.comments');
    commentsDiv.remove();
    Comments();
    document.getElementById('commentForm').reset();


}



/* FUNCIONES CARRITO */

/* FUNCION QUE CARGA LOS ITEMS GUARDADOS EN EL CARRITO DE LOCAL STORAGE AL CARRITO */
const LoadCartItems = () => {
    let items = document.getElementsByClassName('cart-items')[0]; 
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
    let response = await fetch('../data/prices.json');

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
        cart.push(item);
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
        console.log('Item added to cart:', item);
    }
}


