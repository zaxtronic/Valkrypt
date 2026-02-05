<template>
  <div class="valkrypt-home" @mousemove="handleMouseMove">
    <div class="ambient-overlay">
      <div class="fog"></div>
      <div class="ash-particles"></div>
    </div>

    <nav class="navbar navbar-expand-lg fixed-top" :class="{ 'scrolled': isScrolled }">
      <div class="container">
        <span class="navbar-brand">
          <i class="ra ra-sword-brandish"></i> VALKRYPT
        </span>
        <div class="collapse navbar-collapse justify-content-end">
          <ul class="navbar-nav">
            <li class="nav-item"><a href="#" class="nav-link">EL REINO</a></li>
            <li class="nav-item"><a href="#" class="nav-link">DISFORMIDAD</a></li>
            <li class="nav-item"><a href="#" class="nav-link">CÓDICE</a></li>
            <li v-if="isLoggedIn" class="nav-item">
              <a href="#" @click.prevent="logout" class="nav-link logout-link">ABANDONAR</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <header class="hero-section">
      <div class="parallax-bg" :style="parallaxStyle"></div>
      
      <div class="hero-content">
        <div class="rune-circle"></div>
        <h1 class="main-title" data-text="CRÓNICAS DE LA SOMBRA">CRÓNICAS DE LA SOMBRA</h1>
        <div class="divider-rune">♦ ❖ ♦</div>
        <p class="subtitle">
          "En la oscuridad de Valkrypt, la sangre es la única moneda que nunca se devalúa."
        </p>
        
        <div class="cta-wrapper">
          <button class="btn-rpg" @click="handleEnter">
            <span class="btn-inner">
              {{ isLoggedIn ? 'RETOMAR EL DESTINO' : 'CRUZAR EL UMBRAL' }}
            </span>
            <div class="btn-glow"></div>
          </button>
        </div>

        <div class="hero-stats">
          <div class="stat-item">
            <span class="count">1,204</span>
            <span class="label">Almas Perdidas</span>
          </div>
          <div class="stat-item">
            <span class="count text-red">89</span>
            <span class="label">Muertes Hoy</span>
          </div>
        </div>
      </div>
    </header>

    <section class="classes-section">
      <div class="container">
        <h2 class="section-title">ELIGE TU CONDENA</h2>
        <div class="row">
          <div class="col-md-3" v-for="cls in classes" :key="cls.name">
            <div class="class-card">
              <div class="card-bg" :style="{ backgroundImage: `url(${cls.img})` }"></div>
              <div class="card-overlay">
                <h3>{{ cls.name }}</h3>
                <p>{{ cls.desc }}</p>
                <span class="role-icon">{{ cls.icon }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="lore-section">
      <div class="container">
        <div class="parchment-box">
          <div class="wax-seal"></div>
          <h2 class="lore-header">DECRETO DEL BASTIÓN</h2>
          <p class="drop-cap">
            <strong>B</strong>ienvenido a Bastión Real. Aquí, la Guardia de Hierro vigila cada sombra y la magia se paga con la horca.
            Una grieta se ha abierto en las minas de <strong>Piedraprofunda</strong>. El Duque paga bien por el silencio, pero la Sombra paga mejor por tu alma.
          </p>
          <p>
            Tus dados están cargados, viajero. ¿Lograrás cerrar la puerta antes de que el Vacío nos devore, o te convertirás en otro monstruo de la oscuridad?
          </p>
          <div class="signature">
            - El Cronista Ciego
          </div>
        </div>
      </div>
    </section>

    <footer class="rpg-footer">
      <div class="runes-border">ᚠᚢᚦᚩᚱᚳ ᚷᚹᚺᚾᛁᛄ ᛇᛈᛉᛋ ᛏᛒᛖᛗᛚᛝ</div>
      <p>&copy; 2024 Valkrypt RPG System. Todos los derechos reservados en la sangre.</p>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const isLoggedIn = ref(false);
const isScrolled = ref(false);

// Datos simulados para las clases
const classes = [
  { name: 'Guerrero', desc: 'Acero mellado y honor olvidado.', icon: '⚔️', img: 'https://images.unsplash.com/photo-1598556834920-56e6d787033e?q=80&w=600&auto=format&fit=crop' },
  { name: 'Pícaro', desc: 'Una daga en la oscuridad vale más que mil palabras.', icon: '🗝️', img: 'https://images.unsplash.com/photo-1626245136979-d59b022b3f17?q=80&w=600&auto=format&fit=crop' },
  { name: 'Hechicero', desc: 'El poder tiene un precio: la cordura.', icon: '🔥', img: 'https://images.unsplash.com/photo-1542256844-3158d193359d?q=80&w=600&auto=format&fit=crop' },
  { name: 'Clérigo', desc: 'Hereje para la iglesia, santo para los pobres.', icon: '🩸', img: 'https://images.unsplash.com/photo-1632211603522-0d1939102641?q=80&w=600&auto=format&fit=crop' },
];

<<<<<<< HEAD
// Lógica de Parallax del Mouse
const mouseX = ref(0);
const mouseY = ref(0);

const handleMouseMove = (e) => {
  mouseX.value = e.clientX;
  mouseY.value = e.clientY;
};

const parallaxStyle = computed(() => {
  const x = (window.innerWidth - mouseX.value * 5) / 100;
  const y = (window.innerHeight - mouseY.value * 5) / 100;
  return { transform: `translate(${x}px, ${y}px) scale(1.1)` };
});

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50;
};

