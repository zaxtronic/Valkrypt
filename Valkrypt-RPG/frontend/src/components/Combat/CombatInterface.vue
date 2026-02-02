<template>
  <div class="combat-arena">
    <h2 class="combat-title">¡COMBATE!</h2>
    
    <CombatGrid>
      <EnemyCard 
        v-for="enemy in combatStore.enemies" 
        :key="enemy.instanceId"
        :name="enemy.name"
        :currentHp="enemy.currentHp"
        :maxHp="enemy.stats.maxHp"
      />
    </CombatGrid>

    <div class="combat-log">
      <p v-for="(log, i) in combatStore.turnLog" :key="i">> {{ log }}</p>
    </div>

    <ActionMenu @action="handleAction" />
  </div>
</template>

<script setup>
import { useCombatStore } from '../../stores/combatStore';
import { useGameStore } from '../../stores/gameStore';
import CombatGrid from './CombatGrid.vue';
import EnemyCard from './EnemyCard.vue';
import ActionMenu from './ActionMenu.vue';

const combatStore = useCombatStore();
const gameStore = useGameStore();

const handleAction = (type) => {
  const hero = gameStore.party.find(p => p.stats.hp > 0);
  const target = combatStore.enemies[0]?.instanceId;
  
  if (hero && target) {
    combatStore.performAction(type, hero.id, target);
  }
};
</script>

<style scoped lang="scss">
.combat-arena {
  padding: 2rem;
  height: 100%;
  display: flex; flex-direction: column;
  background: linear-gradient(to bottom, #1a0505 0%, #000 100%);
}
.combat-title { text-align: center; color: var(--color-blood); font-family: var(--font-title); font-size: 3rem; margin: 0; }
.combat-log {
  background: rgba(0,0,0,0.8);
  border: 1px solid #333;
  height: 150px;
  overflow-y: auto;
  padding: 10px;
  color: #aaa;
  font-family: monospace;
}
</style>