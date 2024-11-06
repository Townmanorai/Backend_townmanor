// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';
// import db from '../config/db.js';
// import { sendVerificationEmail } from '../helpers/sendMail.js';
// import { validateSignup } from '../helpers/validation.js';
// import randomstring from 'randomstring';

// export const signup = (req, res) => {
//   const { name, username, password } = req.body;
//   console.log(name, username, password);

//   if (!validateSignup(req.body)) {
//     return res.status(400).json({ message: 'All fields are required' });
//   }

//   const hashedPassword = bcrypt.hashSync(password, 10);
//   const token = randomstring.generate();
//   console.log(token);
//   console.log(hashedPassword);

//   db.query('INSERT INTO user SET ?', { name, username, password: hashedPassword, token }, (err) => {
//     if (err) {
//       console.error("Database Insert Error: ", err); // Log the actual error
//       return res.status(500).json({ message: 'Database error' });
//     }
//     sendVerificationEmail(username, token);
//     res.status(200).json({ message: 'User registered. Check your email to verify.' });
//   });
// };

// export const login = (req, res) => {
//   const { username, password } = req.body;

//   db.query('SELECT * FROM user WHERE username = ?', [username], (err, results) => {
//     if (err || results.length === 0) {
//       return res.status(400).json({ message: 'User not found' });
//     }

//     const user = results[0];
//     const passwordMatch = bcrypt.compareSync(password, user.password);

//     if (!passwordMatch) {
//       return res.status(401).json({ message: 'Incorrect password' });
//     }

//     const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

//     res.cookie('token', token, { httpOnly: true });
//     res.status(200).json({ message: 'Login successful' });
//   });
// };

// export const verifyEmail = (req, res) => {
//   const { token } = req.params;

//   db.query('UPDATE user SET token = NULL WHERE token = ?', [token], (err, result) => {
//     if (err || result.affectedRows === 0) {
//       return res.status(400).json({ message: 'Invalid token' });
//     }
//     res.status(200).json({ message: 'Email verified successfully' });
//   });
// };


//----------------------------------------------------------------------------------

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../config/db.js';
import { sendVerificationEmail } from '../helpers/sendMail.js';
import { validateSignup } from '../helpers/validation.js';
import randomstring from 'randomstring';
import dotenv from 'dotenv';
import moment from 'moment-timezone';

dotenv.config();


export const signup = (req, res) => {
  const {username, password,name_surname,gstNo,address,phone,email } = req.body;
  console.log("username singup ", username, password,name_surname,gstNo,address,phone,email);

  // Input validation
  if (!validateSignup(req.body)) {
    return res.status(400).json({ message: 'All fields are required and must be valid' });
  }

  // const formattedPropertyDate = moment(property_date).tz("Asia/Kolkata").format("YYYY-MM-DDTHH:mm:ss");
   const created_on = moment().tz("Asia/Kolkata").format("YYYY-MM-DDTHH:mm:ss");  // Current date for created_on
   const updated_on = created_on;  // Same value for updated_on initially
   const status = 1;  // Active status by default

  // Check if the username already exists
  db.query('SELECT * FROM user WHERE username = ?', [username], (err, results) => {
    if (err) {
      console.error("Database Select Error: ", err); // Log any database select errors
      return res.status(500).json({ message: 'Database error' });
    }

    if (results.length > 0) {
      return res.status(409).json({ message: 'Username already taken' });
    }

    // If username is not taken, proceed with registration
    const hashedPassword = bcrypt.hashSync(password, 10);
    const token = randomstring.generate();

    db.query('INSERT INTO user SET ?', {username, password: hashedPassword, token ,name_surname,gstNo,address,phone,email,created_on,updated_on,status }, (err) => {
      if (err) {
        console.error("Database Insert Error: ", err); // Log the actual error
        return res.status(500).json({ message: 'Database error' });
      }

      // Send verification email
      sendVerificationEmail(email, token);

      // Respond with success message
      res.status(200).json({ message: 'User registered. Please check your email to verify your account.' });
    });
  });
};


// export const signup = (req, res) => {
//   const {username, password,name_surname,gstNo,address,phone } = req.body;
//   console.log("username singup ", username, password,name_surname,gstNo,address,phone);

