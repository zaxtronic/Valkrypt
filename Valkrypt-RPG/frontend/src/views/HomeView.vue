<template>
  <div class="home-screen">
    <h1 class="title">VALKRYPT</h1>
    <h2 class="subtitle">La Sombra de Piedraprofunda</h2>
    
    <button class="btn-start" @click="startGame">
      ENTRAR EN LA OSCURIDAD
    </button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useGameStore } from '../stores/gameStore';

const router = useRouter();
const gameStore = useGameStore();

const startGame = async () => {
  await gameStore.initializeGame();
  router.push('/game'); // Ir a la pantalla de juego
};
</script>

<style scoped lang="scss">
.home-screen {
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle, #1a1a1a 0%, #000 100%);
  border: 10px solid var(--color-panel);
}

.title {
  font-family: var(--font-title);
  color: var(--color-gold);
  font-size: 5rem;
  margin: 0;
  text-shadow: 0 0 20px rgba(197, 160, 89, 0.3);
}

.subtitle {
  color: var(--color-blood);
  font-family: var(--font-title);
  margin-bottom: 3rem;
}

.btn-start {
  background: transparent;
  border: 2px solid var(--color-gold);
  color: var(--color-gold);
  padding: 1rem 3rem;
  font-size: 1.5rem;
  transition: 0.3s;
  
  &:hover {
    background: var(--color-gold);
    color: var(--color-void);
    box-shadow: 0 0 30px var(--color-gold);
  }
}
</style>