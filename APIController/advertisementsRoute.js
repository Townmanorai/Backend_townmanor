import express from 'express';
import multer from 'multer';
import path from 'path';
import db from '../config/db.js';
import s3 from '../config/aws.js';

const router = express.Router();

// Multer configuration for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });



// Get all advertisements
router.get('/ads', (req, res) => {
  const sql = 'SELECT * FROM advertisements';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).send(err);
    }
    res.status(200).json(results);
  });
});

// Create a new advertisement
router.post('/ads', upload.array('files', 10), async (req, res) => {
  console.log('Files upload received:', req.files);

  const { imgname, type, status } = req.body;
  const images = req.files;

  // Validate required fields
  if (!imgname || !type || !status) {
    return res.status(400).send('Missing required fields');
  }

  if (!images || images.length === 0) {
    return res.status(400).send('No image files uploaded');
  }

  try {
    const uploadedImages = [];

    for (const image of images) {
      const fileContent = image.buffer; // The file buffer
      const fileName = `ads/${Date.now()}-${path.basename(image.originalname)}`;

      const params = {
        Bucket: 'townamnor.ai',
        Key: fileName,
        Body: fileContent,
        ContentType: image.mimetype,
      };

      const uploadResult = await s3.upload(params).promise();
      uploadedImages.push(uploadResult.Location); // Store uploaded image URLs
    }

    // Insert advertisement into the database with image URLs
    const sql = `INSERT INTO advertisements (imgname, type, status, imageUrl) VALUES (?, ?, ?, ?)`;
    db.query(sql, [imgname, type, status, JSON.stringify(uploadedImages)], (err, result) => {
      if (err) {
        console.error('Error inserting into advertisements table:', err);
        return res.status(500).send('Error saving advertisement');
      }
      res.status(200).json({ newAdId: result.insertId, uploadedImages });
    });
  } catch (error) {
    console.error('S3 Upload Error:', error);
    return res.status(500).send('File upload failed');
  }
});


// Get advertisement by ID
router.get('/ads/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM advertisements WHERE id = ?';
  
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).send(err);
    }
    if (result.length === 0) {
      return res.status(404).send('Advertisement not found');
    }
    res.status(200).json(result[0]);
  });
});

// Update an advertisement by ID
router.put('/ads/:id', upload.single('file'), async (req, res) => {
  const { id } = req.params;
  const { imgname, type, status } = req.body;
  const image = req.file;

  try {
    // If an image file is provided, upload it to S3 first.
    if (image) {
      const fileContent = image.buffer;
      const fileName = `ads/${Date.now()}-${path.basename(image.originalname)}`;

      const params = {
        Bucket: 'townamnor.ai',
        Key: fileName,
        Body: fileContent,
        ContentType: image.mimetype,
      };

      const data = await s3.upload(params).promise();
      const imageUrl = data.Location;

      const sql = 'UPDATE advertisements SET imgname = ?, type = ?, status = ?, imageUrl = ? WHERE id = ?';
      const values = [imgname, type, status, imageUrl, id];

      db.query(sql, values, (err, result) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).send(err);
        }
        if (result.affectedRows === 0) {
          return res.status(404).send('Advertisement not found');
        }
        res.json({ message: 'Advertisement updated successfully with new image' });
      });
    } else {
      // No file provided, so update only the text fields and leave imageUrl unchanged.
      const sql = 'UPDATE advertisements SET imgname = ?, type = ?, status = ? WHERE id = ?';
      const values = [imgname, type, status, id];

      db.query(sql, values, (err, result) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).send(err);
        }
        if (result.affectedRows === 0) {
          return res.status(404).send('Advertisement not found');
        }
        res.json({ message: 'Advertisement updated successfully' });
      });
    }
  } catch (error) {
    console.error('Error updating advertisement:', error);
    res.status(500).send('Error updating advertisement');
  }
});


// Delete an advertisement by ID
router.delete('/ads/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM advertisements WHERE id = ?';
  
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).send(err);
    }
    if (result.affectedRows === 0) {
      return res.status(404).send('Advertisement not found');
    }
    res.json({ message: 'Advertisement deleted successfully' });
  });
});

// Get active advertisements
router.get('/ads/active', (req, res) => {
  const sql = 'SELECT * FROM advertisements WHERE status = "active"';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).send(err);
    }
    res.status(200).json(results);
  });
});

export default router;
