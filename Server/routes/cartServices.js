// routes/customerServices.js

const express = require("express");
const router = express.Router();
const db = require("../Server_Configuration");
const e = require("express");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
require('dotenv').config();
router.use(cookieParser());
const { validateToken } = require("../JWT");
const { verify } = require("crypto");
const cors = require('cors');
const bodyParser = require('body-parser');
const stripe = require('stripe')(process.env.Stripe_Secret_Key);

//add to cart route for customer
router.post("/addToCart", validateToken, (req, res) => {
  const customerID = req.customerID;
  const { productID, quantity, unitPrice } = req.body; //retrieve productID, quantity and unitPrice from the request body
  const sql1 = `Select * from cart where customerID = ${customerID} and paymentStatus = false`; //check if there is a cart for the customer
  db.query(sql1, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      if (result.length > 0) { //if there is a cart for the customer
        const sql2 = `INSERT INTO cart_item (cartID, productID,quantity,unitPrice) VALUES (${result[0].cartID}, ${productID},${quantity},${unitPrice})`;//add the product to the cart
        db.query(sql2, (err, result) => {
          if (err) {
            console.log(err);
          } else {
            res.status(200).json({ message: "Product added to cart" });
          }
        });
      } else {
        const sql5 = `SELECT CONCAT(firstName, ' ', lastName) AS name, address, telephone FROM customer WHERE customerID = ${customerID};`;//get the customer details for the delivery
        db.query(sql5, (err, result) => {
          if (err) {
            console.log(err);
          } else {
            const sql3 = `INSERT INTO cart (customerID, paymentStatus,receiverName,receiverTelephone,deliveryAddress) VALUES (${customerID}, false, '${result[0].name}', '${result[0].telephone}', '${result[0].address}')`;//create a new cart for the customer
            db.query(sql3, (err, result) => {
              if (err) {
                console.log(err);
              } else {
                const sql4 = `INSERT INTO cart_item (cartID, productID,quantity,unitPrice) VALUES (${result.insertId}, ${productID},${quantity},${unitPrice})`; //add the product to the cart
                db.query(sql4, (err, result) => {
                  if (err) {
                    console.log(err);
                  } else {
                    console.log(result);
                    res.status(200).json({ message: "Product added to cart" });
                  }
                });
              }
            });
          }
        });
      }
    }
  });
});


//get cart route for customer to view the cart
router.get("/getCart", validateToken, (req, res) => {
  const customerID = req.customerID;
  const sql = `SELECT * FROM cart WHERE customerID = ? AND paymentStatus = false`;//get the cart for the customer
  db.query(sql, customerID, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      if (result.length > 0) {//if there is a cart for the customer
        const sql2 = `SELECT CI.*,p.productName,p.unitWeight FROM cart_item CI INNER JOIN product p on CI.productID=p.productID WHERE cartID = ${result[0].cartID}`;//get the items in the cart
        db.query(sql2, (err, result) => {
          if (err) {
            console.log(err);
          } else {
            res.status(200).json(result);
          }
        });
      } else {
        res.status(200).json([]);//if there is no cart for the customer
      }
    }
  });
});

//change delivery information route for customer to change the delivery information
router.post("/changeDeliveryInfo", validateToken, (req, res) => {
  const customerID = req.customerID;
  const { receiverName, mobile, address } = req.body;
  const sql1 = `SELECT * FROM cart WHERE customerID = ${customerID} AND paymentStatus = false`;//get the cart for the customer
  db.query(sql1, (err, result) => {
    if(err){//if there is an error
      console.log(err);
      res.status(500).json({ status:500,message: "Internal server error" });
    }else{
      if(result.length > 0){
        const sql2 = `UPDATE cart SET receiverName = '${receiverName}', receiverTelephone = '${mobile}', deliveryAddress = '${address}' WHERE cartID = ${result[0].cartID}`;//update the delivery information
        db.query(sql2, (err, result) => {
          if (err) {//if there is an error
            console.log(err);
            res.status(500).json({ status:500,message: "Internal server error" });
          } else {
            res.status(200).json({ status:200,message: "Delivery information updated" });//if the delivery information is updated
          }
        });
      }else{
        res.status(404).json({ status:404,message: "Add items to the cart first" });//if there is no cart for the customer
      }
    }
  });
});

