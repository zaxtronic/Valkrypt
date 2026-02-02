const DiceService = require('./DiceService');
const bestiary = require('../data/bestiary.json');
const Character = require('../models/Character'); // Reutilizamos la clase

class CombatSystem {

    static async initializeCombat(partyData, enemiesId) {
        // Cargar datos del enemigo desde el bestiario
        const enemyTemplate = bestiary[enemiesId];
        if (!enemyTemplate) throw new Error("Enemigo no encontrado en el bestiario.");

        // Crear instancia del enemigo (copia única para este combate)
        const enemy = {
            ...enemyTemplate,
            instanceId: `enemy_${Date.now()}`,
            currentHp: enemyTemplate.stats.hp
        };

        return {
            turn: 1,
            party: partyData, // Los Héroes
            enemies: [enemy], // Array de enemigos (pueden ser varios)
            log: ["El combate ha comenzado."]
        };
    }

    static executeTurn(combatState, actorId, actionType, targetId) {
        // Buscar al actor (Héroe) y al objetivo (Enemigo)
        const hero = combatState.party.find(p => p.id === actorId);
        const enemy = combatState.enemies.find(e => e.instanceId === targetId || targetId === 'ANY');

        if (!hero || !enemy) throw new Error("Objetivo inválido.");

        let resultLog = "";
        let damageDealt = 0;

        // Lógica de ataque simple
        if (actionType === 'ATTACK') {
            // Tirada de ataque: d20 + Fuerza vs Armadura
            const roll = DiceService.rollD20();
            const hitChance = roll + (hero.stats.strength - 10) / 2; // Modificador D&D clásico
            
            if (hitChance >= enemy.stats.armor) {
                // Impacto
                damageDealt = DiceService.rollDamage(hero.class); // Ej: Guerrero d10, Mago d6
                enemy.currentHp -= damageDealt;
                resultLog = `${hero.name} golpea a ${enemy.name} por ${damageDealt} daño.`;
            } else {
                resultLog = `${hero.name} falla el ataque.`;
            }
        }

        // Registrar en el log
        combatState.log.push(resultLog);

        // Verificar victoria
        const allEnemiesDead = combatState.enemies.every(e => e.currentHp <= 0);
        
        return {
            victory: allEnemiesDead,
            combatEnded: allEnemiesDead,
            log: resultLog,
            damage: damageDealt
        };
    }

    static runEnemyTurns(combatState) {
        const actions = [];

        combatState.enemies.forEach(enemy => {
            if (enemy.currentHp <= 0) return; // Los muertos no atacan

            // IA SÚPER BÁSICA: Atacar a un héroe vivo aleatorio
            const livingHeroes = combatState.party.filter(h => h.stats.hp > 0);
            if (livingHeroes.length === 0) return;

            const target = livingHeroes[Math.floor(Math.random() * livingHeroes.length)];
            
            // Tirada de ataque del enemigo
            const roll = DiceService.rollD20();
            // Asumimos que la Bestia tiene un bono de +5 al ataque
            if (roll + 5 >= target.stats.armor) {
                const dmg = DiceService.roll("2d6");
                target.stats.hp -= dmg;
                const logMsg = `${enemy.name} desgarra a ${target.name} por ${dmg} daño.`;
                combatState.log.push(logMsg);
                actions.push({ enemy: enemy.name, target: target.name, damage: dmg, type: "HIT" });
            } else {
                combatState.log.push(`${enemy.name} intenta morder a ${target.name} pero falla.`);
                actions.push({ enemy: enemy.name, target: target.name, type: "MISS" });
            }
        });

        combatState.turn++;
        return actions;
    }
}

module.exports = CombatSystem;