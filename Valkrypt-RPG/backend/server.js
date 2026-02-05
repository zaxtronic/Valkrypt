require('dotenv').config();
const app = require('./app'); 
const { connectDB } = require('./config/db');

const PORT = process.env.PORT || 3000;

// 1. ARRANCAMOS EL SERVIDOR INMEDIATAMENTE
// Esto garantiza que el Frontend vea el puerto 3000 y se ponga en VERDE (Modo Local)
const server = app.listen(PORT, '0.0.0.0', () => { 
    console.log(`\n==================================================`);
    console.log(`💀 VALKRYPT ENGINE (Backend)`);
    console.log(`   Estado: ONLINE (Puerto ${PORT})`);
    console.log(`   Modo: Local / Anti-Cheat Activo`);
    console.log(`==================================================\n`);
});

// 2. CONECTAMOS A LA NUBE EN SEGUNDO PLANO
// Si falla, el juego sigue funcionando en local (Modo Offline/Local)
connectDB()
    .then(() => {
        console.log(`☁️  Sincronización con MongoDB Atlas: ACTIVADA`);
    })
    .catch(err => {
        console.error("⚠️  Aviso: MongoDB Atlas no disponible. Funcionando solo en local.");
        // NO hacemos process.exit(1), para que el usuario pueda seguir jugando offline
    });