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
    nearby_location,
    address,
    latitude,
    longitude,
    city,
    state,
    user_name,
    status,

    image // Accept 'image' field as per frontend
  } = req.body;

  try {
    // Accept 'image' as array of URLs or single URL
    const uploadedImages = Array.isArray(image) ? image : (image ? [image] : []);

    const sql = `INSERT INTO coliving (
      property_name, configuration, configuration_type, area, 
      parking, floor, available_date, description, amenities, 
      nearby_location, address, latitude, longitude, image
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

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
      address,
      latitude,
      longitude,
      city,
      state,
      user_name,
      status,


      JSON.stringify(uploadedImages)
    ], (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).send('Error saving coliving property');
      }
      res.status(201).json({ 
        id: result.insertId, 
        message: 'Coliving property created successfully'
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

  try {
    // If image array is provided in body, use it directly
    if (updateData.image) {
      updateData.image = JSON.stringify(Array.isArray(updateData.image) ? updateData.image : [updateData.image]);
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



