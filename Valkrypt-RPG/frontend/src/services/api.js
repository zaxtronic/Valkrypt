import axios from 'axios';

// Configuración base de Axios
const api = axios.create({
    baseURL: 'http://localhost:3000/api', // Tu Backend
    headers: {
        'Content-Type': 'application/json'
    }
});

// INTERCEPTOR: Si hay un token guardado, enviarlo en cada petición
// Esto permite al backend saber quién eres
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

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

    // --- NARRATIVA ---
    startGame(party) {
        return api.post('/game/start', { party });
    },
    makeChoice(choiceId) {
        return api.post('/game/choice', { nextSceneId: choiceId });
    },

    // --- COMBATE ---
    startCombat(enemyId, partyData) {
        return api.post('/combat/start', { 
            enemiesId: enemyId,
            party: partyData 
        });
    },
    combatAction(action) {
        return api.post('/combat/action', action);
    }
};