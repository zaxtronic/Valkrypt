const DiceService = require('./DiceService');

class EnemyAI {

    /**
     * Decide la acción de un enemigo en su turno.
     * @param {Object} enemy - El objeto del enemigo actuando
     * @param {Array} heroes - Array de héroes vivos
     */
    static computeAction(enemy, heroes) {
        // 1. Filtrar objetivos válidos (Vivos)
        const validTargets = heroes.filter(h => h.stats.hp > 0);
        if (validTargets.length === 0) return { type: 'WAIT', message: "No hay objetivos." };

        // 2. Comportamiento por Arquetipo (Simulación)
        
        // CULTISTA: Ataca al que tenga menos vida (es cruel)
        if (enemy.id.includes('cultist')) {
            const weakest = validTargets.sort((a, b) => a.stats.hp - b.stats.hp)[0];
            return {
                type: 'ATTACK',
                targetId: weakest.id,
                ability: 'RAYO_PUTREFACCION'
            };
        }

        // GUARDIA / BESTIA: Ataca al azar o al tanque (Kaelen)
        // Simulamos "Aggro" simple: 50% al azar, 50% al Tanque
        const roll = DiceService.rollD100();
        let target = validTargets[Math.floor(Math.random() * validTargets.length)];
        
        if (roll > 50) {
            const tank = validTargets.find(h => h.class === 'Warrior');
            if (tank) target = tank;
        }

        return {
            type: 'ATTACK',
            targetId: target.id,
            ability: 'BASIC_ATTACK'
        };
    }
}

module.exports = EnemyAI;