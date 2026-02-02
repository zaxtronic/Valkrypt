const mysql = require('mysql2/promise');
const config = require('./config');

let pool = null;

const connectDB = async () => {
    try {
        pool = mysql.createPool({
            host: config.db.host,
            user: config.db.user,
            password: config.db.password,
            database: config.db.database,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });

        // Test de conexión simple
        // await pool.query('SELECT 1'); 
        // console.log('✅ Conexión a Base de Datos MySQL establecida.');
        console.log('⚠️  Modo Sin Base de Datos (Simulación JSON activa).');
    } catch (error) {
        console.error('❌ Error conectando a la Base de Datos:', error.message);
        console.log('   (El servidor seguirá funcionando con datos locales JSON)');
    }
};

module.exports = { connectDB, pool };