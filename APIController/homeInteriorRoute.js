import express from 'express';
import db from '../config/db.js';

const router = express.Router();

// Add new home interior request (POST)
router.post('/home-interior', (req, res) => {
    const {
        name, email, mobile, city, occupationType
    } = req.body;

    const sql = `
        INSERT INTO home_interior 
        (name, email, mobile, city, occupationType) 
        VALUES (?, ?, ?, ?, ?)
    `;
    const values = [name, email, mobile, city, occupationType];
    db.query(sql, values, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database error while adding home interior request.' });
        }
        res.status(201).json({ message: 'Home interior request created successfully.' });
    });
});

// Get all home interior records (GET)
router.get('/home-interior', (req, res) => {
    const sql = 'SELECT * FROM home_interior';
    db.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database error while fetching home interior records.' });
        }
        res.status(200).json(results);
    });
});

// Get home interior by ID (GET)
router.get('/home-interior/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM home_interior WHERE id = ?';
    db.query(sql, [id], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database error while fetching the home interior record.' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Home interior record not found.' });
        }
        res.status(200).json(results[0]);
    });
});

// Update home interior record (PUT)
router.put('/home-interior/:id', (req, res) => {
    const { id } = req.params;
    const {
        name, email, mobile, city, occupationType
    } = req.body;

    const sql = `
        UPDATE home_interior 
        SET name = ?, email = ?, mobile = ?, city = ?, occupationType = ?, updated_at = CURRENT_TIMESTAMP 
        WHERE id = ?
    `;
    const values = [name, email, mobile, city, occupationType, id];
    db.query(sql, values, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database error while updating the home interior record.' });
        }
        res.status(200).json({ message: 'Home interior record updated successfully.' });
    });
});

// Delete home interior record (DELETE)
router.delete('/home-interior/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM home_interior WHERE id = ?';
    db.query(sql, [id], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database error while deleting the home interior record.' });
        }
        res.status(200).json({ message: 'Home interior record deleted successfully.' });
    });
});

export default router;
