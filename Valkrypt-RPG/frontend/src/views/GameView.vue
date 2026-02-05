<template>
  <div class="game-viewport" :class="{ 'state-combat': gameStore.isCombatMode, 'state-narrative': !gameStore.isCombatMode }">
    <svg style="display: none;">
      <defs>
        <filter id="turbulence-noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="3" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="6" />
        </filter>
        <linearGradient id="gold-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#bf953f" />
          <stop offset="50%" stop-color="#fcf6ba" />
          <stop offset="100%" stop-color="#b38728" />
        </linearGradient>
      </defs>
    </svg>

    <div class="fx-layer bg-image" :style="{ backgroundImage: `url(${currentBackground})` }"></div>
    <div class="fx-layer fog-overlay"></div>
    <div class="fx-layer vignette"></div>
    <div class="fx-layer grain"></div>
    
    <div class="dust-container">
      <div v-for="n in 20" :key="n" class="dust-mote"></div>
    </div>

    <div class="ui-layer top-bar">
      <div class="game-title">
        ECHOES OF THE VOID 
        <span v-if="isOffline" class="offline-tag">OFFLINE MODE</span>
      </div>
      <GameMenu @resume="closeMenu" class="menu-trigger" />
    </div>

    <aside class="roster-panel">
      <div class="roster-header">
        <span class="decoration-line"></span>
        <h3>Vanguardia</h3>
        <span class="decoration-line"></span>
      </div>
      
      <div class="roster-list custom-scroll">
        <div 
          v-for="char in gameStore.party" 
          :key="char.id" 
          class="hero-card"
          :class="{ 
            'is-critical': isCritical(char), 
            'is-dead': char.stats.hp <= 0,
            'is-active': char.id === gameStore.activeCharId 
          }"
        >
          <div class="card-glow" v-if="char.id === gameStore.activeCharId"></div>

          <div class="card-visual">
            <div class="avatar-frame">
              <div class="avatar-inner" :class="char.class.toLowerCase()">
                <span class="class-icon">{{ getClassIcon(char.class) }}</span>
              </div>
              <div class="level-orb">{{ char.level || 1 }}</div>
            </div>
            
            <div class="status-indicators">
              <span v-if="char.stats.corruption > 0" class="token corruption">👁️</span>
              <span v-if="isCritical(char)" class="token blood">🩸</span>
            </div>
          </div>

          <div class="card-data">
            <div class="char-identity">
              <span class="char-name">{{ char.name }}</span>
              <span class="char-class">{{ char.class }}</span>
            </div>

            <div class="stat-bars">
              <div class="bar-container hp-bar">
                <div class="bar-track"></div>
                <div class="bar-fill delayed" :style="{width: getHpPercent(char) + '%'}"></div>
                <div class="bar-fill current" :style="{width: getHpPercent(char) + '%'}"></div>
                <div class="bar-glare"></div>
                <span class="bar-value">{{ char.stats.hp }} <span class="divider">/</span> {{ char.stats.maxHp }}</span>
              </div>
              
              <div class="bar-container mp-bar">
                <div class="bar-track"></div>
                <div class="bar-fill blue" :style="{width: (char.stats.mp || 100) + '%'}"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>

    <main class="main-stage">
      
      <transition name="dissolve">
        <div v-if="gameStore.isLoading" class="loading-overlay">
          <div class="rune-spinner">
            <svg viewBox="0 0 100 100" class="rune-svg">
              <circle cx="50" cy="50" r="45" stroke="url(#gold-gradient)" stroke-width="1" fill="none"/>
              <rect x="25" y="25" width="50" height="50" transform="rotate(45 50 50)" stroke="rgba(255,255,255,0.2)" stroke-width="1" fill="none"/>
            </svg>
          </div>
          <div class="loading-text">INTERPRETANDO EL DESTINO...</div>
        </div>
      </transition>

      <transition name="book-reveal" mode="out-in">
        
        <div 
          v-if="!gameStore.isCombatMode && gameStore.currentScene" 
          :key="gameStore.currentScene.id" 
          class="narrative-grimoire"
        >
          <div class="grimoire-border top"></div>
          <div class="grimoire-border bottom"></div>
          
          <header class="scene-header">
            <div class="chapter-ornament">❖</div>
            <h1 class="scene-title">{{ gameStore.currentScene.title }}</h1>
            <div class="title-underline"></div>
          </header>

          <div class="scene-content" @click="skipTypewriter">
            <div class="text-container">
              <p class="story-text" v-html="parsedDisplayedText"></p>
              <span v-if="isTyping" class="cursor-caret">▋</span>
            </div>
          </div>

          <footer class="scene-choices" :class="{ 'fade-in': !isTyping }">
            <button 
              v-for="(opt, index) in gameStore.currentScene.options" 
              :key="index"
              class="ancient-btn"
              :class="opt.type || 'neutral'"
              @click="handleOptionClick(opt)"
              :disabled="isTyping"
            >
              <div class="btn-bg"></div>
              <div class="btn-content">
                <span class="btn-icon">{{ opt.icon || '➤' }}</span>
                <span class="btn-text">{{ opt.text }}</span>
              </div>
              <div class="btn-border"></div>
            </button>
          </footer>
        </div>

        <div v-else-if="gameStore.isCombatMode" class="combat-overlay">
          <div class="combat-banner">
            <div class="banner-bg"></div>
            <h2 class="combat-title" data-text="ENCUENTRO MORTAL">ENCUENTRO MORTAL</h2>
            <div class="threat-meter">AMENAZA: <span class="danger">CRÍTICA</span></div>
          </div>
          
          <div class="debug-combat-controls">
            <button class="ancient-btn attack" @click="debugWin">
              <span class="btn-text">EJECUTAR ENEMIGOS (DEBUG)</span>
            </button>
          </div>
        </div>

      </transition>
    </main>
  </div>
