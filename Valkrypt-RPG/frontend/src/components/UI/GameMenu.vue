<template>
  <header class="game-hud" :class="{ 'in-combat': gameStore.isCombatMode }">
    <div class="hud-background"></div>
    <div class="scanline-effect"></div>

    <div class="brand-section" @mouseenter="showHint = true" @mouseleave="showHint = false">
      <div class="logo-container">
        <div class="logo-icon">❖</div>
        <div class="logo-ring"></div>
      </div>
      <div class="text-group">
        <h1 class="brand-text">VALKRYPT</h1>
        <span class="version-tag">ALPHA v0.8.2</span>
      </div>
      
      <transition name="fade-slide">
        <div v-if="showHint" class="brand-tooltip">
          <p>Reino de Aethelgard: Sesión Activa</p>
          <small>ID: {{ gameStore.gameId }}</small>
        </div>
      </transition>
    </div>

    <div class="game-info">
      <div class="info-block location">
        <span class="label">REGION ACTUAL</span>
        <div class="value-row">
          <span class="status-dot"></span>
          <span class="value">{{ currentLocation }}</span>
        </div>
      </div>
      
      <div class="v-separator"></div>
      
      <div class="info-block turn">
        <span class="label">CRONOLOGÍA</span>
        <div class="value-row">
          <span class="value">Turno {{ currentTurn }}</span>
        </div>
      </div>

      <div class="v-separator"></div>

      <div class="info-block state">
        <span class="label">ESTADO</span>
        <span class="value state-text" :class="gameStore.isCombatMode ? 'danger' : 'safe'">
          {{ gameStore.isCombatMode ? 'EN COMBATE' : 'EXPLORANDO' }}
        </span>
      </div>
    </div>

    <nav class="system-controls">
      
      <div class="utility-group">
        <button class="icon-btn" @click="toggleFullscreen" :title="isFullscreen ? 'Ventana' : 'Pantalla Completa'">
          <span class="icon">{{ isFullscreen ? '⤡' : '⤢' }}</span>
        </button>
      </div>

      <div class="v-divider"></div>

      <div class="action-group">
        <button 
          class="sys-btn save" 
          :class="{ 'saving': isSaving, 'saved': saveSuccess }" 
          @click="handleSave"
          :disabled="isSaving"
        >
          <div class="btn-bg"></div>
          <span class="btn-icon" v-if="!isSaving && !saveSuccess">💾</span>
          <span class="btn-icon spin" v-if="isSaving">↻</span>
          <span class="btn-icon pulse" v-if="saveSuccess">✔</span>
          <span class="btn-text">{{ saveText }}</span>
        </button>

        <button class="sys-btn load" @click="loadGame">
          <span class="btn-icon">📂</span>
          <span class="btn-text">CARGAR</span>
        </button>
      </div>

      <div class="v-divider"></div>

      <button class="sys-btn exit" @click="exitGame">
        <span class="btn-icon">✖</span>
        <span class="btn-text">SALIR</span>
      </button>
    </nav>
  </header>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useGameStore } from '../stores/gameStore';

const router = useRouter();
const gameStore = useGameStore();

// --- ESTADO LOCAL ---
const isFullscreen = ref(false);
const isSaving = ref(false);
const saveSuccess = ref(false);
const showHint = ref(false);

// --- PROPIEDADES COMPUTADAS ---
const currentLocation = computed(() => gameStore.currentScene?.location || "Las Minas Corruptas");
const currentTurn = computed(() => (gameStore.history?.length || 0) + 1);

const saveText = computed(() => {
  if (saveSuccess.value) return "CRÓNICA ESCRITA";
  if (isSaving.value) return "SELLANDO...";
  return "GUARDAR";
});

// --- MÉTODOS DE SISTEMA ---
const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
    isFullscreen.value = true;
  } else {
    document.exitFullscreen();
    isFullscreen.value = false;
  }
};

const handleSave = async () => {
  if (isSaving.value) return;
  isSaving.value = true;
  
  try {
    // Simulamos latencia de escritura en disco/DB
    await new Promise(r => setTimeout(r, 1200));
    
    localStorage.setItem('valkrypt_party_backup', JSON.stringify(gameStore.party));
    localStorage.setItem('valkrypt_scene_backup', JSON.stringify(gameStore.currentScene));
    
    saveSuccess.value = true;
    setTimeout(() => saveSuccess.value = false, 3000);
  } catch (e) {
    console.error("Error al salvar partida:", e);
  } finally {
    isSaving.value = false;
  }
};

const loadGame = () => {
  const data = localStorage.getItem('valkrypt_scene_backup');
  if (data) {
    gameStore.currentScene = JSON.parse(data);
    alert("Memoria restaurada con éxito.");
  }
};

