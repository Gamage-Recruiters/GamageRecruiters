const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { pool } = require('../config/dbConnection');
const { otpCache, generateOTP, sendOTP } = require('../middlewares/OTP');
const { createToken } = require('../auth/token/jwtToken');

const JWT_SECRET = process.env.JWT_SECRET;
dotenv.config();

async function register(req, res) {

    const { firstName, lastName, gender, birthDate, address, address2, phoneNumber1, phoneNumber2, linkedInLink, facebookLink, portfolioLink, email, password, profileDescription } = req.body;

    if (!firstName || !lastName || !gender || !birthDate || !email || !password) {
        return res.status(400).send('Please fill all the required fields');
    }

    try {
        // If existing, access the file names of the cv and image ...

        const imageName = req.files?.photo?.[0]?.filename || null;

        // Encrypt the password ...
        const hashedPassword = await bcrypt.hash(password, 10);

        const values = [firstName, lastName, gender, birthDate, address, address2, phoneNumber1, phoneNumber2, linkedInLink, facebookLink, portfolioLink, email, hashedPassword, imageName, profileDescription, new Date()];


        // Register the user by saving details in the database ...
        const sql = 'INSERT INTO users (firstName, lastName, gender, birthDate, address, address2, phoneNumber1, phoneNumber2, linkedInLink, facebookLink, portfolioLink, email, password, photo, profileDescription, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        await new Promise((resolve, reject) => {
            pool.query(sql, values, (error, result) => {
                if (error) {
                    if (error.code === 'ER_DUP_ENTRY') {
                        return reject({ code: 400, message: 'Email already exists' });
                    }
                    return reject({ code: 400, message: 'Error registering user' });
                }

                resolve(result);
            });
        });





        // validate registered user Again  -  Auto Logging
        try {

            const userQuery = 'SELECT * FROM users WHERE email = ?';
            pool.query(userQuery, [email], async (error, result) => {
                if (error) {
                    return res.status(404).send('User Not Found');
                }
                if (!result || result.length === 0) {
                    return res.status(404).send('User Not Found');
                }

                // Verify the password ...
                const verifyPasswordResult = await bcrypt.compare(password, result[0].password);

                if (!verifyPasswordResult) {
                    return res.status(401).send('Invalid Password');
                }

                // Generate Token ...
                const token = createToken(result[0]);
      
                // Pass a Cookie to frontend ...
                res.cookie('token', token, {
                    httpOnly: true,
                    sameSite: 'Lax',
                    secure: false,
                    maxAge: 60 * 60 * 1000, // 1 hour ...
                }).status(200).json({ 
                    message: "User registered and logged in successfully", 
                    username: firstName,
                });

            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "User Not Registered" });
        }

    } catch (error) {
        console.log(error);
        return res.status(error.code).json({ message: error.message });
    }
}



async function login(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send('Email and Password cannot be empty');
    }

    try {
        // Check if the user exists ...
        const userQuery = 'SELECT * FROM users WHERE email = ?';
        pool.query(userQuery, [email], async (error, result) => {
            if (error) {
                return res.status(404).send('User Not Found');
            }
            if (!result || result.length === 0) {
                return res.status(404).send('User Not Found');
            }

            // Verify the password ...
            const verifyPasswordResult = await bcrypt.compare(password, result[0].password);

            if (!verifyPasswordResult) {
                return res.status(401).send('Invalid Password');
            }

            //  Update lastActive on login
            const updateQuery = 'UPDATE users SET lastActive = ? WHERE userId = ?';
            pool.query(updateQuery, [new Date(), result[0].userId]);

            // Generate Token ...
            const token = createToken(result[0]);

            // Pass a Cookie to frontend ...
            res.cookie('token', token, {
                httpOnly: true,
                sameSite: 'Lax',
                secure: false,
                maxAge: 60 * 60 * 1000, // 1 hour ...
            }).status(200).json({ 
                message: "User logged in successfully",
                user: {
                    id: result[0].userId,
                    firstName: result[0].firstName,
                    lastName: result[0].lastName,
                    email: result[0].email
                }
            });
        });
    } catch (error) {
        // console.log(error);
        res.status(500).send(error);
    }
}

