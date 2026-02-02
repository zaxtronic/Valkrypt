require('dotenv').config();

module.exports = {
    app: {
        port: process.env.PORT || 3000,
        env: process.env.NODE_ENV || 'development',
        jwtSecret: process.env.JWT_SECRET || 'valkrypt_secret_key_shhh'
    },
    db: {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'valkrypt_db'
    }
};