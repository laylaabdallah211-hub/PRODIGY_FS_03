// cart.js - Cart functionality using localStorage
class ShoppingCart {
    constructor() {
        this.cart = this.getCartFromStorage();
        this.init();
    }

    init() {
        this.updateCartIcon();
        this.setupEventListeners();
    }

    getCartFromStorage() {
        const cart = localStorage.getItem('laylaJewelryCart');
        return cart ? JSON.parse(cart) : [];
    }

    saveCartToStorage() {
        localStorage.setItem('laylaJewelryCart', JSON.stringify(this.cart));
    }

    addToCart(productId, productName, productPrice, productImage, quantity = 1) {
        const existingItem = this.cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.cart.push({
                id: productId,
                name: productName,
                price: productPrice,
                image: productImage,
                quantity: quantity
            });
        }
        
        this.saveCartToStorage();
        this.updateCartIcon();
        this.showAddToCartAnimation();
    }

    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCartToStorage();
        this.updateCartIcon();
        return this.cart;
    }

    updateQuantity(productId, quantity) {
        const item = this.cart.find(item => item.id === productId);
        if (item) {
            item.quantity = quantity;
            this.saveCartToStorage();
            this.updateCartIcon();
        }
        return this.cart;
    }

    getCartItems() {
        return this.cart;
    }

    getCartTotal() {
        return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    getCartCount() {
        return this.cart.reduce((count, item) => count + item.quantity, 0);
    }

    clearCart() {
        this.cart = [];
        this.saveCartToStorage();
        this.updateCartIcon();
    }

    updateCartIcon() {
        const cartIcons = document.querySelectorAll('#lg-bag, #mobile a[href="cart.html"]');
        const cartCount = this.getCartCount();
        
        cartIcons.forEach(icon => {
            // Remove existing badge
            const existingBadge = icon.querySelector('.cart-badge');
            if (existingBadge) {
                existingBadge.remove();
            }
            
            // Add new badge if items in cart
            if (cartCount > 0) {
                const badge = document.createElement('span');
                badge.className = 'cart-badge';
                badge.textContent = cartCount;
                icon.style.position = 'relative';
                icon.appendChild(badge);
            }
        });
    }

    showAddToCartAnimation() {
        // Create animation element
        const animation = document.createElement('div');
        animation.className = 'add-to-cart-animation';
        animation.innerHTML = '✓ Added to Cart!';
        document.body.appendChild(animation);

        // Trigger animation
        setTimeout(() => {
            animation.classList.add('show');
        }, 10);

        // Remove animation after delay
        setTimeout(() => {
            animation.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(animation);
            }, 300);
        }, 2000);
    }

    setupEventListeners() {
        // Add to cart buttons
        document.addEventListener('click', (e) => {
            if (e.target.closest('.add-to-cart')) {
                e.preventDefault();
                const productElement = e.target.closest('.pro');
                const productId = productElement.dataset.productId;
                const productName = productElement.dataset.productName;
                const productPrice = parseFloat(productElement.dataset.productPrice);
                const productImage = productElement.dataset.productImage;

                this.addToCart(productId, productName, productPrice, productImage);
            }
        });
    }
}

// Initialize cart
const cart = new ShoppingCart();

// Export for use in other files
window.ShoppingCart = cart;