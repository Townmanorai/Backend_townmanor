import db from '../config/db.js';

// GET all commercial units
export const getCommercialUnits = (req, res) => {
  db.query('SELECT * FROM commercial_units WHERE status != 0', (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error fetching commercial units', details: err });
    }
    res.status(200).json(results);
  });
};

// GET commercial unit by ID
export const getCommercialUnitById = (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM commercial_units WHERE id = ? AND status != 0', [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error fetching commercial unit by ID', details: err });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Commercial unit not found' });
    }
    res.status(200).json(results[0]);
  });
};

// POST new commercial unit
export const createCommercialUnit = (req, res) => {
  const { com_prop_id, category, name, price, othercharge, paymentplan, floorplan, available_unit, total_unit } = req.body;
  
  db.query(
    `INSERT INTO commercial_units (com_prop_id, category, name, price, othercharge, paymentplan, floorplan, available_unit, total_unit)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [com_prop_id, category, name, price, JSON.stringify(othercharge), JSON.stringify(paymentplan), floorplan, available_unit, total_unit],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Error creating commercial unit', details: err });
      }
      res.status(201).json({ message: 'Commercial unit created successfully', id: results.insertId });
    }
  );
};

// PUT (update) commercial unit by ID
export const updateCommercialUnit = (req, res) => {
  const { id } = req.params;
  const { com_prop_id, category, name, price, othercharge, paymentplan, floorplan, available_unit, total_unit } = req.body;

  db.query(
    `UPDATE commercial_units SET com_prop_id = ?, category = ?, name = ?, price = ?, othercharge = ?, paymentplan = ?, floorplan = ?, available_unit = ?, total_unit = ? WHERE id = ?`,
    [com_prop_id, category, name, price, JSON.stringify(othercharge), JSON.stringify(paymentplan), floorplan, available_unit, total_unit, id],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Error updating commercial unit', details: err });
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ error: 'Commercial unit not found' });
      }
      res.status(200).json({ message: 'Commercial unit updated successfully' });
    }
  );
};

// DELETE (soft delete, change status to 0) commercial unit by ID
export const deleteCommercialUnit = (req, res) => {
  const { id } = req.params;
  db.query('UPDATE commercial_units SET status = 0 WHERE id = ?', [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error deleting commercial unit', details: err });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Commercial unit not found' });
    }
    res.status(200).json({ message: 'Commercial unit deleted successfully' });
  });
};
