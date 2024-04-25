const express = require("express");
const router = express.Router();
const db = require("../Server_Configuration");

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
          if (user.password === password) {
            res.json({ success: true });
          } else {
            res.json({ success: false, message: "Incorrect password" });
          }
        } else {
          res.json({ success: false, message: "User not found" });
        }
      }
    });
  });

module.exports = router;