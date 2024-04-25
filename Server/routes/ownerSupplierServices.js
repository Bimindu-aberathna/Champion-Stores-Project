// routes/customerServices.js

const express = require("express");
const router = express.Router();
const db = require("../Server_Configuration");
const e = require("express");

router.get("/getSuppliers", (req, res) => {
    const sql = "SELECT * FROM supplier;";
    db.query(sql, (err, result) => {
      if (err) res.json({ message: "Server error occurred" });
      res.json(result);
    });
  });

module.exports = router;
