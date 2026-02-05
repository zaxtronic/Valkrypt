<template>
  <div class="creation-engine">
    <div class="world-bg"></div>
    <div class="fog-overlay"></div>
    <div class="vignette"></div>
    
    <transition name="toast-pop">
      <div v-if="toast.show" class="error-toast" :class="toast.type">
        <span class="toast-icon">⚠️</span>
        <span>{{ toast.message }}</span>
      </div>
    </transition>

    <div class="layout-container">
      
      <header class="top-bar">
        <h1 class="game-title">Aethelgard <span class="subtitle">Chronicles</span></h1>
        <div class="progress-track">
          <div class="step-node" :class="{ active: currentStep === 1, completed: currentStep > 1 }">
            <span class="node-num">I</span>
            <span class="node-label">Contrato</span>
          </div>
          <div class="connector" :class="{ filled: currentStep > 1 }"></div>
          <div class="step-node" :class="{ active: currentStep === 2 }">
            <span class="node-num">II</span>
            <span class="node-label">Vanguardia</span>
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
                  <div class="tome-badge" v-if="camp.locked">🔒 BLOQUEADO</div>
                  <div class="tome-badge open" v-else>DISPONIBLE</div>
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
                <span class="btn-inner">REUNIR GRUPO</span>
                <div class="btn-glow"></div>
              </button>
            </div>
          </section>

          <section v-else key="step-party" class="stage-party">
            
            <div class="party-interface">
              <aside class="panel-roster">
                <div class="panel-header">
                  <h3>Códice de Héroes</h3>
                  <small>Haz clic para reclutar</small>
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
                      <span class="c-class">{{ char.class }}</span>
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
                    <div class="inspector-meta">{{ activeDisplay.race }} — {{ activeDisplay.class }}</div>

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
                      <span class="label">Vida Estimada</span>
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
                        <span class="s-role">{{ char.class }}</span>
                      </div>
                      <div class="remove-btn">✕</div>
                    </div>
                  </transition-group>
                  
                  <div v-for="n in (4 - party.length)" :key="`empty-${n}`" class="party-slot empty">
                    <span>Hueco Libre</span>
                  </div>
                </div>

                <div class="action-footer">
                  <button class="btn-text" @click="currentStep = 1">← Volver</button>
                  <button class="btn-legendary start" :disabled="party.length === 0" @click="launchAdventure">
                    <span class="btn-inner">COMENZAR AVENTURA</span>
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
import { useGameStore } from '../stores/gameStore'; // Asegúrate de tener esto

const router = useRouter();
const gameStore = useGameStore();

// --- ESTADO ---
const currentStep = ref(1);
const selectedCampaignId = ref(null);
const selectedStartSection = ref(null);
const party = ref([]);
const previewChar = ref(null);
const toast = ref({ show: false, message: '', type: 'error' });

// --- DATOS DUROS (CONFIG) ---
const campaigns = [
  { id: 'minas', title: 'Las Minas Corruptas', desc: 'Una antigua oscuridad despierta bajo Grimhold. Ideal para nuevos aventureros.', levels: '1-3', duration: 'Corta', locked: false, startSection: '1' },
  { id: 'castillo', title: 'Castillo Sombrío', desc: 'La fortaleza maldita espera a quienes osen desafiar al Rey Exánime.', levels: '3-6', duration: 'Media', locked: true },
  { id: 'abismo', title: 'Ecos del Abismo', desc: 'Solo la locura aguarda en las profundidades dimensionales.', levels: '10+', duration: 'Larga', locked: true },
];

