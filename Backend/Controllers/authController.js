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
                    maxAge: 100 * 60 * 60, // 1 hour ...
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
                maxAge: 100 * 60 * 60, // 1 hour ...
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
        return res.status(400).send('Email is required');
    }

    console.log(email);

    try {
        const otp = generateOTP();
        otpCache[email] = otp;

        // Send the email ...
        sendOTP(email, otp);
        console.log(otp);
        res.cookie('otpCache', otpCache, { maxAge: 3000, httpOnly: true });
        res.status(200).json({ message: "OTP sent successfully", otp: otp });
    } catch (error) {
        // console.log(error);
        return res.status(500).send(error);
    }
}

async function verifyEmailVerificationOTP(req, res) {
    const { otp, oldEmail, email } = req.body;

    if (!otp || !oldEmail || !email) {
        return res.status(400).send('Something went wrong with required data');
    }

    console.log(otp, oldEmail, email);

    try {
        // Check if email exists in the cache ...
        if (!otpCache.hasOwnProperty(email)) {
            return res.status(404).send("Email not found");
        }

        // Check if the OTP matches the one stored in the cache ...
        if (otpCache[email] === otp) {
            // res.status(200).send("OTP Verified Successfully");
            console.log("OTP Verified Successfully");
            delete otpCache[email]; // Remove the OTP from the cache after successful verification.
            const sql = 'UPDATE users SET email = ? WHERE email = ?';
            pool.query(sql, [email, oldEmail], (error, result) => {
                if (error) {
                    // console.log(error);
                    return res.status(400).send('User Registration Failed');
                }

                return res.status(200).json({ message: 'User Registration Successfull', data: result });
            });
        } else {
            return res.status(401).send("Invalid OTP");
        }
    } catch (error) {
        // console.log(error);
        return res.status(500).send(error);
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