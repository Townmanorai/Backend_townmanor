import db from '../config/db.js';

// Create a new article
export const createArticle = (req, res) => {
  const { heading, data, img, date } = req.body;

  db.query(
    `INSERT INTO articles (heading, data, img, date) VALUES (?, ?, ?, ?)`,
    [heading, data, img, date],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Error creating article', details: err });
      }
      res.status(201).json({ message: 'Article created successfully', id: results.insertId });
    }
  );
};

// Get all articles
export const getAllArticles = (req, res) => {
  db.query('SELECT * FROM articles WHERE status = 1', (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error fetching articles', details: err });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'No articles found' });
    }
    res.status(200).json(results);
  });
};

// Get article by ID
export const getArticleById = (req, res) => {
  const { id } = req.params;

  db.query('SELECT * FROM articles WHERE id = ? AND status = 1', [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error fetching article', details: err });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Article not found' });
    }
    res.status(200).json(results[0]);
  });
};

// Update article
export const updateArticle = (req, res) => {
  const { id } = req.params;
  const { heading, data, img, date } = req.body;

  db.query(
    `UPDATE articles SET heading = ?, data = ?, img = ?, date = ? WHERE id = ?`,
    [heading, data, img, date, id],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Error updating article', details: err });
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ error: 'Article not found' });
      }
      res.status(200).json({ message: 'Article updated successfully' });
    }
  );
};

// Delete article (soft delete)
export const deleteArticle = (req, res) => {
  const { id } = req.params;

  db.query('UPDATE articles SET status = 0 WHERE id = ?', [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error deleting article', details: err });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Article not found' });
    }
    res.status(200).json({ message: 'Article deleted successfully' });
  });
};
