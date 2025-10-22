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
- Dynamically adjusts **horizontal offsets** based on vertical step distance.
- Prevents collisions in dense chords.
- Works across **treble**, **bass**, and **alto** clefs with accurate staff calibration.
- Supports **3-column reflow** for secondary collisions in complex cluster chords (e.g. overlapping unisons or stacked seconds).

### ♯ Advanced Accidental Placement
- **Iterative Fanning Algorithm**
  - Distributes accidentals leftward in clusters based on vertical proximity (`Δstep < 6`).
- **Recursive Backpropagation Fill**
  - Reclaims unused space and tightens layout after fanning.
  - Prevents over-fanning and preserves consistent optical spacing.
- **Multi-column Backfill Optimization**
  - Evaluates all columns from right to left to find the nearest non-colliding position.

---

## 🧠 Technical Overview

### Module Breakdown
| File | Description |
|------|--------------|
| `src/lib/checkNoteCollisions.ts` | Computes horizontal notehead offsets and resolves inter-note collisions (multi-pass, 3-column model). |
| `src/lib/checkAccidentalCollisions.ts` | Determines optimal accidental placement using fanning and recursive backfill logic. |
| `src/lib/layout.ts` | Defines global constants for spacing, column offset, and staff geometry. |
| `src/lib/svgRender/renderNoteHead.ts` | Renders noteheads and ledger lines as SVG fragments. |
| `src/lib/svgRender/renderStaff.ts` | Draws the five-line staff grid. |
| `src/lib/svgRender/renderClef.ts` | Renders clef symbols using Unicode-based glyphs. |
| `src/lib/svgRender/renderChord.ts` | Assembles full SVG chord output (staff + clef + notes + accidentals). |
| `src/components/SVGChordRenderer.tsx` | WebApp bridge — injects CLI rendering logic directly into browser preview. |
| `src/app/page.tsx` | Web UI with clef selection, test chord visualization, and SVG export. |

---

## 🧩 Example Usage

### 🔹 In the WebApp
To quickly test and visualize chords:

1. Clone the repository:
   ```bash
   git clone https://github.com/CMGsolutions/chord2svg.git
   cd chord2svg
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open the browser:
   ```bash
   http://localhost:3000
   ```

5. In src/app/page.tsx, modify:
    ```ts
   const testChordPitches = ["C5", "Bb-4", "A4", "G4", "Db-4", "D#4"];
   ```
   Save, and the changes will render live.


---

## 🧩 Pitch Formatting

All chord note strings, whether entered in the web app or included in CLI JSON files for batch processing, must strictly follow the pitch notation formula:

```
[PitchClass][Alteration][QuartertoneAlteration]{Octave}
```

Each note is written as a single string enclosed in quotes, e.g. `"C4"`, `"Bb4"`, `"F#+4"` — forming arrays such as `["C4", "E4", "G4"]`.

**Components:**
- **PitchClass**: The note letter, always uppercase. One of `A`, `B`, `C`, `D`, `E`, `F`, `G`.
- **Alteration**: Standard accidental, optional. Use:
  - `b` for flat
  - `#` for sharp
  - (omit for natural)
- **QuartertoneAlteration**: For quarter-tone accidentals, optional. Use:
  - `-` for quarter-tone flat (i.e., "half-flat")
  - `+` for quarter-tone sharp (i.e., "half-sharp")
  - Combine with `b` or `#` for three-quarter-tone accidentals:
    - `b-` for three-quarter-tone flat
    - `#+` for three-quarter-tone sharp
- **{Octave}**: The octave number, required. Follows scientific pitch notation (e.g., C4 = middle C).

**Examples:**
- `C4` — C natural, octave 4
- `Bb4` — B flat, octave 4
- `B#5` — B sharp, octave 5
- `E-5` — E quarter-tone flat (half-flat), octave 5
- `F#+4` — F sharp with quarter-tone sharp (three-quarter sharp), octave 4
- `Db-3` — D flat with quarter-tone flat (three-quarter flat), octave 3
- `G4` — G natural, octave 4

**Notes:**
- All chord note strings must conform to this notation, both in code and in any JSON files used for batch processing.
- Failure to use this exact format may result in incorrect rendering or errors.

---

## 📦 Batch JSON Formatting

When using the CLI for batch processing, input data must be provided in a structured JSON file, typically located at `inputs/chords.json`. This file acts as the main container for all chord data to be processed.

### Structure Requirements

- The root object must contain a `"chords"` key, which is an array of chord objects.
- Each chord object must include:
  - `"notes"`: an array of pitch strings formatted according to the pitch notation described above.
  - Optional `"clef"`: a string specifying the clef for that chord (e.g., `"treble"`, `"bass"`, or `"alto"`). If omitted, the CLI will auto-detect the clef based on the pitches.

### Example `inputs/chords.json`

```json
{
  "chords": [
    {
      "notes": ["C4", "E4", "G4"],
      "clef": "treble"
    },
    {
      "notes": ["F3", "A3", "C4"],
      "clef": "bass"
    },
    {
      "notes": ["Bb4", "D5", "F5"]
    }
  ]
}
```

### Running the CLI

1. Place your properly formatted `chords.json` file in the `inputs` directory.
2. Run the CLI command from the project root:

   ```bash
   npx chord2svg-cli --input inputs/chords.json --output outputs/svg-chords/
   ```

3. The CLI will process each chord, auto-detect clefs if not provided, and generate SVG files in the specified output directory.

### Important Notes

- Ensure your JSON file is valid and encoded in UTF-8 to avoid parsing errors.
- This formatting standard guarantees full compatibility between the web rendering engine and the CLI batch generation process.
- Using this method, you can efficiently process hundreds of chords in a single batch run, enabling large-scale music engraving workflows with consistent output quality.