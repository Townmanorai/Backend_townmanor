import db from '../config/db.js';
import nodemailer from 'nodemailer';

export const getLeads = (req, res) => {
  const { purpose, source } = req.query;
  let sql    = 'SELECT * FROM lead_generation WHERE 1';
  const args = [];

  if (purpose) {
    sql += ' AND purpose = ?';
    args.push(purpose);
  }
  if (source) {
    sql += ' AND source = ?';
    args.push(source);
  }

  sql += ' ORDER BY created_at DESC';

  db.query(sql, args, (err, results) => {
    if (err) {
      console.error('DB error:', err);
      return res.status(500).json({ error: err });
    }
    res.json(results);
  });
};

export const createLead = (req, res) => {
  const { name, phone_number, purpose, source, username, property_name } = req.body;

  const sql = `
    INSERT INTO lead_generation
      (name, phone_number, purpose, source, username, property_name)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  const args = [name, phone_number, purpose, source, username, property_name];

  db.query(sql, args, (err, result) => {
    if (err) {
      console.error('DB error:', err);
      return res.status(500).json({ error: err });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'sunnyofficial77@gmail.com',
        pass: 'oyeb ixcs tdbi unxd', // IMPORTANT: Replace with your actual Google App Password
      },
    });

    const mailOptions = {
      from: 'sunnyofficial77@gmail.com',
      to: 'sunnyofficial77@gmail.com',
      subject: 'New Lead Created',
      html: `
        <h1>New Lead Details</h1>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Phone Number:</strong> ${phone_number}</p>
        <p><strong>Purpose:</strong> ${purpose}</p>
        <p><strong>Source:</strong> ${source}</p>
        <p><strong>Username:</strong> ${username}</p>
        <p><strong>Property Name:</strong> ${property_name}</p>
      `,
    };

    transporter.sendMail(mailOptions, (emailErr, info) => {
      if (emailErr) {
        console.error('Email sending error:', emailErr);
        // Decide if you want to return an error to the client if email fails
      } else {
        console.log('Email sent: ' + info.response);
      }
    });

    res.status(201).json({ id: result.insertId });
  });
};
