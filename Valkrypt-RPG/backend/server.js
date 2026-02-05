// server.js
require('dotenv').config();
const app = require('./app'); // Aquí es donde debe estar app.use(cors())
const { connectDB } = require('./config/db');

// El puerto debe ser dinámico para que el servidor asigne el suyo
const PORT = process.env.PORT || 3000;

// 1. Intentar conectar a la Base de Datos (MongoDB Atlas)
connectDB()
    .then(() => {
        // 2. Iniciamos el servidor solo si la base de datos responde
        app.listen(PORT, '0.0.0.0', () => { 
            // Añadimos '0.0.0.0' para que sea accesible desde el exterior
            console.log(`\n==================================================`);
            console.log(`💀 VALKRYPT ENGINE (Backend)`);
            console.log(`   Estado: ONLINE`);
            console.log(`   URL: http://localhost:${PORT}`);
            console.log(`   Base de Datos: MongoDB Atlas (Conectado)`);
            console.log(`==================================================\n`);
        });
    })
    .catch(err => {
        console.error("❌ Fallo crítico al iniciar el servidor:", err);
        process.exit(1); // Cerramos el proceso si no hay base de datos
    });