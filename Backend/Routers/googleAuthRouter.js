const express = require('express');
const passport = require('passport');
const {authorize} = require('../Controllers/AuthConttrollers/googleAuthController')
const router = express.Router();

// Google Auth Route ...
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google Auth Callback Route ...
router.get('/google/callback',

    passport.authenticate('google', { session: false, failureRedirect: process.env.FAILURE_REDIRECT_URL }),
    authorize
);















module.exports = router;