// payuRoutes.js
import express from 'express';
import crypto from 'crypto'; // For generating the hash
import axios from 'axios';
import db from '../config/db.js';



const router = express.Router();

// PayU credentials
const PAYU_MERCHANT_KEY = 'UvTrjC';
const PAYU_MERCHANT_SALT = 'eSJXLHsYyh94sUffYo2Th8Rhngvo8TDE';
const PAYU_BASE_URL = 'https://secure.payu.in/_payment'; // Change to production URL when live
// const PAYU_BASE_URL = 'https://test.payu.in/_payment';


router.post('/payu/payment', async (req, res) => {
    const { amount, firstname, email, phone, productinfo, surl, furl } = req.body;
    console.log(amount, firstname, email, phone, productinfo, surl, furl);
    // Generate unique transaction ID
    const txnid = 'OID' + new Date().getTime();
  
    // Hash string according to PayU's format
    const hashString = `${PAYU_MERCHANT_KEY}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|||||||||||${PAYU_MERCHANT_SALT}`;
    // const hashString = `${PAYU_MERCHANT_KEY}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|||||||||||`;

    console.log(hashString);
    // Generate the SHA-512 hash
    const hash = crypto.createHash('sha512').update(hashString).digest('hex');
    console.log(hash);

    
    const payuParams = {
      key: PAYU_MERCHANT_KEY,
      txnid: txnid,
      amount: amount,
      firstname: firstname,
      email: email,
      phone: phone,
      productinfo: productinfo,
      surl: surl, // Success URL
      furl: furl, // Failure URL
      hash: hash,
      service_provider: 'payu_paisa'
    };
  
    try {
      // Instead of calling PayU here, return the payment params to the frontend
      res.status(200).json({ paymentUrl: PAYU_BASE_URL, params: payuParams });
    } catch (error) {
      console.error('Payment error: ', error);
      res.status(500).send('Payment failed');
    }
  });


// Success callback handler
router.post('/payu/success', (req, res) => {
  console.log('Success Callback: ', req.body);
  const { txnid, amount, productinfo, firstname, email, status, hash } = req.body;

  // Generate hash string to verify response
  const hashString = `${process.env.PAYU_MERCHANT_SALT}|${status}|||||||||||${email}|${firstname}|${productinfo}|${amount}|${txnid}|${process.env.PAYU_MERCHANT_KEY}`;
  const generatedHash = crypto.createHash('sha512').update(hashString).digest('hex');

  // Verify the hash
  if (generatedHash === hash) {
    // Assuming the user's username is stored in `firstname`
    const username = firstname;  // Adjust this if needed

    // Fetch the user record
    db.query('SELECT * FROM user_plans_limit WHERE username = ?', [username], (err, results) => {
      if (err) {
        console.error('Database fetch error:', err);
        return res.redirect('http://localhost:5173/failure?error=database_error');
      }

      if (results.length > 0) {
        const userPlan = results[0];
        const updates = {};

        // Update based on amount
        switch (parseFloat(amount)) {
          case 200.00:
            updates.propertyplans_total_limit = parseInt(userPlan.propertyplans_total_limit) + 3;
            break;
          case 500.00:
            updates.propertyplans_total_limit = parseInt(userPlan.propertyplans_total_limit) + 5;
            break;
          case 2500.00:
            updates.propertyplans_total_limit = parseInt(userPlan.propertyplans_total_limit) + 25;
            break;
          case 2000.00:
            updates.featured_agent = parseInt(userPlan.featured_agent) + 1;
            break;
          case 5000.00:
            updates.agent_on_spotlight = parseInt(userPlan.agent_on_spotlight) + 1;
            break;
          case 7000.00:
            updates.property_search_booster = parseInt(userPlan.property_search_booster) + 1;
            break;
          case 100.00:
            updates.owner_details = parseInt(userPlan.owner_details) + 10;
            break;
          case 300.00:
            updates.owner_details = parseInt(userPlan.owner_details) + 25;
            break;
          case 600.00:
            updates.owner_details = parseInt(userPlan.owner_details) + 75;
            break;
          case 1000.00:
            updates.owner_details = parseInt(userPlan.owner_details) + 100;
            break;
          default:
            // Handle other amounts if necessary
            break;
        }

        // Update the database with new values
        db.query('UPDATE user_plans_limit SET ? WHERE username = ?', [updates, username], (updateErr) => {
          if (updateErr) {
            console.error('Database update error:', updateErr);
            return res.redirect('http://localhost:5173/failure?error=database_error');
          }

          // Redirect to frontend success URL with PayU response data as query params
          return res.redirect(`http://localhost:5173/success?txnid=${txnid}&status=${status}&amount=${amount}`);
        });
      } else {
        return res.redirect('http://localhost:5173/failure?error=user_not_found');
      }
    });
  } else {
    return res.redirect(`http://localhost:5173/failure?error=hash_mismatch`);
  }
});


// Failure callback handler
router.post('/payu/failure', (req, res) => {
  console.log('Failure Callback: ', req.body);
  const { txnid, amount, productinfo, firstname, email, status } = req.body;

  // Redirect to frontend failure URL with transaction details
  return res.redirect(`http://localhost:5173/failure?txnid=${txnid}&status=${status}&amount=${amount}`);
});



// Test success route for manual testing

// router.get('/payu/test/success', (req, res) => {
//   const username = 'ravindra';  // Change to a valid username
//   const sql = 'SELECT * FROM townmanor.user_plans_limit WHERE username = ?';

