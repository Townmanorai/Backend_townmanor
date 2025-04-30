import db from '../config/db.js';

// Create a new property
export const createProperty = (req, res) => {
  const {
    username, pincode, city, locality, property_name, address, configuration, area_detail, area_type,
    bathroom, balcony, description, furnish_type, rera_id, floor_no, total_floor, 
    construction_status, property_date, property_facing, price, maintenance_charge, 
    token_amount, pricerange, money_type, amenities, country, purpose, category, 
    residential, floorplan, image_repository, lat, lng, length, width, montly_rent, 
    securitydeposit, current_lease, remaining_time, boundary_wall, no_of_open_side, 
    floor_allowed, modifyinterior, lock_in_period, metro, school, hospital, mall, 
    restaurant, bus, cinema,Commercail, leased
  } = req.body;

  db.query(
    `INSERT INTO owner_property (
      username, pincode, city, locality, property_name, address, configuration, area_detail, area_type,
      bathroom, balcony, description, furnish_type, rera_id, floor_no, total_floor, 
      construction_status, property_date, property_facing, price, maintenance_charge, 
      token_amount, pricerange, money_type, amenities, country, purpose, category, 
      residential, floorplan, image_repository, lat, lng, length, width, montly_rent, 
      securitydeposit, current_lease, remaining_time, boundary_wall, no_of_open_side, 
      floor_allowed, modifyinterior, lock_in_period, metro, school, hospital, mall, 
      restaurant, bus, cinema,Commercail, leased
    ) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,

    [
      username, pincode, city, locality, property_name, address, configuration, area_detail, area_type,
      bathroom, balcony, description, furnish_type, rera_id, floor_no, total_floor, 
      construction_status, property_date, property_facing, price, maintenance_charge, 
      token_amount, pricerange, money_type, JSON.stringify(amenities), country, purpose, category, 
      residential, JSON.stringify(floorplan), JSON.stringify(image_repository), lat, lng, 
      length, width, montly_rent, securitydeposit, current_lease, remaining_time, boundary_wall, 
      no_of_open_side, floor_allowed, modifyinterior, lock_in_period, metro, school, hospital, 
      mall, restaurant, bus, cinema, Commercail, leased
    ],

    (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Error creating property', details: err });
      }
      res.status(201).json({ message: 'Property created successfully', id: results.insertId });
    }
  );
};
// Get all property 
export const getAllProperty = (req, res) => {

  db.query(
    'SELECT * FROM owner_property WHERE status = 1',
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Error fetching property', details: err });
      }
      if (results.length === 0) {
        return res.status(404).json({ error: 'Property not found' });
      }
      res.status(200).json(results);
    }
  );
};

// Get property by ID
export const getPropertyById = (req, res) => {
  const { id } = req.params;

  db.query(
    'SELECT * FROM owner_property WHERE id = ? AND status = 1',
    [id],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Error fetching property', details: err });
      }
      if (results.length === 0) {
        return res.status(404).json({ error: 'Property not found' });
      }
      res.status(200).json(results[0]);
    }
  );
};

// Update property
export const updateProperty = (req, res) => {
  const { id } = req.params;
  const {
    username, pincode, city, locality, property_name, address, configuration, area_detail, area_type,
    bathroom, balcony, description, furnish_type, rera_id, floor_no, total_floor, 
    construction_status, property_date, property_facing, price, maintenance_charge, 
    token_amount, pricerange, money_type, amenities, country, purpose, category, 
    residential, floorplan, image_repository, lat, lng, length, width, montly_rent, 
    securitydeposit, current_lease, remaining_time, boundary_wall, no_of_open_side, 
    floor_allowed, modifyinterior, lock_in_period, metro, school, hospital, mall, 
    restaurant, bus, cinema, Commercail, leased
  } = req.body;

  db.query(
    `UPDATE owner_property 
    SET username = ? ,pincode = ?, city = ?, locality = ?, property_name = ?, address = ?, configuration = ?, 
    area_detail = ?, area_type = ?, bathroom = ?, balcony = ?, description = ?, furnish_type = ?, 
    rera_id = ?, floor_no = ?, total_floor = ?, construction_status = ?, property_date = ?, 
    property_facing = ?, price = ?, maintenance_charge = ?, token_amount = ?, pricerange = ?, 
    money_type = ?, amenities = ?, country = ?, purpose = ?, category = ?, residential = ?, 
    floorplan = ?, image_repository = ?, lat = ?, lng = ?, length = ?, width = ?, 
    montly_rent = ?, securitydeposit = ?, current_lease = ?, remaining_time = ?, boundary_wall = ?, 
    no_of_open_side = ?, floor_allowed = ?, modifyinterior = ?, lock_in_period = ?, 
    metro = ?, school = ?, hospital = ?, mall = ?, restaurant = ?, bus = ?, cinema = ?, Commercail = ?,
    leased = ? 
    WHERE id = ?`,

    [
      username, pincode, city, locality, property_name, address, configuration, area_detail, area_type,
      bathroom, balcony, description, furnish_type, rera_id, floor_no, total_floor, 
      construction_status, property_date, property_facing, price, maintenance_charge, 
      token_amount, pricerange, money_type, JSON.stringify(amenities), country, purpose, category, 
      residential, JSON.stringify(floorplan), JSON.stringify(image_repository), lat, lng, 
      length, width, montly_rent, securitydeposit, current_lease, remaining_time, boundary_wall, 
      no_of_open_side, floor_allowed, modifyinterior, lock_in_period, metro, school, hospital, 
      mall, restaurant, bus, cinema, leased,Commercail, id
    ],

    (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Error updating property', details: err });
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ error: 'Property not found' });
      }
      res.status(200).json({ message: 'Property updated successfully' });
    }
  );
};

// Delete (soft delete) property
export const deleteProperty = (req, res) => {
  const { id } = req.params;

  db.query(
    'UPDATE owner_property SET status = 0 WHERE id = ?',
    [id],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Error deleting property', details: err });
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ error: 'Property not found' });
      }
      res.status(200).json({ message: 'Property deleted successfully' });
    }
  );
};


// Get all properties with optional filters
//http://localhost:3030/properties
//http://localhost:3030/properties?city=Gurugram
//http://localhost:3030/properties?city=Gurugram&configuration=3BHK
//http://localhost:3030/properties?city=Gurugram&furnish_type=Furnished&construction_status=Ready
//http://localhost:3030/properties?city=Gurugram&configuration=3BHK&furnish_type=Furnished&construction_status=Ready


export const getAllPropertyByFilter = (req, res) => {
  const { city, configuration, furnish_type, construction_status } = req.query;
  let sql = 'SELECT * FROM owner_property WHERE status = 1';
  const filters = [];

  if (city) {
    sql += ' AND city = ?';
    filters.push(city);
  }

  if (configuration) {
    sql += ' AND configuration = ?';
    filters.push(configuration);
  }

  if (furnish_type) {
    sql += ' AND furnish_type = ?';
    filters.push(furnish_type);
  }

  if (construction_status) {
    sql += ' AND construction_status = ?';
    filters.push(construction_status);
  }

  // Add ORDER BY clause to sort the newest properties first
  sql += ' ORDER BY created_at DESC';

  db.query(sql, filters, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).send(err);
    }
    res.status(200).json(results);
  });
};


export const getSaleProperties = (req, res) => {
  const { city, configuration, furnish_type, construction_status } = req.query;
  let sql = 'SELECT * FROM owner_property WHERE status = 1 AND purpose = "sale"';
  const filters = [];

  if (city) {
    sql += ' AND city = ?';
    filters.push(city);
  }

  if (configuration) {
    sql += ' AND configuration = ?';
    filters.push(configuration);
  }

  if (furnish_type) {
    sql += ' AND furnish_type = ?';
    filters.push(furnish_type);
  }

  if (construction_status) {
    sql += ' AND construction_status = ?';
    filters.push(construction_status);
  }

  sql += ' ORDER BY created_at DESC';

  db.query(sql, filters, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).send(err);
    }
    res.status(200).json(results);
  });
};


// GET https://www.townmanor.ai/api/owner-property/filter/rent
// GET https://www.townmanor.ai/api/owner-property/filter/rent?city=noida
// GET https://www.townmanor.ai/api/owner-property/filter/rent?city=noida&configuration=2BHK
// GET https://www.townmanor.ai/api/owner-property/filter/rent?furnish_type=Furnished
// GET https://www.townmanor.ai/api/owner-property/filter/rent?construction_status=Ready
// GET https://www.townmanor.ai/api/owner-property/filter/rent?city=noida&configuration=2BHK&furnish_type=Furnished&construction_status=Ready
// GET https://www.townmanor.ai/api/owner-property/filter/rent?city=noida&configuration=2BHK&furnish_type=Furnished&construction_status=Ready
// GET https://www.townmanor.ai/api/owner-property/filter/rent?configuration=2BHK

// GET https://www.townmanor.ai/api/owner-property/filter/rent?city=Mumbai&configuration=2BHK
// GET https://www.townmanor.ai/api/owner-property/filter/rent?city=Mumbai&furnish_type=Furnished
// GET https://www.townmanor.ai/api/owner-property/filter/rent?city=Mumbai&construction_status=Ready-To-Move
// GET https://www.townmanor.ai/api/owner-property/filter/rent?configuration=2BHK&furnish_type=Furnished
// GET https://www.townmanor.ai/api/owner-property/filter/rent?configuration=2BHK&construction_status=Ready-To-Move
// GET https://www.townmanor.ai/api/owner-property/filter/rent?furnish_type=Furnished&construction_status=Ready-To-Move

// GET https://www.townmanor.ai/api/owner-property/filter/rent?city=Mumbai&configuration=2BHK&furnish_type=Furnished
// GET https://www.townmanor.ai/api/owner-property/filter/rent?city=Mumbai&configuration=2BHK&construction_status=Ready-To-Move
// GET https://www.townmanor.ai/api/owner-property/filter/rent?city=Mumbai&furnish_type=Furnished&construction_status=Ready-To-Move
// GET https://www.townmanor.ai/api/owner-property/filter/rent?configuration=2BHK&furnish_type=Furnished&construction_status=Ready-To-Move

// GET https://www.townmanor.ai/api/owner-property/filter/rent?city=Mumbai&configuration=2BHK&furnish_type=Furnished&construction_status=Ready-To-Move


export const getRentProperties = (req, res) => {
  const { city, configuration, furnish_type, construction_status } = req.query;
  let sql = 'SELECT * FROM owner_property WHERE status = 1 AND purpose = "rent"';
  const filters = [];

  if (city) {
    sql += ' AND city = ?';
    filters.push(city);
  }

  if (configuration) {
    sql += ' AND configuration = ?';
    filters.push(configuration);
  }

  if (furnish_type) {
    sql += ' AND furnish_type = ?';
    filters.push(furnish_type);
  }

  if (construction_status) {
    sql += ' AND construction_status = ?';
    filters.push(construction_status);
  }

  sql += ' ORDER BY created_at DESC';

  db.query(sql, filters, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).send(err);
    }
    res.status(200).json(results);
  });
};

export const getFilteredProperties = (req, res) => {
  const {
    purpose,           
    city,
    configuration,
    furnish_type,
    construction_status
  } = req.query;

  // base SQL
  let sql = 'SELECT * FROM owner_property WHERE status = 1';
  const filters = [];

  // purpose is now a query‑param
  if (purpose) {
    sql += ' AND purpose = ?';
    filters.push(purpose);
  }

  // remaining filters
  if (city) {
    sql += ' AND city = ?';
    filters.push(city);
  }
  if (configuration) {
    sql += ' AND configuration = ?';
    filters.push(configuration);
  }
  if (furnish_type) {
    sql += ' AND furnish_type = ?';
    filters.push(furnish_type);
  }
  if (construction_status) {
    sql += ' AND construction_status = ?';
    filters.push(construction_status);
  }

  sql += ' ORDER BY created_at DESC';

  db.query(sql, filters, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).send(err);
    }
    res.status(200).json(results);
  });
};


export const getFilteredPropertiesByName = (req, res) => {
  const {
    purpose,
    configuration,
    property_name 
  } = req.query;

  // base SQL
  let sql = 'SELECT * FROM owner_property WHERE status = 1';
  const filters = [];

  if (purpose) {
    sql += ' AND purpose = ?';
    filters.push(purpose);
  }
  if (configuration) {
    sql += ' AND configuration = ?';
    filters.push(configuration);
  }
  if (property_name) {
    sql += ' AND property_name LIKE ?';
    filters.push(`%${property_name}%`);
  }

  sql += ' ORDER BY created_at DESC';

  db.query(sql, filters, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).send(err);
    }
    res.status(200).json(results);
  });
};

// Get properties by username
export const getPropertiesByUsername = (req, res) => {
  const { username } = req.params;

  db.query(
    'SELECT * FROM owner_property WHERE username = ? AND status = 1',
    [username],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Error fetching properties', details: err });
      }
      if (results.length === 0) {
        return res.status(404).json({ message: 'No properties found for this username' });
      }
      res.status(200).json(results);
    }
  );
};
