<template>
  <div class="game-layout">
    <!-- Panel Izquierdo: HUD -->
    <CharacterHUD :party="gameStore.party" />

    <!-- Panel Central -->
    <main class="main-stage">
      <!-- MODO COMBATE -->
      <CombatInterface v-if="gameStore.isCombatMode" />

      <!-- MODO NARRATIVO -->
      <div v-else-if="gameStore.currentScene" class="narrative-container">
        <StoryText 
          :title="gameStore.currentScene.title" 
          :description="gameStore.currentScene.description" 
        />
        
        <div class="options-container">
          <ChoiceButton 
            v-for="(opt, idx) in gameStore.currentScene.options" 
            :key="idx"
            :text="opt.text"
            @choose="gameStore.chooseOption(opt)"
          />
        </div>
      </div>

      <div v-else class="loading">Cargando...</div>
    </main>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useGameStore } from '../stores/gameStore';
import CharacterHUD from '../components/UI/CharacterHUD.vue';
import CombatInterface from '../components/Combat/CombatInterface.vue';
import StoryText from '../components/Narrative/StoryText.vue';
import ChoiceButton from '../components/Narrative/ChoiceButton.vue';

const gameStore = useGameStore();

onMounted(() => {
  if (!gameStore.currentScene) gameStore.initializeGame();
});
</script>

<style scoped lang="scss">
.game-layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  height: 100vh;
  background-image: url('https://www.transparenttextures.com/patterns/dark-matter.png');
}
.main-stage {
  padding: 3rem;
  overflow-y: auto;
}
.narrative-container {
  max-width: 800px;
  margin: 0 auto;
  background: rgba(0,0,0,0.8);
  padding: 40px;
  border: 1px solid #333;
  box-shadow: 0 0 30px rgba(0,0,0,0.5);
}
</style>