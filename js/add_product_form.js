document.getElementById('productForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const url = 'https://www.dvgame.store/wp-json/wc/v3/products?consumer_key=ck_abf915fddd29f466658601d0f0651dfc25f34928&consumer_secret=cs_e0a0f5526c5813d8a02751b412010541c65a9a11'
    const formData = new FormData(event.target);
      const productData = {
        name: formData.get('name'),
        regular_price: formData.get('price'),
        price: formData.get('price'),
        description: formData.get('description'),
        images: [
            {
                src: formData.get('image'),
            }
        ]
      };
      console.log(productData);

      fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      })
        .then(response => response.json())
        .then(data => {
          console.log('Product created:', data);
          // Perform any additional actions or show success message
        })
        .catch(error => console.error(error));
  });



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
  
  