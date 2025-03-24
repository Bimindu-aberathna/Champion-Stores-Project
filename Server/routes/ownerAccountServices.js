const express = require("express");
const router = express.Router();
const db = require("../Server_Configuration");
const { createOwnerToken, validateOwnerToken } = require("../ownerJWT");
const bcrypt = require("bcrypt");
const { stat } = require("fs/promises");
const nodemailer = require("nodemailer");
require('dotenv').config();

// endpoint to owner login
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  const sql = "SELECT * FROM owner WHERE email = ?";//Check if the email exists in the database

  db.query(sql, [email], (err, result) => {
    if (err) {
      res.status(500).json({ message: "Server error occurred" });
    } else {
      if (result.length > 0) { //If the email exists
        const user = result[0];
        bcrypt.compare(password, user.password).then((match) => {//Compare the password with the hashed password in the database
          if (match) {
            const accessToken = createOwnerToken(user.id); //Create a JWT token and send it as the response
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

// Endpoint to verify the owner's current password
router.post("/verifyPassword", validateOwnerToken, (req, res) => {
  const { password } = req.body;
  const ownerID = req.ownerID;
  const sql = "SELECT password FROM owner WHERE id = ?";//Get the hashed password from the database
  db.query(sql, [ownerID], (err, result) => {
    if (err) {
      res.status(500).json({ status: 500, message: "Server error occurred" });
    } else {
      if (result.length > 0) {
        const user = result[0];
        bcrypt.compare(password, user.password).then((match) => {//Compare the password with the hashed password in the database
          if (match) {
            res
              .status(200)
              .json({ status: 200, message: "Password Verified !" });
          } else {
            res
              .status(401)
              .json({ status: 401, message: "Invalid Password !" });
          }
        });
      } else {
        res.status(404).json({ status: 404, message: "Invalid Owner !" });
      }
    }
  });
});

// Endpoint to update the owner's email
router.post("/changeEmail", validateOwnerToken, (req, res) => {
  const { email } = req.body;
  const ownerID = req.ownerID;
  const sql = "UPDATE owner SET email = ? WHERE id = ?"; //SQL query to update the email
  db.query(sql, [email, ownerID], (err, result) => {
    if (err) {
      res.status(500).json({ status: 500, message: "Server error occurred" });
    } else {
      res.status(200).json({ status: 200, message: "Email Updated !" });
    }
  });
});

// Endpoint to get the owner's email
router.get("/getEmail", validateOwnerToken, (req, res) => {
  const ownerID = req.ownerID;
  const sql = "SELECT email FROM owner WHERE id = ?";//Get the email from the database
  db.query(sql, [ownerID], (err, result) => {
    if (err) {
      res.status(500).json({ status: 500, message: "Server error occurred" });
    } else {
      if (result.length > 0) {//If the email exists
        res.status(200).json({ status: 200, email: result[0].email });
      } else {
        res.status(404).json({ status: 404, message: "Invalid Owner !" });
      }
    }
  });
});

// Endpoint to update the owner's password
router.post("/changePassword", validateOwnerToken, (req, res) => {
  const { password } = req.body;
  const ownerID = req.ownerID;
  const sql = "UPDATE owner SET password = ? WHERE id = ?";//SQL query to update the password
  bcrypt
    .hash(password, 10)
    .then((hash) => {//Hash the password
      db.query(sql, [hash, ownerID], (err, result) => {
        if (err) {
          res
            .status(500)
            .json({ status: 500, message: "Server error occurred" });
        } else {
          res.status(200).json({ status: 200, message: "Password Updated !" });
        }
      });
    })
    .catch((err) => {
      res.status(500).json({ status: 500, message: "Server error occurred" });
    });
});

// Endpoint to check if the email exists
router.post("/checkEmail", (req, res) => {
  const { email } = req.body;
  const sql = "SELECT * FROM owner WHERE email = ?";
  db.query(sql, [email], (err, result) => {
    if (err) {
      res.status(500).json({ status: 500, message: "Server error occurred" });
    } else {
      if (result.length > 0) {
        res.status(200).json({ status: 200, message: "Email exists" });
      } else {
        res.status(404).json({ status: 404, message: "Email does not exist" });
      }
    }
  });
});

// Endpoint to send OTP to reset the password
router.post("/sendOTP", (req, res) => {
  const { email, OTP } = req.body;
  const sql = "INSERT INTO passwordreset(userEmail,OTP) VALUES(?,?)";
  db.query(sql, [email, OTP], (err, result) => {
    if (err) {
      res.status(500).json({ status: 500, message: "Server error occurred" });
    } else {
      var nodemailer = require("nodemailer");//Import nodemailer which is used to send emails

      var transporter = nodemailer.createTransport({
        service: "yahoo",
        auth: {
          user: "biminduonline@yahoo.com",
          pass: process.env.yahoo_mail_password,
        },
      });//Create a transporter object with the email service and credentials

      var mailOptions = {
        from: "biminduonline@yahoo.com",
        to: email,
        subject: "Sending Email using Node.js",
        html: `<!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Champion Stores - Reset Password OTP</title>
          <style>
            body {
              font-family: Arial, sans-serif; /* Specify preferred font */
              margin: 0;
              padding: 0;
              background-color: #f7f7f7; /* Light gray background */
            }
        
            .container {
              max-width: 600px;
              margin: 50px auto;
              padding: 30px;
              background-color: #fff; /* White background for content */
              border: 1px solid #ddd; /* Light gray border */
              border-radius: 5px;
              box-shadow: 0 0 5px rgba(0, 0, 0, 0.1); /* Subtle shadow */
            }
        
            .header {
              display: flex;
              align-items: center;
              justify-content: space-between;
              margin-bottom: 30px;
            }
        
            .header img {
              width: 150px;
            }
        
            .header h1 {
              font-size: 22px; /* Slightly larger heading */
              margin: 0;
              color: #333; /* Darker text for better contrast */
            }
        
            .content {
              line-height: 1.6; /* Slightly larger line spacing for readability */
              color: #666; /* Lighter text for body content */
            }
        
            .otp {
              font-size: 24px;
              font-weight: bold;
              text-align: center;
              margin: 20px 0;
              background-color: #f2f2f2; /* Lighter background for OTP */
              padding: 15px 30px;
              border-radius: 5px;
            }
        
            .footer {
              text-align: center;
              margin-top: 30px;
              color: #aaa; /* Faded text for copyright */
            }
        
            a { /* Style links for better visibility */
              color: #33b5e5; /* Blue color for links */
              text-decoration: none; /* Remove underline */
            }
        
            a:hover { /* Highlight on hover */
              text-decoration: underline;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <header class="header">
              <img src="https://firebasestorage.googleapis.com/v0/b/champions-stores.appspot.com/o/logo.png?alt=media&token=383ecef7-be84-45f7-8244-3cc4824fe717" alt="Champion Stores Logo">
              <h1>Reset Your Champion Stores Password</h1>
            </header>
            <main class="content">
              <p>Ayubowan,</p>
              <p>You recently requested to reset your password for your Champion Stores account. Here's your One-Time Password (OTP) to complete the process:</p>
              <h2 class="otp">${OTP}</h2>
              <p>This OTP is valid for 10 minutes. Please enter it on the password reset page to create a new password.</p>
              <p>If you didn't request a password reset, you can safely ignore this email.</p>
              <p>For your security, we recommend changing your password regularly.</p>
              <p>Happy Shopping,<br>The Champion Stores Team</p>
            </main>
            <footer class="footer">
              <p>&copy; Champion Stores 2024</p>
            </footer>
          </div>
        </body>
        </html>
        `,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          res.status(500).json({ status: 500, message: "Server error occurred" });
        } else {
          console.log("Email sent: " + info.response);
          res.status(200).json({ status: 200, message: "Email sent !" });
        }
      });
    }
  });
});
router.post("/resetPassword", (req, res) => {
  const { email, password, OTP } = req.body;
  const sql = "SELECT userEmail FROM passwordreset WHERE created_at >= NOW() - INTERVAL 15 MINUTE AND userEmail = ? AND OTP = ?";
  db.query(sql, [email, OTP], (err, result) => {
    if (err) {
      res.status(500).json({ status: 500, message: "Server error occurred" });
    } else {
      if (result.length > 0) {
        const sql = "UPDATE owner SET password = ? WHERE email = ?";
        bcrypt
          .hash(password, 10)
          .then((hash) => {
            db.query(sql, [hash, email], (err, result) => {
              if (err) {
                res
                  .status(500)
                  .json({ status: 500, message: "Server error occurred" });
              } else {
                res
                  .status(200)
                  .json({ status: 200, message: "Password Updated !" });
              }
            });
          })
          .catch((err) => {
            res
              .status(500)
              .json({ status: 500, message: "Server error occurred" });
          });
      } else {
        res.status(404).json({ status: 404, message: "Invalid OTP !" });
      }
    }
  });
});

module.exports = router;
