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
