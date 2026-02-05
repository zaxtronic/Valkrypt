import axios from 'axios';
import router from '../router'; // Asumiendo que usas Vue Router, útil para redirigir en 401

// Configuración base de Axios
const api = axios.create({
    baseURL: 'http://localhost:3000/api',
    headers: {
        'Content-Type': 'application/json'
    },
    timeout: 10000 // 10s timeout para evitar que la UI se cuelgue eternamente
});

<<<<<<< HEAD
// --- INTERCEPTOR REQUEST ---
// Inyecta el token en cada petición
=======
// INTERCEPTOR: Si hay un token guardado, enviarlo en cada petición
>>>>>>> 4a64156f464224e851556985ac770b42376f4415
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// --- INTERCEPTOR RESPONSE (NUEVO) ---
// Maneja errores globales y limpia la respuesta para el Store
api.interceptors.response.use(
    (response) => {
        // Si el backend devuelve todo dentro de un objeto "data", lo simplificamos aquí
        // return response.data; // Descomentar si tu backend siempre envuelve en { data: ... }
        return response;
    },
    (error) => {
        // 1. Manejo de Sesión Expirada (401)
        if (error.response && error.response.status === 401) {
            console.warn('Sesión expirada. Redirigiendo al login...');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            // Opcional: Redirigir al login si tienes acceso al router
            // window.location.href = '/login'; 
        }

        // 2. Formateo de Errores para el Store
        // El Store espera "err.message". Aquí hacemos que ese mensaje sea el que envía el backend.
        const customError = new Error(
            error.response?.data?.message || // Mensaje del backend (ej: "No tienes suficiente maná")
            error.response?.data?.error || 
            'Error de conexión con el servidor'
        );
        
        // Adjuntamos datos extra por si el store necesita el código de estado
        customError.status = error.response?.status;
        
        return Promise.reject(customError);
    }
);

export default {
    // --- AUTENTICACIÓN ---
    register(userData) {
        // userData = { username, email, password }
        return api.post('/auth/register', userData);
    },
    login(credentials) {
        // credentials = { username, password }
        return api.post('/auth/login', credentials);
    },
    // Añadido: Método útil para verificar si el token sigue vivo al cargar la app
    getProfile() {
        return api.get('/auth/me'); 
    },

    // --- NARRATIVA ---
    /**
     * Inicia o Carga la partida.
     * @param {Array} party - Array de objetos de personajes (opcional si ya existe partida)
     */
    startGame(party) {
        return api.post('/game/start', { party });
    },

    /**
     * Toma una decisión narrativa.
     * @param {String} choiceId - El ID de la siguiente escena o nodo (ej: "enter_dungeon")
     */
    makeChoice(choiceId) {
        // El gameStore envía 'next_scene', aquí lo mapeamos a 'nextSceneId'
        return api.post('/game/choice', { nextSceneId: choiceId });
    },

    // --- COMBATE ---
    /**
     * Inicia una instancia de combate.
     * @param {String} enemyId - ID del encuentro o enemigo (ej: "goblin_ambush")
     * @param {Array} partyData - Estado actual de la party (HP/MP) para sincronizar
     */
    startCombat(enemyId, partyData) {
        return api.post('/combat/start', { 
            enemiesId: enemyId,
            party: partyData 
        });
    },

    /**
     * Ejecuta una acción de combate (Atacar, Curar, Objeto).
     * @param {Object} action - { type: 'ATTACK', sourceId, targetId, skillId }
     */
    combatAction(action) {
        return api.post('/combat/action', action);
    }
};