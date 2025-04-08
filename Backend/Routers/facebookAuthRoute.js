const express = require('express');
const passport = require('passport');
const dotenv = require('dotenv');

const { pool } = require('../config/dbConnection');

const router = express.Router(); 

dotenv.config();

router.get('/facebook/login', (req, res) => {
    const url = process.env.FACEBOOK_AUTH_URL;
    console.log(url);
    return res.status(200).json({ message: 'redirect url', data: url });
});

router.get('/auth/facebook',
    passport.authenticate('facebook', { 
        scope: ['email', 'public_profile']
    })
);

router.get('/auth/facebook/callback',
    passport.authenticate('facebook', { 
        failureRedirect: process.env.FAILURE_REDIRECT_URL 
    }), (req, res) => {
        try {
            // Store user in session
            req.session.user = req.user; 
            
            console.log("User stored in session:", req.session.user);

            const sql = 'INSERT INTO LoginsThroughPlatforms (accountId, photo, name, email, loggedAt, platform) VALUES (?, ?, ?, ?, ?, ?)';
            const values = [req.session.user.id, req.session.user.photo, req.session.user.name, req.session.user.email, new Date(), 'Facebook'];
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