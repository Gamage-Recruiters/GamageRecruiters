const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { pool } = require('../config/dbConnection');
const generateNewAccessToken = require('../auth/token/generateNewToken');
const { fetchLoggedUserIdAndMethod } = require('../utils/retrieveLocalStorageData');

dotenv.config();

async function handleAccessToken (req, res) {
    const { userId, token } = req.body;

    if(!token) {
        return res.status(400).send('Token Required');
    }

    try {
        console.log(token);
        // decode the token ...
        decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decodedToken);
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            console.log('Token Expired');
            // generate a new Token to proceed ...
            try {
                const newToken = await generateNewAccessToken(userId, token);
                if(newToken) {
                    return res.status(200).json({ message: 'Token generated successfully', token: newToken });
                } else {
                    return res.status(400).send('Token Creating Error');
                }
            } catch (error) {
                console.log(error);
                return res.status(500).send(error.message);
            }
        } else if (error.name === "JsonWebTokenError") {
            console.log("Invalid Token:", error.message);
            return res.status(400).send("Invalid Token");
        } else {
            console.log(error.message);
            return res.status(500).send(error.message);
        }
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
            const token = session[0].token;
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
                resolve({ user, token });  // Return the fetched user data ...
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

                    const token = session[0].token;
                    // console.log('User Data:', user);
                    resolve({ user, token });  // Return the fetched user data ...
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

module.exports = { getLoggedUserData, getUserLoginAttempts, handleAccessToken };