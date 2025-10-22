// @ts-ignore
const pitchTable: { name: string; step: number; midicent?: number; accidental?: string }[] =
  require("@/lib/pitchTable.json");

import { NOTE_BASE_X, NOTE_COLLISION_OFFSET } from "@/lib/layout";

/**
 * Two-phase collision engine:
 *  - Pass 1: classic left-right alternation for stacked seconds.
 *  - Pass 2: re-check left column (baseX) for overlapping pairs,
 *            shifting the conflicting one to a third column.
 */
export function computeXPositions(
  pitches: string[],
  baseX = NOTE_BASE_X,
  offset = NOTE_COLLISION_OFFSET
): { pitch: string; x: number }[] {
  if (!Array.isArray(pitches)) {
    console.error("computeXPositions called with invalid pitches:", pitches);
    return [];
  }

  // === STEP DATA ===
  const pitchSteps = pitches
    .map((p) => {
      const entry = pitchTable.find((e) => e.name === p);
      if (!entry) {
        console.warn(`⚠️ Pitch ${p} not found in pitchTable`);
        return null;
      }
      return { pitch: p, step: entry.step };
    })
    .filter((v): v is { pitch: string; step: number } => v !== null)
    .sort((a, b) => a.step - b.step);

  const positions: { pitch: string; x: number }[] = [];
  let prevShifted = false;

  // === PASS 1: Alternating columns ===
  for (let i = 0; i < pitchSteps.length; i++) {
    const curr = pitchSteps[i];
    const prev = pitchSteps[i - 1];
    let x = baseX;

    if (prev && Math.abs(curr.step - prev.step) <= 1) {
      if (!prevShifted) {
        x = baseX + offset;
        prevShifted = true;
        console.log(`🎵 Collision between ${prev.pitch} and ${curr.pitch} → shifting ${curr.pitch} to x=${x}`);
      } else {
        console.log(`🎵 Skipped redundant collision: ${curr.pitch} already visually separated.`);
        prevShifted = false;
      }
    } else {
      prevShifted = false;
    }

    positions.push({ pitch: curr.pitch, x });
  }

  console.log("✅ Pass 1 result:", positions);

  // === PASS 2: Detect intra-column (baseX) collisions ===
  const adjusted = [...positions];
  const leftColumnNotes = pitchSteps
    .map((p) => ({
      ...p,
      x: adjusted.find((pos) => pos.pitch === p.pitch)?.x ?? baseX,
    }))
    .filter((n) => n.x === baseX);

  for (let i = 1; i < leftColumnNotes.length; i++) {
    const curr = leftColumnNotes[i];
    const prev = leftColumnNotes[i - 1];

    if (curr && prev && Math.abs(curr.step - prev.step) <= 1) {
      const pos = adjusted.find((p) => p.pitch === curr.pitch);
      if (pos) {
        pos.x = baseX + offset * 2;
        console.log(`🎯 Left-column recheck: ${curr.pitch} collides with ${prev.pitch} → moving to 3rd column (x=${pos.x})`);
      }
    }
  }

  console.log("✅ Final notehead positions:", adjusted);
  return adjusted;
}