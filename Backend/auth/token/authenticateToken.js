const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const pool = require("../../config/dbConnection");
const { localStorage, decryptData } = require('../../utils/localStorage');

dotenv.config();

async function authenticateToken(req, res, next) {
    const authHeader = req.headers['auth'];
    const token = authHeader && authHeader.split(' ')[1];

    if(!token) {
        return res.status(401).json({ message: 'Access Denied. No Token' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if(!decoded) {
            return res.status(403).send('Invalid JWT token');
        }

        console.log(decoded);

        const key = 'Saved User Data';

        // Retrieve encrypted data from localStorage ...
        const storedData = localStorage.getItem(key);

        if(!storedData) {
            console.log(`No data found for key: ${key}`);
            return res.status(404).send('No Logged User data found. Error Occured.');
        } 

        const { encryptedData, iv } = JSON.parse(storedData); // Parse stored JSON ...
        const decryptedData = decryptData(encryptedData, iv); // Decrypt data ...
        const retrievedArray = JSON.parse(decryptedData); // Convert string back to array ...
        console.log("Decrypted Array:", retrievedArray);
        const id = retrievedArray[0];

        const query = 'SELECT * FROM sessions WHERE token = ? AND Id = ? AND endedAt = NULL';
        pool.query(query, [token, id], (error, result) => {
            if(error) {
                console.log(error);
                return res.status(400).send(error);
            }

            if(result.length === 0) {
                return res.status(404).send('Session Data Not Found');
            }

            next();
        });

    } catch (error) {
        return res.status(403).json({ message: 'Invalid token.' });
    }
}

module.exports = authenticateToken;