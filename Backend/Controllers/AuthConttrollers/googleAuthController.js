const { createToken } = require('../../auth/token/jwtToken');
const { fetchFrontendApplicationRunningURL } = require('../../utils/retrieveLocalStorageData');

function authorize(req, res) {
    try {
        const token = createToken(req.user);

        // Update the last active timestamp
        const pool = require('../../config/dbConnection').pool;

        // Check if Google profile has a photo
        if (req.user._json && req.user._json.picture) {
            const updateQuery = 'UPDATE users SET lastActive = ?, photo = ? WHERE userId = ?';
            pool.query(updateQuery, [new Date(), req.user._json.picture, req.user.userId], (err) => {
                if (err) {
                    console.error('Error updating user profile with Google image:', err);
                }
            });
        } else {
            // Just update lastActive if no photo
            const updateQuery = 'UPDATE users SET lastActive = ? WHERE userId = ?';
            pool.query(updateQuery, [new Date(), req.user.userId]);
        }

        // Pass a Cookie to frontend ...
        res.cookie('token', token, {
            httpOnly: true,
            sameSite: 'Lax',
            secure: false,
            path: '/',
            maxAge: 1000 * 60 * 60, // 1 hour ...
        });
        const frontendURL = fetchFrontendApplicationRunningURL();
        return res.redirect(`${frontendURL}/dashboard`);

    } catch (error) {
        console.log(error)
        return res.status(500).send(error);
    }
}

module.exports = { authorize }