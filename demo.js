// --- DEMO MIDI PROVIDER ---
// Fires a scripted 10-second looping drum sequence.
// Calls into main.js callbacks: onStart(timestamp), onNoteOn(note, timestamp), onChoke(note)

const DEMO_LOOP_MS = 10000;

// Rock beat at 120 BPM (500ms/beat, 125ms/16th note), 5 bars × 2000ms = 10000ms
// { time: ms offset within loop, note: MIDI note, choke: true if this is a choke event }
const DEMO_SEQUENCE = (function () {
  const BAR = 2000;
  const events = [];

  function bar(offset, extra) {
    // 16th-note hi-hat grid
    for (let i = 0; i < 16; i++) {
      events.push({ time: offset + i * 125, note: 42 }); // Hi-Hat Closed
    }
    // Kick on beats 1 and 3
    events.push({ time: offset + 0,    note: 36 }); // Beat 1
    events.push({ time: offset + 1000, note: 36 }); // Beat 3
    // Snare on beats 2 and 4
    events.push({ time: offset + 500,  note: 38 }); // Beat 2
    events.push({ time: offset + 1500, note: 38 }); // Beat 4
    // Apply any bar-specific extras
    if (extra) extra(offset);
  }

  // Bar 1: add Crash cymbal at the top
  bar(0 * BAR, (o) => {
    events.push({ time: o + 0, note: 49 }); // Crash 1
  });

  // Bar 2: open hi-hat on the "and" of beat 2, closed on beat 3 (chokes it)
  bar(1 * BAR, (o) => {
    events.push({ time: o + 750,  note: 46 });               // Hi-Hat Open
    events.push({ time: o + 1000, note: 42, choke: true });  // Hi-Hat Closed chokes it
  });

  // Bar 3: standard
  bar(2 * BAR);

  // Bar 4: extra kick on "and" of beat 4
  bar(3 * BAR, (o) => {
    events.push({ time: o + 1750, note: 36 }); // extra kick
  });

  // Bar 5: open hi-hat fill at the end, Crash on last beat
  bar(4 * BAR, (o) => {
    events.push({ time: o + 1500, note: 46 });               // Hi-Hat Open
    events.push({ time: o + 1875, note: 42, choke: true });  // close it
    events.push({ time: o + 1875, note: 49 });               // Crash going into next loop
  });

  // Sort by time so the schedule is predictable
  events.sort((a, b) => a.time - b.time);
  return events;
})();

let demoTimeouts = [];

function startDemo() {
  clearDemoTimeouts();
  const t0 = performance.now();
  onStart(t0);
  scheduleEvents(t0);
}

function scheduleEvents(loopStart) {
  DEMO_SEQUENCE.forEach(({ time, note, choke }) => {
    const id = setTimeout(() => {
      if (choke) {
        onChoke(note);
      } else {
        onNoteOn(note, performance.now());
      }
    }, time);
    demoTimeouts.push(id);
  });

  // Schedule next loop iteration
  const loopId = setTimeout(() => {
    scheduleEvents(loopStart + DEMO_LOOP_MS);
  }, DEMO_LOOP_MS);
  demoTimeouts.push(loopId);
}

function clearDemoTimeouts() {
  demoTimeouts.forEach(clearTimeout);
  demoTimeouts = [];
}
