const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { pool } = require("../../config/dbConnection");
const { localStorage, decryptData } = require('../../utils/localStorage');
const setTimeStampToDate = require("../../utils/changeDateFormat");

dotenv.config();

async function generateNewToken (token) {
    if(!token) {
        return 'An Error occurred Before Token Generation.. Check Token and Expiration Time';
    }

    // Verify Token and Check Expiration
    let decodedToken;

    try {
        decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decodedToken);
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            console.log('Token Expired');
            console.log("Current Token expired at:", error.expiredAt);
            return await updateToken(token);
        } else if (error.name === "JsonWebTokenError") {
            console.log("Invalid Token:", error.message);
            return "Invalid Token";
        } else {
            console.log("Unknown Token Error:", error.message);
            return "Token verification failed";
        }
    }
} 

async function updateToken(token) {
    try {
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
        // console.log("Decrypted Array:", retrievedArray);
        const id = retrievedArray[0];
        console.log(id, token);
        const sessionDataForTokenQuery = 'SELECT * FROM sessions WHERE token = ? AND Id = ? AND endedAt IS NULL';
        const sessionResult = await new Promise((resolve, reject) => {
            pool.query(sessionDataForTokenQuery, [token, id], (error, result) => {
                if(error) {
                    console.log(error);
                    return reject(error);
                }

                resolve(result);
            })
        });

        if(sessionResult.length === 0) {
            console.log('Session Data Not Found');
            return 'Session Data Not Found';
        } 

        // Set expiration time manually ...
        const expTime = Math.floor(Date.now() / 1000) + 60 * 60; // 1 hour ...
        console.log(expTime);
        console.log(new Date(expTime * 1000).toISOString());

        // Generate New Token ...
        const newToken = jwt.sign({
            id: id,
            exp: expTime
        }, process.env.JWT_SECRET);

        const tokenExpirationDate = setTimeStampToDate(expTime);
        console.log('Generated New Token Expires in', tokenExpirationDate);

        // Update New Token in db ...
        const updateTokenQuery = 'UPDATE sessions SET token = ?, tokenGenerationTime = ?, tokenExpirationTime = ? WHERE Id = ? AND token = ? AND endedAt IS NULL';

        const updateTokenResult = await new Promise((resolve, reject) => {
        pool.query(updateTokenQuery, [newToken, new Date(), tokenExpirationDate, id, token], (error, result) => {
                if(error) {
                    console.log(error);
                    return reject(error);
                }

                if(updateTokenResult.affectedRows === 0) {
                    return reject('Session Data Not Found');
                }

                resolve(updateTokenResult);
            })
        });

        console.log('Updated New Token', updateTokenResult[0].token);
        return newToken;

        // pool.query(sessionDataForTokenQuery, [token, id], (error, result) => {
        //     if(error) {
        //         console.log(error);
        //         return error.message;
        //     }

        //     if(result.length === 0) {
        //         return 'Session Data Not Found';
        //     }

        //     console.log(result);
        //     // console.log(result[0].tokenExpirationTime);
        //     // console.log(new Date(result[0].tokenExpirationTime) < new Date(expirationTime));

        //     // if(new Date(result[0].tokenExpirationTime) < new Date(expirationTime)) {
        //     //     return 'Session Token Still Valid';
        //     // }

        //     // Set expiration time manually ...
        //     const expTime = Math.floor(Date.now() / 1000) + 60 * 60; // 1 hour ...
        //     console.log(expTime);
        //     console.log(new Date(expTime * 1000).toISOString());

        //     // Generate New Token ...
        //     const newToken = jwt.sign({
        //         id: id,
        //         exp: expTime
        //     }, process.env.JWT_SECRET);

        //     const tokenExpirationDate = setTimeStampToDate(expTime);
        //     console.log('Generated New Token Expires in', tokenExpirationDate);

        //     // Update Token in db ...
        //     const updateTokenQuery = 'UPDATE sessions SET token = ?, tokenGenerationTime = ?, tokenExpirationTime = ? WHERE Id = ? AND token = ? AND endedAt IS NULL';
        //     pool.query(updateTokenQuery, [newToken, new Date(), tokenExpirationDate, id, token], (error, result) => {
        //         if(error) {
        //             console.log(error);
        //             return error;
        //         }
    
        //         if(result.affectedRows === 0) {
        //             return 'Session Data Not Found';
        //         }

        //         console.log('Updated New Token', result[0].token);
        //         return result;
        //     })
        // })
    } catch (error) {
        console.log(error);
        return error.message;
    }
}

module.exports = generateNewToken;
