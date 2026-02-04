// backend/services/GameMasterAI.js
const path = require('path');
const fs = require('fs/promises');
const Character = require('../models/Character');
const GameState = require('../models/GameState');
const charactersData = require('../data/characters.json');

// Ruta al archivo JSON
const CAMPAIGN_PATH = path.join(__dirname, '../data/campaigns/shadow_of_deepstone.json');

class GameMasterAI {
    
    // Carga los datos crudos del JSON
    static async loadCampaignData() {
        try {
            const data = await fs.readFile(CAMPAIGN_PATH, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            console.error("Error crítico leyendo campaña:", error);
            throw new Error("El Game Master ha perdido sus notas (Error de Archivo).");
        }
    }

    /**
     * Inicia la campaña devolviendo la escena inicial
     */
    static async initializePrologue() {
        const campaign = await this.loadCampaignData();
        const startId = campaign.meta.starting_scene;
        
        console.log(`🤖 GM: Iniciando historia en '${startId}'`);
        
        return this.getScene(startId, campaign);
    }

    /**
     * Procesa una decisión del jugador
     */
    static async processDecision(nextSceneId) {
        const campaign = await this.loadCampaignData();
        return this.getScene(nextSceneId, campaign);
    }
    
    static async initializePrologue() {
        const campaign = await this.loadCampaignData();
        const startId = campaign.meta.starting_scene;
        
        // 1. Instanciar los personajes
        // Convertimos el JSON en objetos de la clase Character con lógica
        const party = charactersData.map(charData => new Character(charData));

        // 2. Crear el Estado Inicial del Juego (Memoria de la sesión)
        const initialState = new GameState(
            this.getScene(startId, campaign),
            party
        );

        console.log(`🤖 GM: Grupo creado. Líder: ${party[0].name} (HP: ${party[0].stats.hp})`);

        return {
            scene: this.getScene(startId, campaign),
            party: party, // Enviamos los datos de los PJs al frontend
            gameState: initialState // 
        };
    }

    /**
     * Busca una escena específica y la devuelve
     */
    static getScene(sceneId, campaignData) {
        const scene = campaignData.scenes[sceneId];
        
        if (!scene) {
            throw new Error(`Escena ${sceneId} no encontrada.`);
        }

        // Aquí podríamos inyectar lógica extra (ej: si Corruption > 50, cambiar descripción)
        // Por ahora, devolvemos la escena tal cual
        return {
            id: scene.id,
            title: scene.title,
            type: scene.type,
            description: scene.description,
            options: scene.options,
            // Si es combate, el Frontend sabrá qué hacer por el "type"
        };
    }
}

module.exports = GameMasterAI;