const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { pool } = require('../config/dbConnection');
const generateNewToken = require('../auth/token/generateNewToken');
const { fetchLoggedUserIdAndMethod } = require('../utils/retrieveLocalStorageData');
const { setLoggedPlatformUserRegisteredId } = require('../utils/setLocalStorageData');
const splitString = require('../utils/splitStrings');

dotenv.config();

// async function getLoggedUserData (req, res) {
//     try {
//         // get the logged user data from session ...
//         const sessionSQL = 'SELECT * FROM sessions ORDER BY createdAt DESC LIMIT 1';
//         const userSQL = 'SELECT * FROM users WHERE userId = ?';
//         pool.query(sessionSQL, (error, result) => {
//             if(error) {
//                 return res.status(404).send('Session Not Found');
//             } 

//             const userId = result[0].Id;

//             pool.query(userSQL, [userId], (error, data) => {
//                 if(error) {
//                     return res.status(404).send('User Not Found');
//                 }
                
//                 return res.status(200).json({ message: 'User Data Retrieved', data: data });
//             });
//         });
//     } catch (error) {
//         console.log(error);
//         return res.status(500).send(error);
//     }
// } 

async function generateNewAccessToken (req, res) {
    const { token } = req.body;

    if(!token) {
        return res.status(400).send('Token is required');
    }

    try {
        const newToken = await generateNewToken(token);
        
        if (!newToken || newToken === 'Invalid Token' || newToken === 'Session Data Not Found') {
            return res.status(401).send('Invalid or Expired Token');
        }

        return res.status(200).json({ message: 'Token generated successfully', token: newToken });
        
        // const response = await generateNewToken(token);
        // console.log(response);

        // if(!response) {
        //     return res.status(401).send('Invalid Token or Expiration Date');
        // }

        // return res.status(200).json({ message: 'Token generated successfully', token: response });

    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}


async function getLoggedUserData (req, res) {

    const arr = fetchLoggedUserIdAndMethod();
    const id = arr[0];
    const loginMethod = arr[1];

    // console.log(loginMethod); 
    if(!id || !loginMethod) {
        return res.status(401).send('User ID and Login Method are required');
    }

    if(loginMethod == 'Email & Password') {
        try {
            const userData = await getLoggedUserDataThroughEmailPassword(id);
            // console.log('User Data Retrieved:', userData);

            return res.status(200).json({ message: 'User Data Retrieved', data: userData });
        } catch (error) {
            // console.error(error);
            return res.status(500).send(error);
        }
    }

    if(loginMethod == 'Google') {
        try {
            const userData = await getLoggedUserDataThroughPlatforms(id, 'Google');
            // console.log('User Data Retrieved:', userData);

            if(!userData) {
                return res.status(404).send('User Not Found');
            }

            return res.status(200).json({ message: 'User Data Retrieved', data: userData });
        } catch (error) {
            console.error(error);
            return res.status(500).send(error);
        }
        // try {
        //     const userData = await getLoggedUserDataThroughGoogle(id);
        //     // console.log('User Data Retrieved:', userData);

        //     const accesstoken = await generateNewTokenForPlatformLogins(userData[0].userId);
        //     // console.log(accesstoken);

        //     return res.status(200).json({ message: 'User Data Retrieved', data: userData, token: accesstoken });
        // } catch (error) {
        //     // console.error(error);
        //     return res.status(404).send(error);
        // }
    }

    if(loginMethod == 'Facebook') {
        try {
            const userData = await getLoggedUserDataThroughPlatforms(id, 'Facebook');
            // console.log('User Data Retrieved:', userData);

            if(!userData) {
                return res.status(404).send('User Not Found');
            }

            return res.status(200).json({ message: 'User Data Retrieved', data: userData });
        } catch (error) {
            console.error(error);
            return res.status(500).send(error);
        }
        // try {
        //     const userData = await getLoggedUserDataThroughFacebook(id);
        //     // console.log('User Data Retrieved:', userData);
        //     const accesstoken = await generateNewTokenForPlatformLogins(userData[0].userId);
        //     // console.log(accesstoken);

        //     return res.status(200).json({ message: 'User Data Retrieved', data: userData, token: accesstoken });
        // } catch (error) {
        //     // console.error(error);
        //     return res.status(404).send(error);
        // }
    }  

    if(loginMethod == 'LinkedIn') {
        try {
            const userData = await getLoggedUserDataThroughPlatforms(id, 'LinkedIn');
            // console.log('User Data Retrieved:', userData);

            if(!userData) {
                return res.status(404).send('User Not Found');
            }

            return res.status(200).json({ message: 'User Data Retrieved', data: userData });
        } catch (error) {
            console.error(error);
            return res.status(500).send(error);
        }
        // try {
        //     const userData = await getLoggedUserDataThroughLinkedIn(id);
        //     // console.log('User Data Retrieved:', userData);

        //     return res.status(200).json({ message: 'User Data Retrieved', data: userData });
        // } catch (error) {
        //     // console.error(error);
        //     return res.status(404).send(error);
        // }
    } 

    return res.status(400).send('An Error Occured. Please Login Again!');
} 

// Functions to retrieve the logged user details according to login ...

async function getLoggedUserDataThroughEmailPassword(id) {
    // console.log('Logged Through Email & Password');

    if(!id) {
        return 'Id error';
    }

    return new Promise((resolve, reject) => {
        // get the logged user data from session ...
        const sessionSQL = 'SELECT * FROM sessions WHERE Id = ? ORDER BY createdAt DESC LIMIT 1';
        const userSQL = 'SELECT * FROM users WHERE userId = ?';
        pool.query(sessionSQL, [id], (error, session) => {
            if(error) {
                // console.log(error);
                return reject('Session Not Found');
            } 

            if (session.length === 0) {
                return reject('Session Not Found');
            }

            // console.log(session);
            const userId = session[0].Id;
            // console.log(userId);

            pool.query(userSQL, [userId], (error, user) => {
                if(error) {
                    // console.log(error);
                    return reject('User Not Found');
                }
                
                if (user.length === 0) {
                    return reject('User Not Found');
                } 

                // console.log('User Data:', user);
                resolve(user);  // Return the fetched user data ...
            });

        });
    });
}

async function getLoggedUserDataThroughPlatforms(id, method) {

    if(!id || !method) {
        return 'error';
    }

    return new Promise((resolve, reject) => {
        // get the logged user data from the database ...
        const platformQuery = 'SELECT * FROM LoginsThroughPlatforms WHERE accountId = ? AND platform = ? ORDER BY loggedAt DESC LIMIT 1';
        pool.query(platformQuery, [id, method], (error, platformLogin) => {
            if(error) {
                return reject('Session Not Found');
            } 

            if (platformLogin.length === 0) {
                return reject('Session Not Found');
            }

            // console.log(platformLogin);
            const loggedUserEmail = platformLogin[0].email;
            
            // Check whether there is existing user related to loggedUserEmail ...
            const userSQL = 'SELECT * FROM users WHERE email = ?';
            pool.query(userSQL, loggedUserEmail, async (error, user) => {
                if(error) {
                    // console.log(error);
                    return reject('User Not Found');
                }
                
                if (user.length === 0) {
                    return reject('User Not Found');
                }

                console.log('User Data:', user);
                // Fetch Data from the session ...
                const userId = user[0].userId;
                const sessionQuery = 'SELECT * FROM sessions WHERE Id = ? ORDER BY createdAt DESC LIMIT 1';
                pool.query(sessionQuery, [userId], (error, session) => {
                    if(error) {
                        // console.log(error);
                        return reject(error);
                    } 

                    if (session.length === 0) {
                        return reject('Session Not Found');
                    }

                    // console.log('User Data:', user);
                    resolve(user);  // Return the fetched user data ...
                });
            });
        });
    });
}

async function getUserLoginAttempts (req, res) {
    const { userId } = req.params;

    if(!userId) {
        return res.status(400).send('userId is Required');
    }

    try {
        const userLoginAttemptsQuery = 'SELECT COUNT(Id) FROM sessions WHERE Id = ?';
        pool.query(userLoginAttemptsQuery, userId, (error, result) => {
            if(error) {
                console.log(error);
                return res.status(400).send(error);
            }

            if(result.length == 0) {
                return res.status(404).send('No Login Attempts Found for user');
            }

            return res.status(200).json({ message: 'Retreived Login Attempts Successfully', data: result[0]["COUNT(Id)"] });
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send(error);
    }
}

// async function getLoggedUserDataThroughGoogle(id) {
//     // console.log('Logged Through Google');

//     if(!id) {
//         return 'Id error';
//     }

//     return new Promise((resolve, reject) => {
//         // get the logged user data from the database ...
//         const platformQuery = 'SELECT * FROM LoginsThroughPlatforms WHERE accountId = ? AND platform = ? ORDER BY loggedAt DESC LIMIT 1';
//         pool.query(platformQuery, [id, 'Google'], (error, platformLogin) => {
//             if(error) {
//                 return reject('Session Not Found');
//             } 

//             if (platformLogin.length === 0) {
//                 return reject('Session Not Found');
//             }

//             // console.log(platformLogin);
//             const loggedUserEmail = platformLogin[0].email;
            
//             // Check whether there is existing user related to loggedUserEmail ...
//             const userSQL = 'SELECT * FROM users WHERE email = ?';
//             pool.query(userSQL, loggedUserEmail, async (error, user) => {
//                 if(error) {
//                     // console.log(error);
//                     return reject('User Not Found');
//                 }
                
//                 if (user.length === 0) {
//                     return reject('User Not Found');
//                 }

//                 console.log('User Data:', user);
//                 // Fetch Data from the session ...
//                 const userId = user[0].userId;
//                 const sessionQuery = 'SELECT * FROM sessions WHERE Id = ? ORDER BY createdAt DESC LIMIT 1';
//                 pool.query(sessionQuery, [userId], (error, session) => {
//                     if(error) {
//                         // console.log(error);
//                         return reject(error);
//                     } 

//                     if (session.length === 0) {
//                         return reject('Session Not Found');
//                     }

//                     // console.log('User Data:', user);
//                     resolve(user);  // Return the fetched user data ...
//                 });
//             });
//         });
//     });
// }

// async function getLoggedUserDataThroughFacebook(id) {
//     // console.log('Logged Through Facebook');
    
//     if(!id) {
//         return 'Id error';
//     }

//     return new Promise((resolve, reject) => {
//         // get the logged user data from the database ...
//         const sessionSQL = 'SELECT * FROM LoginsThroughPlatforms WHERE accountId = ? AND platform = ? ORDER BY loggedAt DESC LIMIT 1';
//         pool.query(sessionSQL, [id, 'Facebook'], (error, session) => {
//             if(error) {
//                 return reject('Session Not Found');
//             } 

//             if (session.length === 0) {
//                 return reject('Session Not Found');
//             }

//             // console.log(session);
//             const loggedUserEmail = session[0].email;
            
//             // Check whether there is existing user related to loggedUserEmail ...
//             const userSQL = 'SELECT * FROM users WHERE email = ?';
//             pool.query(userSQL, loggedUserEmail, async (error, user) => {
//                 if(error) {
//                     // console.log(error);
//                     return reject('User Not Found');
//                 }
                
//                 if (user.length === 0) {
//                     const userName = splitString(session[0].name);
//                     // console.log(userName);
//                     try {
//                         const userData = await addNewUserIfSessionUserNotFound(userName[0], userName[1], loggedUserEmail);
//                         if(!userData) {
//                             return reject('User Not Found');
//                         } 

//                         // console.log('User Data:', userData);
//                         resolve(userData);
//                     } catch (error) {
//                         // console.error("Error creating new user:", error);
//                         return reject(error);
//                     }
//                 }

//                 // console.log('User Data:', user);
//                 resolve(user);  // Return the fetched user data ...
//             });
//         });
//     });
// }

// async function getLoggedUserDataThroughLinkedIn(id) {
//     // console.log('Logged Through LinkedIn');
    
//     if(!id) {
//         return 'Id error';
//     }

//     return new Promise((resolve, reject) => {
//         // get the logged user data from the database ...
//         const sessionSQL = 'SELECT * FROM LoginsThroughPlatforms WHERE accountId = ? AND platform = ? ORDER BY loggedAt DESC LIMIT 1';
//         pool.query(sessionSQL, [id, 'LinkedIn'], (error, session) => {
//             if(error) {
//                 return reject('Session Not Found');
//             } 

//             if (session.length === 0) {
//                 return reject('Session Not Found');
//             }

//             // console.log(session);
//             const loggedUserEmail = session[0].email;
            
//             // Check whether there is existing user related to loggedUserEmail ...
//             const userSQL = 'SELECT * FROM users WHERE email = ?';
//             pool.query(userSQL, loggedUserEmail, async (error, user) => {
//                 if(error) {
//                     // console.log(error);
//                     return reject('User Not Found');
//                 }
                
//                 if (user.length === 0) {
//                     const userName = splitString(session[0].name);
//                     // console.log(userName);
//                     try {
//                         const userData = await addNewUserIfSessionUserNotFound(userName[0], userName[1], loggedUserEmail);
//                         if(!userData) {
//                             return reject('User Not Found');
//                         } 

//                         // console.log('User Data:', userData);
//                         resolve(userData);
//                     } catch (error) {
//                         // console.error("Error creating new user:", error);
//                         return reject(error);
//                     }
//                 }

//                 // console.log('User Data:', user);
//                 resolve(user);  // Return the fetched user data ...
//             });
//         });
//     });
// }

// async function addNewUserIfSessionUserNotFound(firstName, lastName, email) {
//     return new Promise((resolve, reject) => {
//         // Create a new user ...
//         const insertDataQuery = 'INSERT INTO users (firstName, lastName, gender, birthDate, address, address2, phoneNumber1, phoneNumber2, linkedInLink, facebookLink, portfolioLink, email, password, cv, photo, profileDescription, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
//         const values = [firstName, lastName, null, null, null, null, null, null, null, null, null, email, null, null, null, null, new Date()];
//         pool.query(insertDataQuery, values, (error, result) => {
//             if (error) {
//                 // console.log(error);
//                 return reject('Error creating new user');
//             }

//             // console.log('New user created:', result);
//             // console.log(result.insertId);  // Return the new user ID ... 

//             const userQuery = 'SELECT * FROM users WHERE userId = ?';
//                 pool.query(userQuery, result.insertId, (error, result) => {
//                     if(error) {
//                         // console.log(error);
//                         return reject('Error fetching user data');
//                     } 

//                     if(result.length == 0) {
//                         return reject('User Not Found');
//                     }

//                     // console.log('User Data:', result);
//                     return resolve(result[0]);  // Return the fetched user data...
//             });
//         });
//     });
// } 

// async function generateNewTokenForPlatformLogins (id) {
//     // console.log(id);

//     if(!id) {
//         return 'Error Occured. Cannot proceed.';
//     }

//     return new Promise((resolve, reject) => {
//         // Set expiration time manually ...
//         const expTime = Math.floor(Date.now() / 1000) + 60 * 60; // 1 hour ...

//         // generate a new token for the newly created user ...
//         const token = jwt.sign({
//             id: id,
//             exp: expTime
//         }, process.env.JWT_SECRET); 

//         // console.log(token);

//         // Store the logged User Details in the session ...
//         const sessionQuery = 'INSERT INTO sessions (Id, token, createdAt, status, role) VALUES (?, ?, ?, ?, ?)';
//         const values = [id, token, new Date(), 'Active', 'User'];
//         // console.log(values);
//         pool.query(sessionQuery, values, (error, newSession) => {
//             if(error) {
//                 // console.log(error);
//                 reject('Error creating session');
//             }

//             setLoggedPlatformUserRegisteredId(id); 

//             resolve(token);
//         });
//     });
// }

module.exports = { getLoggedUserData, generateNewAccessToken, getUserLoginAttempts };