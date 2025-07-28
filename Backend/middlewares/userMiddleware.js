const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { pool } = require('../config/dbConnection');

dotenv.config();

async function addNewUserIfSessionUserNotFound(firstName, lastName, email) {
    return new Promise((resolve, reject) => {
        // Create a new user ...
        const insertDataQuery = 'INSERT INTO users (firstName, lastName, gender, birthDate, address, address2, phoneNumber1, phoneNumber2, linkedInLink, facebookLink, portfolioLink, email, password, cv, photo, profileDescription, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const values = [firstName, lastName, null, null, null, null, null, null, null, null, null, email, null, null, null, null, new Date()];
        pool.query(insertDataQuery, values, (error, result) => {
            if (error) {
                console.log(error);
                return reject('Error creating new user');
            }

            const userQuery = 'SELECT * FROM users WHERE userId = ?';
                pool.query(userQuery, result.insertId, (error, result) => {
                    if(error) {
                        return reject('Error fetching user data');
                    } 

                    if(result.length === 0) {
                        return reject('User Not Found');
                    }

                    return resolve(result[0]);  // Return the fetched user data...
            });
        });
    });
} 

// Function to create a JWT token
function createUserToken(userId) {
    const expTime = Math.floor(Date.now() / 1000) + 60 * 60; // 1 hour
    
    // Create token
    const token = jwt.sign({
        id: userId,
        exp: expTime
    }, process.env.JWT_SECRET);
    
    return token;
}

module.exports = { addNewUserIfSessionUserNotFound, createUserToken };