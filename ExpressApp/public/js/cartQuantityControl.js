document.addEventListener("DOMContentLoaded", () => {
    // Handle increment and decrement actions
    const updateCartItemQuantity = async (productId, quantity) => {
        const response = await fetch('/cart/update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ productId, quantity }),
        });

        const result = await response.json();
        if (result.success) {
            // Update the quantity displayed in the input field
            const quantityInput = document.querySelector(`[data-product-id="${productId}"]`);
            quantityInput.value = result.updatedQuantity;

            // Update the total price on the page
            document.querySelectorAll('.total-price').forEach((el) => {
                el.textContent = result.totalPrice;
            });
        } else {
            alert("Error updating quantity");
        }
    };

    // Event listener for increment and decrement buttons
    document.querySelectorAll('.qty-btn').forEach(button => {
        button.addEventListener('click', async (event) => {
            const button = event.target;
            const productId = button.getAttribute('data-product-id');
            const quantityInput = document.querySelector(`[data-product-id="${productId}"]`);
            let quantity = parseInt(quantityInput.value, 10);

            // Handle increment and decrement
            if (button.classList.contains('increment')) {
                quantity++;
            } else if (button.classList.contains('decrement')) {
                quantity = Math.max(1, quantity - 1);
            }

            // Update the cart item quantity on the server and the UI
            await updateCartItemQuantity(productId, quantity);
        });
    });
});
