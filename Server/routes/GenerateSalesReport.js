const bodyParser = require("body-parser");
const pdf = require("html-pdf");
const path = require("path");
const fs = require("fs");
const db = require("../Server_Configuration");
const { validateOwnerToken } = require("../ownerJWT");
// routes/customerServices.js

const express = require("express");
const { on } = require("events");
const { get } = require("http");
const router = express.Router();

function convertToCurrencyFormat(doubleValue) { //Function to convert double value to currency format
  return doubleValue.toFixed(2);
}

//Variables to store sales data retrieved from the database
let [
  totalSales,
  totalOnlineSales,
  totalInstoreSales,
  totalCostOfGoodsSold,
  onlineCostOfGoodsSold,
  instoreCostOfGoodsSold,
  totalProfit,
  onlineProfit,
  instoreProfit,
  totalDiscounts,
  onlineItemCount,
  instoreItemCount,
  costOfReturnedProducts,
  costOfExpiredProducts,
  onlineOrderCount,
  instoreOrderCount,
] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
const getCategorySQL = "SELECT categoryID,categoryName from category"; //SQL query to get categories

//SQL queries to get sales data of the Webstore
const getOnlineSalesSQL =
  "SELECT SUM(ci.quantity * ci.unitPrice) AS totalOnlineSales FROM cart c JOIN cart_item ci ON c.cartID = ci.cartID WHERE DATE(c.dateTime) BETWEEN ? AND ?; ";
//SQL queries to get sales data of the In-store
  const getInstoreSalesSQL =
  "SELECT SUM(total) AS totalInstoreSales FROM transactions WHERE DATE(dateTime) BETWEEN ? AND ?;";
//SQL queries to get total discounts
  const getdiscountsSQL =
  "SELECT SUM(discount) AS totalDiscounts FROM transactions WHERE DATE(dateTime) BETWEEN ? AND ?;";
//SQL queries to get cost of goods sold of the Webstore
  const getOnlineCOGSSQL =
  "SELECT SUM(ci.quantity * ip.avgUnitBuyingPrice) AS onlineCostOfGoodsSold FROM cart_item ci JOIN (SELECT productID, AVG(unitBuyingPrice) AS avgUnitBuyingPrice FROM inventory_purchase WHERE DATE(date) BETWEEN ? AND ? GROUP BY productID) ip ON ci.productID = ip.productID JOIN cart c ON ci.cartID = c.cartID WHERE DATE(c.dateTime) BETWEEN ? AND ?; ";
//SQL queries to get cost of goods sold of the In-store
const getInstoreCOGSSQL =
  "SELECT SUM(iti.quantity * ip.avgUnitBuyingPrice) AS instoreCostOfGoodsSold FROM transaction_items iti JOIN ( SELECT productID, AVG(unitBuyingPrice) AS avgUnitBuyingPrice FROM inventory_purchase WHERE DATE(date) BETWEEN ? AND ? GROUP BY productID ) ip ON iti.productID = ip.productID JOIN transactions ist ON iti.transactionID = ist.transactionID WHERE DATE(ist.dateTime) BETWEEN ? AND ?;";
//SQL queries to get total number of items sold in the Webstore
  const onlineItemCountSQL =
  "SELECT SUM(cart_item.quantity) AS itemCount FROM cart_item INNER JOIN cart ON cart.cartID = cart_item.cartID WHERE cart.dateTime BETWEEN ? AND ? AND cart.paymentStatus=1;";
//SQL queries to get total number of items sold in the In-store
  const instoreItemCountSQL =
  "SELECT SUM(transaction_items.quantity) itemCount FROM transaction_items INNER JOIN transactions ON transactions.transactionID = transaction_items.transactionID WHERE transactions.dateTime BETWEEN ? AND ?;";
