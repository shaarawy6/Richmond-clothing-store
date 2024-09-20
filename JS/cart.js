let cart = [];

function addToCart() {
  let sizeElement = document.querySelector('.wrap-button .option-button.selected');
  if (!sizeElement) {
    alert('Please select a size.');
    return;
  }
  let size = sizeElement.innerText;
  let quantity = parseInt(document.getElementById("quantity").value);
  let name = document.querySelector('.product-information h1').innerText;
  let price = parseFloat(document.querySelector('.product-information h3').innerText.replace('LE', '').trim());
  let imgSrc = document.getElementById("imagebox").src;
  
  // Check if item already exists in the cart
  let existingItem = cart.find(item => item.name === name && item.size === size);
  if (existingItem) {
    // Update the quantity of the existing item
    existingItem.quantity += quantity;
  } else {
    let id = Date.now(); // Generate a unique identifier for each item
    let item = {
      id: id,
      name: name,
      size: size,
      quantity: quantity,
      price: price,
      imgSrc: imgSrc,
      originalPrice: price // Store the original price
    };
    cart.push(item);
  }
  
  applyPricingLogic(); // Apply the new pricing logic
  updateCartCount();
  saveCart();
}

function applyPricingLogic() {
  const eligibleProducts = ["Destroyed ripped T-shirt", "Chaser T-shirt", "05 jersey T-shirt"];
  const eligibleItems = cart.filter(item => eligibleProducts.includes(item.name));
  
  // Reset prices to original before applying discounts
  cart.forEach(item => {
    if (eligibleProducts.includes(item.name)) {
      item.price = item.originalPrice;
    }
  });

  if (eligibleItems.length === 1) {
    // 20% off for a single T-shirt
    eligibleItems[0].price = eligibleItems[0].originalPrice * 0.8;
  } else if (eligibleItems.length === 2) {
    // 50% off the cheaper T-shirt (or the second one if prices are equal)
    eligibleItems.sort((a, b) => b.originalPrice - a.originalPrice);
    eligibleItems[1].price = eligibleItems[1].originalPrice * 0.5;
  } else if (eligibleItems.length === 3) {
    // Sort by price, descending
    eligibleItems.sort((a, b) => b.originalPrice - a.originalPrice);
    
    if (eligibleItems[0].originalPrice === eligibleItems[2].originalPrice) {
      // All same price: two at full price, one free
      eligibleItems[2].price = 0;
    } else if (eligibleItems[0].originalPrice > eligibleItems[1].originalPrice &&
               eligibleItems[1].originalPrice === eligibleItems[2].originalPrice) {
      // One expensive, two cheaper: expensive at full price, one cheaper at full price, one free
      eligibleItems[2].price = 0;
    } else {
      // Two expensive, one cheaper: two at full price, one free
      eligibleItems[2].price = 0;
    }
  }
}

// Preserve original functions

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
    applyPricingLogic(); // Apply pricing logic after loading cart
    updateCartCount();
  } else {
    updateCartCount(); // Ensure cart icon state is updated even if the cart is empty
  }
}

function incrementQuantity(itemId) {
  let item = cart.find(item => item.id === itemId);
  if (item) {
    item.quantity += 1;
    applyPricingLogic(); // Reapply pricing logic after quantity change
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
      applyPricingLogic(); // Reapply pricing logic after quantity change
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
  applyPricingLogic(); // Reapply pricing logic after item deletion
  updateCartCount();
  saveCart();
  loadCartItems();
  loadPaymentCartItems(); // Ensure payment pages are updated
  resetLocationSelection(); // Force user to reselect location
}

function loadCartItems() {
  let cartItemsContainer = document.getElementById("cart-items");
  cartItemsContainer.innerHTML = ''; // Clear existing items
  let totalCount = 0;
  let totalPrice = 0;

  cart.forEach(item => {
    let itemElement = document.createElement("div");
    itemElement.classList.add("cart-item");
    
    let displayPrice = item.price !== item.originalPrice 
      ? `<span class="original-price" style="text-decoration: line-through;">${item.originalPrice.toFixed(2)}LE</span> ${item.price.toFixed(2)}LE` 
      : `${item.price.toFixed(2)}LE`;
    
    itemElement.innerHTML = `
      <p><img src="${item.imgSrc}" alt="${item.name}" style="width:50px; height:50px;"> 
      <a href="viewProduct.html">${item.name}</a> 
      <span class="size">Size: ${item.size}</span> 
      <span class="quantity">
        <button onclick="decrementQuantity(${item.id})">-</button>
        ${item.quantity}
        <button onclick="incrementQuantity(${item.id})">+</button>
      </span>
      <span class="price">${displayPrice}</span> 
    `;
    
    cartItemsContainer.appendChild(itemElement);
    totalCount += parseInt(item.quantity);
    totalPrice += parseFloat(item.price) * parseInt(item.quantity);
  });

  document.getElementById("cart-item-count").innerText = totalCount;
  document.getElementById("total-price").innerText = `${totalPrice.toFixed(2)}LE`;

  updateCartTotal(totalPrice); // Update cart total and delivery fee based on total price
}

function loadPaymentCartItems() {
  let cartItemsContainer = document.querySelector(".container2 #cart-items");
  cartItemsContainer.innerHTML = ''; // Clear existing items
  let totalCount = 0;
  let totalPrice = 0;

  cart.forEach(item => {
    let itemElement = document.createElement("div");
    itemElement.classList.add("cart-item");
    
    let displayPrice = item.price !== item.originalPrice 
      ? `<span class="original-price" style="text-decoration: line-through;">${item.originalPrice.toFixed(2)}LE</span> ${item.price.toFixed(2)}LE` 
      : `${item.price.toFixed(2)}LE`;
    
    itemElement.innerHTML = `
      <p><img src="${item.imgSrc}" alt="${item.name}" style="width:50px; height:50px;"> 
      <a href="viewProduct.html">${item.name}</a> 
      <span class="size">Size: ${item.size}</span> 
      <span class="quantity">
        <button onclick="decrementQuantity(${item.id})">-</button>
        ${item.quantity}
        <button onclick="incrementQuantity(${item.id})">+</button>
      </span>
      <span class="price">${displayPrice}</span> 
    `;
    
    cartItemsContainer.appendChild(itemElement);
    totalCount += parseInt(item.quantity);
    totalPrice += parseFloat(item.price) * parseInt(item.quantity);
  });

  document.querySelector(".container2 #cart-item-count").innerText = totalCount;
  document.querySelector(".container2 #total-price").innerText = `${totalPrice.toFixed(2)}LE`;

  updateCartTotal(totalPrice); // Update cart total and delivery fee based on total price
}

// Preserve other original functions

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

  updateCartTotal(); // Recalculate the cart total when delivery fee is updated
}

function updateCartTotal(cartTotal = 0) {
  const savedCart = sessionStorage.getItem('cart');
  const cart = savedCart ? JSON.parse(savedCart) : [];

  if (cartTotal === 0) {
    cartTotal = cart.reduce((sum, item) => sum + parseFloat(item.price) * parseInt(item.quantity), 0);
  }

  if (cartTotal >= 1500) {
    deliveryFee = 0; // Free shipping for orders 1500 LE or more
  }

  const totalPrice = cartTotal + deliveryFee;
  document.querySelector(".container2 #total-price").innerText = `${totalPrice.toFixed(2)}LE`;
}

function resetLocationSelection() {
  const citySelect = document.getElementById('city');
  citySelect.selectedIndex = 0; // Reset to the default option
  alert('Please reselect your location for delivery fee calculation.');
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