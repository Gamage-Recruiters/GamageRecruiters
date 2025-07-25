const passport = require('passport');
const { pool } = require('../config/dbConnection');

const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    passReqToCallback: true
},
    async function (request, accessToken, refreshToken, profile, done) {
        try {
            const googleId = profile.id;
            const firstName = profile.name.givenName;
            const lastName = profile.name.familyName || null;
            const email = profile.emails[0].value;
            const photo = profile.photos[0]?.value || null;

            //***************************** Database Handling ***********************************************************

            // Check if user already exists in MySQL by Google ID
            const [existingUser] = await pool.promise().query('SELECT * FROM users WHERE googleId = ?', [googleId]);

            if (existingUser.length > 0) {

                // console.log("user Exist",existingUser[0] );
                return done(null, existingUser[0]); // User exists

            } else {

                // adding new user with Google info

                const [result] = await pool.promise().query(
                    'INSERT INTO users (firstName,lastName, email, photo, googleId, createdAt) VALUES (?,?, ?, ?, ?, ?)',
                    [firstName, lastName, email, photo, googleId, new Date()]
                );

                // Fetch the newly added user
                const [User] = await pool.promise().query('SELECT * FROM users WHERE googleId = ?', [googleId]);
                //    console.log(User[0]);

                return done(null, User[0]);
            }

        } catch (err) {
            console.error("Error in Google OAuth:", err);
            return done(err, null);
        }
    }));