</template>

<script setup>
import { onMounted, ref, watch, computed } from 'vue';
import { useGameStore } from '../stores/gameStore';

const gameStore = useGameStore();
const isOffline = ref(false);

// --- SISTEMA VISUAL ---
const currentBackground = computed(() => {
  return 'https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?q=80&w=2544&auto=format&fit=crop';
});

// --- TYPEWRITER MEJORADO ---
const rawText = ref('');
const displayedCharCount = ref(0);
const isTyping = ref(false);
let typeInterval = null;

const startTypewriter = (text) => {
  if (!text) return;
  clearInterval(typeInterval);
  rawText.value = text;
  displayedCharCount.value = 0;
  isTyping.value = true;

  typeInterval = setInterval(() => {
    if (displayedCharCount.value < rawText.value.length) {
      const char = rawText.value[displayedCharCount.value];
      let step = 1;
      
      if (char === '<') {
        const closingIndex = rawText.value.indexOf('>', displayedCharCount.value);
        if (closingIndex !== -1) step = (closingIndex - displayedCharCount.value) + 1;
      }
      
      displayedCharCount.value += step;
    } else {
      finishTyping();
    }
  }, 20);
};

const finishTyping = () => {
  clearInterval(typeInterval);
  displayedCharCount.value = rawText.value.length;
  isTyping.value = false;
};

const skipTypewriter = () => { if (isTyping.value) finishTyping(); };

const parsedDisplayedText = computed(() => {
  const currentSlice = rawText.value.slice(0, displayedCharCount.value);
  return currentSlice
    .replace(/\[(.*?)\]/g, '<span class="syntax-enemy">$1</span>')
    .replace(/\{(.*?)\}/g, '<span class="syntax-item">$1</span>')
    .replace(/\*(.*?)\*/g, '<span class="syntax-action">$1</span>')
    .replace(/"(.*?)"/g, '<span class="syntax-speech">“$1”</span>');
});

