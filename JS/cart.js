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
  
  let item = {
    name: name,
    size: size,
    quantity: quantity,
    price: price,
    imgSrc: imgSrc
  };

  cart.push(item);
  console.log('Cart after adding item:', cart); // Debugging log
  updateCartCount();
  saveCart();
}

function updateCartCount() {
  let cartCount = document.getElementById("cart-count");
  cartCount.innerText = cart.length;
  console.log('Cart count updated:', cart.length); // Debugging log
}

function saveCart() {
  sessionStorage.setItem('cart', JSON.stringify(cart));
  console.log('Cart saved to sessionStorage:', cart); // Debugging log
}

function loadCart() {
  let savedCart = sessionStorage.getItem('cart');
  if (savedCart) {
    cart = JSON.parse(savedCart);
    console.log('Loaded cart from sessionStorage:', cart); // Debugging log
    updateCartCount();
  }
}

function loadCartItems() {
  let savedCart = sessionStorage.getItem('cart');
  let cart = savedCart ? JSON.parse(savedCart) : [];
  console.log('Cart items to load:', cart); // Debugging log
  let cartItemsContainer = document.getElementById("cart-items");
  if (!cartItemsContainer) {
    console.error('Cart items container not found'); // Debugging log
    return;
  }
  cartItemsContainer.innerHTML = ''; // Clear existing items
  let totalCount = 0;
  let totalPrice = 0;

  cart.forEach(item => {
    let itemElement = document.createElement("div");
    itemElement.classList.add("cart-item");
    
    itemElement.innerHTML = `
      <p><img src="${item.imgSrc}" alt="${item.name}" style="width:50px; height:50px;"> 
      <a href="/viewProduct.html">${item.name}</a> 
      <span class="size">Size: ${item.size}</span> 
      <span class="quantity">Quantity: ${item.quantity}</span> 
      <span class="price">${item.price}LE</span></p>
    `;
    
    cartItemsContainer.appendChild(itemElement);
    totalCount += parseInt(item.quantity);
    totalPrice += parseFloat(item.price) * parseInt(item.quantity);
  });

  document.getElementById("cart-item-count").innerText = totalCount;
  document.getElementById("total-price").innerText = `${totalPrice}LE`;
  console.log('Cart items loaded successfully'); // Debugging log
}

function loadPaymentCartItems() {
  let savedCart = sessionStorage.getItem('cart');
  let cart = savedCart ? JSON.parse(savedCart) : [];
  console.log('Payment cart items to load:', cart); // Debugging log
  let cartItemsContainer = document.querySelector(".container2 #cart-items");
  if (!cartItemsContainer) {
    console.error('Payment cart items container not found'); // Debugging log
    return;
  }
  cartItemsContainer.innerHTML = ''; // Clear existing items
  let totalCount = 0;
  let totalPrice = 0;

  cart.forEach(item => {
    let itemElement = document.createElement("div");
    itemElement.classList.add("cart-item");
    
    itemElement.innerHTML = `
      <p><img src="${item.imgSrc}" alt="${item.name}" style="width:50px; height:50px;"> 
      <a href="/viewProduct.html">${item.name}</a> 
      <span class="size">Size: ${item.size}</span> 
      <span class="quantity">Quantity: ${item.quantity}</span> 
      <span class="price">${item.price}LE</span></p>
    `;
    
    cartItemsContainer.appendChild(itemElement);
    totalCount += parseInt(item.quantity);
    totalPrice += parseFloat(item.price) * parseInt(item.quantity);
  });

  document.querySelector(".container2 #cart-item-count").innerText = totalCount;
  document.querySelector(".container2 #total-price").innerText = `${totalPrice}LE`;
  console.log('Payment cart items loaded successfully'); // Debugging log
}

window.onload = function() {
  loadCart();
  const pathname = window.location.pathname.toLowerCase();
  console.log('Current pathname:', pathname); // Debugging log
  if (pathname.endsWith('mycart.html')) {
    loadCartItems();
  }
  if (pathname.endsWith('visacard.html')) {
    loadPaymentCartItems();
  }
  if (pathname.endsWith('cash.html')) {
    loadPaymentCartItems();
  }
};

document.querySelectorAll('.wrap-button .option-button').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.wrap-button .option-button').forEach(btn => btn.classList.remove('selected'));
    button.classList.add('selected');
  });
});
