import db from '../config/db.js';

// Get all admin properties
export const getAllAdminProperties = (req, res) => {
  db.query('SELECT * FROM property_details WHERE status = 1', (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error fetching admin properties', details: err });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'No admin properties found' });
    }
    res.status(200).json(results);
  });
};

// Get admin property by ID
export const getAllAdminPropertiesById = (req, res) => {
  const { id } = req.params;

  db.query('SELECT * FROM property_details WHERE id = ? AND status = 1', [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error fetching admin property', details: err });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Admin property not found' });
    }
    res.status(200).json(results[0]);
  });
};

// Get admin property by property_name
export const getAdminPropertyByPropertyName = (req, res) => {
  const { property_name } = req.params;
  db.query(
    'SELECT * FROM property_details WHERE property_name = ? AND status = 1',
    [property_name],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Error fetching admin property by property_name', details: err });
      }
      if (results.length === 0) {
        return res.status(404).json({ error: 'Admin property not found' });
      }
      res.status(200).json(results[0]);
    }
  );
};

// Get all owner properties
export const getAllOwnerProperties = (req, res) => {
  db.query('SELECT * FROM owner_property WHERE status = 1', (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error fetching owner properties', details: err });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'No owner properties found' });
    }
    res.status(200).json(results);
  });
};

// Get owner property by ID
export const getAllOwnerPropertiesById = (req, res) => {
  const { id } = req.params;

  db.query('SELECT * FROM owner_property WHERE id = ? AND status = 1', [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error fetching owner property by ID', details: err });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Owner property not found' });
    }
    res.status(200).json(results[0]);
  });
};

// Get owner property by property_name
export const getOwnerPropertyByPropertyName = (req, res) => {
  const { property_name } = req.params;
  db.query(
    'SELECT * FROM owner_property WHERE property_name = ? AND status = 1',
    [property_name],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Error fetching owner property by property_name', details: err });
      }
      if (results.length === 0) {
        return res.status(404).json({ error: 'Owner property not found' });
      }
      res.status(200).json(results[0]);
    }
  );
};

// Get all commercial property details
export const getAllCommericalPropertiesDetails = (req, res) => {
  db.query('SELECT * FROM commercial_details WHERE status = 1', (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error fetching commercial property details', details: err });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'No commercial property details found' });
    }
    res.status(200).json(results);
  });
};

// Get commercial property details by ID
export const getAllCommericalPropertiesDetailsById = (req, res) => {
  const { id } = req.params;

  db.query('SELECT * FROM commercial_details WHERE id = ? AND status = 1', [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error fetching commercial property details by ID', details: err });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Commercial property details not found' });
    }
    res.status(200).json(results[0]);
  });
};

// Get commercial property details by project_name
export const getCommercialDetailsByProjectName = (req, res) => {
  const { project_name } = req.params;
  db.query(
    'SELECT * FROM commercial_details WHERE project_name = ? AND status = 1',
    [project_name],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Error fetching commercial property by project_name', details: err });
      }
      if (results.length === 0) {
        return res.status(404).json({ error: 'Commercial property not found' });
      }
      res.status(200).json(results[0]);
    }
  );
};

// Get all commercial property units
export const getAllCommericalPropertiesUnits = (req, res) => {
  db.query('SELECT * FROM commercial_units WHERE status = 1', (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error fetching commercial property units', details: err });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'No commercial property units found' });
    }
    res.status(200).json(results);
  });
};

// Get commercial property units by ID
export const getAllCommericalPropertiesUnitsById = (req, res) => {
  const { id } = req.params;

  db.query('SELECT * FROM commercial_units WHERE id = ? AND status = 1', [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error fetching commercial property units by ID', details: err });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Commercial property units not found' });
    }
    res.status(200).json(results[0]);
  });
};

// Get commercial unit by name
export const getCommercialUnitByName = (req, res) => {
  const { name } = req.params;
  db.query(
    'SELECT * FROM commercial_units WHERE name = ? AND status = 1',
    [name],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Error fetching commercial unit by name', details: err });
      }
      if (results.length === 0) {
        return res.status(404).json({ error: 'Commercial unit not found' });
      }
      res.status(200).json(results[0]);
    }
  );
};