// --- HELPERS ---
const getClassIcon = (cls) => ({ Warrior: '⚔️', Rogue: '🗡️', Arcanist: '🔮', BloodCleric: '🩸' }[cls] || '👤');
const getHpPercent = (char) => Math.max(0, (char.stats.hp / char.stats.maxHp) * 100);
const isCritical = (char) => getHpPercent(char) < 30;

const handleOptionClick = (opt) => {
  if(isTyping.value) return;
  gameStore.chooseOption(opt);
};

const debugWin = () => gameStore.returnToNarrative(true);
const closeMenu = () => {};

// --- LIFECYCLE ---
watch(() => gameStore.currentScene, (newVal) => {
  if (newVal && !gameStore.isCombatMode) startTypewriter(newVal.description);
}, { immediate: true });

onMounted(() => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  isOffline.value = user.isOffline === true;
  gameStore.initializeGame();
});
</script>

<style scoped lang="scss">
@use "sass:math";
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Cormorant+Garamond:ital,wght@0,300;0,600;0,700;1,400&display=swap');

/* --- VARIABLES DEL SISTEMA --- */
:root {
  --c-void: #030304;
  --c-void-light: #0f1014;
  --c-border: rgba(255, 255, 255, 0.08);
  --c-gold-dim: #7a6036;
  --c-gold: #c5a059;
  --c-gold-bright: #ffd700;
  --c-blood: #5a0b0b;
  --c-blood-bright: #ff3333;
  --c-mana: #4a69bd;
  --c-mana-bright: #6a89cc;
  --c-text-primary: #e0e0e0;
  --c-text-muted: #888;
  --f-title: 'Cinzel', serif;
  --f-body: 'Cormorant Garamond', serif;
  --shadow-elevation: 0 10px 30px rgba(0,0,0,0.8);
  --glass-bg: rgba(12, 12, 14, 0.85);
  --backdrop: blur(12px);
}

.offline-tag {
  font-size: 0.6rem; background: #8a1c1c; color: white;
  padding: 2px 8px; border-radius: 2px; margin-left: 15px;
  vertical-align: middle; letter-spacing: 1px;
}

/* --- ESTRUCTURA --- */
.game-viewport {
  position: relative; width: 100vw; height: 100vh; overflow: hidden;
  background: #030304; color: #e0e0e0;
  display: grid; grid-template-columns: 350px 1fr; grid-template-rows: 60px 1fr;
  font-family: 'Cormorant Garamond', serif; user-select: none;
}

