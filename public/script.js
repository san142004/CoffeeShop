// Check Auth State on Load
window.onload = function () {
  const token = localStorage.getItem('token');
  const loginBtn = document.getElementById('log');
  const dashboardBtn = document.getElementById('dashboard-btn');

  if (token) {
    // User is logged in
    if (loginBtn) loginBtn.style.display = 'none';
    if (dashboardBtn) dashboardBtn.style.display = 'inline-block';
  } else {
    // User is logged out
    if (loginBtn) loginBtn.style.display = 'inline-block';
    if (dashboardBtn) dashboardBtn.style.display = 'none';
  }
};

// Shop Now button click
document.querySelector('.box3 .btn').addEventListener('click', function () {
  window.location.href = '#PRODUCTS';
});

// Add to Cart buttons
const addToCartButtons = document.querySelectorAll('.add-to-cart');

addToCartButtons.forEach(button => {
  button.addEventListener('click', function (e) {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      alert("Please login to add items to cart!");
      login(); // Open login modal
      return;
    }

    // Get product details from parent card
    const card = this.closest('.card');
    const title = card.querySelector('.card-title').innerText;
    const price = card.querySelector('.pop2 h3').innerText;
    const image = card.querySelector('.card-img-top').src;

    const product = { title, price, image };

    // Get existing cart
    let cart = JSON.parse(localStorage.getItem('cartItems')) || [];
    cart.push(product);
    localStorage.setItem('cartItems', JSON.stringify(cart));

    alert(`${title} added to your Dashboard!`);
  });
});
function login() {
  const loginBox = document.getElementById("login-box");
  const signupBox = document.getElementById("signup-box");

  if (loginBox.style.display === "block") {
    loginBox.style.display = "none";
  } else {
    loginBox.style.display = "block";
    signupBox.style.display = "none";
  }
}
// function signup() {
//   const loginBox = document.getElementById("login-box");
//   const signupBox = document.getElementById("signup-box");

//   if (loginBox.style.display === "block" || signupBox.style.display === "block") {
//     signupBox.style.display = "none";
//   } else {
//     signupBox.style.display = "block";
//   }
// }

function signup() {
  const loginBox = document.getElementById("login-box");
  const signupBox = document.getElementById("signup-box");

  if (signupBox.style.display === "block") {
    signupBox.style.display = "none";
  } else {
    signupBox.style.display = "block";
    loginBox.style.display = "none";



  }
}