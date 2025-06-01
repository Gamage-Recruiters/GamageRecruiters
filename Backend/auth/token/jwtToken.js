const jwt = require('jsonwebtoken');


function createToken(userData) {

    // console.log("this is payload " , userData)


    const expTime = Math.floor(Date.now() / 1000) + 60 * 60; // 1 hour ...

    try {


        // generate a new token ...
        const newToken = jwt.sign({
            id: userData.userId,
            exp: expTime,
            name: userData.firstName || ' no name',
            email: userData.email || 'no email'
        }, process.env.JWT_SECRET);

        return newToken;

    } catch (error) {
        console.log(error)

    }

}


function verifyToken(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: 'Access Denied. No Token found' });
    }


    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // add decoded user data from token to request
        req.user = decoded;

        next();

    } catch (error) {
        return res.status(403).json({ message: 'Invalid or expired token' });
    }

}

module.exports = { createToken, verifyToken };
