import axios from "axios";
import baseURL from "../config/axiosPortConfig";

const handleToken = async (token) => {

    if(!token) {
        console.log('Error Occured While checking Token Validity');
        return false;
    }

    try {
        // generate ne token ...
        const response = await axios.post(`${baseURL}/session/handle-token`, { token: token });
        console.log(response.data);
        if (response.status === 200) {
            console.log(response.data.message);
            localStorage.setItem('AccessToken', token);
            return true;
        } else if (response.status === 201) {
            console.log(response.data.message);
            console.log(response.data.token);
            localStorage.setItem('AccessToken', response.data.token);
            return true;
        } else {
            console.log(response.data.message);
            return false;
        }
    } catch (error) {
        console.log(error);
        return false;
    }
}

export default handleToken;