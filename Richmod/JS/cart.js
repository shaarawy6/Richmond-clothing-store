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
  updateCartCount();
  saveCart();
}

function updateCartCount() {
  let cartCount = document.getElementById("cart-count");
  cartCount.innerText = cart.length;
}

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function loadCart() {
  let savedCart = localStorage.getItem('cart');
  if (savedCart) {
    cart = JSON.parse(savedCart);
    updateCartCount();
  }
}

function loadCartItems() {
  let savedCart = localStorage.getItem('cart');
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
      <a href="/HTML/viewProduct.html">${item.name}</a> 
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
}

window.onload = function() {
  loadCart();
  if (window.location.pathname.endsWith('/HTML/myCart.html')) {
    loadCartItems();
  }
};

document.querySelectorAll('.wrap-button .option-button').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.wrap-button .option-button').forEach(btn => btn.classList.remove('selected'));
    button.classList.add('selected');
  });
});
