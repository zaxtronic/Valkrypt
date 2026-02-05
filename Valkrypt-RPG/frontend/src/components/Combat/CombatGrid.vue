<template>
  <div class="combat-grid-container">
    <div class="battle-floor">
      <div class="inner-circle"></div>
      <div class="magic-runes"></div>
    </div>

    <div class="entities-layout">
      <slot></slot> </div>

    <div class="battle-mist"></div>
  </div>
</template>

<style scoped lang="scss">
$gold-faded: rgba(197, 160, 89, 0.1);

.combat-grid-container {
  position: relative;
  width: 100%;
  max-width: 1000px;
  min-height: 450px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  perspective: 1000px; // Clave para el efecto 3D
}

.battle-floor {
  position: absolute;
  bottom: 10%;
  width: 100%;
  height: 200px;
  background: radial-gradient(ellipse at center, rgba(40, 10, 10, 0.5) 0%, transparent 70%);
  transform: rotateX(60deg);
  z-index: 1;

  .inner-circle {
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    width: 80%; height: 80%;
    border: 2px solid $gold-faded;
    border-radius: 50%;
    box-shadow: 0 0 30px rgba(0,0,0,0.5);
  }

  .magic-runes {
    position: absolute;
    inset: 0;
    background-image: url('https://www.transparenttextures.com/patterns/dark-matter.png');
    opacity: 0.3;
  }
}

.entities-layout {
  position: relative;
  z-index: 5;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: 30px;
  width: 100%;
  padding-bottom: 50px;

  /* Animación de entrada para los enemigos que entren vía slot */
  :deep(.enemy-card) {
    transform-style: preserve-3d;
    animation: slide-up-in 0.6s cubic-bezier(0.23, 1, 0.32, 1) both;
    
    // Escalado por posición para dar profundidad
    &:nth-child(odd) { transform: translateZ(-20px) translateY(-10px); }
    &:nth-child(even) { transform: translateZ(20px); }
  }
}

.battle-mist {
  position: absolute;
  bottom: 0; left: 0; width: 100%; height: 100px;
  background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
  pointer-events: none;
  z-index: 6;
}

/* --- ANIMACIONES --- */
@keyframes slide-up-in {
  from {
    opacity: 0;
    transform: translateY(50px) rotateX(-20deg);
  }
  to {
    opacity: 1;
    transform: translateY(0) rotateX(0);
  }
}

/* Responsive: si hay muchos enemigos, los apilamos mejor */
@media (max-width: 768px) {
  .entities-layout {
    flex-wrap: wrap;
    gap: 15px;
  }
}
</style>