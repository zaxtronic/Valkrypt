// backend/config/db.js
const { MongoClient } = require('mongodb');
require('dotenv').config();

let dbConnection;

const connectDB = async () => {
    try {
        const client = new MongoClient(process.env.MONGO_URI);
        await client.connect();
        dbConnection = client.db(process.env.DB_NAME);
        console.log(`🔥 MongoDB Atlas Conectado: ${process.env.DB_NAME}`);
    } catch (err) {
        console.error('❌ Error conectando a Atlas:', err);
        process.exit(1);
    }
};

const getDB = () => {
    if (!dbConnection) throw new Error('Base de datos no inicializada.');
    return dbConnection;
};

module.exports = { connectDB, getDB };