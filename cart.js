$(document).ready(function() {
    // Page loader
    setTimeout(function() {
        $('.page-loader').fadeOut('slow');
    }, 600);
    
    // Load cart items
    loadCartItems();
    
    // Function to load cart items
    function loadCartItems() {
        const cart = JSON.parse(localStorage.getItem('carryClubCart')) || [];
        const cartContainer = $('#cart-container');
        
        if (cart.length === 0) {
            // Display empty cart message
            cartContainer.html(`
                <div class="empty-cart-container text-center py-5">
                    <i class="fas fa-shopping-cart fa-4x mb-4 text-muted"></i>
                    <h3>Your cart is empty</h3>
                    <p class="mb-4">Looks like you haven't added any items to your cart yet.</p>
                    <a href="index.html#products" class="btn btn-colour">Continue Shopping</a>
                </div>
            `);
        } else {
            // Calculate subtotal
            let subtotal = 0;
            cart.forEach(item => {
                const price = parseFloat(item.price.replace('$', ''));
                subtotal += price * item.quantity;
            });
            
            // Calculate tax and total
            const tax = subtotal * 0.08; // 8% tax
            const total = subtotal + tax;
            
            // Create cart HTML
            let cartHTML = `
                <div class="table-responsive mb-4">
                    <table class="table table-hover">
                        <thead class="table-dark">
                            <tr>
                                <th>Product</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Total</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
            `;
            
            // Add cart items
            cart.forEach((item, index) => {
                const price = parseFloat(item.price.replace('$', ''));
                const itemTotal = price * item.quantity;
                
                cartHTML += `
                    <tr class="cart-item" data-index="${index}">
                        <td>
                            <div class="d-flex align-items-center">
                                <img src="${item.image}" alt="${item.name}" style="width: 80px; height: 80px; object-fit: cover;" class="me-3">
                                <h5 class="mb-0">${item.name}</h5>
                            </div>
                        </td>
                        <td>${item.price}</td>
                        <td>
                            <div class="quantity-control d-flex align-items-center">
                                <button class="btn btn-sm btn-outline-secondary quantity-btn decrease-btn">-</button>
                                <span class="mx-2">${item.quantity}</span>
                                <button class="btn btn-sm btn-outline-secondary quantity-btn increase-btn">+</button>
                            </div>
                        </td>
                        <td>$${itemTotal.toFixed(2)}</td>
                        <td>
                            <button class="btn btn-sm btn-danger remove-item">
                                <i class="fas fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                `;
            });
            
            cartHTML += `
                        </tbody>
                    </table>
                </div>
                
                <div class="row">
                    <div class="col-md-6 mb-4 mb-md-0">
                        <div class="card">
                            <div class="card-body">
                                <h4 class="card-title">Have a Coupon?</h4>
                                <div class="input-group mb-3">
                                    <input type="text" class="form-control" placeholder="Enter coupon code">
                                    <button class="btn btn-outline-secondary" type="button" id="apply-coupon">Apply</button>
                                </div>
                                <div class="mt-3">
                                    <h5>Shipping Options</h5>
                                    <div class="form-check">
                                        <input class="form-check-input" type="radio" name="shipping" id="standard-shipping" checked>
                                        <label class="form-check-label" for="standard-shipping">
                                            Standard Shipping (3-5 business days) - Free
                                        </label>
                                    </div>
                                    <div class="form-check">
                                        <input class="form-check-input" type="radio" name="shipping" id="express-shipping">
                                        <label class="form-check-label" for="express-shipping">
                                            Express Shipping (1-2 business days) - $15.00
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="card">
                            <div class="card-body">
                                <h4 class="card-title">Order Summary</h4>
                                <div class="d-flex justify-content-between mb-2">
                                    <span>Subtotal:</span>
                                    <span>$${subtotal.toFixed(2)}</span>
                                </div>
                                <div class="d-flex justify-content-between mb-2">
                                    <span>Tax (8%):</span>
                                    <span>$${tax.toFixed(2)}</span>
                                </div>
                                <div class="d-flex justify-content-between mb-2">
                                    <span>Shipping:</span>
                                    <span>Free</span>
                                </div>
                                <hr>
                                <div class="d-flex justify-content-between mb-3">
                                    <strong>Total:</strong>
                                    <strong>$${total.toFixed(2)}</strong>
                                </div>
                                <div class="d-grid">
                                    <button class="btn btn-colour btn-checkout">Proceed to Checkout</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="text-center mt-4">
                    <a href="index.html#products" class="btn btn-outline-secondary">
                        <i class="fas fa-arrow-left me-2"></i> Continue Shopping
                    </a>
                </div>
            `;
            
            cartContainer.html(cartHTML);
            
            // Handle quantity increase
            $('.increase-btn').on('click', function() {
                const index = $(this).closest('.cart-item').data('index');
                cart[index].quantity += 1;
                localStorage.setItem('carryClubCart', JSON.stringify(cart));
                loadCartItems(); // Reload cart
                
                // Add animation
                $(this).addClass('bounce');
                setTimeout(() => {
                    $(this).removeClass('bounce');
                }, 500);
            });
            
            // Handle quantity decrease
            $('.decrease-btn').on('click', function() {
                const index = $(this).closest('.cart-item').data('index');
                if (cart[index].quantity > 1) {
                    cart[index].quantity -= 1;
                    localStorage.setItem('carryClubCart', JSON.stringify(cart));
                    loadCartItems(); // Reload cart
                }
                
                // Add animation
                $(this).addClass('bounce');
                setTimeout(() => {
                    $(this).removeClass('bounce');
                }, 500);
            });
            
            // Handle item removal
            $('.remove-item').on('click', function() {
                const index = $(this).closest('.cart-item').data('index');
                
                // Animate removal
                $(this).closest('.cart-item').animate({
                    opacity: 0,
                    height: 0,
                    padding: 0
                }, 500, function() {
                    // Remove from cart array
                    cart.splice(index, 1);
                    localStorage.setItem('carryClubCart', JSON.stringify(cart));
                    loadCartItems(); // Reload cart
                });
            });
            
            // Handle checkout button
            $('.btn-checkout').on('click', function() {
                alert('Thank you for your order! This would proceed to the checkout page.');
                // Clear cart for demo purposes
                localStorage.removeItem('carryClubCart');
                loadCartItems();
            });
            
            // Handle coupon application
            $('#apply-coupon').on('click', function() {
                const couponCode = $(this).prev('input').val().trim();
                if (couponCode) {
                    // Show success message
                    $(this).closest('.card-body').append('<div class="alert alert-success mt-3">Coupon applied successfully!</div>');
                    
                    // Remove message after delay
                    setTimeout(function() {
                        $('.alert').fadeOut(function() {
                            $(this).remove();
                        });
                    }, 3000);
                }
            });
        }
    }
    
    // Update cart count badge
    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('carryClubCart')) || [];
        const count = cart.reduce((total, item) => total + item.quantity, 0);
        
        // Create or update cart count badge
        if ($('.cart-count').length === 0) {
            $('.navbar-nav').append('<span class="cart-count">' + count + '</span>');
        } else {
            $('.cart-count').text(count);
        }
        
        // Show/hide based on count
        if (count > 0) {
            $('.cart-count').show();
        } else {
            $('.cart-count').hide();
        }
    }
    
    // Initialize cart count on page load
    updateCartCount();
    
    // Add to cart functionality for related products
    $('.btn-colour').on('click', function(e) {
        if ($(this).text() === 'Add to Cart') {
            e.preventDefault();
            
            // Get product details
            const card = $(this).closest('.card');
            const productName = card.find('.card-title').text();
            const productPrice = card.find('.fw-bold').text();
            const productImage = card.find('img').attr('src');
            
            // Store in localStorage
            const cartItem = {
                name: productName,
                price: productPrice,
                image: productImage,
                quantity: 1
            };
            
            let cart = JSON.parse(localStorage.getItem('carryClubCart')) || [];
            
            // Check if product already exists in cart
            const existingItemIndex = cart.findIndex(item => item.name === productName);
            if (existingItemIndex > -1) {
                cart[existingItemIndex].quantity += 1;
            } else {
                cart.push(cartItem);
            }
            
            localStorage.setItem('carryClubCart', JSON.stringify(cart));
            
            // Show animation
            $(this).html('<i class="fas fa-check"></i> Added!');
            
            // Create and animate the cart notification
            const notification = $('<div class="cart-notification">Item added to cart!</div>');
            $('body').append(notification);
            notification.animate({
                top: '20px',
                opacity: 1
            }, 500).delay(2000).animate({
                top: '0px',
                opacity: 0
            }, 500, function() {
                $(this).remove();
            });
            
            // Reset button text after delay
            setTimeout(() => {
                $(this).html('Add to Cart');
            }, 2000);
            
            // Update cart count
            updateCartCount();
            
            // Reload cart items if we're on the cart page
            loadCartItems();
        }
    });
});