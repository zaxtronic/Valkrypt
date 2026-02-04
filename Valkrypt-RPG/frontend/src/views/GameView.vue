<template>
  <div class="game-layout">
     <GameMenu @resume="closeMenu" />
    
    <!-- HUD IZQUIERDO (Personajes) -->
    <aside class="party-panel">
      <div class="panel-header">
        <h3>GRUPO</h3>
        <div class="divider"></div>
      </div>

      <div v-for="char in gameStore.party" :key="char.id" class="char-card">
        <!-- Icono de Clase -->
        <div class="char-avatar">
          <span v-if="char.class === 'Warrior'">🛡️</span>
          <span v-else-if="char.class === 'Rogue'">🗡️</span>
          <span v-else-if="char.class === 'Arcanist'">🔮</span>
          <span v-else-if="char.class === 'BloodCleric'">🩸</span>
          <span v-else>👤</span>
        </div>
        
        <!-- Info -->
        <div class="char-info">
          <div class="char-name">{{ char.name }}</div>
          <div class="char-meta">{{ char.class }} - Nvl 1</div>
          
          <!-- Barra de Vida -->
          <div class="bar-container">
            <div class="hp-bar-fill" :style="{width: (char.stats.hp / char.stats.maxHp * 100) + '%'}"></div>
            <span class="hp-text">{{ char.stats.hp }} / {{ char.stats.maxHp }}</span>
          </div>

          <!-- Barra de Corrupción (Solo Elara) -->
          <div v-if="char.stats.corruption !== undefined" class="bar-container corruption">
            <div class="corr-fill" :style="{width: char.stats.corruption + '%'}"></div>
          </div>
        </div>
      </div>
    </aside>

    <!-- ÁREA PRINCIPAL (Narrativa) -->
    <main class="main-stage">
      
      <div v-if="gameStore.isLoading" class="loading">
        <div class="spinner"></div>
      </div>

      <!-- ESCENA DE HISTORIA -->
      <div v-else-if="!gameStore.isCombatMode && gameStore.currentScene" class="narrative-box">
        <div class="content-frame">
          <h1 class="scene-title">{{ gameStore.currentScene.title }}</h1>
          <hr class="ornament">
          <div class="scene-description" v-html="gameStore.currentScene.description"></div>
          
          <div class="options-list">
            <button 
              v-for="(opt, index) in gameStore.currentScene.options" 
              :key="index"
              class="btn-option"
              @click="gameStore.chooseOption(opt)"
            >
              <span class="icon">❖</span> 
              <span class="text">{{ opt.text }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- ESCENA DE COMBATE (Placeholder Visual) -->
      <div v-else-if="gameStore.isCombatMode" class="combat-placeholder">
        <h1>⚔️ COMBATE INICIADO ⚔️</h1>
        <p>El sistema táctico se está cargando...</p>
        <button class="btn-option attack" @click="debugWin">Simular Victoria</button>
      </div>

    </main>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useGameStore } from '../stores/gameStore';

const gameStore = useGameStore();

onMounted(() => {
  gameStore.initializeGame();
});

const debugWin = () => {
    gameStore.returnToNarrative(true);
}
</script>

