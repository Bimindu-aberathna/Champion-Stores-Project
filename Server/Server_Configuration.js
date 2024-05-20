// const mysql = require("mysql");

// const db = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "",
//   database: "champions_stores",
// });
// db.connect((err) => {
//   if (err) {
//     console.error('Error connecting to the database:', err);
//     process.exit(1); // Exit the process with a failure code
//   } else {
//     console.log('Connected to the database');
//   }
// });

// module.exports = db;

const mysql = require("mysql");

const db = mysql.createPool({
  connectionLimit: 100, // Set the connection limit based on your application's needs
  host: "localhost",
  user: "root",
  password: "",
  database: "champions_stores",
});
db.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    process.exit(1); // Exit the process with a failure code
  } else {
    console.log('Connected to the database');
  }
});


module.exports = db;
