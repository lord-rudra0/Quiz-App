
const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ error: 'Missing Authorization header' });
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'Missing Bearer token' });
        }

        // Verify JWT using Supabase Legacy JWT Secret
        const secret = process.env.SUPABASE_JWT_SECRET;
        if (!secret) {
            console.error('Missing SUPABASE_JWT_SECRET in .env');
            return res.status(500).json({ error: 'Server configuration error' });
        }

        jwt.verify(token, secret, (err, decoded) => {
            if (err) {
                return res.status(403).json({ error: 'Invalid or expired token' });
            }

            // Extract user ID from 'sub' claim
            req.user = {
                id: decoded.sub,
                email: decoded.email,
                role: decoded.role,
                app_metadata: decoded.app_metadata,
                user_metadata: decoded.user_metadata
            };
            next();
        });

    } catch (error) {
        console.error('Auth Middleware Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = authMiddleware;
