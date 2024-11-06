import express from 'express';
import upload from '../middlewares/multerConfig.js';
import db from '../config/db.js';

const router = express.Router();

// Get all agents
router.get('/user', (req, res) => {
  const sql = 'SELECT * FROM townmanor.user';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).send(err);
    }
    res.status(200).json(results);
  });
});

router.post('/login', (req, res) => {
  const { username, password } = req.body; // Destructure username and password

  // Query to find the user by username
  const sql = 'SELECT * FROM townmanor.user WHERE username = ?';

  db.query(sql, [username], (err, results) => {
      if (err) {
          console.error('Database error:', err);
          return res.status(500).send(err);
      }

      if (results.length === 0) {
          return res.status(401).json({ message: 'Invalid credentials' }); // Unauthorized
      }

      const user = results[0];

      // Compare provided password with the stored password
      if (user.password !== password) {
          return res.status(401).json({ message: 'Invalid credentials' });
      }

      // If credentials are valid, send a success response
      res.status(200).json({ message: 'Login successful', user }); // Return user info as needed
  });
});



// Get user by username
router.get('/user/:username', (req, res) => {
    const { username } = req.params;
    
    // Query to get the user and their property listing by username
    const sql = 'SELECT * FROM townmanor.user WHERE username = ?';
  
    db.query(sql, [username], (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).send(err);
      }
  
      if (results.length === 0) {
        return res.status(404).send({ message: 'User not found' });
      }
  
      // Assuming propertylisting is stored as a string (e.g., "1,22") in the database, we convert it to an array
      const user = results[0];
      // user.propertylisting = user.propertylisting.split(','); // Convert "1,22" to ["1", "22"]
  
      res.status(200).json(user);
    });
  });

export default router;
