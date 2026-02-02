const User = require('../models/User');

class AuthController {
    
    static async register(req, res) {
        const { username, password } = req.body;
        // TODO: Insertar en MySQL
        res.status(201).json({ 
            success: true, 
            message: `Usuario ${username} registrado en los registros de la Guardia.` 
        });
    }

    static async login(req, res) {
        const { username, password } = req.body;
        
        // Simulación: Aceptamos cualquier login por ahora para desarrollo
        if (username && password) {
            res.json({
                success: true,
                token: "fake-jwt-token-123456",
                user: { id: 1, username: username }
            });
        } else {
            res.status(401).json({ success: false, error: "Credenciales inválidas." });
        }
    }
}

module.exports = AuthController;