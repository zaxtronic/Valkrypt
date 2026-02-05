<template>
  <div class="corruption-container" :class="{ 'high-instability': level > 75 }">
    <div class="header-row">
      <span class="label">INFLUENCIA DE LA DISFORMIDAD</span>
      <span class="percentage" :style="{ color: getColor }">{{ level }}%</span>
    </div>

    <div class="meter-wrapper">
      <div class="meter-glow" :style="{ opacity: level / 100, backgroundColor: getColor }"></div>
      
      <div class="meter-track">
        <div 
          class="meter-fill" 
          :style="{ 
            width: level + '%', 
            background: getGradient,
            boxShadow: `0 0 20px ${getColor}`
          }"
        >
          <div class="fill-shine"></div>
        </div>
      </div>
    </div>

    <div class="status-footer">
      <span class="status-text" :style="{ color: getColor }">{{ getStatusMessage }}</span>
      <div class="warning-icon" v-if="level > 85">⚠️</div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({ 
  level: { type: Number, default: 0 } 
});

// Colores basados en el nivel de peligro
const getColor = computed(() => {
  if (props.level < 30) return '#4ecdc4'; // Turquesa estable
  if (props.level < 60) return '#9b59b6'; // Violeta mágico
  if (props.level < 85) return '#e67e22'; // Naranja inestable
  return '#ff0000'; // Rojo crítico
});

// Degradado dinámico para la barra
const getGradient = computed(() => {
  return `linear-gradient(90deg, #222 0%, ${getColor.value} 100%)`;
});

const getStatusMessage = computed(() => {
  if (props.level < 30) return "REALIDAD ESTABLE";
  if (props.level < 60) return "FLUCTUACIONES DETECTADAS";
  if (props.level < 85) return "DISFORMIDAD CRÍTICA";
  return "COLAPSO INMINENTE";
});
</script>

<style scoped lang="scss">
.corruption-container {
  margin: 25px 0;
  padding: 15px;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.5s ease;

  &.high-instability {
    animation: glitch-vibration 0.2s infinite;
    border-color: rgba(255, 0, 0, 0.3);
  }
}

.header-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 8px;
  
  .label {
    font-family: 'Cinzel', serif;
    font-size: 0.7rem;
    letter-spacing: 2px;
    color: #888;
  }
  
  .percentage {
    font-family: 'Cinzel Decorative', cursive;
    font-size: 1.1rem;
    font-weight: bold;
    text-shadow: 0 0 10px currentColor;
  }
}

.meter-wrapper {
  position: relative;
  height: 12px;
  display: flex;
  align-items: center;
}

.meter-track {
  width: 100%;
  height: 6px;
  background: #0a0a0c;
  border: 1px solid #222;
  overflow: hidden;
  position: relative;
  z-index: 2;
}

.meter-fill {
  height: 100%;
  transition: width 1.5s cubic-bezier(0.23, 1, 0.32, 1);
  position: relative;
}

.fill-shine {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.2) 50%,
    transparent 100%
  );
  animation: sweep 3s infinite linear;
}

.meter-glow {
  position: absolute;
  width: 100%;
  height: 100%;
  filter: blur(15px);
  z-index: 1;
  transition: all 1s ease;
}

.status-footer {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
  
  .status-text {
    font-size: 0.65rem;
    letter-spacing: 3px;
    font-weight: bold;
    text-transform: uppercase;
  }
}

/* ANIMACIONES */
@keyframes sweep {
  from { transform: translateX(-100%); }
  to { transform: translateX(100%); }
}

@keyframes glitch-vibration {
  0% { transform: translate(0); }
  25% { transform: translate(1px, -1px); }
  50% { transform: translate(-1px, 1px); }
  75% { transform: translate(1px, 1px); }
  100% { transform: translate(0); }
}
</style>