//   // Input validation
//   if (!validateSignup(req.body)) {
//     return res.status(400).json({ message: 'All fields are required and must be valid' });
//   }

//   // const formattedPropertyDate = moment(property_date).tz("Asia/Kolkata").format("YYYY-MM-DDTHH:mm:ss");
//    const created_on = moment().tz("Asia/Kolkata").format("YYYY-MM-DDTHH:mm:ss");  // Current date for created_on
//    const updated_on = created_on;  // Same value for updated_on initially
//    const status = 1;  // Active status by default

//   // Check if the username already exists
//   db.query('SELECT * FROM user WHERE username = ?', [username], (err, results) => {
//     if (err) {
//       console.error("Database Select Error: ", err); // Log any database select errors
//       return res.status(500).json({ message: 'Database error' });
//     }

//     if (results.length > 0) {
//       return res.status(409).json({ message: 'Username already taken' });
//     }

//     // If username is not taken, proceed with registration
//     const hashedPassword = bcrypt.hashSync(password, 10);
//     const token = randomstring.generate();

//     db.query('INSERT INTO user SET ?', {username, password: hashedPassword, token ,name_surname,gstNo,address,phone,created_on,updated_on,status }, (err) => {
//       if (err) {
//         console.error("Database Insert Error: ", err); // Log the actual error
//         return res.status(500).json({ message: 'Database error' });
//       }

//       // Send verification email
//       sendVerificationEmail(username, token);

//       // Respond with success message
//       res.status(200).json({ message: 'User registered. Please check your email to verify your account.' });
//     });
//   });
// };


// Login Route
export const login =  (req, res) => {
  const { username, password } = req.body;

  // Check if user exists in the database
  db.query('SELECT * FROM user WHERE username = ?', [username], (err, results) => {
    if (err) {
      console.error("Database Select Error: ", err);
      return res.status(500).json({ message: 'Internal server error. Please try again later.' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = results[0];

    // Verify the password
    const passwordMatch = bcrypt.compareSync(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    // Check if email is verified (if required)
    // if (user.token) {
    //   return res.status(403).json({ message: 'Please verify your email before logging in.' });
    // }

    console.log(process.env.JWT_SECRET);
    // Generate JWT
    const jwttoken = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Set the JWT token in an HTTP-only cookie
    res.cookie('jwttoken', jwttoken, { 
      // httpOnly: true,
      // expires: new Date(Date.now()+ 25892000000)
      // secure: process.env.NODE_ENV === 'production' 
    });
    // console.log('User found:', user);
    // console.log('Password matched:', passwordMatch);
    // console.log('Generated Token:', jwttoken);


    return res.status(200).json({ message: 'Login successful' });
  });
};

// Protected Route Example (requires JWT)
export const protectedRoute = (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    return res.status(200).json({ message: 'Access granted', user: decoded });
  });
};

export const verifyEmail = async (req, res) => {
  const { token } = req.params;

  try {
    // Verify if the token is valid and update the user
    const result = await db.query('UPDATE user SET token = NULL WHERE token = ?', [token]);

    if (result.affectedRows === 0) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    } 

    return res.status(200).json({ message: 'Email verified successfully. You can now log in.' });
  } catch (err) {
    console.error("Email Verification Error: ", err);
    return res.status(500).json({ message: 'Internal server error. Please try again later.' });
  }
};



  
// export const login = (req, res) => {
//   const { username, password } = req.body;

//   // Check if user exists
//   db.query('SELECT * FROM user WHERE username = ?', [username], (err, results) => {
//     if (err) {
//       console.error("Database Select Error: ", err); // Log any database select errors
//       return res.status(500).json({ message: 'Internal server error. Please try again later.' });
//     }

//     if (results.length === 0) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     const user = results[0];

//     // Verify password
//     const passwordMatch = bcrypt.compareSync(password, user.password);
//     if (!passwordMatch) {
//       return res.status(401).json({ message: 'Incorrect password' });
//     }

//     // Check if email is verified
//     if (user.token) {
//       return res.status(403).json({ message: 'Please verify your email before logging in.' });
//     }

//     // Generate JWT
//     const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

//     // Set cookie and return success
//     res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
//     return res.status(200).json({ message: 'Login successful' });
//   });
// };
