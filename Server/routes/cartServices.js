// routes/customerServices.js

const express = require("express");
const router = express.Router();
const db = require("../Server_Configuration");
const e = require("express");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
//const session = require('express-session');
router.use(cookieParser());
const { validateToken } = require("../JWT");
const { verify } = require("crypto");
const cors = require('cors');
const bodyParser = require('body-parser');
const stripe = require('stripe')('sk_test_51PGG6EP2zpaVFzfpUO9yFsbLUJbLJliQ4HOBRDyxUd10r6u6i5h2ha9O8xAyiGaD3fX9NGfRQZM5SCg1WiqbzRr500XY1lxCbl');

router.post("/addToCart", validateToken, (req, res) => {
  const customerID = req.customerID;
  console.log("Customer id is   ", customerID);
  const { productID, quantity, unitPrice } = req.body;
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
            res.status(200).json({ message: "Product added to cart" });
          }
        });
      } else {
        const sql5 = `SELECT CONCAT(firstName, ' ', lastName) AS name, address, telephone FROM customer WHERE customerID = ${customerID};`;
        db.query(sql5, (err, result) => {
          if (err) {
            console.log(err);
          } else {
            const sql3 = `INSERT INTO cart (customerID, paymentStatus,receiverName,receiverTelephone,deliveryAddress) VALUES (${customerID}, false, '${result[0].name}', '${result[0].telephone}', '${result[0].address}')`;
            db.query(sql3, (err, result) => {
              if (err) {
                console.log(err);
              } else {
                const sql4 = `INSERT INTO cart_item (cartID, productID,quantity,unitPrice) VALUES (${result.insertId}, ${productID},${quantity},${unitPrice})`;
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



router.get("/getCart", validateToken, (req, res) => {
  const customerID = req.customerID;
  console.log("Customer id is   ", customerID);
  const sql = `SELECT * FROM cart WHERE customerID = ? AND paymentStatus = false`;
  db.query(sql, customerID, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      if (result.length > 0) {
        //res.status(200).json({message:"working"});
        const sql2 = `SELECT CI.*,p.productName,p.unitWeight FROM cart_item CI INNER JOIN product p on CI.productID=p.productID WHERE cartID = ${result[0].cartID}`;
        db.query(sql2, (err, result) => {
          if (err) {
            console.log(err);
          } else {
            res.status(200).json(result);
          }
        });
      } else {
        res.status(200).json([]);
      }
    }
  });
});

router.post("/changeDeliveryInfo", validateToken, (req, res) => {
  const customerID = req.customerID;
  const { receiverName, mobile, address } = req.body;
  const sql = `UPDATE cart SET receiverName = '${receiverName}', receiverTelephone = '${mobile}', deliveryAddress = '${address}' WHERE customerID = ${customerID} AND paymentStatus = false`;
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json({ status:500,message: "Internal server error" });
    } else {
      res.status(200).json({ status:200,message: "Delivery information updated" });
    }
  });
});

router.put("/changeCartItemQuantity", validateToken, (req, res) => {
    const { cartItem, quantity } = req.body;
    console.log(cartItem, quantity);
    const sql = "UPDATE cart_item SET quantity = quantity + ? WHERE cart_itemID = ?";
    db.query(sql, [quantity, cartItem], (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).json({ status:500, message: "Internal server error" });
      } else {
        console.log(result);
        res.status(200).json({ status:200, message: "Quantity updated" });
      }
    });
});

router.delete("/removeCartItem",validateToken, (req, res) => {
  console.log("removeCartItem");
  const { cartItemID } = req.body;
  const sql = "DELETE FROM cart_item WHERE cart_itemID = ?";
  db.query(sql, cartItemID, (err, result) => {
    if(err){
      console.log(err);
      res.status(500).json({ status:500, message: "Internal server error" });
    }else{
      res.status(200).json({ status:200, message: "Item removed from cart" });
    }
  });  
});

router.post('/charge', validateToken,async (req, res) => {
  console.log("Charging the card");
  try {
    const { paymentMethodId,amount } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: (amount*100), // Charge amount in cents
      currency: 'lkr',
      payment_method: paymentMethodId,
      confirm: true,
      return_url: 'http://localhost:3000/', 
    });

    console.log("Payment intent is ", paymentIntent);
    res.json({ success: true });
  } catch (error) {
    console.log(error);
    res.json({ error: error.message, success: false }); // Add success: false here
  }
});

router.post("/checkout", validateToken, (req, res) => {
  const customerID = req.customerID;
  const { deliveryCharge } = req.body;

  const sql = `SELECT * FROM cart WHERE customerID = ${customerID} AND paymentStatus = false`;
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      res.json({ status:500, message: "Internal server error" });
    } else {
      if (result.length > 0) {
        const sql2 = `UPDATE cart SET paymentStatus = true, dateTime = CONVERT_TZ(CURRENT_TIMESTAMP, '+00:00', '+00:00'),deliveryCharge=${deliveryCharge} WHERE cartID = ${result[0].cartID};
        `;
        db.query(sql2, (err, result) => {
          if (err) {
            console.log(err);
            res.json({ status:500, message: "Internal server error" });
          } else {
            res.json({ status:200, message: "Payment completed" });
          }
        });
      } else {
        res.json({ status:404, message: "Cart not found" });
      }
    }
  });
});

router.get("/getReceiverDetails", validateToken, (req, res) => {
  const customerID = req.customerID;
  const sql1 =  `SELECT receiverName, receiverTelephone, deliveryAddress FROM cart WHERE customerID = ${customerID} AND paymentStatus = false`;
  db.query(sql1, (err, result) => {
    if (err) {
      console.log(err);
      res.json({ status:500, message: "Internal server error" });
    } else {
      if (result.length > 0) {
        res.status(200).json(result[0]);
      } else {
        sql2 = `SELECT CONCAT(firstName, ' ', lastName) AS receiverName, telephone AS receiverTelephone, address AS deliveryAddress FROM customer WHERE customerID = ${customerID}`;
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

router.get("/cartSize", validateToken, (req, res) => {
  const customerID = req.customerID;
  const sql = `SELECT cartID FROM cart WHERE customerID = ${customerID} AND paymentStatus = false`;
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      res.json({ status:500, message: "Internal server error" });
    } else {
      if (result.length > 0) {
        const sql2 = `SELECT COUNT(*) AS size FROM cart_item WHERE cartID = ${result[0].cartID}`;
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
