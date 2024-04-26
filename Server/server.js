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

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
