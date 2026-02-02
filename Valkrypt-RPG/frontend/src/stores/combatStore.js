import { defineStore } from 'pinia';
import api from '../services/api';
import { useGameStore } from './gameStore';

export const useCombatStore = defineStore('combat', {
    state: () => ({
        isActive: false,
        combatId: null,
        enemies: [],
        turnLog: [],
        currentTurnIndex: 0,
        isLoading: false
    }),

    actions: {
        async initCombat(enemyId, partyData) {
            this.isLoading = true;
            try {
                // Pide al backend iniciar combate
                const response = await api.startCombat(enemyId, partyData);
                const data = response.data.combatState;
                
                this.isActive = true;
                this.combatId = data.combatId; // Asegúrate que el backend mande esto
                this.enemies = data.enemies;
                this.turnLog = ["¡El combate ha comenzado!"];
            } catch (error) {
                console.error("Error iniciando combate:", error);
            } finally {
                this.isLoading = false;
            }
        },

        async performAction(actionType, actorId, targetId = 'ANY') {
            this.isLoading = true;
            const gameStore = useGameStore();

            try {
                const payload = {
                    actorId,
                    actionType, // 'ATTACK', 'HEAL', etc.
                    targetId
                };

                const response = await api.combatAction(payload);
                const result = response.data;

                // 1. Actualizar Vida de Enemigos
                this.enemies = result.updatedState.enemies;

                // 2. Actualizar Vida del Grupo (GameStore)
                // El backend devuelve el estado actualizado del grupo
                if (result.updatedState.party) {
                    gameStore.updateParty(result.updatedState.party);
                }

                // 3. Registrar Log
                if (result.playerAction.log) this.turnLog.push(`TÚ: ${result.playerAction.log}`);
                if (result.enemyActions) {
                    result.enemyActions.forEach(act => {
                        this.turnLog.push(`ENEMIGO: ${act.enemy} ataca a ${act.target} (${act.type})`);
                    });
                }

                // 4. Chequear Fin de Combate
                if (result.combatEnded) {
                    setTimeout(() => {
                        alert(result.victory ? "¡VICTORIA!" : "HAS MUERTO");
                        this.isActive = false;
                        gameStore.returnToNarrative(result.victory);
                    }, 1000);
                }

            } catch (error) {
                console.error("Error en turno:", error);
            } finally {
                this.isLoading = false;
            }
        }
    }
});