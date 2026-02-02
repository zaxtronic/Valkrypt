const { getDB } = require('../config/db');

class User {
    // Helper para obtener la colección rápidamente
    static collection() {
        return getDB().collection('users');
    }

    // Crear un nuevo usuario
    static async create(userData) {
        const result = await this.collection().insertOne({
            username: userData.username,
            email: userData.email,
            password: userData.password, // Ya debe venir hasheada
            createdAt: new Date(),
            saveData: {} // Espacio para guardar el JSON del juego luego
        });
        return result;
    }

    // Buscar por nombre de usuario
    static async findByUsername(username) {
        return await this.collection().findOne({ username });
    }

    // Buscar por email
    static async findByEmail(email) {
        return await this.collection().findOne({ email });
    }

    // Verificar si existe usuario o email (para registro)
    static async exists(username, email) {
        const user = await this.collection().findOne({
            $or: [{ username }, { email }]
        });
        return !!user; // Devuelve true si existe, false si no
    }
}

module.exports = User;