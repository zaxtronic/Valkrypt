import { defineStore } from 'pinia';
import api from '../services/api';
import { useCombatStore } from './combatStore'; 

export const useGameStore = defineStore('game', {
    state: () => ({
        currentScene: null,
        party: [],
        isCombatMode: false,
        isLoading: false,
        error: null,
        gameId: null,
        history: [],
        isSynced: true // Nuevo: para saber si el "sello" está al día
    }),

    actions: {
        /**
         * NUEVA ACCIÓN: Guarda de forma segura con Hashing en el backend local
         */
        async saveSecurely() {
            try {
                const payload = {
                    party: this.party,
                    currentScene: this.currentScene,
                    history: this.history,
                    gameId: this.gameId
                };
                
                // Llamamos a la nueva ruta de seguridad que creamos en el backend
                await api.post('/game/offline-save', payload);
                this.isSynced = true;
                console.log("🛡️ Estado sellado con Hash en el sistema local.");
            } catch (err) {
                console.error("Error al sellar la partida:", err);
                this.isSynced = false;
            }
        },

        /**
         * Inicializa la aventura buscando primero el archivo sellado (.vlk)
         */
async initializeGame(selectedParty = null) {
            this.isLoading = true;
            this.error = null;

            try {
                // Pequeña espera de seguridad (500ms) para que el servidor Express 
                // tenga tiempo de abrir el puerto 3000 tras el arranque de Electron.
                await new Promise(resolve => setTimeout(resolve, 500));

                // 1. Intentamos cargar la partida segura del PC (Anti-cheat)
                let savedData = null;
                try {
                    const response = await api.get('/game/offline-load');
                    // Verificamos si response.data existe (evita errores si el server no responde bien)
                    if (response && response.data && response.data.success) {
                        savedData = response.data.data;
                        console.log("📦 Partida recuperada y validada por el servidor local.");
                        this.syncStatus = 'synced'; // Ponemos el modo local en verde
                    }
                } catch (e) {
                    console.log("No hay partida previa o firma inválida. Iniciando nueva.");
                }

                // 2. Prioridad: Selección nueva > Partida Validada
                if (selectedParty && selectedParty.length > 0) {
                    this.party = selectedParty;
                    const response = await api.startGame(this.party); 
                    const data = response.data.data || response.data;
                    this.currentScene = data.scene;
                } else if (savedData) {
                    this.party = savedData.party;
                    this.currentScene = savedData.currentScene;
                    this.history = savedData.history || [];
                    this.gameId = savedData.gameId;
                } else {
                    throw new Error("No hay un grupo de héroes ni partida guardada.");
                }

                // Guardamos el estado inicial de forma segura en el PC
                await this.saveSecurely();
                this.syncStatus = 'synced';

            } catch (err) {
                // Si llegamos aquí, el servidor local no responde o no hay datos
                this.syncStatus = 'offline'; 
                this.error = "Los dioses no responden. El núcleo de Valkrypt está en modo offline.";
                console.error("❌ Error de inicialización:", err);
            } finally {
                this.isLoading = false;
            }
        },

        async chooseOption(option) {
            if (this.isLoading) return;

            if (option.type === 'START_COMBAT' || option.type === 'combat') {
                this.isCombatMode = true;
                const combatStore = useCombatStore();
                await combatStore.initCombat(option.next_scene, this.party);
                return;
            } 

            this.isLoading = true;
            try {
                const response = await api.makeChoice(option.next_scene);
                const data = response.data.data || response.data;

                this.currentScene = data;
                if (data.partyUpdates) {
                    this.party = data.partyUpdates;
                }

                this.history.push(option.text);
                
                // CADA VEZ que tomamos una decisión, sellamos la partida localmente
                await this.saveSecurely();

            } catch (err) {
                this.error = "Error de comunicación con el motor de Valkrypt.";
            } finally {
                this.isLoading = false;
            }
        },

        async returnToNarrative(victory, combatResultData = null) {
            this.isCombatMode = false;
            
            if (victory) {
                if (combatResultData?.survivingParty) {
                    this.party = combatResultData.survivingParty;
                }

                // Tras la victoria, sellamos el progreso antes de seguir
                await this.saveSecurely();

                const nextSceneId = combatResultData?.nextScene || this.currentScene?.next_scene_victory;
                if (nextSceneId) {
                    await this.chooseOption({ next_scene: nextSceneId, type: 'narrative', text: 'Tras la batalla...' });
                }
            } else {
                // Si mueren, el servidor local podría borrar el archivo o marcarlo como "Muerto"
                this.resetGame();
            }
        },

        resetGame() {
            // Aquí podrías añadir una llamada al backend para borrar el local_save.vlk
            this.$reset();
            window.location.href = '/'; 
        }
    }
});