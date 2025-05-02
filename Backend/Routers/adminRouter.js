const express = require('express');
const adminController = require('../Controllers/adminController');
const upload = require('../middlewares/fileUploading');

const router = express.Router();

// Route for admin registration ...
// router.route('/register').post(adminController.register);
router.post('/register', upload, adminController.register);

// Route for admin login ...
// router.route('/login').post(adminController.login);
router.post('/login', adminController.login);

module.exports = router;
