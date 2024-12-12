import db from '../config/db.js';

// GET all commercial details
export const getCommercialDetails = (req, res) => {
  db.query('SELECT * FROM commercial_details WHERE status != 0', (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error fetching commercial details', details: err });
    }
    res.status(200).json(results);
  });
};

// GET commercial details by ID
export const getCommercialDetailById = (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM commercial_details WHERE id = ? AND status != 0', [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error fetching commercial detail by ID', details: err });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Commercial detail not found' });
    }
    res.status(200).json(results[0]);
  });
};

// POST new commercial details
export const createCommercialDetail = (req, res) => {
  const { project_name, city, address, invest, category, return_policy, possession_date, builder, construction_status, project_unit, latitude, longitude, description, rera_id, project_area_range, video_id, amenities, distance, image_banner, face_image, floorplan, main_image, office_image, retail_shop, restaurant, other } = req.body;
  
  db.query(
    `INSERT INTO commercial_details (project_name, city, address, invest, category, return_policy, possession_date, builder, construction_status, project_unit, latitude, longitude, description, rera_id, project_area_range, video_id, amenities, distance, image_banner, face_image, floorplan, main_image, office_image, retail_shop, restaurant, other)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [project_name, city, address, invest, JSON.stringify(category), return_policy, possession_date, builder, construction_status, project_unit, latitude, longitude, description, rera_id, project_area_range, video_id, JSON.stringify(amenities), JSON.stringify(distance), image_banner, face_image, JSON.stringify(floorplan), JSON.stringify(main_image), JSON.stringify(office_image), JSON.stringify(retail_shop), JSON.stringify(restaurant), JSON.stringify(other)],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Error creating commercial detail', details: err });
      }
      res.status(201).json({ message: 'Commercial detail created successfully', id: results.insertId });
    }
  );
};

// PUT (update) commercial details by ID
export const updateCommercialDetail = (req, res) => {
  const { id } = req.params;
  const { project_name, city, address, invest, category, return_policy, possession_date, builder, construction_status, project_unit, latitude, longitude, description, rera_id, project_area_range, video_id, amenities, distance, image_banner, face_image, floorplan, main_image, office_image, retail_shop, restaurant, other } = req.body;

  db.query(
    `UPDATE commercial_details SET project_name = ?, city = ?, address = ?, invest = ?, category = ?, return_policy = ?, possession_date = ?, builder = ?, construction_status = ?, project_unit = ?, latitude = ?, longitude = ?, description = ?, rera_id = ?, project_area_range = ?, video_id = ?, amenities = ?, distance = ?, image_banner = ?, face_image = ?, floorplan = ?, main_image = ?, office_image = ?, retail_shop = ?, restaurant = ?, other = ? WHERE id = ?`,
    [project_name, city, address, invest, JSON.stringify(category), return_policy, possession_date, builder, construction_status, project_unit, latitude, longitude, description, rera_id, project_area_range, video_id, JSON.stringify(amenities), JSON.stringify(distance), image_banner, face_image, JSON.stringify(floorplan), JSON.stringify(main_image), JSON.stringify(office_image), JSON.stringify(retail_shop), JSON.stringify(restaurant), JSON.stringify(other), id],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Error updating commercial detail', details: err });
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ error: 'Commercial detail not found' });
      }
      res.status(200).json({ message: 'Commercial detail updated successfully' });
    }
  );
};

// DELETE (soft delete, change status to 0) commercial details by ID
export const deleteCommercialDetail = (req, res) => {
  const { id } = req.params;
  db.query('UPDATE commercial_details SET status = 0 WHERE id = ?', [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error deleting commercial detail', details: err });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Commercial detail not found' });
    }
    res.status(200).json({ message: 'Commercial detail deleted successfully' });
  });
};
