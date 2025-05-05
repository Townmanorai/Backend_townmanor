


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
    from: 'sales@townmanor.in',
    to: email,
    cc: 'anushka@townmanor.ai',
    subject: 'Welcome to TownManor! Please Verify Your Email',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            .email-container {
              max-width: 600px;
              margin: 0 auto;
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #000000;
            }
            .header {
              background: linear-gradient(to right, #ff4447, #8a2e2e);
              color: white;
              padding: 30px;
              text-align: center;
              border-radius: 10px 10px 0 0;
            }
            .content {
              padding: 30px;
              background: #ffffff;
              border: 1px solid #e5e5e5;
              border-radius: 0 0 10px 10px;
            }
            .button {
              display: inline-block;
              padding: 12px 24px;
              background: linear-gradient(to right, #ff4447, #8a2e2e);
              color: white !important;
              text-decoration: none;
              border-radius: 5px;
              margin: 20px 0;
              font-weight: bold;
              transition: all 0.3s ease;
            }
            .details-box {
              background: #f8f8f8;
              padding: 20px;
              border-radius: 8px;
              margin: 20px 0;
              border-left: 4px solid #ff4447;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              color: #000000;
              font-size: 14px;
            }
            .services-section {
              margin: 40px 0;
              text-align: center;
            }
            .services-grid {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 20px;
              margin: 20px 0;
            }
            .service-card {
              background: #ffffff;
              border-radius: 10px;
              padding: 20px;
              text-align: left;
              border: 1px solid #e5e5e5;
              transition: all 0.3s ease;
              box-shadow: 0 2px 4px rgba(0,0,0,0.05);
            }
            .service-card:hover {
              border-color: #ff4447;
              box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            }
            .service-icon {
              width: 40px;
              height: 40px;
              margin-bottom: 10px;
            }
            .service-title {
              font-size: 16px;
              font-weight: bold;
              margin: 10px 0 5px;
              color: #000000;
            }
            .service-description {
              font-size: 14px;
              color: #666;
              margin: 0;
            }
            .new-badge {
              background: #ff4447;
              color: white;
              padding: 2px 6px;
              border-radius: 12px;
              font-size: 12px;
              margin-left: 5px;
            }
            a {
              color: #ff4447;
              text-decoration: none;
            }
            a:hover {
              text-decoration: underline;
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="header">
              <h1>Welcome to TownManor! 🏠</h1>
              <p>Your Gateway to Smart Property Management</p>
            </div>
            
            <div class="content">
              <p>Dear ${name_surname},</p>
              
              <p>We're thrilled to welcome you to the TownManor family! 🎉 You've just taken the first step towards revolutionizing your property management experience.</p>
              
              <div class="details-box">
                <h3>Your Account Details</h3>
                <p>👤 <strong>Username:</strong> ${username}</p>
                <p>📱 <strong>Phone:</strong> ${phone}</p>
                <p>📍 <strong>Address:</strong> ${address}</p>
                <p>📧 <strong>Email:</strong> ${email}</p>
              </div>
              
              <p>To start your journey with us, please verify your email by clicking the button below:</p>
              
              <center>
                <a href="https://townmanor.ai/api/api/users/verify/${token}" class="button">
                  Verify My Email
                </a>
              </center>

              <div class="services-section">
                <h2 style="color: #000000;">Explore Our Premium Services</h2>
                <p>Discover the comprehensive suite of services we offer to make your property journey seamless:</p>
                
                <div class="services-grid">
                  <div class="service-card">
                    <div style="color: #ff4447">
                      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                        <rect x="4" y="8" width="32" height="24" rx="4" fill="currentColor"/>
                        <path d="M4 16H36V20H4V16Z" fill="#ffffff"/>
                        <circle cx="14" cy="26" r="4" fill="#8a2e2e"/>
                        <circle cx="26" cy="26" r="4" fill="#000000"/>
                      </svg>
                    </div>
                    <h3 class="service-title">Credit Score Check</h3>
                    <p class="service-description">Instant access to credit score and financial health report</p>
                  </div>
                  
                  <div class="service-card">
                    <div style="color: #ff4447">
                      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                        <path d="M8 6H28V14L32 18V34H8V6Z" fill="currentColor"/>
                        <path d="M12 18H24V22H12V18Z" fill="#ffffff"/>
                      </svg>
                    </div>
                    <h3 class="service-title">RERA Verification</h3>
                    <p class="service-description">Verify property registration under RERA regulations</p>
                  </div>

                  <div class="service-card">
                    <div style="color: #ff4447">
                      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                        <path d="M20 4L4 16V36H36V16L20 4Z" fill="currentColor"/>
                        <path d="M16 20L20 24L28 16" stroke="#ffffff" stroke-width="2"/>
                      </svg>
                    </div>
                    <h3 class="service-title">Rent Agreement</h3>
                    <p class="service-description">Digital rental agreement with aadhar e-Sign</p>
                  </div>

                  <div class="service-card">
                    <div style="color: #ff4447">
                      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                        <path d="M20 8L8 20V32H32V20L20 8Z" fill="currentColor"/>
                        <path d="M20 16V24" stroke="#ffffff" stroke-width="2"/>
                      </svg>
                    </div>
                    <h3 class="service-title">Home Loan</h3>
                    <p class="service-description">Complete home loan solutions with quick processing</p>
                  </div>
                </div>

                <center>
                  <a href="https://www.townmanor.ai/services" class="button">
                    Explore All Services
                  </a>
                </center>
              </div>
              
              <p>Once verified, you can access your account here:</p>
              <center>
                <a href="https://www.townmanor.ai/auth" class="button">
                  Login to TownManor
                </a>
              </center>
              
              <div class="footer">
                <p>Need help? We're here for you!</p>
                <p>Contact our support team at <a href="mailto:support@townmanor.in">support@townmanor.in</a></p>
                <hr style="border-top: 1px solid #e5e5e5; margin: 20px 0;">
                <p>© 2024 TownManor | Your Trusted Property Management Partner</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `,
  };

  return transporter.sendMail(mailOptions);
};
