<template>
  <div class="action-panel">
    <div class="action-header">ORDENES DE COMBATE</div>
    
    <div class="action-grid">
      <button 
        class="action-btn attack" 
        @click="$emit('action', 'ATTACK')"
        title="Atacar con el arma principal (Tecla: A)"
      >
        <div class="btn-visual">
          <span class="icon">⚔️</span>
          <span class="hotkey">A</span>
        </div>
        <div class="btn-label">ATACAR</div>
        <div class="btn-glow"></div>
      </button>

      <button 
        class="action-btn skill" 
        @click="$emit('action', 'SKILL')"
        title="Usar habilidad especial (Tecla: S)"
      >
        <div class="btn-visual">
          <span class="icon">🔮</span>
          <span class="hotkey">S</span>
        </div>
        <div class="btn-label">HABILIDAD</div>
        <div class="btn-glow"></div>
      </button>

      <button 
        class="action-btn item" 
        @click="$emit('action', 'ITEM')"
        title="Usar consumible (Tecla: I)"
      >
        <div class="btn-visual">
          <span class="icon">🧪</span>
          <span class="hotkey">I</span>
        </div>
        <div class="btn-label">OBJETO</div>
        <div class="btn-glow"></div>
      </button>

      <button 
        class="action-btn defend" 
        @click="$emit('action', 'DEFEND')"
        title="Reducir daño recibido (Tecla: D)"
      >
        <div class="btn-visual">
          <span class="icon">🛡️</span>
          <span class="hotkey">D</span>
        </div>
        <div class="btn-label">DEFENDER</div>
        <div class="btn-glow"></div>
      </button>
    </div>

    <div class="action-footer">
      <div class="mana-preview">
        <div class="mana-dot" v-for="i in 3" :key="i"></div>
        <span class="mana-text">PUNTOS DE ACCIÓN</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';

const emit = defineEmits(['action']);

// Lógica de Hotkeys para que el combate sea fluido
const handleKeyDown = (e) => {
  const key = e.key.toLowerCase();
  if (key === 'a') emit('action', 'ATTACK');
  if (key === 's') emit('action', 'SKILL');
  if (key === 'i') emit('action', 'ITEM');
  if (key === 'd') emit('action', 'DEFEND');
};

onMounted(() => window.addEventListener('keydown', handleKeyDown));
onUnmounted(() => window.removeEventListener('keydown', handleKeyDown));
</script>

<style scoped lang="scss">
$gold: #c5a059;
$blood: #8a1c1c;
$magic: #7d3f98;

.action-panel {
  width: 100%;
  max-width: 600px;
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid rgba($gold, 0.2);
  padding: 15px;
  backdrop-filter: blur(10px);
  clip-path: polygon(0 15px, 15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%);
}

.action-header {
  font-size: 0.6rem;
  color: $gold;
  letter-spacing: 3px;
  margin-bottom: 12px;
  text-align: center;
  opacity: 0.8;
}

.action-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

.action-btn {
  position: relative;
  background: #0a0a0c;
  border: 1px solid #333;
  padding: 15px 5px;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;

  .btn-visual {
    position: relative;
    font-size: 1.5rem;
    
    .hotkey {
      position: absolute;
      top: -5px; right: -15px;
      font-size: 0.6rem;
      background: #222;
      color: #666;
      padding: 1px 4px;
      border-radius: 2px;
      border: 1px solid #444;
    }
  }

  .btn-label {
    font-family: 'Cinzel', serif;
    font-size: 0.65rem;
    color: #888;
    letter-spacing: 1px;
    font-weight: bold;
  }

  .btn-glow {
    position: absolute;
    inset: 0;
    background: radial-gradient(circle, rgba($gold, 0.15) 0%, transparent 70%);
    opacity: 0;
    transition: 0.3s;
  }

  &:hover {
    border-color: $gold;
    transform: translateY(-3px);
    .btn-label { color: #fff; }
    .btn-glow { opacity: 1; }
    .btn-visual .hotkey { color: $gold; border-color: $gold; }
  }

  /* Colores temáticos por acción */
  &.attack:hover { border-color: $blood; .btn-glow { background: radial-gradient(circle, rgba($blood, 0.2) 0%, transparent 70%); } }
  &.skill:hover { border-color: $magic; .btn-glow { background: radial-gradient(circle, rgba($magic, 0.2) 0%, transparent 70%); } }
  
  &:active { transform: translateY(0) scale(0.95); }
}

.action-footer {
  margin-top: 15px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  padding-top: 10px;
  
  .mana-preview {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    
    .mana-dot {
      width: 6px; height: 6px;
      background: $gold;
      border-radius: 50%;
      box-shadow: 0 0 5px $gold;
    }
    
    .mana-text {
      font-size: 0.55rem;
      color: #555;
      letter-spacing: 2px;
    }
  }
}

@media (max-width: 600px) {
  .action-grid { grid-template-columns: repeat(2, 1fr); }
}
</style>