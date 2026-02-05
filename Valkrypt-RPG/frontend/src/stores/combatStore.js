import { defineStore } from 'pinia';
import api from '../services/api';
import { useGameStore } from './gameStore';

export const useCombatStore = defineStore('combat', {
    state: () => ({
        isActive: false,
        combatId: null,
        enemies: [],
        turnLog: [],
        currentTurnIndex: 0, // Útil si quieres marcar quién actúa
        isLoading: false
    }),

    actions: {
        async initCombat(enemyId, partyData) {
            this.isLoading = true;
            this.turnLog = []; // Limpiamos logs anteriores
            try {
                // Sincronizamos con el backend el inicio del encuentro
                const response = await api.startCombat(enemyId, partyData);
                const data = response.data.combatState || response.data;
                
                this.isActive = true;
                this.combatId = data.combatId;
                this.enemies = data.enemies;
                this.turnLog.push("⚔️ ¡La batalla comienza! Los enemigos acechan...");
            } catch (error) {
                console.error("Error iniciando combate:", error);
                // Fallback para no bloquear la UI si la API falla
                this.isActive = true; 
                this.enemies = [{ id: 'dummy', name: 'Error de Red', stats: { hp: 10, maxHp: 10 } }];
            } finally {
                this.isLoading = false;
            }
        },

        async performAction(actionType, actorId, targetId = 'ANY') {
            if (this.isLoading) return;
            this.isLoading = true;
            const gameStore = useGameStore();

            try {
                const payload = {
                    combatId: this.combatId, // Enviamos el ID del combate actual
                    actorId,
                    actionType, // 'ATTACK', 'HEAL', 'SKILL'
                    targetId
                };

                const response = await api.combatAction(payload);
                const result = response.data.data || response.data;

                // 1. Actualizar Vida de Enemigos (Estado Local)
                this.enemies = result.updatedState.enemies;

                // 2. Actualizar Vida del Grupo en el GameStore
                // Ajustamos para que coincida con la propiedad 'party' del GameStore
                if (result.updatedState.party) {
                    gameStore.party = result.updatedState.party;
                    // Guardamos backup por si el usuario refresca en medio del combate
                    localStorage.setItem('aethelgard_party_backup', JSON.stringify(gameStore.party));
                }

                // 3. Registro de eventos (Logs)
                // Usamos unshift para que lo último aparezca arriba, o push para scroll
                if (result.playerAction?.log) {
                    this.turnLog.push(`📜 ${result.playerAction.log}`);
                }

                if (result.enemyActions && result.enemyActions.length > 0) {
                    result.enemyActions.forEach(act => {
                        this.turnLog.push(`👹 ${act.log || `${act.enemy} ataca a ${act.target}`}`);
                    });
                }

                // 4. Gestión de Fin de Combate
                if (result.combatEnded) {
                    this.handleCombatEnd(result, gameStore);
                }

            } catch (error) {
                console.error("Error en la resolución del turno:", error);
            } finally {
                this.isLoading = false;
            }
        },

        /**
         * Maneja la transición de salida del combate
         */
        handleCombatEnd(result, gameStore) {
            this.turnLog.push(result.victory ? "✨ ¡VICTORIA IMPERIAL!" : "💀 El grupo ha sido aniquilado...");
            
            // Pausa dramática para que el jugador vea el resultado antes de cambiar de pantalla
            setTimeout(() => {
                this.isActive = false;
                // Devolvemos el control al GameStore para cargar la siguiente escena
                gameStore.returnToNarrative(result.victory, {
                    survivingParty: result.updatedState.party,
                    nextScene: result.nextScene // Si el combate decide a dónde vas
                });
            }, 2000);
        }
    }
});