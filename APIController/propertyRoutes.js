 import express from 'express';
import upload from '../middlewares/multerConfig.js';
import db from '../config/db.js';
import moment from 'moment-timezone';

const router = express.Router();

// Endpoint for Image Upload
router.post('/upload-images', upload.array('images', 10), (req, res) => {
  // Check if files were uploaded
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: 'No files were uploaded.' });
  }

  // Map the file paths
  const fileNames = req.files.map(file => file.path); // Paths to the uploaded images

  // Send back the file paths as response
  res.status(200).json({ imagePaths: fileNames });
}); 

// Add Property Route with created_on, updated_on, status
router.post('/addproperty', (req, res) => {
  const {
    username, city, locality, property_name, address, configuration, area_detail, area_type, bathroom,
    balcony, description, furnish_type, rera_id, floor_no, total_floor, construction_status, property_date,
    property_facing, price, maintenance_charge, token_amount, length, width, monthly_rent, securitydeposit,category,
    current_lease, remaining_time, boundary_wall, no_of_open_side, floor_allowed, modify_interior, lock_in_period,
    pricerange, money_type, amenities, metro, school, hospital, mall, restaurant, bus, cinema, country, 
    image_repository,floorplan, lat, lng, purpose,residential,commercail,leased, FeaturedAgentsId, AgentsOnSpotlightId, Listed_By, type
  } = req.body;

  // Extract the first image from the image repository
  let one_image_location = '';
  if (Array.isArray(image_repository) && image_repository.length > 0) {
    one_image_location = image_repository[0].image_url || ''; // Extract `image_url` from the first object
  }

   // Convert property_date and generate created_on and updated_on in IST
   const formattedPropertyDate = moment(property_date).tz("Asia/Kolkata").format("YYYY-MM-DDTHH:mm:ss");
   const created_on = moment().tz("Asia/Kolkata").format("YYYY-MM-DDTHH:mm:ss");  // Current date for created_on
   const updated_on = created_on;  // Same value for updated_on initially
   const status = 1;  // Active status by default
  // console.log("created_on",created_on,updated_on,status); 

  const sql = `
    INSERT INTO property_details (username, city, locality, property_name, address, configuration, area_detail, area_type, bathroom,
    balcony, description, furnish_type, rera_id, floor_no, total_floor, construction_status, property_date,
    property_facing, price, maintenance_charge, token_amount, length, width, monthly_rent, securitydeposit,category,
    current_lease, remaining_time, boundary_wall, no_of_open_side, floor_allowed, modify_interior, lock_in_period,
    pricerange, money_type, amenities, metro, school, hospital, mall, restaurant, bus, cinema, country, 
    image_repository, lat, lng, one_image_location, floorplan, purpose,residential,commercail,leased, FeaturedAgentsId, AgentsOnSpotlightId, Listed_By, type,
    created_on, updated_on, status)
   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?,?,?, ?, ?, ?,?,?,?,?);
  `;
  
  const values = [username, city, locality, property_name, address, configuration, area_detail, area_type, bathroom, 
    balcony, description, furnish_type, rera_id, floor_no, total_floor, construction_status, property_date, property_facing,
    price, maintenance_charge, token_amount, length, width, monthly_rent, securitydeposit, category, current_lease, remaining_time, 
    boundary_wall, no_of_open_side, floor_allowed, modify_interior, lock_in_period, pricerange, money_type, JSON.stringify(amenities),
    metro, school, hospital, mall, restaurant, bus, cinema, country, JSON.stringify(image_repository),JSON.stringify(floorplan), lat, lng, JSON.stringify(one_image_location), purpose,residential,commercail,leased,
    JSON.stringify(FeaturedAgentsId), JSON.stringify(AgentsOnSpotlightId), Listed_By, type, created_on, updated_on, status];

    // console.log(values);

  db.query(sql, values, (err, results) => {
    if (err) {
      console.error('Error inserting property:', err);
      return res.status(500).json({ error: 'An error occurred while adding the property.' });
    }
    res.status(201).json({ id: results.insertId });
  });
});


