<template>
  <div class="game-header">
    <div class="brand">VALKRYPT</div>
    
    <div class="menu-controls">
      <button class="menu-btn" @click="saveGame">💾 GUARDAR</button>
      <button class="menu-btn" @click="loadGame">📂 CARGAR</button>
      <button class="menu-btn resume" @click="$emit('resume')">▶ RESUME</button>
      <button class="menu-btn exit" @click="exitGame">❌ SALIR</button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
// import api from '../../services/api'; (Para guardar en backend luego)

const router = useRouter();
const emit = defineEmits(['resume']);

const saveGame = async () => {
  // TODO: Conectar con backend BD
  alert("Partida guardada en el Grimorio local (Simulación)");
};

const loadGame = () => {
  alert("Cargando la última pesadilla...");
};

const exitGame = () => {
  if(confirm("¿Abandonar la partida? El progreso no guardado se perderá.")) {
    router.push('/');
  }
};
</script>

<style scoped lang="scss">
.game-header {
  position: fixed; top: 0; left: 0; width: 100%; height: 60px;
  background: #0d0d0d; border-bottom: 2px solid #8a1c1c;
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 30px; z-index: 100;
  box-shadow: 0 5px 15px rgba(0,0,0,0.8);
}

.brand { font-family: 'Cinzel Decorative'; color: #c5a059; font-size: 1.5rem; letter-spacing: 2px; }

.menu-controls { display: flex; gap: 10px; }

.menu-btn {
  background: transparent; border: 1px solid #444; color: #aaa;
  padding: 5px 15px; font-family: 'Cinzel Decorative'; font-size: 0.8rem;
  transition: 0.3s;
  
  &:hover { border-color: #c5a059; color: #c5a059; }
  &.exit:hover { border-color: #8a1c1c; color: #8a1c1c; }
  &.resume { background: #c5a059; color: #000; font-weight: bold; border-color: #c5a059; }
}
</style>