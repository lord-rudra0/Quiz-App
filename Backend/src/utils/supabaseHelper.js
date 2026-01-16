const { createClient } = require('@supabase/supabase-js');

const createAuthClient = (req) => {
    return createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_ANON_KEY,
        {
            global: {
                headers: {
                    Authorization: req.headers.authorization,
                },
            },
        }
    );
};

module.exports = { createAuthClient };
