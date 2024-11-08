import express from 'express';
import upload from '../middlewares/multerConfig.js';
import db from '../config/db.js';


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
            if (propertylisting) {
                const newListings = JSON.parse(propertylisting);
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
