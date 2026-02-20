// --- REAL MIDI PROVIDER ---
// Calls into main.js callbacks: onStart(timestamp), onNoteOn(note, timestamp), onChoke(note)

let midiAccess = null;

async function connectMIDI() {
  try {
    midiAccess = await navigator.requestMIDIAccess();
    statusEl.textContent = "MIDI Connecté. Prêt.";
    updateDeviceList();
    midiAccess.onstatechange = () => {
      updateDeviceList();
      for (let input of midiAccess.inputs.values()) {
        input.onmidimessage = handleMIDIMessage;
      }
    };
    for (let input of midiAccess.inputs.values()) {
      input.onmidimessage = handleMIDIMessage;
    }
  } catch (e) {
    statusEl.textContent = "Erreur accès MIDI.";
  }
}

function updateDeviceList() {
  const inputs = Array.from(midiAccess.inputs.values());
  deviceList.innerHTML = inputs.length ? inputs.map(i => i.name).join(", ") : "Pas de source MIDI";
}

connectMIDI();

function handleMIDIMessage(msg) {
  const [cmd, note, value] = msg.data;

  // Ignore MIDI clock (248) and active sensing (254)
  if (cmd === 248 || cmd === 254) return;

  // Use the hardware-timestamped event time (DOMHighResTimeStamp)
  const timestamp = msg.timeStamp;

  // Start the clock on the first real event
  if (!isRunning && value > 0) {
    onStart(timestamp);
  }
  if (!startTime) return;

  // NOTE ON
  if ((cmd >= 144 && cmd <= 159) && value > 0) {
    onNoteOn(note, timestamp);
  }
  // POLYPHONIC AFTERTOUCH -> CHOKE
  else if (cmd === 169 && value > 0) {
    onChoke(note);
  }
}
