let cart = [];

function addToCart() {
  let sizeElement = document.querySelector('.wrap-button .option-button.selected');
  if (!sizeElement) {
    alert('Please select a size.');
    return;
  }
  let size = sizeElement.innerText;
  let quantity = document.getElementById("quantity").value;
  let name = document.querySelector('.product-information h1').innerText;
  let price = document.querySelector('.product-information h3').innerText.replace('LE', '').trim();
  let imgSrc = document.getElementById("imagebox").src;
  let id = Date.now(); // Generate a unique identifier for each item
  
  let item = {
    id: id,
    name: name,
    size: size,
    quantity: quantity,
    price: price,
    imgSrc: imgSrc
  };

  cart.push(item);
  updateCartCount();
  saveCart();
  updateCartTotal(); // Ensure cart total is updated when items are added
}

function updateCartCount() {
  let cartCount = document.getElementById("cart-count");
  cartCount.innerText = cart.length;

  let cartIcon = document.getElementById("cart-icon").parentElement;
  if (cart.length === 0) {
    cartIcon.style.pointerEvents = 'none';
    cartIcon.style.opacity = '0.5';
  } else {
    cartIcon.style.pointerEvents = 'auto';
    cartIcon.style.opacity = '1';
  }
}

function saveCart() {
  sessionStorage.setItem('cart', JSON.stringify(cart));
}

function loadCart() {
  let savedCart = sessionStorage.getItem('cart');
  if (savedCart) {
    cart = JSON.parse(savedCart);
    updateCartCount();
    updateCartTotal(); // Ensure cart total is updated when cart is loaded
  } else {
    updateCartCount(); // Ensure cart icon state is updated even if the cart is empty
  }
}

function deleteCartItem(itemId) {
  cart = cart.filter(item => item.id !== itemId);
  updateCartCount();
  saveCart();
  loadCartItems();
  loadPaymentCartItems(); // Ensure payment pages are updated
  updateCartTotal(); // Ensure cart total is updated when items are deleted
}

function loadCartItems() {
  let savedCart = sessionStorage.getItem('cart');
  let cart = savedCart ? JSON.parse(savedCart) : [];
  let cartItemsContainer = document.getElementById("cart-items");
  cartItemsContainer.innerHTML = ''; // Clear existing items
  let totalCount = 0;
  let totalPrice = 0;

  cart.forEach(item => {
    let itemElement = document.createElement("div");
    itemElement.classList.add("cart-item");
    
    itemElement.innerHTML = `
      <p><img src="${item.imgSrc}" alt="${item.name}" style="width:50px; height:50px;"> 
      <a href="viewProduct.html">${item.name}</a> 
      <span class="size">Size: ${item.size}</span> 
      <span class="quantity">Quantity: ${item.quantity}</span> 
      <span class="price">${item.price}LE</span> 
      <button onclick="deleteCartItem(${item.id})">Delete</button></p>
    `;
    
    cartItemsContainer.appendChild(itemElement);
    totalCount += parseInt(item.quantity);
    totalPrice += parseFloat(item.price) * parseInt(item.quantity);
  });

  document.getElementById("cart-item-count").innerText = totalCount;
  document.getElementById("total-price").innerText = `${totalPrice}LE`;
}

function loadPaymentCartItems() {
  let savedCart = sessionStorage.getItem('cart');
  let cart = savedCart ? JSON.parse(savedCart) : [];
  let cartItemsContainer = document.querySelector(".container2 #cart-items");
  cartItemsContainer.innerHTML = ''; // Clear existing items
  let totalCount = 0;
  let totalPrice = 0;

  cart.forEach(item => {
    let itemElement = document.createElement("div");
    itemElement.classList.add("cart-item");
    
    itemElement.innerHTML = `
      <p><img src="${item.imgSrc}" alt="${item.name}" style="width:50px; height:50px;"> 
      <a href="viewProduct.html">${item.name}</a> 
      <span class="size">Size: ${item.size}</span> 
      <span class="quantity">Quantity: ${item.quantity}</span> 
      <span class="price">${item.price}LE</span> 
      <button onclick="deleteCartItem(${item.id})">Delete</button></p>
    `;
    
    cartItemsContainer.appendChild(itemElement);
    totalCount += parseInt(item.quantity);
    totalPrice += parseFloat(item.price) * parseInt(item.quantity);
  });

  document.querySelector(".container2 #cart-item-count").innerText = totalCount;
  document.querySelector(".container2 #total-price").innerText = `${totalPrice}LE`;
}

function updateDeliveryFee() {
  const citySelect = document.getElementById('city');
  const selectedCity = citySelect.value;

  let totalPrice = cart.reduce((acc, item) => acc + parseFloat(item.price) * parseInt(item.quantity), 0);

  if (totalPrice >= 1500) {
    deliveryFee = 0;
  } else {
    if (selectedCity === 'cairo') {
      deliveryFee = 50;
    } else if (selectedCity === 'alex') {
      deliveryFee = 60;
    } else if (selectedCity === 'other') {
      deliveryFee = 100;
    } else {
      deliveryFee = 0;
    }
  }

  updateCartTotal();
}

function updateCartTotal() {
  const savedCart = sessionStorage.getItem('cart');
  const cart = savedCart ? JSON.parse(savedCart) : [];
  let totalPrice = 0;

  cart.forEach(item => {
    totalPrice += parseFloat(item.price) * parseInt(item.quantity);
  });

  // Calculate total price after considering delivery fee
  let finalPrice = totalPrice + (totalPrice >= 1500 ? 0 : deliveryFee);
  document.querySelector(".container2 #total-price").innerText = `${finalPrice}LE`;
}

// Use event listeners to load the respective functions based on the page
window.addEventListener('load', () => {
  loadCart();

  const pathname = window.location.pathname.toLowerCase();
  console.log('Current pathname:', pathname);

  if (pathname.endsWith('/mycart')) {
    loadCartItems();
  } else if (pathname.endsWith('/visacard')) {
    loadPaymentCartItems();
  } else if (pathname.endsWith('/cash')) {
    loadPaymentCartItems();
  }
});

document.querySelectorAll('.wrap-button .option-button').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.wrap-button .option-button').forEach(btn => btn.classList.remove('selected'));
    button.classList.add('selected');
  });
});
