class GameState {
    constructor(sceneData, partyData) {
        this.sceneId = sceneData.id;
        this.party = partyData; // Array de objetos Character
        this.enemies = [];      // Array de objetos Enemy (si hay combate)
        this.combatActive = false;
        this.turn = 0;
        this.log = []; // Historial de acciones
    }

    // Método para guardar un mensaje en el log
    addLog(message) {
        this.log.push(`[T${this.turn}] ${message}`);
        if (this.log.length > 50) this.log.shift();
    }
}

module.exports = GameState;