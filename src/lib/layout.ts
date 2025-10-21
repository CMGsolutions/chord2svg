import pitchTable from "@/lib/pitchTable.json";

export const STAFF_TOP_Y = 40;        // Y position of the top staff line
export const STAFF_LINE_SPACING = 10; // Vertical distance between staff lines
// === Horizontal Layout ===
export const NOTE_BASE_X = 90;      // Default X position for noteheads
export const NOTE_COLLISION_OFFSET = 12.5; // Horizontal shift when notes collide

// === Accidental Layout ===
export const ACCIDENTAL_BASE_X = 90;         // Default X position for accidental column
export const ACCIDENTAL_LEFT_OFFSET = 9.5;    // Horizontal left shift when accidentals collide
export const ACCIDENTAL_DYNAMIC_MULTIPLIER = 2; // Multiplier for close vertical accidental spacing (Δstep < 2)

type PitchEntry = {
  name: string;
  midicent: number;
  step: number;
  accidental: string;
};

const pitchLookup: Record<string, PitchEntry> = {};
for (const entry of pitchTable) {
  pitchLookup[entry.name] = entry;
}

export function pitchNameToY(pitch: string): number {
  const entry = pitchLookup[pitch];
  if (!entry) {
    console.warn(`Unknown pitch name: ${pitch}`);
    return STAFF_TOP_Y + STAFF_LINE_SPACING * 4; // default to middle line
  }
  return stepIndexToY(entry.step);
}

export function stepIndexToY(step: number): number {
  return STAFF_TOP_Y + STAFF_LINE_SPACING * (4 - step / 2);
}

export function pitchNameToStep(pitch: string): number | null {
  return pitchLookup[pitch]?.step ?? null;
}

export function pitchNameToMidicent(pitch: string): number | null {
  return pitchLookup[pitch]?.midicent ?? null;
}

export function pitchNameToAccidental(pitch: string): string | null {
  return pitchLookup[pitch]?.accidental ?? null;
}

export function pitchNameToStepWithClef(
  pitch: string,
  clef: "treble" | "bass" | "alto"
): number | null {
  const step = pitchNameToStep(pitch);
  if (step === null) return null;

  const clefOffsets: Record<typeof clef, number> = {
    treble: 0,
    bass: +12,
    alto: +6,
  };

  return step + clefOffsets[clef];
}