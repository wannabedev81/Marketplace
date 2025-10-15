const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/env');

function authenticateToken(req, res, next) {
    const token = req.cookies?.token;
    if (!token) return res.status(401).json({ message: 'Access denied' });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next ();
    } catch (err) {
        res.status(401).json({ message: 'Invalid token'});
    }
}

module.exports = authenticateToken;