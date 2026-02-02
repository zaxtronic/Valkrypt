<template>
  <div class="enemy-card" :class="{ dead: currentHp <= 0 }">
    <div class="enemy-visual">👹</div>
    <div class="enemy-info">
      <h3>{{ name }}</h3>
      <div class="hp-bar-enemy">
        <div class="fill" :style="{ width: hpPercent + '%' }"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
const props = defineProps(['name', 'currentHp', 'maxHp']);

const hpPercent = computed(() => (props.currentHp / props.maxHp) * 100);
</script>

<style scoped lang="scss">
.enemy-card {
  background: #1a0505;
  border: 2px solid var(--color-blood);
  padding: 20px;
  width: 220px;
  text-align: center;
  transition: 0.3s;
  
  &.dead { filter: grayscale(1); opacity: 0.6; border-color: #555; }
}

.enemy-visual { 
  font-size: 4rem; 
  margin-bottom: 10px;
  animation: float 3s infinite ease-in-out;
}

h3 { 
  color: var(--color-blood); 
  margin: 5px 0; 
  font-family: var(--font-title); 
}

.hp-bar-enemy {
  background: #000; height: 8px; border: 1px solid #555;
  .fill { background: var(--color-blood); height: 100%; transition: width 0.3s; }
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}
</style>