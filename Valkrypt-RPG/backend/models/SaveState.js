// models/SaveState.js
const { getDB } = require('../config/db');
const { ObjectId } = require('mongodb');

class SaveState {
    /**
     * @param {string} userId - ID del usuario de la base de datos
     * @param {Array} partyData - Array de objetos Character serializados
     * @param {string} currentSceneId - ID de la escena actual
     */
    constructor(userId, partyData, currentSceneId) {
        this.userId = userId;
        this.timestamp = new Date();
        this.currentSceneId = currentSceneId;
        this.party = partyData; // Array de Characters con su HP/MP actual
        this.inventory = [];
        this.corruptionLevel = 0;
        this.flags = {};
    }

    /**
     * Guarda el estado actual del juego en el documento del usuario en MongoDB Atlas
     */
    static async persist(userId, gameState) {
        const db = getDB();
        
        // Estructura que se guardará en el campo 'saveData' de tu captura de Atlas
        const dataToSave = {
            currentSceneId: gameState.currentSceneId,
            party: gameState.party,
            inventory: gameState.inventory || [],
            corruptionLevel: gameState.corruptionLevel || 0,
            flags: gameState.flags || {},
            updatedAt: new Date()
        };

        return await db.collection('users').updateOne(
            { _id: new ObjectId(userId) },
            { $set: { saveData: dataToSave } }
        );
    }

    /**
     * Recupera el progreso guardado de un usuario
     */
    static async getByUserId(userId) {
        const db = getDB();
        const user = await db.collection('users').findOne(
            { _id: new ObjectId(userId) },
            { projection: { saveData: 1 } }
        );
        return user ? user.saveData : null;
    }

    /**
     * Serializa el objeto para enviarlo al frontend
     */
    serialize() {
        return JSON.stringify({
            userId: this.userId,
            timestamp: this.timestamp,
            currentSceneId: this.currentSceneId,
            party: this.party,
            inventory: this.inventory,
            corruptionLevel: this.corruptionLevel,
            flags: this.flags
        });
    }
}

module.exports = SaveState;