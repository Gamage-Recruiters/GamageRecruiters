const express = require('express');
const upload = require('../middlewares/fileUploading');
const authController = require('../Controllers/authController');
const {verifyToken} = require('../auth/token/jwtToken')
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

// Route for logout ...
router.route('/logout').get(authController.logout);


// for verifying
router.route('/check').get(verifyToken, (req, res) => {
    res.json({
        success: true,
        message: "Token is valid",
        data: req.user
    });
});

module.exports = router;