const express = require('express');
const adminController = require('../Controllers/adminController');

const router = express.Router();

// Route for admin registration ...
router.route('/register').post(adminController.register);

// Route for admin login ...
router.route('/login').post(adminController.login);

module.exports = router;
