import db from '../config/db.js';

export const getAllColivingRooms = (req, res) => {
  const sql = 'SELECT * FROM coliving_rooms';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({
        success: false,
        error: 'Database error'
      });
    }
    res.status(200).json({
      success: true,
      data: results
    });
  });
};

export const getColivingRoomById = (req, res) => {
  const sql = 'SELECT * FROM coliving_rooms WHERE id = ?';
  db.query(sql, [req.params.id], (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        error: 'Database error'
      });
    }
    if (!result.length) {
      return res.status(404).json({
        success: false,
        error: 'Room not found'
      });
    }
    res.status(200).json({
      success: true,
      data: result[0]
    });
  });
};

export const createColivingRoom = (req, res) => {
  const {
    price,
    area,
    bathroom,
    bedroom,
    dedicated_work_space
  } = req.body;

  const sql = `INSERT INTO coliving_rooms SET ?`;
  const data = {
    price,
    area,
    bathroom,
    bedroom,
    dedicated_work_space
  };

  db.query(sql, data, (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({
        success: false,
        error: 'Failed to create room'
      });
    }
    res.status(201).json({
      success: true,
      data: { id: result.insertId, ...data }
    });
  });
};

export const updateColivingRoom = (req, res) => {
  const { id } = req.params;
  const updateData = { ...req.body };

  const fields = Object.keys(updateData)
    .filter(key => updateData[key] !== undefined)
    .map(key => `${key} = ?`);
  const values = [...Object.values(updateData).filter(val => val !== undefined), id];

  const sql = `UPDATE coliving_rooms SET ${fields.join(', ')} WHERE id = ?`;
  
  db.query(sql, values, (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        error: 'Database error'
      });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'Room not found'
      });
    }
    res.json({
      success: true,
      message: 'Room updated successfully'
    });
  });
};

export const deleteColivingRoom = (req, res) => {
  const sql = 'DELETE FROM coliving_rooms WHERE id = ?';
  db.query(sql, [req.params.id], (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        error: 'Database error'
      });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'Room not found'
      });
    }
    res.json({
      success: true,
      message: 'Room deleted successfully'
    });
  });
};