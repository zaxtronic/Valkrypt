<template>
  <div class="select-container">
    <div class="header text-center">
      <h1 class="page-title">ELIGE TU DESTINO</h1>
    </div>

    <div class="container main-content">
      <!-- Misión -->
      <h3 class="step-title">1. LA MISIÓN</h3>
      <div class="campaign-card selected">
        <h4>CAPÍTULO 1: MINAS CORRUPTAS</h4>
        <p>Una grieta en la realidad. Goblins, cultistas y una anomalía que devora la luz.</p>
      </div>

      <!-- Selección Dinámica -->
      <div class="selection-header mt-5">
        <h3 class="step-title">2. EL GRUPO ({{ selected.length }}/4)</h3>
        <p class="text-muted">Haz clic en un personaje para añadirlo o quitarlo. Mínimo 1.</p>
      </div>

      <div class="char-grid">
        <div 
          v-for="char in roster" 
          :key="char.id" 
          class="char-select-card"
          :class="{ active: isSelected(char.id) }"
          @click="toggleChar(char)"
        >
          <div class="char-icon">{{ char.icon }}</div>
          <div class="char-info">
            <div class="c-name">{{ char.name }}</div>
            <div class="c-class">{{ char.class }}</div>
          </div>
          <!-- Check de selección visual -->
          <div class="selection-indicator" v-if="isSelected(char.id)">✅</div>
        </div>
      </div>

      <!-- Botón Comenzar -->
      <div class="footer-action text-end mt-5 pb-5">
        <button class="btn-start" :disabled="selected.length === 0" @click="launchGame">
          COMENZAR CON {{ selected.length }} HÉROES
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useGameStore } from '../stores/gameStore';

const router = useRouter();
const gameStore = useGameStore();
const selected = ref([]); // Array dinámico

const roster = [
  { id: 'kaelen', name: "Kaelen", class: 'Guerrero', icon: '🛡️', hp: 45, maxHp: 45 },
  { id: 'vax', name: "Vax", class: 'Pícaro', icon: '🗡️', hp: 28, maxHp: 28 },
  { id: 'elara', name: "Elara", class: 'Arcanista', icon: '🔮', hp: 22, maxHp: 22, corruption: 0 },
  { id: 'sorin', name: "Sorin", class: 'Clérigo', icon: '🩸', hp: 35, maxHp: 35 }
];

const isSelected = (id) => selected.value.find(c => c.id === id);

const toggleChar = (char) => {
  const index = selected.value.findIndex(c => c.id === char.id);
  if (index >= 0) {
    selected.value.splice(index, 1); // Quitar
  } else {
    if (selected.value.length < 4) {
      selected.value.push(char); // Añadir
    }
  }
};

const launchGame = async () => {
  // Aquí enviamos EXACTAMENTE los seleccionados, sean 1, 2, 3 o 4.
  // Clonamos el array para romper referencias
  const partyToStart = JSON.parse(JSON.stringify(selected.value));
  await gameStore.initializeGame(partyToStart);
  router.push('/game');
};
</script>

<style scoped lang="scss">
/* Estilos similares a los anteriores, ajustados para el grid */
.select-container { background: #0d0d0d; min-height: 100vh; padding-top: 80px; color: #ccc; }
.step-title { color: #c5a059; font-family: 'Cinzel Decorative'; border-bottom: 1px solid #333; margin-bottom: 20px;}
.campaign-card { border: 1px solid #c5a059; padding: 20px; background: #1a1a1a; }

.char-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px; }
.char-select-card {
  background: #151515; border: 1px solid #333; padding: 15px; display: flex; align-items: center; cursor: pointer; position: relative;
  &:hover { border-color: #888; }
  &.active { border-color: #c5a059; background: #222; box-shadow: 0 0 15px rgba(197, 160, 89, 0.2); }
}
.char-icon { font-size: 2.5rem; margin-right: 15px; }
.c-name { color: #e0e0e0; font-weight: bold; font-family: 'Cinzel Decorative'; }
.selection-indicator { position: absolute; top: 10px; right: 10px; font-size: 1.2rem; }

.btn-start {
  background: #8a1c1c; color: white; border: none; padding: 15px 40px; font-family: 'Cinzel Decorative'; font-size: 1.2rem; cursor: pointer;
  &:disabled { background: #333; cursor: not-allowed; opacity: 0.5; }
  &:hover:not(:disabled) { background: #a52a2a; box-shadow: 0 0 20px #a52a2a; }
}
</style>