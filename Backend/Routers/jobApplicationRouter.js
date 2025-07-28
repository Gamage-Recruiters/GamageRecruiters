const express = require('express');
const router = express.Router();
const upload = require('../middlewares/fileUploading');
const { verifyToken } = require('../auth/token/jwtToken');
const adminAuth = require('../middlewares/adminAuth');
const jobApplicationController = require('../Controllers/jobApplicationController');
const jobApplicationExtendedController = require('../Controllers/jobApplicationExtendedController');

// Basic routes for job applications
// Apply for a job (with file upload)
router.route('/apply').post(verifyToken, upload, jobApplicationController.applyJob);

// Get specific application by ID - Admin
router.route('/application/:applicationId').get(adminAuth, jobApplicationController.getApplication);

// Get specific application by ID - User route 
router.route('/application/:applicationId/user').get(verifyToken, jobApplicationController.getApplication);

// Get specific application by userID
router.route('/applications/user/:userId').get(jobApplicationController.getApplicationByUser);

// Get all job applications
router.route('/applications').get(adminAuth, jobApplicationController.getApplications);

// Get job applications related to a jobId 
router.route('/:jobId').get(jobApplicationController.getApplicationByJobId);

// Update a specific job application
router.route('/update/:applicationId').put(verifyToken, upload, jobApplicationController.updateApplication);

// Delete a specific job application
router.route('/delete/:applicationId').delete(adminAuth, jobApplicationController.deleteApplication);

// Delete a specific job application for client
router.route('/user/delete/:applicationId').delete(verifyToken, jobApplicationController.deleteApplication);

// Extended functionality routes - Job Management View
// Get all applications for a specific job
router.route('/jobs/:jobId/applications').get(adminAuth, jobApplicationExtendedController.getApplicationsByJob);

// Download a specific resume
router.route('/applications/download/:applicationId').get(adminAuth, jobApplicationExtendedController.downloadResume);

// Download all resumes for a job as a zip
router.route('/jobs/:jobId/applications/download-all').get(adminAuth, jobApplicationExtendedController.downloadAllResumes);

// Delete all applications for a job
router.route('/jobs/:jobId/applications/delete-all').delete(adminAuth, jobApplicationExtendedController.deleteAllApplications);

// Get job statistics (applications per job)
router.route('/jobs/statistics').get(adminAuth, jobApplicationExtendedController.getJobStatistics);

module.exports = router;