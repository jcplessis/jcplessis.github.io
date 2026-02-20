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
