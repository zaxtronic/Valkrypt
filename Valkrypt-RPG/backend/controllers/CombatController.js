const CombatSystem = require('../services/CombatSystem');
const GameState = require('../models/GameState'); // (Simulado, en futuro vendrá de DB)

// Variable temporal en memoria para guardar el estado del combate activo
// (En producción, esto iría a Redis o Base de Datos)
let activeCombatSession = null;

class CombatController {

    // Inicia un combate desde una escena narrativa
    static async startCombat(req, res) {
        try {
            const { party, enemiesId } = req.body;
            
            // Inicializar el sistema de combate
            activeCombatSession = await CombatSystem.initializeCombat(party, enemiesId);
            
            res.json({
                success: true,
                message: "¡Combate Iniciado!",
                combatState: activeCombatSession
            });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }

    // Procesa una acción del jugador (Atacar, Curar, Mover)
    static async processAction(req, res) {
        try {
            if (!activeCombatSession) throw new Error("No hay combate activo.");

            const { actorId, actionType, targetId } = req.body;

            // 1. Ejecutar acción del jugador
            const playerResult = CombatSystem.executeTurn(activeCombatSession, actorId, actionType, targetId);
            
            // 2. Comprobar si el combate terminó
            if (playerResult.combatEnded) {
                activeCombatSession = null;
                return res.json({ success: true, combatEnded: true, victory: playerResult.victory });
            }

            // 3. Turno de la IA (Enemigos responden)
            const enemyResults = CombatSystem.runEnemyTurns(activeCombatSession);

            res.json({
                success: true,
                playerAction: playerResult,
                enemyActions: enemyResults,
                updatedState: activeCombatSession
            });

        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
}

module.exports = CombatController;