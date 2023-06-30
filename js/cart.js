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
  
  
  
  