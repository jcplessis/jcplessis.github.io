# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Personal GitHub Pages site (`jcplessis.github.io`) containing a standalone MIDI drum visualizer tool. No build step — files are served directly by GitHub Pages.

## Deployment

Push to `master` → automatically deployed via GitHub Pages. No CI, no build pipeline.

## Current Project: MIDI Drum Timeline

Vanilla JS app that visualizes MIDI drum input in real-time as a scrolling horizontal timeline.

### File Structure

| File | Role |
|------|------|
| `index.html` | HTML + CSS only |
| `main.js` | Rendering engine, app state, public callbacks |
| `midi.js` | Real Web MIDI API provider |
| `demo.js` | Mock MIDI provider — scripted 10s looping drum sequence |

Script load order in `index.html`: `midi.js` → `demo.js` → `main.js`.

### Provider Interface

`midi.js` and `demo.js` are MIDI providers. They call into `main.js` via three global callbacks:

```js
onStart(timestamp)         // starts the clock; timestamp is a DOMHighResTimeStamp
onNoteOn(note, timestamp)  // note: MIDI note number; timestamp: when the event occurred
onChoke(note)              // stops a sustained note
```

**Timestamp precision:** `midi.js` uses `msg.timeStamp` from the `MIDIMessageEvent` — this is the hardware-received time, more precise than calling `performance.now()` at handler time. `demo.js` uses `performance.now()` at the moment each `setTimeout` fires (same epoch, compatible with `msg.timeStamp`). `startTime` in `main.js` is always set from one of these timestamps, never from a deferred `performance.now()` call.

**Auto-connect:** `midi.js` calls `connectMIDI()` on load, prompting for MIDI permission immediately. The Connect button re-runs it if needed.

### Rendering Core (`main.js`)

- **`NOTE_CONFIG`** maps MIDI note numbers (e.g. 36=Kick, 38=Snare, 42=Hi-Hat Closed) to vertical `y` position, color, and type
- **Two note types:**
  - `hit` (default): rendered as a colored circle (`note-marker`) attached to a vertical `note-line`
  - `sustained` (cymbals): rendered as a `note-bar` div whose `width` grows every animation frame via `requestAnimationFrame`
- **`activeNotes` Map**: tracks currently-growing sustained notes (`noteId → { element, startX, maxDurationPx }`)
- **Choke logic**: closing hi-hat (42/44) or receiving a choke callback freezes the active bar by removing it from `activeNotes` and adding `.choked` CSS class
- **Timeline scrolls** automatically: `wrapper.scrollLeft` tracks `currentHeadX` offset by `SCREEN_OFFSET_RATIO`
- **DOM cleanup**: old elements left of `scrollLeft - CLEANUP_THRESHOLD_PX` are removed to prevent memory growth

**Key constants** (top of `main.js`):
- `PX_PER_MS` — timeline scale (pixels per millisecond)
- `SCREEN_OFFSET_RATIO` — how far right the playhead sits on screen
- `CLEANUP_THRESHOLD_PX` — how far off-screen before DOM elements are removed

### Demo Mode (`demo.js`)

- 5-bar rock beat at 120 BPM (10 000 ms loop), loops indefinitely
- Uses `demoTimeouts` array (array of timeout IDs) to allow `resetTimeline()` to cancel the loop via `clearDemoTimeouts()`
- Clicking **Reset** stops the demo; clicking **Demo** again restarts it from scratch

### Rhythm Guide (`main.js`)

Visual metronome layered on the same timeline. Renders green `.rhythm-line` divs at beat positions defined by a user-supplied pattern and BPM. Also plays audible beeps via the Web Audio API.

**UI controls** (`#rhythm-controls` in `index.html`), split into two rows:
- **Row 1:** Pattern text field + quarter-note length counter (`#rhythmLength`) + **✕ Clear** button + five note-insert buttons (W H Q E S with SVG icons). Click = appends lowercase (unaccented); Shift+click = appends uppercase (accented). Button labels flip between lower/upper case while Shift is held.
- **Row 2:** BPM number input + **Rhythm Play** / **Rhythm Stop** + **Latency comp** checkbox (checked by default) — subtracts `audioCtx.baseLatency + outputLatency` from scheduled beep times.

**Pattern case convention:** uppercase letter = accented beep (1500 Hz), lowercase = normal beep (1000 Hz). Default pattern: `Eeee`.

**Persistent settings:** pattern, BPM, and latency-comp are saved to `localStorage` on every change (`saveSettings()`) and restored on page load (`loadSettings()`).

**Key state variables:**
- `rhythmBeatOffsets` — array of `{ ms: number, accent: boolean }` objects (within one cycle) for each beat
- `rhythmLoopMs` — total cycle duration in ms
- `rhythmStartMs` — clock time (`timeElapsed`) when Rhythm Play was clicked; beats are positioned relative to this, so the first line always appears at the click moment
- `lastDrawnRhythmMs` — elapsed time since `rhythmStartMs` up to which lines have been drawn
- `rhythmStartAudioTime` — `audioCtx.currentTime` captured at Rhythm Play; audio beats are offset from this
- `lastScheduledRhythmMs` — how far ahead (in rhythm-relative ms) audio has been scheduled
- `AUDIO_LOOKAHEAD_MS` (150) — how far ahead to schedule beeps each frame

**Rendering:** `updateRhythm(currentTimeMs)` is called every frame from `drawLoop`. It draws beats whose relative time (`cycleStart + offset`) has arrived since the last frame — no lookahead, so lines emerge at the playhead exactly like MIDI note lines.

**Audio:** `scheduleRhythmAudio(currentTimeMs)` runs every frame alongside rendering. Uses Web Audio lookahead scheduling (`osc.start(exactTime)`) for sample-accurate beeps. Accent per beat is driven by `beat.accent` (uppercase letter in pattern = 1500 Hz loud; lowercase = 1000 Hz soft). All routed through `rhythmGain` so Stop/Reset can silence queued beeps instantly via `rhythmGain.gain.value = 0`.

**Live update:** Changing the pattern or BPM while rhythm is active triggers `refreshRhythm()` after a 300 ms debounce — silences queued beeps, clears drawn lines, and re-anchors to the current moment with the new pattern. Invalid/empty pattern stops rhythm cleanly.

**Layering:** Rhythm Play starts the clock if not already running, or attaches to the existing clock (MIDI / Demo can run simultaneously). Reset clears all rhythm state.
