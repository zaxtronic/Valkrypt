class SaveState {
    constructor(userId, partyData, currentSceneId) {
        this.userId = userId;
        this.timestamp = new Date();
        this.currentSceneId = currentSceneId;
        this.party = partyData; // Array de Characters con su HP actual
        this.inventory = [];
        this.corruptionLevel = 0;
        this.flags = {}; // Ej: { "killed_cultist": true }
    }

    serialize() {
        return JSON.stringify(this);
    }
}

module.exports = SaveState;