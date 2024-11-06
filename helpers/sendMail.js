// import nodemailer from 'nodemailer';
// import randomstring from 'randomstring';

// export const sendVerificationEmail = (userEmail, token) => {
//   const transporter = nodemailer.createTransport({
//     host: process.env.SMTP_HOST,
//     port: process.env.SMTP_PORT,
//     secure: false,
//     auth: {
//       user: process.env.SMTP_USER,
//       pass: process.env.SMTP_PASS,
//     },
//   });

//   const mailOptions = {
//     from: process.env.SMTP_USER,
//     to: userEmail,
//     subject: 'Verify Your Email',
//     text: `Click this link to verify your account: http://localhost:3030/verify/${token}`,
//   };

//   return transporter.sendMail(mailOptions);
// };


import nodemailer from 'nodemailer';
import randomstring from 'randomstring';

export const sendVerificationEmail = (userEmail, token) => {
  const transporter = nodemailer.createTransport({
    host: 'smtpout.secureserver.net', // Your SMTP server
    port: 465, // Use 465 for secure (SSL)
    secure: true, // SSL is true for port 465
    auth: {
      user: 'sales@townmanor.in', // Your email
      pass: 'Townmanor1234!', // Your password from environment variable
    },
    logger: true, // Enable logging
    debug: true, // Enable debug mode
  });

  const mailOptions = {
    from: 'sales@townmanor.in', // Sender email address
    to: userEmail, // Recipient email address
    cc: 'ravindranathjha75@gmail.com',
    subject: 'Verify Your Email',
    text: `Click this link to verify your account: http://localhost:3030/verify/${token}`,
  };

  return transporter.sendMail(mailOptions);
};
