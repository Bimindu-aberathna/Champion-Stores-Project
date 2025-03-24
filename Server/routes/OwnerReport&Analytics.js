const express = require("express");
const router = express.Router();
const db = require("../Server_Configuration");
const e = require("express");
const multer = require("multer");
const upload = multer();
const moment = require("moment-timezone");
const { validateOwnerToken } = require("../ownerJWT");

const GenerateInventoryReport = require("./GenerateInventoryReport");
const GenerateSalesReport = require("./GenerateSalesReport");

router.use("/inventory-report", GenerateInventoryReport);
router.use("/sales-report", GenerateSalesReport);

router.get("/getInstoreSales", (req, res) => {
  const sql = "SELECT dateTime, total FROM transactions";
  db.query(sql, (err, result) => {
    if (err) {
      res.status(500).json({ message: "Server error occurred" });
    } else {
      const sales = formatSalesWeekly(result);
      const formattedSales = extendObject(sales);
      res.status(200).json(formattedSales);
    }
  });
});

router.get("/getOnlineSales", (req, res) => {
  const sql =
    "SELECT c.dateTime, SUM(ci.unitPrice*ci.quantity) AS total FROM cart c JOIN cart_item ci ON c.cartID = ci.cartID GROUP BY c.dateTime;";
  db.query(sql, (err, result) => {
    if (err) {
      res.status(500).json({ message: "Server error occurred" });
    } else {
      const sales = formatSalesWeekly(result);
      const formattedSales = extendObject(sales);
      //console.log(formattedSales);
      res.status(200).json(formattedSales);
    }
  });
});

function formatSalesWeekly(data) {
  let sales = {};
  data.forEach((sale) => {
    const week = moment(sale.dateTime).week();
    if (sales[week]) {
      sales[week] += sale.total;
    } else {
      sales[week] = sale.total;
    }
  });
  return sales;
}
function extendObject(obj) {
  const extendedArray = [];
  for (let i = 1; i <= 52; i++) {
    extendedArray.push(obj[i.toString()] || 0);
  }
  return extendedArray;
}

//get top 5 best selling items
router.get("/getBestSellingItems",validateOwnerToken, (req, res) => {
    const { period } = req.query;
  const lastWeekSql = `
SELECT 
    productID,
    productName,
    SUM(total_quantity_sold) AS total_quantity_sold
FROM (
    SELECT 
        ci.productID,
        p.productName,
        SUM(ci.quantity) AS total_quantity_sold
    FROM 
        cart_item ci
    JOIN 
        cart c ON ci.cartID = c.cartID
    JOIN 
        product p ON ci.productID = p.productID
    WHERE 
        c.paymentStatus = 1 AND 
        c.dateTime >= NOW() - INTERVAL ? DAY
    GROUP BY 
        ci.productID, p.productName

    UNION ALL

    SELECT 
        ti.productID,
        p.productName,
        SUM(ti.quantity) AS total_quantity_sold
    FROM 
        transaction_items ti
    JOIN 
        transactions t ON ti.transactionID = t.transactionID
    JOIN 
        product p ON ti.productID = p.productID
    WHERE 
        t.dateTime >= NOW() - INTERVAL ? DAY
    GROUP BY 
        ti.productID, p.productName
) AS combined_sales
GROUP BY 
    productID, productName
ORDER BY 
    total_quantity_sold DESC
LIMIT 5;
`;
  if (period === "lastWeek") {
    db.query(lastWeekSql, [7, 7], (err, result) => {
      if (err) {
        res.status(500).json({ message: "Server error occurred" });
      } else {
        res.status(200).json(result);
      }
    });
  } else if (period === "lastMonth") {
    db.query(lastWeekSql, [30, 30], (err, result) => {
      if (err) {
        res.status(500).json({ message: "Server error occurred" });
      } else {
        res.status(200).json(result);
      }
    });
  } else {
    res.status(400).json({ message: "Invalid period" });
  }
});

module.exports = router;
