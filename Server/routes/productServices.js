// routes/customerServices.js

const express = require("express");
const router = express.Router();
const db = require("../Server_Configuration");
const e = require("express");
const { validateToken } = require("../JWT");
// router.get("/getProducts", (req, res) => {
    
//     const sql = 'SELECT p.*,s_c.subCategoryName, c.categoryName  from product p INNER JOIN sub_category s_c ON p.subCategoryID = s_c.subCategoryID INNER JOIN category c ON s_c.categoryID = c.categoryID';
//     db.query(sql, (err, result) => {
//         if (err) res.json({ message: 'Server error occurred' });
//         res.json(result);
//     });  
//     })

    router.get("/getProducts", (req, res) => {
        // Check if the stored procedure exists
        const checkProcedureExistsQuery = "SELECT COUNT(*) AS procedureExists FROM information_schema.ROUTINES WHERE ROUTINE_SCHEMA = 'champions_stores' AND ROUTINE_NAME = 'GetProducts' AND ROUTINE_TYPE = 'PROCEDURE'";
    
        db.query(checkProcedureExistsQuery, (err, result) => {
            if (err) {
                return res.json({ message: 'Error checking stored procedure existence' });
            }
    
            const procedureExists = result[0].procedureExists;
    
            // If the stored procedure doesn't exist, create it
            if (procedureExists === 0) {
                const createProcedureQuery = `
                    DELIMITER //
                    CREATE PROCEDURE GetProducts()
                    BEGIN
                        SELECT p.*, s_c.subCategoryName, c.categoryName  
                        FROM product p 
                        INNER JOIN sub_category s_c ON p.subCategoryID = s_c.subCategoryID 
                        INNER JOIN category c ON s_c.categoryID = c.categoryID;
                    END //
                    DELIMITER ;
                `;
    
                db.query(createProcedureQuery, (err) => {
                    if (err) {
                        return res.json({ message: 'Error creating stored procedure' });
                    }
    
                    // Call the stored procedure to retrieve data
                    callStoredProcedure(res);
                });
            } else {
                // Call the stored procedure to retrieve data
                callStoredProcedure(res);
            }
        });
    });

    router.get("/getProductDetails/:productID", (req, res) => {
        const productID = req.params.productID;
        const sql = `SELECT p.*, s_c.subCategoryName
        FROM product p 
        INNER JOIN sub_category s_c ON p.subCategoryID = s_c.subCategoryID 
        WHERE productID = ${productID}`;
        db.query(sql, (err, result) => {
            if (err) res.json({ message: 'Server error occurred' });
            res.json(result);
        });
    }   )

    
    function callStoredProcedure(res) {
        const callProcedureQuery = 'CALL GetProducts()';
    
        db.query(callProcedureQuery, (err, result) => {
            if (err) {
                return res.json({ message: 'Error executing stored procedure' });
            }
    
            res.json(result[0]);
        });
    }
    

module.exports = router;
