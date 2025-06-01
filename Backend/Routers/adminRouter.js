const express = require('express');
const adminController = require('../Controllers/adminController');
const upload = require('../middlewares/fileUploading');
const adminAuth = require('../middlewares/adminAuth');

const router = express.Router();

// Route to add a new admin user ...
router.post('/register', upload, adminController.register);

// Route for admin login ...
// router.route('/login').post(adminController.login);
router.post('/login', adminController.login);
router.post('/logout', adminController.logout); 

// Route to fetch all admin users ...
router.get('/all', adminAuth, adminController.fetchAllAdminUsers);

// Route to fetch a specific admin user data ...
router.get('/:adminId', adminAuth, adminController.getAdminDataById);

// Route to delete a specific admin user data ...
router.delete('/delete/:adminId', adminAuth, adminController.deleteAdminUserDetails);

// Route to update a specific admin user data ...
router.put('/update/:adminId', adminAuth, upload, adminController.updateAdminUserDetails);

module.exports = router;
