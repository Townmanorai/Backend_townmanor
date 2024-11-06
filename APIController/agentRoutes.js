import express from 'express';
import upload from '../middlewares/multerConfig.js';
import db from '../config/db.js';

const router = express.Router();

// Add a new agent
router.post('/addagent', upload.single('file'), (req, res) => {
  const { name, username, email, city, sector, phone, experience, reraRegnNo, aadhaarNo, panNo } = req.body;
  const imageUrl = req.file ? req.file.filename : null;

  if (!name || !username || !email || !city || !sector || !phone) {
    return res.status(400).json({ error: 'All required fields must be provided' });
  }

  const agentData = { name, username, email, city, sector, phone, reraRegnNo, aadhaarNo, panNo, imageUrl };

  db.query('INSERT INTO agentlist SET ?', agentData, (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'An error occurred while saving the agent data' });
    }
    res.json({ message: 'Agent added successfully' });
  });
});

router.get('/agents', (req, res) => {
  const { city, sector, rent, newProperty, resale, page = 1, limit = 6 } = req.query;

  // Initialize arrays to store conditions and parameters
  let conditions = [];
  let queryParams = [];

  // Check if city and locality are provided and are valid
  if (city && city !== 'undefined') {
    conditions.push('city = ?');
    queryParams.push(city);
  }
  if (sector && sector !== 'undefined') {
    conditions.push('sector = ?');
    queryParams.push(sector);
  }

  // Check each filter parameter and include only those with value 1
  if (rent === '1') {
    conditions.push('rent = 1');
  }
  if (newProperty === '1') {
    conditions.push('newProperty = 1');
  }
  if (resale === '1') {
    conditions.push('resale = 1');
  }

  // Calculate offset
  const offset = (page - 1) * limit;

  // Construct the SQL query based on included conditions
  let sql = 'SELECT * FROM agentlist';
  if (conditions.length > 0) {
    sql += ' WHERE ' + conditions.join(' AND ');
  }

  // Add pagination
  sql += ' LIMIT ? OFFSET ?';
  queryParams.push(parseInt(limit), parseInt(offset));

  console.log(sql, queryParams);

  db.query(sql, queryParams, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).send(err);
    }

    // Get the total count of agents without pagination
    let countSql = 'SELECT COUNT(*) as total FROM agentlist';
    if (conditions.length > 0) {
      countSql += ' WHERE ' + conditions.join(' AND ');
    }

    db.query(countSql, queryParams.slice(0, -2), (countErr, countResults) => {
      if (countErr) {
        console.error('Database error:', countErr);
        return res.status(500).send(countErr);
      }

      const total = countResults[0].total;
      const totalPages = Math.ceil(total / limit);

      res.status(200).json({
        agents: results,
        totalPages,
        currentPage: parseInt(page),
      });
    });
  });
});


// Get agent by ID
router.get('/agents/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM agentlist WHERE id = ?';

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
router.put('/agents/:id', upload.single('file'), (req, res) => {
  const { id } = req.params;
  const { name, username, email, city, sector, phone, experience, reraRegnNo, aadhaarNo, panNo } = req.body;
  const imageUrl = req.file ? req.file.filename : null;

  const sql = 'UPDATE agentlist SET name = ?, username = ?, email = ?, city = ?, sector = ?, phone = ?, experience = ?, reraRegnNo = ?, aadhaarNo = ?, panNo = ?, imageUrl = ? WHERE id = ?';
  const values = [name, username, email, city, sector, phone, experience, reraRegnNo, aadhaarNo, panNo, imageUrl, id];

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
router.delete('/agents/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM agentlist WHERE id = ?';

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

// Get all locations
router.get('/locations', (req, res) => {
  const sql = 'SELECT * FROM location';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).send(err);
    }
    res.status(200).json(results);
  });
});

// Get all localities by city
router.get('/localities', (req, res) => {
  const city = req.query.city;
  const sql = 'SELECT * FROM localities WHERE city = ?';
  db.query(sql, [city], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).send(err);
    }
    res.status(200).json(results);
  });
});

// Get top agents by transactions
router.get('/topagents', (req, res) => {
  const sql = 'SELECT * FROM agentlist ORDER BY transactions DESC LIMIT 10';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).send(err);
    }
    res.status(200).json(results);
  });
});

export default router;
