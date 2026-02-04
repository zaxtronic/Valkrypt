class Character {
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.class = data.class;
        this.stats = { ...data.stats };
        this.abilities = data.abilities;
        this.isDead = false;
    }

    /**
     * Aplica daño al personaje
     */
    takeDamage(amount) {
        const actualDamage = Math.max(1, amount); // Mínimo 1 de daño
        this.stats.hp -= actualDamage;
        
        if (this.stats.hp <= 0) {
            this.stats.hp = 0;
            this.isDead = true;
            return { damage: actualDamage, status: "DEAD" };
        }
        
        return { damage: actualDamage, status: "ALIVE", currentHp: this.stats.hp };
    }

    /**
     * Lógica específica de Elara (Corrupción)
     */
    addCorruption(amount) {
        if (this.class !== 'Arcanist') return;
        
        this.stats.corruption += amount;
        if (this.stats.corruption >= 100) {
            return "ANOMALY_TRIGGERED";
        }
        return "STABLE";
    }

    /**
     * Lógica específica de Sorin (Magia de Sangre)
     */
    bloodHeal(target) {
        if (this.class !== 'BloodCleric') return;
        
        const cost = 5;
        const healAmount = 15;

        this.stats.hp -= cost;
        target.stats.hp = Math.min(target.stats.maxHp, target.stats.hp + healAmount);

        return {
            healerHp: this.stats.hp,
            targetHp: target.stats.hp
        };
    }
}

module.exports = Character;