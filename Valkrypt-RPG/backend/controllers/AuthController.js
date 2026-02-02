const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class AuthController {

    // REGISTRO
    static async register(req, res) {
        const { username, email, password } = req.body;

        try {
            // 1. Validar datos
            if (!username || !email || !password) {
                return res.status(400).json({ error: "Faltan campos requeridos." });
            }

            // 2. Comprobar si existe
            const existingUser = await User.findByUsername(username);
            const existingEmail = await User.findByEmail(email);
            
            if (existingUser || existingEmail) {
                return res.status(409).json({ error: "Usuario o email ya registrados." });
            }

            // 3. Encriptar contraseña
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // 4. Guardar
            const result = await User.create({
                username,
                email,
                password: hashedPassword
            });

            res.status(201).json({ 
                success: true, 
                message: "Recluta registrado.",
                userId: result.insertedId 
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error en el servidor." });
        }
    }

    // LOGIN
    static async login(req, res) {
        const { username, password } = req.body;

        try {
            // 1. Buscar
            const user = await User.findByUsername(username);
            if (!user) {
                return res.status(401).json({ error: "Usuario no encontrado." });
            }

            // 2. Comparar Password
            const validPass = await bcrypt.compare(password, user.password);
            if (!validPass) {
                return res.status(401).json({ error: "Contraseña incorrecta." });
            }

            // 3. Token
            const token = jwt.sign(
                { id: user._id, username: user.username },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.json({
                success: true,
                token,
                user: { id: user._id, username: user.username }
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error de login." });
        }
    }
}

module.exports = AuthController;