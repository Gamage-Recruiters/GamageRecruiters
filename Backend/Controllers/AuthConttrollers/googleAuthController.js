const { createToken } = require('../../auth/token/jwtToken');


function authorize(req, res) {
    try {
        const token = createToken(req.user);
        // Pass a Cookie to frontend ...
        return res.cookie('token', token, {
            httpOnly: true,
            sameSite: 'Lax',
            secure: false,
            maxAge: 100 * 60 * 60, // 1 hour ...
        }).status(200).json({ message: "user Logged Successfuly, Please Redirect. " });

    } catch (error) {
        console.log(error)
        return res.status(500).send(error);
    }
}

module.exports = { authorize }