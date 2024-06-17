const mysql = require("mysql");
require('dotenv').config();

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: process.env.Database_Password,
  database: "champions_stores",
});
db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    process.exit(1); // Exit the process with a failure code
  } else {
    console.log('Connected to the database');
  }
});

module.exports = db;