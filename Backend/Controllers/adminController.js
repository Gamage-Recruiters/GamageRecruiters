const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/dbConnection');

async function register (req, res) {
    const { email, password } = req.body;

    if(!email || !password) {
        return res.status(400).send('Email or Password cannot be empty!');
    }

    try {
        // Check a data related to email, exists in the database ...
        const sql = 'SELECT * FROM admin WHERE email = ?';
        pool.query(sql, [email], async (error, result) => {
            if(error) {
                return res.status(404).send('Admin User Not Found');
            }

            // Verify Password ...
            const verifyPasswordResult = await bcrypt.compare(password, result[0].password)

            if(!verifyPasswordResult) {
                return res.status(400).send('Password Entered is not Correct');
            } 

            // Generate jwt token ...
            const token = jwt.sign({
                id: result[0].adminId
            }, process.env.JWT_SECRET, { expiresIn: '1h' });

            // Pass a Cookie to frontend ...
            res.cookie('token', token, {
                httpOnly: true,
                sameSite: 'none',
                secure: true,
                maxAge: 100 * 60 * 60, // 1 hour ...
            });

            // Store User Data in the database Session ...
            const sessionQuery = 'INSERT INTO sessions (Id, token, createdAt, status, role) VALUES (?, ?, ?, ?, ?)';
            const values = [ result[0].adminId, token, new Date(), 'Admin', 'Active' ];
            pool.query(sessionQuery, values, (error, data) => {
                if(error) {
                    console.log(error);
                    return res.status(400).send('Error creating session');
                } 

                return res.status(200).json({ message: 'Login Successful', token: token, data: data });
            });
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}

async function login (req, res) {
    const { name, email, password } = req.body;

    if(!name || !email || !password) {
        return res.status(400).send('Please fill all the required fields');
    }

    try {
        // Encrypt the password ...
        const hashedPassword = await bcrypt.hash(password, 10);

        const values = [ name, email, hashedPassword, new Date() ];

        // Register the admin user by saving details in the database ...
        const sql = 'INSERT INTO admin (name, email, password, createdAt) VALUES (?, ?, ?, ?)'; 
        pool.query(sql, values, (error, data) => {
            if(error) {
                return res.status(400).send('Error registering admin user');
            } 

            console.log(data);
            return res.status(201).json({ message: 'Admin User registered successfully', data: data});
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}

module.exports = { register, login }