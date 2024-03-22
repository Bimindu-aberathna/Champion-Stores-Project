// App.jsx
import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import Orders from './pages/orders';
import Transaction from './pages/Transaction'; 
import Inventory from './pages/Inventory';
import Productlist from './Components/productlist';

function App() {
  return (
    
    <BrowserRouter>
      <Routes>
        
        <Route path="/orders" element={<Orders />} />
        <Route path="/" element={<Transaction />} />
        <Route path="/inventory" element={<Inventory/>} />
        <Route path="/productlist" element={<Productlist/>} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;