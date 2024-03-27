const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');
const e = require('express');
const bodyParser = require('body-parser');
const { getItemList } = require('./controllers/productController');
const { pseudoRandomBytes } = require('crypto');
const multer = require('multer');
const upload = multer();


const app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use(express.json());
const port = 5000;

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'champions_stores'
});

app.get('/listProducts', getItemList);

app.get('/listLowStockProducts', (req, res) => {
    const sql = 'SELECT * from product WHERE preorderLevel>=currentStock;';
    db.query(sql, (err, result) => {
        if (err) res.json({ message: 'Server error occurred' });
        res.json(result);
    });
});

app.get('/getCategories', (req, res) => {
    const sql = 'SELECT * FROM category;';
    db.query(sql, (err, result) => {
        if (err) res.json({ message: 'Server error occurred' });
        res.json(result);
    });
});
app.get('/getSubCategories/:categoryID', (req, res) => {
    const categoryID = req.params.categoryID;
  
    const sql = 'SELECT * FROM sub_category WHERE categoryID = ?;';
    db.query(sql, [categoryID], (err, result) => {
        if (err) res.json({ message: 'Server error occurred' });
        res.json(result);
    });
  });


app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const sql = 'SELECT * FROM owner WHERE email = ?';
    
    db.query(sql, [email], (err, result) => {
        if (err) {
            res.status(500).json({ message: 'Server error occurred' });
        } else {
            if (result.length > 0) {
                const user = result[0];
                console.log(user);
                console.log(password);
                if(user.password === password){
                    res.json({ success: true });
                }else{
                    res.json({ success: false, message: 'Incorrect password' });
                }
                
            } else {
                res.json({ success: false, message: 'User not found' });
            }
        }
    });
});

app.post('/addProduct', upload.none(), (req, res) => {
    const { productName, brandName, category, subCategory, openingStock, reorderLevel, unitPrice, productDetails } = req.body;
    const sql = 'INSERT INTO product (subCategoryID, productName, brandName, details, unitPrice, preorderLevel, currentStock) VALUES (?, ?, ?, ?, ?, ?, ?);';
    
    db.query(sql, [subCategory, productName, brandName, productDetails, unitPrice, reorderLevel, openingStock], (err, result) => {
        if (err) {
            console.error('Error adding product', err);
            res.status(500).json({ message: 'Server error occurred' });
        } else {
            console.log('Product added successfully');
            res.status(200).json({ message: 'Product added successfully' });
        }
    });
});




app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});