const User = require('../models/User');
const Session = require('../models/Session');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class AuthController {

    // --- REGISTRO DE USUARIOS ---
    static async register(req, res) {
        const { username, email, password } = req.body;

        try {
            if (!username || !email || !password) {
                return res.status(400).json({ error: "Faltan campos requeridos." });
            }

            const existingUser = await User.findByUsername(username);
            const existingEmail = await User.findByEmail(email);
            
            if (existingUser || existingEmail) {
                return res.status(409).json({ error: "El usuario o email ya están registrados." });
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const result = await User.create({
                username,
                email,
                password: hashedPassword
            });

            res.status(201).json({ 
                success: true, 
                message: "Nuevo recluta registrado.",
                userId: result.insertedId 
            });

        } catch (error) {
            console.error("Error en el registro:", error);
            res.status(500).json({ error: "Error interno del servidor." });
        }
    }

    // --- LOGIN ---
    static async login(req, res) {
        const { username, password } = req.body;

        try {
            const user = await User.findByUsername(username);
            if (!user) {
                return res.status(401).json({ error: "Usuario no encontrado." });
            }

            const validPass = await bcrypt.compare(password, user.password);
            if (!validPass) {
                return res.status(401).json({ error: "Contraseña incorrecta." });
            }

            // --- REGISTRO DE SESIÓN (Dispara la creación en Atlas) ---
            try {
                const clientInfo = req.headers['user-agent'] || 'Valkrypt-Client';
                // Llamamos a .start() como dice tu modelo
                await Session.start(user._id, clientInfo); 
                console.log(`[DB] Sesión registrada para: ${user.username}`);
            } catch (sessionError) {
                console.error("Error al persistir la sesión:", sessionError);
            }

            const token = jwt.sign(
                { id: user._id, username: user.username },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.json({
                success: true,
                token,
                user: { 
                    id: user._id, 
                    username: user.username,
                    saveData: user.saveData 
                }
            });

        } catch (error) {
            console.error("Error en el login:", error);
            res.status(500).json({ error: "Error de autenticación." });
        }
    }

    // --- LOGOUT ---
    static async logout(req, res) {
        try {
            // El userId viene del token JWT decodificado (middleware)
            const userId = req.user.id; 
            // Llamamos a .end() como dice tu modelo
            await Session.end(userId);
            res.json({ success: true, message: "Sesión cerrada correctamente." });
        } catch (error) {
            console.error("Error en el logout:", error);
            res.status(500).json({ error: "No se pudo cerrar la sesión." });
        }
    }
}

module.exports = AuthController;