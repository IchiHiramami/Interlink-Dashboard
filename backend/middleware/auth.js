const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'dummykey';

function auth(req, res, next) {
    const header = req.headers['authorization'];
    if (!header) return res.status(401).json({ error: 'No token provided' });

    const token = header.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Malformed token' });

    try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // attach user info
    next();
    } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
    }
}

module.exports = auth;
