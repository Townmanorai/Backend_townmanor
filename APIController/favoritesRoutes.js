import express from 'express';
import db from '../config/db.js';

const router = express.Router();

// Add a property to favorites
router.post('/favorites', (req, res) => {
    const { username, property_id } = req.body;

    const checkSql = 'SELECT * FROM user_favorites WHERE username = ? AND property_id = ?';
    const insertSql = `
        INSERT INTO user_favorites (username, property_id, created_at)
        VALUES (?, ?, NOW())
    `;

    db.query(checkSql, [username, property_id], (err, results) => {
        if (err) {
            console.error('Database error while checking favorites:', err);
            return res.status(500).json({ error: 'Failed to check favorite properties.' });
        }

        if (results.length > 0) {
            return res.status(409).json({ message: 'Property already in favorites.' });
        }

        db.query(insertSql, [username, property_id], (err) => {
            if (err) {
                console.error('Database error while adding to favorites:', err);
                return res.status(500).json({ error: 'Failed to add property to favorites.' });
            }
            res.status(201).json({ message: 'Property added to favorites successfully.' });
        });
    });
});




// Get all favorite properties for a user
router.get('/favorites/:username', (req, res) => {
    const { username } = req.params;

    const sql = `
        SELECT DISTINCT property_id 
        FROM user_favorites 
        WHERE username = ?
    `;

    db.query(sql, [username], (err, results) => {
        if (err) {
            console.error('Database error while fetching favorites:', err);
            return res.status(500).json({ error: 'Failed to fetch favorite properties.' });
        }
        res.status(200).json(results);
    });
});


// Remove a property from favorites
router.delete('/favorites', (req, res) => {
    const { username, property_id } = req.body;

    const sql = 'DELETE FROM user_favorites WHERE username = ? AND property_id = ?';
    const values = [username, property_id];
    db.query(sql, values, (err) => {
        if (err) {
            console.error('Database error while removing from favorites:', err);
            return res.status(500).json({ error: 'Failed to remove property from favorites.' });
        }
        res.status(200).json({ message: 'Property removed from favorites successfully.' });
    });
});

// Delete all favorites for a user
router.delete('/favorites/all/:username', (req, res) => {
    const { username } = req.params;

    const sql = 'DELETE FROM user_favorites WHERE username = ?';
    db.query(sql, [username], (err) => {
        if (err) {
            console.error('Database error while clearing favorites:', err);
            return res.status(500).json({ error: 'Failed to clear favorites.' });
        }
        res.status(200).json({ message: 'All favorites cleared successfully.' });
    });
});

export default router;
