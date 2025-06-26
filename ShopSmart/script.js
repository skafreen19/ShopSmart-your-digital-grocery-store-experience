// Create a Stripe instance
const stripe = Stripe('your-publishable-key');

// Create a payment form
const elements = stripe.elements();
const cardElement = elements.create('card');
cardElement.mount('#card-element');

// Handle payment form submission
document.getElementById('checkout-btn').addEventListener('click', async (e) => {
  e.preventDefault();
  const { token, error } = await stripe.createToken(cardElement);
  if (error) {
    // Handle error
  } else {
    // Send token to server to charge customer
    fetch('/charge', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: token.id }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }
});
let cart=JSON.parse(localStorage.getItem('cart')) || [];

function addToCart(productName, productPrice) {
  const existingProduct = cart.find((product) => product.name === productName);
  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    cart.push({ name: productName, price: productPrice, quantity: 1 });
  }
  localStorage.setItem('cart', JSON.stringify(cart));
  alert(`${productName} added to cart!`);
}
document.addEventListener("DOMContentLoaded", function () {
  const role = localStorage.getItem("role");

  const addProductBtn = document.getElementById("addProductBtn");
  const addProductForm = document.getElementById("addProductForm");
  const submitProductBtn = document.getElementById("submitProductBtn");

  if (addProductBtn && role === "admin") {
    addProductBtn.style.display = "inline-block";

    if (addProductForm && submitProductBtn) {
      addProductBtn.addEventListener("click", () => {
        addProductForm.style.display = "block";
      });

      submitProductBtn.addEventListener("click", () => {
        const name = document.getElementById("productName").value.trim();
        const price = parseFloat(document.getElementById("productPrice").value);

        if (!name || isNaN(price)) {
          alert("Please enter valid product details.");
          return;
        }

        const productList = document.getElementById("product-list") || document.querySelector("ul");

        const newProductHTML = `
          <li>🛍 ${name} - ₹${price} 
          <button onclick="addToCart('${name}', ${price})">Add to Cart</button></li>
        `;

        productList.insertAdjacentHTML("beforeend", newProductHTML);

        document.getElementById("productName").value = '';
        document.getElementById("productPrice").value = '';
        alert("Product added successfully!");
      });
    }
  }
});
document.addEventListener("DOMContentLoaded", function () {
  const logoutBtn = document.getElementById("logoutBtn");

  if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
      localStorage.removeItem("role");
      alert("Logged out!");
      window.location.href = "index.html"; // or wherever your login page is
    });
  }
});