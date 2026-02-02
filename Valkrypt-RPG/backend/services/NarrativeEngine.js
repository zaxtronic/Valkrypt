class NarrativeEngine {
    
    /**
     * Verifica si una opción está disponible para el jugador
     * Ej: "Robar llave" solo si tienes a Vax o Destreza > 15
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
     * Ej: Ganar oro, Perder HP al caer en trampa
     */
    static applyConsequences(option, gameState) {
        if (!option.effect) return gameState;

        if (option.effect.gold) {
            gameState.inventory.gold = (gameState.inventory.gold || 0) + option.effect.gold;
        }
        
        // Aquí añadiríamos lógica para daño por trampas fuera de combate
        
        return gameState;
    }
}

module.exports = NarrativeEngine;