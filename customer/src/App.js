import {React,useState} from 'react';
import { Routes, Route, BrowserRouter, useLocation } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from './Components/Navbar/Navbar';
import Footer from './Components/Footer/Footer';
import ProductGrid from './Components/productGrid/productGrid';
import Login from './Components/Login & SignUp/Login';
import SignUp from './Components/Login & SignUp/Sign-Up';
import ProductPage from './Components/ProductPage/ProductPage';
import Cart from './Components/Cart/Cart';
import ProfileNav from './Components/CustomerProfile/ProfileNav';

function MainContent({ searchTerm, onSearch }) {
  const location = useLocation();
  return (
    <>
      {(location.pathname !== '/login') && (location.pathname !== '/signup') && <Navbar onSearch={onSearch} />}
      <Routes>
        <Route path="/" element={<ProductGrid searchTerm={searchTerm} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/profile" element={<ProfileNav />} />

      </Routes>
    </>
  );
}

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  
  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  return (
    <BrowserRouter>
      <MainContent searchTerm={searchTerm} onSearch={handleSearch} />
      <Footer />
    </BrowserRouter>
  );
}

export default App;