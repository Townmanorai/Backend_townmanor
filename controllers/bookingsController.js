import db from '../config/db.js';

// Get booking by ID
export const getBookingById = (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM bookings WHERE id = ?';
  db.query(sql, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error', details: err });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    res.json(results[0]);
  });
};

// Create a new booking
export const createBooking = (req, res) => {
  const bookingData = req.body;
  // Adjust the fields below to match your bookings table columns
  const sql = 'INSERT INTO bookings SET ?';
  db.query(sql, bookingData, (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Database error', details: err });
    }
    res.status(201).json({ message: 'Booking created', bookingId: result.insertId });
  });
};

// Update profile_picture, payment_receipt, and status for a booking
export const updateBookingFields = (req, res) => {
  const { id } = req.params;
  const { profile_picture, payment_receipt, status } = req.body;
  // Build dynamic SQL and values array
  const fields = [];
  const values = [];
  if (profile_picture !== undefined) {
    fields.push('profile_picture = ?');
    values.push(profile_picture);
  }
  if (payment_receipt !== undefined) {
    fields.push('payment_receipt = ?');
    values.push(payment_receipt);
  }
  if (status !== undefined) {
    fields.push('status = ?');
    values.push(status);
  }
  if (fields.length === 0) {
    return res.status(400).json({ error: 'No valid fields provided to update.' });
  }
  const sql = `UPDATE bookings SET ${fields.join(', ')} WHERE id = ?`;
  values.push(id);
  db.query(sql, values, (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Database error', details: err });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    res.json({ message: 'Booking updated successfully' });
  });
  
};

// Get only start_date, end_date, and status for all bookings by room_id
export const getBookingDatesByRoomId = (req, res) => {
  const { room_id } = req.params;
  const sql = 'SELECT start_date, end_date, status FROM bookings WHERE room_id = ?';
  db.query(sql, [room_id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error', details: err });
    }
    res.json(results);
  });
};

