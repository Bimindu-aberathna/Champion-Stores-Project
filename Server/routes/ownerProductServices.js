const express = require("express");
const router = express.Router();
const db = require("../Server_Configuration");
const e = require("express");
const multer = require("multer");
const upload = multer();
const { validateOwnerToken } = require("../ownerJWT");

router.get("/listProducts", (req, res) => {
  //Endpoint to get all products
  const sql = "CALL GetOwnerProductData()"; //SQL query to get all products using a stored procedure
  
  db.query(sql, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: "Server error occurred" });
    } else {
      res.status(200).json(result[0]);
    }
  });
});

router.get("/getProductData/:productId", (req, res) => {
  const productId = req.params.productId; //Get product ID from the request parameters
  const sql = `
    SELECT p.*, s.name AS supplierName,sub_category.subCategoryName AS subCategoryName,cat.* FROM product p LEFT JOIN supplier s ON p.supplierID = s.supplierID LEFT JOIN sub_category ON sub_category.subCategoryID = p.subCategoryID LEFT JOIN category cat ON cat.categoryID = sub_category.categoryID WHERE p.productID = ?;
      `; //SQL query to get product data

  db.query(sql, [productId], (err, result) => {
    if (err) {
      res.status(500).json({ message: "Server error occurred" });
    } else {
      res.json(result);
    }
  });
});

router.get("/listLowStockProducts", (req, res) => {
  //Endpoint to get low stock products
  const sql =
    "SELECT * from product WHERE preorderLevel>=currentStock AND status = 1;"; //SQL query to get low stock products
  db.query(sql, (err, result) => {
    if (err) res.json({ message: "Server error occurred" });
    res.json(result);
  });
});

router.get("/getCategories", (req, res) => {
  //Endpoint to get all categories
  const sql = "SELECT * FROM category;"; //SQL query to get all categories
  db.query(sql, (err, result) => {
    if (err) res.json({ message: "Server error occurred" });
    res.json(result);
  });
});

router.get("/getSubCategories/:categoryID", (req, res) => {
  //Endpoint to get sub categories by category ID
  const categoryID = req.params.categoryID;

  const sql = "SELECT * FROM sub_category WHERE categoryID = ?;"; //SQL query to get sub categories by category ID
  db.query(sql, [categoryID], (err, result) => {
    if (err) res.json({ message: "Server error occurred" });
    res.json(result);
  });
});
router.get("/getProductsBySubCategory/:subCategoryID", (req, res) => {
  //Endpoint to get products by sub category ID
  const subCategoryID = req.params.subCategoryID;

  const sql = "SELECT * FROM product WHERE subCategoryID = ? AND status = 1;"; //SQL query to get products by sub category ID
  db.query(sql, [subCategoryID], (err, result) => {
    if (err) res.json({ message: "Server error occurred" });
    res.json(result);
  });
});

router.post("/removeExpiredProducts", (req, res) => {
  //Endpoint to remove expired products
  const { productID, quantity } = req.body;
  const sql1 = "Select currentStock from product where productID = ?;"; //SQL query to get current stock of the product
  db.query(sql1, [productID], (err, result) => {
    if (err) {
      res.status(500).json({ message: "Server error occurred" });
    } else {
      if (result[0].currentStock < quantity) {
        //Check if the quantity exceeds the current stock
        res.status(400).json({ message: "Quantity exceeds current stock" });
      } else {
        const sql2 =
          "UPDATE product SET currentStock = currentStock - ? WHERE productID = ?;"; ////SQL query to update current stock
        const values = [quantity, productID];
        db.query(sql2, values, (err2, result2) => {
          if (err2) {
            res.status(500).json({ message: "Server error occurred" });
          } else {
            const sql3 =
              "INSERT INTO expiredproducts (productID, date, quantity) VALUES (?, CURDATE(), ?);"; //SQL query to insert expired products
            const values2 = [productID, quantity];
            db.query(sql3, values2, (err3, result3) => {
              if (err3) {
                res.status(500).json({ message: "Server error occurred" });
              } else {
                res
                  .status(200)
                  .json({ message: "Expired products removed successfully" });
              }
            });
          }
        });
      }
    }
  });
});

