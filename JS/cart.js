let cart = [];
let deliveryFee = 0; // Initialize delivery fee
let cityResetRequired = false; // Flag to track if city selection reset is required

function addToCart() {
  let sizeElement = document.querySelector('.wrap-button .option-button.selected');
  if (!sizeElement) {
    alert('Please select a size.');
    return;
  }
  let size = sizeElement.innerText;
  let quantity = parseInt(document.getElementById("quantity").value);
  let name = document.querySelector('.product-information h1').innerText;
  let price = document.querySelector('.product-information h3').innerText.replace('LE', '').trim();
  let imgSrc = document.getElementById("imagebox").src;
  
  let existingItem = cart.find(item => item.name === name && item.size === size);
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    let id = Date.now(); 
    let item = {
      id: id,
      name: name,
      size: size,
      quantity: quantity,
      price: price,
      imgSrc: imgSrc
    };
    cart.push(item);
  }
  
  updateCartCount();
  saveCart();
  alert("Item has been added to the cart");
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
  } else {
    updateCartCount();
  }
}

function incrementQuantity(itemId) {
  let item = cart.find(item => item.id === itemId);
  if (item) {
    item.quantity += 1;
    updateCartCount();
    saveCart();
    loadCartItems();
    loadPaymentCartItems();
  }
}

function decrementQuantity(itemId) {
  let item = cart.find(item => item.id === itemId);
  if (item) {
    if (item.quantity > 1) {
      item.quantity -= 1;
      updateCartCount();
      saveCart();
      loadCartItems();
      loadPaymentCartItems();
    } else {
      deleteCartItem(itemId);
    }
  }
}

function deleteCartItem(itemId) {
  cart = cart.filter(item => item.id !== itemId);
  updateCartCount();
  saveCart();
  loadCartItems();
  loadPaymentCartItems();
  resetLocationSelection();
}

function loadCartItems() {
  let savedCart = sessionStorage.getItem('cart');
  let cart = savedCart ? JSON.parse(savedCart) : [];
  let cartItemsContainer = document.getElementById("cart-items");

  if (cart.length === 0) {
    alert("Your cart is empty, please add items.");
    window.location.href = 'index.html';
    return;
  }

  cartItemsContainer.innerHTML = '';
  let totalCount = 0;
  let totalPrice = 0;

  cart.forEach(item => {
    let itemElement = document.createElement("div");
    itemElement.classList.add("cart-item");
    
    itemElement.innerHTML = `
      <p><img src="${item.imgSrc}" alt="${item.name}" style="width:50px; height:50px;"> 
      <a href="viewProduct.html">${item.name}</a> 
      <span class="size">Size: ${item.size}</span> 
      <span class="quantity">
        <button onclick="decrementQuantity(${item.id})">-</button>
        ${item.quantity}
        <button onclick="incrementQuantity(${item.id})">+</button>
      </span>
      <span class="price">${item.price}LE</span> 
    `;
    
    cartItemsContainer.appendChild(itemElement);
    totalCount += parseInt(item.quantity);
    totalPrice += parseFloat(item.price) * parseInt(item.quantity);
  });

  document.getElementById("cart-item-count").innerText = totalCount;
  document.getElementById("total-price").innerText = `${totalPrice}LE`;

  updateCartTotal(totalPrice);
}

function loadPaymentCartItems() {
  let savedCart = sessionStorage.getItem('cart');
  let cart = savedCart ? JSON.parse(savedCart) : [];
  let cartItemsContainer = document.querySelector(".container2 #cart-items");
  cartItemsContainer.innerHTML = '';
  let totalCount = 0;
  let totalPrice = 0;

  cart.forEach(item => {
    let itemElement = document.createElement("div");
    itemElement.classList.add("cart-item");
    
    itemElement.innerHTML = `
      <p><img src="${item.imgSrc}" alt="${item.name}" style="width:50px; height:50px;"> 
      <a href="viewProduct.html">${item.name}</a> 
      <span class="size">Size: ${item.size}</span> 
      <span class="quantity">
        <button onclick="decrementQuantity(${item.id})">-</button>
        ${item.quantity}
        <button onclick="incrementQuantity(${item.id})">+</button>
      </span>
      <span class="price">${item.price}LE</span> 
    `;
    
    cartItemsContainer.appendChild(itemElement);
    totalCount += parseInt(item.quantity);
    totalPrice += parseFloat(item.price) * parseInt(item.quantity);
  });

  document.querySelector(".container2 #cart-item-count").innerText = totalCount;
  document.querySelector(".container2 #total-price").innerText = `${totalPrice}LE`;

  updateCartTotal(totalPrice);
}

function updateDeliveryFee() {
  const citySelect = document.getElementById('city');
  const selectedCity = citySelect.value;

  if (selectedCity === 'cairo') {
    deliveryFee = 55;
  } else if (selectedCity === 'alex') {
    deliveryFee = 70;
  } else if (selectedCity === 'other') {
    deliveryFee = 90;
  } else {
    deliveryFee = 0;
  }

  updateCartTotal(); 
}

function updateCartTotal(cartTotal = 0) {
  const savedCart = sessionStorage.getItem('cart');
  const cart = savedCart ? JSON.parse(savedCart) : [];

  if (cartTotal === 0) {
    cartTotal = cart.reduce((sum, item) => sum + parseFloat(item.price) * parseInt(item.quantity), 0);
  }

  if (cartTotal >= 1500) {
    deliveryFee = 0;
    cityResetRequired = false; // Reset the flag since the total is now above 1500
    document.getElementById('free-shipping').style.display = 'block'; // Show FREE SHIPPING text
  } else if (!cityResetRequired) {
    cityResetRequired = true;
    resetLocationSelection();
    document.getElementById('free-shipping').style.display = 'none'; // Hide FREE SHIPPING text
  }

  const totalPrice = cartTotal + deliveryFee;
  document.querySelector(".container2 #total-price").innerText = `${totalPrice}LE`;
}

function resetLocationSelection() {
  const citySelect = document.getElementById('city');
  citySelect.selectedIndex = 0;
  alert('Please reselect your location for delivery fee calculation.');
}

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

document.getElementById('orderForm').addEventListener('submit', function(event) {
  if (cart.length > 0) {
    alert("Please wait for robot and email verifications");
  } else {
    event.preventDefault();
    alert("Your cart is empty, please add items.");
    window.location.href = 'index.html';
  }
});
