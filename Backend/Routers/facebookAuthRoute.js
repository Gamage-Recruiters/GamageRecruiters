const express = require('express');
const passport = require('passport');

const { pool } = require('../config/dbConnection');

const router = express.Router(); 

router.get('/facebook/login', (req, res) => {
    const url = 'http://localhost:5000/auth/facebook';
    return res.status(200).json({ message: 'redirect url', data: url });
});

router.get('/auth/facebook',
    passport.authenticate('facebook', { 
        scope: ['email', 'public_profile']
    })
);

router.get('/auth/facebook/callback',
    passport.authenticate('facebook', { 
        failureRedirect: 'http://localhost:5173/login' 
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
                res.redirect('http://localhost:5173/dashboard');
            });
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    }
);

module.exports = router;