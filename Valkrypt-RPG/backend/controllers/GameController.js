// controllers/GameController.js
const GameMasterAI = require('../services/GameMasterAI');
const SaveState = require('../models/SaveState');

class GameController {
    
    /*
      Verifica que el motor de Valkrypt está respondiendo.
     */
    static getStatus(req, res) {
        res.json({ 
            message: "Valkrypt Engine Online", 
            status: "READY",
            time: new Date() 
        });
    }

    /*
     Inicia una nueva campaña generando el prólogo a través de la IA.
     */
    static async startCampaign(req, res) {
        try {
            const scene = await GameMasterAI.initializePrologue();
            res.json({ 
                success: true, 
                data: scene 
            });
        } catch (error) {
            console.error("Error al iniciar campaña:", error);
            res.status(500).json({ success: false, error: error.message });
        }
    }

    /*
     Procesa la decisión del jugador y genera la siguiente escena narrativa.
     */
    static async makeChoice(req, res) {
        try {
            const { nextSceneId } = req.body;
            
            if (!nextSceneId) {
                return res.status(400).json({ error: "Falta el ID de la siguiente escena para que la IA procese." });
            }

            const scene = await GameMasterAI.processDecision(nextSceneId);
            res.json({ success: true, data: scene });

        } catch (error) {
            console.error("Error en la toma de decisión:", error);
            res.status(500).json({ success: false, error: error.message });
        }
    }

    /*
     * Guarda el progreso actual en MongoDB Atlas.
     Requiere que el middleware de autenticación haya inyectado req.user.
     */
    static async saveProgress(req, res) {
        try {
            // El ID viene del token JWT decodificado por tu middleware de auth
            const userId = req.user.id; 
            
            // El body debe contener el estado de la party, escena actual, inventario y otras cosas.
            const gameState = req.body; 

            if (!gameState || Object.keys(gameState).length === 0) {
                return res.status(400).json({ error: "No hay datos de juego para guardar." });
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

    /*
     Carga el progreso guardado del usuario.
     */
    static async loadProgress(req, res) {
        try {
            const userId = req.user.id;
            const saveData = await SaveState.getByUserId(userId);

            if (!saveData) {
                return res.status(404).json({ message: "No se encontraron susurros de partidas pasadas." });
            }

            res.json({ 
                success: true, 
                data: saveData 
            });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
}

module.exports = GameController;