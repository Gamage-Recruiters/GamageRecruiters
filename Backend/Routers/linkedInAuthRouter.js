const express = require('express');
const passport = require('passport');
const linkedInAuthController = require('../Controllers/linkedInAuthController');

const router = express.Router();

// Login With LinkedIn Route ...
router.get('/linkedin/login', linkedInAuthController.loginWithLinkedIn );

// LinkedIn Auth Route ...
router.get('/auth/linkedin', passport.authenticate('linkedin', { scope: ['email', 'public_profile'] }));

// LinkedIn Auth Callback Route ...
router.get('/auth/linkedin/callback', passport.authenticate('linkedin', { failureRedirect: process.env.FAILURE_REDIRECT_URL, session: false }), linkedInAuthController.loginLinkedInCallback);

module.exports = router;