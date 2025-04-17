import db from '../config/db.js';

export const getLeads = (req, res) => {
  const { purpose, source } = req.query;
  let sql    = 'SELECT * FROM lead_generation WHERE 1';
  const args = [];

  if (purpose) {
    sql += ' AND purpose = ?';
    args.push(purpose);
  }
  if (source) {
    sql += ' AND source = ?';
    args.push(source);
  }

  sql += ' ORDER BY created_at DESC';

  db.query(sql, args, (err, results) => {
    if (err) {
      console.error('DB error:', err);
      return res.status(500).json({ error: err });
    }
    res.json(results);
  });
};

export const createLead = (req, res) => {
  const { name, phone_number, purpose, source } = req.body;

  const sql  = `
    INSERT INTO lead_generation
      (name, phone_number, purpose, source)
    VALUES (?, ?, ?, ?)
  `;
  const args = [name, phone_number, purpose, source];

  db.query(sql, args, (err, result) => {
    if (err) {
      console.error('DB error:', err);
      return res.status(500).json({ error: err });
    }
    res.status(201).json({ id: result.insertId });
  });
};
