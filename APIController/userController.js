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

    console.log("JWT Secret:", process.env.JWT_SECRET);
    // Generate JWT with 7 days expiration
    const jwttoken = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '7d' });
    console.log("Generated JWT Token:", jwttoken);

    // Set access control headers for the response
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    
    // Set the JWT token in an HTTP-only cookie with more compatible settings
    res.cookie('jwttoken', jwttoken, { 
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
      path: '/',
      // httpOnly: true,
      // secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' // Less strict same-site policy for better compatibility
    });
    
    console.log("Setting cookie:", 'jwttoken=' + jwttoken);
    console.log("Response cookies:", res.getHeaders()['set-cookie']);

    return res.status(200).json({ message: 'Login successful', token: jwttoken });
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

// Get all user
export const getUsers = (req, res) => {
  db.query('SELECT * FROM user', (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error fetching blogs', details: err });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'No user found' });
    }
    res.status(200).json(results);
  });
};

// Get user by ID
export const getUserById = (req, res) => {
  const { id } = req.params;

  db.query('SELECT * FROM user WHERE id = ? ', [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error fetching user', details: err });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'user not found' });
    }
    res.status(200).json(results[0]);
  });
};


/**
 * GET /api/users
 */
// export const getUsers = (req, res) => {
//   const sql = `
//     SELECT * FROM user
//     ORDER BY created_on DESC
//   `;
//   db.query(sql, (err, results) => {
//     if (err) {
//       console.error('DB error [getUsers]:', err);
//       return res.status(500).json({ message: 'Internal server error' });
//     }
//     res.json(results);
//   });
// };

/**
 * GET /api/users/:id
 */
// export const getUserById = (req, res) => {
//   const { id } = req.params;
//   const sql = `
//     SELECT 
//       id, username, name_surname, gstNo, address, phone, email,
//       created_on, updated_on, status
//     FROM user
//     WHERE id = ?
//   `;
//   db.query(sql, [id], (err, results) => {
//     if (err) {
//       console.error('DB error [getUserById]:', err);
//       return res.status(500).json({ message: 'Internal server error' });
//     }
//     if (!results.length) {
//       return res.status(404).json({ message: 'User not found' });
//     }
//     res.json(results[0]);
//   });
// };

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
// export const deleteUser = (req, res) => {
//   const { id } = req.params;
//   const sql = 'DELETE FROM user WHERE id = ?';
//   db.query(sql, [id], (err, result) => {
//     if (err) {
//       console.error('DB error [deleteUser]:', err);
//       return res.status(500).json({ message: 'Internal server error' });
//     }
//     if (result.affectedRows === 0) {
//       return res.status(404).json({ message: 'User not found' });
//     }
//     res.json({ message: 'User deleted' });
//   });
// };

// Google Authentication Login
export const googleLogin = (req, res) => {
  const { email, displayName, uid } = req.body;

  if (!email || !uid) {
    return res.status(400).json({ message: 'Email and uid are required' });
  }

  // Check if user with this email already exists
  db.query('SELECT * FROM user WHERE email = ?', [email], (err, results) => {
    if (err) {
      console.error("Database Select Error: ", err);
      return res.status(500).json({ message: 'Internal server error. Please try again later.' });
    }

    let userId;
    
    if (results.length === 0) {
      // User doesn't exist, create a new one
      const username = email;
      const name_surname = displayName || email.split('@')[0];
      const created_on = moment().tz("Asia/Kolkata").format("YYYY-MM-DDTHH:mm:ss");
      const updated_on = created_on;
      const status = 1;
      
      // Create password hash for a random password (user will use Google login anyway)
      const randomPassword = Math.random().toString(36).slice(-10);
      const hashedPassword = bcrypt.hashSync(randomPassword, 10);
      
      // Insert the new user
      db.query(
        'INSERT INTO user SET ?', 
        {
          username, 
          password: hashedPassword,
          name_surname,
          email,
          created_on,
          updated_on,
          status,
          google_uid: uid
        }, 
        (err, result) => {
          if (err) {
            console.error("Database Insert Error: ", err);
            return res.status(500).json({ message: 'Failed to create user account' });
          }
          
          userId = result.insertId;
          generateAndSendToken(userId, username, res);
        }
      );
    } else {
      // User exists, update their Google UID if needed
      const user = results[0];
      userId = user.id;
      
      if (!user.google_uid) {
        db.query('UPDATE user SET google_uid = ? WHERE id = ?', [uid, userId], (err) => {
          if (err) {
            console.error("Database Update Error: ", err);
            // Continue anyway - this is not critical
          }
        });
      }
      
      generateAndSendToken(userId, user.username, res);
    }
  });
};

// Helper function to generate JWT token and send response
function generateAndSendToken(userId, username, res) {
  // Generate JWT
  console.log("Generating token for userId:", userId, "username:", username);
  console.log("JWT Secret:", process.env.JWT_SECRET);
  const jwttoken = jwt.sign({ id: userId, username: username }, process.env.JWT_SECRET, { expiresIn: '10h' });
  console.log("Generated JWT Token:", jwttoken);

  // Set access control headers for the response
  res.header('Access-Control-Allow-Origin', res.req.headers.origin || '*');
  res.header('Access-Control-Allow-Credentials', 'true');

  // Set the JWT token in an HTTP-only cookie with more compatible settings
  res.cookie('jwttoken', jwttoken, {
    maxAge: 36000000, // 10 hours in milliseconds
    path: '/',
    // httpOnly: true,
    // secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' // Less strict same-site policy for better compatibility
  });
  
  console.log("Setting cookie:", 'jwttoken=' + jwttoken);
  console.log("Response cookies:", res.getHeaders()['set-cookie']);

  return res.status(200).json({ message: 'Login successful', token: jwttoken });
}

// Check if token is valid
export const checkToken = (req, res) => {
  // Get the token from cookies or authorization header
  const token = req.cookies.jwttoken || (req.headers.authorization && req.headers.authorization.startsWith('Bearer ') 
    ? req.headers.authorization.split(' ')[1] : null);
  
  console.log("Checking token:", token);
  console.log("Cookies received:", req.cookies);
  console.log("Headers received:", req.headers);

  if (!token) {
    return res.status(401).json({ message: 'No token provided', authenticated: false });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token is valid, decoded:", decoded);
    return res.status(200).json({ message: 'Token is valid', authenticated: true, user: decoded });
  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(401).json({ message: 'Invalid or expired token', authenticated: false });
  }
};

  