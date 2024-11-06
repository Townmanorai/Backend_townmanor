import express from 'express';
import upload from '../middlewares/multerConfig.js';
import db from '../config/db.js';


const router = express.Router();

router.get('/userplanslimit', (req, res) => {
    const sql = 'SELECT * FROM townmanor.user_plans_limit;';
    db.query(sql, (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).send(err);
      }
      res.status(200).json(results);
    });
  });

  router.put('/userplanslimit/:username', (req, res) => {
    const { username } = req.params;
    const { featured_agent, agent_on_spotlight } = req.body;
    console.log("username",username,featured_agent,agent_on_spotlight)
    const sql = 'UPDATE user_plans_limit SET featured_agent = ?, agent_on_spotlight = ? WHERE username = ?';
    db.query(sql, [featured_agent, agent_on_spotlight, username], (err, result) => {
      if (err) return res.status(500).send(err);
      res.status(200).send('Limits updated');
    });
  });

  router.get('/userplanslimit/:username', (req, res) => {
    const username = req.params.username;
    const sql = 'SELECT * FROM townmanor.user_plans_limit WHERE username = ?';

    db.query(sql, [username], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send(err);
        }
        if (results.length > 0) {
            res.status(200).json(results[0]); // Send the first matching package
        } else {
            res.status(404).json({ message: 'Package not found' });
        }
    });
});



// Update wallet balance (owner_details) for a specific user
router.put('/userplanslimit/:username', (req, res) => {
    const username = req.params.username;
    const { owner_details } = req.body; // The new wallet balance
  
    // Validate input
    if (typeof owner_details !== 'number' || owner_details < 0) {
      return res.status(400).json({ message: 'Invalid wallet balance' });
    }
  
    const sql = 'UPDATE townmanor.user_plans_limit SET owner_details = ? WHERE username = ?';
    db.query(sql, [owner_details, username], (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).send(err);
      }
      if (result.affectedRows > 0) {
        res.status(200).json({ message: 'Wallet balance updated successfully' });
      } else {
        res.status(404).json({ message: 'User plan not found' });
      }
    });
  });
  


export default router;
