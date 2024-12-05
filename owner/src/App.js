// App.jsx
import React from "react";
import { useState } from "react";
import {
  Routes,
  Route,
  BrowserRouter,
  useParams,
  useLocation,
} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

//Importing pages
import Orders from "./pages/orders";
import Transaction from "./pages/Transaction";
import Inventory from "./pages/Inventory";
import Login from "./pages/Login";
import LowStock from "./pages/LowStock";
import AddProduct from "./pages/AddProduct";
import EditProduct from "./pages/EditProduct";
import NewInventory from "./pages/NewInventory";
import AddSupplier from "./pages/addSupplier";
import ListSuppliers from "./pages/ListSuppliers";
import PurchaseHistory from "./pages/PurchaseHistory";
import AlterCategories from "./pages/AlterCategories";
import HandleExpiredProducts from "./pages/HandleExpiredProducts";
import ProductReturn from "./pages/ProductReturn";
import Reports from "./pages/Reports";
import AccountSetings from "./pages/AccountSettings";
import TitleBar from "./Components/TitleBar";
import FogotPassword from "./pages/FogotPassword";
import ProtectedRoute from "./functionality/ProtectedRoute";

//Main content component
function MainContent({ isAuthenticated, setIsAuthenticated }) {
  const location = useLocation();
  return (
    <>
      {location.pathname !== "/" && location.pathname !== "/forgotpassword" && (//Render the title bar component for all pages except the login and forgot password pages
        <TitleBar />
      )}
      <Routes>
        <Route
          path="/orders"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Orders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/"
          element={<Login setIsAuthenticated={setIsAuthenticated} />}
        />
        <Route path="/forgotpassword" element={<FogotPassword />} />
        <Route
          path="/transaction"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Transaction />
            </ProtectedRoute>
          }
        />
        <Route
          path="/inventory"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Inventory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/lowstock"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <LowStock />
            </ProtectedRoute>
          }
        />
        <Route
          path="/addproduct"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <AddProduct />
            </ProtectedRoute>
          }
        />
        <Route
          path="/editproduct/:productId"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <EditProduct />
            </ProtectedRoute>
          }
        />
        <Route
          path="/newinventory/:productId"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <NewInventory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/addsupplier"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <AddSupplier />
            </ProtectedRoute>
          }
        />
        <Route
          path="/listsuppliers"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <ListSuppliers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/purchasehistory"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <PurchaseHistory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/altercategories"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <AlterCategories />
            </ProtectedRoute>
          }
        />
        <Route
          path="/handleexpiredproducts"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <HandleExpiredProducts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/productreturn"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <ProductReturn />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Reports />
            </ProtectedRoute>
          }
        />
        <Route
          path="/accountsettings"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <AccountSetings />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // State variable to store the authentication status
  return (
    <BrowserRouter>
      <MainContent
        isAuthenticated={isAuthenticated}
        setIsAuthenticated={setIsAuthenticated}
      />
    </BrowserRouter>
  );
}

export default App;
