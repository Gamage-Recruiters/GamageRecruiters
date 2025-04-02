import axios from "axios";

const handleToken = async (token) => {

    if(!token) {
        return 'Error Occured While checking Token Validity';
    }

    try {
        // generate ne token ...
        const response = await axios.put('http://localhost:8000/session/update-access-token', { token: token });
        console.log(response.data);
        return response.data.token;
    } catch (error) {
        console.log(error);
        return error.response ? error.response.data : 'Server Error';
    }
}

export default handleToken;