router.post("/addProduct", upload.none(), (req, res) => {
  //Endpoint to add a new product
  const {
    productName,
    brandName,
    subCategory,
    openingStock,
    reorderLevel,
    unitPrice,
    buyingPrice,
    productDetails,
    supplierID,
    img1,
    img2,
    img3,
    barcode,
    productWeight,
  } = req.body;
  // Logic to add the product to your database
  const sql =
    "INSERT INTO product (subCategoryID, productName, brandName, details, unitPrice, preorderLevel, currentStock, supplierID, barcode,unitWeight,";

  // Create placeholders for images based on the number of images being passed
  const placeholders = ["image1", "image2", "image3"]
    .slice(0, [img1, img2, img3].filter(Boolean).length)
    .map((img, index) => ` ${img}`);

  // Concatenate placeholders to the SQL query
  const placeholdersString = placeholders.join(",");

  // Complete the SQL query
  const finalSql = `${sql}${placeholdersString}) VALUES (?, ?, ?, ?, ?, ?, ?, ?,?, ?,${placeholders
    .fill("?")
    .join(",")} );`;

  // Create an array to hold the values for the SQL query
  const values = [
    subCategory,
    productName,
    brandName,
    productDetails,
    unitPrice,
    reorderLevel,
    openingStock,
    supplierID,
    barcode,
    productWeight,
  ];

  // Add image values to the values array
  [img1, img2, img3].forEach((img) => {
    if (img) values.push(img);
  });

  db.query(finalSql, values, (err, result) => {
    if (err) {
      console.error("Error adding product", err);
      res.status(500).json({ message: "Server error occurred" });
    } else {
      // Get the current date
      const currentDate = new Date();

      // Get the year, month, and day from the current date
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed, so we add 1
      const day = String(currentDate.getDate()).padStart(2, "0");

      // Concatenate the year, month, and day with hyphens to form the desired format
      const formattedDate = `${year}-${month}-${day}`;
      //SQL query to insert into inventory_purchase table
      const sql2 =
        "INSERT INTO `inventory_purchase` (`productID`, `date`, `unitBuyingPrice`, `itemCount`, `supplierID`) VALUES (?, ?, ?,?,?);";
      const values2 = [
        result.insertId,
        formattedDate,
        buyingPrice,
        openingStock,
        supplierID,
      ];
      db.query(sql2, values2, (err, result) => {
        if (err) {
          console.error("Error adding product", err);
          res.status(500).json({ message: "Server error occurred" });
        } else {
          console.log("Product added successfully");
          res.status(200).json({ message: "Product added successfully" });
        }
      });
    }
  });
});

router.post("/updateProductInfo", upload.none(), (req, res) => {
  //Endpoint to update product information
  const {
    productId,
    productName,
    brandName,
    subCategory,
    openingStock,
    reorderLevel,
    unitPrice,
    productDetails,
    supplierID,
    unitWeight,
    img1,
    img2,
    img3,
  } = req.body;

  // SQL query to update product information
  const sql =
    "UPDATE product SET productName = ?, brandName = ?, subCategoryID = ?, details = ?, unitPrice = ?, preorderLevel = ?, currentStock = ?, supplierID = ?,unitWeight= ?, image1 = ?, image2 = ?, image3 = ? WHERE productID = ?";

  const values = [
    productName,
    brandName,
    subCategory,
    productDetails,
    unitPrice,
    reorderLevel,
    openingStock,
    supplierID,
    unitWeight,
    img1,
    img2,
    img3,
    productId,
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error updating product", err);
      res.status(500).json({ message: "Server error occurred" });
    } else {
      console.log("Product updated successfully");
      res.status(200).json({ message: "Product updated successfully" });
    }
  });
});

router.delete("/deleteProduct/:productId", (req, res) => {
  //Endpoint to delete a product
  const productId = req.params.productId;

  // Logic to delete the product from your database
  const sql = "UPDATE product SET status = 0 WHERE productID = ?;";
  //"DELETE FROM product WHERE productID = ?";
  db.query(sql, [productId], (err, result) => {
    if (err) {
      // If an error occurs, respond with a server error status code
      return res.status(500).json({ message: "Server error occurred" });
    }
  });

  // Respond with a success message
  res.status(200).json({ message: "Product deleted successfully" });
});

