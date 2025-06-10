const dotenv = require('dotenv');
const { pool } = require('../config/dbConnection');
const splitStrings = require('../utils/splitStrings');

dotenv.config(); 

async function loginWithLinkedIn (req, res) {
    try {
        const url = process.env.LINKEDIN_AUTH_URL;
        console.log(url);
        return res.status(200).json({ message: 'redirect url', data: url });
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}

async function loginLinkedInCallback (req, res) {
    try {
        // Get user profile from Passport
        const profile = req.user;

        // Store LinkedIn login in database
        const sql = 'INSERT INTO LoginsThroughPlatforms (accountId, photo, name, email, loggedAt, platform) VALUES (?, ?, ?, ?, ?, ?)';
        const values = [profile.id, profile.photos?.[0]?.value, profile.displayName, profile.emails?.[0]?.value, new Date(), 'LinkedIn'];
        
        pool.query(sql, values, (error, data) => {
            if(error) {
                return res.status(400).send('Error Saving Data');
            } 
            
            // Check if user exists in our database
            const userQuery = 'SELECT * FROM Users WHERE email = ?';
            pool.query(userQuery, [profile.emails?.[0]?.value], async (error, result) => {
                if(error) {
                    console.log(error);
                    return res.status(400).send(error);
                }

                let userData;

                // If user doesn't exist, create a new one
                if(result.length === 0) {
                    console.log('User not found, creating new user...');
                    const nameParts = profile.displayName.split(' ');
                    const firstName = nameParts[0] || '';
                    const lastName = nameParts.length > 1 ? nameParts[1] : '';
                    
                    // Insert new user
                    const insertQuery = 'INSERT INTO users (firstName, lastName, email, photo, linkedInId, createdAt) VALUES (?, ?, ?, ?, ?, ?)';
                    const insertValues = [
                        firstName,
                        lastName,
                        profile.emails?.[0]?.value,
                        profile.photos?.[0]?.value,
                        profile.id,
                        new Date()
                    ];

                    pool.query(insertQuery, insertValues, (insertError, insertResult) => {
                        if(insertError) {
                            console.log(insertError);
                            return res.status(400).send('Error creating new user');
                        }
                        
                        // Get the new user data
                        pool.query('SELECT * FROM users WHERE linkedInId = ?', [profile.id], (userError, userData) => {
                            if(userError || userData.length === 0) {
                                return res.status(400).send('Error retrieving user data');
                            }
                            
                            // Generate JWT token
                            const token = createToken(userData[0]);
                            
                            // Redirect to frontend with token
                            res.cookie('token', token, {
                                httpOnly: true,
                                sameSite: 'Lax',
                                secure: false,
                                maxAge: 100 * 60 * 60, // 1 hour ...
                            });
                            
                            return res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
                        });
                    });
                } else {
                  // User exists, generate token and redirect
                    const token = createToken(result[0]);
                    
                    res.cookie('token', token, {
                        httpOnly: true,
                        sameSite: 'Lax',
                        secure: false,
                        maxAge: 100 * 60 * 60, // 1 hour ...
                    });
                    
                    return res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
                }
            });
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}

module.exports = { loginWithLinkedIn, loginLinkedInCallback }