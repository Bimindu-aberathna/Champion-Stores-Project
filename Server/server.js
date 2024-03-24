const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const path = require('path');

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

app.get('/listProducts', (req, res) => {
    const sql = 'SELECT * FROM product';
    db.query(sql, (err, result) => {
        if (err) res.json({ message: 'Server error occurred' });
        res.json(result);
    });
});

app.get('/listLowStockProducts', (req, res) => {
    const sql = 'SELECT * from product WHERE preorderLevel>=currentStock;';
    db.query(sql, (err, result) => {
        if (err) res.json({ message: 'Server error occurred' });
        res.json(result);
    });
});

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});