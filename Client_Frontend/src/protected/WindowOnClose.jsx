import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import baseURL from '../config/axiosPortConfig';

const WindowOnClose = () => {
    const navigate = useNavigate();

    useEffect(() => {
      // Function to handle session termination when the window or browser is closed
      const handleWindowClose = async (event) => {
        const logoutResponse = await axios.get(`${baseURL}/auth/logout`, {
          withCredentials: true // This is crucial!
        });
        if(logoutResponse.status === 200) {
            localStorage.clear(); 
            navigate('/login');
        } else {
            console.log('Logout Failed. Try Again!');
            return;
        }
        // Displaying confirmation message for close
        event.preventDefault();  // Prevents the default close behavior (showing prompt)
        event.returnValue = ''; // Needed for some browsers to trigger confirmation
      };
  
      // Add event listener for 'beforeunload' to handle browser or window close
      window.addEventListener('beforeunload', handleWindowClose);
  
      // Cleanup on component unmount to avoid memory leaks
      return () => {
        window.removeEventListener('beforeunload', handleWindowClose);
      };
    }, [navigate]);
  
    return null;
}

export default WindowOnClose;