onMounted(() => {
  isLoggedIn.value = !!localStorage.getItem('token');
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});

const handleEnter = () => {
  if (isLoggedIn.value) router.push('/select');
  else router.push('/login');
=======
// Manejar clic en el botón principal
const handleEnter = () => {
  if (isLoggedIn.value) {
    router.push('/select'); 
  } else {
    router.push('/login'); 
  }
>>>>>>> 4a64156f464224e851556985ac770b42376f4415
};

const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  isLoggedIn.value = false;
  window.location.reload();
};
</script>

<style scoped lang="scss">
<<<<<<< HEAD
@import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700;900&family=Fauna+One&display=swap');

/* Variables CSS */
:root {
  --color-bg: #050505;
  --color-gold: #c5a059;
  --color-gold-dim: #7a6335;
  --color-blood: #8a0b0b;
  --color-blood-bright: #ff1a1a;
  --color-text: #dcdcdc;
  --font-title: 'Cinzel Decorative', serif;
  --font-body: 'Fauna One', serif;
}

/* Base */
.valkrypt-home {
  background-color: var(--color-bg);
  color: var(--color-text);
  font-family: var(--font-body);
  overflow-x: hidden;
  min-height: 100vh;
}

/* Navbar */
=======
>>>>>>> 4a64156f464224e851556985ac770b42376f4415
.navbar {
  padding: 1.5rem 0;
  transition: all 0.4s ease;
  z-index: 1000;
  
  &.scrolled {
    background: rgba(5, 5, 5, 0.95);
    padding: 0.8rem 0;
    border-bottom: 1px solid var(--color-gold-dim);
    box-shadow: 0 5px 20px rgba(0,0,0,0.8);
  }

  .navbar-brand {
    font-family: var(--font-title);
    color: var(--color-gold);
    font-size: 1.8rem;
    text-shadow: 0 0 10px rgba(197, 160, 89, 0.3);
  }

  .nav-link {
    font-family: var(--font-title);
    color: #888;
    margin-left: 2rem;
    position: relative;
    transition: 0.3s;
    font-size: 0.9rem;
    letter-spacing: 1px;

    &:hover {
      color: var(--color-text);
      text-shadow: 0 0 8px rgba(255,255,255,0.5);
      
      &::after { width: 100%; }
    }

    &::after {
      content: '';
      position: absolute;
      bottom: -5px;
      left: 0;
      width: 0;
      height: 1px;
      background: var(--color-blood);
      transition: width 0.3s;
    }

    &.logout-link {
      color: var(--color-blood);
      &:hover { color: var(--color-blood-bright); }
    }
  }
}

