const jwt = require('jsonwebtoken');

const checkAuth = (req, res) => {
    const token = req.cookies.token; // Token stored in cookies

    if (!token) {
        return res.status(401).json({ authenticated: false });
    }

    try {
        const decodedData = jwt.verify(token, process.env.ACCESS_SECRET_TOKEN);
        req.user = decodedData.user;
        res.status(200).json({ authenticated: true });
    } catch (error) {
        res.status(401).json({ authenticated: false });
    }
};

module.exports = checkAuth;
