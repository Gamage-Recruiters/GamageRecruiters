const express = require('express');
const authenticateToken = require('../auth/token/authenticateToken');
const sessionController = require('../Controllers/sessionController');

const router = express.Router();

// Route to get the Logged User Data ...
router.get('/profile-data', sessionController.getLoggedUserData);
// router.get('/profile-data', authenticateToken, sessionController.getLoggedUserData);

// Route to get a new access token ...
router.put('/update-access-token', sessionController.generateNewAccessToken);

// Route to get user login attempts ...
router.get('/login-attempts/:userId', sessionController.getUserLoginAttempts);

module.exports = router;