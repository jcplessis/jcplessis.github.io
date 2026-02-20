# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Personal GitHub Pages site (`jcplessis.github.io`) currently containing a standalone MIDI drum visualizer tool. No build step — files are served directly by GitHub Pages.

## Deployment

Push to `master` → automatically deployed via GitHub Pages. No CI, no build pipeline.

## Current Project: MIDI Drum Timeline (`index.html`)

A single-file vanilla JS app that visualizes MIDI drum input in real-time as a scrolling horizontal timeline.

**Key architecture:**
- **Web MIDI API** (`navigator.requestMIDIAccess()`) receives drum pad messages
- **`NOTE_CONFIG`** maps MIDI note numbers (e.g. 36=Kick, 38=Snare, 42=Hi-Hat Closed) to vertical `y` position, color, and type
- **Two note types:**
  - `hit` (default): rendered as a colored circle (`note-marker`) attached to a vertical `note-line`
  - `sustained` (cymbals): rendered as a `note-bar` div whose `width` grows every animation frame via `requestAnimationFrame`
- **`activeNotes` Map**: tracks currently-growing sustained notes (`noteId → { element, startX, maxDurationPx }`)
- **Choke logic**: Polyphonic Aftertouch (`cmd === 169`) or closed hi-hat (42/44) freezes the active bar by removing it from `activeNotes` and adding the `.choked` CSS class
- **Timeline scrolls** automatically: `wrapper.scrollLeft` tracks `currentHeadX` offset by `SCREEN_OFFSET_RATIO`
- **DOM cleanup**: old elements left of `scrollLeft - CLEANUP_THRESHOLD_PX` are removed to prevent memory growth

**Key constants** (top of `<script>`):
- `PX_PER_MS` — timeline scale (pixels per millisecond)
- `SCREEN_OFFSET_RATIO` — how far right the playhead sits on screen
- `CLEANUP_THRESHOLD_PX` — how far off-screen before DOM elements are removed
