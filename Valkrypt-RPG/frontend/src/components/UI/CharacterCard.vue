<template>
  <div 
    class="char-card" 
    :class="{ 
      'is-dead': isDead, 
      'is-active': isActive, 
      'taking-damage': flashDamage 
    }"
  >
    <div class="avatar-wrapper">
      <div class="class-icon" :class="char.role.toLowerCase()">
        {{ getIcon(char.role) }}
      </div>
      <div class="level-badge">{{ char.level || 1 }}</div>
    </div>

    <div class="char-details">
      <div class="header-row">
        <span class="char-name">{{ char.name }}</span>
        <span class="char-role">{{ char.role }}</span>
      </div>
      
      <div class="vital-stats">
        <div class="bar-group">
          <div class="bar-meta">
            <span class="bar-label">VITALIDAD</span>
            <span class="bar-values">{{ char.stats.hp }} / {{ char.stats.maxHp }}</span>
          </div>
          <div class="bar-track hp-track">
            <div 
              class="bar-fill hp-fill" 
              :style="{ width: hpPercent + '%' }"
              :class="{ 'low-hp': hpPercent < 30 }"
            >
              <div class="fill-glint"></div>
            </div>
          </div>
        </div>

        <div v-if="hasCorruption" class="bar-group corruption">
          <div class="bar-meta">
            <span class="bar-label">CORRUPCIÓN</span>
            <span class="bar-values">{{ char.stats.corruption }}%</span>
          </div>
          <div class="bar-track corruption-track">
            <div 
              class="bar-fill corruption-fill" 
              :style="{ width: char.stats.corruption + '%' }"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="isActive" class="active-pointer">▶</div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';

const props = defineProps({
  char: Object,
  isActive: Boolean
});

const flashDamage = ref(false);

const isDead = computed(() => props.char.stats.hp <= 0);
const hpPercent = computed(() => Math.max(0, (props.char.stats.hp / props.char.stats.maxHp) * 100));
const hasCorruption = computed(() => props.char.stats.corruption !== undefined);

// Efecto visual cuando baja la vida
watch(() => props.char.stats.hp, (newVal, oldVal) => {
  if (newVal < oldVal) {
    flashDamage.value = true;
    setTimeout(() => flashDamage.value = false, 400);
  }
});

const getIcon = (role) => {
  const icons = { 
    Warrior: '🛡️', Paladin: '⚔️', 
    Rogue: '🗡️', Ranger: '🏹',
    Arcanist: '🔮', Mage: '✨', 
    BloodCleric: '🩸', Support: '✚' 
  };
  return icons[role] || '👤';
};
</script>

<style scoped lang="scss">
$gold-card: #c5a059;
$hp-color: #8a1c1c;
$corruption-color: #7d3f98;

.char-card {
  display: flex; gap: 15px; padding: 12px;
  background: rgba(20, 20, 25, 0.8);
  border: 1px solid rgba($gold-card, 0.2);
  position: relative; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  clip-path: polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%);

  &:hover { border-color: $gold-card; background: rgba(30, 30, 35, 0.9); }
  &.is-active { border-color: $gold-card; box-shadow: inset 0 0 15px rgba($gold-card, 0.2); }
  &.is-dead { filter: grayscale(1) contrast(0.8); opacity: 0.6; }
  &.taking-damage { animation: hit-shake 0.4s; background: rgba(255, 0, 0, 0.2); }
}

.avatar-wrapper {
  position: relative;
  .class-icon {
    width: 50px; height: 50px; background: #000;
    border: 1px solid $gold-card; display: flex;
    align-items: center; justify-content: center; font-size: 1.5rem;
  }
  .level-badge {
    position: absolute; bottom: -5px; right: -5px;
    background: $gold-card; color: #000; font-size: 0.6rem;
    padding: 2px 5px; font-weight: bold; font-family: sans-serif;
  }
}

.char-details { flex: 1; display: flex; flex-direction: column; gap: 8px; }

.header-row {
  display: flex; justify-content: space-between; align-items: baseline;
  .char-name { color: #fff; font-family: 'Cinzel', serif; font-size: 0.9rem; letter-spacing: 1px; }
  .char-role { color: #666; font-size: 0.65rem; text-transform: uppercase; }
}

.bar-group {
  margin-bottom: 6px;
  .bar-meta {
    display: flex; justify-content: space-between; margin-bottom: 2px;
    .bar-label { font-size: 0.55rem; color: #555; font-weight: bold; }
    .bar-values { font-size: 0.6rem; color: #aaa; }
  }
}

.bar-track { height: 6px; background: #050505; border: 1px solid #222; position: relative; }
.bar-fill {
  height: 100%; transition: width 0.8s ease-out; position: relative; overflow: hidden;
  &.hp-fill { background: $hp-color; &.low-hp { background: #ff0000; animation: pulse-low 1s infinite; } }
  &.corruption-fill { background: $corruption-color; }
}

.fill-glint {
  position: absolute; top: 0; left: 0; width: 100%; height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
  transform: translateX(-100%); animation: glint 4s infinite;
}

.active-pointer {
  position: absolute; left: -20px; top: 50%; transform: translateY(-50%);
  color: $gold-card; animation: blink 1s infinite;
}

@keyframes glint { 100% { transform: translateX(100%); } }
@keyframes hit-shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}
@keyframes pulse-low { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }
</style>