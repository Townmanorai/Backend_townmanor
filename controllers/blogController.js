import db from '../config/db.js';

// Create a new blog
export const createBlog = (req, res) => {
  const { heading, data, img, date } = req.body;

  db.query(
    `INSERT INTO blogs (heading, data, img, date) VALUES (?, ?, ?, ?)`,
    [heading, data, img, date],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Error creating blog', details: err });
      }
      res.status(201).json({ message: 'Blog created successfully', id: results.insertId });
    }
  );
};

// Get all blogs
export const getAllBlogs = (req, res) => {
  db.query('SELECT * FROM blogs WHERE status = 1', (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error fetching blogs', details: err });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'No blogs found' });
    }
    res.status(200).json(results);
  });
};

// Get blog by ID
export const getBlogById = (req, res) => {
  const { id } = req.params;

  db.query('SELECT * FROM blogs WHERE id = ? AND status = 1', [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error fetching blog', details: err });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Blog not found' });
    }
    res.status(200).json(results[0]);
  });
};

// Update blog
export const updateBlog = (req, res) => {
  const { id } = req.params;
  const { heading, data, img, date } = req.body;

  db.query(
    `UPDATE blogs SET heading = ?, data = ?, img = ?, date = ? WHERE id = ?`,
    [heading, data, img, date, id],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Error updating blog', details: err });
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ error: 'Blog not found' });
      }
      res.status(200).json({ message: 'Blog updated successfully' });
    }
  );
};

// Delete blog (soft delete)
export const deleteBlog = (req, res) => {
  const { id } = req.params;

  db.query('UPDATE blogs SET status = 0 WHERE id = ?', [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error deleting blog', details: err });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Blog not found' });
    }
    res.status(200).json({ message: 'Blog deleted successfully' });
  });
};
