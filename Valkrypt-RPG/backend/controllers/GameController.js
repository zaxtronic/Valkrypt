const GameMasterAI = require('../services/GameMasterAI');

class GameController {
    
    static getStatus(req, res) {
        res.json({ message: "Valkrypt Online", time: new Date() });
    }

    // Iniciar partida
    static async startCampaign(req, res) {
        try {
            const scene = await GameMasterAI.initializePrologue();
            res.json({ success: true, data: scene });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }

    // Tomar decisión (NUEVO)
    static async makeChoice(req, res) {
        try {
            const { nextSceneId } = req.body; // El ID que viene del botón del frontend
            
            if (!nextSceneId) {
                return res.status(400).json({ error: "Falta el ID de la siguiente escena." });
            }

            const scene = await GameMasterAI.processDecision(nextSceneId);
            res.json({ success: true, data: scene });

        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
}

module.exports = GameController;