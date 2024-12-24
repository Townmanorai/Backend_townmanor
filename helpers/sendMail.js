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

export const sendVerificationEmail = (username,name_surname,phone, address, email, token) => {
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
    to: email, // Recipient email address
    cc: 'ravindranathjha75@gmail.com',
    subject: 'Welcome to TownManor! Please Verify Your Email',
    text: `
      Hi ${name_surname},

      Welcome to TownManor! We're excited to have you join our platform. You're just one step away from becoming a part of our amazing team!

      To complete your registration, please verify your email address by clicking the link below:

      https://townmanor.ai/api/verify/${token}

      Once you verify your email, you can log in with your username and password on our login page: 
      https://www.townmanor.ai/auth

      We can't wait to have you on board!

      Best regards,
      The TownManor Team
    `,
  };

  return transporter.sendMail(mailOptions);
};
