const { getDB } = require('../config/db');
const { ObjectId } = require('mongodb');

class Session {
    static collection() {
        return getDB().collection('sessions');
    }

    /**
     * Registra el inicio de una sesión.
     */
    static async start(userId, clientInfo) {
        return await this.collection().insertOne({
            userId: new ObjectId(userId), // Referencia real al usuario
            loginAt: new Date(),
            client: clientInfo.includes('Electron') ? 'Electron-App' : 'Browser',
            active: true
        });
    }

    /**
     * Cierra todas las sesiones activas de un usuario.
     */
    static async end(userId) {
        return await this.collection().updateMany(
            { userId: new ObjectId(userId), active: true },
            { $set: { logoutAt: new Date(), active: false } }
        );
    }
}

module.exports = Session;