// Edit Property Route (Update property details and photo)
router.put('/editproperty/:id', (req, res) => {
  const propertyId = req.params.id;
  const {
    city, locality, property_name, address, configuration, area_detail, area_type, bathroom, balcony, description,
    furnish_type, rera_id, floor_no, total_floor, construction_status, property_date, property_facing, price,
    maintenance_charge, token_amount, length, width, monthly_rent, security_deposit, current_lease, remaining_time,
    boundary_wall, no_of_open_side, floor_allowed, modify_interior, lock_in_period, pricerange, money_type, amenities,
    metro, school, hospital, mall, restaurant, bus, cinema, country, image_repository, lat, lng, purpose,
    FeaturedAgentsId, AgentsOnSpotlightId, Listed_By, type
  } = req.body;

  const imageArray = image_repository.split(', ');
  const one_image_location = imageArray[0] || '';
  const updated_on = moment().tz("Asia/Kolkata").format("YYYY-MM-DDTHH:mm:ss"); // Set the updated_on field to the current date

  const sql = `
    UPDATE property_details SET city = ?, locality = ?, property_name = ?, address = ?, configuration = ?, area_detail = ?, 
    area_type = ?, bathroom = ?, balcony = ?, description = ?, furnish_type = ?, rera_id = ?, floor_no = ?, total_floor = ?, 
    construction_status = ?, property_date = ?, property_facing = ?, price = ?, maintenance_charge = ?, token_amount = ?, 
    length = ?, width = ?, monthly_rent = ?, security_deposit = ?, current_lease = ?, remaining_time = ?, boundary_wall = ?, 
    no_of_open_side = ?, floor_allowed = ?, modify_interior = ?, lock_in_period = ?, pricerange = ?, money_type = ?, 
    amenities = ?, metro = ?, school = ?, hospital = ?, mall = ?, restaurant = ?, bus = ?, cinema = ?, country = ?, 
    image_repository = ?, lat = ?, lng = ?, one_image_location = ?, purpose = ?, FeaturedAgentsId = ?, 
    AgentsOnSpotlightId = ?, Listed_By = ?, type = ?, updated_on = ? WHERE id = ?;
  `;

  const values = [city, locality, property_name, address, configuration, area_detail, area_type, bathroom, balcony,
    description, furnish_type, rera_id, floor_no, total_floor, construction_status, property_date, property_facing, price,
    maintenance_charge, token_amount, length, width, monthly_rent, security_deposit, current_lease, remaining_time,
    boundary_wall, no_of_open_side, floor_allowed, modify_interior, lock_in_period, pricerange, money_type, JSON.stringify(amenities),
    metro, school, hospital, mall, restaurant, bus, cinema, country, image_repository, lat, lng, one_image_location,
    purpose, JSON.stringify(FeaturedAgentsId), JSON.stringify(AgentsOnSpotlightId), Listed_By, type, updated_on, propertyId];

  db.query(sql, values, (err, results) => {
    if (err) {
      console.error('Error updating property:', err);
      return res.status(500).json({ error: 'An error occurred while updating the property.' });
    }
    res.status(200).json({ message: 'Property updated successfully.' });
  });
});

// Soft Delete Property Route (Change status to 0 and set deleted_on)
router.delete('/deleteproperty/:id', (req, res) => {
  const propertyId = req.params.id;
  const deleted_on = moment().tz("Asia/Kolkata").format("YYYY-MM-DDTHH:mm:ss");  // Set the deleted_on field to the current date
  const status = 0;  // Set status to 0 to indicate deletion

  const sql = `UPDATE property_details SET status = ?, deleted_on = ? WHERE id = ?;`;

  db.query(sql, [status, deleted_on, propertyId], (err, results) => {
    if (err) {
      console.error('Error deleting property:', err);
      return res.status(500).json({ error: 'An error occurred while deleting the property.' });
    }
    res.status(200).json({ message: 'Property deleted successfully.' });
  });
});



router.put('/property/:id', (req, res) => {
  const { id } = req.params;
  const { FeaturedAgentsId, AgentsOnSpotlightId } = req.body;
  const sql = 'UPDATE property_details SET FeaturedAgentsId = ?, AgentsOnSpotlightId = ? WHERE id = ?';
  db.query(sql, [FeaturedAgentsId, AgentsOnSpotlightId, id], (err, result) => {
    if (err) return res.status(500).send(err);
    res.status(200).send('Property updated');
  });
});

