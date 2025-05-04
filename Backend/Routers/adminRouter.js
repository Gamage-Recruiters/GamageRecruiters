const express = require('express');
const adminController = require('../Controllers/adminController');
const upload = require('../middlewares/fileUploading');

const router = express.Router();


router.post('/register', upload, adminController.register);


// router.route('/login').post(adminController.login);
router.post('/login', adminController.login);

module.exports = router;
