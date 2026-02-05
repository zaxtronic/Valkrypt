<template>
  <header class="game-hud">
    <div class="hud-background"></div>

    <div class="brand-section">
      <div class="logo-icon">❖</div>
      <h1 class="brand-text">VALKRYPT</h1>
    </div>

    <div class="game-info">
      <div class="info-location">
        <span class="label">UBICACIÓN</span>
        <span class="value">Las Minas Corruptas</span>
      </div>
      <div class="separator"></div>
      <div class="info-turn">
        <span class="label">TURNO</span>
        <span class="value">05</span>
      </div>
    </div>

    <nav class="system-controls">
      
      <button class="icon-btn" @click="toggleFullscreen" title="Pantalla Completa">
        <span v-if="isFullscreen">⤡</span>
        <span v-else>⤢</span>
      </button>

      <button 
        class="sys-btn save" 
        :class="{ 'saving': isSaving, 'saved': saveSuccess }" 
        @click="handleSave"
        :disabled="isSaving"
      >
        <span class="btn-icon" v-if="!isSaving && !saveSuccess">💾</span>
        <span class="btn-icon spin" v-if="isSaving">↻</span>
        <span class="btn-icon" v-if="saveSuccess">✔</span>
        <span class="btn-text">
          {{ saveText }}
        </span>
      </button>

      <button class="sys-btn" @click="loadGame">
        <span class="btn-icon">📂</span>
        <span class="btn-text">CARGAR</span>
      </button>
      
      <div class="v-divider"></div>

      <button class="sys-btn exit" @click="exitGame">
        <span class="btn-icon">✖</span>
        <span class="btn-text">ABANDONAR</span>
      </button>
    </nav>
  </header>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
// import { useGameStore } from '../stores/gameStore'; // Descomentar cuando tengas el store

const router = useRouter();
const emit = defineEmits(['resume']);

// Estado local para UI
const isFullscreen = ref(false);
const isSaving = ref(false);
const saveSuccess = ref(false);

// Texto dinámico del botón Guardar
const saveText = computed(() => {
  if (saveSuccess.value) return "GUARDADO";
  if (isSaving.value) return "ESCRIBIENDO...";
  return "GUARDAR";
});

// --- FUNCIONES ---

const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
    isFullscreen.value = true;
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
      isFullscreen.value = false;
    }
  }
};

const handleSave = async () => {
  if (isSaving.value) return;
  
  // Simulación de guardado asíncrono (API call)
  isSaving.value = true;
  saveSuccess.value = false;

  // Simulamos 1.5 segundos de "lag" de red/disco
  setTimeout(() => {
    isSaving.value = false;
    saveSuccess.value = true;
    
    // Resetear el estado de "Guardado" después de 2 segundos
    setTimeout(() => {
      saveSuccess.value = false;
    }, 2000);
  }, 1500);
};

const loadGame = () => {
  // Aquí podrías abrir un Modal en lugar de un alert
  console.log("Abriendo menú de carga...");
};

const exitGame = () => {
  if(confirm("⚠ ADVERTENCIA ⚠\n\nEstás a punto de abandonar la sesión.\nTodo progreso no guardado se perderá en el vacío.\n\n¿Confirmar salida?")) {
    router.push('/');
  }
};
</script>

<style scoped lang="scss">
/* --- VARIABLES (Coherencia con el resto del diseño) --- */
:root {
  --h-height: 70px;
  --c-bg-glass: rgba(10, 10, 12, 0.85);
  --c-gold: #c5a059;
  --c-gold-glow: rgba(197, 160, 89, 0.4);
  --c-blood: #8a1c1c;
  --c-text: #ccc;
  --font-rune: 'Cinzel Decorative', serif;
  --font-ui: 'Cinzel', serif;
}

/* --- ESTRUCTURA PRINCIPAL --- */
.game-hud {
  position: fixed; top: 0; left: 0; width: 100%; height: var(--h-height);
  z-index: 1000;
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 2rem;
  border-bottom: 1px solid rgba(197, 160, 89, 0.3);
  box-shadow: 0 5px 20px rgba(0,0,0,0.8);
  color: var(--c-text);
  font-family: var(--font-ui);
}

