class DiceService {
    
    static rollD20() {
        return Math.floor(Math.random() * 20) + 1;
    }

    static rollD100() {
        return Math.floor(Math.random() * 100) + 1;
    }

    /**
     * Parsea strings tipo "2d6+4" y devuelve el resultado
     */
    static roll(formula) {
        // Ejemplo simple para "2d6"
        if (formula === "2d6") {
            return (Math.floor(Math.random() * 6) + 1) + (Math.floor(Math.random() * 6) + 1);
        }
        // Daño por defecto por clase
        if (formula === "Warrior") return Math.floor(Math.random() * 10) + 1 + 3; // Espadón +3
        if (formula === "Rogue") return Math.floor(Math.random() * 6) + 1 + 4; // Daga +4 (Furtivo)
        if (formula === "Arcanist") return Math.floor(Math.random() * 8) + 1 + 5; // Rayo +5
        
        return Math.floor(Math.random() * 6) + 1; // Fallback
    }

    static rollDamage(className) {
        return this.roll(className);
    }
}

module.exports = DiceService;