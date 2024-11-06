import express from 'express';
import db from '../config/db.js';
import jwt from 'jsonwebtoken';  // Make sure you have JWT installed

const router = express.Router();

// // Route to save the property lead
// router.post('/property_lead', (req, res) => {
//   const { property_id } = req.body;

//   // Extract the JWT token from cookies
//   const token = req.cookies.jwt_token;

//   if (!token) {
//     return res.status(401).json({ error: 'Unauthorized. No token provided.' });
//   }

//   // Decode the token to get the username
//   jwt.verify(token, 'your_jwt_secret', (err, decoded) => {
//     if (err) {
//       return res.status(403).json({ error: 'Failed to authenticate token.' });
//     }

//     const username = decoded.username;

//     // Fetch user details from the user table using the username
//     db.query('SELECT username, name, phone FROM user WHERE username = ?', [username], (err, results) => {
//       if (err) {
//         return res.status(500).json({ error: 'Database query error' });
//       }

//       if (results.length === 0) {
//         return res.status(404).json({ error: 'User not found' });
//       }

//       const user = results[0];

//       // Insert the property lead details into the property_lead table
//       db.query(
//         'INSERT INTO property_lead (property_id, username, name, phone) VALUES (?, ?, ?, ?)',
//         [property_id, user.username, user.name, user.phone],
//         (err) => {
//           if (err) {
//             return res.status(500).json({ error: 'Failed to save property lead' });
//           }
//           return res.status(200).json({ message: 'Property lead saved successfully' });
//         }
//       );
//     });
//   });
// });


// POST route to save a property lead
router.post('/property_lead', (req, res) => {
    const { username, property_id } = req.body;
  
    // Check if the property lead already exists for this username and property_id
    const checkQuery = 'SELECT * FROM property_lead WHERE username = ? AND property_id = ?';
    db.query(checkQuery, [username, property_id], (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
  
      // If a record is found, send a message saying the lead already exists
      if (results.length > 0) {
        return res.status(400).json({ message: 'Lead already exists for this property' });
      }
  
      // If no record is found, insert the new lead
      const insertQuery = 'INSERT INTO property_lead (username, property_id, name, phone) VALUES (?, ?, ?, ?)';
      db.query(insertQuery, [username, property_id, req.body.name, req.body.phone], (err, result) => {
        if (err) {
          return res.status(500).json({ error: 'Failed to save lead' });
        }
        return res.json({ message: 'Lead saved successfully' });
      });
    });
  });

  router.get('/property_lead/:id', (req, res) => {
    const propertyId = req.params.id;
    const query = 'SELECT name, phone FROM property_lead WHERE property_id = ?';

    db.query(query, [propertyId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to retrieve leads' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'No leads found for this property' });
        }

        res.json(results); // Send back an array of lead details (name, phone)
    });
});

  

export default router;
