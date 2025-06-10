const express = require('express');
const upload = require('../middlewares/fileUploading');
const userController = require('../Controllers/userController');
const { sendOTP } = require('../Controllers/userController');
const { verify } = require('jsonwebtoken');
const { verifyToken } = require('../auth/token/jwtToken')
const router = express.Router();

// View All Client Users
router.get('/all', verifyToken, userController.getAllClientUsers);

// Update User CV Route ...
router.put('/update-user-cv', upload,verifyToken, userController.uploadUserCV);

// Upload User Image Route ...
router.put('/upload-user-image', verifyToken, upload, userController.uploadUserImage);

// Update Profile Route ...
router.put('/update-user-data/:userId', verifyToken, upload, userController.updateUserDetails);

// Delete Profile Route ...
router.delete('/delete-profile/:userId',verifyToken, userController.deleteUser);

// Change Password Route ...
router.post('/change-password',verifyToken, userController.changePassword);

// Access Job Application Status ...
router.get('/application-status/:userId', userController.getUserRecentJobActivity);

// Access Last Active Status ...
router.get('/last-active-status/:userId', userController.getLastActiveStatus);

// Access User Profile Recent Activity Data ...
router.get('/recent-activity/:userId',verifyToken, userController.getRecentProfileActivity);

// Subscribe to News Letter ...
router.post('/subscribe-newsletter',verifyToken, userController.subscribeToNewsletter);

// Fetch Users Data ...
router.get('/all-users', userController.getAllSystemUsers);

// Fetch User By Id ...
router.get('/:userId',verifyToken, userController.getUserById);

router.get('/user/:userId/details',verifyToken, userController.getAllUserDetails);

router.post('/sendOTP', userController.sendOTP);


module.exports = router;