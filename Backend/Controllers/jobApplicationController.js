const { pool } = require('../config/dbConnection');
const path = require('path');

// Apply for a job (with resume file upload)
async function applyJob(req, res) {
    console.log(req.body);

    const { firstName, lastName, email, phoneNumber, job, company } = req.body;

    if( !firstName || !lastName || !email || !phoneNumber || !job || !company ) {
        return res.status(400).send('Please fill all the required fields');
    }

    const resumeLink = req.file?.path ? req.file.path : null;
    const resumeName = req.file?.filename ? req.file.filename : null;

    console.log(resumeLink);
    console.log(resumeName);

    if(!resumeLink || !resumeName) {
        console.log('Resume Error');
        return res.status(400).send('Resume file selection is required.');
    }

    try {
        // Check whether the job exists ...
        const jobApplicationQuery = 'SELECT * FROM jobs WHERE jobName = ? AND company = ?';
        pool.query(jobApplicationQuery, [job, company], (error, result) => {
            if(error) {
                console.log(error);
                return res.status(400).send(error);
            }

            if (result.length === 0) {
                return res.status(404).send('No job applications found for the specified job and company.');
            } 

            // console.log(result);
            // Add the application details to database ...
            const jobId = result[0].jobId;
            // console.log(jobId);
            // check if the user exists ...
            const userQuery = 'SELECT * FROM users WHERE email = ?';
            pool.query(userQuery, email, (error, result) => {
                if (error) {
                    console.log(error);
                    return res.status(400).send(error);
                }

                if(result.length === 0) {
                    return res.status(401).send('User Not Found. You must login first.');
                } 

                if(result[0].firstName != firstName && result[0].lastName != lastName) {
                    return res.status(400).send('Names are not matching. Cannot proceed');
                }

                // User exists, proceed to insert the application ...
                const userId = result[0].userId;
                const insertDataQuery = 'INSERT INTO jobapplications (firstName, lastName, email, phoneNumber, resume, appliedDate, jobId, userId) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
                pool.query(insertDataQuery, [firstName, lastName, email, phoneNumber, resumeName, new Date(), jobId, userId], (error, result) => {
                    if (error) {
                        console.log(error);
                        return res.status(500).send(error);
                    }

                    console.log(result);
                    return res.status(200).json({ message: 'Job application submitted successfully!', data: result });
                });
            });
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}

// async function applyJob(req, res) {
//     const { userId, jobId, coverLetter } = req.body;

//     // Check if required fields are provided
//     if (!userId || !jobId || !coverLetter || !req.file) {
//         return res.status(400).json({ message: 'User ID, Job ID, Cover Letter, and Resume are required.' });
//     }

//     const resumeLink = req.file.path; // The file path of the uploaded resume

//     try {
//         // Check if the user already has an application for the same job
//         const [existingApplication] = await pool.promise().query(
//             'SELECT * FROM jobapplications WHERE userId = ? AND jobId = ?',
//             [userId, jobId]
//         );

//         if (existingApplication.length > 0) {
//             // If an existing application is found, update the resume
//             await pool.promise().query(
//                 'UPDATE jobapplications SET resumeLink = ?, coverLetter = ?, status = ? WHERE userId = ? AND jobId = ?',
//                 [resumeLink, coverLetter, 'Pending', userId, jobId]
//             );
//             return res.status(200).json({ message: 'Job application updated successfully!' });
//         } else {
//             // If no existing application, insert a new job application
//             await pool.promise().query(
//                 'INSERT INTO jobapplications (userId, jobId, resumeLink, coverLetter, status) VALUES (?, ?, ?, ?, ?)',
//                 [userId, jobId, resumeLink, coverLetter, 'Pending']
//             );
//             return res.status(201).json({ message: 'Job application submitted successfully!' });
//         }
//     } catch (error) {
//         return res.status(500).json({ message: 'Error submitting or updating job application.', error: error.message });
//     }
// }

// Get application by id ...
async function getApplication(req, res) {
    const { applicationId } = req.params; // If id is provided, get specific application 

    if (!applicationId) {
        return res.status(400).send('Application Id is required');
    }

    try {
        const applicationDataQuery = 'SELECT * FROM jobapplications INNER JOIN jobs ON jobapplications.jobId = jobs.jobId WHERE jobapplications.applicationId = ?';
        pool.query(applicationDataQuery, applicationId, (error, result) => {
            if(error) {
                console.log(error);
                return res.status(400).send(error);
            }

            if(result.length == 0) {
                return res.status(404).send('Job Application Not found');
            }

            return res.status(200).json({ message: 'Application Data Found', data: result });
        });
        // if (id) {
        //     const [results] = await pool.promise().query('SELECT * FROM jobapplications WHERE id = ?', [id]);

        //     if (results.length === 0) {
        //         return res.status(404).json({ message: 'Job application not found.' });
        //     }

        //     return res.status(200).json({ application: results[0] });
        // } else {
        //     const [results] = await pool.promise().query('SELECT * FROM jobapplications');
        //     if (results.length === 0) {
        //         return res.status(404).json({ message: 'No job applications found.' });
        //     }

        //     return res.status(200).json({ applications: results });
        // }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error retrieving job applications.', error: error.message });
    }
} 

// Get all applications releted to a specific user ...
async function getApplicationByUser (req, res) {
    const { userId } = req.params; // If id is provided, get specific application 

    if (!userId) {
        return res.status(400).send('Application Id is required');
    }

    try {
        const applicationDataQuery = 'SELECT * FROM jobapplications INNER JOIN jobs ON jobapplications.jobId = jobs.jobId WHERE jobapplications.userId = ?';
        pool.query(applicationDataQuery, userId, (error, result) => {
            if(error) {
                console.log(error);
                return res.status(400).send(error);
            }

            if(result.length == 0) {
                return res.status(404).send('Job Application Not found');
            }

            return res.status(200).json({ message: 'Application Data Found', data: result });
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error retrieving job applications.', error: error.message });
    }
}

// Get all applications ...
async function getApplications (req, res) {

    try {
        const applicationDataQuery = 'SELECT * FROM jobapplications';
        pool.query(applicationDataQuery, (error, result) => {
            if(error) {
                console.log(error);
                return res.status(400).send(error);
            }

            if(result.length == 0) {
                return res.status(404).send('Job Applications Not found');
            }

            return res.status(200).json({ message: 'Application Data Found', data: result });
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error retrieving job applications.', error: error.message });
    }
}

// Delete a job application
async function updateApplication(req, res) {
    const { applicationId } = req.params;

    if(!applicationId) {
        return res.status(400).send('Application ID is Required');
    }

    const { firstName, lastName, email, phoneNumber } = req.body;

    if(!firstName || !lastName || !email || !phoneNumber) {
        return res.status(400).send('firstName, lastName, email, phoneNumber are Required');
    }

    try {
        const resumeLink = req.file?.path ? req.file.path : null;
        const resumeName = req.file?.filename ? req.file.filename : null;

        console.log(resumeLink);
        console.log(resumeName);

        let updateApplicationQuery;
        let values;

        if(resumeName && resumeLink) {
            updateApplicationQuery = 'UPDATE jobapplications SET firstName = ?, lastName = ?, email = ?, phoneNumber = ?, resume = ? WHERE applicationId = ?';
            values = [firstName, lastName, email, phoneNumber, resumeName, applicationId];
        } else {
            updateApplicationQuery = 'UPDATE jobapplications SET firstName = ?, lastName = ?, email = ?, phoneNumber = ? WHERE applicationId = ?';
            values = [firstName, lastName, email, phoneNumber, applicationId];
        }

        pool.query(updateApplicationQuery, values, (error, result) => {
            if(error) {
                console.log(error);
                return res.status(400).send(error);
            }

            if(result.affectedRows == 0) {
                return res.status(404).send('Job Application Not Found');
            }

            return res.status(200).json({ message: 'Job Application Updated Successfully', data: result });
        });

    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}

async function deleteApplication(req, res) {
    const { applicationId } = req.params;

    if(!applicationId) {
        return res.status(400).send('Application ID is Required');
    }

    try {
        const deleteApplicationQuery = 'DELETE FROM jobapplications WHERE applicationId = ?';
        pool.query(deleteApplicationQuery, applicationId, (error, result) => {
            if(error) {
                console.log(error);
                return res.status(400).send(error);
            }

            if(result.affectedRows == 0) {
                return res.status(404).send('Job Application Not Found');
            }

            return res.status(200).json({ message: 'Job Application Deleted Successfully', data: result });
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}

// async function deleteApplication(req, res) {
//     const { id } = req.params;

//     try {
//         const [results] = await pool.promise().query('SELECT * FROM jobapplications WHERE id = ?', [id]);

//         if (results.length === 0) {
//             return res.status(404).json({ message: 'Job application not found.' });
//         }

//         await pool.promise().query('DELETE FROM jobapplications WHERE id = ?', [id]);
//         return res.status(200).json({ message: 'Job application deleted successfully.' });
//     } catch (error) {
//         return res.status(500).json({ message: 'Error deleting job application.', error: error.message });
//     }
// }

module.exports = { applyJob, getApplication, getApplicationByUser, getApplications, updateApplication, deleteApplication };
