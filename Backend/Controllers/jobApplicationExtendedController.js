const { pool } = require('../config/dbConnection');
const path = require('path');
const fs = require('fs');
const archiver = require('archiver');

// Get all applications for a specific job
async function getApplicationsByJob(req, res) {
    const { jobId } = req.params;

    if (!jobId) {
        return res.status(400).send('Job ID is required');
    }

    try {
        const applicationsQuery = `
            SELECT ja.*, j.jobName, j.company 
            FROM jobapplications ja
            INNER JOIN jobs j ON ja.jobId = j.jobId
            WHERE ja.jobId = ?
            ORDER BY ja.appliedDate DESC
        `;
        
        pool.query(applicationsQuery, [jobId], (error, result) => {
            if (error) {
                console.log(error);
                return res.status(500).send(error);
            }

            if (result.length === 0) {
                return res.status(200).json({ message: 'No applications found for this job', data: [] });
            }

            return res.status(200).json({ message: 'Applications found', data: result });
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}

// Download a specific resume
async function downloadResume(req, res) {
    const { applicationId } = req.params;

    if (!applicationId) {
        return res.status(400).send('Application ID is required');
    }

    try {
        // Get resume filename from database
        const resumeQuery = 'SELECT resume FROM jobapplications WHERE applicationId = ?';
        pool.query(resumeQuery, [applicationId], (error, result) => {
            if (error) {
                console.log(error);
                return res.status(500).send(error);
            }

            if (result.length === 0) {
                return res.status(404).send('Application not found');
            }

            const resumeFilename = result[0].resume;
            if (!resumeFilename) {
                return res.status(404).send('Resume not found for this application');
            }

            // Define the path to the resume file
            const resumePath = path.join(__dirname, '../uploads/resumes', resumeFilename);

            // Check if file exists
            if (!fs.existsSync(resumePath)) {
                return res.status(404).send('Resume file not found on server');
            }

            // Send the file
            res.download(resumePath, resumeFilename, (err) => {
                if (err) {
                    console.log(err);
                    return res.status(500).send('Error downloading file');
                }
            });
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}

// Download all resumes for a job as a zip file
// Download all resumes for a job as a zip file
async function downloadAllResumes(req, res) {
    const { jobId } = req.params;

    if (!jobId) {
        return res.status(400).send('Job ID is required');
    }

    try {
        // Get job details for naming the zip file
        const jobQuery = 'SELECT jobName FROM jobs WHERE jobId = ?';
        pool.query(jobQuery, [jobId], (jobError, jobResult) => {
            if (jobError || jobResult.length === 0) {
                return res.status(404).send('Job not found');
            }

            const jobName = jobResult[0].jobName;

            // Get all applications for this job
            const applicationsQuery = 'SELECT applicationId, firstName, lastName, resume FROM jobapplications WHERE jobId = ?';
            pool.query(applicationsQuery, [jobId], (error, result) => {
                if (error) {
                    console.log(error);
                    return res.status(500).send(error);
                }

                if (result.length === 0) {
                    return res.status(404).send('No applications found for this job');
                }

                // Filter out applications without resumes or missing files
                const uploadPath = path.join(__dirname, '../uploads/resumes');
                const validFiles = result.filter(app => {
                    const filePath = path.join(uploadPath, app.resume);
                    return app.resume && fs.existsSync(filePath);
                });

                if (validFiles.length === 0) {
                    return res.status(404).send('No valid resume files found');
                }

                // Set zip filename
                const zipName = `${jobName.replace(/\s+/g, '_')}_resumes.zip`;
                res.attachment(zipName);

                const archive = archiver('zip', { zlib: { level: 9 } });
                archive.pipe(res);

                // Add valid files to archive
                validFiles.forEach(app => {
                    const filePath = path.join(uploadPath, app.resume);
                    const fileExt = path.extname(app.resume);
                    const applicantName = `${app.firstName}_${app.lastName}`.replace(/\s+/g, '_');
                    const newFileName = `${applicantName}_resume${fileExt}`;
                    archive.file(filePath, { name: newFileName });
                });

                // Finalize the archive
                archive.finalize().catch(err => {
                    console.log(err);
                    return res.status(500).send('Failed to finalize archive');
                });
            });
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}


// Delete all applications for a job
async function deleteAllApplications(req, res) {
    const { jobId } = req.params;

    if (!jobId) {
        return res.status(400).send('Job ID is required');
    }

    try {
        // First, get all application IDs to find resume files to delete
        const getApplicationsQuery = 'SELECT applicationId, resume FROM jobapplications WHERE jobId = ?';
        pool.query(getApplicationsQuery, [jobId], (error, applications) => {
            if (error) {
                console.log(error);
                return res.status(500).send(error);
            }

            if (applications.length === 0) {
                return res.status(404).send('No applications found for this job');
            }

            // Delete resume files from storage
            const uploadPath = path.join(__dirname, '../uploads/resumes');
            applications.forEach(app => {
                if (app.resume) {
                    const filePath = path.join(uploadPath, app.resume);
                    if (fs.existsSync(filePath)) {
                        try {
                            fs.unlinkSync(filePath);
                        } catch (err) {
                            console.log(`Error deleting file ${app.resume}:`, err);
                            // Continue even if file deletion fails
                        }
                    }
                }
            });

            // Delete all applications from database
            const deleteQuery = 'DELETE FROM jobapplications WHERE jobId = ?';
            pool.query(deleteQuery, [jobId], (deleteError, result) => {
                if (deleteError) {
                    console.log(deleteError);
                    return res.status(500).send(deleteError);
                }

                return res.status(200).json({ 
                    message: `Successfully deleted ${result.affectedRows} applications for this job`,
                    data: result
                });
            });
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}

// Get job statistics - number of applications per job
async function getJobStatistics(req, res) {
    try {
        const statsQuery = `
            SELECT 
                j.jobId,
                j.jobName,
                j.company,
                COUNT(ja.applicationId) as applicationCount,
                MIN(ja.appliedDate) as firstApplication,
                MAX(ja.appliedDate) as lastApplication
            FROM
                jobs j
            LEFT JOIN
                jobapplications ja ON j.jobId = ja.jobId
            GROUP BY
                j.jobId, j.jobName, j.company
            ORDER BY
                applicationCount DESC
        `;
        
        pool.query(statsQuery, (error, result) => {
            if (error) {
                console.log(error);
                return res.status(500).send(error);
            }

            return res.status(200).json({ 
                message: 'Job statistics retrieved successfully', 
                data: result 
            });
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}

module.exports = {
    getApplicationsByJob,
    downloadResume,
    downloadAllResumes,
    deleteAllApplications,
    getJobStatistics
    };


