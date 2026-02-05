<template>
  <div class="creation-engine">
    <div class="world-bg"></div>
    <div class="fog-overlay"></div>
    <div class="vignette"></div>
    
    <transition name="toast-pop">
      <div v-if="toast.show" class="error-toast" :class="toast.type">
        <span class="toast-icon">{{ toast.type === 'error' ? '⚠️' : '✨' }}</span>
        <span>{{ toast.message }}</span>
      </div>
    </transition>

    <div class="layout-container">
      
      <header class="top-bar">
        <h1 class="game-title">Aethelgard <span class="subtitle">Chronicles</span></h1>
        <div class="progress-track">
          <div class="step-node" :class="{ active: currentStep === 1, completed: currentStep > 1 }">
            <span class="node-num">I</span>
            <span class="node-label">Campaña</span>
          </div>
          <div class="connector" :class="{ filled: currentStep > 1 }"></div>
          <div class="step-node" :class="{ active: currentStep === 2 }">
            <span class="node-num">II</span>
            <span class="node-label">Héroes</span>
          </div>
        </div>
      </header>

      <main class="main-viewport">
        <transition name="scene-switch" mode="out-in">
          
          <section v-if="currentStep === 1" key="step-campaign" class="stage-campaign">
            <div class="campaign-showcase">
              <div 
                v-for="camp in campaigns" 
                :key="camp.id"
                class="campaign-tome"
                :class="{ 'selected': selectedCampaignId === camp.id, 'locked': camp.locked }"
                @click="selectCampaign(camp)"
              >
                <div class="tome-cover">
                  <div class="tome-binding"></div>
                  <h2 class="tome-title">{{ camp.title }}</h2>
                  <div class="tome-badge" :class="camp.locked ? 'locked' : 'open'">
                    {{ camp.locked ? 'BLOQUEADO' : 'DISPONIBLE' }}
                  </div>
                </div>
                
                <div class="tome-desc">
                  <p class="lore-text">{{ camp.desc }}</p>
                  <div class="meta-tags">
                    <span class="tag">Nvl {{ camp.levels }}</span>
                    <span class="tag">⏳ {{ camp.duration }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="controls-center">
              <button 
                class="btn-legendary" 
                :disabled="!selectedCampaignId"
                @click="advanceStep"
              >
                <span class="btn-inner">FORJAR DESTINO</span>
                <div class="btn-glow"></div>
              </button>
            </div>
          </section>

          <section v-else key="step-party" class="stage-party">
            <div class="party-interface">
              
              <aside class="panel-roster">
                <div class="panel-header">
                  <h3>Códice de Héroes</h3>
                  <small>Selecciona hasta 4 para tu vanguardia</small>
                </div>
                <div class="roster-list custom-scroll">
                  <div 
                    v-for="char in availableCharacters" 
                    :key="char.pregen_id"
                    class="roster-card"
                    :class="{ 
                      'is-in-party': isInParty(char.pregen_id),
                      'is-disabled': !isInParty(char.pregen_id) && party.length >= 4 
                    }"
                    @click="toggleCharacter(char)"
                    @mouseenter="previewChar = char"
                    @mouseleave="previewChar = null"
                  >
                    <div class="card-art-frame">
                      <span class="c-icon">{{ char.icon }}</span>
                    </div>
                    <div class="c-info">
                      <span class="c-name">{{ char.name }}</span>
                      <span class="c-class">{{ char.race }} {{ char.class }}</span>
                    </div>
                    <div class="c-status" v-if="isInParty(char.pregen_id)">
                      <span class="check-mark">✓</span>
                    </div>
                  </div>
                </div>
              </aside>

              <div class="panel-inspector">
                <transition name="fade" mode="out-in">
                  <div v-if="activeDisplay" :key="activeDisplay.pregen_id" class="inspector-content">
                    <div class="char-portrait-large">
                      <div class="portrait-glow"></div>
                      <span class="big-icon">{{ activeDisplay.icon }}</span>
                    </div>
                    
                    <h2 class="inspector-name">{{ activeDisplay.name }}</h2>
                    <div class="inspector-meta">{{ activeDisplay.role }} — {{ activeDisplay.class }}</div>

                    <div class="stats-module">
                      <div class="stat-row" v-for="(val, key) in activeDisplay.stats_base" :key="key">
                        <label>{{ key }}</label>
                        <div class="bar-track">
                          <div class="bar-fill" :style="{ width: (val * 5) + '%', background: getStatColor(key) }"></div>
                        </div>
                        <span class="val-num">{{ val }}</span>
                      </div>
                    </div>

                    <div class="hp-calculation">
                      <span class="label">Puntos de Vida</span>
                      <span class="value">{{ calculateHP(activeDisplay) }} <small>PV</small></span>
                    </div>
                  </div>
                  
                  <div v-else class="inspector-empty">
                    <div class="ghost-rune">❖</div>
                    <p>La niebla oculta los destinos...</p>
                  </div>
                </transition>
              </div>

              <aside class="panel-party">
                <div class="panel-header">
                  <h3>Tu Vanguardia <span :class="{'text-gold': party.length === 4}">({{ party.length }}/4)</span></h3>
                </div>

                <div class="synergy-box" :class="synergyStatus.class">
                  <span class="synergy-icon">{{ synergyStatus.icon }}</span>
                  <div class="synergy-text">
                    <strong>{{ synergyStatus.title }}</strong>
                    <p>{{ synergyStatus.desc }}</p>
                  </div>
                </div>

                <div class="party-slots-container">
                  <transition-group name="slot-anim">
                    <div v-for="(char, idx) in party" :key="char.pregen_id" class="party-slot filled" @click="removeFromParty(idx)">
                      <div class="slot-avatar">{{ char.icon }}</div>
                      <div class="slot-details">
                        <span class="s-name">{{ char.name }}</span>
                        <span class="s-role">{{ char.role }}</span>
                      </div>
                      <div class="remove-btn">✕</div>
                    </div>
                  </transition-group>
                  
                  <div v-for="n in (4 - party.length)" :key="`empty-${n}`" class="party-slot empty">
                    <span>Hueco Libre</span>
                  </div>
                </div>

                <div class="action-footer">
                  <button class="btn-text" @click="currentStep = 1">← Cambiar Historia</button>
                  <button class="btn-legendary start" :disabled="party.length === 0" @click="launchAdventure">
                    <span class="btn-inner">COMENZAR</span>
                  </button>
                </div>
              </aside>
            </div>
          </section>
        </transition>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useGameStore } from '../stores/gameStore';

