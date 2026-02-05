class NarrativeEngine {
    
    /**
     * Verifica si una opción está disponible para el jugador
     */
    static checkRequirements(option, party) {
        if (!option.requirements) return true;

        const { reqStat, reqValue, reqClass } = option.requirements;

        // Verificar si alguien del grupo cumple el requisito
        return party.some(char => {
            if (reqClass && char.class !== reqClass) return false;
            if (reqStat && char.stats[reqStat] < reqValue) return false;
            return true;
        });
    }

    /**
     * Procesa las consecuencias inmediatas de una decisión
     */
    static applyConsequences(option, gameState) {
        if (!option.effect) return gameState;

        if (option.effect.gold) {
            gameState.inventory.gold = (gameState.inventory.gold || 0) + option.effect.gold;
        }
        
        
        return gameState;
    }
}

module.exports = NarrativeEngine;