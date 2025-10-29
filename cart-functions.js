

class CartPage {
    constructor() {
        this.cart = window.ShoppingCart;
        this.init();
    }

    init() {
        this.renderCart();
        this.setupEventListeners();
    }

    renderCart() {
        const cartContainer = document.getElementById('cart-container');
        const cartAddSection = document.getElementById('cart-add');
        const emptyCartSection = document.getElementById('empty-cart');
        const cartItems = this.cart.getCartItems();

        if (cartItems.length === 0) {
            cartContainer.innerHTML = '';
            cartAddSection.style.display = 'none';
            emptyCartSection.style.display = 'block';
            return;
        }

        emptyCartSection.style.display = 'none';
        cartAddSection.style.display = 'flex';

        let cartHTML = `
            <table width="100%">
                <thead>
                    <tr>
                        <td>Remove</td>
                        <td>Image</td>
                        <td>Product</td>
                        <td>Price</td>
                        <td>Quantity</td>
                        <td>Subtotal</td>
                    </tr>
                </thead>
                <tbody>
        `;

        cartItems.forEach(item => {
            const subtotal = item.price * item.quantity;
            cartHTML += `
                <tr data-product-id="${item.id}">
                    <td><a href="#" class="remove-item"><i class="far fa-times-circle"></i></a></td>
                    <td><img src="${item.image}" alt="${item.name}"></td>
                    <td>${item.name}</td>
                    <td>$${item.price}</td>
                    <td>
                        <div class="quantity-controls">
                            <button class="quantity-btn minus" data-product-id="${item.id}">-</button>
                            <input type="number" value="${item.quantity}" min="1" class="quantity-input" data-product-id="${item.id}">
                            <button class="quantity-btn plus" data-product-id="${item.id}">+</button>
                        </div>
                    </td>
                    <td class="item-subtotal">$${subtotal}</td>
                </tr>
            `;
        });

        cartHTML += `
                </tbody>
            </table>
        `;

        cartContainer.innerHTML = cartHTML;
        this.updateCartTotals();
    }

    updateCartTotals() {
        const cartItems = this.cart.getCartItems();
        const subtotal = this.cart.getCartTotal();
        const shipping = 15; // Fixed shipping cost
        const tax = subtotal * 0.08; // 8% tax
        const total = subtotal + shipping + tax;

        document.getElementById('cart-subtotal').textContent = `$${subtotal.toFixed(2)}`;
        document.getElementById('shipping-cost').textContent = `$${shipping.toFixed(2)}`;
        document.getElementById('tax-amount').textContent = `$${tax.toFixed(2)}`;
        document.getElementById('cart-total').textContent = `$${total.toFixed(2)}`;
    }

    setupEventListeners() {
        // Remove item
        document.addEventListener('click', (e) => {
            if (e.target.closest('.remove-item')) {
                e.preventDefault();
                const productId = e.target.closest('tr').dataset.productId;
                this.cart.removeFromCart(productId);
                this.renderCart();
            }
        });

        // Quantity controls
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('quantity-btn')) {
                const productId = e.target.dataset.productId;
                const input = document.querySelector(`.quantity-input[data-product-id="${productId}"]`);
                let quantity = parseInt(input.value);

                if (e.target.classList.contains('plus')) {
                    quantity++;
                } else if (e.target.classList.contains('minus') && quantity > 1) {
                    quantity--;
                }

                input.value = quantity;
                this.updateItemQuantity(productId, quantity);
            }
        });

        // Quantity input change
        document.addEventListener('change', (e) => {
            if (e.target.classList.contains('quantity-input')) {
                const productId = e.target.dataset.productId;
                const quantity = parseInt(e.target.value);
                
                if (quantity < 1) {
                    e.target.value = 1;
                    this.updateItemQuantity(productId, 1);
                } else {
                    this.updateItemQuantity(productId, quantity);
                }
            }
        });

        // Coupon application
        document.getElementById('apply-coupon').addEventListener('click', () => {
            this.applyCoupon();
        });

        // Checkout button
        document.getElementById('checkout-btn').addEventListener('click', () => {
            this.proceedToCheckout();
        });
    }

    updateItemQuantity(productId, quantity) {
        this.cart.updateQuantity(productId, quantity);
        this.updateItemSubtotal(productId);
        this.updateCartTotals();
    }

    updateItemSubtotal(productId) {
        const item = this.cart.getCartItems().find(item => item.id === productId);
        if (item) {
            const subtotal = item.price * item.quantity;
            const subtotalElement = document.querySelector(`tr[data-product-id="${productId}"] .item-subtotal`);
            if (subtotalElement) {
                subtotalElement.textContent = `$${subtotal}`;
            }
        }
    }

    applyCoupon() {
        const couponCode = document.getElementById('coupon-code').value;
        // Add your coupon logic here
        alert('Coupon functionality would be implemented here!');
    }

    proceedToCheckout() {
        if (this.cart.getCartItems().length === 0) {
            alert('Your cart is empty!');
            return;
        }
        alert('Proceeding to checkout! This would redirect to a checkout page.');
        // window.location.href = 'checkout.html';
    }
}

// Initialize cart page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CartPage();
});