const router = useRouter();
const gameStore = useGameStore();

// --- ESTADO ---
const currentStep = ref(1);
const selectedCampaignId = ref(null);
const party = ref([]);
const previewChar = ref(null);
const toast = ref({ show: false, message: '', type: 'error' });

// --- CONFIGURACIÓN DE DATOS ---
const campaigns = [
  { id: 'minas', title: 'Minas de Grimhold', desc: 'Una antigua oscuridad despierta bajo las montañas. Los mineros no han regresado.', levels: '1-3', duration: 'Corta', locked: false },
  { id: 'castillo', title: 'Castillo Sombrío', desc: 'La fortaleza maldita del Rey Exánime. Solo los valientes osan entrar.', levels: '4-7', duration: 'Media', locked: true },
  { id: 'abismo', title: 'Ecos del Abismo', desc: 'El tejido de la realidad se desgarra. El fin de Aethelgard se aproxima.', levels: '10+', duration: 'Larga', locked: true },
];

const availableCharacters = [
  { pregen_id: "borin", name: "Borin", race: "Enano", class: "Guerrero", role: "Tank", icon: "🛡️", stats_base: { FUE: 17, DES: 12, CON: 16, INT: 8, SAB: 10, CAR: 9 }, pv_base: 12 },
  { pregen_id: "elara", name: "Elara", race: "Elfa", class: "Pícaro", role: "DPS", icon: "🗡️", stats_base: { FUE: 10, DES: 18, CON: 12, INT: 14, SAB: 11, CAR: 13 }, pv_base: 8 },
  { pregen_id: "sorin", name: "Sorin", race: "Humano", class: "Clérigo", role: "Healer", icon: "🩸", stats_base: { FUE: 13, DES: 10, CON: 14, INT: 10, SAB: 17, CAR: 14 }, pv_base: 8 },
  { pregen_id: "marius", name: "Marius", race: "Humano", class: "Mago", role: "DPS", icon: "🔥", stats_base: { FUE: 8, DES: 14, CON: 12, INT: 18, SAB: 13, CAR: 10 }, pv_base: 6 },
  { pregen_id: "grom", name: "Grom", race: "Orco", class: "Bárbaro", role: "Tank", icon: "🪓", stats_base: { FUE: 18, DES: 13, CON: 15, INT: 7, SAB: 9, CAR: 8 }, pv_base: 12 },
  { pregen_id: "lyra", name: "Lyra", race: "Semielfa", class: "Bardo", role: "Support", icon: "🎵", stats_base: { FUE: 9, DES: 15, CON: 11, INT: 13, SAB: 10, CAR: 18 }, pv_base: 8 },
];