router.post("/transaction", validateOwnerToken, (req, res) => {
  // Endpoint for a new transaction
  const { total, discount, subtotal, items } = req.body;

  if (!Array.isArray(items)) {
    return res.status(400).json({ message: "Invalid data fromat" });
  }

  const transactionItems = items;
  const sub_total = total - discount;

  // Get the current date and time
  const currentDateTime = new Date();

  // Format the date and time to match MySQL dateTime format ('YYYY-MM-DD HH:MM:SS')
  const formattedDateTime = currentDateTime
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");

  // Start transaction
  db.beginTransaction((err) => {
    if (err) {
      return res.status(500).json({ message: "Server error occurred" });
    }

    // Logic to save the transaction to database
    const sql1 =
      "INSERT INTO transactions (dateTime, total, discount, subTotal) VALUES (?, ?, ?, ?)";
    const values = [formattedDateTime, total, discount, sub_total];

    db.query(sql1, values, (err, result) => {
      if (err) {
        return db.rollback(() => {
          console.error("Error inserting transaction", err);
          res.status(500).json({ message: "Server error occurred" });
        });
      }

      // Get the last inserted transactionID
      const transactionID = result.insertId;

      // Insert transaction items
      const transactionItemsPromises = transactionItems.map((item) => {
        return new Promise((resolve, reject) => {
          const sql2 =
            "INSERT INTO transaction_items (transactionID, productID, quantity, unitPrice) VALUES (?, ?, ?, ?)";
          const values = [transactionID, item.id, item.quantity, item.price];

          db.query(sql2, values, (err, result) => {
            if (err) {
              return reject(err);
            }

            const sql3 =
              "UPDATE product SET currentStock = currentStock - ? WHERE productID = ?";
            const values3 = [item.quantity, item.id];

            db.query(sql3, values3, (err, result) => {
              if (err) {
                return reject(err);
              }

              resolve();
            });
          });
        });
      });

      // Execute all promises
      Promise.all(transactionItemsPromises)
        .then(() => {
          db.commit((err) => {
            if (err) {
              return db.rollback(() => {
                console.error("Error committing transaction", err);
                res.status(500).json({ message: "Server error occurred" });
              });
            }
            res.status(200).json({ message: "Transaction added successfully" });
          });
        })
        .catch((err) => {
          db.rollback(() => {
            console.error("Error processing transaction items", err);
            res.status(500).json({ message: "Server error occurred" });
          });
        });
    });
  });
});


// router.post("/transaction", validateOwnerToken, async (req, res) => {
//   try {
//     const { total, discount, items } = req.body;
//     const sub_total = total - discount;
//     const currentDateTime = new Date().toISOString().slice(0, 19).replace("T", " ");

//     // Insert transaction
//     const sql1 = "INSERT INTO transactions (dateTime, total, discount, subTotal) VALUES (?, ?, ?, ?)";
//     const [transactionResult] = await db.query(sql1, [currentDateTime, total, discount, sub_total]);

//     // Get the last inserted transactionID
//     const [idResult] = await db.query("SELECT LAST_INSERT_ID() AS transactionID");
//     const transactionID = idResult[0].transactionID;

//     // Prepare transaction items insertion
//     const itemInsertions = items.map(item => {
//       const sql2 = "INSERT INTO transaction_items (transactionID, productID, quantity, unitPrice) VALUES (?, ?, ?, ?)";
//       return db.query(sql2, [transactionID, item.id, item.quantity, item.price]);
//     });

//     // Insert all transaction items
//     await Promise.all(itemInsertions);

//     // Update product stock
//     const stockUpdates = items.map(item => {
//       const sql3 = "UPDATE product SET currentStock = currentStock - ? WHERE productID = ?";
//       return db.query(sql3, [item.quantity, item.id]);
//     });

//     // Wait for all stock updates to complete
//     await Promise.all(stockUpdates);