/* Hero Section */
.hero-section {
  position: relative;
<<<<<<< HEAD
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-bottom: 2px solid #111;

  .parallax-bg {
    position: absolute;
    top: 0; left: 0; width: 100%; height: 100%;
    /* Imagen de fondo oscura de fantasía */
    background: linear-gradient(to bottom, rgba(0,0,0,0.3), #050505),
                url('https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?q=80&w=1920&auto=format&fit=crop');
    background-size: cover;
    background-position: center;
    transition: transform 0.1s linear;
    z-index: 0;
  }

  .hero-content {
    position: relative;
    z-index: 2;
    text-align: center;
    max-width: 900px;
    padding: 0 20px;
=======
  height: 85vh;
  margin-top: 80px;
  background: url('https://www.transparenttextures.com/patterns/dark-matter.png'), radial-gradient(circle, #222 0%, #000 100%);
  border-bottom: 1px solid #333;
  
  .hero-overlay {
    background: rgba(0,0,0,0.5);
    height: 100%;
    display: flex; align-items: center; justify-content: center;
>>>>>>> 4a64156f464224e851556985ac770b42376f4415
  }

  .main-title {
    font-family: var(--font-title);
    font-size: 5rem;
    color: #e0e0e0;
    text-shadow: 0 5px 15px rgba(0,0,0,1);
    margin: 0;
    letter-spacing: 5px;
    position: relative;
    
    /* Efecto Glitch sutil */
    animation: glitch 5s infinite alternate;
  }

  .divider-rune {
    font-size: 2rem;
    color: var(--color-gold);
    margin: 1rem 0;
    opacity: 0.8;
  }

  .subtitle {
    font-size: 1.4rem;
    color: #aaa;
    margin-bottom: 3rem;
    font-style: italic;
    text-shadow: 0 2px 5px rgba(0,0,0,0.8);
  }
}

/* Botón RPG Avanzado */
.btn-rpg {
  background: transparent;
  border: none;
  position: relative;
  cursor: pointer;
  padding: 0;
  
  .btn-inner {
    display: block;
    padding: 18px 60px;
    background: linear-gradient(180deg, #2b0a0a, #1a0000);
    border: 1px solid var(--color-gold-dim);
    color: var(--color-gold);
    font-family: var(--font-title);
    font-size: 1.5rem;
    letter-spacing: 2px;
    clip-path: polygon(10% 0, 100% 0, 100% 80%, 90% 100%, 0 100%, 0 20%);
    transition: all 0.3s;
    position: relative;
    z-index: 2;
  }

  .btn-glow {
    position: absolute;
    top: -5px; left: -5px; right: -5px; bottom: -5px;
    background: var(--color-blood);
    z-index: 1;
    filter: blur(15px);
    opacity: 0;
    transition: opacity 0.3s;
  }

  &:hover {
    .btn-inner {
      background: linear-gradient(180deg, #420f0f, #2b0a0a);
      color: #fff;
      text-shadow: 0 0 10px var(--color-blood-bright);
      transform: scale(1.05);
      border-color: var(--color-blood-bright);
    }
    .btn-glow { opacity: 0.6; }
  }
}

/* Stats en Hero */
.hero-stats {
  display: flex;
  justify-content: center;
  gap: 3rem;
  margin-top: 4rem;
  opacity: 0.7;

  .stat-item {
    display: flex;
    flex-direction: column;
    
    .count {
      font-family: var(--font-title);
      font-size: 2rem;
      color: #fff;
      &.text-red { color: var(--color-blood-bright); }
    }
    .label {
      font-size: 0.8rem;
      text-transform: uppercase;
      letter-spacing: 2px;
    }
  }
}

/* Sección Clases */
.classes-section {
  padding: 6rem 0;
  background: #080808;
  
  .section-title {
    text-align: center;
    font-family: var(--font-title);
    color: var(--color-gold);
    font-size: 3rem;
    margin-bottom: 3rem;
    position: relative;
    display: inline-block;
    left: 50%;
    transform: translateX(-50%);
    
    &::after {
      content: '';
      display: block;
      width: 60%;
      height: 2px;
      background: var(--color-blood);
      margin: 10px auto 0;
    }
  }
}

.class-card {
  position: relative;
  height: 400px;
  overflow: hidden;
  border: 1px solid #222;
  cursor: pointer;
  transition: all 0.4s ease;

  .card-bg {
    width: 100%; height: 100%;
    background-size: cover;
    background-position: center;
    transition: transform 0.5s;
    filter: grayscale(80%) brightness(0.6);
  }

  .card-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 20px;
    background: linear-gradient(to top, rgba(0,0,0,0.9), transparent);
    transform: translateY(60px);
    transition: transform 0.4s;
  }

  h3 {
    font-family: var(--font-title);
    color: #fff;
    margin: 0;
    font-size: 1.8rem;
  }

  p {
    font-size: 0.9rem;
    color: #ccc;
    margin-top: 10px;
    opacity: 0;
    transition: opacity 0.4s;
  }

  .role-icon {
    font-size: 2rem;
    position: absolute;
    top: 10px;
    right: 10px;
    opacity: 0;
    transition: all 0.4s;
  }

  &:hover {
    border-color: var(--color-gold);
    box-shadow: 0 0 20px rgba(197, 160, 89, 0.1);

    .card-bg {
      transform: scale(1.1);
      filter: grayscale(0%) brightness(0.8);
    }
    .card-overlay { transform: translateY(0); }
    p { opacity: 1; }
    .role-icon { opacity: 1; top: -40px; } /* Mueve el icono fuera o anímalo */
  }
}

/* Sección Lore (Parchment/Tablet) */
.lore-section {
  padding: 5rem 0;
  background: url('https://www.transparenttextures.com/patterns/black-scales.png');
}

.parchment-box {
  background: #121212;
  border: 1px solid #333;
  padding: 3rem 4rem;
  position: relative;
  box-shadow: 0 0 50px rgba(0,0,0,0.9);
  /* Borde doble estilo RPG */
  outline: 4px solid #1a1a1a;
  outline-offset: -10px;

  &::before {
    content: '';
    position: absolute;
    top: -2px; left: -2px; right: -2px; bottom: -2px;
    border: 1px solid var(--color-gold-dim);
    z-index: 1;
    pointer-events: none;
  }

  .wax-seal {
    position: absolute;
    top: -25px;
    right: 30px;
    width: 60px;
    height: 60px;
    background: radial-gradient(circle at 30% 30%, #ff4d4d, #8a0b0b);
    border-radius: 50%;
    box-shadow: 2px 2px 5px rgba(0,0,0,0.5);
    border: 4px solid #5a0000;
  }

  .lore-header {
    font-family: var(--font-title);
    color: var(--color-gold);
    text-align: center;
    border-bottom: 1px solid #333;
    padding-bottom: 1rem;
    margin-bottom: 2rem;
  }

  p {
    font-size: 1.1rem;
    line-height: 1.8;
    color: #bbb;
  }

  .drop-cap:first-letter {
    font-family: var(--font-title);
    font-size: 3.5rem;
    float: left;
    margin-right: 10px;
    margin-top: -10px;
    color: var(--color-blood-bright);
    text-shadow: 0 0 10px rgba(138, 11, 11, 0.5);
  }

  .signature {
    text-align: right;
    font-family: 'Dancing Script', cursive; /* Asegúrate de cargar esta si la quieres */
    font-size: 1.5rem;
    color: #666;
    margin-top: 2rem;
  }
}

/* Footer */
.rpg-footer {
  background: #000;
  padding: 3rem 0;
  text-align: center;
  border-top: 1px solid #222;
  
  .runes-border {
    font-family: 'Noto Sans Runic', sans-serif; /* Fallback de runas */
    color: #333;
    letter-spacing: 5px;
    margin-bottom: 1rem;
    font-size: 0.8rem;
  }
  
  p { font-size: 0.8rem; color: #555; }
}

/* Efectos Ambientales CSS */
.ambient-overlay {
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  pointer-events: none;
  z-index: 1;
}

.fog {
  position: absolute;
  width: 200%; height: 100%;
  background: url('https://raw.githubusercontent.com/danielstuart14/CSS_FOG_ANIMATION/master/img/fog1.png') repeat-x;
  background-size: contain;
  animation: fogMove 60s linear infinite;
  opacity: 0.3;
}

@keyframes fogMove {
  0% { transform: translate3d(0, 0, 0); }
  100% { transform: translate3d(-50%, 0, 0); }
}

/* Media Queries */
@media (max-width: 768px) {
  .main-title { font-size: 3rem; }
  .btn-rpg .btn-inner { padding: 15px 30px; }
  .parchment-box { padding: 2rem 1.5rem; }
}
</style>