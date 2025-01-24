import express from 'express';
import upload from '../middlewares/multerConfig.js';
import db from '../config/db.js';
import moment from 'moment-timezone'; 

const router = express.Router();

router.get('/userpackage', (req, res) => {
    const sql = 'SELECT * FROM townmanor.user_dashboard;';
    db.query(sql, (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).send(err);
      }
      res.status(200).json(results);
    });
});

router.get('/userpackage/:username', (req, res) => {
    const username = req.params.username;
    const sql = 'SELECT * FROM townmanor.user_dashboard WHERE username = ?';

    db.query(sql, [username], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send(err);
        }
        if (results.length > 0) {
            res.status(200).json(results[0]); // Send the first matching package
        } else {
            res.status(404).json({ message: 'Package not found' });
        }
    });
});

router.put('/userpackage/:username', (req, res) => {
    const username = req.params.username;
    const { package_json, subscription_history, my_research, my_favorites, my_inquiries, propertylisting } = req.body;

    // Fetch the existing data from the database for the given username
    const sqlGet = 'SELECT package_json, subscription_history, my_research, my_favorites, my_inquiries, propertylisting FROM townmanor.user_dashboard WHERE username = ?';

    db.query(sqlGet, [username], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send(err);
        }

        if (results.length > 0) {
            const userData = results[0];

            // Parse existing JSON fields or set them to empty arrays if null
            let existingPackageJson = userData.package_json ? JSON.parse(userData.package_json) : [];
            let existingSubscriptionHistory = userData.subscription_history ? JSON.parse(userData.subscription_history) : [];
            let existingMyResearch = userData.my_research ? JSON.parse(userData.my_research) : [];
            let existingMyFavorites = userData.my_favorites ? JSON.parse(userData.my_favorites) : [];
            let existingMyInquiries = userData.my_inquiries ? JSON.parse(userData.my_inquiries) : [];
            let existingPropertyListing = userData.propertylisting ? JSON.parse(userData.propertylisting) : [];

            // Append new data to the existing arrays
            if (package_json) {
                existingPackageJson = existingPackageJson.concat(package_json);
            }
            if (subscription_history) {
                existingSubscriptionHistory = existingSubscriptionHistory.concat(subscription_history);
            }
            if (my_research) {
                existingMyResearch = existingMyResearch.concat(my_research);
            }
            if (my_favorites) {
                existingMyFavorites = existingMyFavorites.concat(my_favorites);
            }
            if (my_inquiries) {
                existingMyInquiries = existingMyInquiries.concat(my_inquiries);
            }
            // Handle propertylisting correctly, ensure it's an array of strings
            if (propertylisting) {
                let newListings = Array.isArray(propertylisting) ? propertylisting : [propertylisting];
                // Ensure all new listings are strings, then append
                newListings = newListings.map(item => String(item));
                existingPropertyListing = existingPropertyListing.concat(newListings);
            }

            // Update the database with the new values
            const sqlUpdate = `
                UPDATE townmanor.user_dashboard
                SET package_json = ?, subscription_history = ?, my_research = ?, my_favorites = ?, my_inquiries = ?, propertylisting = ?
                WHERE username = ?`;

            db.query(
                sqlUpdate,
                [
                    JSON.stringify(existingPackageJson),
                    JSON.stringify(existingSubscriptionHistory),
                    JSON.stringify(existingMyResearch),
                    JSON.stringify(existingMyFavorites),
                    JSON.stringify(existingMyInquiries),
                    JSON.stringify(existingPropertyListing),
                    username,
                ],
                (updateErr, result) => {
                    if (updateErr) {
                        console.error('Database error:', updateErr);
                        return res.status(500).json({ message: 'Error updating data', error: updateErr });
                    }
                    res.status(200).json({ message: 'Data updated successfully', result });
                }
            );
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    });
});

router.post('/userpackage/:username', (req, res) => {
    const username = req.params.username;

    // Calculate expiry date: current date + 1 month
    const expiryDate = moment().add(1, 'months').format('YYYY-MM-DD HH:mm:ss');

    // Default package data
    const defaultPackageJson = [
        {
            "id": 1,
            "name": "Free",
            "price": "0 INR",
            "expiry": expiryDate,
            "daysLimit": "30",
            "featuredLimit": 1,
            "listingsLimit": 1
        }
    ];

    // Other fields set to null
    const defaultSubscriptionHistory = null;
    const defaultMyResearch = null;
    const defaultMyFavorites = null;
    const defaultMyInquiries = null;
    const defaultPropertyListing = null;

    // Insert new data into the database for the given username
    const sqlInsert = `
        INSERT INTO townmanor.user_dashboard (username, package_json, subscription_history, my_research, my_favorites, my_inquiries, propertylisting)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    // Insert the default values into the database
    db.query(
        sqlInsert,
        [
            username,
            JSON.stringify(defaultPackageJson),
            JSON.stringify(defaultSubscriptionHistory),
            JSON.stringify(defaultMyResearch),
            JSON.stringify(defaultMyFavorites),
            JSON.stringify(defaultMyInquiries),
            JSON.stringify(defaultPropertyListing),
        ],
        (insertErr, result) => {
            if (insertErr) {
                console.error('Database error:', insertErr);
                return res.status(500).json({ message: 'Error inserting data', error: insertErr });
            }
            res.status(201).json({ message: 'Data created successfully', result });
        }
    );
});

// router.post('/userpackage/:username', (req, res) => {
//     const username = req.params.username;
//     const { package_json, subscription_history, my_research, my_favorites, my_inquiries, propertylisting } = req.body;

//     // Check if required fields are provided in the request body
//     if (!package_json || !subscription_history || !my_research || !my_favorites || !my_inquiries || !propertylisting) {
//         return res.status(400).json({ message: 'Missing required fields' });
//     }

//     // Insert new data into the database for the given username
//     const sqlInsert = `
//         INSERT INTO townmanor.user_dashboard (username, package_json, subscription_history, my_research, my_favorites, my_inquiries, propertylisting)
//         VALUES (?, ?, ?, ?, ?, ?, ?)
//     `;

//     // Ensure all fields are correctly formatted as strings (if needed)
//     db.query(
//         sqlInsert,
//         [
//             username,
//             JSON.stringify(package_json),
//             JSON.stringify(subscription_history),
//             JSON.stringify(my_research),
//             JSON.stringify(my_favorites),
//             JSON.stringify(my_inquiries),
//             JSON.stringify(propertylisting),
//         ],
//         (insertErr, result) => {
//             if (insertErr) {
//                 console.error('Database error:', insertErr);
//                 return res.status(500).json({ message: 'Error inserting data', error: insertErr });
//             }
//             res.status(201).json({ message: 'Data created successfully', result });
//         }
//     );
// });



// Insert a new package for a user
router.post('/add-package', (req, res) => {
    const { id, username, package_json } = req.body;

    // Insert SQL query
    const sql = `INSERT INTO user_package (id, username, package_json) VALUES (?, ?, ?)`;

    // Convert package_json to a string
    const packageJsonString = JSON.stringify(package_json);

    db.query(sql, [id, username, packageJsonString], (err, result) => {
        if (err) {
            console.error('Error inserting data:', err);
            return res.status(500).json({ message: 'Database error', error: err });
        }
        res.status(200).json({ message: 'Package added successfully', result });
    });
});

export default router;