//Get all properties

router.get('/allproperties', (req, res) => {
  const sql = 'SELECT * FROM property_details where status = 1';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching properties:', err);
      return res.status(500).json({ error: 'An error occurred while fetching properties.' });
    }
    res.status(200).json(results);
  });
});


// Get all properties with optional filters
//http://localhost:3030/properties
//http://localhost:3030/properties?city=Gurugram
//http://localhost:3030/properties?city=Gurugram&configuration=3BHK
//http://localhost:3030/properties?city=Gurugram&furnish_type=Furnished&construction_status=Ready
//http://localhost:3030/properties?city=Gurugram&configuration=3BHK&furnish_type=Furnished&construction_status=Ready


router.get('/properties', (req, res) => {
  const { city, configuration, furnish_type, construction_status } = req.query;
  let sql = 'SELECT * FROM property_details WHERE status=1';
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

  db.query(sql, filters, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).send(err);
    }
    res.status(200).json(results);
  });
});

// Get property by ID
router.get('/property/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM property_details WHERE id = ?';

  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).send(err);
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Property not found' });
    }
    res.status(200).json(results[0]);
  });
});

// Get 7 random properties by city
router.get('/property/city/:city', (req, res) => {
  const { city } = req.params;                   
  const sql = `SELECT * FROM property_details WHERE city = ? AND status = 1 ORDER BY RAND() LIMIT 7 `;

  db.query(sql, [city], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).send({ error: 'Database error' });
    }
    if (results.length === 0) {
      return res
        .status(404)
        .json({ message: `No properties found in city "${city}"` });
    }
    res.status(200).json(results);
  });
});



router.put('/property/agents/:id', async (req, res) => {
  const { id } = req.params;
  const body = req.body;

  // Check which field is being updated
  const fieldToUpdate = Object.keys(body)[0]; // 'FeaturedAgentsId' or 'AgentsOnSpotlightId'
  let newAgentIds = body[fieldToUpdate]; // Get the value of the corresponding field

  // console.log("Updating field:", fieldToUpdate, "with value:", newAgentIds);

  // Ensure newAgentIds is an array of strings
  newAgentIds = Array.isArray(newAgentIds) ? newAgentIds : [newAgentIds];
  newAgentIds = newAgentIds.map(id => id.toString()); // Convert all new IDs to strings

  // Get the current property details
  const propertyQuery = 'SELECT FeaturedAgentsId, AgentsOnSpotlightId FROM property_details WHERE id = ?';
  db.query(propertyQuery, [id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Database error while fetching property' });

    const property = result[0];

    // Parse existing agent IDs and ensure it's an array of strings
    let existingAgentIds = JSON.parse(property[fieldToUpdate] || '[]');
    existingAgentIds = Array.isArray(existingAgentIds) ? existingAgentIds : [existingAgentIds];
    existingAgentIds = existingAgentIds.map(id => id.toString()); // Convert all existing IDs to strings

    // Merge existing and new agent IDs, removing any duplicates
    const updatedValue = [...new Set([...existingAgentIds, ...newAgentIds])];

    // console.log(`Final merged array for ${fieldToUpdate}:`, updatedValue);

    const sql = `UPDATE property_details SET ${fieldToUpdate} = ? WHERE id = ?`;
    db.query(sql, [JSON.stringify(updatedValue), id], (err, result) => {
      if (err) return res.status(500).json({ error: 'Database error during update' });
      res.status(200).json({ message: 'Property updated successfully' });
    });
  });
});



// Delete a property by ID
router.delete('/property/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM property_details WHERE id = ?';

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).send(err);
    }
    if (result.affectedRows === 0) {
      return res.status(404).send('Property not found');
    }
    res.json({ message: 'Property deleted successfully' });
  });
});



