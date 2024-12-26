import express from 'express';
import db from '../config/db.js';

const router = express.Router();

// Add new loan application  /api/loan-applications
router.post('/loan-applications', async (req, res) => {
    const {
        city, occupationType, loanAmount, netSalary, name, mobile,
        monthlyEmi, tenure, dob, termsAccepted
    } = req.body;

    try {
        const query = `
            INSERT INTO loan_applications 
            (city, occupation_type, loan_amount, net_salary, name, mobile, 
            monthly_emi, tenure, dob, terms_accepted) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [city, occupationType, loanAmount, netSalary, name, mobile, monthlyEmi, tenure, dob, termsAccepted];
        await db.query(query, values);
        res.status(201).json({ message: 'Loan application created successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database error while adding loan application.' });
    }
});

// Get all loan applications  /api/loan-applications  /api/loan-applications/:id
router.get('/loan-applications', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM loan_applications');
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database error while fetching loan applications.' });
    }
});

// Update a loan application  /api/loan-applications/:id
router.put('/loan-applications/:id', async (req, res) => {
    const { id } = req.params;
    const {
        city, occupationType, loanAmount, netSalary, name, mobile,
        monthlyEmi, tenure, dob, termsAccepted
    } = req.body;

    try {
        const query = `
            UPDATE loan_applications 
            SET city = ?, occupation_type = ?, loan_amount = ?, net_salary = ?, 
                name = ?, mobile = ?, monthly_emi = ?, tenure = ?, dob = ?, 
                terms_accepted = ? 
            WHERE id = ?
        `;
        const values = [city, occupationType, loanAmount, netSalary, name, mobile, monthlyEmi, tenure, dob, termsAccepted, id];
        await db.query(query, values);
        res.status(200).json({ message: 'Loan application updated successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database error while updating loan application.' });
    }
});

// Delete a loan application  /api/loan-applications/:id
router.delete('/loan-applications/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await db.query('DELETE FROM loan_applications WHERE id = ?', [id]);
        res.status(200).json({ message: 'Loan application deleted successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database error while deleting loan application.' });
    }
});

// Add new user occupation  /api/user-occupations
router.post('/user-occupations', async (req, res) => {
    const { name, phone, city, occupation } = req.body;

    try {
        const query = `
            INSERT INTO user_occupations (name, phone, city, occupation) 
            VALUES (?, ?, ?, ?)
        `;
        const values = [name, phone, city, occupation];
        await db.query(query, values);
        res.status(201).json({ message: 'User occupation created successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database error while adding user occupation.' });
    }
});

// Get all user occupations  /api/user-occupations
router.get('/user-occupations', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM user_occupations');
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database error while fetching user occupations.' });
    }
});

// Update a user occupation /api/user-occupations/1
router.put('/user-occupations/:id', async (req, res) => {
    const { id } = req.params;
    const { name, phone, city, occupation } = req.body;

    try {
        const query = `
            UPDATE user_occupations 
            SET name = ?, phone = ?, city = ?, occupation = ? 
            WHERE id = ?
        `;
        const values = [name, phone, city, occupation, id];
        await db.query(query, values);
        res.status(200).json({ message: 'User occupation updated successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database error while updating user occupation.' });
    }
});

// Delete a user occupation      /api/user-occupations/1
router.delete('/user-occupations/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await db.query('DELETE FROM user_occupations WHERE id = ?', [id]);
        res.status(200).json({ message: 'User occupation deleted successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database error while deleting user occupation.' });
    }
});

export default router;
