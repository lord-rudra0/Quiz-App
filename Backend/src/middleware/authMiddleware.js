
const supabase = require('../config/supabaseClient');
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

        // Verify with Supabase Auth
        // This handles both HS256 and ES256 tokens automatically
        const { data: { user }, error } = await supabase.auth.getUser(token);

        if (error || !user) {
            console.error('Supabase Auth Error:', error?.message);
            return res.status(403).json({ error: 'Invalid or expired token' });
        }

        // Attach user to request
        req.user = user;
        next();

    } catch (error) {
        console.error('Auth Middleware Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = authMiddleware;
