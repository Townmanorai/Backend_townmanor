

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
  // console.log("username singup ", username, password,name_surname,gstNo,address,phone,email);

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
      // console.error("Database Select Error: ", err); // Log any database select errors
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
        // console.error("Database Insert Error: ", err); // Log the actual error
        return res.status(500).json({ message: 'Database error' });
      }

      // Send verification email
      sendVerificationEmail(username,name_surname,phone, address, email, token);

      // Respond with success message
      res.status(200).json({ message: 'User registered. Please check your email to verify your account.' });
    });
  });
};





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

    // After successful verification, redirect the user to the desired URL
    return res.redirect(302, 'https://www.townmanor.ai/auth');  // Send HTTP redirect to the login page
  } catch (err) {
    console.error("Email Verification Error: ", err);
    return res.status(500).json({ message: 'Internal server error. Please try again later.' });
  }
};

// ─── New Admin APIs ─────────────────────────────────────────────────────────────

/**
 * GET /api/users
 */
export const getUsers = (req, res) => {
  const sql = `
    SELECT 
      id, username, name_surname, gstNo, address, phone, email,
      created_on, updated_on, status
    FROM user
    ORDER BY created_on DESC
  `;
  db.query(sql, (err, results) => {
    if (err) {
      console.error('DB error [getUsers]:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }
    res.json(results);
  });
};

/**
 * GET /api/users/:id
 */
export const getUserById = (req, res) => {
  const { id } = req.params;
  const sql = `
    SELECT 
      id, username, name_surname, gstNo, address, phone, email,
      created_on, updated_on, status
    FROM user
    WHERE id = ?
  `;
  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error('DB error [getUserById]:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }
    if (!results.length) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(results[0]);
  });
};

/**
 * PUT /api/users/:id
 */
// export const updateUser = (req, res) => {
//   const { id } = req.params;
//   const {
//     username,
//     password,
//     name_surname,
//     gstNo,
//     address,
//     phone,
//     email,
//     status
//   } = req.body;

//   // Optional: re‑validate inputs here

//   // If password is being updated, hash it
//   const updateFields = [];
//   const args = [];

//   if (username)      { updateFields.push('username = ?');      args.push(username); }
//   if (password)      { 
//     const hashed = bcrypt.hashSync(password, 10);
//     updateFields.push('password = ?');
//     args.push(hashed);
//   }
//   if (name_surname)  { updateFields.push('name_surname = ?');  args.push(name_surname); }
//   if (gstNo)         { updateFields.push('gstNo = ?');         args.push(gstNo); }
//   if (address)       { updateFields.push('address = ?');       args.push(address); }
//   if (phone)         { updateFields.push('phone = ?');         args.push(phone); }
//   if (email)         { updateFields.push('email = ?');         args.push(email); }
//   if (typeof status !== 'undefined') {
//     updateFields.push('status = ?');
//     args.push(status);
//   }

//   if (!updateFields.length) {
//     return res.status(400).json({ message: 'No fields to update' });
//   }

//   // always update updated_on
//   updateFields.push('updated_on = ?');
//   args.push(moment().tz('Asia/Kolkata').format('YYYY-MM-DDTHH:mm:ss'));

//   const sql = `
//     UPDATE \`user\`
//        SET ${updateFields.join(', ')}
//      WHERE id = ?
//   `;
//   args.push(id);

//   db.query(sql, args, (err, result) => {
//     if (err) {
//       console.error('DB error [updateUser]:', err);
//       return res.status(500).json({ message: 'Internal server error' });
//     }
//     res.json({ message: 'User updated' });
//   });
// };

/**
 * DELETE /api/users/:id
 */
export const deleteUser = (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM user WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('DB error [deleteUser]:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted' });
  });
};


  