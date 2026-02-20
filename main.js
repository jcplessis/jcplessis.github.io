// --- CONFIGURATION ---
const PX_PER_MS = 0.3;
const SCREEN_OFFSET_RATIO = 0.85;
const CLEANUP_THRESHOLD_PX = 1000;

// Configuration des Notes
const NOTE_CONFIG = {
  // KICK
  36: { y: 30,  color: '#ff3333', name: 'Kick' },

  // SNARE
  38: { y: 70,  color: '#eeeeee', name: 'Snare' },
  40: { y: 85,  color: '#eeeeee', name: 'Snare Rim', isRim: true },

  // TOMS
  43: { y: 130, color: '#228B22', name: 'Tom Basse' },
  58: { y: 140, color: '#228B22', name: 'Tom Basse Rim', isRim: true },
  45: { y: 170, color: '#32CD32', name: 'Tom Medium' },
  47: { y: 180, color: '#32CD32', name: 'Tom Medium Rim', isRim: true },
  48: { y: 210, color: '#98FB98', name: 'Tom Haut' },
  50: { y: 220, color: '#98FB98', name: 'Tom Haut Rim', isRim: true },

  // CYMBALES & HH
  42: { y: 260, color: '#FFA500', name: 'Hi-Hat Closed' },
  44: { y: 270, color: '#FFA500', name: 'Hi-Hat Pedal' },

  // HH Open : Durée 1s (1000ms)
  46: { y: 280, color: '#FFD700', name: 'Hi-Hat Open', type: 'sustained', defaultDuration: 1000 },

  // Autres cymbales : Durée 2s (2000ms)
  51: { y: 320, color: '#FF8C00', name: 'Ride',    type: 'sustained', defaultDuration: 2000 },
  49: { y: 350, color: '#FF4500', name: 'Crash 1', type: 'sustained', defaultDuration: 2000 },
  57: { y: 370, color: '#FF4500', name: 'Crash 2', type: 'sustained', defaultDuration: 2000 }
};

// --- VARIABLES ---
let startTime = null;
let isRunning = false;
let animationId = null;
let lastDrawnSecond = -1;

// activeNotes : contient les notes en train de "grandir"
// structure : NoteMIDI -> { element, startX, maxDurationPx }
const activeNotes = new Map();

// DOM
const wrapper = document.getElementById("timeline-wrapper");
const content = document.getElementById("timeline-content");
const statusEl = document.getElementById("status");
const deviceList = document.getElementById("deviceList");

// --- BUTTON WIRING ---
document.getElementById("connectBtn").onclick = connectMIDI;
document.getElementById("demoBtn").onclick = startDemo;
document.getElementById("resetBtn").onclick = resetTimeline;

// --- PROVIDER CALLBACKS (called by midi.js and demo.js) ---

function onStart(timestamp) {
  startClock(timestamp);
}

function onNoteOn(note, timestamp) {
  handleNoteOn(note, timestamp);
}

function onChoke(note) {
  chokeNote(note);
}

// --- CLOCK ---

function startClock(timestamp) {
  if (isRunning) return;
  isRunning = true;
  startTime = timestamp; // use event time (DOMHighResTimeStamp)
  drawLoop();
}

function resetTimeline() {
  clearDemoTimeouts(); // stop any running demo loop
  content.innerHTML = '';
  startTime = null;
  lastDrawnSecond = -1;
  isRunning = false;
  activeNotes.clear();
  wrapper.scrollLeft = 0;
  if (animationId) cancelAnimationFrame(animationId);
  statusEl.textContent = "Reset effectué.";
}

// --- BOUCLE D'ANIMATION ---

function drawLoop() {
  if (!isRunning) return;

  const now = performance.now();
  const timeElapsed = now - startTime;
  const currentHeadX = timeElapsed * PX_PER_MS;

  // 1. Mise à jour des barres progressives
  activeNotes.forEach((data, noteId) => {
    let currentWidth = currentHeadX - data.startX;

    if (currentWidth >= data.maxDurationPx) {
      currentWidth = data.maxDurationPx;
      activeNotes.delete(noteId);
    }

    data.element.style.width = currentWidth + "px";
  });

  // 2. Scroll Automatique
  const containerWidth = wrapper.clientWidth;
  const targetScroll = currentHeadX - (containerWidth * SCREEN_OFFSET_RATIO);
  if (targetScroll > 0) {
    wrapper.scrollLeft = targetScroll;
  }

  // 3. Dessiner la grille
  updateGrid(timeElapsed);

  // 4. Nettoyage
  cleanupDOM(wrapper.scrollLeft);

  animationId = requestAnimationFrame(drawLoop);
}

function updateGrid(currentTimeMs) {
  const currentSecond = Math.floor(currentTimeMs / 1000);
  const targetSecond = currentSecond + 2;
  if (targetSecond > lastDrawnSecond) {
    for (let s = lastDrawnSecond + 1; s <= targetSecond; s++) {
      const x = (s * 1000) * PX_PER_MS;
      createDOMElement("div", "grid-line", x, null, content);
      const label = createDOMElement("div", "grid-label", x, null, content);
      label.innerText = s + "s";
    }
    lastDrawnSecond = targetSecond;
  }
}

function cleanupDOM(scrollLeft) {
  const limit = scrollLeft - CLEANUP_THRESHOLD_PX;
  while (content.firstElementChild) {
    const el = content.firstElementChild;
    const left = parseFloat(el.style.left);
    let width = 0;
    if (el.style.width) width = parseFloat(el.style.width);

    if ((left + width) < limit) {
      content.removeChild(el);
    } else {
      break;
    }
  }
}

// --- NOTE RENDERING ---

function handleNoteOn(note, timestamp) {
  if (!startTime) return;
  const x = (timestamp - startTime) * PX_PER_MS;

  const conf = NOTE_CONFIG[note];
  const y = conf ? conf.y : 400;
  const color = conf ? conf.color : '#666';
  const isRim = conf ? conf.isRim : false;
  const isSustained = conf && conf.type === 'sustained';
  const defaultDur = (conf && conf.defaultDuration) ? conf.defaultDuration : 1000;

  // Logique Hi-Hat : Si on appuie sur fermé (42/44), on étouffe l'ouvert (46)
  if (note === 42 || note === 44) {
    chokeNote(46);
  }

  // Trait vertical de départ
  const lineEl = createDOMElement("div", "note-line", x, null, content);

  if (isSustained) {
    const barEl = createDOMElement("div", "note-bar", x, y - 7, content);
    barEl.style.backgroundColor = color;
    barEl.style.width = "0px";

    activeNotes.set(note, {
      element: barEl,
      startX: x,
      maxDurationPx: defaultDur * PX_PER_MS
    });

  } else {
    const markerEl = document.createElement("div");
    markerEl.className = "note-marker" + (isRim ? " rim" : "");
    markerEl.style.bottom = (y - 6) + "px";
    markerEl.style.backgroundColor = color;
    markerEl.style.color = color;
    lineEl.appendChild(markerEl);
  }
}

function chokeNote(noteTarget) {
  if (activeNotes.has(noteTarget)) {
    const data = activeNotes.get(noteTarget);
    data.element.classList.add("choked");
    activeNotes.delete(noteTarget);
  }
}

function createDOMElement(tag, className, left, bottom, parent) {
  const el = document.createElement(tag);
  el.className = className;
  el.style.left = left + "px";
  if (bottom !== null) el.style.bottom = bottom + "px";
  parent.appendChild(el);
  return el;
}
