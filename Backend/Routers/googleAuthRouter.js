const express = require('express');
const passport = require('passport');
const googleAuthController = require('../Controllers/googleAuthController');

const router = express.Router();

// Login With Google Route ...
router.get('/google/login', googleAuthController.loginWithGoogle);

// Google Auth Route ...
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google Auth Callback Route ...
router.get('/google/callback', passport.authenticate('google', { failureRedirect: process.env.FAILURE_REDIRECT_URL }), googleAuthController.loginGoogleCallback);

module.exports = router;