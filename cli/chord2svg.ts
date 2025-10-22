#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { computeAccidentalOffsets } from "@/lib/checkAccidentalCollisions";
import { computeXPositions } from "@/lib/checkNoteCollisions";
import { ACCIDENTAL_BASE_X, ACCIDENTAL_LEFT_OFFSET } from "@/lib/layout";

// === Prepare output folder ===
const OUTPUT_DIR = path.resolve("./outputs");
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  console.log(`📁 Created output directory: ${OUTPUT_DIR}`);
}

// === Detect clef automatically based on pitch range ===
function detectClef(pitches: string[]): "treble" | "bass" | "alto" {
  const pitchTable = require("@/lib/pitchTable.json");
  const midicents = pitches.map((p) => {
    const entry = pitchTable.find((e: any) => e.name === p);
    return entry ? entry.midicent : 6000;
  });
  const avg = midicents.reduce((a, b) => a + b, 0) / midicents.length;
  if (avg < 5200) return "bass";
  if (avg < 6500) return "alto";
  return "treble";
}

// === Compute notehead and accidental positions for a chord ===
function renderChordSVG(notes: string[], clef?: string) {
  const autoClef = clef || detectClef(notes);
  const notePositions = computeXPositions(notes);
  const accidentalPositions = computeAccidentalOffsets(
    notes,
    ACCIDENTAL_BASE_X,
    ACCIDENTAL_LEFT_OFFSET
  );

  return {
    clef: autoClef,
    notes: notes.map((pitch) => ({
      pitch,
      noteX: notePositions.find((n) => n.pitch === pitch)?.x ?? 90,
      accX: accidentalPositions.find((a) => a.pitch === pitch)?.accX ?? 90,
    })),
  };
}

// === CLI argument parsing ===
const args = process.argv.slice(2);
const inputFile = args[args.indexOf("--input") + 1];
if (!inputFile) {
  console.error("❌ Missing --input <file.json>");
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(path.resolve(inputFile), "utf-8"));
if (!data.chords || !Array.isArray(data.chords)) {
  console.error("❌ Invalid format. Expected: { chords: [ { notes: [...] } ] }");
  process.exit(1);
}

// === Process each chord ===
data.chords.forEach((chord: any, i: number) => {
  const svgData = renderChordSVG(chord.notes, chord.clef);
  console.log(`🎼 Chord #${i + 1}:`, svgData);

  // === Generate minimal SVG (staff + noteheads + accidentals) ===
  const svgContent = `
<svg xmlns="http://www.w3.org/2000/svg" width="200" height="120" viewBox="0 0 200 120">
  <rect width="100%" height="100%" fill="white"/>
  <g transform="translate(30, 40)">
    <!-- Staff lines -->
    ${[0, 10, 20, 30, 40]
      .map(
        (y) =>
          `<line x1="0" x2="150" y1="${y}" y2="${y}" stroke="black" stroke-width="1"/>`
      )
      .join("\n")}

    <!-- Notes -->
    ${svgData.notes
      .map(
        (n) => `
      <!-- Accidental -->
      <text x="${n.accX - 10}" y="${60 - n.pitch.length * 0}" font-size="18" text-anchor="middle" fill="black">
        ♭
      </text>
      <!-- Notehead -->
      <ellipse cx="${n.noteX}" cy="${60 - n.pitch.length * 0}" rx="6" ry="4" fill="black"/>
    `
      )
      .join("\n")}
  </g>
</svg>
`;

  const filePath = path.join(OUTPUT_DIR, `chord_${i + 1}.svg`);
  fs.writeFileSync(filePath, svgContent.trim());
  console.log(`💾 Saved: ${filePath}`);
});

console.log("✅ All chords processed successfully.");