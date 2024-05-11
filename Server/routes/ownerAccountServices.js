const express = require("express");
const router = express.Router();
const db = require("../Server_Configuration");
const {createOwnerToken, validateOwnerToken} = require('../ownerJWT');  
const bcrypt = require("bcrypt");

router.post("/login", (req, res) => {
    const { email, password } = req.body;
    const sql = "SELECT * FROM owner WHERE email = ?";
  
    db.query(sql, [email], (err, result) => {
      if (err) {
        res.status(500).json({ message: "Server error occurred" });
      } else {
        if (result.length > 0) {
          const user = result[0];
          console.log(user);
          console.log(password);
          bcrypt.compare(password, user.password).then((match) => {
            if (match) {
              const accessToken = createOwnerToken(user.ownerID);
              res.status(200).json({ message: "Logged in", accessToken });
            } else {
              res.status(401).json({ message: "Invalid Credentials !" });
            }
          });
        } else {
          res.status(404).json({ message: "Invalid Credentials !" });
        }
      }
    });
  });

module.exports = router;