const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

const { pool } = require('../config/dbConnection');
const upload = require('../middlewares/fileUploading');

dotenv.config();
const router = express.Router();

router.post('/register', upload, async (req, res) => {
    try {
        const { firstName, lastName, gender, birthDate, address, address2, phoneNumber1, phoneNumber2, linkedInLink, facebookLink, portfolioLink, email, password, profileDescription } = req.body;

        if(!firstName || !lastName || !gender || !birthDate || !email || !password) {
            return res.status(400).send('Please fill all the required fields');
        }

        // If existing, access the file names of the cv and image ...
        const cvName = req.files?.cv?.[0]?.filename || null;
        const imageName = req.files?.photo?.[0]?.filename || null;

        console.log('cvName:', cvName);
        console.log('imageName:', imageName);

        // Encrypt the password ...
        const hashedPassword = await bcrypt.hash(password, 10);

        const values = [ firstName, lastName, gender, birthDate, address, address2, phoneNumber1, phoneNumber2, linkedInLink, facebookLink, portfolioLink, email, hashedPassword, cvName, imageName, profileDescription, new Date() ];

        // Register the user by saving details in the database ...
        const sql = 'INSERT INTO users (firstName, lastName, gender, birthDate, address, address2, phoneNumber1, phoneNumber2, linkedInLink, facebookLink, portfolioLink, email, password, cv, photo, profileDescription, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'; 
        pool.query(sql, values, (error, data) => {
            if(error) {
                return res.status(400).send('Error registering user');
            } 

            console.log(data);
            return res.status(201).json({ message: 'User registered successfully', data: data});
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if(!email || !password) {
            return res.status(400).send('Email and Password cannot be empty');
        }

        // Check if the user exists ...
        const userQuery = 'SELECT * FROM users WHERE email = ?';
        pool.query(userQuery, [email], async (error, result) => {
            if(error) {
                return res.status(404).send('User Not Found');
            } 

            // Verify the password ...
            const verifyPasswordResult = await bcrypt.compare(password, result[0].password);

            if(!verifyPasswordResult) {
                return res.status(401).send('Invalid Password');
            } 

            // Generate Token ...
            const token = jwt.sign({
                id: result[0].userId,
            }, process.env.JWT_SECRET, { expiresIn: '1h' });

            // Pass a Cookie to frontend ...
            res.cookie('token', token, {
                httpOnly: true,
                sameSite: 'none',
                secure: true,
                maxAge: 100 * 60 * 60, // 1 hour ...
            });

            // Store User Data in the database Session ...
            const sessionQuery = 'INSERT INTO sessions (userId, token, createdAt, status) VALUES (?, ?, ?, ?)';
            const values = [ result[0].userId, token, new Date(), 'Active' ];
            pool.query(sessionQuery, values, (error, data) => {
                if(error) {
                    console.log(error);
                    return res.status(400).send('Error creating session');
                } 

                return res.status(200).json({ message: 'Login Successful', token: token, data: data });
            })
        });
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});

module.exports = router;