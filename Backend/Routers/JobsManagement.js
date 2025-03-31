const express = require("express");
const {
  viewJobs,
  addJob,
  updateJob,
  deleteJob,
} = require("../Controllers/JobsManagement");
const router = express.Router();

// View all Jobs
router.get("/", viewJobs);

// Add a New Job
router.post("/addjob", addJob);

// Update a Job
router.put("/:jobId", updateJob);

// Delete a Job
router.delete("/:jobId", deleteJob);

module.exports = router;
