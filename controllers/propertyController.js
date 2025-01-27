// /controllers/propertyController.js
import db from '../config/db.js';

// Fetch all properties
export const getAllProperties = (req, res) => {
  const sql = 'SELECT * FROM property_details';
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'An error occurred while fetching properties.' });
    }
    res.status(200).json(results);
  });
};

// // Add a new property
// export const addProperty = (req, res) => {
//   const { city, locality, property_name, address, price } = req.body;
//   const query = `
//     INSERT INTO property_details (city, locality, property_name, address, price)
//     VALUES (?, ?, ?, ?, ?);
//   `;
//   const values = [city, locality, property_name, address, price];

//   db.query(query, values, (err, results) => {
//     if (err) {
//       return res.status(500).json({ error: 'An error occurred while adding the property.' });
//     }
//     res.status(201).json({ id: results.insertId });
//   });
// };

// Delete a property
export const deleteProperty = (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM property_details WHERE id = ?';

  db.query(sql, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'An error occurred while deleting the property.' });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Property not found' });
    }

    res.status(200).json({ message: 'Property deleted successfully' });
  });
};

// Fetch rental properties
export const getRentalProperties = (req, res) => {
  const sql = 'SELECT * FROM property_details WHERE purpose = "rent"';
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'An error occurred while fetching rental properties.' });
    }
    res.status(200).json(results);
  });
};

// Fetch owner properties
export const getOwnerProperties = (req, res) => {
  const sql = 'SELECT * FROM property_details WHERE purpose = "rent" AND Listed_By = "Owner" AND status = "1"';
  
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'An error occurred while fetching rental properties.' });
    }
    
    // Check if no results were found
    if (results.length === 0) {
      return res.status(404).json({ message: 'No properties found for this criteria.' });
    }
    
    res.status(200).json(results);
  });
};



export const getRentalPropertiesByCity = (req, res) => {
  const { city, configuration, furnish_type, property_name } = req.query; // Read filters from query parameters

  let baseQuery = `
    SELECT * FROM property_details 
    WHERE purpose = "rent" AND Listed_By != "Owner" AND status = "1"
  `;
  const queryParams = [];

  // Add city filter if provided
  if (city) {
    baseQuery += ' AND city = ?';
    queryParams.push(city);
  }

  // Add configuration filter if provided
  if (configuration) {
    baseQuery += ' AND configuration = ?';
    queryParams.push(configuration);
  }

  // Add furnish type filter if provided
  if (furnish_type) {
    baseQuery += ' AND furnish_type = ?';
    queryParams.push(furnish_type);
  }

  // Add property_name filter if provided
  if (property_name) {
    baseQuery += ' AND property_name LIKE ?';
    queryParams.push(`%${property_name}%`); // Use LIKE for partial matching
  }

  // Execute the query with the dynamic filters
  db.query(baseQuery, queryParams, (err, results) => {
    if (err) {
      console.error('Error fetching rental properties:', err);
      return res.status(500).json({ error: 'An error occurred while fetching rental properties.' });
    }

    // Check if no results were found
    if (results.length === 0) {
      return res.status(404).json({ message: 'No properties found matching the criteria.' });
    }

    res.status(200).json(results);
  });
};


export const getOwnerPropertiesByCity = (req, res) => {
  const { city, configuration, furnish_type, property_name } = req.query; // Read filters from query parameters

  let baseQuery = `
    SELECT * FROM property_details 
    WHERE purpose = "sale" AND Listed_By = "Owner" AND status = "1"
  `;
  const queryParams = [];

  // Add city filter if provided
  if (city) {
    baseQuery += ' AND city = ?';
    queryParams.push(city);
  }

  // Add configuration filter if provided
  if (configuration) {
    baseQuery += ' AND configuration = ?';
    queryParams.push(configuration);
  }

  // Add furnish type filter if provided
  if (furnish_type) {
    baseQuery += ' AND furnish_type = ?';
    queryParams.push(furnish_type);
  }

  // Add property_name filter if provided
  if (property_name) {
    baseQuery += ' AND property_name LIKE ?';
    queryParams.push(`%${property_name}%`); // Use LIKE for partial matching
  }

  // Execute the query with the dynamic filters
  db.query(baseQuery, queryParams, (err, results) => {
    if (err) {
      console.error('Error fetching owner properties:', err);
      return res.status(500).json({ error: 'An error occurred while fetching owner properties.' });
    }

    // Check if no results were found
    if (results.length === 0) {
      return res.status(404).json({ message: 'No properties found matching the criteria.' });
    }

    res.status(200).json(results);
  });
};



export const getAdminProperties = (req, res) => {
  db.query(
    `SELECT property_name, one_image_location,
            COUNT(CASE WHEN type = 'agent' THEN 1 END) AS agentsCount,
            COUNT(CASE WHEN type = 'owner' THEN 1 END) AS ownersCount
     FROM property_details 
     GROUP BY property_name,one_image_location`,
    (error, properties) => {
      if (error) {
        console.error('Error fetching properties:', error);
        return res.status(500).json({ message: 'Server error' });
      }

      // Send the properties in JSON format
      res.json(properties);
    }
  );
};


