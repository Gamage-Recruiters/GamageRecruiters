const express = require('express');
const passport = require('passport');
const facebookAuthController = require('../Controllers/facebookAuthController');

const router = express.Router();

// Login With Facebook Route ...
router.get('/facebook/login', facebookAuthController.loginWithFacebook );

// Facebook Auth Route ...
router.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email', 'public_profile'] }));

// Facebook Auth Callback Route ...
router.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: process.env.FAILURE_REDIRECT_URL }), facebookAuthController.loginFacebookCallback );

module.exports = router;