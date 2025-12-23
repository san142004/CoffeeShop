document.addEventListener('DOMContentLoaded', async () => {
    // 1. Check for token
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.href = '/login';
        return;
    }

    // 2. Setup Logout
    document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Optional: clear cart on logout?
        // localStorage.removeItem('cartItems'); 
        window.location.href = '/';
    });

    // 3. Fetch Dashboard Data
    try {
        const response = await fetch('/api/dashboard', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            const user = data.user;

            // Update UI
            document.getElementById('user-name').textContent = user.username;
            document.getElementById('nav-username').textContent = `Hello, ${user.username}`;
            document.getElementById('user-email').textContent = user.email;

            // Set initials
            const initial = user.username.charAt(0).toUpperCase();
            document.getElementById('avatar-initials').textContent = initial;

            // Set member since
            if (user.createdAt) {
                const date = new Date(user.createdAt).toLocaleDateString();
                document.getElementById('member-since').textContent = date;
            } else {
                document.getElementById('member-since').textContent = 'N/A';
            }

            // 4. Render Cart Items & Price Details
            renderCart();

            // Function to render cart and calculate price
            function renderCart() {
                const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
                const cartContainer = document.getElementById('cart-container');

                // Price Elements
                const totalItemsEl = document.getElementById('total-items');
                const totalMrpEl = document.getElementById('total-mrp');
                const totalDiscountEl = document.getElementById('total-discount');
                const finalTotalEl = document.getElementById('final-total');
                const totalSavingsEl = document.getElementById('total-savings');

                if (cartItems.length === 0) {
                    cartContainer.innerHTML = '<div class="text-center p-5"><img src="https://rukminim2.flixcart.com/www/800/800/promos/16/05/2019/d438a32e-765a-4d8b-b4a6-520b560971e8.png?q=90" width="200"><p class="mt-3 text-muted">Your cart is empty!</p><a href="/#PRODUCTS" class="btn btn-primary mt-2">Shop Now</a></div>';
                    // Reset Price Details
                    totalItemsEl.textContent = '0';
                    totalMrpEl.textContent = '$0';
                    totalDiscountEl.textContent = '-$0';
                    finalTotalEl.textContent = '$0';
                    totalSavingsEl.textContent = '$0';
                    return;
                }

                let totalMrp = 0;
                let totalDiscount = 0;
                const COUPOUN_DISCOUNT = 50;
                const PROTECT_FEE = 2;

                cartContainer.innerHTML = '';

                cartItems.forEach((item, index) => {
                    // Extract numerical price from string "$25" -> 25
                    let sellPrice = parseFloat(item.price.replace('$', '')) || 0;
                    // Simulate a higher MRP (Market Retail Price) to show discount
                    let mrp = sellPrice + 15;
                    let discount = mrp - sellPrice;

                    totalMrp += mrp;
                    totalDiscount += discount;

                    const row = document.createElement('div');
                    row.className = 'd-flex p-3 border-bottom bg-white';
                    row.innerHTML = `
                        <div class="me-3" style="width: 120px; height: 120px; flex-shrink: 0;">
                            <img src="${item.image}" style="width: 100%; height: 100%; object-fit: contain;">
                        </div>
                        <div class="flex-grow-1">
                            <h6 class="mb-1 text-dark fw-bold">${item.title}</h6>
                            <small class="text-muted d-block mb-2">Seller: RetailNet</small>
                            <div class="d-flex align-items-center mb-2">
                                <span class="text-muted text-decoration-line-through me-2 small">$${mrp}</span>
                                <span class="fw-bold fs-5 me-2">${item.price}</span>
                                <span class="text-success small fw-bold">30% Off</span>
                            </div>
                            <button class="btn btn-link text-decoration-none fw-bold p-0 text-dark remove-btn" data-index="${index}">REMOVE</button>
                        </div>
                    `;
                    cartContainer.appendChild(row);
                });

                // Calculate Totals
                const finalAmount = totalMrp - totalDiscount - COUPOUN_DISCOUNT + PROTECT_FEE;
                const totalSavings = totalDiscount + COUPOUN_DISCOUNT;

                // Update UI
                totalItemsEl.textContent = cartItems.length;
                totalMrpEl.textContent = `$${totalMrp}`;
                totalDiscountEl.textContent = `-$${totalDiscount}`;
                finalTotalEl.textContent = `$${finalAmount}`;
                totalSavingsEl.textContent = `$${totalSavings}`;

                // Add Event Listeners for Remove Buttons
                document.querySelectorAll('.remove-btn').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const index = e.target.getAttribute('data-index');
                        removeFromCart(index);
                    });
                });
            }

            function removeFromCart(index) {
                let cart = JSON.parse(localStorage.getItem('cartItems')) || [];
                cart.splice(index, 1);
                localStorage.setItem('cartItems', JSON.stringify(cart));
                renderCart(); // Re-render
            }
            //product add
            document.getElementById('add-product-btn').addEventListener('click', () => {
                const product = {
                    title: document.getElementById('product-title').value,
                    price: document.getElementById('product-price').value,
                    image: document.getElementById('product-image').value
                };
                const cart = JSON.parse(localStorage.getItem('cartItems')) || [];
                cart.push(product);
                localStorage.setItem('cartItems', JSON.stringify(cart));
                renderCart(); // Re-render
            });

            // Place Order Logic
            document.getElementById('place-order-btn').addEventListener('click', () => {
                const cart = JSON.parse(localStorage.getItem('cartItems')) || [];
                if (cart.length === 0) {
                    alert('Cart is empty!');
                    return;
                }

                alert('Order Placed Successfully!');
                localStorage.removeItem('cartItems');
                renderCart();
            });

            // Show content, hide loading
            document.getElementById('loading').style.display = 'none';
            document.getElementById('dashboard-content').style.display = 'block';
        } else {
            console.error('Failed to fetch dashboard data');
            localStorage.removeItem('token');
            window.location.href = '/';
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please login again.');
        localStorage.removeItem('token');
        window.location.href = '/';
    }
});