/* --- FX LAYERS --- */
.fx-layer { position: absolute; inset: 0; pointer-events: none; z-index: 0; }
.bg-image {
  background-size: cover; background-position: center;
  opacity: 0.4; filter: grayscale(40%) contrast(120%);
  transition: background-image 1s ease-in-out;
}
.fog-overlay { background: radial-gradient(circle at 50% 120%, rgba(20,0,0,0.4), transparent 70%); mix-blend-mode: multiply; }
.vignette { background: radial-gradient(circle, transparent 30%, #000 95%); z-index: 1; }
.grain {
  opacity: 0.05;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E");
  z-index: 2;
}

.state-combat {
  .vignette { box-shadow: inset 0 0 100px rgba(100, 0, 0, 0.3); animation: pulse-danger 3s infinite ease-in-out; }
  .bg-image { filter: grayscale(100%) contrast(150%) brightness(0.4); }
}

/* --- TOP BAR --- */
.top-bar {
  grid-column: 1 / -1; z-index: 50; display: flex; justify-content: space-between; align-items: center;
  padding: 0 40px; background: linear-gradient(to bottom, rgba(0,0,0,0.9), transparent);
  border-bottom: 1px solid rgba(255,255,255,0.05);
  
  .game-title {
    font-family: 'Cinzel', serif; font-weight: 900; letter-spacing: 5px; color: #c5a059;
    text-shadow: 0 2px 10px rgba(197, 160, 89, 0.2); font-size: 1.2rem;
  }
}

/* --- ROSTER --- */
.roster-panel {
  grid-row: 2; z-index: 20; background: rgba(5, 5, 7, 0.85);
  border-right: 1px solid rgba(255,255,255,0.08); backdrop-filter: blur(12px);
  display: flex; flex-direction: column; padding: 20px 15px;
  box-shadow: 10px 0 30px rgba(0,0,0,0.5);
}

.roster-header {
  text-align: center; margin-bottom: 20px;
  h3 { margin: 5px 0; font-family: 'Cinzel', serif; color: #888; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 3px; }
  .decoration-line { display: block; height: 1px; background: linear-gradient(90deg, transparent, #7a6036, transparent); width: 100%; opacity: 0.5; }
}

.roster-list { flex: 1; display: flex; flex-direction: column; gap: 16px; padding: 5px; overflow-y: auto; }

/* --- HERO CARD COMPLETA --- */
.hero-card {
  position: relative; display: grid; grid-template-columns: 60px 1fr; gap: 12px;
  background: linear-gradient(120deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01));
  border: 1px solid rgba(255,255,255,0.05); padding: 10px; border-radius: 2px;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1); overflow: hidden;

  &:hover { background: rgba(255,255,255,0.06); transform: translateY(-2px); box-shadow: 0 5px 15px rgba(0,0,0,0.3); }
  &.is-active {
    border-color: #c5a059; background: linear-gradient(90deg, rgba(197, 160, 89, 0.05), transparent);
    .card-glow { position: absolute; top: 0; left: 0; width: 2px; height: 100%; background: #ffd700; box-shadow: 0 0 10px #c5a059; }
  }
  &.is-critical { border-color: #5a0b0b; animation: shake 2.5s infinite; .avatar-inner { border-color: #ff3333; } }
  &.is-dead { opacity: 0.5; filter: grayscale(1); pointer-events: none; }
}

.avatar-frame { position: relative; width: 56px; height: 56px; }
.avatar-inner {
  width: 100%; height: 100%; background: #000; border: 1px solid #444;
  display: flex; align-items: center; justify-content: center; font-size: 1.5rem;
  box-shadow: inset 0 0 10px rgba(0,0,0,0.8);
}
.level-orb {
  position: absolute; bottom: -6px; right: -6px; width: 20px; height: 20px; background: #111;
  border: 1px solid #c5a059; border-radius: 50%; color: #c5a059; font-size: 0.7rem;
  font-weight: bold; font-family: 'Cinzel', serif; display: flex; align-items: center; justify-content: center; z-index: 2;
}

.card-data { display: flex; flex-direction: column; justify-content: center; gap: 6px; }
.char-identity {
  display: flex; justify-content: space-between; align-items: baseline;
  .char-name { font-family: 'Cinzel', serif; font-weight: 700; color: #eee; font-size: 0.95rem; }
  .char-class { font-size: 0.65rem; color: #666; text-transform: uppercase; letter-spacing: 1px; }
}

.bar-container {
  height: 6px; width: 100%; background: rgba(0,0,0,0.6); position: relative; border: 1px solid rgba(255,255,255,0.1); margin-top: 2px;
  &.hp-bar { height: 8px; }
  &.mp-bar { height: 3px; border: none; background: rgba(0,0,0,0.8); }
}

.bar-fill {
  height: 100%; position: absolute; top: 0; left: 0;
  &.current { background: linear-gradient(90deg, #500, #a00); z-index: 2; transition: width 0.3s; }
  &.delayed { background: #fff; z-index: 1; transition: width 1s ease 0.3s; }
  &.blue { background: linear-gradient(90deg, #4a69bd, #6a89cc); }
}

.bar-glare { position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(255,255,255,0.1), transparent); z-index: 3; }
.bar-value { position: absolute; right: 0; top: -14px; font-size: 0.6rem; color: #999; .divider { color: #444; } }

/* --- MAIN STAGE --- */
.main-stage { grid-row: 2; grid-column: 2; position: relative; z-index: 10; display: flex; align-items: center; justify-content: center; padding: 40px; }

.narrative-grimoire {
  width: 100%; max-width: 900px; background: rgba(12, 12, 14, 0.85); backdrop-filter: blur(12px);
  padding: 60px 80px; border-left: 1px solid rgba(255,255,255,0.05); border-right: 1px solid rgba(255,255,255,0.05);
  position: relative; box-shadow: 0 20px 60px rgba(0,0,0,0.6);
  &::before { content: ''; position: absolute; inset: 0; background: radial-gradient(circle, rgba(197, 160, 89, 0.03), transparent 80%); pointer-events: none; }
}

.grimoire-border {
  position: absolute; left: 10%; right: 10%; height: 2px; background: linear-gradient(90deg, transparent, #c5a059, transparent); opacity: 0.3;
  &.top { top: 20px; } &.bottom { bottom: 20px; }
}

.scene-header { text-align: center; margin-bottom: 40px; }
.chapter-ornament { color: #c5a059; font-size: 1.5rem; margin-bottom: 10px; opacity: 0.8; }
.scene-title {
  font-family: 'Cinzel', serif; font-size: 3rem; color: #f0f0f0; margin: 0; text-transform: uppercase; letter-spacing: 0.1em;
  background: linear-gradient(to bottom, #fff, #bbb); -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 0 15px rgba(255,255,255,0.1));
}
.title-underline { width: 60px; height: 3px; background: #c5a059; margin: 20px auto 0; box-shadow: 0 0 10px #c5a059; }

.text-container { min-height: 200px; margin-bottom: 50px; }
.story-text { font-size: 1.5rem; line-height: 1.8; color: #d0d0d0; text-align: justify; }

:deep(.syntax-enemy) { color: #ff3333; font-weight: 700; text-shadow: 0 0 5px rgba(255,0,0,0.4); }
:deep(.syntax-item) { color: #2ecc71; border-bottom: 1px dotted #2ecc71; }
:deep(.syntax-action) { color: #c5a059; font-style: italic; font-family: 'Cinzel', serif; }
:deep(.syntax-speech) { color: #a2d1ff; font-family: sans-serif; font-weight: 300; }

.cursor-caret { display: inline-block; width: 10px; height: 1.2rem; background: #c5a059; animation: blink 1s step-end infinite; vertical-align: middle; }

/* OPCIONES */
.scene-choices { display: flex; flex-direction: column; gap: 20px; opacity: 0; transform: translateY(10px); transition: all 0.8s ease; &.fade-in { opacity: 1; transform: translateY(0); } }

.ancient-btn {
  position: relative; width: 100%; padding: 20px 30px; background: transparent; border: none; cursor: pointer; text-align: left; overflow: hidden;
  .btn-bg { position: absolute; inset: 0; background: #111; opacity: 0.6; transform: skewX(-10deg); transition: 0.3s; border: 1px solid #333; }
  .btn-border { position: absolute; inset: 0; border: 1px solid #c5a059; opacity: 0; transform: scale(1.1); transition: 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
  .btn-content { position: relative; z-index: 2; display: flex; align-items: center; gap: 15px; font-family: 'Cinzel', serif; font-size: 1.1rem; color: #888; transition: 0.3s; }
  .btn-icon { color: #7a6036; transition: 0.3s; }

  &:hover {
    .btn-bg { background: #1a1a1a; border-color: #555; transform: skewX(-10deg) scale(1.02); }
    .btn-border { opacity: 1; transform: scale(1) skewX(-10deg); box-shadow: 0 0 15px rgba(197, 160, 89, 0.2); }
    .btn-content { color: #fff; padding-left: 10px; }
    .btn-icon { color: #c5a059; transform: scale(1.2); }
  }
  &.combat { .btn-border { border-color: #5a0b0b; } &:hover .btn-icon { color: #ff3333; } }
}

/* --- COMBAT --- */
.combat-overlay { width: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; }
.combat-banner {
  position: relative; padding: 40px 100px; background: rgba(0,0,0,0.8); border-top: 2px solid #5a0b0b; border-bottom: 2px solid #5a0b0b;
  text-align: center; margin-bottom: 50px; animation: slideIn 0.5s ease-out;
}
.combat-title {
  font-family: 'Cinzel', serif; font-size: 4rem; color: #ff3333; text-shadow: 0 0 20px #5a0b0b; letter-spacing: 8px; margin: 0; position: relative;
  &::before { content: attr(data-text); position: absolute; left: 2px; text-shadow: -1px 0 red; top:0; clip-path: polygon(0 0, 100% 0, 100% 30%, 0 30%); animation: glitch 2s infinite linear alternate-reverse; }
}
.threat-meter { margin-top: 15px; font-family: monospace; letter-spacing: 4px; color: #aaa; .danger { color: red; animation: pulse-text 0.5s infinite alternate; font-weight: bold; } }

/* --- ANIMACIONES SASS --- */
@keyframes blink { 50% { opacity: 0; } }
@keyframes pulse-danger { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }
@keyframes pulse-text { from { opacity: 0.5; } to { opacity: 1; text-shadow: 0 0 10px red; } }
@keyframes shake { 0% { transform: translate(1px, 1px); } 10% { transform: translate(-1px, -2px); } 20% { transform: translate(-3px, 0px); } 30% { transform: translate(3px, 2px); } 40% { transform: translate(1px, -1px); } 100% { transform: translate(0,0); } }
@keyframes glitch { 0% { clip-path: inset(40% 0 61% 0); transform: translate(-2px, 2px); } 20% { clip-path: inset(92% 0 1% 0); transform: translate(0); } 40% { clip-path: inset(43% 0 1% 0); transform: translate(-1px, -1px); } 60% { clip-path: inset(25% 0 58% 0); transform: translate(2px, 1px); } 80% { clip-path: inset(54% 0 7% 0); transform: translate(-1px, 2px); } 100% { clip-path: inset(58% 0 43% 0); transform: translate(0); } }
@keyframes floatParticle { from { transform: translateY(0) rotate(0deg); } to { transform: translateY(-100vh) rotate(360deg); } }

/* PARTÍCULAS SASS LOOP */
.dust-container { position: absolute; inset: 0; pointer-events: none; overflow: hidden; z-index: 10; }
.dust-mote { position: absolute; width: 2px; height: 2px; background: rgba(255,255,255,0.3); border-radius: 50%; animation: floatParticle 10s infinite linear; }

@for $i from 1 through 20 {
  .dust-mote:nth-child(#{$i}) {
    left: math.percentage(math.div(math.random(100), 100)); 
    top: math.percentage(math.div(math.random(100), 100));
    animation-duration: (math.random(10) + 10) * 1s;
    animation-delay: -(math.random(10)) * 1s;
    opacity: math.random(5) * 0.1;
  }
}

/* LOADING */
.loading-overlay { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: #c5a059; }
.rune-svg { width: 100px; height: 100px; animation: spin 10s linear infinite; }
@keyframes spin { 100% { transform: rotate(360deg); } }

/* TRANSITIONS */
.dissolve-enter-active, .dissolve-leave-active { transition: opacity 1.5s ease; }
.dissolve-enter-from, .dissolve-leave-to { opacity: 0; }

.book-reveal-enter-active { transition: all 1s cubic-bezier(0.22, 1, 0.36, 1); }
.book-reveal-enter-from { opacity: 0; transform: scale(0.95) translateY(20px); filter: blur(10px); }

@media (max-width: 1024px) {
  .game-viewport { grid-template-columns: 1fr; grid-template-rows: auto 1fr; }
  .roster-panel { display: none; }
  .narrative-grimoire { padding: 30px; border: none; background: rgba(0,0,0,0.6); }
  .scene-title { font-size: 2rem; }
}
</style>