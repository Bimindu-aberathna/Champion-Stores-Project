const express = require("express");
const router = express.Router();
const db = require("../Server_Configuration");
const e = require("express");

router.get("/getProductData/:productId", (req, res) => {
  const productId = req.params.productId;
  const sql = `
    SELECT p.*, s.name AS supplierName,sub_category.subCategoryName AS subCategoryName,cat.* FROM product p LEFT JOIN supplier s ON p.supplierID = s.supplierID LEFT JOIN sub_category ON sub_category.subCategoryID = p.subCategoryID LEFT JOIN category cat ON cat.categoryID = sub_category.categoryID WHERE p.productID = ?;
      `;

  db.query(sql, [productId], (err, result) => {
    if (err) {
      res.status(500).json({ message: "Server error occurred" });
    } else {
      res.json(result);
    }
  });
});

router.get("/listLowStockProducts", (req, res) => {
  const sql = "SELECT * from product WHERE preorderLevel>=currentStock;";
  db.query(sql, (err, result) => {
    if (err) res.json({ message: "Server error occurred" });
    res.json(result);
  });
});

router.get("/getCategories", (req, res) => {
  const sql = "SELECT * FROM category;";
  db.query(sql, (err, result) => {
    if (err) res.json({ message: "Server error occurred" });
    res.json(result);
  });
});

router.get("/getSubCategories/:categoryID", (req, res) => {
    const categoryID = req.params.categoryID;
  
    const sql = "SELECT * FROM sub_category WHERE categoryID = ?;";
    db.query(sql, [categoryID], (err, result) => {
      if (err) res.json({ message: "Server error occurred" });
      res.json(result);
    });
  });
  router.get("/getProductsBySubCategory/:subCategoryID", (req, res) => {
    const subCategoryID = req.params.subCategoryID;
  
    const sql = "SELECT * FROM product WHERE subCategoryID = ?;";
    db.query(sql, [subCategoryID], (err, result) => {
      if (err) res.json({ message: "Server error occurred" });
      res.json(result);
    });
  });

router.post("/removeExpiredProducts", (req, res) => {
    const { productID, quantity } = req.body;
    const sql1 =
      "UPDATE product SET currentStock = currentStock - ? WHERE productID = ?;";
    const values = [quantity, productID];
  
    db.query(sql1, values, (err, result) => {
      if (err) {
        res.status(500).json({ message: "Server error occurred" });
      } else {
        const sql2 =
          "INSERT INTO expiredproducts (productID, date, quantity) VALUES (?, CURDATE(), ?);";
        const values2 = [productID, quantity];
        db.query(sql2, values2, (err2, result2) => {
          if (err2) {
            res.status(500).json({ message: "Server error occurred" });
          } else {
            res
              .status(200)
              .json({ message: "Expired products removed successfully" });
          }
        });
      }
    });
  });

module.exports = router;
