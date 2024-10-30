import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ element }) => {
  const { isAuthenticated, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>; // Or any loading indicator
  }

  return isAuthenticated ? element : <Navigate to="/" replace state={{ from: location }} />;
};

export default ProtectedRoute;
