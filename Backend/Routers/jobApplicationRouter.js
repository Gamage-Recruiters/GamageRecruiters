const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const jobApplicationController = require('../Controllers/jobApplicationController');

// Set up file storage engine for multer
const storage = multer.diskStorage({
  destination: './uploads/appliedJobs/resumes', // Folder to store resumes
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Set filename to avoid duplication
  },
});

// Initialize multer upload middleware
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
  fileFilter: (req, file, cb) => {
    const filetypes = /pdf|doc|docx|txt/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb('Error: Only .pdf, .doc, .docx, .txt files are allowed');
    }
  },
}).single('resume'); // Handle a single file upload under field name 'resume'

// Apply for a job (with file upload)
router.route('/apply').post(upload, jobApplicationController.applyJob); 

// Get specific application by ID
router.route('/application/:applicationId').get(jobApplicationController.getApplication); 

// Get specific application by userID
router.route('/applications/user/:userId').get(jobApplicationController.getApplicationByUser); 

// Get all job applications
router.route('/applications').get(jobApplicationController.getApplications); 

// Update a specific job application
router.route('/update/:applicationId').put(upload, jobApplicationController.updateApplication); // Update a specific job application

// Delete a specific job application
router.route('/delete/:applicationId').delete(jobApplicationController.deleteApplication);

module.exports = router;
