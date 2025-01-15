import express from 'express';
import db from '../config/db.js';

const router = express.Router();

// Add new home insurance (POST)
router.post('/home-insurance', (req, res) => {
    const {
        name, phoneNumber, email, pinCode, city, tenure, selectedInsurance, authorized
    } = req.body;

    const sql = `
        INSERT INTO home_insurance 
        (name, phoneNumber, email, pinCode, city, tenure, selectedInsurance, authorized) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [name, phoneNumber, email, pinCode, city, tenure, selectedInsurance, authorized];
    db.query(sql, values, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database error while adding home insurance.' });
        }
        res.status(201).json({ message: 'Home insurance created successfully.' });
    });
});

// Get all home insurance records (GET)
router.get('/home-insurance', (req, res) => {
    const sql = 'SELECT * FROM home_insurance';
    db.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database error while fetching home insurance records.' });
        }
        res.status(200).json(results);
    });
});

// Get home insurance by ID (GET)
router.get('/home-insurance/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM home_insurance WHERE id = ?';
    db.query(sql, [id], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database error while fetching the home insurance record.' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Home insurance record not found.' });
        }
        res.status(200).json(results[0]);
    });
});

// Update home insurance record (PUT)
router.put('/home-insurance/:id', (req, res) => {
    const { id } = req.params;
    const {
        name, phoneNumber, email, pinCode, city, tenure, selectedInsurance, authorized
    } = req.body;

    const sql = `
        UPDATE home_insurance 
        SET name = ?, phoneNumber = ?, email = ?, pinCode = ?, city = ?, 
            tenure = ?, selectedInsurance = ?, authorized = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
    `;
    const values = [name, phoneNumber, email, pinCode, city, tenure, selectedInsurance, authorized, id];
    db.query(sql, values, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database error while updating the home insurance record.' });
        }
        res.status(200).json({ message: 'Home insurance record updated successfully.' });
    });
});

// Delete home insurance record (DELETE)
router.delete('/home-insurance/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM home_insurance WHERE id = ?';
    db.query(sql, [id], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database error while deleting the home insurance record.' });
        }
        res.status(200).json({ message: 'Home insurance record deleted successfully.' });
    });
});

export default router;
