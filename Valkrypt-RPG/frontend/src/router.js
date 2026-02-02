import { createRouter, createWebHistory } from 'vue-router';

// Vistas del Juego
import HomeView from './views/HomeView.vue';
import GameView from './views/GameView.vue';
import CharacterSelect from './views/CharacterSelect.vue';
import GameOver from './views/GameOver.vue';

// Vistas de Autenticación
import RegisterView from './views/RegisterView.vue';
import LoginView from './views/LoginView.vue';

const routes = [
    // Rutas Públicas (Cualquiera puede entrar)
    { 
        path: '/', 
        component: HomeView 
    },
    { 
        path: '/login', 
        component: LoginView 
    },
    { 
        path: '/register', 
        component: RegisterView 
    },
    
    // Rutas Protegidas (Solo usuarios logueados)
    // Usamos 'meta: { requiresAuth: true }' para marcarlas
    { 
        path: '/select', 
        component: CharacterSelect, 
        meta: { requiresAuth: true } 
    },
    { 
        path: '/game', 
        component: GameView, 
        meta: { requiresAuth: true } 
    },
    { 
        path: '/dead', 
        component: GameOver,
        meta: { requiresAuth: true }
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

// --- GUARDIA DE NAVEGACIÓN ---
// Esto se ejecuta antes de cada cambio de ruta
router.beforeEach((to, from, next) => {
    // 1. Verificar si la ruta a la que vamos requiere autenticación
    if (to.meta.requiresAuth) {
        // 2. Comprobar si tenemos el token de sesión guardado
        const token = localStorage.getItem('token');
        
        if (token) {
            // Usuario logueado -> Permitir acceso
            next();
        } else {
            // Usuario NO logueado -> Redirigir al Login
            next('/login');
        }
    } else {
        // Ruta pública -> Permitir siempre
        next();
    }
});

export default router;