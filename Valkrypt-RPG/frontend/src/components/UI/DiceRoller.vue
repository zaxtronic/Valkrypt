<template>
  <div v-if="rolling" class="dice-overlay">
    <div class="die">{{ result || '?' }}</div>
  </div>
</template>

<script setup>
defineProps(['rolling', 'result']);
</script>

<style scoped lang="scss">
.dice-overlay {
  position: fixed;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 999;
}

.die {
  width: 100px; height: 100px;
  background: var(--color-panel);
  border: 3px solid var(--color-gold);
  color: var(--color-gold);
  display: flex; justify-content: center; align-items: center;
  font-size: 3rem;
  font-family: var(--font-title);
  box-shadow: 0 0 50px rgba(197, 160, 89, 0.5);
  animation: roll 0.5s ease-out;
}

@keyframes roll {
  0% { transform: rotate(0deg) scale(0.5); opacity: 0; }
  50% { transform: rotate(180deg) scale(1.2); }
  100% { transform: rotate(360deg) scale(1); opacity: 1; }
}
</style>