const express = require('express');
const passport = require('passport');
const dotenv = require('dotenv');

const { pool } = require('../config/dbConnection');

const router = express.Router(); 

dotenv.config();

router.get('/linkedin/login', (req, res) => {
    const url = process.env.LINKEDIN_AUTH_URL;
    console.log(url);
    return res.status(200).json({ message: 'redirect url', data: url });
});

router.get('/auth/linkedin',
    passport.authenticate('linkedin', { 
        // state: true  
        scope: ['email', 'public_profile']
    })
);

router.get('/auth/linkedin/callback',
    passport.authenticate('linkedin', { 
        failureRedirect: process.env.FAILURE_REDIRECT_URL,
        session: false 
    }), (req, res) => {
        try {
            // Store user in session
            req.session.user = req.user; 
            
            console.log("User stored in session:", req.session.user);

            const sql = 'INSERT INTO LoginsThroughPlatforms (accountId, photo, name, email, loggedAt, platform) VALUES (?, ?, ?, ?, ?, ?)';
            const values = [req.session.user.id, req.session.user.photo, req.session.user.name, req.session.user.email, new Date(), 'LinkedIn'];
            pool.query(sql, values, (error, data) => {
                if(error) {
                    return res.status(400).send('Error Saving Data');
                } 
    
                console.log('Data Saved Successfully', data);
                // Redirect to frontend after setting session and save data ...
                res.redirect(process.env.SUCCESS_REDIRECT_URL);
            });
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    }
);

module.exports = router;