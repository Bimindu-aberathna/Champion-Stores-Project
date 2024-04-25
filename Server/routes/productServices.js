// routes/customerServices.js

const express = require("express");
const router = express.Router();
const db = require("../Server_Configuration");
const e = require("express");
// Define route handler for sign-up user endpoint
router.get("/getProducts", (req, res) => {
    const sql = 'SELECT * from product';
    db.query(sql, (err, result) => {
        if (err) res.json({ message: 'Server error occurred' });
        res.json(result);
    });  
    })

module.exports = router;
