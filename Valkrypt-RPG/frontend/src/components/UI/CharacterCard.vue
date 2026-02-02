<template>
  <div class="char-card" :class="{ 'dead': char.stats.hp <= 0 }">
    <div class="icon">{{ getIcon(char.class) }}</div>
    <div class="info">
      <div class="name">{{ char.name }}</div>
      
      <!-- Barra de Vida -->
      <div class="bar-container hp">
        <div class="fill" :style="{ width: hpPercent + '%' }"></div>
        <span class="text">{{ char.stats.hp }} / {{ char.stats.maxHp }} HP</span>
      </div>

      <!-- Barra de Corrupción (Solo si tiene) -->
      <div v-if="char.stats.corruption !== undefined" class="bar-container corruption">
        <div class="fill" :style="{ width: char.stats.corruption + '%' }"></div>
        <span class="text">{{ char.stats.corruption }}% CORRUPCIÓN</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps(['char']);

const hpPercent = computed(() => {
  return (props.char.stats.hp / props.char.stats.maxHp) * 100;
});

const getIcon = (role) => {
  const icons = { Warrior: '🛡️', Rogue: '🗡️', Arcanist: '🔮', BloodCleric: '🩸' };
  return icons[role] || '👤';
};
</script>

<style scoped lang="scss">
.char-card {
  display: flex;
  align-items: center;
  background: var(--color-panel);
  border: 1px solid #333;
  padding: 10px;
  margin-bottom: 10px;
  transition: all 0.3s;

  &.dead { opacity: 0.5; filter: grayscale(1); }
}

.icon { font-size: 2rem; margin-right: 10px; }
.info { flex-grow: 1; }
.name { font-weight: bold; color: var(--color-gold); font-size: 0.9rem; }

.bar-container {
  background: #000;
  height: 12px;
  margin-top: 4px;
  position: relative;
  border: 1px solid #333;
  
  .fill { height: 100%; transition: width 0.5s ease; }
  .text { position: absolute; top: -1px; left: 4px; font-size: 9px; color: #fff; text-shadow: 1px 1px 1px #000; }
  
  &.hp .fill { background: var(--color-blood); }
  &.corruption .fill { background: var(--color-magic); }
}
</style>