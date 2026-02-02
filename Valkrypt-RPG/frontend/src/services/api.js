// src/services/api.js
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000/api', // URL de tu Backend
    headers: {
        'Content-Type': 'application/json'
    }
});

export default {
    // Narrativa
    startGame(party) {
        return api.post('/game/start', { party });
    },
    makeChoice(choiceId) {
        return api.post('/game/choice', { nextSceneId: choiceId });
    },
    // Combate
    startCombat(enemyId) {
        return api.post('/combat/start', { enemiesId: enemyId });
    },
    combatAction(action) {
        return api.post('/combat/action', action);
    }
};