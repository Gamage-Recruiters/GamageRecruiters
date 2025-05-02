const express = require('express');
const router = express.Router();
const upload = require('../middlewares/fileUploading');
const jobApplicationController = require('../Controllers/jobApplicationController');

// Apply for a job (with file upload)
router.route('/apply').post(upload, jobApplicationController.applyJob); 

// Get specific application by ID
router.route('/application/:applicationId').get(jobApplicationController.getApplication); 

// Get specific application by userID
router.route('/applications/user/:userId').get(jobApplicationController.getApplicationByUser); 

// Get all job applications
router.route('/applications').get(jobApplicationController.getApplications); 

// Get job applications related to a jobId 
router.route('/:jobId').get(jobApplicationController.getApplicationByJobId);

// Update a specific job application
router.route('/update/:applicationId').put(upload, jobApplicationController.updateApplication); // Update a specific job application

// Delete a specific job application
router.route('/delete/:applicationId').delete(jobApplicationController.deleteApplication);

module.exports = router;
