const express = require('express');
const passport = require('passport');
const dotenv = require('dotenv');

const { pool } = require('../config/dbConnection');

const router = express.Router();

dotenv.config();

router.get('/google/login', (req, res) => {
    const url = process.env.GOOGLE_AUTH_URL;
    console.log(url);
    return res.status(200).json({ message: 'redirect url', data: url });
});

router.get('/auth/google', 
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
    passport.authenticate('google', {
        failureRedirect: process.env.FAILURE_REDIRECT_URL
    }), (req, res) => {
        try {
            // Store user in session
            req.session.user = req.user; 
            
            console.log("User stored in session:", req.session.user);

            const sql = 'INSERT INTO LoginsThroughPlatforms (accountId, photo, name, email, loggedAt, platform) VALUES (?, ?, ?, ?, ?, ?)';
            const values = [req.session.user.id, req.session.user.photo, req.session.user.name, req.session.user.email, new Date(), 'Google'];
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

// router.get('/google/callback',
//     passport.authenticate('google', {
//         successRedirect: 'http://localhost:5173/dashboard',
//         failureRedirect: 'http://localhost:5173/login'
//     })
// );

// router.get('/google/callback', 
//     passport.authenticate('google', {
//         successRedirect: '/protected',
//         failureRedirect: '/auth/failure'
//     })
// );

// router.get('/auth/failure', (req, res) => {
//     res.send('Something Went Wrong');
// })

// router.get('/protected', (req, res) => {
//     if(!req.user) {
//         return res.status(401).json({ message: "Unauthorized" });
//     }

//     return res.json({ message: "Hello, " + req.user.name, email: req.user.email });
// });

// router.get('/protected', async (req, res) => {
//     console.log("Authenticated User:", req.session.user);
//     try {
//         if(!req.session.user) {
//             return res.status(401).send('Unauthorized');
//         } else {
//             const sql = 'INSERT INTO LoginsThroughPlatforms (name, email, loggedAt, platform) VALUES (?, ?, ?, ?)';
//             const values = [req.user.name, req.user.email, new Date(), 'Google'];
//             pool.query(sql, values, (error, data) => {
//                 if(error) {
//                     return res.status(400).send('Error Saving Data');
//                 } 
    
//                 console.log(data);
//                 return res.status(201).json({ message: 'User Data Saved successfully', data: data});
//             });
//         }
//     } catch (error) {
//         console.log(error);
//         return res.status(500).send(error);
//     }
// }); 

router.get('/logout', (req, res) => {
    req.logOut();
    req.session.destroy();
    res.send('GoodBye');
});

module.exports = router;