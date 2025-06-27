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