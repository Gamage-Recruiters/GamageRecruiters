const jwt = require("jsonwebtoken");
const { pool } = require('../config/dbConnection.js');
require('dotenv').config();

const adminAuth = async (req, res, next) => {
    try {
        // get the token from the cookie
        const token = req.cookies.token

        if (!token) {
            return res.status(401).json({ meesage: 'Access denied. No Token.'});
        }

        // decode the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // check if the token belongs to an admin
        const adminQuery = 'SELECT * FROM admin WHERE adminId = ?';
        pool.query(adminQuery, [decoded.id], (error, result) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ message: 'Database error' });
            }

            if (result.length === 0) {
                return res.status(403).json({ message: 'Access denied. Not an admin.' });
            }

            // add admin info to the request
            req.admin = result[0];
            req.adminId = decoded.id;

            next();
        });
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired. Please login again.' });
        }
        
        return res.status(401).json({ message: 'Invalid token.' });
    }
};

module.exports = adminAuth;