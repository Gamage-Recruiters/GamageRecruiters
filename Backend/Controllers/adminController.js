const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/dbConnection');

async function register (req, res) {
    const { name, gender, role, primaryPhoneNumber, secondaryPhoneNumber, status, email, password } = req.body;

    if(!name || !gender || !role || !primaryPhoneNumber || !status || !email || !password) {
        return res.status(400).send('Name, Gender, PrimaryPhoneNumber, Email, Password and Role cannot be empty!');
    }

    try {
        const imageName = req.files?.adminPhoto?.[0]?.filename || null;
        console.log('imageName', imageName);

        // Check a data related to email, exists in the database
        const sql = 'SELECT * FROM admin WHERE email = ?';
        pool.query(sql, [email], async (error, result) => {
            if(error) {
                return res.status(400).send(error);
            }

            if(result.length > 0) {
                return res.status(409).send('Email already registered.');
            }

            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Store the details in database
            const adminStoreDataQuery = 'INSERT INTO admin (name, email, password, gender, role, primaryPhoneNumber, secondaryPhoneNumber, status, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
            pool.query(adminStoreDataQuery, [name, email, hashedPassword, gender, role, primaryPhoneNumber, secondaryPhoneNumber, status, imageName], (error, result) => {
                if(error) {
                    return res.status(400).send(error);
                }

                if(result.affectedRows === 0) {
                    return res.status(403).send('Data Insertion Error');
                }

                return res.status(201).json({ message: 'Successfully Registered', data: result });
            })
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}

async function login (req, res) {
    const { email, password } = req.body;

    if(!email || !password) {
        return res.status(400).send('Please fill all the required fields');
    }

    try {
        // check whether the admin user is existing or not ...
        const adminUserQuery = 'SELECT * FROM admin WHERE email = ?';
        pool.query(adminUserQuery, email, async (error, result) => {
            if (error) {
                return res.status(400).send(error);
            }

            if (result.length === 0) {
                return res.status(404).send('Data Not Found');
            }

            const adminPassword = result[0].password;
            // Check password validity ...
            const verifyPassword = await bcrypt.compare(password, adminPassword);

            if(!verifyPassword) {
                return res.status(401).send('Password is Incorrect');
            }

            // Set expiration time manually ...
            const expTime = Math.floor(Date.now() / 1000) + 24 * 60 * 60; // 24 hours

            // Generate jwt token ...
            const token = jwt.sign({
                id: result[0].adminId,
                exp: expTime,
                role: 'Admin'
            }, process.env.JWT_SECRET);

            // Pass a Cookie to frontend ...
            res.cookie('token', token, {
                httpOnly: true,
                sameSite: 'none',
                secure: true,
                path: '/',
                maxAge: 24 * 60 * 60 * 1000, // 24 hours
            });

            return res.status(200).json({ 
                message: 'Login Successful', 
                token: token, 
                adminId: result[0].adminId 
            });
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}

async function fetchAllAdminUsers (req, res) {
    try {
        const adminDataQuery = 'SELECT * FROM admin';
        pool.query(adminDataQuery, (error, result) => {
            if (error) {
                return res.status(400).send(error);
            }

            if (result.length === 0) {
                return res.status(404).send('Data Not Found');
            }

            return res.status(200).json({ message: 'Data Found', data: result });
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}

async function getAdminDataById(req, res) {
    const { adminId } = req.params;

    if(!adminId) {
        return res.status(400).send('Admin ID is required');
    }

    try {
        const adminDataQuery = 'SELECT * FROM admin WHERE adminId = ?';
        pool.query(adminDataQuery, [adminId], (error, result) => {
            if (error) {
                return res.status(400).send(error);
            }

            if (result.length === 0) {
                return res.status(404).send('Data Not Found');
            }

            return res.status(200).json({ message: 'Data Found', data: result });
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}

async function deleteAdminUserDetails (req, res) {
    const { adminId } = req.params;

    if(!adminId) {
        return res.status(400).send('Admin ID is required');
    }

    try {
        const deleteAdminDataQuery = 'DELETE FROM admin WHERE adminId = ?';
        pool.query(deleteAdminDataQuery, [adminId], (error, result) => {
            if (error) {
                return res.status(400).send(error);
            }

            if (result.affectedRows === 0) {
                return res.status(400).send('Data Deletion failed');
            }

            return res.status(200).send('Admin Data Deleted Successfully');
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}

async function updateAdminUserDetails (req, res) {
    const { adminId } = req.params;
        const { name, email, gender, role, status, primaryPhoneNumber, secondaryPhoneNumber } = req.body;

    if(!adminId || !name || !email || !gender || !role || !status || !primaryPhoneNumber || !secondaryPhoneNumber) {
        return res.status(400).send('All fields are required');
    }
    
    try {
        const imageName = req.files?.adminPhoto?.[0]?.filename || null;
        console.log('Received Admin imageName:', imageName);

        if(imageName) {
            // get the current image path
            const getCurrentImageQuery = "SELECT image FROM admin WHERE adminId = ?";

            pool.query(getCurrentImageQuery, [adminId], async (error, result) => {
                if (error) {
                    return res.status(400).send(error);
                }

                //if there's a previous image, deleting it
                if (result.length > 0 && result[0].image) {
                    const oldImageName = result[0].image;
                    try {
                        const deleteUploadedFile = require('../utils/deleteUplodedFile');
                        await deleteUploadedFile('adminPhoto', oldImageName);
                    } catch (err) {
                        console.log('Error deleting old image:', err);
                    }
                }
                // update details
                const updateAdminUserDetailsQuery = 'UPDATE admin SET name = ?, email = ?, gender = ?, role = ?, status = ?, primaryPhoneNumber = ?, secondaryPhoneNumber = ?, image = ? WHERE adminId = ?';
                const values = [name, email, gender, role, status, primaryPhoneNumber, secondaryPhoneNumber, imageName, adminId];

                pool.query(updateAdminUserDetailsQuery, values, (error, result) => {
                    if (error) {
                        return res.status(400).send(error);
                    }

                    if(result.affectedRows === 0) {
                        return res.status(400).send('Data Update failed');
                    }

                    return res.status(200).send('Admin User Details Updated Successfully');
                });
            });
        } else {
            // if no image is provided
            const updateAdminUserDetailsQuery = 'UPDATE admin SET name = ?, email = ?, gender = ?, role = ?, status = ?, primaryPhoneNumber = ?, secondaryPhoneNumber = ? WHERE adminId = ?';
            const values = [name, email, gender, role, status, primaryPhoneNumber, secondaryPhoneNumber, adminId];

            pool.query(updateAdminUserDetailsQuery, values, (error, result) => {
                if (error) {
                    return res.status(400).send(error);
                }

                if(result.affectedRows === 0) {
                    return res.status(400).send('Data Update failed');
                }

                return res.status(200).send('Admin User Details Updated Successfully');
            });
        }

        
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}

async function logout(req, res) {
    try {
        // Clear the token cookie, no need to check database sessions
        res.clearCookie('token', {
            httpOnly: true,
            sameSite: 'none',
            secure: true,
        });

        return res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        console.log(error);
        return res.status(500).send('Server Error');
    }
}


module.exports = { register, login, logout, fetchAllAdminUsers, getAdminDataById, deleteAdminUserDetails, updateAdminUserDetails }