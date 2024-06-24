const nodemailer = require('nodemailer');

exports.handler = async (event, context) => {
  try {
    const { userEmail, userMessage, ownerEmail, ownerMessage } = JSON.parse(event.body);

    // Create a Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Use your email service provider
      auth: {
        user: 'your-email@example.com', // Your email
        pass: 'your-email-password', // Your email password or an app password if 2FA is enabled
      },
    });

    // Define email options for the user
    const userMailOptions = {
      from: 'your-email@example.com',
      to: userEmail,
      subject: 'Order Confirmation',
      html: userMessage,
    };

    // Define email options for the owner
    const ownerMailOptions = {
      from: 'your-email@example.com',
      to: ownerEmail,
      subject: 'New Order Received',
      html: ownerMessage,
    };

    // Send the email to the user
    await transporter.sendMail(userMailOptions);

    // Send the email to the owner
    await transporter.sendMail(ownerMailOptions);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Emails sent successfully' }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.toString() }),
    };
  }
};
