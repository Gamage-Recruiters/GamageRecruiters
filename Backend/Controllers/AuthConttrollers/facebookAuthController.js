const { createToken } = require('../../auth/token/jwtToken');
const { fetchFrontendApplicationRunningURL } = require('../../utils/retrieveLocalStorageData');

function authorize(req, res) {
    try {
        const token = createToken(req.user);

        // Update the last active timestamp
        const updateQuery = 'UPDATE users SET lastActive = ? WHERE userId = ?';
        const pool = require('../../config/dbConnection').pool;
        pool.query(updateQuery, [new Date(), req.user.userId]);
        
        // Pass a Cookie to frontend ...
        res.cookie('token', token, {
            httpOnly: true,
            sameSite: 'Lax',
            secure: false,
            path: '/',
            maxAge: 100 * 60 * 60, // 1 hour ...
        });
        const frontendURL = fetchFrontendApplicationRunningURL();
        return res.redirect(`${frontendURL}/dashboard`);

    } catch (error) {
        console.log(error)
        return res.status(500).send(error);
    }
}

module.exports = { authorize }