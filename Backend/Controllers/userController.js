const bcrypt = require('bcryptjs');
const { pool } = require('../config/dbConnection');
const { setTimeStatus } = require('../utils/changeDateFormat');
const subscriptionNotifyEmailSending = require('../middlewares/subscriptionNotifyEmailSending');
const { localStorage } = require('../utils/localStorage');

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
            const updateImageQuery = 'UPDATE users SET photo = ? WHERE userId = ?';
            pool.query(updateImageQuery, [imageName, id], (error, result) => {
                if(error) {
                    return res.status(400).send(error);
                } 

                if(result.affectedRows === 0) {
                    return res.status(400).send('Image Upload Failed');
                }

                const setActivityQuery = 'INSERT INTO activitylogs (userId, activity, completedAt) VALUES (?, ?, ?)';
                pool.query(setActivityQuery, [id, 'Updated User Image', new Date()], (error, log) => {
                    if(error) {
                        return res.status(400).send(error);
                    }

                    if(result.affectedRows === 0) {
                        return res.status(400).send('Log Insertion Failed');
                    }

                    return res.status(200).json({ message: 'Image Uploaded Successfully', data: log, image: imageName });
                });
            });
        } else {
            return res.status(403).send('No image provided');
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
            const updateImageQuery = 'UPDATE users SET cv = ? WHERE userId = ?';
            pool.query(updateImageQuery, [cvName, id], (error, result) => {
                if(error) {
                    return res.status(400).send(error);
                } 

                if(result.affectedRows === 0) {
                    return res.status(400).send('CV Upload Failed');
                }

                const setActivityQuery = 'INSERT INTO activitylogs (userId, activity, completedAt) VALUES (?, ?, ?)';
                pool.query(setActivityQuery, [id, 'Updated User CV', new Date()], (error, log) => {
                    if(error) {
                        return res.status(400).send(error);
                    }

                    if(result.affectedRows === 0) {
                        return res.status(400).send('Log Insertion Failed');
                    }

                    return res.status(200).json({ message: 'CV Uploaded Successfully', data: log, cv: cvName });
                });
            });
        } else {
            return res.status(403).send('No CV provided');
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}

