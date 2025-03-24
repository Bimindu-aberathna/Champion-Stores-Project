// components/ProtectedRoute.js
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, isAuthenticated }) => {
  const location = useLocation();
  return isAuthenticated ? children : <Navigate to="/" state={{ from: location }} />;
};

export default ProtectedRoute;