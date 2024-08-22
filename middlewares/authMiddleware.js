const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    // Extract token from various sources
    const authHeader = req.headers['authorization'];
    const tokenFromHeader = authHeader && authHeader.split(' ')[1];
    const tokenFromCookie = req.cookies.token;
    const tokenFromBody = req.body.token;
    const tokenFromQuery = req.query.token;

    // Prefer token from header; fallback to token from cookie, body, or query
    const token = tokenFromHeader || tokenFromCookie || tokenFromBody || tokenFromQuery;

    // console.log("Token from header:", tokenFromHeader);
    // console.log("Token from cookie:", tokenFromCookie);
    // console.log("Token from body:", tokenFromBody);
    // console.log("Token from query:", tokenFromQuery);

    if (!token) {
        return res.status(403).json({
            success: false,
            msg: "Access denied. Token not provided."
        });
    }

    try {
        // Verify the token using the secret key from environment variables
        const decodedData = jwt.verify(token, process.env.ACCESS_SECRET_TOKEN);
        req.user = decodedData; // Store the decoded token data in request object
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            msg: 'Invalid token. Please provide a valid token for authentication.'
        });
    }
};

module.exports = verifyToken;
