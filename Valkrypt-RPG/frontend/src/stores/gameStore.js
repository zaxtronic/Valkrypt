// src/stores/gameStore.js
import { defineStore } from 'pinia';
import api from '../services/api';
// Importamos useCombatStore dentro de las acciones para evitar dependencias circulares si las hubiera
import { useCombatStore } from './combatStore'; 

export const useGameStore = defineStore('game', {
    state: () => ({
        currentScene: null,     // Datos de la escena actual (texto, opciones)
        party: [],              // Array de objetos de personajes
        isCombatMode: false,    // Flag para cambiar la UI
        isLoading: false,       // Spinner global
        error: null,            // Mensajes de error para Toasts
        gameId: null,           // ID de sesión del backend (si aplica)
        history: []             // (Opcional) Log de decisiones tomadas
    }),

    getters: {
        // Devuelve solo personajes vivos
        aliveParty: (state) => state.party.filter(p => p.stats.hp > 0),
        
        // Comprueba si todo el grupo ha muerto
        isGameOver: (state) => state.party.length > 0 && state.party.every(p => p.stats.hp <= 0),
        
        // Devuelve el personaje activo (para la UI)
        activeCharId: (state) => state.party.length > 0 ? state.party[0].id : null
    },
    
    actions: {
        /**
         * Inicializa el juego.
         * Prioridad: Argumento > LocalStorage > Backend Default
         */
        async initializeGame(selectedParty = null) {
            this.isLoading = true;
            this.error = null;

            try {
                let partyToSend = [];

                // 1. Determinar qué party usar
                if (selectedParty && selectedParty.length > 0) {
                    // Viene desde la pantalla de selección
                    partyToSend = selectedParty;
                    // Guardamos backup inmediato
                    localStorage.setItem('valkrypt_party_backup', JSON.stringify(partyToSend));
                } else {
                    // Intento de recuperación por F5 (Recarga)
                    const savedParty = localStorage.getItem('valkrypt_party_backup');
                    if (savedParty) {
                        partyToSend = JSON.parse(savedParty);
                    }
                }

                console.log("📤 Iniciando juego con party:", partyToSend);

                // 2. Llamada al Backend
                // Nota: Asegúrate de que tu backend acepte { party: [...] } en el body
                const response = await api.startGame(partyToSend); 
                
                // 3. Actualizar Estado
                const data = response.data.data || response.data; // Compatibilidad de estructura
                this.currentScene = data.scene;
                
                // Si el backend devuelve una party procesada, úsala. Si no, usa la local.
                this.party = (data.party && data.party.length > 0) ? data.party : partyToSend;
                
                this.gameId = data.gameId || Date.now(); // Simulación de ID si no viene
                this.isCombatMode = false;

            } catch (err) {
                this.error = "No se pudo conectar con el Reino (Error de API).";
                console.error("❌ Error critical initializeGame:", err);
                // Fallback de emergencia para desarrollo frontend
                if (selectedParty) this.party = selectedParty; 
            } finally {
                this.isLoading = false;
            }
        },

        /**
         * Maneja la elección del jugador (Narrativa o Combate)
         */
        async chooseOption(option) {
            if (this.isLoading) return; // Evitar doble click

            // --- BRANCH A: INICIO DE COMBATE ---
            if (option.type === 'START_COMBAT' || option.type === 'combat') {
                console.log("⚔️ Iniciando Combate...");
                this.isCombatMode = true;
                
                const combatStore = useCombatStore();
                
                // Pasar el ID del enemigo y la party actual al store de combate
                // 'next_scene' aquí actúa como ID del encuentro (ej: 'goblin_ambush')
                await combatStore.initCombat(option.next_scene, this.party);
                return;
            } 

            // --- BRANCH B: NARRATIVA ESTÁNDAR ---
            this.isLoading = true;
            this.error = null;
            
            try {
                // Enviamos la elección al backend
                const response = await api.makeChoice(option.next_scene);
                const data = response.data.data || response.data;

                // Actualizamos escena
                this.currentScene = data;
                
                // Si la decisión afectó a la party (ej: trampa), actualizamos
                if (data.partyUpdates) {
                    this.party = data.partyUpdates;
                    // Actualizar backup local
                    localStorage.setItem('valkrypt_party_backup', JSON.stringify(this.party));
                }

                // Guardar historial simple
                this.history.push(option.text);

            } catch (err) {
                this.error = "El destino es incierto... (Error de red)";
                console.error(err);
            } finally {
                this.isLoading = false;
            }
        },

        /**
         * Llamado por CombatStore cuando termina la pelea
         */
        async returnToNarrative(victory, combatResultData = null) {
            this.isCombatMode = false;
            
            if (victory) {
                console.log("🏆 Victoria. Volviendo a narrativa...");
                
                // Si hay actualizaciones de stats post-combate (daño recibido), aplicarlas
                if (combatResultData && combatResultData.survivingParty) {
                    this.party = combatResultData.survivingParty;
                    localStorage.setItem('valkrypt_party_backup', JSON.stringify(this.party));
                }

                // Cargar la siguiente escena (definida en el resultado del combate o por defecto)
                const nextSceneId = combatResultData?.nextScene || this.currentScene?.next_scene_victory || 'scene_victory_default';
                
                // Forzar carga de escena
                await this.chooseOption({ next_scene: nextSceneId, type: 'narrative', text: 'Victoria' });

            } else {
                // GAME OVER
                this.currentScene = {
                    title: "MUERTE",
                    description: "Tus héroes han caído. La oscuridad consume sus almas.",
                    options: [
                        { text: "Intentar de nuevo", next_scene: 'restart', type: 'restart' }
                    ]
                };
                // Limpiar storage para evitar bucles de muerte al recargar
                localStorage.removeItem('valkrypt_party_backup');
            }
        },

        /**
         * Helper para actualizar stats localmente (UI Update optimista)
         * Útil para trampas, pociones o efectos fuera de combate
         */
        updateCharacterStatus(charId, updates) {
            const charIndex = this.party.findIndex(c => c.id === charId);
            if (charIndex !== -1) {
                // Merge de stats (ej: { hp: 5 })
                this.party[charIndex].stats = { 
                    ...this.party[charIndex].stats, 
                    ...updates 
                };
                
                // Limites (no bajar de 0, no subir de max)
                if (this.party[charIndex].stats.hp < 0) this.party[charIndex].stats.hp = 0;
                if (this.party[charIndex].stats.hp > this.party[charIndex].stats.maxHp) {
                    this.party[charIndex].stats.hp = this.party[charIndex].stats.maxHp;
                }
            }
        },

        // Acción especial para reiniciar
        resetGame() {
            localStorage.removeItem('valkrypt_party_backup');
            window.location.href = '/select'; // Vuelta a la selección
        }
    }
});