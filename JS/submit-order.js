document.getElementById('orderForm').addEventListener('submit', handleSubmit);

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
        fullname: formData.get('Full Name'),
        email: formData.get('Email'),
        address: formData.get('Address'),
        phone: formData.get('Phone Number'),
      };

      // Collect cart details
      const cart = JSON.parse(sessionStorage.getItem('cart')) || [];
      const cartDetails = cart.map(item => `${item.name} - Size: ${item.size}, Quantity: ${item.quantity}, Price: ${item.price}LE`).join('<br>');

      // Populate the hidden order_details field
      document.getElementById('order_details').value = `
        <h1>New Order Received</h1>
        <p>Full Name: ${userDetails.fullname}</p>
        <p>Email: ${userDetails.email}</p>
        <p>Address: ${userDetails.address}</p>
        <p>Phone: ${userDetails.phone}</p>
        <p>Order Details:</p>
        ${cartDetails}
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