export const getAdminPropertiesByCity = (req, res) => {
  const { city } = req.query;  // Read city filter from query parameters

  let baseQuery = `
    SELECT property_name, one_image_location,
      COUNT(CASE WHEN type = 'agent' THEN 1 END) AS agentsCount,
      COUNT(CASE WHEN type = 'owner' THEN 1 END) AS ownersCount
    FROM property_details
  `;
  const queryParams = [];

  // Add city filter if provided
  if (city) {
    baseQuery += ' WHERE city = ?';
    queryParams.push(city);
  }

  // Group the results by property name and one_image_location
  baseQuery += ' GROUP BY property_name, one_image_location';

  // Execute the query
  db.query(baseQuery, queryParams, (error, properties) => {
    if (error) {
      console.error('Error fetching properties:', error);
      return res.status(500).json({ message: 'Server error' });
    }

    // Send the properties in JSON format
    res.json(properties);
  });
};


// export const getPropertyDetails = async (req, res) => {
//   // Remove extra spaces and special characters from the property name
//   const propertyname = req.params.propertyname.trim().replace(/\s+/g, ' ');

//   try {
//     // Fetch property details based on trimmed property name
//     db.query(
//       'SELECT * FROM property WHERE TRIM(propertyname) = ?',
//       [propertyname],
//       (error, propertyRows) => {
//         if (error) {
//           console.error('Error fetching property details:', error);
//           return res.status(500).json({ message: 'Server error' });
//         }

//         if (propertyRows.length === 0) {
//           return res.status(404).json({ message: 'Property not found' });
//         }

//         // Extract usernames of users who listed this property
//         const usernames = propertyRows.map(row => row.username);

//         if (usernames.length === 0) {
//           return res.status(404).json({ message: 'No agents or owners found for this property' });
//         }

//         // Handle single and multiple usernames
//         const usernameList = usernames.length === 1 ? usernames[0] : usernames;

//         // Fetch user details for the extracted usernames
//         db.query(
//           'SELECT username, name_surname, phone FROM user WHERE username IN (?)',
//           [usernameList],
//           (error, userRows) => {
//             if (error) {
//               console.error('Error fetching user details:', error);
//               return res.status(500).json({ message: 'Server error' });
//             }

//             // Count agents and owners separately
//             db.query(
//               `SELECT 
//                 COUNT(CASE WHEN type = 'agent' THEN 1 END) AS agentsCount, 
//                 COUNT(CASE WHEN type = 'owner' THEN 1 END) AS ownersCount
//                FROM property WHERE propertyname = ?`,
//               [propertyname],
//               (error, counts) => {
//                 if (error) {
//                   console.error('Error fetching agents and owners count:', error);
//                   return res.status(500).json({ message: 'Server error' });
//                 }

//                 // Send the property details, user list, and agents/owners counts
//                 return res.status(200).json({
//                   property: propertyRows[0],
//                   users: userRows,
//                   agentsCount: counts[0].agentsCount,
//                   ownersCount: counts[0].ownersCount,
//                 });
//               }
//             );
//           }
//         );
//       }
//     );
//   } catch (error) {
//     console.error('Error fetching property details:', error);
//     return res.status(500).json({ message: 'Server error' });
//   }
// };

export const getPropertyDetails = async (req, res) => {
const property_name = req.params.property_name.trim().replace(/\s+/g, ' '); // Clean property name
console.log(property_name);

try {
  // Fetch property details based on the property name
  db.query(
    'SELECT * FROM property_details WHERE TRIM(property_name) = ?',
    [property_name],
    (error, propertyRows) => {
      if (error) {
        console.error('Error fetching property details:', error);
        return res.status(500).json({ message: 'Server error' });
      }

      if (propertyRows.length === 0) {
        return res.status(404).json({ message: 'Property not found' });
      }

      const property = propertyRows[0]; // Assuming single property

      // Fetch owners
      db.query(
        `SELECT u.username, u.name_surname, u.phone 
         FROM new_user u
         INNER JOIN property_details  p ON u.username = p.username
         WHERE p.property_name = ? AND p.type = 'owner'`,
        [property_name],
        (error, ownerRows) => {
          if (error) {
            console.error('Error fetching owners:', error);
            return res.status(500).json({ message: 'Server error' });
          }

          // Fetch agents
          db.query(
            `SELECT u.username, u.name_surname, u.phone , p.configuration , p.furnish_type , p.price
             FROM new_user u
             INNER JOIN property_details  p ON u.username = p.username
             WHERE p.property_name = ? AND p.type = 'agent'`,
            [property_name],
            (error, agentRows) => {
              if (error) {
                console.error('Error fetching agents:', error);
                return res.status(500).json({ message: 'Server error' });
              }

              // Send response with property details, owners, agents, and counts
              return res.status(200).json({
                property,
                owners: ownerRows,
                agents: agentRows,
                agentsCount: agentRows.length,
                ownersCount: ownerRows.length
              });
            }
          );
        }
      );
    }
  );
} catch (error) {
  console.error('Error fetching property details:', error);
  return res.status(500).json({ message: 'Server error' });
}
};