const availableCharacters = [
  { pregen_id: "borin", numeric_id: 1, name: "Borin", race: "Enano", class: "Guerrero", role: "Tank", icon: "🛡️", stats_base: { FUE: 17, DES: 13, CON: 16, INT: 10, SAB: 10, CAR: 8 }, pv_base: 12 },
  { pregen_id: "elara", numeric_id: 2, name: "Elara", race: "Elfa", class: "Pícaro", role: "DPS", icon: "🗡️", stats_base: { FUE: 10, DES: 17, CON: 12, INT: 14, SAB: 10, CAR: 12 }, pv_base: 8 },
  { pregen_id: "sorin", numeric_id: 3, name: "Sorin", race: "Humano", class: "Clérigo", role: "Healer", icon: "🩸", stats_base: { FUE: 12, DES: 10, CON: 14, INT: 12, SAB: 16, CAR: 14 }, pv_base: 8 },
  { pregen_id: "marius", numeric_id: 4, name: "Marius", race: "Humano", class: "Mago", role: "Control", icon: "🔥", stats_base: { FUE: 8, DES: 14, CON: 12, INT: 17, SAB: 13, CAR: 10 }, pv_base: 6 },
  { pregen_id: "grom", numeric_id: 5, name: "Grom", race: "Orco", class: "Bárbaro", role: "Tank", icon: "🪓", stats_base: { FUE: 18, DES: 12, CON: 16, INT: 8, SAB: 10, CAR: 8 }, pv_base: 12 },
  { pregen_id: "lyra", numeric_id: 6, name: "Lyra", race: "Semielfa", class: "Bardo", role: "Support", icon: "🎵", stats_base: { FUE: 8, DES: 15, CON: 10, INT: 12, SAB: 10, CAR: 17 }, pv_base: 8 },
];

// --- LOGICA ---

// Visualizador activo (Hover o el último seleccionado)
const activeDisplay = computed(() => {
  if (previewChar.value) return previewChar.value;
  if (party.value.length > 0) return party.value[party.value.length - 1];
  return null;
});

// Análisis de Sinergia del Grupo
const synergyStatus = computed(() => {
  if (party.value.length === 0) return { title: 'Vanguardia Vacía', desc: 'Recluta héroes.', icon: '⚪', class: 'neutral' };
  
  const roles = party.value.map(c => c.role);
  const hasTank = roles.includes('Tank');
  const hasHealer = roles.includes('Healer') || roles.includes('Support');
  const count = party.value.length;

  if (count < 3) return { title: 'Grupo Pequeño', desc: 'Se recomienda ir con más aliados.', icon: '⚠️', class: 'warning' };
  if (!hasTank) return { title: 'Vulnerable', desc: 'Falta alguien que absorba daño (Tanque).', icon: '🛡️', class: 'danger' };
  if (!hasHealer) return { title: 'Sin Sanación', desc: 'Las heridas serán permanentes sin Clérigo.', icon: '🩸', class: 'danger' };
  
  return { title: 'Grupo Equilibrado', desc: 'Tenéis buenas probabilidades de sobrevivir.', icon: '✨', class: 'success' };
});

const getStatColor = (stat) => {
  const colors = { FUE: '#d32f2f', DES: '#388e3c', CON: '#fbc02d', INT: '#1976d2', SAB: '#7b1fa2', CAR: '#e64a19' };
  return colors[stat] || '#ccc';
};

const calculateHP = (char) => {
  const conMod = Math.floor((char.stats_base.CON - 10) / 2);
  return char.pv_base + conMod; // Nivel 1
};

// --- ACCIONES ---

const selectCampaign = (camp) => {
  if (camp.locked) {
    showToast("Esa historia aún no ha sido escrita.", "warning");
    return;
  }
  selectedCampaignId.value = camp.id;
  selectedStartSection.value = camp.startSection;
};

const advanceStep = () => {
  if (selectedCampaignId.value) currentStep.value = 2;
};

const isInParty = (id) => party.value.some(c => c.pregen_id === id);

const toggleCharacter = (char) => {
  const idx = party.value.findIndex(c => c.pregen_id === char.pregen_id);
  if (idx >= 0) {
    removeFromParty(idx);
  } else {
    if (party.value.length < 4) {
      party.value.push(char);
    } else {
      showToast("El grupo está lleno.", "error");
    }
  }
};

const removeFromParty = (idx) => {
  party.value.splice(idx, 1);
};