// --- LÓGICA COMPUTADA ---

// Muestra el personaje sobre el que se hace hover, o el último añadido al grupo
const activeDisplay = computed(() => {
  if (previewChar.value) return previewChar.value;
  if (party.value.length > 0) return party.value[party.value.length - 1];
  return null;
});

// Analiza la composición del grupo para dar feedback al usuario
const synergyStatus = computed(() => {
  if (party.value.length === 0) return { title: 'Vanguardia Vacía', desc: 'Recluta héroes.', icon: '⚪', class: 'neutral' };
  
  const roles = party.value.map(c => c.role);
  const hasTank = roles.includes('Tank');
  const hasHealer = roles.includes('Healer') || roles.includes('Support');

  if (party.value.length < 3) return { title: 'Grupo Pequeño', desc: 'Faltan aliados.', icon: '⚠️', class: 'warning' };
  if (!hasTank) return { title: 'Vulnerable', desc: 'Sin tanque moriréis rápido.', icon: '🛡️', class: 'danger' };
  if (!hasHealer) return { title: 'Sin Apoyo', desc: 'Necesitáis sanación o soporte.', icon: '🩸', class: 'danger' };
  
  return { title: 'Grupo Equilibrado', desc: 'Listos para la batalla.', icon: '✨', class: 'success' };
});

const getStatColor = (stat) => {
  const colors = { FUE: '#cf3e3e', DES: '#47a34b', CON: '#e0b53d', INT: '#3d82e0', SAB: '#8e3de0', CAR: '#e07d3d' };
  return colors[stat] || '#888';
};

const calculateHP = (char) => {
  // Calculamos el modificador (por cada 2 puntos por encima de 10, +1 de vida)
  const conMod = Math.floor((char.stats_base.CON - 10) / 2);
  return char.pv_base + conMod;
};

// --- ACCIONES ---

const selectCampaign = (camp) => {
  if (camp.locked) {
    showToast("Esa historia aún no ha sido escrita.", "warning");
    return;
  }
  selectedCampaignId.value = camp.id;
};

const advanceStep = () => {
  if (selectedCampaignId.value) currentStep.value = 2;
};

const isInParty = (id) => party.value.some(c => c.pregen_id === id);

const toggleCharacter = (char) => {
  const idx = party.value.findIndex(c => c.pregen_id === char.pregen_id);
  if (idx >= 0) {
    party.value.splice(idx, 1);
  } else if (party.value.length < 4) {
    party.value.push(char);
  } else {
    showToast("El grupo ya está al máximo.", "error");
  }
};

const removeFromParty = (idx) => party.value.splice(idx, 1);

const showToast = (msg, type = 'error') => {
  toast.value = { show: true, message: msg, type };
  setTimeout(() => toast.value.show = false, 3000);
};

const launchAdventure = async () => {
  if (party.value.length === 0) return;

  try {
    // Preparamos los personajes con su vida calculada y stats listos para el combate
    const initialPartyState = party.value.map(char => {
       const maxHp = calculateHP(char);
       return {
         ...char,
         id: char.pregen_id, // Identificador para el motor de combate
         stats: { 
            hp: maxHp, 
            maxHp: maxHp, 
            xp: 0,
            ...char.stats_base 
         }
       };
    });

    // Guardamos los datos
    if (gameStore && gameStore.initializeGame) {
      await gameStore.initializeGame(initialPartyState);
    } else {
      localStorage.setItem('aethelgard_party', JSON.stringify(initialPartyState));
    }

    // Navegamos a la vista del juego
    await router.push('/game'); 

  } catch (error) {
    console.error("Error al iniciar:", error);
    showToast("Error de sistema al iniciar la aventura", "error");
  }
};
</script>

