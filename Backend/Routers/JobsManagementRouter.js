const express = require("express");
const {
  viewJobs,
  viewLatestJobs,
  viewJob,
  addJob,
  updateJob,
  deleteJob,
  viewJobsByUser,
  viewAppliedJobCountByUser
} = require("../Controllers/JobsManagementController");
const router = express.Router();

// View all Jobs ...
router.get("/", viewJobs);

// View Latest Jobs ...
router.get("/latest", viewLatestJobs);

// View a Job by id ...
router.get("/:jobId", viewJob);

// View jobs applied by a user ...
router.get("/applied/:userId", viewJobsByUser);

// View applied job count by a user ...
router.get("/applied/count/:userId", viewAppliedJobCountByUser);

// Add a New Job
router.post("/addjob", addJob);

// Update a Job
router.put("/update/:jobId", updateJob);

// Delete a Job
router.delete("/delete/:jobId", deleteJob);

module.exports = router;
