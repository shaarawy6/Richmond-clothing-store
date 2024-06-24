const nodemailer = require('nodemailer');

exports.handler = async (event, context) => {
  try {
    const { userEmail, userMessage, ownerMessage } = JSON.parse(event.body);

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.email,
        pass: process.env.pass,
      },
    });

    const userMailOptions = {
      from: process.env.email,
      to: userEmail,
      subject: 'Order Confirmation',
      html: userMessage,
    };

    const ownerMailOptions = {
      from: process.env.email,
      to: 'aliahmed6yhb@gmail.com',
      subject: 'New Order Received',
      html: ownerMessage,
    };

    await transporter.sendMail(userMailOptions);
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
