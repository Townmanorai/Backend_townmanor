// /config/db.js
import mysql from 'mysql';

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', 
  password: 'root', 
  database: 'townmanor'
});

db.connect(err => {
  if (err) {
    console.error('MySQL connection error:', err);
    process.exit(1); // Exit process if unable to connect to the database
  }
  console.log('MySQL connected...');
});

export default db;
