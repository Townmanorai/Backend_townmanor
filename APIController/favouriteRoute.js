import express from 'express';
import db from '../config/db.js';

const router = express.Router();

// Add a property to favorites
router.post('/favorites/add', async (req, res) => {
  const { username, property_id } = req.body;

  try {
    await db.query(
      'INSERT INTO user_favorites (username, property_id, created_at) VALUES (?, ?, NOW())',
      [username, property_id]
    );
    res.status(200).json({ message: 'Property added to favorites' });
  } catch (error) {
    console.error('Error adding to favorites:', error);
    res.status(500).json({ error: 'Failed to add to favorites' });
  }
});

// Remove a property from favorites
router.delete('/favorites/remove', async (req, res) => {
  const { username, property_id } = req.body;

  try {
    await db.query(
      'DELETE FROM user_favorites WHERE username = ? AND property_id = ?',
      [username, property_id]
    );
    res.status(200).json({ message: 'Property removed from favorites' });
  } catch (error) {
    console.error('Error removing from favorites:', error);
    res.status(500).json({ error: 'Failed to remove from favorites' });
  }
});

// Get user's favorite properties
router.get('/favorites/:username', async (req, res) => {
  const { username } = req.params;

  try {
    const [favorites] = await db.query(
      'SELECT property_id FROM user_favorites WHERE username = ?',
      [username]
    );
    res.status(200).json(favorites);
  } catch (error) {
    console.error('Error fetching favorites:', error);
    res.status(500).json({ error: 'Failed to fetch favorites' });
  }
});

module.exports = router;
