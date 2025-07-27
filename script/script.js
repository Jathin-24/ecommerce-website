// DOM Ready
document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const categoryParam = urlParams.get("category");
  const productGrid = document.getElementById("product-grid");
  const priceFilter = document.getElementById("price-filter");

  let filteredProducts = products.filter(p => p.category === categoryParam);

  // ----- CART FUNCTIONS -----
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  function addToCart(product) {
    const index = cart.findIndex(item => item.id === product.id);
    if (index >= 0) {
      cart[index].quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    saveCart();
    alert(`${product.name} added to cart!`);
    updateCartCount();
  }

  function updateCartCount() {
    const cartLink = document.querySelector(".cart-link a");
    const total = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartLink.innerHTML = `🛒 Cart (${total})`;
  }

  // ----- PRODUCT RENDERING -----
  function renderProducts(data) {
    productGrid.innerHTML = "";
    if (data.length === 0) {
      productGrid.innerHTML = "<p>No products found.</p>";
      return;
    }

    data.forEach(product => {
      const card = document.createElement("div");
      card.classList.add("product-card");

      card.innerHTML = `
        <img src="${product.image}" alt="${product.name}" />
        <h4>${product.name}</h4>
        <p>₹${product.price}</p>
        <button>Add to Cart</button>
      `;

      card.querySelector("button").addEventListener("click", () => {
        addToCart(product);
      });

      productGrid.appendChild(card);
    });
  }

  // ----- PRICE FILTERING -----
  priceFilter?.addEventListener("change", () => {
    const value = priceFilter.value;
    let newFiltered = [...filteredProducts];

    if (value === "0-500") {
      newFiltered = newFiltered.filter(p => p.price <= 500);
    } else if (value === "500-1000") {
      newFiltered = newFiltered.filter(p => p.price > 500 && p.price <= 1000);
    } else if (value === "1000+") {
      newFiltered = newFiltered.filter(p => p.price > 1000);
    }

    renderProducts(newFiltered);
  });

  renderProducts(filteredProducts);
  updateCartCount();
});

// ------------------ CART LOGIC --------------------

let cart = JSON.parse(localStorage.getItem('cart')) || [];

function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  const existingItem = cart.find(item => item.id === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  updateCartUI();
  saveCart();
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  updateCartUI();
  saveCart();
}

function updateQuantity(productId, newQty) {
  const item = cart.find(p => p.id === productId);
  if (item) {
    item.quantity = parseInt(newQty);
    if (item.quantity <= 0) removeFromCart(productId);
  }
  updateCartUI();
  saveCart();
}

function updateCartUI() {
  const cartContainer = document.getElementById('cart-items');
  const cartTotal = document.getElementById('cart-total');
  cartContainer.innerHTML = '';

  let total = 0;

  cart.forEach(item => {
    const itemTotal = item.quantity * item.price;
    total += itemTotal;

    const div = document.createElement('div');
    div.classList.add('cart-item');
    div.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <div class="cart-info">
        <h4>${item.name}</h4>
        <p>₹${item.price} x 
          <input type="number" value="${item.quantity}" min="1" onchange="updateQuantity(${item.id}, this.value)">
        </p>
        <button onclick="removeFromCart(${item.id})">Remove</button>
      </div>
    `;
    cartContainer.appendChild(div);
  });

  cartTotal.innerText = `Total: ₹${total.toFixed(2)}`;
}

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

window.onload = updateCartUI;