const showToast = (msg, type = 'info') => {
  toast.value = { show: true, message: msg, type };
  setTimeout(() => toast.value.show = false, 3000);
};

// --- LANZAMIENTO DEL JUEGO (CRÍTICO) ---
const launchAdventure = async () => {
  if (party.value.length === 0) return;

  try {
    // 1. Preparar datos completos
    const initialPartyState = party.value.map(char => {
       const modCon = Math.floor((char.stats_base.CON - 10) / 2);
       const maxHp = char.pv_base + modCon;
       return {
         ...char, // Copia datos base
         id: char.pregen_id, // Asegurar ID
         stats: { 
            hp: maxHp, 
            maxHp: maxHp, 
            xp: 0,
            ...char.stats_base // Copia stats FUE, DES, etc.
         }
       };
    });

    console.log("🚀 Iniciando aventura con:", initialPartyState);

    // 2. Inicializar Store (Pinia)
    // Asumiendo que tu gameStore tiene este método. Si no, lo guardamos en localStorage.
    if (gameStore && gameStore.initializeGame) {
      await gameStore.initializeGame(initialPartyState);
    } else {
      // Fallback a LocalStorage si el Store no está listo
      localStorage.setItem('aethelgard_party', JSON.stringify(initialPartyState));
    }

    // 3. ENRUTAMIENTO SEGURO
    // Intentamos ir a la ruta '/game'. Asegúrate de que existe en router/index.js
    await router.push('/game'); 

  } catch (error) {
    console.error("❌ Error fatal al iniciar:", error);
    
    // Fallback: Si el router falla (ej: ruta no existe), mostramos error
    if (error.message && error.message.includes('No match')) {
        showToast("Error de Sistema: La ruta '/game' no existe.", "error");
    } else {
        showToast("Error iniciando la simulación. Revisa la consola.", "error");
    }
  }
};
</script>

<style scoped lang="scss">
/* --- FUENTES IMPORTADAS --- */
@import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700;900&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap');

/* --- VARIABLES --- */
:root {
  --c-void: #050505;
  --c-panel: rgba(18, 18, 20, 0.95);
  --c-gold: #c5a059;
  --c-gold-shine: #ffd700;
  --c-blood: #8a1c1c;
  --c-text: #e0e0e0;
  --f-title: 'Cinzel Decorative', cursive;
  --f-body: 'Playfair Display', serif;
}

