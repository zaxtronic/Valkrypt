// controllers/GameController.js
const fs = require('fs');
const path = require('path');
const GameMasterAI = require('../services/GameMasterAI');
const SaveState = require('../models/SaveState');
const { generateSignature, verifyIntegrity } = require('../utils/security');

// Ruta para el archivo local (No toca Atlas)
const OFFLINE_SAVE_PATH = path.join(__dirname, '../data/local_save.vlk');

class GameController {
    
    /* Verifica que el motor de Valkrypt está respondiendo. */
    static getStatus(req, res) {
        res.json({ 
            message: "Valkrypt Engine Online", 
            status: "READY",
            time: new Date() 
        });
    }

    /* Inicia una nueva campaña generando el prólogo a través de la IA. */
    static async startCampaign(req, res) {
        try {
            const scene = await GameMasterAI.initializePrologue();
            res.json({ success: true, data: scene });
        } catch (error) {
            console.error("Error al iniciar campaña:", error);
            res.status(500).json({ success: false, error: error.message });
        }
    }

    /* Procesa la decisión del jugador y genera la siguiente escena narrativa. */
    static async makeChoice(req, res) {
        try {
            const { nextSceneId } = req.body;
            if (!nextSceneId) {
                return res.status(400).json({ error: "Falta el ID de la siguiente escena." });
            }
            const scene = await GameMasterAI.processDecision(nextSceneId);
            res.json({ success: true, data: scene });
        } catch (error) {
            console.error("Error en la toma de decisión:", error);
            res.status(500).json({ success: false, error: error.message });
        }
    }

    /* Guarda el progreso actual en MongoDB Atlas. */
    static async saveProgress(req, res) {
        try {
            const userId = req.user.id; 
            const gameState = req.body; 
            if (!gameState || Object.keys(gameState).length === 0) {
                return res.status(400).json({ error: "No hay datos de juego." });
            }
            const result = await SaveState.persist(userId, gameState);
            res.json({ 
                success: true, 
                message: "Progreso guardado en las sombras de Valkrypt.",
                lastSync: new Date(),
                result 
            });
        } catch (error) {
            console.error("Error al persistir progreso:", error);
            res.status(500).json({ success: false, error: "Error interno al guardar en Atlas." });
        }
    }

    /* Carga el progreso guardado del usuario desde Atlas. */
    static async loadProgress(req, res) {
        try {
            const userId = req.user.id;
            const saveData = await SaveState.getByUserId(userId);
            if (!saveData) {
                return res.status(404).json({ message: "No se encontraron susurros de partidas pasadas." });
            }
            res.json({ success: true, data: saveData });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }

    // ==========================================
    // NUEVOS MÉTODOS OFFLINE (Sellar y Cargar Local)
    // ==========================================


    static async saveOfflineProgress(req, res) {
        try {
            const gameState = req.body;

            // 1. Validación de entrada
            if (!gameState || Object.keys(gameState).length === 0) {
                return res.status(400).json({ error: "No hay datos para el sellado offline." });
            }

            // 2. Creación del paquete de seguridad (Hashing)
            const securePackage = {
                lastUpdated: new Date().toISOString(),
                payload: gameState,
                signature: generateSignature(gameState) // Generado con la SECRET_KEY de tu .env
            };

            // 3. Escritura física en el disco duro del PC (Persistencia local)
            fs.writeFileSync(OFFLINE_SAVE_PATH, JSON.stringify(securePackage, null, 2));

            // 4. Lógica Híbrida: Intentar sincronizar con Atlas en segundo plano
            // Pasamos el ID del usuario si está logueado, si no, lo marcará como 'guest_user'
            const userId = (req.user && req.user.id) ? req.user.id : 'guest_player';
            
            // Lo ejecutamos sin el 'await' para que la respuesta al juego (Vue) sea instantánea
            SyncService.trySyncToAtlas(userId).catch(err => 
                console.error("Fallo silencioso de sincronización (Normal si estás offline):", err.message)
            );

            // 5. Respuesta al Frontend
            res.json({ 
                success: true, 
                message: "🛡️ Partida sellada localmente y en cola de sincronización.",
                offline: true 
            });

        } catch (error) {
            console.error("Error crítico en saveOfflineProgress:", error);
            res.status(500).json({ 
                success: false, 
                error: "Fallo en el guardado local del sistema." 
            });
        }
    }

    static async loadOfflineProgress(req, res) {
        try {
            if (!fs.existsSync(OFFLINE_SAVE_PATH)) {
                return res.status(404).json({ message: "Sin archivo local." });
            }
            const securePackage = JSON.parse(fs.readFileSync(OFFLINE_SAVE_PATH, 'utf-8'));
            if (!verifyIntegrity(securePackage.payload, securePackage.signature)) {
                return res.status(403).json({ error: "Firma inválida", message: "Archivo manipulado." });
            }
            res.json({ success: true, data: securePackage.payload });
        } catch (error) {
            res.status(500).json({ success: false, error: "Error de lectura local." });
        }
    }
}

module.exports = GameController;