async function sendEmailVerificationOTP(req, res) {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    try {
        const otp = generateOTP();
        // Store OTP as string
        otpCache[email] = otp.toString();

        // Send the email
        await sendOTP(email, otp);
        console.log("OTP stored for", email, ":", otp);
        
        res.status(200).json({ 
            success: true,
            message: "OTP sent successfully" 
        });
    } catch (error) {
        console.error('Error sending OTP:', error);
        return res.status(500).json({ message: 'Failed to send OTP' });
    }
}

async function verifyEmailVerificationOTP(req, res) {
    const { otp, oldEmail, email } = req.body;

    if (!otp || !oldEmail || !email) {
        return res.status(400).json({ message: 'Missing required data' });
    }

    console.log("Received verification request:", {
        storedOTP: otpCache[email],
        receivedOTP: otp,
        oldEmail,
        email
    });

    try {
        // First check if OTP exists
        if (!otpCache[email]) {
            return res.status(400).json({ message: "OTP expired or not found" });
        }

        // Convert both OTPs to strings for comparison
        if (otpCache[email].toString() !== otp.toString()) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        // Update the email in database
        const updateSql = 'UPDATE users SET email = ? WHERE email = ?';
        pool.query(updateSql, [email, oldEmail], (updateError, updateResult) => {
            if (updateError) {
                console.error('Database error:', updateError);
                return res.status(500).json({ message: 'Database error occurred' });
            }

            if (updateResult.affectedRows === 0) {
                return res.status(400).json({ message: 'User not found' });
            }

            // Clear OTP from cache after successful update
            delete otpCache[email];

            return res.status(200).json({ 
                success: true,
                message: 'Email verification successful'
            });
        });

    } catch (error) {
        console.error('Server error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

async function emailCheck(req, res) {
    const { email } = req.body;

    if (!email) {
        return res.status(400).send('Something went wrong with email');
    }

    try {
        // Check a user data related to email ....
        const sql = 'SELECT * FROM users WHERE email = ?';
        pool.query(sql, [email], (error, result) => {
            if (error) {
                // console.log(error);
                return res.status(404).send('User Not Found');
            }

            return res.status(200).json({ message: 'Data Found', data: result });
        });
    } catch (error) {
        // console.log(error);
        return res.status(500).send(error);
    }
}

async function resetPassword(req, res) {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
        return res.status(400).send('Something went wrong.');
    }

    try {
        const { email, newPassword } = req.body;

        if (!email || !newPassword) {
            return res.status(400).send('Email and Password cannot be empty');
        }

        const sql = 'SELECT * FROM users WHERE email = ?';
        pool.query(sql, [email], async (error, result) => {
            if (error) {
                return res.status(404).send('User Not Found');
            }

            // Hash the Password ...
            const hashedNewPassword = await bcrypt.hash(newPassword, 10);

            // Update password in the database ...
            const updateSql = 'UPDATE users SET password = ? WHERE email = ?';
            pool.query(updateSql, [hashedNewPassword, email], (error, data) => {
                if (error) {
                    // console.log(error);
                    return res.status(400).send('Error updating password');
                }

                return res.status(200).json({ message: 'Password reset successfully', data: data });
            });
        });
    } catch (error) {
        // console.log(error);
        return res.status(500).send(error);
    }
}

async function logout(req, res) {
    try {
        // Always clear the cookie, regardless of whether it exists
        res.clearCookie('token', {
            httpOnly: true,
            sameSite: 'Lax',
            secure: false, 
            path: '/'
        });
        
        return res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error('Logout error:', error);
        return res.status(500).json({ message: 'Error during logout' });
    }
}


module.exports = { register, login, sendEmailVerificationOTP, verifyEmailVerificationOTP, emailCheck, resetPassword, logout }