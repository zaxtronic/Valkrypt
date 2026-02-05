<template>
  <div class="choice-wrapper" :style="{ '--delay': index * 0.1 + 's' }">
    <button 
      class="choice-btn" 
      @click="$emit('choose')"
      @mouseenter="playHoverEffect"
    >
      <div class="choice-index">
        {{ formatIndex(index + 1) }}
      </div>

      <div class="content-body">
        <span class="choice-icon">❖</span>
        <span class="choice-text">{{ text }}</span>
      </div>

      <div class="glow-effect"></div>
      
      <div class="corner-accents"></div>
    </button>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  text: String,
  index: { type: Number, default: 0 } // Pasamos el índice desde el v-for del padre
});

defineEmits(['choose']);

const formatIndex = (num) => num.toString().padStart(2, '0');

const playHoverEffect = () => {
  // Aquí podrías disparar un sonido leve si tuvieras un AudioEngine
};
</script>

<style scoped lang="scss">
$gold: #c5a059;
$bg-btn: rgba(15, 15, 18, 0.9);

.choice-wrapper {
  opacity: 0;
  transform: translateX(-20px);
  animation: slideIn 0.5s forwards var(--delay);
  margin-bottom: 15px;
}

.choice-btn {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  min-height: 70px;
  background: $bg-btn;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-left: 3px solid #333;
  color: #ccc;
  cursor: pointer;
  padding: 0;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);

  &:hover {
    border-left-color: $gold;
    background: rgba($gold, 0.08);
    transform: translateX(10px);
    box-shadow: -10px 0 20px rgba(0, 0, 0, 0.5);

    .choice-index { color: $gold; background: rgba(0,0,0,0.8); }
    .choice-icon { color: #fff; transform: rotate(90deg); }
    .choice-text { color: #fff; letter-spacing: 1px; }
    .glow-effect { opacity: 1; left: 100%; }
  }

  &:active { transform: scale(0.98) translateX(5px); }
}

.choice-index {
  width: 60px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.4);
  font-family: 'Cinzel', serif;
  font-size: 0.8rem;
  color: #555;
  transition: all 0.3s;
  border-right: 1px solid rgba(255, 255, 255, 0.05);
}

.content-body {
  display: flex;
  align-items: center;
  padding: 0 25px;
  gap: 20px;
}

.choice-icon {
  font-size: 1rem;
  color: #444;
  transition: all 0.5s ease;
}

.choice-text {
  font-family: 'Cinzel', serif;
  font-size: 1.1rem;
  text-align: left;
  transition: all 0.3s;
}

.glow-effect {
  position: absolute;
  top: 0; left: -100%;
  width: 100%; height: 100%;
  background: linear-gradient(90deg, transparent, rgba($gold, 0.1), transparent);
  transition: left 0.6s ease;
  pointer-events: none;
  opacity: 0;
}

.corner-accents {
  &::before, &::after {
    content: '';
    position: absolute;
    width: 5px; height: 5px;
    border: 1px solid rgba($gold, 0.3);
  }
  &::before { top: 5px; right: 5px; border-bottom: 0; border-left: 0; }
  &::after { bottom: 5px; right: 5px; border-top: 0; border-left: 0; }
}

/* Animación de entrada escalonada */
@keyframes slideIn {
  to { opacity: 1; transform: translateX(0); }
}
</style>