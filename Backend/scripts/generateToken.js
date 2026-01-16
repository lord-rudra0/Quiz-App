
const jwt = require('jsonwebtoken');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const secret = process.env.SUPABASE_JWT_SECRET;

if (!secret) {
    console.error('Error: SUPABASE_JWT_SECRET not found in .env');
    console.log('Available keys:', Object.keys(process.env).filter(k => k.startsWith('SUPABASE')));
    process.exit(1);
}

const token = jwt.sign({
    sub: 'test-user-id-' + Date.now(),
    role: 'authenticated',
    email: 'test@example.com',
    app_metadata: { provider: 'email' },
    user_metadata: { full_name: 'Test User' }
}, secret, { expiresIn: '1h' });

console.log(token);
