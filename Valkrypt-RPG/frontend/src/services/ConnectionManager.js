// frontend/src/services/ConnectionManager.js
import axios from 'axios';

const API_URL = 'http://localhost:3000';

export const saveGameData = async (userId, data) => {
    try {
        // 1. Intentamos guardar en el servidor (Online)
        const response = await axios.post(`${API_URL}/game/save`, data);
        console.log("Guardado en la nube (Atlas)");
        return response.data;
    } catch (error) {
        // 2. Si falla el servidor, guardamos en LocalStorage/IndexedDB (Offline)
        console.warn("Servidor no disponible. Guardando en modo local...");
        localStorage.setItem(`valkrypt_save_${userId}`, JSON.stringify({
            ...data,
            lastSync: new Date(),
            isDirty: true // Flag para saber que hay que subirlo luego
        }));
        return { success: true, message: "Guardado localmente" };
    }
};