//change cart item quantity route for customer to change the quantity of an item in the cart
router.put("/changeCartItemQuantity", validateToken, (req, res) => {
    const { cartItem, quantity } = req.body;
    const sql = "UPDATE cart_item SET quantity = quantity + ? WHERE cart_itemID = ?"; //update the quantity of the item in the cart
    db.query(sql, [quantity, cartItem], (err, result) => {
      if (err) {//if there is an error
        console.log(err);
        res.status(500).json({ status:500, message: "Internal server error" });
      } else {
        res.status(200).json({ status:200, message: "Quantity updated" }); //if the quantity is updated
      }
    });
});

//remove cart item route for customer to remove an item from the cart
router.delete("/removeCartItem",validateToken, (req, res) => {
  const { cartItemID } = req.body;
  const sql = "DELETE FROM cart_item WHERE cart_itemID = ?"; //delete the item from the cart
  db.query(sql, cartItemID, (err, result) => {
    if(err){
      console.log(err);
      res.status(500).json({ status:500, message: "Internal server error" });
    }else{
      res.status(200).json({ status:200, message: "Item removed from cart" }); //if the item is removed from the cart
    }
  });  
});

//charge route for customer to make a payment using stripe
router.post('/charge', validateToken,async (req, res) => {
  try {
    const { paymentMethodId,amount } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: (amount*100), // Charge amount in cents
      currency: 'lkr', // Currency is Sri Lankan Rupees
      payment_method: paymentMethodId, // Payment method is the payment method id
      confirm: true, // Confirm the payment at the same time
      return_url: 'http://localhost:3000/',  // Redirect to this page after payment
    });

    res.json({ success: true }); // Add success: true here
  } catch (error) {
    console.log(error);
    res.json({ error: error.message, success: false }); // Add success: false here
  }
});

//checkout route for customer to checkout the cart after payment
router.post("/checkout", validateToken, (req, res) => {
  const customerID = req.customerID;
  const { deliveryCharge } = req.body;

  const sql = `SELECT * FROM cart WHERE customerID = ${customerID} AND paymentStatus = false`; //get the cart for the customer
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      res.json({ status:500, message: "Internal server error" });
    } else {
      if (result.length > 0) { //if there is a cart for the customer
        const sql2 = `UPDATE cart SET paymentStatus = true, dateTime = CONVERT_TZ(CURRENT_TIMESTAMP, '+00:00', '+00:00'),deliveryCharge=${deliveryCharge} WHERE cartID = ${result[0].cartID};
        `; //update the payment status of the cart
        db.query(sql2, (err, result) => {
          if (err) {
            console.log(err);
            res.json({ status:500, message: "Internal server error" });
          } else {
            res.json({ status:200, message: "Payment completed" }); //if the payment is completed
          }
        });
      } else {
        res.json({ status:404, message: "Cart not found" });
      }
    }
  });
});

//get receiver details route for customer to get the receiver details
router.get("/getReceiverDetails", validateToken, (req, res) => {
  const customerID = req.customerID;
  const sql1 =  `SELECT receiverName, receiverTelephone, deliveryAddress FROM cart WHERE customerID = ${customerID} AND paymentStatus = false`; //get the receiver details
  db.query(sql1, (err, result) => {
    if (err) {//if there is an error
      console.log(err);
      res.json({ status:500, message: "Internal server error" });
    } else {
      if (result.length > 0) {//if there is a receiver
        res.status(200).json(result[0]);
      } else {
        sql2 = `SELECT CONCAT(firstName, ' ', lastName) AS receiverName, telephone AS receiverTelephone, address AS deliveryAddress FROM customer WHERE customerID = ${customerID}`;//get the customer details as the receiver details
        db.query(sql2, (err, result) => {
          if (err) {
            console.log(err);
            res.json({ status:500, message: "Internal server error" });
          } else {
            res.status(200).json(result[0]);
          }
        });
      }
    }
  });
});

//get cart size route for customer to get the item count in the cart
router.get("/cartSize", validateToken, (req, res) => {
  const customerID = req.customerID;
  const sql = `SELECT cartID FROM cart WHERE customerID = ${customerID} AND paymentStatus = false`;//get the cart for the customer
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      res.json({ status:500, message: "Internal server error" });
    } else {
      if (result.length > 0) {//if there is a cart for the customer
        const sql2 = `SELECT COUNT(*) AS size FROM cart_item WHERE cartID = ${result[0].cartID}`;//get the item count in the cart
        db.query(sql2, (err, result) => {
          if (err) {
            console.log(err);
            res.json({ status:500, message: "Internal server error" });
          } else {
            res.status(200).json(size = result[0]);
          }
        });
      } else {
        res.status(200).json({ size: 0 });
      }
    }
  });
});

module.exports = router;
