const jwt = require("jsonwebtoken");
require('dotenv').config()

function generateAccessToken(email) {
    // expires after half and hour (1800 seconds = 30 minutes)
    return jwt.sign(email,process.env.JWT_SECRET_KEY, { expiresIn: '1800s' });
}

const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader;

        jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }

            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
};

module.exports={
    generateAccessToken,
    authenticateJWT
}