<template>
  <aside class="hud-panel">
    <h3 class="hud-title">GRUPO</h3>
    
    <div class="party-list">
      <!-- Importante: Asegúrate de que CharacterCard.vue exista -->
      <CharacterCard 
        v-for="char in party" 
        :key="char.id" 
        :char="char" 
      />
    </div>

    <!-- Medidor Global de Corrupción (Ejemplo: Promedio o del personaje activo) -->
    <CorruptionMeter :level="averageCorruption" />
  </aside>
</template>

<script setup>
import { computed } from 'vue';
import CharacterCard from './CharacterCard.vue';
import CorruptionMeter from './CorruptionMeter.vue';

const props = defineProps(['party']);

const averageCorruption = computed(() => {
  if (!props.party.length) return 0;
  // Sumamos la corrupción de los Arcanistas (si los hay)
  const total = props.party.reduce((sum, c) => sum + (c.stats.corruption || 0), 0);
  return Math.min(100, total);
});
</script>

<style scoped lang="scss">
.hud-panel {
  background: #0e0e0e;
  border-right: 2px solid var(--color-gold);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.hud-title {
  color: var(--color-text);
  text-align: center;
  font-family: var(--font-title);
  border-bottom: 1px solid #333;
  padding-bottom: 10px;
  margin-bottom: 20px;
}
</style>