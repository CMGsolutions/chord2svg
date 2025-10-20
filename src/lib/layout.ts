import pitchTable from "@/lib/pitchTable.json";

export const STAFF_TOP_Y = 40;        // Y position of the top staff line
export const STAFF_LINE_SPACING = 10; // Vertical distance between staff lines

// Type definition for each pitch entry
type PitchEntry = {
  name: string;
  midicent: number;
  step: number;
  accidental: string;
};

// === Build Lookup Table ===
const pitchLookup: Record<string, PitchEntry> = {};
for (const entry of pitchTable) {
  pitchLookup[entry.name] = entry;
}

/**
 * Converts a pitch name (e.g. "C#4") to its vertical Y position on the SVG staff.
 */
export function pitchNameToY(pitch: string): number {
  const entry = pitchLookup[pitch];
  if (!entry) {
    console.warn(`Unknown pitch name: ${pitch}`);
    return STAFF_TOP_Y + STAFF_LINE_SPACING * 4; // default to middle line
  }
  return stepIndexToY(entry.step);
}

/**
 * Maps a step index (0 = bottom line) to a vertical SVG Y coordinate.
 * Each step represents one diatonic movement (line or space).
 */
export function stepIndexToY(step: number): number {
  return STAFF_TOP_Y + STAFF_LINE_SPACING * (4 - step / 2);
}

/**
 * Retrieves the raw step index for a given pitch (relative to treble clef E4 = 0).
 */
export function pitchNameToStep(pitch: string): number | null {
  return pitchLookup[pitch]?.step ?? null;
}

/**
 * Retrieves the midicent value for a given pitch (for audio playback mapping).
 */
export function pitchNameToMidicent(pitch: string): number | null {
  return pitchLookup[pitch]?.midicent ?? null;
}

/**
 * Retrieves the accidental type string (e.g. "flat", "sharp", "half-flat") for rendering symbols.
 */
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