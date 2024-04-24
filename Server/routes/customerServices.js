// routes/customerServices.js

const express = require("express");
const router = express.Router();
const db = require("../Server_Configuration");
const e = require("express");
// Define route handler for sign-up user endpoint
router.post("/signUpUser", (req, res) => {
    // Extract the request body
    const { firstName, lastName, email, address, phoneNumber, password } = req.body;
    const sql = `SELECT * FROM customer WHERE email = '${email}'`
    db.query(sql, (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Internal server error" });
        }
        if (result.length > 0) {
            return res.status(409).json({ message: "User already exists" });

        }else{
            const sql = `INSERT INTO customer (firstName,lastName,email,password,address,telephone) VALUES(?,?,?,?,?,?)`;
            const values = [firstName, lastName, email, password, address, phoneNumber];
            db.query(sql, values, (err, result) => {
                if (err) {
                    return res.status(500).json({ message: "Internal server error" });
                }
                return res.status(200).json({ message: "User created successfully" });
            }	)
        }
        
    })
    
    
    // // Check if the user already exists
    // const userExists = customers.find((customer) => customer.email === email);
    // if (userExists) {
    //     return res.status(400).json({ message: "User already exists" });
    // }
    
    // // Hash the password
    // const salt = bcrypt.genSaltSync(10);
    // const hashedPassword = bcrypt.hashSync(password, salt);
    
    // // Create a new user object
    // const newUser = {
    //     firstName,
    //     lastName,
    //     email,
    //     address,
    //     phoneNumber,
    //     password: hashedPassword,
    // };
    
    // // Add the new user to the customers array
    // customers.push(newUser);
    
    // // Send the response
    // res.status(200).json({ message: "User created successfully" });
});

module.exports = router;
