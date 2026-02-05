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
            <li v-if="isLoggedIn" class="nav-item d-flex align-items-center">
              <span class="connection-badge" :class="isOfflineMode ? 'badge-local' : 'badge-online'">
                {{ isOfflineMode ? '🛡️ LOCAL' : '🌐 NUBE' }}
              </span>
            </li>
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
const isOfflineMode = ref(false);
const isScrolled = ref(false);

const classes = [
  { name: 'Guerrero', desc: 'Acero mellado y honor olvidado.', icon: '⚔️', img: 'https://images.unsplash.com/photo-1598556834920-56e6d787033e?q=80&w=600&auto=format&fit=crop' },
  { name: 'Pícaro', desc: 'Una daga en la oscuridad vale más que mil palabras.', icon: '🗝️', img: 'https://images.unsplash.com/photo-1626245136979-d59b022b3f17?q=80&w=600&auto=format&fit=crop' },
  { name: 'Hechicero', desc: 'El poder tiene un precio: la cordura.', icon: '🔥', img: 'https://images.unsplash.com/photo-1542256844-3158d193359d?q=80&w=600&auto=format&fit=crop' },
  { name: 'Clérigo', desc: 'Hereje para la iglesia, santo para los pobres.', icon: '🩸', img: 'https://images.unsplash.com/photo-1632211603522-0d1939102641?q=80&w=600&auto=format&fit=crop' },
];

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
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  // Estamos logueados si hay token O si es un usuario marcado como offline
  isLoggedIn.value = !!token || user.isOffline === true;
  isOfflineMode.value = user.isOffline === true;
  
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});

const handleEnter = () => {
  if (isLoggedIn.value) router.push('/select');
  else router.push('/login');
};

const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  isLoggedIn.value = false;
  isOfflineMode.value = false;
  router.push('/login');
};
</script>

<style scoped lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700;900&family=Fauna+One&display=swap');

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

.valkrypt-home {
  background-color: #050505;
  color: #dcdcdc;
  font-family: 'Fauna One', serif;
  overflow-x: hidden;
  min-height: 100vh;
}

/* Badge de estado */
.connection-badge {
  font-family: 'Cinzel Decorative', serif;
  font-size: 0.7rem;
  padding: 4px 10px;
  border-radius: 2px;
  margin-right: 15px;
  letter-spacing: 1px;
  
  &.badge-online {
    background: rgba(76, 209, 55, 0.1);
    border: 1px solid #4cd137;
    color: #4cd137;
  }
  
  &.badge-local {
    background: rgba(197, 160, 89, 0.1);
    border: 1px solid #c5a059;
    color: #c5a059;
  }
}

.navbar {
  padding: 1.5rem 0;
  transition: all 0.4s ease;
  z-index: 1000;
  
  &.scrolled {
    background: rgba(5, 5, 5, 0.95);
    padding: 0.8rem 0;
    border-bottom: 1px solid #7a6335;
    box-shadow: 0 5px 20px rgba(0,0,0,0.8);
  }

  .navbar-brand {
    font-family: 'Cinzel Decorative', serif;
    color: #c5a059;
    font-size: 1.8rem;
    text-shadow: 0 0 10px rgba(197, 160, 89, 0.3);
  }

  .nav-link {
    font-family: 'Cinzel Decorative', serif;
    color: #888;
    margin-left: 2rem;
    position: relative;
    transition: 0.3s;
    font-size: 0.9rem;
    letter-spacing: 1px;

    &:hover {
      color: #fff;
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
      background: #8a0b0b;
      transition: width 0.3s;
    }

    &.logout-link {
      color: #8a0b0b;
      &:hover { color: #ff1a1a; }
    }
  }
}

.hero-section {
  position: relative;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-bottom: 2px solid #111;

  .parallax-bg {
    position: absolute;
    top: 0; left: 0; width: 100%; height: 100%;
    background: linear-gradient(to bottom, rgba(0,0,0,0.3), #050505),
                url('https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?q=80&w=1920&auto=format&fit=crop');
    background-size: cover;
    background-position: center;
    z-index: 0;
  }

  .hero-content {
    position: relative;
    z-index: 2;
    text-align: center;
    max-width: 900px;
    padding: 0 20px;
  }

  .main-title {
    font-family: 'Cinzel Decorative', serif;
    font-size: 5rem;
    color: #e0e0e0;
    text-shadow: 0 5px 15px rgba(0,0,0,1);
    margin: 0;
    letter-spacing: 5px;
  }

  .divider-rune {
    font-size: 2rem;
    color: #c5a059;
    margin: 1rem 0;
    opacity: 0.8;
  }

  .subtitle {
    font-size: 1.4rem;
    color: #aaa;
    margin-bottom: 3rem;
    font-style: italic;
  }
}

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
    border: 1px solid #7a6335;
    color: #c5a059;
    font-family: 'Cinzel Decorative', serif;
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
    background: #8a0b0b;
    z-index: 1;
    filter: blur(15px);
    opacity: 0;
    transition: opacity 0.3s;
  }

  &:hover {
    .btn-inner {
      background: linear-gradient(180deg, #420f0f, #2b0a0a);
      color: #fff;
      transform: scale(1.05);
      border-color: #ff1a1a;
    }
    .btn-glow { opacity: 0.6; }
  }
}

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
      font-family: 'Cinzel Decorative', serif;
      font-size: 2rem;
      color: #fff;
      &.text-red { color: #ff1a1a; }
    }
    .label {
      font-size: 0.8rem;
      text-transform: uppercase;
      letter-spacing: 2px;
    }
  }
}

