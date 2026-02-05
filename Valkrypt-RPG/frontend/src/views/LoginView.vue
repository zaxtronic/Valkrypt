<template>
  <div class="auth-container">
    <div class="auth-box">
      <h1 class="title">VALKRYPT</h1>
      <h2 class="subtitle">
        {{ isServerDown ? 'MODO LOCAL ACTIVO' : 'IDENTIFÍCATE' }}
      </h2>

      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label>Nombre de Usuario</label>
          <input 
            v-model="username" 
            type="text" 
            placeholder="Tu nombre de guerra..." 
            required 
          />
        </div>
        
        <div class="form-group" v-if="!isServerDown">
          <label>Contraseña</label>
          <input 
            v-model="password" 
            type="password" 
            placeholder="******" 
            :required="!isServerDown" 
          />
        </div>

        <div v-if="error" class="error-msg">{{ error }}</div>

        <button type="submit" class="btn-aethelgard w-100 mt-4" :disabled="isLoading">
          <span v-if="isLoading">PROCESANDO...</span>
          <span v-else-if="isServerDown">ENTRAR SIN CONEXIÓN</span>
          <span v-else>ENTRAR AL BASTIÓN</span>
        </button>
      </form>

      <div class="mt-4 text-center login-link" v-if="!isServerDown">
        ¿Nuevo en el Bastión? 
        <router-link to="/register" class="link-gold">Reclútate aquí</router-link>
      </div>
      <div class="mt-4 text-center login-link" v-else>
        <small style="color: #8a1c1c;">Servidor no detectado. Los datos se guardarán en este PC.</small>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '../services/api';

const router = useRouter();
const username = ref('');
const password = ref('');
const error = ref('');
const isLoading = ref(false);
const isServerDown = ref(false);

// Al montar el componente, verificamos si el backend está vivo
onMounted(async () => {
  try {
    await api.getStatus();
    isServerDown.value = false;
  } catch (err) {
    isServerDown.value = true;
    error.value = "Atención: Trabajando en modo local (Offline).";
  }
});

const handleLogin = async () => {
  error.value = '';
  isLoading.value = true;

  // LÓGICA MODO LOCAL (OFFLINE)
  if (isServerDown.value) {
    const offlineUser = { 
      id: 'local_user_' + Date.now(), 
      username: username.value, 
      isOffline: true 
    };
    
    // Guardamos un token ficticio y el objeto usuario marcado como offline
    localStorage.setItem('token', 'offline_access_token');
    localStorage.setItem('user', JSON.stringify(offlineUser));
    
    console.log("Accediendo en modo local...");
    router.push('/');
    return;
  }

  // LÓGICA MODO ONLINE (CONEXIÓN CON ATLAS)
  try {
    const response = await api.login({
      username: username.value,
      password: password.value
    });

    if (response.data.success) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      router.push('/');
    }
  } catch (err) {
    console.error(err);
    if (err.response && err.response.status === 401) {
      error.value = "Credenciales incorrectas.";
    } else {
      // Si el servidor cae justo en el login, activamos el modo offline
      isServerDown.value = true;
      error.value = "Se ha perdido la conexión. ¿Entrar en modo local?";
    }
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped lang="scss">
/* Se mantienen tus estilos originales */
.auth-container {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle, #1a1a1a 0%, #000 100%);
  font-family: 'EB Garamond', serif;
}

.auth-box {
  background: #0d0d0d;
  border: 1px solid #c5a059;
  padding: 40px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 0 30px rgba(197, 160, 89, 0.15);
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 5px; left: 5px; right: 5px; bottom: 5px;
    border: 1px solid #333;
    pointer-events: none;
  }
}

.title {
  color: #c5a059;
  text-align: center;
  font-family: 'Cinzel Decorative', serif;
  font-size: 2.5rem;
  margin-bottom: 0;
  text-shadow: 0 2px 5px rgba(0,0,0,0.8);
}

.subtitle {
  color: #8a1c1c;
  text-align: center;
  font-family: 'Cinzel Decorative', serif;
  font-size: 1.2rem;
  margin-bottom: 30px;
  border-bottom: 1px solid #333;
  padding-bottom: 10px;
}

.form-group {
  margin-bottom: 20px;
  position: relative;
  z-index: 2;
}

label {
  display: block;
  color: #a0a0a0;
  margin-bottom: 8px;
  font-family: 'Cinzel Decorative', serif;
  font-size: 0.9rem;
}

input {
  width: 100%;
  padding: 12px;
  background: #1a1a1a;
  border: 1px solid #444;
  color: #fff;
  font-family: 'Lato', sans-serif;
  transition: 0.3s;

  &:focus {
    border-color: #c5a059;
    background: #222;
    outline: none;
    box-shadow: 0 0 10px rgba(197, 160, 89, 0.2);
  }
}

.error-msg {
  color: #ff6b6b;
  text-align: center;
  margin-top: 15px;
  font-size: 0.9rem;
  background: rgba(255, 0, 0, 0.1);
  padding: 10px;
  border: 1px solid #8a1c1c;
}

.btn-aethelgard {
  background: #8a1c1c;
  color: #fff;
  border: 1px solid #a52a2a;
  padding: 12px;
  font-family: 'Cinzel Decorative', serif;
  font-size: 1.1rem;
  cursor: pointer;
  transition: 0.3s;
  text-transform: uppercase;
  letter-spacing: 1px;
  z-index: 2;
  position: relative;

  &:hover:not(:disabled) {
    background: #a52a2a;
    box-shadow: 0 0 15px rgba(138, 28, 28, 0.6);
  }

  &:disabled {
    background: #333;
    border-color: #444;
    color: #777;
    cursor: not-allowed;
  }
}

.login-link {
  color: #888;
  font-size: 0.95rem;
  z-index: 2;
  position: relative;
}

.link-gold {
  color: #c5a059;
  text-decoration: none;
  font-weight: bold;
  transition: 0.2s;

  &:hover {
    color: #e0cea4;
    text-decoration: underline;
  }
}
</style>