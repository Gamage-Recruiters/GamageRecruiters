const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const pool = require("../../config/dbConnection");
const { localStorage, decryptData } = require('../../utils/localStorage');

dotenv.config();

async function generateNewToken (token, expirationTime) {
    if(!token || !expirationTime) {
        return 'An Error occurred Before Token Generation.. Check Token and Expiration Time';
    }

    try {
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY);

        if(!decodedToken) {
            return 'Invalid Token';
        } 

        const key = 'Saved User Data';
    
        // Retrieve encrypted data from localStorage ...
        const storedData = localStorage.getItem(key);
    
        if(!storedData) {
            console.log(`No data found for key: ${key}`);
            return 'No Logged User data found. Error Occured.';
        } 
    
        const { encryptedData, iv } = JSON.parse(storedData); // Parse stored JSON ...
        const decryptedData = decryptData(encryptedData, iv); // Decrypt data ...
        const retrievedArray = JSON.parse(decryptedData); // Convert string back to array ...
        console.log("Decrypted Array:", retrievedArray);
        const id = retrievedArray[0];

        const sessionDataForTokenQuery = 'SELECT * FROM sessions WHERE token = ? AND Id = ? AND endedAt = NULL';
        pool.query(sessionDataForTokenQuery, [token, id], (error, result) => {
            if(error) {
                console.log(error);
                return error;
            }

            if(result.length === 0) {
                return 'Session Data Not Found';
            }

            console.log(result);
            console.log(result[0].tokenExpirationTime);
            console.log(new Date(result[0].tokenExpirationTime) < new Date(expirationTime));

            if(new Date(result[0].tokenExpirationTime) < new Date(expirationTime)) {
                return 'Session Token Still Valid';
            }

            // Generate New Token ...
            const newToken = jwt.sign({
                id: id
            }, process.env.JWT_SECRET, { expiresIn: '1h' });

            // Update Token in db ...
            const updateTokenQuery = 'UPDATE sessions SET token = ? WHERE Id = ? AND token = ? endedAt = NULL';
            pool.query(updateTokenQuery, [newToken, id, token], (error, result) => {
                if(error) {
                    console.log(error);
                    return error;
                }
    
                if(result.length === 0) {
                    return 'Session Data Not Found';
                }

                console.log(result);
                return 'Token Updated Successfully';
            })
        })
    } catch (error) {
        console.log(error);
        return;
    }
}

module.exports = generateNewToken;
