const express = require('express');
const upload = require('../middlewares/fileUploading');
const userController = require('../Controllers/userController');

const router = express.Router();

// Update User CV Route ...
router.put('/update-user-cv', upload, userController.uploadUserCV);

// Upload User Image Route ...
router.put('/upload-user-image', upload, userController.uploadUserImage);

// Update Profile Route ...
router.put('/update-user-data', upload, userController.updateUserDetails);

// Delete Profile Route ...
router.delete('/delete-profile/:id', userController.deleteUser);

// Change Password Route ...
router.post('/change-password', userController.changePassword);

// Access Job Application Status ...
router.get('/application-status/:userId', userController.getUserRecentJobActivity);

// Access Last Active Status ...
router.get('/last-active-status/:userId', userController.getLastActiveStatus);

// Access User Profile Recent Activity Data ...
router.get('/recent-activity/:userId', userController.getRecentProfileActivity);

module.exports = router;