/* Fondo Glassmorphism */
.hud-background {
  position: absolute; inset: 0; z-index: -1;
  background: var(--c-bg-glass);
  backdrop-filter: blur(10px);
  /* Textura sutil de ruido */
  background-image: url("https://www.transparenttextures.com/patterns/stardust.png");
  opacity: 0.5;
}

/* --- MARCA (IZQUIERDA) --- */
.brand-section {
  display: flex; align-items: center; gap: 10px;
  color: var(--c-gold);
  text-shadow: 0 0 10px var(--c-gold-glow);
  cursor: default;
}

.logo-icon {
  font-size: 1.5rem;
  animation: pulse 4s infinite;
}

.brand-text {
  font-family: var(--font-rune);
  font-size: 1.6rem; margin: 0; letter-spacing: 3px; font-weight: 700;
  background: linear-gradient(to bottom, #ebd5a0, #c5a059);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
}

/* --- INFO JUEGO (CENTRO) --- */
.game-info {
  display: flex; align-items: center; gap: 20px;
  background: rgba(0,0,0,0.3);
  padding: 5px 20px;
  border: 1px solid rgba(255,255,255,0.05);
  border-radius: 4px;
  
  /* Esquinas cortadas (estilo sci-fi/fantasy) */
  clip-path: polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px);
}

.info-location, .info-turn {
  display: flex; flex-direction: column; align-items: center;
  line-height: 1.1;
}

.label { font-size: 0.6rem; color: #666; letter-spacing: 1px; }
.value { font-size: 0.9rem; color: #eee; font-weight: bold; letter-spacing: 1px; }

.separator { width: 1px; height: 25px; background: #444; }

/* --- CONTROLES (DERECHA) --- */
.system-controls {
  display: flex; align-items: center; gap: 12px;
}

/* Botones Base */
.sys-btn, .icon-btn {
  background: transparent;
  border: 1px solid #333;
  color: #999;
  font-family: var(--font-ui);
  font-size: 0.75rem;
  padding: 8px 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex; align-items: center; gap: 8px;
  position: relative; overflow: hidden;

  &:hover:not(:disabled) {
    border-color: var(--c-gold);
    color: var(--c-gold);
    background: rgba(197, 160, 89, 0.05);
    box-shadow: 0 0 15px rgba(197, 160, 89, 0.1);
  }

  &:active { transform: translateY(1px); }
  
  &:disabled { opacity: 0.7; cursor: wait; }
}

.icon-btn { padding: 8px 10px; font-size: 1.2rem; }

/* Botón Guardar (Estados Especiales) */
.sys-btn.save {
  min-width: 130px; justify-content: center;
  
  &.saving { border-color: #aaa; color: #fff; background: rgba(255,255,255,0.1); }
  &.saved { border-color: #4caf50; color: #4caf50; background: rgba(76, 175, 80, 0.1); }
}

/* Animación Spin para guardar */
.spin { display: inline-block; animation: spin 1s linear infinite; }

/* Botón Salir */
.sys-btn.exit {
  border-color: #3a1111; color: #a54a4a;
  &:hover {
    background: rgba(138, 28, 28, 0.2);
    border-color: #ff4444; color: #ffaaaa;
    box-shadow: 0 0 15px rgba(255, 68, 68, 0.2);
  }
}

.v-divider { width: 1px; height: 20px; background: #333; margin: 0 5px; }

/* --- RESPONSIVE --- */
@media (max-width: 768px) {
  .game-hud { padding: 0 10px; justify-content: space-between; }
  .brand-text { display: none; } /* Ocultar texto marca en móvil */
  .game-info { display: none; } /* Ocultar info en móvil si no cabe */
  .btn-text { display: none; } /* Solo iconos en móvil */
  .sys-btn.save { min-width: auto; }
}

/* --- ANIMACIONES --- */
@keyframes pulse { 0%, 100% { opacity: 0.5; } 50% { opacity: 1; text-shadow: 0 0 15px var(--c-gold); } }
@keyframes spin { 100% { transform: rotate(360deg); } }
</style>