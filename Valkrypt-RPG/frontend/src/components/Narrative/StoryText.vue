<template>
  <div class="story-container">
    <div class="scroll-decoration top"></div>
    
    <div class="story-box" :class="{ 'is-typing': isTyping }">
      <transition name="title-slide" appear>
        <h1 class="scene-title" :key="title">
          <span class="ornament">✨</span>
          {{ title }}
          <span class="ornament">✨</span>
        </h1>
      </transition>

      <div class="scene-body">
        <div class="scene-description" :class="{ 'finished': !isTyping }">
          <span class="drop-cap" v-if="!isTyping || displayedText.length > 0">
            {{ firstLetter }}
          </span>
          <p class="typewriter-text" v-html="formattedText"></p>
        </div>
        
        <span v-if="isTyping" class="narrative-cursor">⏳</span>
      </div>

      <transition name="fade">
        <div v-if="!isTyping" class="story-footer">
          <div class="pulse-line"></div>
          <span class="scroll-hint">El destino aguarda tu elección...</span>
        </div>
      </transition>
    </div>

    <div class="scroll-decoration bottom"></div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';

const props = defineProps(['title', 'description']);
const displayedText = ref('');
const isTyping = ref(false);
const speed = 30; // Milisegundos por carácter

const firstLetter = computed(() => props.description ? props.description.charAt(0) : '');
const remainingText = computed(() => props.description ? props.description.slice(1) : '');

// Formateamos el texto para resaltar palabras clave (ej: entre asteriscos *Espada*)
const formattedText = computed(() => {
  return displayedText.value
    .replace(/\*(.*?)\*/g, '<span class="highlight-gold">$1</span>')
    .replace(/\{(.*?)\}/g, '<span class="highlight-blood">$1</span>');
});

const typeText = () => {
  isTyping.value = true;
  displayedText.value = '';
  let i = 0;
  
  const textToType = remainingText.value;
  
  const timer = setInterval(() => {
    if (i < textToType.length) {
      displayedText.value += textToType.charAt(i);
      i++;
    } else {
      clearInterval(timer);
      isTyping.value = false;
    }
  }, speed);
};

// Reiniciar efecto cuando cambia la descripción
watch(() => props.description, () => {
  typeText();
}, { immediate: true });
</script>

<style scoped lang="scss">
.story-container {
  position: relative;
  padding: 40px;
  max-width: 900px;
  margin: 0 auto;
}

.story-box {
  background: rgba(0, 0, 0, 0.2);
  padding: 2rem;
  border-left: 1px solid rgba(197, 160, 89, 0.2);
  border-right: 1px solid rgba(197, 160, 89, 0.2);
  min-height: 300px;
}

.scene-title {
  color: #fff;
  font-family: 'Cinzel Decorative', serif;
  font-size: 2.8rem;
  text-align: center;
  margin-bottom: 2rem;
  letter-spacing: 4px;
  background: linear-gradient(to bottom, #fff, var(--color-gold, #c5a059));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  
  .ornament {
    font-size: 1.2rem;
    vertical-align: middle;
    opacity: 0.5;
  }
}

.scene-body {
  position: relative;
  font-family: 'Cinzel', serif;
}

.drop-cap {
  float: left;
  font-size: 4.5rem;
  line-height: 1;
  padding-right: 12px;
  color: var(--color-gold, #c5a059);
  font-family: 'Cinzel Decorative', serif;
  text-shadow: 0 0 15px rgba(197, 160, 89, 0.4);
}

.typewriter-text {
  font-size: 1.25rem;
  line-height: 1.9;
  color: #ccc;
  text-align: justify;
  margin: 0;
  white-space: pre-wrap;
}

/* Resaltados dinámicos */
:deep(.highlight-gold) { color: #ebd5a0; font-weight: bold; text-shadow: 0 0 5px rgba(235, 213, 160, 0.5); }
:deep(.highlight-blood) { color: #ff4444; font-weight: bold; }

.narrative-cursor {
  display: inline-block;
  margin-left: 5px;
  animation: blink 1s infinite;
}

.story-footer {
  margin-top: 3rem;
  text-align: center;
  
  .pulse-line {
    height: 1px;
    background: linear-gradient(90deg, transparent, #c5a059, transparent);
    margin-bottom: 1rem;
    animation: expand-line 2s ease-in-out infinite;
  }
  
  .scroll-hint {
    font-size: 0.8rem;
    color: #666;
    letter-spacing: 3px;
    text-transform: uppercase;
  }
}

/* Animaciones */
@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
@keyframes expand-line { 0%, 100% { opacity: 0.2; transform: scaleX(0.8); } 50% { opacity: 0.6; transform: scaleX(1); } }

.title-slide-enter-active { transition: all 1s ease-out; }
.title-slide-enter-from { opacity: 0; transform: translateY(-20px); }
</style>