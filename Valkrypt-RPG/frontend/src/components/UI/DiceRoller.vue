<template>
  <transition name="dice-fade">
    <div v-if="rolling || showResult" class="dice-container">
      <div class="dice-shroud"></div>
      
      <div class="dice-wrapper" :class="{ 'shake': rolling, 'success': isCritical, 'fail': isFumble }">
        <div class="dice-glow"></div>
        
        <div class="die-face">
          <svg class="d20-svg" viewBox="0 0 100 100">
            <polygon points="50,5 95,25 95,75 50,95 5,75 5,25" class="die-shape" />
            <path d="M50,5 L50,95 M5,25 L95,25 M5,75 L95,75 M50,5 L5,75 M50,5 L95,75 M50,95 L5,25 M50,95 L95,25" class="die-lines" />
          </svg>
          
          <span class="die-number" :class="{ 'rolling-blur': rolling }">
            {{ currentDisplayNumber }}
          </span>
        </div>

        <transition name="label-pop">
          <div v-if="showResult" class="result-label" :class="resultClass">
            {{ resultText }}
          </div>
        </transition>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, watch, computed } from 'vue';

const props = defineProps(['rolling', 'result']);
const showResult = ref(false);
const currentDisplayNumber = ref('?');

// Simulación de números aleatorios rápidos mientras gira
let interval = null;

const isCritical = computed(() => props.result === 20);
const isFumble = computed(() => props.result === 1);

const resultText = computed(() => {
  if (isCritical.value) return "¡CRÍTICO!";
  if (isFumble.value) return "PIFIA...";
  return "RESULTADO";
});

const resultClass = computed(() => ({
  'text-gold': isCritical.value,
  'text-red': isFumble.value
}));

watch(() => props.rolling, (isRolling) => {
  if (isRolling) {
    showResult.value = false;
    interval = setInterval(() => {
      currentDisplayNumber.value = Math.floor(Math.random() * 20) + 1;
    }, 50);
  } else {
    clearInterval(interval);
    currentDisplayNumber.value = props.result;
    showResult.value = true;
    
    // Auto-ocultar después de 2 segundos si quieres que sea fluido
    setTimeout(() => {
      if (!props.rolling) showResult.value = false;
    }, 2500);
  }
});
</script>

<style scoped lang="scss">
.dice-container {
  position: fixed; inset: 0;
  display: flex; justify-content: center; align-items: center;
  z-index: 2000; pointer-events: none;
}

.dice-shroud {
  position: absolute; inset: 0;
  background: radial-gradient(circle, rgba(0,0,0,0) 0%, rgba(0,0,0,0.8) 100%);
  backdrop-filter: blur(2px);
}

.dice-wrapper {
  position: relative; width: 180px; height: 180px;
  display: flex; justify-content: center; align-items: center;
  
  &.shake { animation: extreme-shake 0.1s infinite; }
  &.success { .die-shape { fill: rgba(197, 160, 89, 0.2); stroke: #ffd700; filter: drop-shadow(0 0 20px #ffd700); } }
  &.fail { .die-shape { fill: rgba(138, 28, 28, 0.2); stroke: #ff4444; filter: drop-shadow(0 0 20px #ff4444); } }
}

.die-face {
  position: relative; width: 100%; height: 100%;
  display: flex; justify-content: center; align-items: center;
}

.d20-svg {
  position: absolute; width: 100%; height: 100%;
  .die-shape { fill: rgba(15, 15, 18, 0.9); stroke: var(--color-gold, #c5a059); stroke-width: 2; transition: 0.3s; }
  .die-lines { fill: none; stroke: rgba(255,255,255,0.1); stroke-width: 1; }
}

.die-number {
  font-family: 'Cinzel Decorative', serif;
  font-size: 4rem; font-weight: 900; color: #fff;
  z-index: 10; text-shadow: 0 0 15px rgba(0,0,0,1);
  &.rolling-blur { filter: blur(2px); opacity: 0.7; }
}

.result-label {
  position: absolute; bottom: -40px;
  font-family: 'Cinzel', serif; font-size: 1.2rem;
  letter-spacing: 4px; font-weight: bold;
  text-shadow: 0 0 10px rgba(0,0,0,1);
  
  &.text-gold { color: #ffd700; }
  &.text-red { color: #ff4444; }
}

.dice-glow {
  position: absolute; width: 120%; height: 120%;
  background: radial-gradient(circle, rgba(197, 160, 89, 0.15) 0%, transparent 70%);
  border-radius: 50%; animation: pulse 2s infinite;
}

/* ANIMACIONES */
@keyframes extreme-shake {
  0% { transform: translate(2px, 1px) rotate(0deg); }
  20% { transform: translate(-1px, -2px) rotate(-1deg); }
  40% { transform: translate(-3px, 0px) rotate(1deg); }
  60% { transform: translate(3px, 2px) rotate(0deg); }
  80% { transform: translate(-1px, -1px) rotate(1deg); }
  100% { transform: translate(1px, -2px) rotate(-1deg); }
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 0.5; }
  50% { transform: scale(1.1); opacity: 0.8; }
}

.dice-fade-enter-active, .dice-fade-leave-active { transition: opacity 0.5s; }
.dice-fade-enter-from, .dice-fade-leave-to { opacity: 0; }

.label-pop-enter-active { animation: label-in 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
@keyframes label-in { from { transform: translateY(20px) scale(0); opacity: 0; } to { transform: translateY(0) scale(1); opacity: 1; } }
</style>