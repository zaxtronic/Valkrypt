// server.js
require('dotenv').config();
const app = require('./app');
const PORT = process.env.PORT || 3000;

// Aquí conectaríamos la Base de Datos en el futuro
// const db = require('./config/db'); 

// Arrancar el servidor
app.listen(PORT, () => {
    console.log(`\n==================================================`);
    console.log(`💀 VALKRYPT ENGINE (Backend)`);
    console.log(`   Estado: ONLINE`);
    console.log(`   Puerto: ${PORT}`);
    console.log(`   Modo:   ${process.env.NODE_ENV}`);
    console.log(`==================================================\n`);
});