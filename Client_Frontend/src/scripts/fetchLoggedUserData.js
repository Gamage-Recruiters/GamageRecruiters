import axios from 'axios';
import baseURL from '../config/axiosPortConfig';

const fetchLoggedUserData = async () => {
    try {
        // Get user data from the auth check endpoint
        const response = await axios.get(`${baseURL}/auth/check`, {
            withCredentials: true // This is needed for cookies
        });

        if (response.status === 200 && response.data.success) {
            return {
                user: [{
                    userId: response.data.data.id,
                    firstName: response.data.data.firstName,
                    lastName: response.data.data.lastName,
                    email: response.data.data.email,
                    // ... any other user data you need
                }]
            };
        }
        return null; // Return null if the user is not logged in or data is not available
    } catch (error) {
        console.error('Error fetching user data:', error);
        return null;
    }
};

export default fetchLoggedUserData;