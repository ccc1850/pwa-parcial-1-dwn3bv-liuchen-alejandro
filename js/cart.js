/* FUNCIONES CARRITO */

const UpdateCartTotal = () => {
    let cart = JSON.parse(localStorage.getItem('cart')) ? JSON.parse(localStorage.getItem('cart')) : [];
    let price = 0;
    cart.forEach(game => {
        price = price + parseInt(game[1]);
    });
    const cartTotal = document.querySelector('.cart-total-price');
    cartTotal.innerHTML = `$${price}`;
    };


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
        emptyCart.textContent = "Tu carrito esta vacio";
        cartList.appendChild(emptyCart);
      } else {
        cart.forEach(game => {
          const cartItem = document.createElement("div");
          cartItem.className = "cart-item";
          cartItem.innerHTML = `
          <div class="column"><p class="cart-item-title">${game[0]}</p></div>
          <div class="column"><p class="cart-item-price">$${game[1]}</p></div>
          <div class="column"><button class="btn btn-danger" onclick="RemoveFromCart('${game[0]}')">Remover</button></div>
          `;
          cartList.appendChild(cartItem);
        });
      }
    }
    cart = JSON.parse(localStorage.getItem('cart')) || [];
    UpdateCartTotal();
  };
  
  
  const CartOverlay = () => {
    const overlay = document.createElement("div");
    overlay.className = "overlay";
  
    const cartContent = document.createElement("div");
    cartContent.className = "cart-content";
  
    const cartTitle = document.createElement("p");
    cartTitle.className = "cart-title";
    cartTitle.textContent = "Tu Carrito";
    cartContent.appendChild(cartTitle);
  
    const cartList = document.createElement("div");
    cartList.className = "cart-list";
    
    let cart = JSON.parse(localStorage.getItem('cart')) ? JSON.parse(localStorage.getItem('cart')) : [];
    if(cart.length === 0) {
      const emptyCart = document.createElement("p");
      emptyCart.className = "empty-cart";
      emptyCart.textContent = "Tu carrito esta vacio";
      cartContent.appendChild(emptyCart);
    } 
    else {
      cart.forEach(game => {
        const cartItem = document.createElement("div");
        cartItem.className = "cart-item";
        cartItem.innerHTML = `
          <div class="column"><p class="cart-item-title">${game[0]}</p></div>
          <div class="column"><p class="cart-item-price">$${game[1]}</p></div>
          <div class="column"><button class="btn btn-danger" onclick="RemoveFromCart('${game[0]}')">Remover</button></div>
        `;
        cartList.appendChild(cartItem);
      });
      cartContent.appendChild(cartList);
    }

    const cartTotal = document.createElement("div");
    cartTotal.className = "cart-total";
    price = 0;
    let priceTotal = cart.forEach(game => {
        price = price + parseInt(game[1]);
    });
    cartTotal.innerHTML = `
        <div class="column"><p class="cart-total-title">Total</p></div>
        <div class="column"><p class="cart-total-price">$${price}</p></div>
    `;
    cartContent.appendChild(cartTotal);
  
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
    cart.push(detailsForCart);
    localStorage.setItem('cart', JSON.stringify(cart));
    CartOverlay();
    notification(detailsForCart[0]);
  }
  

  