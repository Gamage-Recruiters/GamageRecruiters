const express = require('express');
const router = express.Router();
const upload = require('../middlewares/fileUploading');
const jobApplicationController = require('../Controllers/jobApplicationController');
const jobApplicationExtendedController = require('../Controllers/jobApplicationExtendedController');

// Basic routes for job applications
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
router.route('/update/:applicationId').put(upload, jobApplicationController.updateApplication);

// Delete a specific job application
router.route('/delete/:applicationId').delete(jobApplicationController.deleteApplication);

// Extended functionality routes - Job Management View
// Get all applications for a specific job
router.route('/jobs/:jobId/applications').get(jobApplicationExtendedController.getApplicationsByJob);

// Download a specific resume
router.route('/applications/download/:applicationId').get(jobApplicationExtendedController.downloadResume);

// Download all resumes for a job as a zip
router.route('/jobs/:jobId/applications/download-all').get(jobApplicationExtendedController.downloadAllResumes);

// Delete all applications for a job
router.route('/jobs/:jobId/applications/delete-all').delete(jobApplicationExtendedController.deleteAllApplications);

// Get job statistics (applications per job)
router.route('/jobs/statistics').get(jobApplicationExtendedController.getJobStatistics);

module.exports = router;