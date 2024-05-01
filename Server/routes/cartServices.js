// routes/customerServices.js

const express = require("express");
const router = express.Router();
const db = require("../Server_Configuration");
const e = require("express");
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
//const session = require('express-session');
router.use(cookieParser());
const {validateToken} = require("../JWT");
const { verify } = require("crypto");



router.post('/addToCart', validateToken, (req, res) => {
    const customerID  = req.customerID;
    console.log("Customer id is   ",customerID);
    const {productID,quantity,unitPrice} = req.body;
    const sql1 = `Select * from cart where customerID = ${customerID} and paymentStatus = false`;
    db.query(sql1, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            
            if (result.length > 0) {
                const sql2 = `INSERT INTO cart_item (cartID, productID,quantity,unitPrice) VALUES (${result[0].cartID}, ${productID},${quantity},${unitPrice})`;
                db.query(sql2, (err, result) => {
                    if (err) {
                        console.log(err);
                    } else {
                        res.status(200).json({message: "Product added to cart"});
                    }
                });
            } else {
                const sql3 = `INSERT INTO cart (customerID, paymentStatus) VALUES (${customerID}, false)`;
                db.query(sql3, (err, result) => {
                    if (err) {
                        console.log(err);
                    } else {
                        const sql4 = `INSERT INTO cart_item (cartID, productID,quantity) VALUES (${result.insertId}, ${productID},${quantity})`;
                        db.query(sql4, (err, result) => {
                            if (err) {
                                console.log(err);
                            } else {
                                res.status(200).json({message: "Product added to cart"});
                            }
                        });
                    }
                });
            }
        }
    });
});

// router.post("/loginUser", (req, res) => {
//     // Extract the request body
//     const { email, password } = req.body;
//     console.log(email, password);
//     const sql = `SELECT * FROM customer WHERE email = '${email}'`;	
//     db.query(sql, (err, result) => {
       
//     });
    
    
// });

module.exports = router;
