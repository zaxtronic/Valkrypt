<template>
  <button class="choice-btn" @click="$emit('choose')">
    <span class="icon">❖</span>
    <span class="text">{{ text }}</span>
  </button>
</template>

<script setup>
defineProps(['text']);
defineEmits(['choose']);
</script>

<style scoped lang="scss">
.choice-btn {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 1.2rem;
  margin-bottom: 1rem;
  background: linear-gradient(90deg, #1a1a1a 0%, #0d0d0d 100%);
  border: 1px solid #444;
  color: var(--color-gold);
  font-size: 1.1rem;
  transition: all 0.3s ease;
  text-align: left;

  &:hover {
    border-color: var(--color-gold);
    background: #252525;
    padding-left: 2rem;
    box-shadow: 0 0 15px rgba(197, 160, 89, 0.1);
    
    .icon { color: var(--color-blood); }
  }

  .icon {
    margin-right: 15px;
    font-size: 1.2rem;
    color: #555;
    transition: color 0.3s;
  }
}
</style>