//     res.status(200).json({ message: "Transaction added successfully" });
//   } catch (err) {
//     console.error("Error processing transaction", err);
//     if (!res.headersSent) {
//       res.status(500).json({ message: "Server error occurred" });
//     }
//   }
// });

router.post("/newInventory", (req, res) => {//Endpoint to add new inventory
  const { productId, stock, buyingPrice, supplierId } = req.body;
  // Get the current date
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const day = String(currentDate.getDate()).padStart(2, "0");

  // Concatenate the year, month, and day with hyphens to form the desired format
  const formattedDate = `${year}-${month}-${day}`;

  const sql1 =
    "UPDATE product SET currentStock = currentStock + ? WHERE productID = ?";//SQL query to update current stock
  const values1 = [stock, productId];

  db.query(sql1, values1, (err1, result) => {
    if (err1) {
      console.error("Error updating product", err1);
      res.status(500).json({ message: "Server error occurred" });
    } else {
      const sql2 =
        "INSERT INTO `inventory_purchase` (`productID`, `date`, `unitBuyingPrice`, `itemCount`, `supplierID`) VALUES (?, ?, ?, ?, ?)";//SQL query to insert into inventory_purchase table
      const values2 = [
        productId,
        formattedDate,
        buyingPrice,
        stock,
        supplierId,
      ];
      db.query(sql2, values2, (err2, result2) => {
        if (err2) {
          console.error("Error inserting into inventory_purchase", err2);
          res.status(500).json({ message: "Server error occurred" });
        } else {
          res.status(200).json({ message: "success" });
        }
      });
    }
  });
});

router.get("/purchaseHistory", (req, res) => {//Endpoint to get purchase history
  const sql = `SELECT i.*,p.productName,p.brandName,
CASE WHEN DATEDIFF(CURRENT_DATE(), i.date) <= 5 THEN true ELSE false END AS ableToCancel,
s.name 
FROM inventory_purchase i 
INNER JOIN product p ON i.productID = p.productID 
INNER JOIN supplier s on p.supplierID = s.supplierID
ORDER BY i.date DESC;`;//SQL query to get purchase history
  db.query(sql, (err, result) => {
    if (err) res.json({ message: "Server error occurred" });
    res.json(result);
  });
});

router.post("/cancelPurchase", (req, res) => {//Endpoint to cancel a purchase
  const purchaseID = req.body.purchaseID;
  // Query to select productID and itemCount from inventory_purchase table
  const selectPurchaseSql =
    "SELECT productID, itemCount FROM inventory_purchase WHERE purchaseID = ?;";//SQL query to select productID and itemCount from inventory_purchase table
  db.query(selectPurchaseSql, [purchaseID], (err, purchaseResult) => {
    if (err) {
      return res.status(500).json({ message: "Server error occurred" });
    }
    if (purchaseResult.length === 0) {
      return res.status(404).json({ message: "Purchase not found" });
    }

    const { productID, itemCount } = purchaseResult[0];

    db.beginTransaction((err) => {
      if (err) {
        return res.status(500).json({ message: "Server error occurred" });
      }

      // Check current stock
      const selectStockSql =
        "SELECT currentStock FROM product WHERE productID = ?;";
      db.query(selectStockSql, [productID], (err, stockResult) => {
        if (err) {
          return db.rollback(() => {
            return res.status(500).json({ message: "Server error occurred" });
          });
        }

        const currentStock = stockResult[0].currentStock;
        if (currentStock < itemCount) {
          return db.rollback(() => {
            return res
              .status(400)
              .json({ message: "Quantity exceeds current stock" });
          });
        }

        // Update stock
        const updateStockSql =
          "UPDATE product SET currentStock = currentStock - ? WHERE productID = ?";
        db.query(
          updateStockSql,
          [itemCount, productID],
          (err, updateResult) => {
            if (err) {
              return db.rollback(() => {
                return res
                  .status(500)
                  .json({ message: "Server error occurred" });
              });
            }

            // Delete purchase
            const deletePurchaseSql =
              "DELETE FROM inventory_purchase WHERE purchaseID = ?";
            db.query(deletePurchaseSql, [purchaseID], (err, deleteResult) => {
              if (err) {
                return db.rollback(() => {
                  return res
                    .status(500)
                    .json({ message: "Server error occurred" });
                });
              }

              db.commit((err) => {
                if (err) {
                  return db.rollback(() => {
                    return res
                      .status(500)
                      .json({ message: "Server error occurred" });
                  });
                }

                return res
                  .status(200)
                  .json({ message: "Purchase cancelled successfully" });
              });
            });
          }
        );
      });
    });
  });
});

