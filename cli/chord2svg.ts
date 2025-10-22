#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { renderChordSVG } from "@/lib/svgRender/renderChord";
import { computeAccidentalOffsets } from "@/lib/checkAccidentalCollisions";
import { computeXPositions } from "@/lib/checkNoteCollisions";
import { ACCIDENTAL_BASE_X, ACCIDENTAL_LEFT_OFFSET } from "@/lib/layout";

// === Prepare output folder ===
const OUTPUT_DIR = path.resolve("./outputs");
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  console.log(`📁 Created output directory: ${OUTPUT_DIR}`);
}

// === Detect clef automatically ===
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

// === Compute note/accidental positions and export identical SVG ===
function generateChordSVG(notes: string[], clef?: string): string {
  const chosenClef = (clef as any) || detectClef(notes);

  const notePositions = computeXPositions(notes);
  const accidentalPositions = computeAccidentalOffsets(
    notes,
    ACCIDENTAL_BASE_X,
    ACCIDENTAL_LEFT_OFFSET
  );

  const chordData = notes.map((pitch) => ({
    pitch,
    noteX: notePositions.find((n) => n.pitch === pitch)?.x ?? 90,
    accX: accidentalPositions.find((a) => a.pitch === pitch)?.accX ?? 90,
  }));

  // ✅ Use the exact same renderer as web
  const svgMarkup = renderChordSVG({
    clef: chosenClef,
    notes: chordData,
    x: 0,
    width: 200,
  });

  return svgMarkup;
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

// === Render and save ===
data.chords.forEach((chord: any, i: number) => {
  const svgContent = generateChordSVG(chord.notes, chord.clef);
  const filePath = path.join(OUTPUT_DIR, `chord_${i + 1}.svg`);
  fs.writeFileSync(filePath, svgContent.trim());
  console.log(`💾 Saved: ${filePath}`);
});

console.log("✅ All chords processed successfully.");