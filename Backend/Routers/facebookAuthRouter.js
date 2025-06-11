const express = require('express');
const passport = require('passport');
const router = express.Router();
const {authorize} = require('../Controllers/AuthConttrollers/facebookAuthController');



// Facebook Auth Route ...
router.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email', 'public_profile'] }));

// Facebook Auth Callback Route ...
router.get('/auth/facebook/callback', passport.authenticate('facebook', { 
    session: false,  
    failureRedirect: process.env.FAILURE_REDIRECT_URL }), 

authorize
);

module.exports = router;