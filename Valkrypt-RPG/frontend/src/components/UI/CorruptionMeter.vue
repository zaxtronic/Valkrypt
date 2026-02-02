<template>
  <div class="corruption-container">
    <span class="label">NIVEL DE DISFORMIDAD</span>
    <div class="meter-track">
      <div class="meter-fill" :style="{ width: level + '%', backgroundColor: getColor }"></div>
    </div>
    <span class="value">{{ level }}%</span>
  </div>
</template>

<script setup>
import { computed } from 'vue';
const props = defineProps({ level: { type: Number, default: 0 } });

const getColor = computed(() => {
  if (props.level < 30) return '#444';
  if (props.level < 70) return 'var(--color-magic)'; // Violeta
  return 'var(--color-blood)'; // Rojo peligro
});
</script>

<style scoped lang="scss">
.corruption-container {
  margin-top: 20px;
  text-align: center;
  font-family: var(--font-title);
  
  .label { color: var(--color-magic); font-size: 0.8rem; letter-spacing: 2px; }
  
  .meter-track {
    height: 6px;
    background: #111;
    border: 1px solid #333;
    margin: 5px 0;
    position: relative;
    overflow: hidden;
  }
  
  .meter-fill {
    height: 100%;
    transition: width 1s ease-in-out;
    box-shadow: 0 0 10px currentColor;
  }
  
  .value { color: #666; font-size: 0.8rem; }
}
</style>