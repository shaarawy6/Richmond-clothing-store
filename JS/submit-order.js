document.getElementById('orderForm').addEventListener('submit', handleSubmit);
document.getElementById('photo').addEventListener('change', handlePhotoChange);

function handleSubmit(event) {
  event.preventDefault();

  // Validate form fields
  const form = document.getElementById('orderForm');
  if (!form.checkValidity()) {
    alert('Please fill out all required fields.');
    return false;
  }

  // Collect form data
  const formData = new FormData(form);
  const userDetails = {
    fullname: formData.get('firstname'),
    email: formData.get('email'),
    address: formData.get('address'),
    phone: formData.get('phone'),
    city: formData.get('city')
  };

  // Collect cart details
  const cart = JSON.parse(sessionStorage.getItem('cart')) || [];
  const cartDetails = cart.map(item => `
    <tr>
      <td>${item.name}</td>
      <td>${item.size}</td>
      <td>${item.quantity}</td>
      <td>${item.price}LE</td>
    </tr>`).join('');

  // Populate the hidden order_details field
  document.getElementById('order_details').value = `
    <h1>New Order Received</h1>
    <p>Full Name: ${userDetails.fullname}</p>
    <p>Email: ${userDetails.email}</p>
    <p>Address: ${userDetails.address}</p>
    <p>Phone: ${userDetails.phone}</p>
    <p>City: ${userDetails.city}</p>
    <p>Order Details:</p>
    <table border="1" style="border-collapse: collapse; width: 100%;">
      <tr>
        <th>Product Name</th>
        <th>Size</th>
        <th>Quantity</th>
        <th>Price</th>
      </tr>
      ${cartDetails}
    </table>
    <p>Total: ${cart.reduce((total, item) => total + item.price * item.quantity, 0)}LE</p>
  `;

  // Clear cart in sessionStorage
  sessionStorage.removeItem('cart');

  // Update the cart display
  document.getElementById('cart-item-count').innerText = '0';
  document.getElementById('cart-items').innerHTML = '';
  document.getElementById('total-price').innerText = '0LE';

  // Submit the form
  form.submit();
}

function handlePhotoChange(event) {
  const file = event.target.files[0];
  const reader = new FileReader();
  const preview = document.getElementById('photo-preview');

  reader.onload = function(e) {
    preview.src = e.target.result;
    preview.style.display = 'block';
  };

  if (file) {
    reader.readAsDataURL(file);
  } else {
    preview.src = '#';
    preview.style.display = 'none';
  }
}
