const bcrypt = require('bcryptjs');
const { pool } = require('../config/dbConnection');
const { setTimeStatus } = require('../utils/changeDateFormat');

async function uploadUserImage (req, res) {
    console.log(req.body);
    const { id } = req.body;
    
    console.log(id);

    if(!id) {
        return res.status(400).send('Image Upload Failed');
    }

    try {
        const imageName = req.files?.photo?.[0]?.filename || null;
        console.log(imageName);

        if(imageName) {
            const updateImageQuery = 'UPDATE users SET photo = ?, recentActivity = ?, updatedAt = ? WHERE userId = ?';
            pool.query(updateImageQuery, [imageName, 'Updated User Profile Image', new Date(), id], (error, result) => {
                if(error) {
                    return res.status(400).send('Image Upload Failed');
                } 

                return res.status(200).json({ message: 'Image Uploaded Successfully', data: result, image: imageName });
            });
        } else {
            return res.status(400).send('No image provided');
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}

async function uploadUserCV (req, res) {
    console.log(req.body);
    const { id } = req.body;
    console.log(id);
    if(!id) {
        return res.status(400).send('Image Upload Failed');
    }

    try {
        const cvName = req.files?.cv?.[0]?.filename || null;
        console.log(cvName);

        if(cvName) {
            const updateImageQuery = 'UPDATE users SET cv = ?, recentActivity = ?, updatedAt = ? WHERE userId = ?';
            pool.query(updateImageQuery, [cvName, 'Updated User CV', new Date(), id], (error, result) => {
                if(error) {
                    return res.status(400).send('Image Upload Failed');
                } 

                return res.status(200).json({ message: 'Image Uploaded Successfully', data: result, cv: cvName });
            });
        } else {
            return res.status(400).send('No CV provided');
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}

async function updateUserDetails (req, res) {
    const { userId, firstName, lastName, gender, birthDate, address, address2, phoneNumber1, phoneNumber2, photo, cv, linkedInLink, facebookLink, portfolioLink, profileDescription } = req.body; 

    if(!userId || !firstName || !lastName || !gender || !birthDate || !address || !phoneNumber1 || !cv || !profileDescription) {
        return res.status(400).send('Error With required fields');
    } 

    try {
        // If existing, access the file names of the cv and image ...
        const cvName = req.files?.cv?.[0]?.filename || null;
        const imageName = req.files?.photo?.[0]?.filename || null;

        console.log('cvName:', cvName);
        console.log('imageName:', imageName); 

        if(cvName == null && imageName == null) {
            const values = [firstName, lastName, gender, birthDate, address, address2, phoneNumber1, phoneNumber2, linkedInLink, facebookLink, portfolioLink, profileDescription, 'Updated User Profile Details', new Date(), userId];

            const updateQuery = `UPDATE users 
                                    SET firstName = ?, lastName = ?, gender = ?, birthDate = ?, address = ?, address2 = ?, 
                                    phoneNumber1 = ?, phoneNumber2 = ?, linkedInLink = ?, facebookLink = ?, 
                                    portfolioLink = ?, profileDescription = ?, recentActivity = ?, updatedAt = ? 
                                    WHERE userId = ?`;
            pool.query(updateQuery, values, (error, result) => {
                if(error) {
                    console.log(error);
                    return res.status(400).send('An error occured during update');
                }

                return res.status(200).json({ message: 'User Data Updated Successfully', data: result });
            });
        } else if (cvName == null && imageName != null) {
            const values = [firstName, lastName, gender, birthDate, address, address2, phoneNumber1, phoneNumber2, photo, linkedInLink, facebookLink, portfolioLink, profileDescription, 'Updated User Profile Details', new Date(), userId];

            const updateQuery = `UPDATE users 
                                    SET firstName = ?, lastName = ?, gender = ?, birthDate = ?, address = ?, address2 = ?, 
                                    phoneNumber1 = ?, phoneNumber2 = ?, photo = ?, linkedInLink = ?, facebookLink = ?, 
                                    portfolioLink = ?, profileDescription = ?, recentActivity = ?, updatedAt = ? 
                                    WHERE userId = ?`;
            pool.query(updateQuery, values, (error, result) => {
                if(error) {
                    console.log(error);
                    return res.status(400).send('An error occured during update');
                }

                return res.status(200).json({ message: 'User Data Updated Successfully', data: result });
            });
        } else if (cvName != null && imageName == null) {
            const values = [firstName, lastName, gender, birthDate, address, address2, phoneNumber1, phoneNumber2, cv, linkedInLink, facebookLink, portfolioLink, profileDescription, 'Updated User Profile Details', new Date(), userId];

            const updateQuery = `UPDATE users 
                                    SET firstName = ?, lastName = ?, gender = ?, birthDate = ?, address = ?, address2 = ?, 
                                    phoneNumber1 = ?, phoneNumber2 = ?, cv = ?, linkedInLink = ?, facebookLink = ?, 
                                    portfolioLink = ?, profileDescription = ?, recentActivity = ?, updatedAt = ? 
                                    WHERE userId = ?`;
            pool.query(updateQuery, values, (error, result) => {
                if(error) {
                    console.log(error);
                    return res.status(400).send('An error occured during update');
                }

                return res.status(200).json({ message: 'User Data Updated Successfully', data: result });
            });
        } else {
            const values = [firstName, lastName, gender, birthDate, address, address2, phoneNumber1, phoneNumber2, photo, cv, linkedInLink, facebookLink, portfolioLink, profileDescription, 'Updated User Profile Details', new Date(), userId];

            const updateQuery = `UPDATE users 
                                    SET firstName = ?, lastName = ?, gender = ?, birthDate = ?, address = ?, address2 = ?, 
                                    phoneNumber1 = ?, phoneNumber2 = ?, photo = ?, cv = ?, linkedInLink = ?, facebookLink = ?, 
                                    portfolioLink = ?, profileDescription = ?, recentActivity = ?, updatedAt = ? 
                                    WHERE userId = ?`;
            pool.query(updateQuery, values, (error, result) => {
                if(error) {
                    console.log(error);
                    return res.status(400).send('An error occured during update');
                }

                return res.status(200).json({ message: 'User Data Updated Successfully', data: result });
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}

async function deleteUser (req, res) {
    try {
        const id = req.params.id;

        if(!id) {
            return res.status(400).send('Deletion Failed');
        }

        const sql = 'DELETE FROM users WHERE userId = ?';
        pool.query(sql, [id], (error, result) => {
            if(error) {
                return res.status(400).send('Deletion Failed');
            } 

            return res.status(200).json({ message: 'User Deleted Successfully', data: result });
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}

async function changePassword (req, res) {
    const { oldPassword, newPassword, userId } = req.body;

    if(!oldPassword || !newPassword) {
        return res.status(400).send('Both Old and New Passwords required to proceed');
    }
    
    try {
        // get the user details related to userId ...
        const userDataQuery = 'SELECT * FROM users WHERE userId = ?';
        pool.query(userDataQuery, [userId], async (error, result) => {
            if(error) {
                return res.status(404).send('User Not Found');
            }

            // check oldPassword validity ...
            const isValidOldPassword = await bcrypt.compare(oldPassword, result[0].password);

            if(!isValidOldPassword) {
                return res.status(400).send('Old Password is incorrect !');
            }

            const hashedNewPassword = await bcrypt.hash(newPassword, 10);

            // update password in database ...
            const updatePasswordQuery = 'UPDATE users SET password = ?, recentActivity = ?, updatedAt = ? WHERE userId = ?';

            pool.query(updatePasswordQuery, [hashedNewPassword, 'Changed User Password', new Date(), userId], (error, result) => {
                if(error) {
                    return res.status(400).send('Password Change Failed');
                }

                return res.status(200).json({ message: 'Password Changed Successfully', data: result });
            })
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}

async function getUserRecentJobActivity (req, res) {
    const { userId } = req.params;

    if(!userId) {
        return res.status(400).send('userId Required');
    }

    try {
        const jobActivityQuery = 'SELECT * FROM jobapplications INNER JOIN jobs INNER JOIN users ON jobapplications.jobId = jobs.jobId AND jobapplications.userId = users.userId WHERE jobapplications.userId = ? ORDER BY appliedDate DESC LIMIT 1';
        pool.query(jobActivityQuery, userId, (error, result) => {
            if(error) {
                console.log(error);
                return res.status(400).send(error);
            }

            if(result.length == 0) {
                return res.status(404).send('No Job Activity Found');
            }

            const gap = result[0].appliedDate ? setTimeStatus(result[0].appliedDate) : null;
            console.log(gap);
            return res.status(200).json({ message: 'Job Activity Found', jobStatus: gap, data: result });
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
} 

async function getLastActiveStatus (req, res) {
    const { userId } = req.params;

    if(!userId) {
        return res.status(400).send('userId Required');
    }

    try {
        const jobActivityQuery = 'SELECT createdAt FROM sessions WHERE Id = ? ORDER BY createdAt DESC LIMIT 1 OFFSET 1';
        pool.query(jobActivityQuery, userId, (error, result) => {
            if(error) {
                console.log(error);
                return res.status(400).send(error);
            }

            if (result.length === 0) {
                return res.status(404).send('No active status found for this user');
            }

            const lastActiveStatus = setTimeStatus(result[0].createdAt);
            console.log(lastActiveStatus);
            return res.status(200).json({ message: 'Last Active Status Found', jobStatus: lastActiveStatus });
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}

async function getRecentProfileActivity(req, res) {
    const { userId } = req.params;

    if(!userId) {
        return res.status(400).send('userId Required');
    }

    try {
        const recentActivityQuery = 'SELECT recentActivity, updatedAt FROM users WHERE userId = ?';
        pool.query(recentActivityQuery, userId, (error, result) => {
            if(error) {
                console.log(error);
                return res.status(400).send(error);
            }

            if (result.length === 0) {
                return res.status(404).send('No recent activity found for this user');
            } 

            const recentActivity = result[0].recentActivity;
            const updatedAt = result[0].updatedAt ? setTimeStatus(result[0].updatedAt) : null;

            return res.status(200).json({ message: 'Recent Activity Found', recentActivity: recentActivity, timeStatus: updatedAt });
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}

module.exports = { deleteUser, changePassword, updateUserDetails, uploadUserImage, uploadUserCV, getUserRecentJobActivity, getLastActiveStatus, getRecentProfileActivity }