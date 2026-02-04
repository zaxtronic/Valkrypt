<template>
  <div class="valkrypt-home">
    <!-- Navbar Estilo Aethelgard -->
    <nav class="navbar navbar-dark fixed-top">
      <div class="container">
        <span class="navbar-brand">VALKRYPT</span>
        <div class="d-none d-md-block">
          <a href="#" class="nav-link">EL REINO</a>
          <a href="#" class="nav-link">LA DISFORMIDAD</a>
          <a href="#" class="nav-link">REGLAS</a>
          <!-- Opción de Salir si está logueado -->
          <a v-if="isLoggedIn" href="#" @click.prevent="logout" class="nav-link text-danger">CERRAR SESIÓN</a>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <header class="hero-section">
      <div class="hero-overlay">
        <div class="container text-center content">
          <h1 class="main-title">CRÓNICAS DE LA SOMBRA</h1>
          <p class="subtitle">La lluvia en Valkrypt no limpia los pecados; solo los empuja a las alcantarillas.</p>
          
          <div class="cta-container">
            <!-- Botón Inteligente: Redirige según estado de login -->
            <button class="btn-valkrypt-lg" @click="handleEnter">
              {{ isLoggedIn ? 'CONTINUAR LA CRÓNICA' : 'ENTRAR EN LA OSCURIDAD' }}
            </button>
          </div>

          <div class="mt-5 resources">
            <span class="resource-link">📜 Lore del Bastión</span>
            <span class="resource-link">🩸 Magia de Sangre</span>
            <span class="resource-link">🛡️ Fichas</span>
          </div>
        </div>
      </div>
    </header>

    <!-- Sección de Lore (Inferior) -->
    <div class="container mt-5 mb-5">
      <div class="lore-box">
        <h2 class="section-header">EL JUEGO: DADOS CARGADOS</h2>
        <p>
          Bienvenido a <strong>Bastión Real</strong>. Un lugar donde la <strong>Guardia de Hierro</strong> vigila cada esquina y la magia está prohibida.
          Tú controlarás a un grupo de inadaptados: un guerrero deshonrado, un ladrón cínico, una maga inestable y un clérigo hereje.
        </p>
        <p>
          Una grieta se ha abierto en las minas de <strong>Piedraprofunda</strong>. El Duque paga bien por el silencio, pero la Sombra paga mejor por tu alma.
          ¿Podrás cerrar la puerta antes de que el Vacío nos consuma a todos?
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const isLoggedIn = ref(false);

// Comprobar estado de login al cargar
onMounted(() => {
  isLoggedIn.value = !!localStorage.getItem('token');
});

// Manejar clic en el botón principal
const handleEnter = () => {
  if (isLoggedIn.value) {
    router.push('/select'); 
  } else {
    router.push('/login'); 
  }
};

// Cerrar sesión
const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  isLoggedIn.value = false;
  // Recargar para limpiar estados
  window.location.reload();
};
</script>

<style scoped lang="scss">
.navbar {
  background-color: #0d0d0d;
  border-bottom: 3px solid var(--color-accent-dark-red);
  padding: 1.2rem 0;
  .navbar-brand { 
    font-family: 'Cinzel Decorative', serif; 
    color: var(--color-accent-gold); 
    font-size: 2rem; 
    letter-spacing: 2px;
  }
  .nav-link { 
    color: #a0a0a0; 
    font-family: 'Cinzel Decorative', serif; 
    margin-left: 20px; 
    font-size: 0.9rem;
    text-decoration: none;
    cursor: pointer;
    &:hover { color: var(--color-accent-gold); }
    &.text-danger:hover { color: #ff6b6b; }
  }
}

.hero-section {
  position: relative;
  height: 85vh;
  margin-top: 80px;
  background: url('https://www.transparenttextures.com/patterns/dark-matter.png'), radial-gradient(circle, #222 0%, #000 100%);
  border-bottom: 1px solid #333;
  
  .hero-overlay {
    background: rgba(0,0,0,0.5);
    height: 100%;
    display: flex; align-items: center; justify-content: center;
  }

  .main-title {
    font-family: 'Cinzel Decorative', serif;
    font-size: 4rem;
    color: var(--color-accent-parchment);
    text-shadow: 0 4px 10px rgba(0,0,0,0.9);
    margin-bottom: 1.5rem;
  }
  
  .subtitle { 
    font-family: 'EB Garamond', serif;
    font-size: 1.6rem; 
    color: #ccc; 
    font-style: italic;
    max-width: 700px;
    margin: 0 auto 3rem auto;
  }
}

.btn-valkrypt-lg {
  background-color: var(--color-accent-dark-red);
  border: 1px solid #631212;
  color: #e0e0e0;
  font-family: 'Cinzel Decorative', serif;
  font-size: 1.5rem;
  padding: 15px 50px;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 0 20px rgba(0,0,0,0.5);

  &:hover {
    background-color: #8a1c1c;
    border-color: #a56f6f;
    color: #fff;
    transform: translateY(-2px);
    box-shadow: 0 0 30px rgba(138, 28, 28, 0.4);
  }
}

.resource-link {
  color: var(--color-accent-gold);
  border: 1px solid var(--color-accent-gold);
  padding: 8px 15px;
  margin: 0 10px;
  font-family: 'Cinzel Decorative';
  font-size: 0.9rem;
  cursor: pointer;
  display: inline-block;
  &:hover { background: var(--color-accent-gold); color: #000; }
}

.lore-box {
  background: #1a1a1a;
  padding: 50px;
  border: 1px solid #333;
  box-shadow: 0 10px 30px rgba(0,0,0,0.8);
  color: #ccc;
  font-family: 'EB Garamond', serif;
  font-size: 1.2rem;
  line-height: 1.8;

  .section-header {
    color: var(--color-accent-gold);
    font-family: 'Cinzel Decorative', serif;
    border-bottom: 1px solid #444;
    padding-bottom: 15px;
    margin-bottom: 25px;
  }
}
</style>