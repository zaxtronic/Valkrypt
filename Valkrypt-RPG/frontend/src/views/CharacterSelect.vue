<template>
  <div class="select-screen">
    <h2>Reuniendo al Grupo...</h2>
    <p>Kaelen, Vax, Elara y Sorin se preparan.</p>
    <div class="loading-bar"></div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useGameStore } from '../stores/gameStore';

const router = useRouter();
const gameStore = useGameStore();

onMounted(async () => {
  // Simulamos carga y vamos al juego
  setTimeout(async () => {
    await gameStore.initializeGame();
    router.push('/game');
  }, 1500);
});
</script>

<style scoped>
.select-screen {
  height: 100vh;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  color: var(--color-gold);
}
</style>