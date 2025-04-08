import axios from 'axios';

const fetchLoggedUserData = async () => {
    try {
      // const loggedUserResponse = await axios.get('http://localhost:8000/session/profile-data', { headers: { 'authorization': `Bearer ${accessToken}` }});
      const loggedUserResponse = await axios.get('http://localhost:8000/session/profile-data');
      // console.log(loggedUserResponse.data);
      // console.log(loggedUserResponse.data.data[0]);
      if(loggedUserResponse.status === 200) {
        const userData = loggedUserResponse.data.data[0];
        console.log(userData);
        return userData;
      } else {
        // console.log('Error fetching user data');
        console.log('Failed To Load User Data');
        return null;
      }
    } catch (error) {
      console.log(error);
      return null;
    }
}

export default fetchLoggedUserData;