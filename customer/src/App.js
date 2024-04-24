import React from 'react';
import { Routes, Route, BrowserRouter, useLocation } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from './Components/Navbar/Navbar';
import Footer from './Components/Footer/Footer';
import ProductGrid from './Components/productGrid/productGrid';
import Login from './Components/Login & SignUp/Login';
import SignUp from './Components/Login & SignUp/Sign-Up';

function MainContent() {
  const location = useLocation();
  return (
    <>
      {(location.pathname !== '/login') && (location.pathname !== '/signup') && <Navbar />}
      <Routes>
        <Route path="/" element={<ProductGrid />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <MainContent />
      <Footer />
    </BrowserRouter>
  );
}

export default App;