//SQL queries to get total cost of returned products
  const returnSalesSQL =
  "SELECT SUM(totalReturnLoss) AS totalReturnLoss FROM ( SELECT SUM(pr.quantity * ip.unitBuyingPrice) AS totalReturnLoss FROM product_return pr JOIN inventory_purchase ip ON pr.productID = ip.productID WHERE pr.date BETWEEN ? AND ? GROUP BY pr.productID) AS subquery;";
//SQL queries to get total cost of expired products
  const expiringProductsSQL =
  "SELECT SUM(totalExpireLoss) AS totalExpireLoss FROM ( SELECT SUM(ep.quantity * ip.unitBuyingPrice) AS totalExpireLoss FROM expiredproducts ep JOIN inventory_purchase ip ON ep.productID = ip.productID WHERE ep.date BETWEEN ? AND ? GROUP BY ep.productID ) AS subquery;";
//SQL queries to get total number of online orders
  const onlineOrderCountSQL =
  "SELECT COUNT(cartID) AS onlineOrderCount FROM cart WHERE DATE(dateTime) BETWEEN ? AND ? AND paymentStatus=1;";
//SQL queries to get total number of in-store orders
  const instoreOrderCountSQL =
  "SELECT COUNT(transactionID) AS instoreOrderCount FROM transactions WHERE DATE(dateTime) BETWEEN ? AND ?;";

const dbCategories = []; //Array to store categories retrieved from the database

var htmlContent = ``;
function getCategories() { //Function to get categories from the database
  return new Promise((resolve, reject) => {
    db.query(getCategorySQL, (err, result) => {
      if (err) {
        reject(err);
      } else {
        dbCategories.push(//Push the result to dbCategories array
          result.map((rowDataPacket) => {
            return {
              categoryID: rowDataPacket.categoryID,
              CategoryName: rowDataPacket.categoryName,
            };
          })
        );
        resolve(dbCategories);
      }
    });
  });
}
function getOnlineSales(startDate, endDate) {//Function to get total online sales
  return new Promise((resolve, reject) => {
    db.query(getOnlineSalesSQL, [startDate, endDate], (err, result) => {
      if (err) {
        reject(err);
      } else {
        totalOnlineSales = result[0].totalOnlineSales;//Store the total online sales
        resolve(totalOnlineSales);
      }
    });
  });
}
function getInstoreSales(startDate, endDate) {//Function to get total in-store sales
  return new Promise((resolve, reject) => {
    db.query(getInstoreSalesSQL, [startDate, endDate], (err, result) => {
      if (err) {
        reject(err);
      } else {
        totalInstoreSales = result[0].totalInstoreSales;//Store the total in-store sales
        resolve(totalInstoreSales);
      }
    });
  });
}
function getDiscounts(startDate, endDate) { //Function to get total discounts
  return new Promise((resolve, reject) => {
    db.query(getdiscountsSQL, [startDate, endDate], (err, result) => {
      if (err) {
        reject(err);
      } else {
        totalDiscounts = result[0].totalDiscounts; //Store the total discounts
        resolve(totalDiscounts);
      }
    });
  });
}
function getCORP(startDate, endDate) { //Function to get total cost of returned products
  return new Promise((resolve, reject) => {
    db.query(returnSalesSQL, [startDate, endDate], (err, result) => {
      if (err) {
        reject(err);
      } else {
        costOfReturnedProducts = result[0].totalReturnLoss; //Store the total cost of returned products
        resolve(costOfReturnedProducts);
      }
    });
  });
}
function getCOEP(startDate, endDate) { //Function to get total cost of expired products
  return new Promise((resolve, reject) => {
    db.query(expiringProductsSQL, [startDate, endDate], (err, result) => {
      if (err) {
        reject(err);
      } else {
        costOfExpiredProducts = result[0].totalExpireLoss; //Store the total cost of expired products
        resolve(costOfExpiredProducts);
      }
    });
  });
}

