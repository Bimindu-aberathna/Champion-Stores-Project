const express = require("express");
const router = express.Router();
const db = require("../Server_Configuration");
const e = require("express");
const multer = require("multer");
const upload = multer();
const moment = require("moment-timezone");
const { validateOwnerToken } = require("../ownerJWT");

// endpoint to get all orders
router.get("/getOrders",validateOwnerToken, (req, res) => {
  const query =
    "SELECT cart.*, cart_item.*,product.productName,(cart_item.quantity * cart_item.unitPrice) AS total FROM cart INNER JOIN cart_item ON cart.cartID = cart_item.cartID INNER JOIN product ON product.productID = cart_item.productID WHERE cart.deliveryStatus = 0 AND paymentStatus = 1;";
  db.query(query, (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Internal server error" });
    }

    // Group cart items by cart
    const groupedResult = result.reduce((acc, curr) => {
      if (!acc[curr.cartID]) {
        acc[curr.cartID] = {
          ...curr,
          items: [],
          dateTime: moment
            .utc(curr.dateTime)
            .tz("Asia/Colombo")
            .format("YYYY-MM-DD"),
          totalAmount: 0,
        };
      }
      //Add items to the cart in the grouped result
      acc[curr.cartID].items.push({
        cart_itemID: curr.cart_itemID,
        productName: curr.productName,
        quantity: curr.quantity,
        unitPrice: curr.unitPrice,
        total: curr.total,
      });
      acc[curr.cartID].totalAmount += curr.total;
      return acc;
    }, {});

    // Convert object to array
    const finalResult = Object.values(groupedResult); //Convert object to array

    return res.status(200).json({ status: 200, data: finalResult });
  });
});

// endpoint to update delivery status
router.post("/updateDeliveryStatus",validateOwnerToken, (req, res) => {
    const { cartID } = req.body;
    const query = "UPDATE cart SET deliveryStatus = 1 WHERE cartID = ?"; //SQL query to update delivery status
    db.query(query, [cartID], (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Internal server error" });
      }
      return res.status(200).json({ status: 200, message: "Delivery status updated" });
    });
});

module.exports = router;
