const mysql = require("mysql");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1234",
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