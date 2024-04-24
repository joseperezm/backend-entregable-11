document.addEventListener('DOMContentLoaded', function() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const cartLink = document.querySelector('.nav-link[href*="/carts/"]');
    const href = cartLink.getAttribute('href');
    const cartId = href.split('/carts/')[1];

    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-product-id');
            const quantityInput = document.getElementById(`quantity-${productId}`);
            const quantity = quantityInput ? quantityInput.value : 1;

            fetch(`/api/carts/${cartId}/product/${productId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ quantity: quantity })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Producto añadido al carrito con éxito');
                } else {
                    alert(data.message || 'Error al añadir el producto al carrito');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('No se pudo añadir el producto al carrito.');
            });
        });
    });
});