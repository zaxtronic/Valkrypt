<template>
  <aside class="hud-panel" :class="{ 'in-combat': gameStore.isCombatMode }">
    <div class="hud-border-top"></div>
    
    <header class="hud-header">
      <div class="header-icon">⚔</div>
      <h3 class="hud-title">VANGUARDIA</h3>
      <div class="header-line"></div>
    </header>
    
    <div class="party-list-container custom-scrollbar">
      <div class="party-list">
        <CharacterCard 
          v-for="(char, index) in party" 
          :key="char.id || index" 
          :char="char"
          :is-active="char.id === gameStore.activeCharId"
        />
      </div>
    </div>

    <footer class="hud-footer">
      <div class="footer-divider"></div>
      <div class="status-summary">
        <div class="status-item">
          <span class="dot" :class="{ 'pulse': gameStore.isCombatMode }"></span>
          <span class="status-label">{{ gameStore.isCombatMode ? 'FASE DE ASALTO' : 'FASE DE EXPLORACIÓN' }}</span>
        </div>
      </div>
      
      <CorruptionMeter :level="averageCorruption" />
      
      <div class="party-stats-mini">
        <div class="mini-stat">
          <span class="stat-icon">❤</span>
          <span class="stat-val">{{ totalPartyHp }}% HP GRUPAL</span>
        </div>
      </div>
    </footer>
    
    <div class="hud-border-bottom"></div>
  </aside>
</template>

<script setup>
import { computed } from 'vue';
import { useGameStore } from '../stores/gameStore'; // Integración con el store
import CharacterCard from './CharacterCard.vue';
import CorruptionMeter from './CorruptionMeter.vue';

const props = defineProps(['party']);
const gameStore = useGameStore();

// Lógica de Corrupción Grupal
const averageCorruption = computed(() => {
  if (!props.party || !props.party.length) return 0;
  // Calculamos la presión de la disformidad sumando valores
  const total = props.party.reduce((sum, c) => sum + (c.stats?.corruption || 0), 0);
  return Math.min(100, Math.floor(total / props.party.length));
});

// Porcentaje de salud total del grupo
const totalPartyHp = computed(() => {
  if (!props.party || !props.party.length) return 0;
  const current = props.party.reduce((sum, c) => sum + (c.stats?.hp || 0), 0);
  const max = props.party.reduce((sum, c) => sum + (c.stats?.maxHp || 100), 0);
  return Math.floor((current / max) * 100);
});
</script>

<style scoped lang="scss">
// Variables locales inspiradas en Aethelgard
$panel-bg: rgba(10, 10, 12, 0.95);
$gold-dim: rgba(197, 160, 89, 0.6);
$gold-bright: #c5a059;

.hud-panel {
  width: 300px;
  height: 100vh;
  background: $panel-bg;
  border-right: 1px solid rgba($gold-dim, 0.3);
  display: flex;
  flex-direction: column;
  padding: 2rem 1rem;
  position: relative;
  box-shadow: 10px 0 30px rgba(0, 0, 0, 0.8);
  transition: all 0.4s ease;
  z-index: 10;

  &.in-combat {
    background: rgba(15, 5, 5, 0.98);
    border-right-color: rgba(#8a1c1c, 0.5);
  }
}

.hud-header {
  margin-bottom: 2rem;
  text-align: center;
  
  .header-icon {
    color: $gold-bright;
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
  }
  
  .hud-title {
    color: #fff;
    font-family: 'Cinzel Decorative', cursive;
    letter-spacing: 4px;
    font-size: 1.2rem;
    margin: 0;
  }
  
  .header-line {
    height: 1px;
    background: linear-gradient(90deg, transparent, $gold-dim, transparent);
    margin-top: 10px;
  }
}

.party-list-container {
  flex: 1;
  overflow-y: auto;
  margin: 0 -0.5rem;
  padding: 0 0.5rem;
  
  &.custom-scrollbar::-webkit-scrollbar { width: 3px; }
  &.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
  &.custom-scrollbar::-webkit-scrollbar-thumb { background: $gold-dim; }
}

.party-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.hud-footer {
  margin-top: auto;
  padding-top: 2rem;

  .footer-divider {
    height: 1px;
    background: rgba(255, 255, 255, 0.1);
    margin-bottom: 1.5rem;
  }
}

.status-summary {
  margin-bottom: 1rem;
  .status-item {
    display: flex;
    align-items: center;
    gap: 8px;
    
    .dot {
      width: 8px; height: 8px;
      border-radius: 50%;
      background: #4caf50;
      
      &.pulse {
        background: #f44336;
        box-shadow: 0 0 10px #f44336;
        animation: pulse-red 1.5s infinite;
      }
    }
    
    .status-label {
      font-size: 0.7rem;
      font-family: 'Cinzel', serif;
      color: #777;
      letter-spacing: 1px;
    }
  }
}

.party-stats-mini {
  margin-top: 15px;
  .mini-stat {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 0.7rem;
    color: #555;
    font-weight: bold;
    .stat-icon { color: #a54a4a; }
  }
}

// Marcos decorativos
.hud-border-top, .hud-border-bottom {
  position: absolute; left: 0; width: 100%; height: 4px;
  background: linear-gradient(90deg, $gold-bright, transparent);
  opacity: 0.3;
}
.hud-border-top { top: 0; }
.hud-border-bottom { bottom: 0; }

@keyframes pulse-red {
  0% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.2); }
  100% { opacity: 1; transform: scale(1); }
}
</style>