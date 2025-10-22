import pitchTable from "@/lib/pitchTable.json" assert { type: "json" };
import { NOTE_BASE_X, NOTE_COLLISION_OFFSET } from "@/lib/layout";

/**
 * Computes simple x positions for noteheads, skipping redundant collisions.
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

  const pitchSteps = pitches
    .map((p) => {
      const entry = pitchTable.find((e) => e.name === p);
      if (!entry) {
        console.warn(`⚠️ Pitch ${p} not found in pitchTable`);
        return null;
      }
      return { pitch: p, step: entry.step };
    })
    .filter(Boolean)
    .sort((a, b) => a!.step - b!.step);

  const positions: { pitch: string; x: number }[] = [];
  let prevShifted = false;

  for (let i = 0; i < pitchSteps.length; i++) {
    const curr = pitchSteps[i]!;
    const prev = pitchSteps[i - 1];
    let x = baseX;

    if (prev && Math.abs(curr.step - prev.step) <= 1) {
      if (!prevShifted) {
        x = baseX + offset;
        prevShifted = true;
        console.log(
          `🎵 Collision between ${prev.pitch} and ${curr.pitch} → shifting ${curr.pitch} to x=${x}`
        );
      } else {
        console.log(
          `🎵 Skipped redundant collision: ${curr.pitch} already visually separated.`
        );
        prevShifted = false;
      }
    } else {
      prevShifted = false;
    }

    positions.push({ pitch: curr.pitch, x });
  }

  console.log("✅ Final notehead positions:", positions);
  return positions;
}