router.post("/addNewCategory", (req, res) => {//Endpoint to add a new category
  const { categoryName } = req.body;
  const sql = "INSERT INTO category (categoryName) VALUES (?);";//SQL query to insert a new category
  db.query(sql, [categoryName], (err, result) => {
    if (err) {
      console.error("Error adding category", err);
      res.status(500).json({ message: "Server error occurred" });
    } else {
      console.log("Category added successfully");
      res.status(200).json({ message: "Category added successfully" });
    }
  });
});

router.post("/renameCategory", (req, res) => {//Endpoint to rename a category
  const { categoryNewName, categoryID } = req.body;
  const sql = "UPDATE category SET categoryName = ? WHERE categoryID=?;";
  const values = [categoryNewName, categoryID];
  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error renaming category", err);
      res.status(500).json({ message: "Server error occurred" });
    } else {
      console.log("Category renamed successfully");
      res.status(200).json({ message: "Category renamed successfully" });
    }
  });
});

router.post("/renameSubCategory", (req, res) => {//Endpoint to rename a sub-category
  const { subCategoryNewName, subCategoryID } = req.body;
  const sql =
    "UPDATE sub_category SET subCategoryName = ? WHERE subCategoryID=?;";//SQL query to rename a sub-category
  const values = [subCategoryNewName, subCategoryID];
  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error renaming category", err);
      res.status(500).json({ message: "Server error occurred" });
    } else {
      res.status(200).json({ message: "Sub-Category renamed successfully" });//Respond with a success message
    }
  });
});

router.post("/addNewSubCategory", (req, res) => {//Endpoint to add a new sub-category
  const { subCategoryName, categoryID } = req.body;
  const sql =
    "INSERT INTO sub_category (subCategoryName,categoryID) VALUES (?,?);";//SQL query to insert a new sub-category
  db.query(sql, [subCategoryName, categoryID], (err, result) => {
    if (err) {
      console.error("Error adding category", err);
      res.status(500).json({ message: "Server error occurred" });
    } else {
      res.status(200).json({ message: "Sub-Category added successfully" });
    }
  });
});

router.post("/returnProduct", (req, res) => {//Endpoint to handle product returns
  const { productID, quantity, supplierID, notExchanging } = req.body;
  const sql1 =
    "INSERT INTO product_return (productID, quantity,date, supplierID, notExchanging) VALUES (?,?, CURDATE(), ?, ?);";//SQL query to insert into product_return table
  const values1 = [productID, quantity, supplierID, notExchanging];
  db.query(sql1, values1, (err, result) => {
    if (err) {
      res.status(500).json({ message: "Server error occurred" });
    } else {
      if (!notExchanging) {
        const sql2 =
          "UPDATE product SET currentStock = currentStock - ? WHERE productID = ?;";//SQL query to update current stock
        const values2 = [quantity, productID];
        db.query(sql2, values2, (err2, result2) => {
          if (err2) {
            res.status(500).json({ message: "Server error occurred" });
          } else {
            res.status(200).json({ message: "success" });
          }
        });
      } else {
        res.status(200).json({ message: "success" });
      }
    }
  });
});

router.get("/getBarcodes", (req, res) => {//Endpoint to get all barcodes
  const sql =
    "SELECT barcode FROM product WHERE barcode IS NOT NULL AND barcode <> 'null'AND status=1;";
  db.query(sql, (err, result) => {
    if (err) {
      res.status(500).json({ message: "Server error occurred" });
    } else {
      const barcodes = result.map((product) => product.barcode);
      res.json(barcodes);
    }
  });
});

module.exports = router;
