// routes/customerServices.js

const express = require("express");
const router = express.Router();
const db = require("../Server_Configuration");
const e = require("express");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
//const session = require('express-session');
router.use(cookieParser());
const { createToken, validateToken } = require("../JWT");
const { verify } = require("crypto");

// Define route handler for sign-up user endpoint
router.post("/signUpUser", (req, res) => {
  // Extract the request body
  const { firstName, lastName, email, address, phoneNumber, password } =
    req.body;
  const sql = `SELECT * FROM customer WHERE email = '${email}'`;
  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Internal server error" });
    }
    if (result.length > 0) {
      return res.status(409).json({ message: "User already exists" });
    } else {
      bcrypt
        .hash(password, 10)
        .then((hash) => {
          const sql = `INSERT INTO customer (firstName,lastName,email,password,address,telephone) VALUES(?,?,?,?,?,?)`;
          const values = [
            firstName,
            lastName,
            email,
            hash,
            address,
            phoneNumber,
          ];
          db.query(sql, values, (err, result) => {
            if (err) {
              return res.status(500).json({ message: "Internal server error" });
            }
            return res
              .status(200)
              .json({ message: "User created successfully" });
          });
        })
        .catch((err) => {
          return res.status(500).json({ message: "Internal server error" });
        });
      // const sql = `INSERT INTO customer (firstName,lastName,email,password,address,telephone) VALUES(?,?,?,?,?,?)`;
      // const values = [firstName, lastName, email, password, address, phoneNumber];
      // db.query(sql, values, (err, result) => {
      //     if (err) {
      //         return res.status(500).json({ message: "Internal server error" });
      //     }
      //     return res.status(200).json({ message: "User created successfully" });
      // }	)
    }
  });
});

router.get("/isAuth", validateToken, (req, res) => {
  return res.status(200).json({ message: "User is authenticated" });
});

router.post("/loginUser", (req, res) => {
  // Extract the request body
  const { email, password } = req.body;
  console.log(email, password);
  const sql = `SELECT * FROM customer WHERE email = '${email}'`;
  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Internal server error" });
    }
    if (result.length > 0) {
      const dbPassword = result[0].password;
      bcrypt
        .compare(password, dbPassword)
        .then((match) => {
          if (match) {
            //req.session.user = result;
            //console.log(req.session.user);
            console.log(result[0].customerID);
            const accessToken = createToken(result[0]);
            return res
              .status(200)
              .json({
                auth: true,
                message: "Login successful",
                accessToken: accessToken,
                customerName: result[0].firstName,
                customerID: result[0].customerID,
              });
          } else {
            return res.status(401).json({ message: "Invalid credentials" });
          }
        })
        .catch((err) => {
          return res.status(500).json({ message: "Internal server error" });
        });
      //return res.status(200).json({ message: "Login successful" });
    } else {
      return res.status(401).json({ message: "Invalid credentials" });
    }
  });
});

router.post("/getCustomerDetails", validateToken, (req, res) => {
    const customerID = req.customerID;
    const sql = "SELECT customerID, firstName,lastName,address,telephone FROM customer WHERE customerID = ?;"
    db.query(sql, customerID, (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Internal server error" });
        }
        return res.status(200).json({status: 200, data: result[0]});
    });
});
module.exports = router;
