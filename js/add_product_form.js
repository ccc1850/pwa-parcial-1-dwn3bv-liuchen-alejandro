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
            console.log('Success:', data);
            notification(productData.name);
            document.getElementById('productForm').reset();
        })
        .catch(error => console.error(error));
  });

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
