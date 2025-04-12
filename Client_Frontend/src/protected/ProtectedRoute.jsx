import React from 'react';
import { Navigate } from 'react-router-dom';
import handleToken from '../scripts/handleToken';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('AccessToken');
  // return isAuthenticated ? children : <Navigate to="/login" />;
  if (token) {
    if(!handleToken(token)) {
      console.log('Token is not valid');
      return <Navigate to="/login" />;
    } else {
      console.log('Token Authentication Successfull');
      return children;
    }
  } else {
    return <Navigate to="/login" />;
  }
}

export default ProtectedRoute;