function getOnlineCOGS(startDate, endDate) {//Function to get cost of goods sold of the Webstore
  return new Promise((resolve, reject) => {
    db.query(
      getOnlineCOGSSQL,
      [startDate, endDate, startDate, endDate],
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          onlineCostOfGoodsSold = result[0].onlineCostOfGoodsSold;//Store the cost of goods sold of the Webstore
          resolve(onlineCostOfGoodsSold);
        }
      }
    );
  });
}
function getInstoreCOGS(startDate, endDate) {//Function to get cost of goods sold of the In-store
  return new Promise((resolve, reject) => {
    db.query(
      getInstoreCOGSSQL,
      [startDate, endDate, startDate, endDate],
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          instoreCostOfGoodsSold = result[0].instoreCostOfGoodsSold;//Store the cost of goods sold of the In-store
          resolve(instoreCostOfGoodsSold);
        }
      }
    );
  });
}
function getOnlineItemCount(startDate, endDate) {//Function to get total number of items sold in the Webstore
  return new Promise((resolve, reject) => {
    db.query(onlineItemCountSQL, [startDate, endDate], (err, result) => {
      if (err) {
        reject(err);
      } else {
        onlineItemCount = result[0].itemCount;//Store the total number of items sold in the Webstore
        resolve(onlineItemCount);
      }
    });
  });
}
function getInstoreItemCount(startDate, endDate) {//Function to get total number of items sold in the In-store
  return new Promise((resolve, reject) => {
    db.query(instoreItemCountSQL, [startDate, endDate], (err, result) => {
      if (err) {
        reject(err);
      } else {
        instoreItemCount = result[0].itemCount;//Store the total number of items sold in the In-store
        resolve(instoreItemCount);
      }
    });
  });
}
function getTotalSales(startDate, endDate) {//Function to get total sales
  return new Promise((resolve, reject) => {
    totalSales = totalInstoreSales + totalOnlineSales;//Calculate the total sales
    resolve(totalSales);
  });
}
function getOnlineOrderCount(startDate, endDate) {//Function to get total number of online orders
  return new Promise((resolve, reject) => {
    db.query(onlineOrderCountSQL, [startDate, endDate], (err, result) => {
      if (err) {
        reject(err);
      } else {
        onlineOrderCount = result[0].onlineOrderCount;//Store the total number of online orders
        resolve(onlineOrderCount);
      }
    });
  });
}
function getInstoreOrderCount(startDate, endDate) {//Function to get total number of in-store orders
  return new Promise((resolve, reject) => {
    db.query(instoreOrderCountSQL, [startDate, endDate], (err, result) => {
      if (err) {
        reject(err);
      } else {
        instoreOrderCount = result[0].instoreOrderCount;//Store the total number of in-store orders
        resolve(instoreOrderCount);
      }
    });
  });
}

