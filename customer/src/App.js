
//import './App.css';
// App.jsx
import React from 'react';
import { Routes, Route, BrowserRouter,useParams } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from './Components/Navbar/Navbar';
import Footer from './Components/Footer/Footer';
import ProductGrid from './Components/productGrid/productGrid';

function App() {
  return (
    
    <BrowserRouter>
      <Navbar/>
      <ProductGrid/>
      <Routes>
        
        

      </Routes>
      <Footer/>
    </BrowserRouter>
  );
}

export default App;
