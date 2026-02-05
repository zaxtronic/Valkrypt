<template>
  <div 
    class="enemy-card" 
    :class="{ 
      'is-dead': currentHp <= 0, 
      'is-target': isTarget,
      'taking-hit': wasHit 
    }"
    @click="$emit('select-target', id)"
  >
    <div v-if="isTarget" class="target-reticle"></div>

    <div class="enemy-visual-container">
      <div class="enemy-visual">{{ visual || '👹' }}</div>
      <div class="enemy-shadow"></div>
    </div>

    <div class="enemy-details">
      <h3 class="enemy-name">{{ name }}</h3>
      
      <div v-if="intent" class="enemy-intent" :title="intent.description">
        <span class="intent-icon">{{ intent.icon }}</span>
        <span class="intent-text">PREPARANDO {{ intent.type }}</span>
      </div>

      <div class="hp-section">
        <div class="hp-meta">
          <span class="hp-text">{{ currentHp }} / {{ maxHp }} HP</span>
        </div>
        <div class="hp-bar-enemy">
          <div 
            class="fill-bg" 
            :style="{ width: hpPercent + '%' }"
          ></div>
          <div 
            class="fill-main" 
            :style="{ width: hpPercent + '%' }"
            :class="{ 'critical-hp': hpPercent < 25 }"
          >
            <div class="blood-particles"></div>
          </div>
        </div>
      </div>
    </div>

    <div class="status-effects" v-if="statusEffects?.length">
      <span v-for="effect in statusEffects" :key="effect.id" class="status-badge">
        {{ effect.icon }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';

const props = defineProps({
  id: String,
  name: String,
  currentHp: Number,
  maxHp: Number,
  visual: String,
  intent: Object,
  isTarget: Boolean,
  statusEffects: Array
});

const emit = defineEmits(['select-target']);

const wasHit = ref(false);
const hpPercent = computed(() => Math.max(0, (props.currentHp / props.maxHp) * 100));

// Animación de daño cuando baja la HP
watch(() => props.currentHp, (newVal, oldVal) => {
  if (newVal < oldVal) {
    wasHit.value = true;
    setTimeout(() => wasHit.value = false, 500);
  }
});
</script>

<style scoped lang="scss">
$blood-red: #8a1c1c;
$target-gold: #c5a059;

.enemy-card {
  position: relative;
  background: linear-gradient(135deg, #1a0505 0%, #0a0a0a 100%);
  border: 1px solid rgba($blood-red, 0.4);
  padding: 25px 15px;
  width: 240px;
  cursor: url('../assets/cursors/attack.png'), crosshair;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  clip-path: polygon(10% 0, 90% 0, 100% 10%, 100% 90%, 90% 100%, 10% 100%, 0 90%, 0 10%);

  &:hover:not(.is-dead) {
    transform: translateY(-5px) scale(1.02);
    border-color: $blood-red;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.8);
  }

  &.is-target {
    border-color: $target-gold;
    box-shadow: 0 0 20px rgba($target-gold, 0.3);
  }

  &.is-dead {
    filter: grayscale(1) blur(1px);
    opacity: 0.4;
    cursor: default;
  }

  &.taking-hit {
    animation: monster-shake 0.4s cubic-bezier(.36,.07,.19,.97) both;
    background: rgba($blood-red, 0.3);
  }
}

.enemy-visual-container {
  position: relative;
  margin-bottom: 15px;
  
  .enemy-visual {
    font-size: 5rem;
    filter: drop-shadow(0 0 15px rgba(0,0,0,0.5));
    animation: enemy-float 4s infinite ease-in-out;
    z-index: 2;
  }
  
  .enemy-shadow {
    width: 60px; height: 10px;
    background: rgba(0,0,0,0.5);
    border-radius: 50%;
    margin: -10px auto 0;
    filter: blur(4px);
  }
}

.enemy-name {
  color: #fff;
  font-family: 'Cinzel Decorative', serif;
  font-size: 1.1rem;
  margin: 10px 0;
  text-shadow: 0 2px 4px #000;
}

.enemy-intent {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 15px;
  font-size: 0.7rem;
  color: $target-gold;
  letter-spacing: 1px;
}

.hp-section {
  .hp-meta {
    font-size: 0.7rem;
    color: #888;
    margin-bottom: 4px;
    font-family: 'Cinzel', serif;
  }
  
  .hp-bar-enemy {
    position: relative;
    height: 10px;
    background: #000;
    border: 1px solid #333;
    overflow: hidden;

    .fill-bg {
      position: absolute;
      height: 100%;
      background: #444;
      transition: width 1s ease-out;
    }

    .fill-main {
      position: absolute;
      height: 100%;
      background: linear-gradient(to right, $blood-red, #ff4444);
      transition: width 0.4s cubic-bezier(0, 0.6, 0.4, 1);
      box-shadow: 0 0 10px rgba($blood-red, 0.5);
      
      &.critical-hp {
        animation: hp-pulse 1s infinite;
      }
    }
  }
}

/* ANIMACIONES */
@keyframes enemy-float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-12px) rotate(2deg); }
}

@keyframes monster-shake {
  10%, 90% { transform: translate3d(-2px, 0, 0); }
  20%, 80% { transform: translate3d(4px, 0, 0); }
  30%, 50%, 70% { transform: translate3d(-6px, 0, 0); }
  40%, 60% { transform: translate3d(6px, 0, 0); }
}

@keyframes hp-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

.status-badge {
  display: inline-block;
  margin-top: 10px;
  background: rgba(0,0,0,0.6);
  padding: 4px;
  border-radius: 4px;
  font-size: 0.8rem;
}
</style>