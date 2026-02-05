<template>
  <div class="game-over-viewport">
    <div class="fx-layer blood-vignette"></div>
    <div class="fx-layer grain"></div>
    
    <div class="ash-container">
      <div v-for="n in 40" :key="n" class="ash-particle"></div>
    </div>

    <div class="content-wrapper">
      <header class="death-header">
        <div class="line top"></div>
        <h1 class="glitch-text" data-text="HAS MUERTO">HAS MUERTO</h1>
        <div class="line bottom"></div>
      </header>

      <div class="death-narrative">
        <p class="fade-in-text">La oscuridad de Valkrypt reclama tu alma.</p>
        <p class="sub-text">Tu eco se desvanece en el vacío del tiempo...</p>
      </div>

      <div class="action-zone">
        <button class="rebirth-btn" @click="restart">
          <span class="btn-bg"></span>
          <span class="btn-text">RENACER</span>
          <div class="btn-border"></div>
        </button>
        
        <button class="abandon-btn" @click="goToMenu">
          ABANDONAR EL DESTINO
        </button>
      </div>
    </div>

    <svg style="display: none;">
      <defs>
        <filter id="death-glitch">
          <feRGBButtons dx="2" dy="0" />
          <feColorMatrix type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" />
        </filter>
      </defs>
    </svg>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// Lógica de reinicio: Limpiamos estados si es necesario antes de recargar
const restart = () => {
  // Aquí podrías llamar a gameStore.resetGame() si usas Pinia
  window.location.href = '/game'; 
};

const goToMenu = () => {
  router.push('/');
};

onMounted(() => {
  // Podrías añadir un efecto de sonido de muerte aquí
  // const deathAudio = new Audio('/sounds/death_bell.mp3');
  // deathAudio.play();
});
</script>

<style scoped lang="scss">
@use "sass:math";

/* VARIABLES LOCALES (Mantiene coherencia con tu GameView) */
$c-blood: #8a1c1c;
$c-blood-dark: #3a0808;
$c-gold: #c5a059;
$f-title: 'Cinzel', serif;
$f-body: 'Cormorant Garamond', serif;

.game-over-viewport {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: radial-gradient(circle, #1a0505 0%, #000 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  color: #fff;
  font-family: $f-body;
}

/* EFECTOS AMBIENTALES */
.fx-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
}

.blood-vignette {
  background: radial-gradient(circle, transparent 40%, rgba(58, 8, 8, 0.9) 100%);
  animation: pulse-death 4s infinite ease-in-out;
}

.grain {
  opacity: 0.08;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}

/* CONTENIDO PRINCIPAL */
.content-wrapper {
  position: relative;
  z-index: 10;
  text-align: center;
  max-width: 600px;
}

.death-header {
  margin-bottom: 3rem;
  
  .line {
    height: 1px;
    background: linear-gradient(90deg, transparent, $c-blood, transparent);
    width: 100%;
    margin: 10px 0;
  }
  
  h1 {
    font-family: $f-title;
    font-size: 6rem;
    font-weight: 900;
    margin: 0;
    color: $c-blood;
    letter-spacing: 15px;
    position: relative;
    
    &.glitch-text::before {
      content: attr(data-text);
      position: absolute;
      left: -2px;
      text-shadow: 2px 0 #fff;
      top: 0;
      overflow: hidden;
      clip: rect(0, 900px, 0, 0); 
      animation: noise-anim 3s infinite linear alternate-reverse;
    }
  }
}

.death-narrative {
  margin-bottom: 4rem;
  .fade-in-text {
    font-size: 1.8rem;
    color: #ccc;
    animation: fadeIn 3s ease-out forwards;
  }
  .sub-text {
    font-size: 1.1rem;
    color: #666;
    font-style: italic;
    margin-top: 10px;
    opacity: 0;
    animation: fadeIn 3s ease-out 1.5s forwards;
  }
}

/* BOTONES */
.action-zone {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.rebirth-btn {
  position: relative;
  background: transparent;
  border: none;
  padding: 20px 60px;
  cursor: pointer;
  
  .btn-bg {
    position: absolute;
    inset: 0;
    background: $c-blood-dark;
    border: 1px solid $c-blood;
    transform: skewX(-15deg);
    transition: 0.3s;
  }
  
  .btn-text {
    position: relative;
    z-index: 2;
    color: #fff;
    font-family: $f-title;
    font-size: 1.4rem;
    letter-spacing: 4px;
  }

  .btn-border {
    position: absolute;
    inset: -5px;
    border: 1px solid rgba($c-blood, 0.3);
    transform: skewX(-15deg);
    transition: 0.5s;
  }

  &:hover {
    .btn-bg { background: $c-blood; }
    .btn-border { inset: 0; border-color: $c-gold; }
    .btn-text { text-shadow: 0 0 10px rgba(255,255,255,0.5); }
  }
}

.abandon-btn {
  background: transparent;
  border: none;
  color: #444;
  font-family: $f-title;
  letter-spacing: 2px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: 0.3s;
  
  &:hover { color: #888; text-decoration: underline; }
}

/* CENIZAS (PARTÍCULAS SASS) */
.ash-container {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.ash-particle {
  position: absolute;
  width: 3px;
  height: 3px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  animation: fall-ash linear infinite;
}

@for $i from 1 through 40 {
  .ash-particle:nth-child(#{$i}) {
    left: math.percentage(math.div(math.random(100), 100));
    top: -5%;
    animation-duration: (math.random(10) + 5) * 1s;
    animation-delay: -(math.random(10)) * 1s;
    opacity: math.div(math.random(5), 10);
  }
}

/* ANIMACIONES */
@keyframes pulse-death {
  0%, 100% { opacity: 0.8; }
  50% { opacity: 1; transform: scale(1.02); }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fall-ash {
  to { transform: translateY(105vh) translateX(50px) rotate(360deg); }
}

@keyframes noise-anim {
  $steps: 20;
  @for $i from 0 through $steps {
    #{math.percentage(math.div($i, $steps))} {
      clip: rect(math.random(100) + px, 9999px, math.random(100) + px, 0);
    }
  }
}

@media (max-width: 768px) {
  .death-header h1 { font-size: 3.5rem; letter-spacing: 5px; }
  .rebirth-btn { padding: 15px 40px; }
}
</style>