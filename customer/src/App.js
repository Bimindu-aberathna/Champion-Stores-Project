import { React, useState } from "react";
import { Routes, Route, BrowserRouter, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./Components/Navbar/Navbar";
import Footer from "./Components/Footer/Footer";
import Login from "./Components/Login & SignUp/Login";
import SignUp from "./Components/Login & SignUp/Sign-Up";
import ProductPage from "./Components/ProductPage/ProductPage";
import Cart from "./Components/Cart/Cart";
import ProfileNav from "./Components/CustomerProfile/ProfileNav";
import HomePage from "./Components/HomePage/HomePage";
import ProtectedRoute from "./Components/ProtectedRoute";
import { CartProvider } from "./Components/Services/CartContext";

function MainContent({
  searchTerm,
  onSearch,
  isAuthenticated,
  setIsAuthenticated,
}) {
  const location = useLocation();
  return (
    <>
      {location.pathname !== "/login" && location.pathname !== "/signup" && (
        <Navbar onSearch={onSearch} setIsAuthenticated={setIsAuthenticated} />
      )}
      <Routes>
        <Route path="/" element={<HomePage searchTerm={searchTerm} />} />
        <Route
          path="/login"
          element={<Login setIsAuthenticated={setIsAuthenticated} />}
        />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route
          path="/cart"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Cart />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <ProfileNav />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  return (
    <BrowserRouter>
      <CartProvider>
        <MainContent
          searchTerm={searchTerm}
          onSearch={handleSearch}
          isAuthenticated={isAuthenticated}
          setIsAuthenticated={setIsAuthenticated}
        />
        <Footer />
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
