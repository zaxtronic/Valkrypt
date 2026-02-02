import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue' // Asegúrate que la A es mayúscula
import router from './router'

// Ruta corregida a tus estilos
import './assets/styles/main.scss'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.mount('#app')