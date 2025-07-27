document.addEventListener("DOMContentLoaded", () => {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartContainer = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");

  function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  function renderCart() {
    cartContainer.innerHTML = "";

    if (cart.length === 0) {
      cartContainer.innerHTML = "<p>Your cart is empty.</p>";
      cartTotal.innerHTML = "";
      return;
    }

    cart.forEach((item, index) => {
      const div = document.createElement("div");
      div.classList.add("product-card");

      div.innerHTML = `
        <img src="${item.image}" alt="${item.name}" />
        <h4>${item.name}</h4>
        <p>Price: ₹${item.price}</p>
        <p>Qty: <input type="number" min="1" value="${item.quantity}" data-index="${index}" /></p>
        <button data-index="${index}" class="remove">Remove</button>
      `;

      cartContainer.appendChild(div);
    });

    calculateTotal();
    attachEvents();
  }

  function attachEvents() {
    document.querySelectorAll(".remove").forEach(btn => {
      btn.addEventListener("click", e => {
        const index = e.target.dataset.index;
        cart.splice(index, 1);
        saveCart();
        renderCart();
      });
    });

    document.querySelectorAll("input[type='number']").forEach(input => {
      input.addEventListener("change", e => {
        const index = e.target.dataset.index;
        const qty = parseInt(e.target.value);
        if (qty < 1) return;
        cart[index].quantity = qty;
        saveCart();
        renderCart();
      });
    });
  }

  function calculateTotal() {
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    cartTotal.innerHTML = `<h3>Total: ₹${total}</h3>`;
  }

  renderCart();
});