<style scoped lang="scss">
/* --- LAYOUT GENERAL --- */
.game-layout {
  padding-top: 60px;
  display: grid;
  grid-template-columns: 280px 1fr;
  height: 100vh;
  background-color: #050505;
  background-image: radial-gradient(circle at center, #1a1a1a 0%, #000 100%);
  color: #ccc;
  font-family: 'EB Garamond', serif;
}

/* --- HUD IZQUIERDO --- */
.party-panel {
  background: #0e0e0e;
  border-right: 3px solid #795f28;
  padding: 20px;
  box-shadow: 5px 0 20px rgba(0,0,0,0.8);
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.panel-header h3 {
  color: #c5a059;
  font-family: 'Cinzel Decorative', serif;
  text-align: center;
  margin: 0 0 10px 0;
  letter-spacing: 2px;
}

.divider { height: 1px; background: linear-gradient(90deg, transparent, #c5a059, transparent); margin-bottom: 15px; }

/* Tarjeta de Personaje */
.char-card {
  display: flex;
  align-items: center;
  background: #141414;
  border: 1px solid #333;
  padding: 10px;
  border-radius: 4px;
  transition: transform 0.2s;
  
  &:hover { border-color: #555; transform: translateX(5px); }
}

.char-avatar {
  font-size: 2rem;
  margin-right: 12px;
  filter: drop-shadow(0 0 5px rgba(197, 160, 89, 0.3));
}

.char-info { flex-grow: 1; }

.char-name { font-weight: bold; color: #e0e0e0; font-size: 1rem; line-height: 1.1; }
.char-meta { font-size: 0.75rem; color: #888; font-style: italic; margin-bottom: 4px; }

/* Barras de Vida/Recursos */
.bar-container {
  height: 10px;
  background: #222;
  border: 1px solid #000;
  position: relative;
  border-radius: 2px;
  overflow: hidden;
  
  &.corruption { margin-top: 2px; height: 4px; border: none; }
}

.hp-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #5a0f0f, #8a1c1c);
  transition: width 0.5s ease;
}

.corr-fill {
  height: 100%;
  background: #9b59b6;
  box-shadow: 0 0 5px #9b59b6;
}

.hp-text {
  position: absolute;
  top: 0; left: 0; width: 100%;
  text-align: center;
  font-size: 8px;
  line-height: 9px;
  color: #fff;
  text-shadow: 1px 1px 1px #000;
  font-family: sans-serif;
}

/* --- NARRATIVA CENTRAL --- */
.main-stage {
  padding: 40px;
  overflow-y: auto;
  display: flex;
  justify-content: center;
  /* Fondo de trama sutil para el área de texto */
  background-image: linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8)), url('https://www.transparenttextures.com/patterns/dark-matter.png');
}

.narrative-box {
  max-width: 800px;
  width: 100%;
  animation: fadeIn 0.8s ease-out;
}

.content-frame {
  background: rgba(20, 20, 20, 0.9);
  border: 1px solid #333;
  padding: 40px;
  border-radius: 2px;
  box-shadow: 0 0 30px rgba(0,0,0,0.5);
  position: relative;
}

/* Decoración esquinas doradas */
.content-frame::before {
  content: ""; position: absolute; top: 0; left: 0; right: 0; height: 2px;
  background: linear-gradient(90deg, transparent, #c5a059, transparent);
}

.scene-title {
  font-family: 'Cinzel Decorative', serif;
  color: #c5a059;
  font-size: 3rem;
  margin: 0;
  text-align: center;
  text-shadow: 0 2px 10px rgba(0,0,0,0.8);
}

.ornament { border: 0; height: 1px; background: #333; margin: 20px 0 30px 0; }

.scene-description {
  font-size: 1.3rem;
  line-height: 1.8;
  color: #dcdcdc;
  text-align: justify;
  margin-bottom: 40px;
}

/* Botones de Opción */
.options-list { display: flex; flex-direction: column; gap: 15px; }

.btn-option {
  background: linear-gradient(90deg, rgba(30,30,30,0.8) 0%, rgba(10,10,10,0.9) 100%);
  border: 1px solid #444;
  border-left: 4px solid #444;
  color: #c5a059;
  padding: 15px 20px;
  font-family: 'Cinzel Decorative', serif;
  font-size: 1.1rem;
  text-align: left;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex; align-items: center;

  .icon { margin-right: 15px; color: #666; transition: 0.3s; }

  &:hover {
    background: #252525;
    border-color: #c5a059;
    border-left-color: #c5a059;
    padding-left: 25px;
    box-shadow: 0 0 15px rgba(197, 160, 89, 0.1);
    
    .icon { color: #8a1c1c; transform: rotate(45deg); }
  }
  
  &.attack {
    border-color: #8a1c1c;
    color: #ff6b6b;
    &:hover { background: #300; }
  }
}

@keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
</style>