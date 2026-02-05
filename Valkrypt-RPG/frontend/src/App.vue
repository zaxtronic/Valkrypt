<template>
  <div :class="{ 'is-offline': !isOnline }">
    <div class="status-bar" :class="isOnline ? 'online' : 'offline'">
      {{ isOnline ? '🌐 BASTIÓN CONECTADO' : '🛡️ MODO LOCAL ACTIVO' }}
    </div>
    <router-view />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from './services/api';

const isOnline = ref(true);

onMounted(async () => {
  try {
    // Intentamos un ping al servidor
    await api.getStatus(); 
    isOnline.value = true;
  } catch (err) {
    isOnline.value = false;
    console.warn("Valkrypt funcionando en modo Offline.");
  }
});
</script>

<style scoped>
.status-bar {
  position: fixed;
  top: 0; width: 100%;
  font-size: 0.7rem;
  text-align: center;
  padding: 2px;
  z-index: 9999;
  font-family: 'Cinzel Decorative', serif;
}
.online { background: rgba(76, 209, 55, 0.2); color: #4cd137; }
.offline { background: rgba(138, 28, 28, 0.2); color: #ff6b6b; }
</style>