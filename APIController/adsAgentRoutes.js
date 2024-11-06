import express from 'express';
import upload from '../middlewares/multerConfig.js';
import db from '../config/db.js';

const router = express.Router();

// Get all agents
router.get('/adsagents', (req, res) => {
  const sql = 'SELECT * FROM townmanor.agents';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).send(err);
    }
    res.status(200).json(results);
  });
});

// adsagents.js (example)
router.post('/adsagents', (req, res) => {
  const { propertyName, propertyId, agentName, agentUsername, address, totalListings, state, city } = req.body;

  // Log the incoming data to ensure it is correct
  console.log("Received data:", req.body);

  // Validate the required fields
  if (!propertyName || !propertyId || !agentName) {
    return res.status(400).send('Missing required fields');
  }

  // Construct the agent profile and agent URL fields
  const agentProfile = JSON.stringify({
    activated: true,
    registrationDate: new Date().toISOString().slice(0, 10)
  });

  const agentUrl = `/agent/${agentUsername}`;
  
  // Provide a default image URL if none is available
  const defaultImageUrl = '/images/default-agent.png'; // You can change this to the actual default image URL

  // Define the SQL query to insert into the adsagents table
  const sql = `
    INSERT INTO agents (nameSurname, agentUrl, address, imageUrl)
    VALUES (?, ?, ?, ?)
  `;

  // Execute the query with the values from the formData
  db.query(sql, [agentName, agentUrl, address, defaultImageUrl], (err, result) => {
    if (err) {
      console.error("Error inserting into agents table:", err);
      return res.status(500).send('Error saving agent data');
    }

    // Return the inserted agent ID as a response
    res.status(200).json({ newAgentId: result.insertId });
  });
});




// Get agent by ID
router.get('/adsagents/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM townmanor.agents WHERE id = ?';

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).send(err);
    }
    if (result.length === 0) {
      return res.status(404).send('Agent not found');
    }
    res.status(200).json(result[0]);
  });
});

// Update an agent by ID
router.put('/adsagents/:id', upload.single('file'), (req, res) => {
  const { id } = req.params;
  const { imageUrl, nameSurname, agentUrl, address, totalListingsNum, agentProfile } = req.body;
  const image = req.file ? req.file.filename : null;

  const sql = 'UPDATE townmanor.agents SET imageUrl = ?, nameSurname = ?, agentUrl = ?, address = ?, agentProfile = ?, totalListingsNum = ? WHERE id = ?';
  const values = [imageUrl || image, nameSurname, agentUrl, address, JSON.stringify(agentProfile), totalListingsNum, id];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).send(err);
    }
    if (result.affectedRows === 0) {
      return res.status(404).send('Agent not found');
    }
    res.json({ message: 'Agent updated successfully' });
  });
});

// Delete an agent by ID
router.delete('/adsagents/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM townmanor.agents WHERE id = ?';

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).send(err);
    }
    if (result.affectedRows === 0) {
      return res.status(404).send('Agent not found');
    }
    res.json({ message: 'Agent deleted successfully' });
  });
});

// Get top agents by total listings
router.get('/adsagents/top', (req, res) => {
  const sql = 'SELECT * FROM townmanor.agents ORDER BY totalListingsNum DESC LIMIT 10';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).send(err);
    }
    res.status(200).json(results);
  });
});

export default router;