function parseSearchValues(searchValues) {
  // console.log("Input searchValues:", searchValues);  // Log the input

  // Adjusted regex pattern to match the provided input format
  const pattern = /id:\s*(\d+),\s*(Sector\s[\d,]+)\s*Rd,\s*([\w\s]+),\s*(Sector\s[\d,]+,\s*Noida)\s*(.+?)\s*-?\s*India\s*-\s*(commercial|apartment|farm\s*house|office)\s*(Ready-to-move|Under-Construction)\s*(UPRERAPRJ[\w\d\s,]+)\s*(Commercial|Office|Apartment|Farm\s*House)\s*(India)\s*(Noida)\s*(\d+-\d+)\s*-\s*(\d+[A-Za-z]+\s*-\s*\d+[A-Za-z]+)?\s*(\d+)\s*SKIP_ON_EMPTY\s*((true\w+\s*)+)\s*([\d.]+)\s*([\d.]+)\s*([\d.]+)\s*([\d.]+)/;

  // console.log("Regex pattern result:", pattern); 

  const match = searchValues.match(pattern);

  // console.log("Regex match result:", match);  // Log the match result

  if (match) {
      // Extract the locality from the address (e.g., "Sector 137, Noida")
      const localityRegex = /Sector\s[\d,]+/;
      const localityMatch = match[2].match(localityRegex);
      const locality = localityMatch ? localityMatch[0] : "Unknown Locality";

      // console.log("Extracted locality:", locality);  // Log the extracted locality

      return {
          id: match[1],
          address: match[2] + ', ' + match[4],  // Combine Sector and locality
          property_name: match[3],
          property_for: match[6],
          property_type: match[9],
          city: "Noida",
          construction_status: match[7],
          rera_id: match[8],
          possession_date: match[12],
          carpet_area: match[14] || "N/A",
          bhk_configuration: match[13] || "N/A",
          sale_price: match[15] || "N/A",
          amenities: match[17] ? match[17].split(' ') : [],  // Ensure amenities are handled
          locality,
          distances: {
              metro: match[18] || "N/A",
              healthcare: match[19] || "N/A",
              restaurant: match[20] || "N/A",
              school: match[21] || "N/A",
              mall: match[22] || "N/A",
          }
      };
  } else {
      console.error("Failed to parse search values: No match found.");  // Log error if no match
  }
  return null;
}