const exitGame = () => {
  if (confirm("¿Abandonar Aethelgard? El progreso no guardado se desvanecerá.")) {
    gameStore.resetGame();
  }
};
</script>

<style scoped lang="scss">
$gold: #c5a059;
$blood: #8a1c1c;
$bg-glass: rgba(10, 10, 12, 0.92);

.game-hud {
  position: fixed; top: 0; left: 0; width: 100%; height: 80px;
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 40px; z-index: 2000;
  border-bottom: 2px solid rgba($gold, 0.2);
  transition: all 0.5s ease;

  &.in-combat {
    border-bottom-color: rgba($blood, 0.5);
    box-shadow: 0 0 30px rgba($blood, 0.2);
    .status-dot { background: $blood; box-shadow: 0 0 10px $blood; }
  }
}

.hud-background {
  position: absolute; inset: 0; z-index: -2;
  background: $bg-glass;
  backdrop-filter: blur(15px);
  background-image: url("https://www.transparenttextures.com/patterns/stardust.png");
}

.scanline-effect {
  position: absolute; inset: 0; z-index: -1;
  background: linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.1) 51%);
  background-size: 100% 4px; pointer-events: none; opacity: 0.3;
}

/* MARCA */
.brand-section {
  display: flex; align-items: center; gap: 15px; position: relative;
  
  .logo-container {
    position: relative; width: 45px; height: 45px;
    display: flex; align-items: center; justify-content: center;
    
    .logo-icon { font-size: 1.8rem; color: $gold; z-index: 2; animation: float 3s infinite ease-in-out; }
    .logo-ring {
      position: absolute; inset: 0; border: 1px solid rgba($gold, 0.3);
      border-radius: 50%; animation: spin 10s linear infinite;
    }
  }

  .text-group {
    display: flex; flex-direction: column;
    .brand-text {
      font-family: 'Cinzel Decorative', cursive; font-size: 1.8rem; margin: 0;
      background: linear-gradient(180deg, #fff 0%, $gold 100%);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
      filter: drop-shadow(0 0 10px rgba($gold, 0.3));
    }
    .version-tag { font-size: 0.6rem; color: #555; letter-spacing: 2px; }
  }
}

.brand-tooltip {
  position: absolute; top: 60px; left: 0; background: #1a1a1a;
  border: 1px solid $gold; padding: 10px; min-width: 200px;
  box-shadow: 0 10px 20px rgba(0,0,0,0.5); z-index: 10;
  p { margin: 0; font-size: 0.8rem; color: $gold; }
  small { color: #666; }
}

/* INFO JUEGO */
.game-info {
  display: flex; gap: 30px; align-items: center;
  background: rgba(0,0,0,0.5); padding: 10px 30px;
  border-radius: 8px; border: 1px solid rgba(255,255,255,0.05);
  clip-path: polygon(15px 0%, 100% 0%, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0% 100%, 0% 15px);

  .info-block {
    display: flex; flex-direction: column;
    .label { font-size: 0.65rem; color: #555; font-weight: bold; margin-bottom: 4px; }
    .value-row { display: flex; align-items: center; gap: 8px; }
    .value { font-size: 1rem; color: #fff; font-family: 'Cinzel', serif; }
    .status-dot { width: 6px; height: 6px; background: #4caf50; border-radius: 50%; }
    .state-text.danger { color: #ff4444; text-shadow: 0 0 10px rgba(255,0,0,0.3); }
  }
}

.v-separator { width: 1px; height: 30px; background: rgba(255,255,255,0.1); }

/* CONTROLES */
.system-controls {
  display: flex; align-items: center; gap: 15px;
  
  .sys-btn {
    position: relative; background: rgba(255,255,255,0.02);
    border: 1px solid #333; color: #aaa; padding: 10px 20px;
    font-family: 'Cinzel', serif; font-size: 0.75rem; cursor: pointer;
    overflow: hidden; transition: 0.3s;
    display: flex; align-items: center; gap: 10px;

    &:hover { border-color: $gold; color: #fff; background: rgba($gold, 0.05); }
    
    &.save.saved { border-color: #4caf50; color: #4caf50; }
    &.exit { border-color: #400; color: #a44; &:hover { background: rgba($blood, 0.1); border-color: #f44; } }
  }
}

.v-divider { width: 2px; height: 20px; background: #222; }

/* ANIMACIONES */
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
@keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
.spin { animation: spin 1s linear infinite; }
.pulse { animation: pulse 1s infinite; }
@keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.2); } 100% { transform: scale(1); } }

/* TRANSICIONES VUE */
.fade-slide-enter-active, .fade-slide-leave-active { transition: 0.3s ease; }
.fade-slide-enter-from, .fade-slide-leave-to { opacity: 0; transform: translateY(-10px); }

@media (max-width: 1200px) {
  .game-info, .version-tag, .btn-text { display: none; }
}
</style>