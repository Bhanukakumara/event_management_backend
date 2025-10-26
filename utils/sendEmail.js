const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.NODEMAILER_EMAIL,
      pass: process.env.NODEMAILER_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.NODEMAILER_EMAIL,
    to: options.to,
    subject: options.subject,
    text: options.text,
  });
};

module.exports = { sendEmail };