// Route to handle parsing and inserting
router.post('/insert-property', (req, res) => {
    const { search_values } = req.body;
//  console.log("search_values", search_values);
    const parsedData = parseSearchValues(search_values);
    // console.log("parsedData", parsedData);

    if (!parsedData) {
        return res.status(400).json({ error: 'Failed to parse search values' });
    }

    const insertQuery = `
        INSERT INTO property_details (
            id, city, locality, property_name, address, configuration, 
            area_type, carpet_area, price, bhk_configuration, rera_id, 
            property_for, construction_status, amenities, metro, healthcare, restaurant, school, mall
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
        parsedData.id, parsedData.city, parsedData.locality, parsedData.property_name, 
        parsedData.address, parsedData.property_type, 'sqft', 
        parsedData.carpet_area, parsedData.sale_price, parsedData.bhk_configuration, 
        parsedData.rera_id, parsedData.property_for, parsedData.construction_status,
        JSON.stringify(parsedData.amenities), parsedData.distances.metro, parsedData.distances.healthcare,
        parsedData.distances.restaurant, parsedData.distances.school, parsedData.distances.mall
    ];

    db.query(insertQuery, values, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database insertion error', details: err });
        }
        res.status(200).json({ success: 'Property inserted successfully' });
    });
});



export default router;



// // Add property route
// router.post('/addproperty', upload.array('images', 10), (req, res) => {
//   const {
//     username, city, locality, property_name, address, configuration, area_detail, area_type, bathroom, balcony,
//     description, furnish_type, rera_id, floor_no, total_floor, construction_status, property_date, property_facing,
//     price, maintenance_charge, token_amount, length, width, monthly_rent, security_deposit, current_lease, remaining_time,
//     boundary_wall, no_of_open_side, floor_allowed, modify_interior, lock_in_period, pricerange, money_type, amenities,
//     metro, school, hospital, mall, restaurant, bus, cinema, country, purpose, FeaturedAgentsId, AgentsOnSpotlightId, Listed_By, type
//   } = req.body;

//   // Handle images and save the paths in the image_repository and one_image_location
//   const images = req.files.map(file => `./images/${file.filename}`);
//   const image_repository = images.join(', ');
//   const one_image_location = images[0]; // Assuming the first image is used as the main image

//   // SQL Query to insert data into the database
//   const sql = `
//     INSERT INTO property_details (username, city, locality, property_name, address, configuration, area_detail, area_type,
//       bathroom, balcony, description, furnish_type, rera_id, floor_no, total_floor, construction_status, property_date,
//       property_facing, price, maintenance_charge, token_amount, length, width, monthly_rent, security_deposit, current_lease,
//       remaining_time, boundary_wall, no_of_open_side, floor_allowed, modify_interior, lock_in_period, pricerange, money_type,
//       amenities, metro, school, hospital, mall, restaurant, bus, cinema, country, image_repository, lat, lng, one_image_location,
//       purpose, FeaturedAgentsId, AgentsOnSpotlightId, Listed_By, type)
//     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
//   `;

//   // Values to insert into the table
//   const values = [
//     username, city, locality, property_name, address, configuration, area_detail, area_type, bathroom, balcony, description,
//     furnish_type, rera_id, floor_no, total_floor, construction_status, property_date, property_facing, price, maintenance_charge,
//     token_amount, length, width, monthly_rent, security_deposit, current_lease, remaining_time, boundary_wall, no_of_open_side,
//     floor_allowed, modify_interior, lock_in_period, pricerange, money_type, amenities, metro, school, hospital, mall, restaurant,
//     bus, cinema, country, image_repository, 28.570000, 77.320000, one_image_location, purpose, FeaturedAgentsId, AgentsOnSpotlightId, Listed_By, type
//   ];

//   // Execute the SQL query
//   db.query(sql, values, (err, results) => {
//     if (err) {
//       console.error('Error inserting property:', err);
//       return res.status(500).json({ error: 'An error occurred while adding the property.' });
//     }
//     res.status(201).json({ id: results.insertId });
//   });
// });



// // Endpoint for Image Upload
// router.post('/upload-images', upload.array('images', 10), (req, res) => {
//   // Check if files were uploaded
//   if (!req.files || req.files.length === 0) {
//     return res.status(400).json({ error: 'No files were uploaded.' });
//   }

//   // Map the file paths
//   const fileNames = req.files.map(file => file.path); // Paths to the uploaded images

//   // Send back the file paths as response
//   res.status(200).json({ imagePaths: fileNames });
// }); 

// // Add Property Route (Handling JSON Data and one_image_location)
// router.post('/addproperty', (req, res) => {
//   const {
//     username, city, locality, property_name, address, configuration, area_detail, area_type, bathroom,
//     balcony, description, furnish_type, rera_id, floor_no, total_floor, construction_status, property_date,
//     property_facing, price, maintenance_charge, token_amount, length, width, monthly_rent, security_deposit,
//     current_lease, remaining_time, boundary_wall, no_of_open_side, floor_allowed, modify_interior, lock_in_period,
//     pricerange, money_type, amenities, metro, school, hospital, mall, restaurant, bus, cinema, country, 
//     image_repository, lat, lng, purpose, FeaturedAgentsId, AgentsOnSpotlightId, Listed_By, type
//   } = req.body;

//   // Extract first image from the image repository (assuming it is stored as a comma-separated string)
//   const imageArray = image_repository.split(', ');
//   const one_image_location = imageArray[0] || '';  // Default to an empty string if no images

//   const sql = `
//     INSERT INTO property_details (username, city, locality, property_name, address, configuration, area_detail, area_type, bathroom,
//     balcony, description, furnish_type, rera_id, floor_no, total_floor, construction_status, property_date,
//     property_facing, price, maintenance_charge, token_amount, length, width, monthly_rent, security_deposit,
//     current_lease, remaining_time, boundary_wall, no_of_open_side, floor_allowed, modify_interior, lock_in_period,
//     pricerange, money_type, amenities, metro, school, hospital, mall, restaurant, bus, cinema, country, 
//     image_repository, lat, lng, one_image_location, purpose, FeaturedAgentsId, AgentsOnSpotlightId, Listed_By, type)
//    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?,?,?);
//   `;
  
//   const values = [username, city, locality, property_name, address, configuration, area_detail, area_type, bathroom, 
//     balcony, description, furnish_type, rera_id, floor_no, total_floor, construction_status, property_date, property_facing,
//     price, maintenance_charge, token_amount, length, width, monthly_rent, security_deposit, current_lease, remaining_time, 
//     boundary_wall, no_of_open_side, floor_allowed, modify_interior, lock_in_period, pricerange, money_type, JSON.stringify(amenities),
//     metro, school, hospital, mall, restaurant, bus, cinema, country, image_repository, lat, lng, one_image_location, purpose,
//     JSON.stringify(FeaturedAgentsId), JSON.stringify(AgentsOnSpotlightId), Listed_By, type];

//   db.query(sql, values, (err, results) => {
//     if (err) {
//       console.error('Error inserting property:', err);
//       return res.status(500).json({ error: 'An error occurred while adding the property.' });
//     }
//     res.status(201).json({ id: results.insertId });
//   });
// });



// Update a property by ID
// router.put('/property/:id', (req, res) => {
//   const { id } = req.params;
//   const {
//     city, locality, property_name, address, configuration, price, pricerange, size, bedrooms, bathrooms, property_type, listing_type, description
//   } = req.body;

//   const sql = `
//     UPDATE property_details
//     SET city = ?, locality = ?, property_name = ?, address = ?, configuration = ?, price = ?, pricerange = ?, size = ?, bedrooms = ?, bathrooms = ?, property_type = ?, listing_type = ?, description = ?
//     WHERE id = ?;
//   `;
//   const values = [city, locality, property_name, address, configuration, price, pricerange, size, bedrooms, bathrooms, property_type, listing_type, description, id];

//   db.query(sql, values, (err, result) => {
//     if (err) {
//       console.error('Database error:', err);
//       return res.status(500).send(err);
//     }
//     if (result.affectedRows === 0) {
//       return res.status(404).send('Property not found');
//     }
//     res.json({ message: 'Property updated successfully' });
//   });
// });

// router.put('/property/agents/:id', (req, res) => {
//   const { id } = req.params;
//   const { featuredAgentsId, agentsOnSpotlightId } = req.body;
//   console.log("featuredAgentsId, agentsOnSpotlightId",id, featuredAgentsId, agentsOnSpotlightId)
//   const sql = 'UPDATE property_details SET FeaturedAgentsId = ?, AgentsOnSpotlightId = ? WHERE id = ?';
//   db.query(sql, [featuredAgentsId, agentsOnSpotlightId, id], (err, result) => {
//     if (err) return res.status(500).json({ error: 'Database error' });
//     res.status(200).json({ message: 'Property updated successfully' });
//   });
// });

// router.put('/property/agents/:id', async (req, res) => {
//   const { id } = req.params;
//   const body = req.body;

//   // Check which field is being updated
//   const fieldToUpdate = Object.keys(body)[0]; // 'FeaturedAgentsId' or 'AgentsOnSpotlightId'
//   const newAgentIds = body[fieldToUpdate]; // Get the value of the corresponding field

//   console.log("Updating field:", fieldToUpdate, "with value:", newAgentIds);

//   // Get the current property details
//   const propertyQuery = 'SELECT FeaturedAgentsId, AgentsOnSpotlightId FROM property_details WHERE id = ?';
//   db.query(propertyQuery, [id], (err, result) => {
//     if (err) return res.status(500).json({ error: 'Database error while fetching property' });

//     const property = result[0];

//     // Parse existing agent IDs and ensure it's an array
//     let existingAgentIds = JSON.parse(property[fieldToUpdate] || '[]');
//     existingAgentIds = Array.isArray(existingAgentIds) ? existingAgentIds : [existingAgentIds];

//     // Ensure newAgentIds is also an array before merging
//     const newAgentIdsArray = Array.isArray(newAgentIds) ? newAgentIds : [newAgentIds];

//     // Merge existing and new agent IDs, removing any duplicates
//     const updatedValue = [...new Set([...existingAgentIds, ...newAgentIdsArray])];

//     console.log(`Final merged array for ${fieldToUpdate}:`, updatedValue);

//     const sql = `UPDATE property_details SET ${fieldToUpdate} = ? WHERE id = ?`;
//     db.query(sql, [JSON.stringify(updatedValue), id], (err, result) => {
//       if (err) return res.status(500).json({ error: 'Database error during update' });
//       res.status(200).json({ message: 'Property updated successfully' });
//     });
//   });
// });