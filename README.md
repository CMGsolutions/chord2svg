# 🎼 Chord2SVG
### by **Carlos Mauro @ CMG Solutions**

**Chord2SVG** is a high-efficiency, algorithmic system for generating chords in **staff notation** using SVG rendering.  
It provides a **consistent**, **automated**, and **optimization-driven** approach to batch music engraving.

By directly computing optimal notehead and accidental positions through mathematical and recursive layout logic, **Chord2SVG** achieves engraving-level precision at a fraction of the complexity — ideal for composers, developers, or researchers who want consistent notation output without relying on heavyweight GUI-based software.

---

## 🚀 Key Advantages

### ⚡ Efficiency Through Optimization
- Fully algorithmic rendering pipeline with no manual dragging or correction.
- Iterative collision detection, layout fanning, and recursive backfill passes ensure **compact, visually balanced results**.
- Optimized for **batch or programmatic generation** — render hundreds of chords with consistent spacing in milliseconds.

### 💡 Independence from Commercial Notation Software
- No need for Finale, Sibelius, Dorico, or MuseScore.
- Works purely through **SVG computation**, allowing integration with custom software, websites, or research tools.
- Enables flexible, code-based control over notation rules and layout aesthetics.

---

## 🎵 Core Features

### 🎶 Notehead Placement Engine
- Dynamically adjusts **horizontal offsets** based on step distance.
- Prevents collisions in dense chords.
- Works across **treble**, **bass**, and **alto** clefs with accurate staff calibration.

### ♯ Advanced Accidental Placement
- **Iterative Fanning Algorithm**
  - Distributes accidentals leftward in clusters based on vertical proximity (Δstep < 6).

- **Recursive Backpropagation Fill**
  - Reclaims available columns after fanning, optimizing layout compactness.
  - Prevents over-fanning and keeps spacing consistent across registers.
- **Multi-column Backfill Optimization**
  - Scans all possible columns from right to left to find the nearest valid position.

---

## 🧠 Technical Overview

### Module Breakdown
| File | Description |
|------|--------------|
| `src/lib/checkNoteCollisions.ts` | Computes horizontal notehead offsets and resolves inter-note collisions. |
| `src/lib/checkAccidentalCollisions.ts` | Determines optimal accidental placement using multi-pass fanning and recursive backfill logic. |
| `src/lib/layout.ts` | Defines global constants for spacing, column offset, and staff geometry. |
| `src/components/NoteHead.tsx` | Renders noteheads and ledger lines. |
| `src/components/Staff.tsx` | Draws the five-line staff grid. |
| `src/components/Clef.tsx` | Renders clef symbols dynamically. |
| `src/app/page.tsx` | Example rendering environment with clef selection and SVG preview. |

---

## 🧩 Example Usage

```ts
const testChordPitches = ["C5","Bb-4","A4","G4","Db-4","D#4"];