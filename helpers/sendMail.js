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

      Welcome to TownManor! We're so excited to have you as part of our growing proptech community. You’ve made an excellent choice, and we’re here to help you every step of the way.

      Before we get started, let’s confirm a few details:
      
      - **Username**: ${username}
      - **Phone Number**: ${phone}
      - **Address**: ${address}
      - **Email**: ${email}

      You’re just one step away from accessing all the fantastic features TownManor has to offer! Please verify your email by clicking the link below:

      [Verify Your Email](https://townmanor.ai/api/api/users/verify/${token})

      After verifying your email, you can log in with your username and password on our login page: 
      [Login to TownManor](https://www.townmanor.ai/auth)

      We can’t wait to have you fully on board and to help you explore everything TownManor has in store. If you have any questions or need assistance, feel free to reach out to us at any time.

      Warm regards,
      The TownManor Team
    `,
  };

  return transporter.sendMail(mailOptions);
};