//Sales report generation endpoint
router.post("/createSalesReport", validateOwnerToken, (req, res) => {
  const { startDate, endDate } = req.body;
  const pdfFilePath = path.join(__dirname, "SalesReport.pdf"); //Path to store the generated PDF
  getCategories().then(() => {
    getOnlineSales(startDate, endDate).then(() => {
      getInstoreSales(startDate, endDate).then(() => {
        getDiscounts(startDate, endDate).then(() => {
          getOnlineCOGS(startDate, endDate).then(() => {
            getInstoreCOGS(startDate, endDate).then(() => {
              getOnlineItemCount(startDate, endDate).then(() => {
                getInstoreItemCount(startDate, endDate).then(() => {
                  getTotalSales(startDate, endDate).then(() => {
                    getCORP(startDate, endDate).then(() => {
                      getCOEP(startDate, endDate).then(() => {
                        getOnlineOrderCount(startDate, endDate).then(() => {
                          getInstoreOrderCount(startDate, endDate).then(() => {
                            totalCostOfGoodsSold =
                              onlineCostOfGoodsSold + instoreCostOfGoodsSold;
                            totalProfit = totalSales - totalCostOfGoodsSold;
                            onlineProfit =
                              totalOnlineSales - onlineCostOfGoodsSold;
                            instoreProfit =
                              totalInstoreSales - instoreCostOfGoodsSold;
                            htmlContent = `
                                        <!DOCTYPE html>
                                          <html lang="en">
                                          <head>
                                            <meta charset="UTF-8">
                                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                            <title>Retail Store Sales Report</title>
                                            <style>
                                              body {
                                                font-family: Arial, sans-serif;
                                                margin: 0;
                                                padding: 0;
                                                background-color: #f5f5f5;
                                              }
                                              .container {
                                                max-width: 800px;
                                                margin: 20px auto;
                                                padding: 20px;
                                                border: 1px solid #ddd;
                                                border-radius: 8px;
                                                background-color: #fff;
                                              }
                                              h1, h2 {
                                                text-align: center;
                                                color: #333;
                                              }
                                              h2 {
                                                margin-top: 30px;
                                                font-size: 20px;
                                              }
                                              table {
                                                width: 100%;
                                                border-collapse: collapse;
                                                margin-top: 20px;
                                              }
                                              th, td {
                                                border: 1px solid #ddd;
                                                padding: 8px;
                                                text-align: left;
                                                font-size: 16px;
                                              }
                                              th {
                                                background-color: #f2f2f2;
                                                font-weight: bold;
                                              }
                                              .total-row td {
                                                font-weight: bold;
                                              }
                                              #date {
                                                text-align: center;
                                                font-size: 16px;
                                                color: #000000;
                                                margin-top: -15px;

                                              }
                                              .finalValues {
                                                  font-weight: bold;
                                                  text-align: right;
                                                }

                                            </style>
                                          </head>
                                          <body>
                                            <div class="container">
                                              <img src="https://firebasestorage.googleapis.com/v0/b/champions-stores.appspot.com/o/logo.png?alt=media&token=383ecef7-be84-45f7-8244-3cc4824fe717" alt="Inventory Icon" style="display: block; margin: 0 auto; width: 100px;margin-bottom: -20px;">
                                              <h1>Sales Report</h1>
                                          <p id = "date"></p>
                                              <h2>Overview:</h2>
                                              <table>
                                                <tr>
                                                  <th>Total Sales Revenue:</th>
                                                  <td>Rs. ${convertToCurrencyFormat(
                                                    totalInstoreSales +
                                                      totalOnlineSales
                                                  )}</td>
                                                </tr>
                                                <tr>
                                                  <th>Total Units Sold:</th>
                                                  <td>${
                                                    onlineItemCount +
                                                    instoreItemCount
                                                  } units</td>
                                                </tr>
                                                <tr class="total-row">
                                                  <th>Average Selling Price:</th>
                                                  <td>Rs. ${convertToCurrencyFormat(
                                                    (totalInstoreSales +
                                                      totalOnlineSales) /
                                                      (onlineItemCount +
                                                        instoreItemCount)
                                                  )}</td>
                                                  </td>
                                                </tr>
                                              </table>

                                              <h2>Expired & Returns:</h2>
                                              <table>
                                                <tr>
                                                  <th>Category</th>
                                                  <th>Loss</th>
                                                </tr>
                                                <tr>
                                                  <td>Expired Products</td>
                                                  <td>${convertToCurrencyFormat(
                                                    costOfExpiredProducts
                                                  )}</td>
                                                </tr>
                                                <tr>
                                                  <td>Product Returns</td>
                                                  <td>${convertToCurrencyFormat(
                                                    costOfReturnedProducts
                                                  )}</td>
                                                </tr>
                                                <tr>
                                                  <td>Total Loss</td>
                                                  <td>${convertToCurrencyFormat(
                                                    costOfExpiredProducts +
                                                      costOfExpiredProducts
                                                  )}</td>
                                                </tr>
                                              </table>

                                              <h2>Sales Channels:</h2>
                                              <table>
                                                <tr>
                                                  <th>Channel</th>
                                                  <th>Total Revenue</th>
                                                  <th>Total Orders</th>
                                                  <th>Average Order Value</th>
                                                </tr>
                                                <tr>
                                                  <td>Website</td>
                                                  <td>Rs. ${convertToCurrencyFormat(
                                                    totalOnlineSales
                                                  )}</td>
                                                  <td>${onlineOrderCount}</td>
                                                  <td>${convertToCurrencyFormat(totalOnlineSales / onlineOrderCount)}</td>
                                                </tr>
                                                <tr>
                                                  <td>In-Store</td>
                                                  <td>Rs. ${convertToCurrencyFormat(
                                                    totalInstoreSales
                                                  )}</td>
                                                  <td>${instoreOrderCount}</td>
                                                  <td>${convertToCurrencyFormat(totalInstoreSales / instoreOrderCount)}</td>
                                                </tr>
                                              </table>

                                              <h2>Profits from channels:</h2>
                                              <table>
                                                <tr>
                                                  <th>Channel</th>
                                                  <th>Total Sales Revenue</th>
                                                  <th>Cost of Sales</th>
                                                  <th>Gross profit</th>
                                                </tr>
                                                <tr>
                                                  <td>Website</td>
                                                  <td>Rs. ${convertToCurrencyFormat(
                                                    totalOnlineSales
                                                  )}</td>
                                                  <td>Rs. ${convertToCurrencyFormat(
                                                    onlineCostOfGoodsSold
                                                  )}</td>
                                                  <td>RS. ${convertToCurrencyFormat(
                                                    onlineProfit
                                                  )}</td>
                                                </tr>
                                                <tr>
                                                  <td>In-store</td>
                                                  <td>Rs. ${convertToCurrencyFormat(
                                                    totalInstoreSales
                                                  )}</td>
                                                  <td>Rs. ${convertToCurrencyFormat(
                                                    instoreCostOfGoodsSold
                                                  )}</td>
                                                  <td>RS. ${convertToCurrencyFormat(
                                                    instoreProfit
                                                  )}</td>
                                                </tr>
                                              </table>

                                              <h2>Summary</h2>
                                              <table>
                                                <tr>
                                                  <td>Total Sales Revenue:</td>
                                                  <td class="finalValues">Rs: ${convertToCurrencyFormat(
                                                    totalSales
                                                  )}</td>
                                                </tr>
                                                <tr>
                                                  <td>Total Cost of goods sold:</td>
                                                  <td class="finalValues">Rs: ${convertToCurrencyFormat(
                                                    totalCostOfGoodsSold
                                                  )}</td>
                                                </tr>  
                                                <tr>
                                                  <td>Expire & Returns:</td>
                                                  <td class="finalValues">Rs: ${convertToCurrencyFormat(
                                                    costOfExpiredProducts +
                                                      costOfReturnedProducts
                                                  )}</td>
                                                </tr>
                                                <tr>
                                                  <td>Discounts Allowed:</td>
                                                  <td class="finalValues">Rs. ${convertToCurrencyFormat(
                                                    totalDiscounts
                                                  )}</td>
                                                </tr>
                                                <tr>
                                                  <td>Net Sales Profit:</td>
                                                  <td class="finalValues" style="border: 2px solid;">Rs. ${convertToCurrencyFormat(
                                                    totalSales -
                                                      (totalCostOfGoodsSold +
                                                        totalDiscounts +
                                                        costOfExpiredProducts +
                                                        costOfReturnedProducts)
                                                  )}</td>
                                                  </td>
                                              </table>
                                            </div>
                                            <script>
                                              var fromDate = "${startDate}";
                                              var toDate = "${endDate}";
                                              document.getElementById("date").innerHTML = "Report generated for the period " + fromDate + " to " + toDate;

                                            </script>
                                          </body>
                                          </html>

                                        `;
                            pdf
                              .create(htmlContent)
                              .toFile(pdfFilePath, (err, result) => {//Generate PDF from HTML content
                                if (err) {
                                  res
                                    .status(500)
                                    .json({ message: "Server error occurred" });
                                } else {
                                  res.status(200).download(pdfFilePath);
                                }
                              });
                          });
                        });
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });
});

module.exports = router;
