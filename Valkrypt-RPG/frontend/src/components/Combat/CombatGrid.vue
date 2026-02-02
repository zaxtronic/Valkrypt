<template>
  <div class="combat-grid">
    <slot></slot> <!-- Aquí se inyectarán las EnemyCards -->
  </div>
</template>

<style scoped>
.combat-grid {
  display: flex;
  justify-content: center;
  gap: 20px;
  padding: 40px 0;
  min-height: 300px;
  align-items: center;
}
</style>