async function updateUserDetails (req, res) {
    const { userId } = req.params;
    const { firstName, lastName, gender, birthDate, address, address2, phoneNumber1, phoneNumber2, photo, cv, linkedInLink, facebookLink, portfolioLink, profileDescription } = req.body; 

    console.log(firstName, lastName, gender, birthDate, address, address2, phoneNumber1, phoneNumber2, photo, cv, linkedInLink, facebookLink, portfolioLink, profileDescription, userId);

    if(!userId || !firstName || !lastName || !gender || !birthDate || !address || !phoneNumber1 || !profileDescription) {
        return res.status(400).send('Error With required fields');
    } 

    try {
        // If existing, access the file names of the cv and image ...
        const cvName = req.files?.cv?.[0]?.filename || null;
        const imageName = req.files?.photo?.[0]?.filename || null;

        console.log('cvName:', cvName);
        console.log('imageName:', imageName); 

        let values;
        let updateQuery;

        if(cvName == null && imageName == null) {
            values = [firstName, lastName, gender, birthDate, address, address2, phoneNumber1, phoneNumber2, linkedInLink, facebookLink, portfolioLink, profileDescription, userId];

            updateQuery = `UPDATE users 
                                    SET firstName = ?, lastName = ?, gender = ?, birthDate = ?, address = ?, address2 = ?, 
                                    phoneNumber1 = ?, phoneNumber2 = ?, linkedInLink = ?, facebookLink = ?, portfolioLink = ?, profileDescription = ?
                                    WHERE userId = ?`;
            
        } else if (cvName == null && imageName != null) {
            values = [firstName, lastName, gender, birthDate, address, address2, phoneNumber1, phoneNumber2, photo, linkedInLink, facebookLink, portfolioLink, profileDescription, userId];

            updateQuery = `UPDATE users 
                                    SET firstName = ?, lastName = ?, gender = ?, birthDate = ?, address = ?, address2 = ?, 
                                    phoneNumber1 = ?, phoneNumber2 = ?, photo = ?, linkedInLink = ?, facebookLink = ?, 
                                    portfolioLink = ?, profileDescription = ? 
                                    WHERE userId = ?`;
            
        } else if (cvName != null && imageName == null) {
            values = [firstName, lastName, gender, birthDate, address, address2, phoneNumber1, phoneNumber2, cv, linkedInLink, facebookLink, portfolioLink, profileDescription, userId];

            updateQuery = `UPDATE users 
                                    SET firstName = ?, lastName = ?, gender = ?, birthDate = ?, address = ?, address2 = ?, 
                                    phoneNumber1 = ?, phoneNumber2 = ?, cv = ?, linkedInLink = ?, facebookLink = ?, 
                                    portfolioLink = ?, profileDescription = ? 
                                    WHERE userId = ?`;
            
        } else {
            values = [firstName, lastName, gender, birthDate, address, address2, phoneNumber1, phoneNumber2, photo, cv, linkedInLink, facebookLink, portfolioLink, profileDescription, userId];

            updateQuery = `UPDATE users 
                                    SET firstName = ?, lastName = ?, gender = ?, birthDate = ?, address = ?, address2 = ?, 
                                    phoneNumber1 = ?, phoneNumber2 = ?, photo = ?, cv = ?, linkedInLink = ?, facebookLink = ?, 
                                    portfolioLink = ?, profileDescription = ?
                                    WHERE userId = ?`;

        }

        pool.query(updateQuery, values, (error, result) => {
            if(error) {
                console.log(error);
                return res.status(400).send('An error occured during update');
            }

            if(result.affectedRows === 0) {
                return res.status(400).send('User Data Update Failed');
            }

            const setActivityQuery = 'INSERT INTO activitylogs (userId, activity, completedAt) VALUES (?, ?, ?)';
            pool.query(setActivityQuery, [userId, 'Updated User Data', new Date()], (error, log) => {
                if(error) {
                    console.log(error);
                    return res.status(400).send('Activity Log Failed');
                }

                if(result.affectedRows === 0) {
                    return res.status(400).send('Log Insertion Failed');
                }

                return res.status(200).json({ message: 'User Data Updated Successfully', data: log });
            });
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}

async function deleteUser (req, res) {
    try {
        const userId = req.params.userId;

        if(!userId) {
            return res.status(400).send('Deletion Failed');
        }

        console.log(userId);

        const removeSessionQuery = 'DELETE FROM sessions WHERE Id = ?';
        pool.query(removeSessionQuery, userId, (error, result) => {
            if(error) {
                console.log(error);
                return res.status(400).send(error);
            } 

            if(result.affectedRows === 0) {
                return res.status(400).send('Deletion Failed');
            }

            const sql = 'DELETE FROM users WHERE userId = ?';
            pool.query(sql, userId, (error, result) => {
                if(error) {
                    console.log(error);
                    return res.status(400).send('Deletion Failed');
                } 

                localStorage.clear();
                return res.status(200).json({ message: 'User Deleted Successfully', data: result });
            });
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
                console.log(error);
                return res.status(404).send('User Not Found');
            }

            // check oldPassword validity ...
            const isValidOldPassword = await bcrypt.compare(oldPassword, result[0].password);
            if(!isValidOldPassword) {
                return res.status(400).send('Old Password is incorrect !');
            }

            const hashedNewPassword = await bcrypt.hash(newPassword, 10);

            // update password in database ...
            const updatePasswordQuery = 'UPDATE users SET password = ? WHERE userId = ?';

            pool.query(updatePasswordQuery, [hashedNewPassword, userId], (error, result) => {
                if(error) {
                    console.log(error);
                    return res.status(400).send(error);
                }

                if(result.affectedRows === 0) {
                    return res.status(400).send('Password Change Failed');
                }

                const setActivityQuery = 'INSERT INTO activitylogs (userId, activity, completedAt) VALUES (?, ?, ?)';
                pool.query(setActivityQuery, [userId, `Changed User Password From ${oldPassword} to ${newPassword}`, new Date()], (error, log) => {
                    if(error) {
                        console.log(error);
                        return res.status(400).send('Activity Log Failed');
                    }

                    if(log.affectedRows === 0) {
                        return res.status(400).send('Log Insertion Failed');
                    }

                    return res.status(200).json({ message: 'Password Changed Successfully', data: log });
                });
            });
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

            if(result.length === 0) {
                return res.status(404).send('No Job Activity Found');
            }

            const gap = result[0].appliedDate ? setTimeStatus(result[0].appliedDate) : null;
            // console.log(gap);
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
            // console.log(lastActiveStatus);
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
        const recentActivityQuery = 'SELECT * FROM activitylogs INNER JOIN users ON activitylogs.userId = users.userId WHERE activitylogs.userId = ? ORDER BY activitylogs.completedAt DESC LIMIT 1';
        pool.query(recentActivityQuery, userId, (error, result) => {
            if(error) {
                console.log(error);
                return res.status(400).send(error);
            }

            if (result.length === 0) {
                return res.status(404).send('No recent activity found for this user');
            } 

            const recentActivity = result[0].activity;
            const completedAt = result[0].completedAt ? setTimeStatus(result[0].completedAt) : null;

            return res.status(200).json({ message: 'Recent Activity Found', recentActivity: recentActivity, timeStatus: completedAt });
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}

async function subscribeToNewsletter(req, res) {
    const { email } = req.body;

    if(!email) {
        return res.status(400).send('Email Required for Subscription');
    }

    try {
        // check the email validity ...
        const checkEmailQuery = 'SELECT * FROM users WHERE email = ?';
        pool.query(checkEmailQuery, email, (error, result) => {
            if(error) {
                console.log(error);
                return res.status(400).send(error);
            }

            if(result.affectedRows === 0) {
                return res.status(400).send('Subscription Failed');
            }

            const updateSubscriptionStatusQuery = 'UPDATE users SET subscribedToNewsLetter = ? WHERE email = ?';
            pool.query(updateSubscriptionStatusQuery, [1, email], (error, state) => {
                if(error) {
                    console.log(error);
                    return res.status(400).send(error);
                }
    
                if(state.affectedRows === 0) {
                    return res.status(400).send('Subscription Failed');
                }

                subscriptionNotifyEmailSending(email);
                return res.status(200).send('Subscription Successfull');
            })
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}


async function getUserById (req, res) {
    const { userId } = req.params;

    if(!userId) {
        return res.status(400).send('User ID is required');
    }

    try {
        const userQuery = 'SELECT * FROM users WHERE userId = ?';
        pool.query(userQuery, userId, (error, result) => {
            if(error) {
                console.log(error);
                return res.status(400).send(error);
            }

            if(result.length === 0) {
                return res.status(404).send('User Not Found');
            }

            return res.status(200).json({ message: 'User Found', user: result[0] });
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}

async function getAllSystemUsersCount (req, res) {
    try {
        const usersCountQuery = 'SELECT COUNT(userId) FROM users';
        pool.query(usersCountQuery, (error, result) => {
           if(error) {
               console.log(error);
               return res.status(400).send(error);
           }

           if(result.length === 0) {
               return res.status(404).send('No Users Found');
           }

           return res.status(200).json({ message: 'Users Found', users: result[0] });
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}

async function getAllActiveUsersCount (req, res) {
    try {
        const ActiveUsersCountQuery = 'SELECT COUNT(DISTINCT  sessions.Id) FROM sessions INNER JOIN users ON sessions.Id = users.userId WHERE sessions.status = ?';
        pool.query(ActiveUsersCountQuery, 'Active', (error, data) => {
           if(error) {
               console.log(error);
               return res.status(400).send(error);
           }

           if(data.length === 0) {
               return res.status(404).send('No Active Users Found');
           }

           return res.status(200).json({ message: 'Active Users Found', activeUsers: data[0] });
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}

async function getAllUsersCountInCurrentMonth (req, res) {
    try {
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1;
        const ActiveUsersCountInThisMonthQuery = 'SELECT COUNT(DISTINCT  sessions.Id) FROM sessions INNER JOIN users ON sessions.Id = users.userId WHERE sessions.status = ? AND MONTH(users.createdAt) = ?';
        pool.query(ActiveUsersCountInThisMonthQuery, ['Active', currentMonth], (error, result) => {
            if(error) {
                console.log(error);
                return res.status(400).send(error);
            }

            if(result.length === 0) {
                return res.status(404).send('No Active Users Found');
            }

            return res.status(200).json({ message: 'Monthly Active Users Found', activeUsersCount: result[0]['COUNT(DISTINCT  sessions.Id)'] });
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}

async function getAllClientUsers(req, res) {
    try {
        const query = 'SELECT * FROM users ';
        pool.query(query, (error, results) => {
            if (error) {
                console.error('Error fetching client users:', error);
                return res.status(500).send('Failed to fetch client users');
            }

            if (results.length === 0) {
                return res.status(404).send('No client users found');
            }

            return res.status(200).json({ message: 'Client users fetched successfully', data: results });
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal Server Error');
    }
}


async function getAllUserDetails(req, res) {
    const { userId } = req.params;

    if (!userId) {
        return res.status(400).send('User ID is required');
    }

    try {
        const query = 'SELECT * FROM users WHERE userId = ?';
        pool.query(query, [userId], (error, results) => {
            if (error) {
                console.log(error);
                return res.status(500).send('Database query failed');
            }

            if (results.length === 0) {
                return res.status(404).send('User not found');
            }

            return res.status(200).json({ message: 'User details retrieved successfully', user: results[0] });
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send('Server error');
    }
}


module.exports = { deleteUser,getAllClientUsers, getAllUserDetails, changePassword, updateUserDetails, uploadUserImage, uploadUserCV, getUserRecentJobActivity, getLastActiveStatus, getRecentProfileActivity, subscribeToNewsletter, getAllSystemUsersCount, getAllActiveUsersCount, getAllUsersCountInCurrentMonth, getUserById }