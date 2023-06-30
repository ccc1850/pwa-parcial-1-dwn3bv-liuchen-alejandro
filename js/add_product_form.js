document.getElementById('productForm').addEventListener('submit', function(event) {
    event.preventDefault();

    /* VALIDACION DE DATOS DEL FORMULARIO */
    const name = document.getElementById("name").value;
    const price = document.getElementById("price").value;
    const description = document.getElementById("description").value;
    const image = document.getElementById("image").value;


    if (name.length < 5 || name.length > 10) {
      BootstrapAlert("El nombre debe tener entre 5 a 10 digitos", "danger");
      document.querySelector('#name').style.border = "1px solid red";
      setTimeout(function () {
        document.querySelector('#name').style.border = "none";
      }, 3000);
      return;
    }
  
    if (price < 5 || price > 5000000) {
      BootstrapAlert("El precio debe estar entre 5 a 5000000 Pesos", "danger");
      document.querySelector('#price').style.border = "1px solid red";
      setTimeout(function () {
        document.querySelector('#price').style.border = "none";
      }, 3000);
      return;
    }
  
    if (isNaN(parseFloat(price))) {
      BootstrapAlert("El precio debe ser un numero", "danger");
      document.querySelector('#price').style.border = "1px solid red";
      setTimeout(function () {
        document.querySelector('#price').style.border = "none";
      }, 3000);
      return;
    }
  
    if (description.length < 10 || description.length > 5000) {
      BootstrapAlert("La descripcion debe tener entre 10 a 5000 digitos", "danger");
      document.querySelector('#description').style.border = "1px solid red";
      setTimeout(function () {
        document.querySelector('#description').style.border = "none";
      }, 3000);
      return;
    }
  
    if (image === "") {
      BootstrapAlert("Debe ingresar una imagen", "danger");
      document.querySelector('#image').style.border = "1px solid red";
      setTimeout(function () {
        document.querySelector('#image').style.border = "none";
      }, 3000);
      return;
    }



    /* SUBIR EL ITEM A WOOCOMMERCE */

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
          console.log('Success:', data);
            if (data['data'] && data['data']['status']) {
              BootstrapAlert(data['message'], 'danger');
              return;
            } else {
              BootstrapAlert('Producto creado con éxito!', 'success');
            }
            notification(productData.name);
            document.getElementById('productForm').reset();
        })
        .catch(error => {
          BootstrapAlert(error, 'danger');
        });

        
  });

  const BootstrapAlert = (message, type) =>{
    let errorDiv = document.createElement('div');
    errorDiv.classList.add('alert', 'alert-dismissible');
    errorDiv.setAttribute('role', 'alert');
    errorDiv.classList.add(`alert-${type}`);
    errorDiv.innerHTML = `
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>`;
    document.getElementById('productForm').appendChild(errorDiv);
  }

  const notification = (game) => {
    if (Notification.permission === 'granted') {
        let title = 'Creaste un producto!';
        let body = `${game} fue creado en WooCommerce`;
        let notification = new Notification(title, { body });
    } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                let title = 'Creaste un producto!';
                let body = `${game} fue creado en WooCommerce`;
                let notification = new Notification(title, { body });
            }
        });
    }
  }
