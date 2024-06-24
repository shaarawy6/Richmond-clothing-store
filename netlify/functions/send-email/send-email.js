const nodemailer = require('nodemailer');

exports.handler = async (event, context) => {
  try {
    console.log('Received event:', event);
    const { userEmail, userMessage, ownerMessage } = JSON.parse(event.body);

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const userMailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: 'Order Confirmation',
      html: userMessage,
    };

    const ownerMailOptions = {
      from: process.env.EMAIL_USER,
      to: 'aliahmed6yhb@gmail.com',
      subject: 'New Order Received',
      html: ownerMessage,
    };

    console.log('Sending email to user:', userMailOptions);
    const userEmailResult = await transporter.sendMail(userMailOptions);
    console.log('User email result:', userEmailResult);

    console.log('Sending email to owner:', ownerMailOptions);
    const ownerEmailResult = await transporter.sendMail(ownerMailOptions);
    console.log('Owner email result:', ownerEmailResult);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Emails sent successfully' }),
    };
  } catch (error) {
    console.error('Error sending emails:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.toString() }),
    };
  }
};
