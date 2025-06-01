const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const { pool } = require('../config/dbConnection');


passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK_URL,
    profileFields: ['id', 'displayName', 'emails', 'photos']

}, async (accessToken, refreshToken, profile, done) => {
    try {

        const facebookId = profile.id;
        const firstName = profile.name?.givenName || profile.displayName;
        const lastName = profile.name?.familyName || null;

        const email = profile.emails?.[0]?.value || null;
        const photo = profile.photos?.[0]?.value || null;

        // Check if user exists in DB
        const [existingUser] = await pool.promise().query(
            'SELECT * FROM users WHERE facebookId = ?', [facebookId]
        );

        if (existingUser.length > 0) {
            return done(null, existingUser[0]);
        }

        // Insert new user
        const [result] = await pool.promise().query(
            'INSERT INTO users (firstName,lastName, email, photo, facebookId, createdAt) VALUES (?,?, ?, ?, ?, ?)',
            [firstName,lastName, email, photo, facebookId, new Date()]
        );

        const [newUser] = await pool.promise().query(
            'SELECT * FROM users WHERE facebookId = ?', [facebookId]
        );

        return done(null, newUser[0]);
    } catch (err) {
        console.error("Facebook Strategy Error:", err);
        return done(err, null);
    }
}));