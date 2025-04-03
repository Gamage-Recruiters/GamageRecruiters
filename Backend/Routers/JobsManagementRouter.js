const express = require("express");
const {
  viewJobs,
  viewJob,
  addJob,
  updateJob,
  deleteJob,
} = require("../Controllers/JobsManagementController");
const router = express.Router();

// View all Jobs
router.get("/", viewJobs);

// View a Job by id ...
router.get("/:jobId", viewJob);

// Add a New Job
router.post("/addjob", addJob);

// Update a Job
router.put("/:jobId", updateJob);

// Delete a Job
router.delete("/:jobId", deleteJob);

module.exports = router;
