const nodemailer = require('nodemailer');

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Praveen <${process.env.EMAIL_FROM}>`;
  }

  createTransport() {
    if (process.env.NODE_ENV === 'production') {
      return 1;
    }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,

      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  //  send the actual mail
  send(template, subject) {
    // res.render('');

    const mailOptions = {
      from: this.from,
      to: this.to,
      subject: subject,
      text: options.message,
      // html:
    };
  }

  sendWelcome() {
    this.send('Welcome', 'Welcome to the Natours Family!');
  }
};

const sendEmail = async (options) => {
  // 1) Create a transporter

  // 2) Define the email option

  // 3) Send the email with nodemailer

  await transporter.sendMail(mailOptions);
};