//   db.query(sql, [username], (err, results) => {
//     if (err) {
//       console.error('Database fetch error:', err);  // Log the error
//       return res.status(500).send('Fetch failed due to database error');
//     }

//     if (results.length > 0) {
//       console.log('User Plan:', results[0]);  // Log the fetched userPlan
//       return res.send('User found: ' + JSON.stringify(results[0]));
//     } else {
//       return res.send('User not found');
//     }
//   });
// });

router.get('/payu/test/success', (req, res) => {
  const txnid = 'OID' + new Date().getTime();
  const amount = 2500;  // Change this value for different test cases
  const productinfo = 'Test Product';
  const firstname = 'ravindra';  // Ensure this username exists in the user_plans_limit table
  const email = 'test@example.com';
  const status = 'success';

  // Generate hash string to verify response
  const hashString = `${process.env.PAYU_MERCHANT_SALT}|${status}|||||||||||${email}|${firstname}|${productinfo}|${amount}|${txnid}|${process.env.PAYU_MERCHANT_KEY}`;
  const generatedHash = crypto.createHash('sha512').update(hashString).digest('hex');

  // Simulate the success callback logic
  if (generatedHash === generatedHash) { // Change this comparison to your verification logic
    const username = firstname;

    // SQL to fetch user plan
    const sqlFetch = 'SELECT * FROM townmanor.user_plans_limit WHERE username = ?';

    db.query(sqlFetch, [username], (err, results) => {
      if (err) {
        console.error('Database fetch error:', err);  // Log the error
        return res.status(500).send('Fetch failed due to database error');
      }

      if (results.length > 0) {
        const userPlan = results[0]; // Get the first user plan
      
        console.log('User Plan:', userPlan);  // Log the fetched userPlan
      
        const updates = {};
      
        // Switch-case for test amount (as per real logic)
        switch (parseFloat(amount)) {
          case 200.00:
            updates.propertyplans_total_limit = parseInt(userPlan.propertyplans_total_limit) + 3;
            break;
          case 500.00:
            updates.propertyplans_total_limit = parseInt(userPlan.propertyplans_total_limit) + 5;
            break;
          case 2500.00:
            updates.propertyplans_total_limit = parseInt(userPlan.propertyplans_total_limit) + 25;
            break;
          case 2000.00:
            updates.featured_agent = parseInt(userPlan.featured_agent) + 1;
            break;
          case 5000.00:
            updates.agent_on_spotlight = parseInt(userPlan.agent_on_spotlight) + 1;
            break;
          case 7000.00:
            updates.property_search_booster = parseInt(userPlan.property_search_booster) + 1;
            break;
          case 100.00:
            updates.owner_details = parseInt(userPlan.owner_details) + 10; // Ensure correct property access
            break;
          case 300.00:
            updates.owner_details = parseInt(userPlan.owner_details) + 25; // Ensure correct property access
            break;
          case 600.00:
            updates.owner_details = parseInt(userPlan.owner_details) + 75; // Ensure correct property access
            break;
          case 1000.00:
            updates.owner_details = parseInt(userPlan.owner_details) + 100; // Ensure correct property access
            break;
          default:
            // Handle other amounts if necessary
            break;
        }

        // SQL to update user plan
        const sqlUpdate = 'UPDATE townmanor.user_plans_limit SET ? WHERE username = ?';
        db.query(sqlUpdate, [updates, username], (updateErr) => {
          if (updateErr) {
            console.error('Database update error:', updateErr);
            return res.send('Test failed due to database error');
          }

          // Simulate success response
          return res.send(`Test success! Database updated for user: ${username} with amount: ${amount}`);
        });
      } else {
        return res.send('User not found in user_plans_limit');
      }
    });
  } else {
    return res.send('Hash mismatch - test failed');
  }
});


// PayU success callback
router.post('/boster/payu/success', (req, res) => {
  console.log('Success Callback:', req.body);
  const { txnid, amount, productinfo, firstname, email, status, hash } = req.body;

  // Verify response hash
  const hashString = `${process.env.PAYU_MERCHANT_SALT}|${status}|||||||||||${email}|${firstname}|${productinfo}|${amount}|${txnid}|${process.env.PAYU_MERCHANT_KEY}`;
  const generatedHash = crypto.createHash('sha512').update(hashString).digest('hex');

  if (generatedHash !== hash) {
    console.error('Hash mismatch');
    return res.redirect('https://townmanor.ai/failure');
  }

  // Save transaction into tran_history table
  const insertQuery = `INSERT INTO tran_history 
    (txnid, amount, productinfo, firstname, email, status, hash, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`;

  db.query(
    insertQuery,
    [txnid, amount, productinfo, firstname, email, status, hash],
    (err) => {
      if (err) {
        console.error('Database insert error:', err);
        return res.redirect('https://townmanor.ai/failure');
      }

      // Redirect to frontend success page
      return res.redirect('https://townmanor.ai/success');
    }
  );
});

router.post('/boster/payu/failure', (req, res) => {
  console.log('Failure Callback:', req.body);
  const { txnid, amount, productinfo, firstname, email, status, hash } = req.body;

  // Save transaction into tran_history table
  const insertQuery = `INSERT INTO tran_history 
    (txnid, amount, productinfo, firstname, email, status, hash, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`;

  db.query(
    insertQuery,
    [txnid, amount, productinfo, firstname, email, status, hash],
    (err) => {
      if (err) {
        console.error('Database insert error:', err);
      }
      // Redirect to frontend failure page
      return res.redirect('https://townmanor.ai/failure');
    }
  );
});

export default router;