<template>
  <div class="auth-container">
    <div class="auth-box">
      <h1 class="title">VALKRYPT</h1>
      <h2 class="subtitle">Nuevo Recluta</h2>

      <form @submit.prevent="handleRegister">
        <div class="form-group">
          <label>Nombre de Usuario</label>
          <input 
            v-model="username" 
            type="text" 
            placeholder="Tu nombre de guerra..." 
            required 
            minlength="3"
          />
        </div>

        <div class="form-group">
          <label>Correo Electrónico</label>
          <input 
            v-model="email" 
            type="email" 
            placeholder="correo@ejemplo.com" 
            required 
          />
        </div>
        
        <div class="form-group">
          <label>Contraseña</label>
          <input 
            v-model="password" 
            type="password" 
            placeholder="******" 
            required 
            minlength="6"
          />
        </div>

        <div class="form-group">
          <label>Confirmar Contraseña</label>
          <input 
            v-model="confirmPassword" 
            type="password" 
            placeholder="******" 
            required 
          />
        </div>

        <div v-if="error" class="error-msg">{{ error }}</div>
        <div v-if="successMsg" class="success-msg">{{ successMsg }}</div>

        <button type="submit" class="btn-aethelgard w-100 mt-4" :disabled="isLoading">
          {{ isLoading ? 'FIRMANDO PACTO...' : 'RECLUTARSE' }}
        </button>
      </form>

      <div class="mt-4 text-center login-link">
        ¿Ya tienes cuenta? 
        <router-link to="/login" class="link-gold">Entrar al Bastión</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '../services/api'; // Asegúrate de que api.js tenga el método register

const router = useRouter();
const username = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const error = ref('');
const successMsg = ref('');
const isLoading = ref(false);

const handleRegister = async () => {
  error.value = '';
  successMsg.value = '';

  // Validación básica frontend
  if (password.value !== confirmPassword.value) {
    error.value = "Las contraseñas no coinciden.";
    return;
  }

  isLoading.value = true;

  try {
    // Llamada al backend
    // Asegúrate de que en services/api.js tienes algo como:
    // register(data) { return api.post('/auth/register', data); }
    const response = await api.post('/auth/register', {
      username: username.value,
      email: email.value,
      password: password.value
    });

    if (response.data.success) {
      successMsg.value = "Registro completado. Redirigiendo...";
      setTimeout(() => {
        router.push('/login');
      }, 1500);
    }
  } catch (err) {
    // Capturar error del backend (ej: usuario duplicado)
    error.value = err.response?.data?.error || "Error al conectar con el servidor.";
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped lang="scss">
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
  max-width: 450px;
  box-shadow: 0 0 30px rgba(197, 160, 89, 0.15);
  position: relative;

  /* Efecto de borde doble simple */
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
  color: #8a1c1c; /* Rojo sangre */
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
  z-index: 2; /* Por encima del borde decorativo */
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

.success-msg {
  color: #4cd137;
  text-align: center;
  margin-top: 15px;
  font-size: 0.9rem;
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