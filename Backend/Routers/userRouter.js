const express = require('express');
const upload = require('../middlewares/fileUploading');
const userController = require('../Controllers/userController');

const router = express.Router();

// Update Profile Route ...
router.put('/update-user-data', upload, userController.updateUserDetails);

// Delete Profile Route ...
router.delete('/delete-profile/:id', userController.deleteUser);

// Change Password Route ...
router.post('/change-password', userController.changePassword);

module.exports = router;