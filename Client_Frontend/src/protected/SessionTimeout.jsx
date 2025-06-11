import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';
import baseURL from '../config/axiosPortConfig';

const SessionTimeout = () => {
  const navigate = useNavigate();
  const timeoutRef = useRef(null);
  
  const resetTimer = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      Swal.fire({
        title: 'Session Expired!',
        text: 'You have been logged out due to inactivity.',
        icon: 'warning',
        confirmButtonText: 'Login Again',
      }).then(async () => {
        try {
          await axios.get(`${baseURL}/auth/logout`, {
            withCredentials: true
          });
          navigate('/login');
        } catch (error) {
          console.error("Logout failed:", error);
          navigate('/login');
        }
      });
    }, 2 * 60 * 60 * 1000); // 2 hours
  };
  
  useEffect(() => {
    const events = ['mousemove', 'keydown', 'scroll', 'click'];
    const handleActivity = () => resetTimer();
    
    events.forEach(event => window.addEventListener(event, handleActivity));
    resetTimer();
    
    return () => {
      events.forEach(event => window.removeEventListener(event, handleActivity));
      clearTimeout(timeoutRef.current);
    };
  }, []);
  
  return null;
}

export default SessionTimeout;