<style scoped lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700;900&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap');

/* VARIABLES CSS */
$c-void: #050505;
$c-panel: rgba(18, 18, 22, 0.98);
$c-gold: #c5a059;
$c-blood: #8a1c1c;
$f-title: 'Cinzel Decorative', cursive;
$f-body: 'Playfair Display', serif;

.creation-engine {
  position: relative;
  width: 100vw; height: 100vh;
  overflow: hidden;
  background: $c-void;
  font-family: $f-body;
  color: #eee;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* FONDOS */
.world-bg {
  position: absolute; inset: -2%;
  background: radial-gradient(circle at 50% 40%, #2a1010 0%, #000 80%);
  z-index: 0;
}
.fog-overlay {
  position: absolute; inset: 0;
  background: url('https://www.transparenttextures.com/patterns/dust.png');
  opacity: 0.3;
  animation: drift 60s linear infinite;
  z-index: 1;
}
.vignette {
  position: absolute; inset: 0;
  background: radial-gradient(circle, transparent 30%, black 100%);
  z-index: 2; pointer-events: none;
}

.layout-container {
  position: relative; z-index: 10;
  width: 95%; max-width: 1400px; height: 85vh;
  display: flex; flex-direction: column;
}

/* TOP BAR */
.top-bar {
  display: flex; justify-content: space-between; align-items: center;
  padding-bottom: 2rem; border-bottom: 1px solid rgba($c-gold, 0.2);
  margin-bottom: 2rem;
}
.game-title {
  font-family: $f-title; font-size: 2.5rem; color: $c-gold; margin: 0;
  .subtitle { font-size: 1rem; display: block; color: #666; letter-spacing: 4px; }
}

.progress-track { display: flex; align-items: center; gap: 15px; }
.step-node {
  width: 35px; height: 35px; border-radius: 50%; border: 2px solid #333;
  display: flex; align-items: center; justify-content: center;
  font-family: $f-title; transition: 0.4s;
  &.active { border-color: $c-gold; box-shadow: 0 0 15px rgba($c-gold, 0.4); color: $c-gold; }
  &.completed { background: $c-gold; color: #000; border-color: $c-gold; }
}
.node-label { position: absolute; top: 40px; font-size: 0.7rem; white-space: nowrap; color: #666; }
.connector { width: 50px; height: 2px; background: #222; &.filled { background: $c-gold; } }

/* ETAPA 1: CAMPAÑAS */
.stage-campaign { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; }
.campaign-showcase { display: flex; gap: 30px; perspective: 1000px; }

.campaign-tome {
  width: 280px; height: 400px; background: #111; border: 1px solid #333;
  cursor: pointer; transition: 0.5s; display: flex; flex-direction: column;
  &:hover:not(.locked) { transform: rotateY(-10deg) translateY(-10px); border-color: $c-gold; }
  &.selected { border: 2px solid $c-gold; transform: scale(1.05); }
  &.locked { opacity: 0.4; filter: grayscale(1); cursor: not-allowed; }
}
.tome-cover {
  flex: 2; background: linear-gradient(135deg, #1a1a1a, #0a0a0a);
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  padding: 20px; border-bottom: 1px solid rgba($c-gold, 0.3);
  .tome-title { font-family: $f-title; font-size: 1.4rem; text-align: center; }
}
.tome-badge {
  margin-top: 15px; font-size: 0.7rem; letter-spacing: 2px; padding: 4px 10px; border: 1px solid;
  &.open { color: #4caf50; }
}
.tome-desc { flex: 1; padding: 15px; font-size: 0.85rem; color: #888; background: #080808; }

/* ETAPA 2: PARTY */
.party-interface { display: grid; grid-template-columns: 320px 1fr 320px; gap: 20px; height: 100%; }

aside { background: $c-panel; border: 1px solid #222; display: flex; flex-direction: column; }
.panel-header { padding: 15px; border-bottom: 1px solid #222; h3 { margin: 0; font-family: $f-title; color: $c-gold; } }

.roster-list { flex: 1; overflow-y: auto; padding: 10px; }
.roster-card {
  display: flex; align-items: center; padding: 12px; background: #151515; border: 1px solid #222;
  margin-bottom: 8px; cursor: pointer; transition: 0.2s;
  &:hover:not(.is-disabled) { border-color: $c-gold; background: #1a1a1a; }
  &.is-in-party { border-color: $c-gold; background: rgba($c-gold, 0.05); }
  &.is-disabled { opacity: 0.3; cursor: not-allowed; }
}
.card-art-frame { width: 40px; height: 40px; font-size: 1.5rem; display: flex; align-items: center; justify-content: center; margin-right: 12px; }
.c-info { flex: 1; .c-name { display: block; font-weight: bold; } .c-class { font-size: 0.75rem; color: #666; } }

/* INSPECTOR */
.panel-inspector { display: flex; align-items: center; justify-content: center; text-align: center; }
.char-portrait-large {
  width: 140px; height: 140px; background: #000; border: 2px solid $c-gold;
  margin: 0 auto 20px; transform: rotate(45deg); display: flex; align-items: center; justify-content: center;
  .big-icon { transform: rotate(-45deg); font-size: 4rem; }
}
.inspector-name { font-family: $f-title; font-size: 2.5rem; color: $c-gold; margin: 0; }
.stats-module { max-width: 350px; margin: 2rem auto; }
.stat-row { display: flex; align-items: center; margin-bottom: 10px; font-size: 0.8rem; label { width: 40px; } }
.bar-track { flex: 1; height: 4px; background: #111; margin: 0 10px; .bar-fill { height: 100%; transition: 0.6s ease-out; } }

/* SYNERGY & SLOTS */
.synergy-box {
  margin: 15px; padding: 12px; font-size: 0.8rem; border-radius: 4px; display: flex; gap: 10px;
  &.danger { background: rgba($c-blood, 0.1); border: 1px solid $c-blood; color: #ffb4b4; }
  &.success { background: rgba(#4caf50, 0.1); border: 1px solid #4caf50; color: #b4ffb4; }
  &.neutral { background: #1a1a1a; border: 1px solid #333; }
}

.party-slots-container { flex: 1; padding: 15px; display: flex; flex-direction: column; gap: 10px; }
.party-slot {
  height: 60px; display: flex; align-items: center; padding: 0 15px;
  &.empty { border: 1px dashed #333; color: #444; justify-content: center; font-style: italic; }
  &.filled { 
    background: #1a1a1a; border: 1px solid #333; border-left: 3px solid $c-gold; cursor: pointer;
    &:hover { border-color: $c-blood; .remove-btn { opacity: 1; } }
  }
}
.remove-btn { margin-left: auto; color: $c-blood; opacity: 0; transition: 0.2s; }

/* BUTTONS */
.btn-legendary {
  background: transparent; border: none; cursor: pointer; position: relative;
  .btn-inner {
    display: block; padding: 15px 50px; background: $c-blood; color: white;
    font-family: $f-title; font-size: 1.2rem; letter-spacing: 2px;
    clip-path: polygon(5% 0, 100% 0, 95% 100%, 0 100%);
  }
  &:hover:not(:disabled) .btn-inner { background: lighten($c-blood, 10%); transform: translateY(-2px); }
  &:disabled { opacity: 0.5; filter: grayscale(1); }
}

/* TOAST */
.error-toast {
  position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
  z-index: 1000; padding: 15px 30px; background: #1a1a1a; border-top: 3px solid $c-blood;
  box-shadow: 0 10px 40px rgba(0,0,0,0.8); display: flex; gap: 15px;
}

/* ANIMATIONS */
@keyframes drift { from { background-position: 0 0; } to { background-position: 1000px 1000px; } }
.scene-switch-enter-from { opacity: 0; transform: translateX(30px); }
.scene-switch-leave-to { opacity: 0; transform: translateX(-30px); }
.scene-switch-enter-active, .scene-switch-leave-active { transition: 0.5s ease; }
</style>