/* --- ESTRUCTURA GLOBAL --- */
.creation-engine {
  position: relative;
  width: 100vw; height: 100vh;
  overflow: hidden;
  background: var(--c-void);
  font-family: var(--f-body);
  color: var(--c-text);
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Fondos */
.world-bg {
  position: absolute; inset: -5%;
  background: url('https://www.transparenttextures.com/patterns/dark-matter.png'), radial-gradient(circle at 50% 30%, #2a2a2a 0%, #000 90%);
  animation: slowPan 60s infinite alternate;
  z-index: 0;
}
.fog-overlay {
  position: absolute; inset: 0;
  background-image: url('https://raw.githubusercontent.com/daniel-nagy/md-data/master/images/fog.png');
  background-size: cover;
  opacity: 0.2;
  animation: drift 30s linear infinite;
  z-index: 1;
}
.vignette {
  position: absolute; inset: 0;
  background: radial-gradient(circle, transparent 40%, black 100%);
  z-index: 2; pointer-events: none;
}

/* Layout */
.layout-container {
  position: relative; z-index: 10;
  width: 95%; max-width: 1600px; height: 90vh;
  display: flex; flex-direction: column;
}

/* Header */
.top-bar {
  display: flex; justify-content: space-between; align-items: center;
  padding-bottom: 20px; border-bottom: 1px solid rgba(197,160,89,0.3);
  margin-bottom: 30px;
}
.game-title {
  font-family: var(--f-title); font-size: 3rem; color: var(--c-gold);
  text-shadow: 0 0 20px rgba(197,160,89,0.4); margin: 0;
  .subtitle { font-size: 1.2rem; display: block; letter-spacing: 5px; color: #888; text-align: right; }
}

/* Progress Bar */
.progress-track { display: flex; align-items: center; gap: 10px; }
.step-node {
  width: 40px; height: 40px; border-radius: 50%; border: 2px solid #444;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  color: #666; font-family: var(--f-title); position: relative;
  transition: 0.3s;
  
  &.active { border-color: var(--c-gold); color: var(--c-gold); box-shadow: 0 0 15px var(--c-gold); }
  &.completed { background: var(--c-gold); color: black; border-color: var(--c-gold); }
}
.node-label { position: absolute; bottom: -20px; font-size: 0.7rem; width: 100px; text-align: center; font-family: sans-serif; }
.connector { width: 60px; height: 2px; background: #333; }
.connector.filled { background: var(--c-gold); }

/* --- ETAPA 1: CAMPAÑAS --- */
.stage-campaign { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; }

.campaign-showcase {
  display: flex; gap: 40px; justify-content: center; align-items: center; flex-wrap: wrap;
  perspective: 1000px;
}

.campaign-tome {
  width: 300px; height: 450px;
  background: #151515;
  border: 1px solid #333;
  display: flex; flex-direction: column;
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  cursor: pointer; position: relative; overflow: hidden;
  
  &:hover:not(.locked) { transform: translateY(-20px) rotateX(5deg); border-color: var(--c-gold); box-shadow: 0 30px 50px rgba(0,0,0,0.8); }
  &.selected { border: 2px solid var(--c-gold); box-shadow: 0 0 30px rgba(197,160,89,0.3); transform: scale(1.05); }
  &.locked { filter: grayscale(1) brightness(0.5); cursor: not-allowed; }
}

.tome-cover {
  flex: 2; background: linear-gradient(135deg, #222, #111);
  display: flex; flex-direction: column; justify-content: center; align-items: center;
  padding: 20px; border-bottom: 2px solid var(--c-gold);
  position: relative;
}
.tome-title { font-family: var(--f-title); text-align: center; color: #eee; font-size: 1.5rem; z-index: 2; }
.tome-binding { position: absolute; left: 10px; top: 0; bottom: 0; width: 5px; background: #000; box-shadow: 2px 0 5px rgba(0,0,0,0.5); }

.tome-badge {
  margin-top: 15px; padding: 5px 10px; border: 1px solid #555; font-size: 0.8rem; letter-spacing: 2px;
  &.open { border-color: #4caf50; color: #4caf50; }
}

.tome-desc { flex: 1; padding: 20px; background: #0e0e0e; color: #aaa; font-size: 0.9rem; display: flex; flex-direction: column; justify-content: space-between; }
.meta-tags { display: flex; gap: 10px; font-weight: bold; color: var(--c-gold); font-size: 0.8rem; }

/* Botón Legendario */
.controls-center { margin-top: 50px; }
.btn-legendary {
  background: transparent; border: none; padding: 0; cursor: pointer; position: relative;
  &:disabled { filter: grayscale(1); opacity: 0.5; cursor: not-allowed; }
}
.btn-inner {
  display: block; padding: 20px 60px; background: linear-gradient(90deg, #5a0f0f, #8a1c1c);
  color: white; font-family: var(--f-title); font-size: 1.5rem; letter-spacing: 3px;
  border: 1px solid var(--c-gold); clip-path: polygon(10% 0, 100% 0, 100% 80%, 90% 100%, 0 100%, 0 20%);
  transition: 0.3s;
}
.btn-legendary:hover:not(:disabled) .btn-inner {
  background: linear-gradient(90deg, #7a1f1f, #a82c2c); transform: scale(1.05); letter-spacing: 5px;
}
.btn-glow {
  position: absolute; inset: -5px; background: var(--c-gold); z-index: -1;
  filter: blur(15px); opacity: 0; transition: 0.5s;
}
.btn-legendary:hover:not(:disabled) .btn-glow { opacity: 0.6; }

/* --- ETAPA 2: PARTY --- */
.stage-party { flex: 1; height: 100%; }
.party-interface { display: grid; grid-template-columns: 350px 1fr 350px; gap: 30px; height: 100%; }

/* Paneles Laterales */
aside {
  background: var(--c-panel); border: 1px solid #333;
  display: flex; flex-direction: column; backdrop-filter: blur(10px);
}
.panel-header { padding: 15px; border-bottom: 1px solid #444; background: rgba(0,0,0,0.5); }
.panel-header h3 { margin: 0; color: var(--c-gold); font-family: var(--f-title); }

/* Roster */
.roster-list { flex: 1; overflow-y: auto; padding: 10px; display: flex; flex-direction: column; gap: 8px; }
.roster-card {
  display: flex; align-items: center; padding: 10px; background: #1a1a1a; border: 1px solid #333; cursor: pointer; transition: 0.2s;
  &:hover:not(.is-disabled) { border-color: var(--c-gold); background: #252525; }
  &.is-in-party { border-color: var(--c-gold); background: #151000; }
  &.is-disabled { opacity: 0.4; pointer-events: none; }
}
.card-art-frame { width: 40px; height: 40px; background: #000; border: 1px solid #444; display: flex; align-items: center; justify-content: center; margin-right: 15px; font-size: 1.5rem; }
.c-info { flex: 1; display: flex; flex-direction: column; }
.c-name { font-weight: bold; color: #eee; }
.c-class { font-size: 0.8rem; color: #888; }
.check-mark { color: var(--c-gold); font-weight: bold; }

/* Inspector (Centro) */
.panel-inspector {
  display: flex; justify-content: center; align-items: center;
  position: relative; border: 1px solid rgba(197,160,89,0.1);
  background: radial-gradient(circle, rgba(197,160,89,0.05) 0%, transparent 70%);
}
.inspector-content { text-align: center; width: 100%; padding: 20px; animation: fadeIn 0.5s ease; }

.char-portrait-large {
  width: 120px; height: 120px; margin: 0 auto 20px;
  background: #000; border: 2px solid var(--c-gold); transform: rotate(45deg);
  display: flex; align-items: center; justify-content: center;
  position: relative; box-shadow: 0 0 30px rgba(0,0,0,0.5);
  
  .big-icon { transform: rotate(-45deg); font-size: 4rem; z-index: 2; }
  .portrait-glow { position: absolute; inset: 0; box-shadow: inset 0 0 20px var(--c-gold); z-index: 1; }
}

.inspector-name { font-family: var(--f-title); font-size: 3rem; margin: 0; color: var(--c-gold); text-shadow: 0 2px 5px black; }
.inspector-meta { font-size: 1.2rem; color: #aaa; margin-bottom: 40px; text-transform: uppercase; letter-spacing: 3px; }

/* Stats Module */
.stats-module { max-width: 400px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
.stat-row { display: flex; align-items: center; font-size: 0.9rem; }
.stat-row label { width: 40px; color: #888; font-weight: bold; }
.bar-track { flex: 1; height: 6px; background: #222; margin: 0 10px; border-radius: 2px; overflow: hidden; }
.bar-fill { height: 100%; transition: width 0.5s ease; }
.val-num { width: 20px; text-align: right; font-weight: bold; color: #eee; }

.hp-calculation { margin-top: 30px; padding-top: 20px; border-top: 1px solid #333; }
.hp-calculation .value { font-size: 2.5rem; color: var(--c-blood); font-family: var(--f-title); }

.inspector-empty { opacity: 0.5; text-align: center; }
.ghost-rune { font-size: 5rem; margin-bottom: 20px; animation: pulse 3s infinite; }

/* Party (Derecha) */
.synergy-box {
  margin: 15px; padding: 15px; border-radius: 4px; display: flex; align-items: flex-start; gap: 10px; font-size: 0.9rem;
  &.neutral { background: #222; border: 1px solid #444; }
  &.warning { background: rgba(255, 152, 0, 0.1); border: 1px solid #ff9800; color: #ffb74d; }
  &.danger { background: rgba(244, 67, 54, 0.1); border: 1px solid #f44336; color: #e57373; }
  &.success { background: rgba(76, 175, 80, 0.1); border: 1px solid #4caf50; color: #81c784; }
}

.party-slots-container { flex: 1; display: flex; flex-direction: column; gap: 10px; padding: 15px; }
.party-slot {
  display: flex; align-items: center; padding: 10px; background: #111; border: 1px dashed #444; transition: 0.3s;
  &.empty { justify-content: center; color: #444; font-style: italic; }
  &.filled { border: 1px solid #555; border-left: 3px solid var(--c-gold); background: #1a1a1a; cursor: pointer; }
  &.filled:hover { border-color: var(--c-blood); background: #201010; .remove-btn { opacity: 1; } }
}
.slot-avatar { font-size: 1.5rem; margin-right: 15px; }
.slot-details { flex: 1; display: flex; flex-direction: column; }
.remove-btn { color: var(--c-blood); font-weight: bold; opacity: 0; transition: 0.2s; font-size: 1.2rem; }

.action-footer { padding: 20px; border-top: 1px solid #333; display: flex; justify-content: space-between; align-items: center; }
.btn-text { background: none; border: none; color: #888; cursor: pointer; &:hover { color: #eee; text-decoration: underline; } }
.btn-legendary.start .btn-inner { font-size: 1.1rem; padding: 15px 30px; }

/* TOAST */
.error-toast {
  position: absolute; top: 20px; left: 50%; transform: translateX(-50%);
  background: #333; padding: 15px 30px; border-radius: 4px; border-left: 5px solid;
  z-index: 100; display: flex; align-items: center; gap: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.8);
  
  &.error { border-color: #f44336; color: #ffcdd2; background: #2c0b0b; }
  &.warning { border-color: #ff9800; color: #ffe0b2; background: #2c1e0b; }
}
.toast-pop-enter-active, .toast-pop-leave-active { transition: all 0.3s ease; }
.toast-pop-enter-from, .toast-pop-leave-to { opacity: 0; transform: translate(-50%, -20px); }

/* ANIMACIONES */
@keyframes slowPan { from { background-position: 0% 0%; } to { background-position: 100% 100%; } }
@keyframes drift { from { background-position: 0 0; } to { background-position: 1000px 0; } }
@keyframes pulse { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.7; } }
@keyframes fadeIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }

.scene-switch-enter-active, .scene-switch-leave-active { transition: all 0.6s cubic-bezier(0.25, 0.8, 0.25, 1); }
.scene-switch-enter-from { opacity: 0; transform: translateX(50px); }
.scene-switch-leave-to { opacity: 0; transform: translateX(-50px); }

.slot-anim-enter-active, .slot-anim-leave-active { transition: all 0.3s ease; }
.slot-anim-enter-from { opacity: 0; transform: translateX(-20px); }
.slot-anim-leave-to { opacity: 0; transform: translateX(20px); }

/* SCROLLBAR */
.custom-scroll::-webkit-scrollbar { width: 5px; }
.custom-scroll::-webkit-scrollbar-track { background: #111; }
.custom-scroll::-webkit-scrollbar-thumb { background: #444; border-radius: 2px; }
.custom-scroll::-webkit-scrollbar-thumb:hover { background: var(--c-gold); }

/* RESPONSIVE */
@media (max-width: 1200px) {
  .party-interface { grid-template-columns: 300px 1fr; }
  .panel-inspector { display: none; } /* Ocultar centro en tablets */
}
@media (max-width: 768px) {
  .layout-container { height: 100vh; width: 100%; }
  .party-interface { grid-template-columns: 1fr; grid-template-rows: 1fr 1fr; }
  .panel-roster { border-bottom: 2px solid var(--c-gold); }
}
</style>