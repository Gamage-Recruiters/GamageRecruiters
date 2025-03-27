const express = require('express');
const sessionController = require('../Controllers/sessionController');

const router = express.Router();

// Route to get the Logged User Data ...
router.route('/profile-data').get(sessionController.getLoggedUserData)

module.exports = router;