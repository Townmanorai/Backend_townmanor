import db from '../config/db.js';
import upload from '../middlewares/multerConfig.js';

// Helper function to save agent to the database
const saveAgentToDatabase = (agentData) => {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO agentlist SET ?';
    db.query(sql, agentData, (err, result) => {
      if (err) {
        return reject(err);
      }
      resolve(result);
    });
  });
};

// Add agent (with file upload)
export const addAgent = (req, res) => {
  upload.single('file')(req, res, (err) => {
    if (err) {
      return res.status(500).json({ error: 'Error uploading file' });
    }

    const { name, username, email, city, sector, phone, reraRegnNo, aadhaarNo, panNo } = req.body;
    const imageUrl = req.file ? req.file.filename : null;

    if (!name || !username || !email || !city || !sector || !phone) {
      return res.status(400).json({ error: 'All required fields must be provided' });
    }

    const agentData = { name, username, email, city, sector, phone, reraRegnNo, aadhaarNo, panNo, imageUrl };

    saveAgentToDatabase(agentData)
      .then(() => res.json({ message: 'User added successfully' }))
      .catch((error) => {
        console.error('Database error:', error);
        res.status(500).json({ error: 'An error occurred while saving the agent data' });
      });
  });
};

// Get all agents
export const getAllAgents = (req, res) => {
  const sql = 'SELECT * FROM agentlist';
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(200).json(results);
  });
};

// Get agent by ID
export const getAgentById = (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM agentlist WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (result.length === 0) {
      return res.status(404).send('Agent not found');
    }
    res.status(200).json(result[0]);
  });
};
