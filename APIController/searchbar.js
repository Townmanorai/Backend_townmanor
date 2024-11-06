import express from 'express';
import db from '../config/db.js';

const router = express.Router();

// New Search API with updated fields

// http://localhost:3030/searchproperties
// http://localhost:3030/searchproperties?city=Delhi
// http://localhost:3030/searchproperties?city=Delhi&locality=Connaught%20Place
// http://localhost:3030/searchproperties?city=Delhi&locality=Connaught%20Place&configuration=3BHK
// http://localhost:3030/searchproperties?city=Delhi&locality=Connaught%20Place&configuration=3BHK
// http://localhost:3030/searchproperties?city=Delhi&locality=Connaught%20Place&configuration=3BHK
// http://localhost:3030/searchproperties?residential=yes
// http://localhost:3030/searchproperties?commercial=yes
// http://localhost:3030/searchproperties?purpose=buy
// http://localhost:3030/searchproperties?minValue=5000000&maxValue=10000000
// http://localhost:3030/searchproperties?construction_status=under-construction
// http://localhost:3030/searchproperties?category=luxury
// http://localhost:3030/searchproperties?city=Delhi&purpose=buy&minValue=5000000&maxValue=10000000


// http://localhost:3030/searchproperties?city=Chennai&locality=Adyar&property_name=Sunrise%20Apartments&address=12%20Sunrise%20Street&configuration=3BHK&area_detail=1400%20sqft&area_type=Carpet&bathroom=3&balcony=2&description=Spacious%20apartment%20with%20sea%20view&furnish_type=Semi-Furnished&rera_id=RERA7890&floor_no=7&total_floor=15&construction_status=Ready%20to%20Move&property_date=2024-08-22T18:30:00.000Z&property_facing=North&price=18000000&maintenance_charge=6000&token_amount=80000&length=70&width=55&monthly_rent=55000&security_deposit=165000&current_lease=John%20Doe&remaining_time=3%20years&boundary_wall=1&no_of_open_side=2&floor_allowed=8&modify_interior=1&lock_in_period=1%20year&pricerange=1.8-2%20Cr&money_type=INR&amenities=Gym,Club%20House&metro=1km&school=500m&hospital=2km&mall=1.5km&restaurant=200m&bus=300m&cinema=400m&country=India&image_repository=./1.webp,./2.jpg,./3.webp&lat=28.510228&lng=77.417115&one_image_location=./1.webp
// http://localhost:3030/searchproperties
// http://localhost:3030/searchproperties?city=Chennai
// http://localhost:3030/searchproperties?city=Chennai&locality=Adyar
// http://localhost:3030/searchproperties?city=Chennai&locality=Adyar&configuration=3BHK
// http://localhost:3030/searchproperties?city=Chennai&construction_status=Ready%20to%20Move
// http://localhost:3030/searchproperties?city=Chennai&minValue=15000000&maxValue=20000000
// http://localhost:3030/searchproperties?minValue=18000001&maxValue=20000000
// http://localhost:3030/searchproperties?city=Chennai&amenities=Gym,Club%20House
// http://localhost:3030/searchproperties?city=Chennai&furnish_type=Semi-Furnished
// http://localhost:3030/searchproperties?city=Chennai&property_facing=North
// http://localhost:3030/searchproperties?city=Chennai&purpose=buy





router.get('/searchproperties', (req, res) => {
  const {
    city,
    locality,
    configuration,
    residential,
    commercial,
    purpose,
    minValue,
    maxValue,
    construction_status,
    category
  } = req.query;

  let sql = 'SELECT * FROM property_details WHERE 1=1';
  const filters = [];

  // Add conditions for each field
  if (city) {
    sql += ' AND city = ?';
    filters.push(city);
  }

  if (locality) {
    sql += ' AND locality = ?';
    filters.push(locality);
  }

  if (configuration) {
    sql += ' AND configuration = ?';
    filters.push(configuration);
  }

  if (residential) {
    sql += ' AND residential = ?';
    filters.push(residential);
  }

  if (commercial) {
    sql += ' AND commercial = ?';
    filters.push(commercial);
  }

  if (purpose) {
    sql += ' AND purpose = ?';
    filters.push(purpose);
  }

  if (minValue && maxValue) {
    sql += ' AND price BETWEEN ? AND ?';
    filters.push(minValue, maxValue);
  } else if (minValue) {
    sql += ' AND price >= ?';
    filters.push(minValue);
  } else if (maxValue) {
    sql += ' AND price <= ?';
    filters.push(maxValue);
  }

  if (construction_status) {
    sql += ' AND construction_status = ?';
    filters.push(construction_status);
  }

  if (category) {
    sql += ' AND category = ?';
    filters.push(category);
  }

  // Debugging logs
  console.log('SQL Query:', sql);
  console.log('Filters:', filters);

  // Execute the query with the applied filters
  db.query(sql, filters, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).send(err);
    }
    res.status(200).json(results);
  });
});

export default router;
