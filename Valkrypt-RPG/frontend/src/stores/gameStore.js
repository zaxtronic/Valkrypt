// src/stores/gameStore.js
import { defineStore } from 'pinia';
import api from '../services/api';

export const useGameStore = defineStore('game', {
    state: () => ({
        currentScene: null,
        party: [], // Aquí guardamos a Kaelen, Vax, etc.
        isLoading: false,
        error: null
    }),
    
    actions: {
        async initializeGame() {
            this.isLoading = true;
            try {
                // Por ahora enviamos un party dummy, el backend lo sobreescribe con el default
                const response = await api.startGame([]); 
                this.currentScene = response.data.data.scene; // Ajuste según respuesta backend
                this.party = response.data.data.party;
            } catch (err) {
                this.error = err.message;
                console.error("Error iniciando juego:", err);
            } finally {
                this.isLoading = false;
            }
        },

 async chooseOption(option) {
            // DETECTAR SI ES COMBATE
            if (option.type === 'START_COMBAT') {
                this.isCombatMode = true;
                const combatStore = useCombatStore(); // Importar dinámicamente o arriba
                // El next_scene del JSON debe ser el ID del enemigo (ej: "anomaly_beast")
                await combatStore.initCombat(option.next_scene, this.party);
            } else {
                // Lógica normal narrativa
                this.isLoading = true;
                try {
                    const response = await api.makeChoice(option.next_scene);
                    this.currentScene = response.data.data;
                } catch (err) { console.error(err); } 
                finally { this.isLoading = false; }
            }
        },

        returnToNarrative(victory) {
            this.isCombatMode = false;
            if (victory) {
                // Aquí deberíamos cargar la siguiente escena de victoria (TODO: Backend support)
                alert("Has sobrevivido... por ahora.");
            } else {
                window.location.reload(); // Hard reset si mueren
            }
        }
    }
});