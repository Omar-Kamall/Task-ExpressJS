const API_BASE_URL = 'http://localhost:5050';

// Authentication Functions
async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        const response = await fetch(`${API_BASE_URL}/api/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) throw new Error('Login failed');

        const data = await response.json();
        localStorage.setItem('token', data.token);
        window.location.href = 'products.html';
    } catch (error) {
        alert('Login failed. Please check your credentials.');
    }
}

async function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    try {
        const response = await fetch(`${API_BASE_URL}/api/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });

        if (!response.ok) throw new Error('Registration failed');

        alert('Registration successful! Please login.');
        window.location.href = 'index.html';
    } catch (error) {
        alert('Registration failed. Please try again.');
    }
}

// Product Functions
async function getProducts(searchTerm = '') {
    try {
        const response = await fetch(`${API_BASE_URL}/api/products`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (response.status === 401) {
            localStorage.removeItem('token');
            window.location.href = 'index.html';
            return;
        }

        const products = await response.json();
        const filteredProducts = searchTerm
            ? products.filter(product =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.description?.toLowerCase().includes(searchTerm.toLowerCase())
            )
            : products;

        displayProducts(filteredProducts);
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

function displayProducts(products) {
    const grid = document.getElementById('products-grid');
    if (!grid) return;

    grid.innerHTML = '';
    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <h3>${product.name}</h3>
            <p class="category">${product.category}</p>
            <p class="price">$${product.price}</p>
            <p class="description">${product.description || 'No description'}</p>
            <div class="product-actions">
                <button onclick="editProduct('${product._id}')">Edit</button>
                <button onclick="deleteProduct('${product._id}')">Delete</button>
            </div>
        `;
        grid.appendChild(card);
    });
}

async function handleAddProduct(e) {
    e.preventDefault();
    const productData = {
        name: document.getElementById('product-name').value,
        price: document.getElementById('product-price').value,
        category: document.getElementById('product-category').value,
        description: document.getElementById('product-description').value
    };

    try {
        const response = await fetch(`${API_BASE_URL}/api/addProduct`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(productData)
        });

        if (!response.ok) throw new Error('Failed to add product');

        alert('Product added successfully!');
        window.location.href = 'products.html';
    } catch (error) {
        alert('Failed to add product. Please try again.');
    }
}

async function editProduct(productId) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/product/${productId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const product = await response.json();

        // Redirect to dashboard with product data
        localStorage.setItem('editProduct', JSON.stringify(product));
        window.location.href = 'dashboard.html?edit=true';
    } catch (error) {
        alert('Failed to fetch product details.');
    }
}

async function deleteProduct(productId) {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
        const response = await fetch(`${API_BASE_URL}/api/deleteProduct/${productId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) throw new Error('Failed to delete product');

        alert('Product deleted successfully!');
        getProducts();
    } catch (error) {
        alert('Failed to delete product.');
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const isAuthPage = window.location.pathname.includes('index.html') || 
                      window.location.pathname.includes('register.html');

    if (!token && !isAuthPage) {
        window.location.href = 'index.html';
        return;
    }

    if (token && isAuthPage) {
        window.location.href = 'products.html';
        return;
    }

    // Add event listeners based on current page
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const productForm = document.getElementById('product-form');
    const searchInput = document.getElementById('search-products');
    const logoutBtn = document.getElementById('logout-btn');

    if (loginForm) loginForm.addEventListener('submit', handleLogin);
    if (registerForm) registerForm.addEventListener('submit', handleRegister);
    if (productForm) {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('edit') === 'true') {
            const editProduct = JSON.parse(localStorage.getItem('editProduct'));
            if (editProduct) {
                document.getElementById('product-name').value = editProduct.name;
                document.getElementById('product-price').value = editProduct.price;
                document.getElementById('product-category').value = editProduct.category;
                document.getElementById('product-description').value = editProduct.description || '';
                productForm.onsubmit = async (e) => {
                    e.preventDefault();
                    try {
                        const response = await fetch(`${API_BASE_URL}/api/editProduct/${editProduct._id}`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${localStorage.getItem('token')}`
                            },
                            body: JSON.stringify({
                                name: document.getElementById('product-name').value,
                                price: document.getElementById('product-price').value,
                                category: document.getElementById('product-category').value,
                                description: document.getElementById('product-description').value
                            })
                        });

                        if (!response.ok) throw new Error('Failed to update product');

                        alert('Product updated successfully!');
                        localStorage.removeItem('editProduct');
                        window.location.href = 'products.html';
                    } catch (error) {
                        alert('Failed to update product.');
                    }
                };
            }
        } else {
            productForm.addEventListener('submit', handleAddProduct);
        }
    }
    if (searchInput) searchInput.addEventListener('input', (e) => getProducts(e.target.value));
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('token');
            window.location.href = 'index.html';
        });
    }

    // Load products if on products page
    if (window.location.pathname.includes('products.html')) {
        getProducts();
    }
});