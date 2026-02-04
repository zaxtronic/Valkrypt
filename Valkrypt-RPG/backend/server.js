// server.js
require('dotenv').config();
const app = require('./app');
const { connectDB } = require('./config/db');

const PORT = process.env.PORT || 3000;

// 1. Intentar conectar a la Base de Datos primero
connectDB().then(() => {
    
    // 2. Si la conexión es exitosa, levantamos el servidor
    app.listen(PORT, () => {
        console.log(`\n==================================================`);
        console.log(`💀 VALKRYPT ENGINE (Backend)`);
        console.log(`   Estado: ONLINE`);
        console.log(`   Puerto: ${PORT}`);
        console.log(`   Base de Datos: MongoDB Atlas (Nativo)`);
        console.log(`==================================================\n`);
    });

}).catch(err => {
    console.error("❌ Fallo crítico al iniciar el servidor:", err);
});