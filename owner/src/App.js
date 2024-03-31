// App.jsx
import React from 'react';
import { Routes, Route, BrowserRouter,useParams } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import Orders from './pages/orders';
import Transaction from './pages/Transaction'; 
import Inventory from './pages/Inventory';
import Login from './pages/Login';
import Productlist from './Components/productlist';
import LowStock from './pages/LowStock';
import AddProduct from './pages/AddProduct';
import EditProduct from './pages/EditProduct';

function App() {
  return (
    
    <BrowserRouter>
      <Routes>
        
        <Route path="/orders" element={<Orders />} />
        <Route path="/" element={<Login />} />
        <Route path="/transaction" element={<Transaction />} />
        <Route path="/inventory" element={<Inventory/>} />
        <Route path="/productlist" element={<Productlist/>} />
        <Route path="/lowstock" element={<LowStock/>} />
        <Route path="/addproduct" element={<AddProduct/>} />
        <Route path="/editproduct/:productId" element={<EditProduct/>} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;