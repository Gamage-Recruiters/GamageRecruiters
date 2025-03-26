const { pool } = require('../config/dbConnection');

async function getLoggedUserData (req, res) {
    try {
        // get the logged user data from session ...
        const sessionSQL = 'SELECT * FROM sessions ORDER BY createdAt DESC LIMIT 1';
        const userSQL = 'SELECT * FROM users WHERE userId = ?';
        pool.query(sessionSQL, (error, result) => {
            if(error) {
                return res.status(404).send('Session Not Found');
            } 

            const userId = result[0].Id;

            pool.query(userSQL, [userId], (error, data) => {
                if(error) {
                    return res.status(404).send('User Not Found');
                }
                
                return res.status(200).json({ message: 'User Data Retrieved', data: data });
            });
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
} 

module.exports = { getLoggedUserData };