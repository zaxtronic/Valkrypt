<template>
  <div class="game-over">
    <h1>HAS MUERTO</h1>
    <p>La oscuridad de Valkrypt reclama tu alma.</p>
    <button @click="restart">RENACER</button>
  </div>
</template>

<script setup>
const restart = () => window.location.href = '/';
</script>

<style scoped lang="scss">
.game-over {
  height: 100vh;
  background: black;
  color: var(--color-blood);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  
  h1 { font-size: 5rem; font-family: var(--font-title); margin: 0; }
  button { 
    margin-top: 2rem; 
    background: transparent; 
    border: 2px solid var(--color-blood); 
    color: var(--color-blood);
    padding: 1rem 2rem;
    &:hover { background: var(--color-blood); color: black; }
  }
}
</style>