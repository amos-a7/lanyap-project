const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    let token = req.headers.authorization;
    
    if (!token || !token.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
    }

    try {
        token = token.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ success: false, message: 'Invalid or expired token.' });
    }
};

const optionalAuth = (req, res, next) => {
    let token = req.headers.authorization;
    if (token && token.startsWith('Bearer ')) {
        try {
            token = token.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
        } catch (err) {
            // ignore invalid token in optional auth
        }
    }
    next();
};

const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ success: false, message: 'Forbidden: Admin access required.' });
    }
};

module.exports = { verifyToken, optionalAuth, isAdmin };
