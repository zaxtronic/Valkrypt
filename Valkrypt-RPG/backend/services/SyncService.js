const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const SaveState = require('../models/SaveState');
const { verifyIntegrity } = require('../utils/security');

// Ruta al archivo sellado
const OFFLINE_SAVE_PATH = path.join(__dirname, '../data/local_save.vlk');

class SyncService {
    /**
     * Intenta subir la partida local a Atlas si hay conexión y los datos son íntegros.
     */
    static async trySyncToAtlas(userId) {
        // 1. Comprobación de archivo
        if (!fs.existsSync(OFFLINE_SAVE_PATH)) {
            return { synced: false, reason: "No local file found" };
        }

        // 2. Comprobación de conexión (1 = Connected)
        if (mongoose.connection.readyState !== 1) {
            console.log("🌐 Atlas offline. Los datos se mantienen seguros en el PC.");
            return { synced: false, reason: "Atlas disconnected" };
        }

        try {
            const rawData = fs.readFileSync(OFFLINE_SAVE_PATH, 'utf-8');
            const securePackage = JSON.parse(rawData);
            const { payload, signature } = securePackage;

            // 3. Validación del Sello (Anti-cheat)
            const isValid = verifyIntegrity(payload, signature);

            if (isValid) {
                console.log(`🚀 Sincronizando datos íntegros para el usuario: ${userId}`);
                
                // Persistimos en MongoDB Atlas usando tu modelo SaveState
                await SaveState.persist(userId || 'guest_user', payload);
                
                return { synced: true };
            } else {
                console.error("⚠️ ALERTA: La firma del archivo local no coincide. Sincronización abortada.");
                return { synced: false, reason: "Integrity check failed" };
            }
        } catch (error) {
            console.error("❌ Error crítico en SyncService:", error.message);
            return { synced: false, error: error.message };
        }
    }
}

module.exports = SyncService;