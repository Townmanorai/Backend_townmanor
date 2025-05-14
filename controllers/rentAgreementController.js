import db from '../config/db.js';

// Get all rent agreements
export const getAllRentAgreements = (req, res) => {
  const sql = 'SELECT * FROM RentAgreement ORDER BY created_at DESC';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch rent agreements'
      });
    }
    res.status(200).json({
      success: true,
      count: results.length,
      data: results
    });
  });
};

// Get single rent agreement
export const getRentAgreementById = (req, res) => {
  const sql = 'SELECT * FROM RentAgreement WHERE id = ?';
  db.query(sql, [req.params.id], (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch rent agreement'
      });
    }
    if (!result.length) {
      return res.status(404).json({
        success: false,
        error: 'Rent agreement not found'
      });
    }
    res.status(200).json({
      success: true,
      data: result[0]
    });
  });
};

// Create new rent agreement
export const createRentAgreement = (req, res) => {
  const agreementData = {
    ...req.body,
    created_at: new Date(),
    updated_at: new Date()
  };

  const sql = `INSERT INTO RentAgreement SET ?`;
  db.query(sql, agreementData, (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({
        success: false,
        error: 'Failed to create rent agreement'
      });
    }
    res.status(201).json({
      success: true,
      message: 'Rent agreement created successfully',
      data: { id: result.insertId, ...agreementData }
    });
  });
};

// Update rent agreement
export const updateRentAgreement = (req, res) => {
  const { id } = req.params;
  const updateData = {
    ...req.body,
    updated_at: new Date()
  };

  const sql = `UPDATE RentAgreement SET ? WHERE id = ?`;
  db.query(sql, [updateData, id], (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        error: 'Failed to update rent agreement'
      });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'Rent agreement not found'
      });
    }
    res.json({
      success: true,
      message: 'Rent agreement updated successfully'
    });
  });
};

// Delete rent agreement
export const deleteRentAgreement = (req, res) => {
  const sql = 'DELETE FROM RentAgreement WHERE id = ?';
  db.query(sql, [req.params.id], (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        error: 'Failed to delete rent agreement'
      });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'Rent agreement not found'
      });
    }
    res.json({
      success: true,
      message: 'Rent agreement deleted successfully'
    });
  });
};