.classes-section {
  padding: 6rem 0;
  background: #080808;
  
  .section-title {
    text-align: center;
    font-family: 'Cinzel Decorative', serif;
    color: #c5a059;
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
      background: #8a0b0b;
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
  margin-bottom: 20px;

  .card-bg {
    width: 100%; height: 100%;
    background-size: cover;
    background-position: center;
    transition: transform 0.5s;
    filter: grayscale(80%) brightness(0.6);
  }

  .card-overlay {
    position: absolute;
    bottom: 0; left: 0; width: 100%;
    padding: 20px;
    background: linear-gradient(to top, rgba(0,0,0,0.9), transparent);
    transform: translateY(60px);
    transition: transform 0.4s;
  }

  h3 { font-family: 'Cinzel Decorative', serif; color: #fff; font-size: 1.8rem; }
  p { font-size: 0.9rem; color: #ccc; opacity: 0; transition: opacity 0.4s; }
  .role-icon { font-size: 2rem; position: absolute; top: 10px; right: 10px; opacity: 0; }

  &:hover {
    border-color: #c5a059;
    .card-bg { transform: scale(1.1); filter: grayscale(0%) brightness(0.8); }
    .card-overlay { transform: translateY(0); }
    p { opacity: 1; }
    .role-icon { opacity: 1; }
  }
}

.parchment-box {
  background: #121212;
  border: 1px solid #333;
  padding: 3rem 4rem;
  position: relative;
  box-shadow: 0 0 50px rgba(0,0,0,0.9);
  outline: 4px solid #1a1a1a;
  outline-offset: -10px;

  &::before {
    content: '';
    position: absolute;
    top: -2px; left: -2px; right: -2px; bottom: -2px;
    border: 1px solid #7a6335;
    pointer-events: none;
  }

  .wax-seal {
    position: absolute;
    top: -25px; right: 30px;
    width: 60px; height: 60px;
    background: radial-gradient(circle at 30% 30%, #ff4d4d, #8a0b0b);
    border-radius: 50%;
    border: 4px solid #5a0000;
  }

  .lore-header {
    font-family: 'Cinzel Decorative', serif;
    color: #c5a059;
    text-align: center;
    margin-bottom: 2rem;
  }

  p { font-size: 1.1rem; line-height: 1.8; color: #bbb; }

  .drop-cap:first-letter {
    font-family: 'Cinzel Decorative', serif;
    font-size: 3.5rem;
    float: left;
    margin-right: 10px;
    color: #ff1a1a;
  }

  .signature { text-align: right; font-size: 1.5rem; color: #666; margin-top: 2rem; }
}

.rpg-footer {
  background: #000;
  padding: 3rem 0;
  text-align: center;
  border-top: 1px solid #222;
  .runes-border { color: #333; letter-spacing: 5px; margin-bottom: 1rem; }
  p { font-size: 0.8rem; color: #555; }
}

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
  animation: fogMove 60s linear infinite;
  opacity: 0.3;
}

@keyframes fogMove {
  0% { transform: translate3d(0, 0, 0); }
  100% { transform: translate3d(-50%, 0, 0); }
}

@media (max-width: 768px) {
  .main-title { font-size: 3rem; }
  .parchment-box { padding: 2rem 1.5rem; }
}
</style>