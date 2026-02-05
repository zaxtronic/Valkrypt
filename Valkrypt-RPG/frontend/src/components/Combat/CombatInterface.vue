<template>
  <div class="combat-arena" :class="{ 'arena-shaking': combatStore.isEnemyTurn }">
    <div v-if="combatStore.isEnemyTurn" class="enemy-turn-overlay">
      <div class="warning-banner">EL ENEMIGO ACECHA...</div>
    </div>

    <h2 class="combat-title">
      <span class="blood-drip"></span>
      ENCUENTRO HOSTIL
    </h2>
    
    <div class="main-battlefield">
      <CombatGrid>
        <EnemyCard 
          v-for="enemy in combatStore.enemies" 
          :key="enemy.instanceId"
          :id="enemy.instanceId"
          :name="enemy.name"
          :currentHp="enemy.currentHp"
          :maxHp="enemy.stats.maxHp"
          :is-target="selectedTargetId === enemy.instanceId"
          @select-target="setTarget"
        />
      </CombatGrid>
    </div>

    <div class="combat-log" ref="logContainer">
      <div class="log-header">REGISTRO DE BATALLA</div>
      <div class="log-content">
        <p v-for="(log, i) in combatStore.turnLog" :key="i" class="log-entry">
          <span class="log-bullet">»</span> {{ log }}
        </p>
      </div>
    </div>

    <div class="actions-wrapper" :class="{ 'disabled-ui': combatStore.isLoading || combatStore.isEnemyTurn }">
      <div class="current-turn-info" v-if="activeHero">
        TURNO DE: <span class="hero-name">{{ activeHero.name }}</span>
      </div>
      
      <ActionMenu 
        :disabled="combatStore.isLoading || !selectedTargetId"
        @action="handleAction" 
      />
      
      <div class="target-hint" v-if="!selectedTargetId">
        ⚠ SELECCIONA UN OBJETIVO PARA ATACAR
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue';
import { useCombatStore } from '../../stores/combatStore';
import { useGameStore } from '../../stores/gameStore';
import CombatGrid from './CombatGrid.vue';
import EnemyCard from './EnemyCard.vue';
import ActionMenu from './ActionMenu.vue';

const combatStore = useCombatStore();
const gameStore = useGameStore();
const logContainer = ref(null);
const selectedTargetId = ref(null);

// El héroe que debe actuar ahora
const activeHero = computed(() => {
  return gameStore.party.find(p => p.stats.hp > 0); 
});

const setTarget = (id) => {
  selectedTargetId.value = id;
};

const handleAction = async (type) => {
  if (!activeHero.value || !selectedTargetId.value) return;
  
  // Ejecutamos la acción a través del store
  await combatStore.performAction(type, activeHero.value.id, selectedTargetId.value);
  
  // Si el enemigo muere, deseleccionamos
  const target = combatStore.enemies.find(e => e.instanceId === selectedTargetId.value);
  if (!target || target.currentHp <= 0) {
    selectedTargetId.value = null;
  }
};

// Autoscroll del Log cuando hay mensajes nuevos
watch(() => combatStore.turnLog.length, () => {
  nextTick(() => {
    if (logContainer.value) {
      logContainer.value.scrollTop = logContainer.value.scrollHeight;
    }
  });
});
</script>

<style scoped lang="scss">
$blood: #8a1c1c;
$gold: #c5a059;

.combat-arena {
  position: relative;
  height: 100vh;
  padding: 80px 2rem 2rem; // Espacio para el GameMenu superior
  display: flex;
  flex-direction: column;
  background: radial-gradient(circle at center, #2a0a0a 0%, #050505 100%);
  overflow: hidden;
  
  &.arena-shaking { animation: rumble 0.5s infinite; }
}

.combat-title {
  text-align: center;
  color: $blood;
  font-family: 'Cinzel Decorative', serif;
  font-size: 3.5rem;
  margin-bottom: 2rem;
  text-shadow: 0 0 20px rgba($blood, 0.5);
  letter-spacing: 10px;
}

.main-battlefield {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.combat-log {
  background: rgba(0, 0, 0, 0.85);
  border: 1px solid rgba($gold, 0.2);
  height: 140px;
  margin: 20px auto;
  width: 100%;
  max-width: 800px;
  overflow-y: auto;
  padding: 15px;
  box-shadow: inset 0 0 20px #000;

  .log-header {
    font-size: 0.6rem;
    color: $gold;
    letter-spacing: 2px;
    margin-bottom: 10px;
    border-bottom: 1px solid rgba($gold, 0.1);
  }

  .log-entry {
    color: #ccc;
    font-family: 'Courier New', monospace;
    font-size: 0.9rem;
    margin: 5px 0;
    line-height: 1.4;
    .log-bullet { color: $blood; font-weight: bold; }
  }
}

.actions-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  padding: 20px;
  background: rgba(0,0,0,0.4);
  border-top: 1px solid rgba(255,255,255,0.05);

  &.disabled-ui {
    filter: grayscale(1) brightness(0.5);
    pointer-events: none;
  }
}

.current-turn-info {
  font-family: 'Cinzel', serif;
  color: #888;
  font-size: 0.8rem;
  .hero-name { color: $gold; font-weight: bold; }
}

.target-hint {
  color: $gold;
  font-size: 0.7rem;
  letter-spacing: 2px;
  animation: pulse 1.5s infinite;
}

@keyframes rumble {
  0% { transform: translate(0,0); }
  25% { transform: translate(1px, 1px); }
  75% { transform: translate(-1px, -1px); }
}

@keyframes pulse { 0%, 100% { opacity: 0.5; } 50% { opacity: 1; } }
</style>