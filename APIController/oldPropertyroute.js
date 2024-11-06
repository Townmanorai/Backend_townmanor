import express from 'express';
import upload from '../middlewares/multerConfig.js';
import db from '../config/db.js';


const router = express.Router();

router.get('/property', (req, res) => {
    const sql = 'SELECT * FROM property';
    db.query(sql, (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).send(err);
      }
      res.status(200).json(results);
    });
  });


  export default router;
