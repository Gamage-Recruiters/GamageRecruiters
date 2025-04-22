import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const isUserAuthenticated = localStorage.getItem('IsUserAuthenticated');
  const isLoginAuthenticated = localStorage.getItem('IsLoginAuthenticated');
  const isSignupAuthenticated = localStorage.getItem('IsSignupAuthenticated');

  console.log('Is User Authenticated:', isUserAuthenticated);
  console.log('Is SignUp Authenticated:', isLoginAuthenticated);
  console.log('Is Login Authenticated:', isSignupAuthenticated);
  
  // return isAuthenticated ? children : <Navigate to="/login" />;
  if (isLoginAuthenticated === 'true' || isSignupAuthenticated === 'true' || isUserAuthenticated === 'true') {
    return children;
  } else {
    if(isLoginAuthenticated !== 'true' || isUserAuthenticated !== 'true') {
      return <Navigate to="/login" />;
    } 

    if(isSignupAuthenticated !== 'true') {
      return <Navigate to="/signup" />;
    }

    return <Navigate to="/" />;
  }
}

export default ProtectedRoute;
