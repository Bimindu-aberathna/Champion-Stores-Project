const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const path = require("path");
const bcrypt = require("bcryptjs");
const e = require("express");
const bodyParser = require("body-parser");
const { getItemList } = require("./controllers/productController");
const customerServicesRouter = require("./routes/customerServices");
const productServicesRouter = require("./routes/productServices");
const ownerProductServicesRouter = require("./routes/ownerProductServices");
const ownerSupplierServicesRouter = require("./routes/ownerSupplierServices");
const ownerAccountServicesRouter = require("./routes/ownerAccountServices");
const { pseudoRandomBytes } = require("crypto");
const multer = require("multer");
const upload = multer();


const app = express();
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
app.use(express.json());
const port = 5000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const db = require("./Server_Configuration");

app.get("/listProducts", getItemList);

// Use the customer services route handler for the /api/customerServices route
app.use("/api/customerServices", customerServicesRouter);
app.use("/api/ProductServices", productServicesRouter);
app.use("/api/owner/productServices", ownerProductServicesRouter);
app.use("/api/owner/supplierServices", ownerSupplierServicesRouter);
app.use("/api/owner/accountServices", ownerAccountServicesRouter);




app.post("/addProduct", upload.none(), (req, res) => {
  const {
    productName,
    brandName,
    category,
    subCategory,
    openingStock,
    reorderLevel,
    unitPrice,
    productDetails,
    supplierID,
    img1,
    img2,
    img3,
  } = req.body;
  console.log(req.body);
  const sql =
    "INSERT INTO product (subCategoryID, productName, brandName, details, unitPrice, preorderLevel, currentStock,supplierID,";

  // Create placeholders for images based on the number of images being passed
  const placeholders = ["image1", "image2", "image3"]
    .slice(0, [img1, img2, img3].filter(Boolean).length)
    .map((img, index) => ` ${img}`);

  // Concatenate placeholders to the SQL query
  const placeholdersString = placeholders.join(",");

  // Complete the SQL query
  const finalSql = `${sql}${placeholdersString}) VALUES (?, ?, ?, ?, ?, ?,?, ?,${placeholders
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

      const sql2 =
        "INSERT INTO `inventory_purchase` (`productID`, `date`, `unitBuyingPrice`) VALUES (?, ?, ?);";
      const values2 = [result.insertId, formattedDate, unitPrice];
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

app.post("/updaeteProductInfo", upload.none(), (req, res) => {
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
    img1,
    img2,
    img3,
  } = req.body;

  const sql =
    "UPDATE product SET productName = ?, brandName = ?, subCategoryID = ?, details = ?, unitPrice = ?, preorderLevel = ?, currentStock = ?, supplierID = ?, image1 = ?, image2 = ?, image3 = ? WHERE productID = ?";

  const values = [
    productName,
    brandName,
    subCategory,
    productDetails,
    unitPrice,
    reorderLevel,
    openingStock,
    supplierID,
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

// Express route handler to handle DELETE request for deleting a product
app.delete("/deleteProduct/:productId", (req, res) => {
  const productId = req.params.productId;

  // Logic to delete the product from your database
  const sql = "DELETE FROM product WHERE productID = ?";
  db.query(sql, [productId], (err, result) => {
    if (err) {
      // If an error occurs, respond with a server error status code
      return res.status(500).json({ message: "Server error occurred" });
    }
  });

  // Respond with a success message
  res.status(200).json({ message: "Product deleted successfully" });
});

app.post("/transaction", (req, res) => {
  const { total, discount, subtotal, items } = req.body;
  const transactionItems = items;
  const sub_total = total - discount;
  // Get the current date and time
  const currentDateTime = new Date();

  // Format the date and time to match MySQL dateTime format ('YYYY-MM-DD HH:MM:SS')
  const formattedDateTime = currentDateTime
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");

  // Now you can use formattedDateTime in your MySQL query
  console.log(formattedDateTime);
  // Logic to save the transaction to your database
  const sql1 =
    "INSERT INTO transactions (dateTime,total, discount, subTotal) VALUES (?, ?,?, ?)";
  const values = [formattedDateTime, total, discount, sub_total];
  db.query(sql1, values, (err, result) => {
    if (err) {
      console.error("Error updating product", err);
      res.status(500).json({ message: "Server error occurred" });
    } else {
      console.log("Transaction added successfully");
      // Get the last inserted transactionID
      db.query("SELECT LAST_INSERT_ID() AS transactionID", (err, result) => {
        if (err) {
          console.error("Error fetching transactionID", err);
          res.status(500).json({ message: "Server error occurred" });
        } else {
          const transactionID = result[0].transactionID;
          console.log("Transaction ID:", transactionID);
          // Use transactionID to insert transaction items
          transactionItems.forEach((item) => {
            const sql2 =
              "INSERT INTO transaction_items (transactionID, productID, quantity, unitPrice) VALUES (?, ?, ?, ?)";
            const values = [transactionID, item.id, item.quantity, item.price];
            db.query(sql2, values, (err, result) => {
              if (err) {
                console.error("Error updating product", err);
                // Handle error properly
              } else {
                console.log("Transaction item added successfully");
                // Handle success properly
              }
            });
            const sql3 =
              "UPDATE product SET currentStock = currentStock - ? WHERE productID = ?";
            const values3 = [item.quantity, item.id];
            db.query(sql3, values3, (err, result) => {
              if (err) {
                console.error("Error updating product", err);
                // Handle error properly
              } else {
                console.log("Product stock updated successfully");
                // Handle success properly
              }
            });
          });
          res.status(200).json({ message: "Transaction added successfully" });
        }
      });
    }
  });
});

app.post("/addSupplier", (req, res) => {
  // Retrieve data from request body
  const supplierDetails = req.body.supplierDetails;
  const supplierName = req.body.supplierName;
  const supplierEmail = req.body.supplierEmail;
  const phone1 = req.body.phone1;
  const phone2 = req.body.phone2;

  // Example: Saving to a database or performing some other operation
  // Here, we're just logging the received data
  console.log("Received Supplier Details:");
  console.log("Supplier Details:", supplierDetails);
  console.log("Supplier Name:", supplierName);
  console.log("Supplier Email:", supplierEmail);
  console.log("Phone 1:", phone1);
  console.log("Phone 2:", phone2);

  const sql =
    "INSERT INTO supplier (name, email, phone1, phone2, details) VALUES (?, ?, ?, ?, ?)";
  const values = [supplierName, supplierEmail, phone1, phone2, supplierDetails];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error adding supplier", err);
      return res.status(500).json({ message: "Server error occurred" });
    }

    console.log("Supplier added successfully");
    res.status(200).json({ message: "Supplier added successfully" });
  });
});

app.post("/newInventory", (req, res) => {
  const { productId, stock, buyingPrice, supplierId } = req.body;
  // Get the current date
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const day = String(currentDate.getDate()).padStart(2, "0");

  // Concatenate the year, month, and day with hyphens to form the desired format
  const formattedDate = `${year}-${month}-${day}`;

  const sql1 =
    "UPDATE product SET currentStock = currentStock + ? WHERE productID = ?";
  const values1 = [stock, productId];

  db.query(sql1, values1, (err1, result) => {
    if (err1) {
      console.error("Error updating product", err1);
      res.status(500).json({ message: "Server error occurred" });
    } else {
      const sql2 =
        "INSERT INTO `inventory_purchase` (`productID`, `date`, `unitBuyingPrice`, `itemCount`, `supplierID`) VALUES (?, ?, ?, ?, ?)";
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
          console.log("Inventory added successfully");
          res.status(200).json({ message: "success" });
        }
      });
    }
  });
});

app.get("/purchaseHistory", (req, res) => {
  const sql =
    "SELECT i.*,p.productName,p.brandName,CASE WHEN DATEDIFF(CURRENT_DATE(), i.date) <= 5 THEN true ELSE false END AS ableToCancel,s.name FROM inventory_purchase i INNER JOIN product p ON i.productID = p.productID INNER JOIN supplier s on p.supplierID = s.supplierID;";
  db.query(sql, (err, result) => {
    if (err) res.json({ message: "Server error occurred" });
    res.json(result);
  });
});

app.post("/cancelPurchase", (req, res) => {
  const purchaseID = req.body.purchaseID;

  // Query to select productID from inventory_purchase table
  const sql =
    "SELECT productID,itemCount FROM inventory_purchase WHERE purchaseID = ?;";
  db.query(sql, [purchaseID], (err, result) => {
    if (err) {
      res.status(500).json({ message: "Server error occurred" });
    } else {
      if (result.length === 0) {
        res.status(404).json({ message: "Purchase not found" });
      } else {
        const productID = result[0].productID;
        const itemCount = result[0].itemCount;
        const sql2 =
          "UPDATE product SET currentStock = currentStock - ? WHERE productID = ?";
        const values = [itemCount, productID];
        db.query(sql2, values, (err2, result2) => {
          if (err2) {
            res.status(500).json({ message: "Server error occurred" });
          } else {
            const sql3 = "DELETE FROM inventory_purchase WHERE purchaseID = ?";
            db.query(sql3, [purchaseID], (err3, result3) => {
              if (err3) {
                res.status(500).json({ message: "Server error occurred" });
              } else {
                res
                  .status(200)
                  .json({ message: "Purchase cancelled successfully" });
              }
            });
          }
        });
      }
    }
  });
});

app.post("/addNewCategory", (req, res) => {
  const { categoryName } = req.body;
  const sql = "INSERT INTO category (categoryName) VALUES (?);";
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

app.post("/renameCategory", (req, res) => {
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

app.post("/renameSubCategory", (req, res) => {
  const { subCategoryNewName, subCategoryID } = req.body;
  const sql =
    "UPDATE sub_category SET subCategoryName = ? WHERE subCategoryID=?;";
  const values = [subCategoryNewName, subCategoryID];
  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error renaming category", err);
      res.status(500).json({ message: "Server error occurred" });
    } else {
      console.log("Sub-Category renamed successfully");
      res.status(200).json({ message: "Sub-Category renamed successfully" });
    }
  });
});

app.post("/addNewSubCategory", (req, res) => {
  const { subCategoryName, categoryID } = req.body;
  const sql =
    "INSERT INTO sub_category (subCategoryName,categoryID) VALUES (?,?);";
  db.query(sql, [subCategoryName, categoryID], (err, result) => {
    if (err) {
      console.error("Error adding category", err);
      res.status(500).json({ message: "Server error occurred" });
    } else {
      console.log("Sub-Category added successfully");
      res.status(200).json({ message: "Sub-Category added successfully" });
    }
  });
});

app.post("/returnProduct", (req, res) => {
  const { productID, quantity, supplierID, notExchanging } = req.body;
  const sql1 =
    "INSERT INTO product_return (productID, quantity,date, supplierID, notExchanging) VALUES (?,?, CURDATE(), ?, ?);";
    const values1 = [productID, quantity, supplierID, notExchanging];
    db.query(sql1, values1, (err, result) => {
      if (err) {
        res.status(500).json({ message: "Server error occurred" });
      } else {
        if(!notExchanging){
          const sql2 = "UPDATE product SET currentStock = currentStock - ? WHERE productID = ?;";
          const values2 = [quantity, productID];
          db.query(sql2, values2, (err2, result2) => {
            if (err2) {
              res.status(500).json({ message: "Server error occurred" });
            } else {
              res.status(200).json({ message: "success" });
            }
          });	
      }else{
        res.status(200).json({ message: "success" });
      }
    }
  });
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
