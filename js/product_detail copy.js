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
        


    const detailsContainer = document.querySelector('#game-container');
    
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
    addToCartBtn.addEventListener('click', () => {
      CartLocalStorage(game.title);
    });
    detBody.appendChild(addToCartBtn);
    



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
};

/* FUNCION QUE MUESTRA EL CARRITO Y ACTUALIZA EL PRECIO TOTAL */
const ShowCart = async () => {
  let cart = document.getElementById('cart');
  cart.addEventListener('click', HideCart);
  let innercart = document.getElementById('inner-cart');
  innercart.addEventListener('click', (e) => {
    e.stopPropagation();
  });
  if (cart.style.display == 'none') {
    LoadCartItems();
    cart.style.display = 'block';
  } else {
    cart.style.display = 'none';
  }

  let cartTotal = document.getElementById('cart-total');

  let cartItems = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];
  let total = 0;

  // Make a request to the API to get the updated game prices
  let response = await fetch('https://www.dvgame.store/wp-json/wc/v3/products?consumer_key=ck_abf915fddd29f466658601d0f0651dfc25f34928&consumer_secret=cs_e0a0f5526c5813d8a02751b412010541c65a9a11');
  let games = await response.json();

  cartItems.forEach(item => {
    let game = games.find(g => g.name === item);
    if (game) {
      total += parseFloat(game.price);
    }
  });

  cartTotal.innerHTML = `
    <p>Total: <span class="green">$${total.toFixed(2)}</span></p>
  `;
};

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
const CartLocalStorage = async (item) => {
  let flag = true;
  let cart = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];

  if (cart.length > 0) {
    cart.forEach(game => {
      if (game === item) {
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

  if (flag) {
    let response = await fetch(`https://www.dvgame.store/wp-json/wc/v3/products?search=${item}&consumer_key=ck_abf915fddd29f466658601d0f0651dfc25f34928&consumer_secret=cs_e0a0f5526c5813d8a02751b412010541c65a9a11`);
    let games = await response.json();
    let game = games[0];

    if (game) {
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
};

