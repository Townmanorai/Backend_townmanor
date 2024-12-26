import express from 'express';
import db from '../config/db.js';

const router = express.Router();

// Add new loan application
router.post('/loan-applications', (req, res) => {
    const {
        city, occupationType, loanAmount, netSalary, name, mobile,
        monthlyEmi, tenure, dob, termsAccepted
    } = req.body;

    const sql = `
        INSERT INTO loan_applications 
        (city, occupation_type, loan_amount, net_salary, name, mobile, 
        monthly_emi, tenure, dob, terms_accepted) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [city, occupationType, loanAmount, netSalary, name, mobile, monthlyEmi, tenure, dob, termsAccepted];
    db.query(sql, values, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database error while adding loan application.' });
        }
        res.status(201).json({ message: 'Loan application created successfully.' });
    });
});

// Get all loan applications
router.get('/loan-applications', (req, res) => {
    const sql = 'SELECT * FROM loan_applications';
    db.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database error while fetching loan applications.' });
        }
        res.status(200).json(results);
    });
});

// Get a loan application by ID
router.get('/loan-applications/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM loan_applications WHERE id = ?';
    db.query(sql, [id], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database error while fetching the loan application.' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Loan application not found.' });
        }
        res.status(200).json(results[0]);
    });
});

// Update a loan application
router.put('/loan-applications/:id', (req, res) => {
    const { id } = req.params;
    const {
        city, occupationType, loanAmount, netSalary, name, mobile,
        monthlyEmi, tenure, dob, termsAccepted
    } = req.body;

    const sql = `
        UPDATE loan_applications 
        SET city = ?, occupation_type = ?, loan_amount = ?, net_salary = ?, 
            name = ?, mobile = ?, monthly_emi = ?, tenure = ?, dob = ?, 
            terms_accepted = ? 
        WHERE id = ?
    `;
    const values = [city, occupationType, loanAmount, netSalary, name, mobile, monthlyEmi, tenure, dob, termsAccepted, id];
    db.query(sql, values, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database error while updating the loan application.' });
        }
        res.status(200).json({ message: 'Loan application updated successfully.' });
    });
});

// Delete a loan application
router.delete('/loan-applications/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM loan_applications WHERE id = ?';
    db.query(sql, [id], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database error while deleting the loan application.' });
        }
        res.status(200).json({ message: 'Loan application deleted successfully.' });
    });
});

// Add new user occupation
router.post('/user-occupations', (req, res) => {
    const { name, phone, city, occupation } = req.body;

    const sql = `
        INSERT INTO user_occupations (name, phone, city, occupation) 
        VALUES (?, ?, ?, ?)
    `;
    const values = [name, phone, city, occupation];
    db.query(sql, values, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database error while adding user occupation.' });
        }
        res.status(201).json({ message: 'User occupation created successfully.' });
    });
});

// Get all user occupations
router.get('/user-occupations', (req, res) => {
    const sql = 'SELECT * FROM user_occupations';
    db.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database error while fetching user occupations.' });
        }
        res.status(200).json(results);
    });
});

// Get a user occupation by ID
router.get('/user-occupations/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM user_occupations WHERE id = ?';
    db.query(sql, [id], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database error while fetching the user occupation.' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'User occupation not found.' });
        }
        res.status(200).json(results[0]);
    });
});

// Update a user occupation
router.put('/user-occupations/:id', (req, res) => {
    const { id } = req.params;
    const { name, phone, city, occupation } = req.body;

    const sql = `
        UPDATE user_occupations 
        SET name = ?, phone = ?, city = ?, occupation = ? 
        WHERE id = ?
    `;
    const values = [name, phone, city, occupation, id];
    db.query(sql, values, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database error while updating user occupation.' });
        }
        res.status(200).json({ message: 'User occupation updated successfully.' });
    });
});

// Delete a user occupation
router.delete('/user-occupations/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM user_occupations WHERE id = ?';
    db.query(sql, [id], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database error while deleting user occupation.' });
        }
        res.status(200).json({ message: 'User occupation deleted successfully.' });
    });
});

export default router;
