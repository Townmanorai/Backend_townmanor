import express from 'express';
import db from '../config/db.js';

const router = express.Router();

// Add new home shift request (POST)
router.post('/home-shift', (req, res) => {
    const {
        name, phone, pickup_location, drop_location
    } = req.body;

    const sql = `
        INSERT INTO home_shift 
        (name, phone, pickup_location, drop_location) 
        VALUES (?, ?, ?, ?)
    `;
    const values = [name, phone, pickup_location, drop_location];
    db.query(sql, values, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database error while adding home shift request.' });
        }
        res.status(201).json({ message: 'Home shift request created successfully.' });
    });
});

// Get all home shift records (GET)
router.get('/home-shift', (req, res) => {
    const sql = 'SELECT * FROM home_shift';
    db.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database error while fetching home shift records.' });
        }
        res.status(200).json(results);
    });
});

// Get home shift by ID (GET)
router.get('/home-shift/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM home_shift WHERE id = ?';
    db.query(sql, [id], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database error while fetching the home shift record.' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Home shift record not found.' });
        }
        res.status(200).json(results[0]);
    });
});

// Update home shift record (PUT)
router.put('/home-shift/:id', (req, res) => {
    const { id } = req.params;
    const {
        name, phone, pickup_location, drop_location
    } = req.body;

    const sql = `
        UPDATE home_shift 
        SET name = ?, phone = ?, pickup_location = ?, drop_location = ?, updated_at = CURRENT_TIMESTAMP 
        WHERE id = ?
    `;
    const values = [name, phone, pickup_location, drop_location, id];
    db.query(sql, values, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database error while updating the home shift record.' });
        }
        res.status(200).json({ message: 'Home shift record updated successfully.' });
    });
});

// Delete home shift record (DELETE)
router.delete('/home-shift/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM home_shift WHERE id = ?';
    db.query(sql, [id], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database error while deleting the home shift record.' });
        }
        res.status(200).json({ message: 'Home shift record deleted successfully.' });
    });
});

export default router;
