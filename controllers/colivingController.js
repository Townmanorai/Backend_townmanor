
import db from '../config/db.js';
import s3 from '../config/aws.js';

// Get all coliving properties
export const getAllColiving = (req, res) => {
  const sql = 'SELECT * FROM coliving';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).send(err);
    }
    res.status(200).json(results);
  });
};

// Get coliving by ID
export const getColivingById = (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM coliving WHERE id = ?';
  
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).send(err);
    }
    if (result.length === 0) {
      return res.status(404).send('Coliving property not found');
    }
    res.status(200).json(result[0]);
  });
};

// Create new coliving property
export const createColiving = async (req, res) => {
  const {
    property_name,
    configuration,
    configuration_type,
    area,
    parking,
    floor,
    available_date,
    description,
    amenities,
    nearby_location
  } = req.body;
  
  const images = req.files;

  try {
    const uploadedImages = [];
    if (images && images.length > 0) {
      for (const image of images) {
        const fileName = `coliving/${Date.now()}-${image.originalname}`;
        const uploadResult = await s3.upload({
          Bucket: 'townamnor.ai',
          Key: fileName,
          Body: image.buffer,
          ContentType: image.mimetype,
        }).promise();
        uploadedImages.push(uploadResult.Location);
      }
    }

    const sql = `INSERT INTO coliving (
      property_name, configuration, configuration_type, area, 
      parking, floor, available_date, description, amenities, 
      nearby_location, image
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    db.query(sql, [
      property_name,
      configuration,
      configuration_type,
      area,
      parking,
      floor,
      available_date,
      description,
      amenities,
      nearby_location,
      JSON.stringify(uploadedImages)
    ], (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).send('Error saving coliving property');
      }
      res.status(201).json({ 
        id: result.insertId, 
        images: uploadedImages 
      });
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Operation failed');
  }
};

// Update coliving property
export const updateColiving = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  const images = req.files;

  try {
    if (images && images.length > 0) {
      const uploadedImages = [];
      for (const image of images) {
        const fileName = `coliving/${Date.now()}-${image.originalname}`;
        const uploadResult = await s3.upload({
          Bucket: 'townamnor.ai',
          Key: fileName,
          Body: image.buffer,
          ContentType: image.mimetype,
        }).promise();
        uploadedImages.push(uploadResult.Location);
      }
      updateData.image = JSON.stringify(uploadedImages);
    }

    const fields = Object.keys(updateData).map(key => `${key} = ?`).join(', ');
    const values = [...Object.values(updateData), id];

    const sql = `UPDATE coliving SET ${fields} WHERE id = ?`;
    
    db.query(sql, values, (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).send(err);
      }
      if (result.affectedRows === 0) {
        return res.status(404).send('Coliving property not found');
      }
      res.json({ message: 'Coliving property updated successfully' });
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Update failed');
  }
};

// Delete coliving property
export const deleteColiving = (req, res) => {
  const { id } = req.params;
  
  const sql = 'DELETE FROM coliving WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).send(err);
    }
    if (result.affectedRows === 0) {
      return res.status(404).send('Coliving property not found');
    }
    res.json({ message: 'Coliving property deleted successfully' });
  });
};



