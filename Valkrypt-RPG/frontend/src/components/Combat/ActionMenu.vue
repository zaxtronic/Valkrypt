<template>
  <div class="action-menu">
    <button class="btn-combat attack" @click="$emit('action', 'ATTACK')">
      ⚔️ ATACAR
    </button>
    <button class="btn-combat heal" @click="$emit('action', 'HEAL')">
      🩸 CURAR
    </button>
    <!-- Más acciones futuras: Magia, Objeto, Huir -->
  </div>
</template>

<script setup>
defineEmits(['action']);
</script>

<style scoped lang="scss">
.action-menu {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin-top: 20px;
}

.btn-combat {
  padding: 15px;
  font-size: 1.1rem;
  background: #111;
  border: 2px solid #444;
  color: #fff;
  transition: 0.2s;
  
  &:hover { transform: translateY(-2px); }
  
  &.attack { 
    border-color: var(--color-blood); 
    &:hover { background: var(--color-blood); }
  }
  
  &.heal { 
    border-color: var(--color-gold); 
    &:hover { background: var(--color-gold); color: #000; }
  }
}
</style>