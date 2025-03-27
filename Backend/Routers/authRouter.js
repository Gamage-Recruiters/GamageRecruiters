const express = require('express');
const upload = require('../middlewares/fileUploading');
const authController = require('../Controllers/authController');

const router = express.Router();

// Route for user registration ...
// router.route('/register', upload).post(authController.register);
router.post('/register', upload, authController.register);

// Route for user login ...
router.route('/login').post(authController.login);

// Route for Sending OTP ...
router.route('/sendOTP').post(authController.sendEmailVerificationOTP);

// Route for Verifying OTP ...
router.route('/verifyOTP').post(authController.verifyEmailVerificationOTP);

// Route for Email Check ...
router.route('/email-check').post(authController.emailCheck);

// Route for Resetting Password ...
router.route('/reset-password').post(authController.resetPassword); 

module.exports = router;