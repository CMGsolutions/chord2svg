// generatePitchTable.ts
import fs from "fs";

const letters = ["C", "D", "E", "F", "G", "A", "B"];

// Each accidental has: suffix (for the name), offset (in midicents), and type string for rendering.
const accidentals = [
  // flats
  { suffix: "b-", offset: -150, accidental: "quarter-flat" },
  { suffix: "b", offset: -100, accidental: "flat" },
  { suffix: "b+", offset: -50, accidental: "three-quarter-flat" },
  // naturals
  { suffix: "-", offset: -50, accidental: "half-flat" },
  { suffix: "", offset: 0, accidental: "natural" },
  { suffix: "+", offset: 50, accidental: "half-sharp" },
  // sharps (✅ fixed order and naming)
  { suffix: "#-", offset: 50, accidental: "quarter-sharp" },
  { suffix: "#", offset: 100, accidental: "sharp" },
  { suffix: "#+", offset: 150, accidental: "three-quarter-sharp" },
];

// Base MIDI numbers for each natural pitch class
const baseMidiMap: Record<string, number> = {
  "C": 0,
  "D": 2,
  "E": 4,
  "F": 5,
  "G": 7,
  "A": 9,
  "B": 11,
};

// For computing relative staff steps
const diatonicLetters = ["C", "D", "E", "F", "G", "A", "B"];

// Reference note for treble clef: E4 = 6400 midicents → step = 0
const REFERENCE_LETTER = "E";
const REFERENCE_OCTAVE = 4;
const REFERENCE_MIDICENT = 6400;
const REFERENCE_DIATONIC_INDEX = diatonicLetters.indexOf(REFERENCE_LETTER);
const REFERENCE_DIATONIC_POSITION = REFERENCE_DIATONIC_INDEX + 7 * REFERENCE_OCTAVE;

// Output table
const table: {
  name: string;
  midicent: number;
  step: number;
  accidental: string;
}[] = [];

for (let octave = 0; octave <= 8; octave++) {
  for (const letter of letters) {
    const baseMidi = baseMidiMap[letter] + 12 * (octave + 1);

    const diatonicIndex = diatonicLetters.indexOf(letter);
    const diatonicPosition = diatonicIndex + 7 * octave;
    const step = diatonicPosition - REFERENCE_DIATONIC_POSITION;

    for (const acc of accidentals) {
      const name = `${letter}${acc.suffix}${octave}`;
      const midicent = baseMidi * 100 + acc.offset;

      table.push({
        name,
        midicent,
        step,
        accidental: acc.accidental,
      });
    }
  }
}

// Save JSON
fs.writeFileSync("./pitchTable_pcStep.json", JSON.stringify(table, null, 2));
console.log("✅ pitchTable_pcStep.json generated successfully");