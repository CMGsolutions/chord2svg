import pitchTable from "@/lib/pitchTable.json";
import { ACCIDENTAL_BASE_X, ACCIDENTAL_LEFT_OFFSET } from "@/lib/layout";

/**
 * Computes accidental X positions for a chord.
 * - Groups accidentals into clusters (Δstep ≤ 7)
 * - Applies fanning layout (each accidental in cluster moves further left)
 * - Returns an array of { pitch, x } aligned to the original input order
 */
export function computeAccidentalOffsets(
  pitches: string[],
  baseX = ACCIDENTAL_BASE_X,
  offset = ACCIDENTAL_LEFT_OFFSET
): { pitch: string; accX: number }[] {
  const withIndex = pitches.map((p, i) => {
    const entry = pitchTable.find(e => e.name === p);
    if (!entry) {
      console.warn(`⚠️ Pitch ${p} not found in pitchTable`);
      return null;
    }
    return { pitch: p, step: entry.step, accidental: entry.accidental, originalIndex: i };
  }).filter(Boolean) as { pitch: string; step: number; accidental: string; originalIndex: number }[];

  const sorted = [...withIndex].sort((a, b) => a.step - b.step);
  console.log("🧾 Sorted entries:", sorted.map(s => `${s.pitch} step=${s.step} acc=${s.accidental}`));

  const xMap = new Map<number, number>();
  for (const s of sorted) xMap.set(s.originalIndex, baseX);

  // === Build clusters (Δstep ≤ 7) ===
  const clusters: typeof sorted[] = [];
  let current: typeof sorted = [];
  for (let i = 0; i < sorted.length; i++) {
    const curr = sorted[i];
    if (!curr.accidental || curr.accidental === "natural") continue;

    if (current.length === 0) {
      current.push(curr);
      continue;
    }
    const prev = current[current.length - 1];
    const gap = Math.abs(curr.step - prev.step);
    if (gap < 6) {
      current.push(curr);
    } else {
      clusters.push(current);
      current = [curr];
    }
  }
  if (current.length > 0) clusters.push(current);
  console.log("🧩 Clusters:", clusters.map((c, i) => `#${i}: [${c.map(n => `${n.pitch}(${n.step})`).join(", ")}]`));

  // === Apply iterative fanning offsets per cluster ===
  clusters.forEach((cluster, ci) => {
    if (cluster.length < 2) {
      console.log(`   ➖ Cluster #${ci} has only ${cluster.length} accidental(s); no fanning applied.`);
      return;
    }

    console.log(`🎹 Applying iterative fanning layout to cluster #${ci}:`);
    let changed = true;
    let pass = 0;
    const MAX_PASSES = 5; // safety limit

    // Initialize all to baseX
    cluster.forEach(n => xMap.set(n.originalIndex, baseX));

    while (changed && pass < MAX_PASSES) {
      changed = false;
      pass++;
      console.log(`🔁 Pass ${pass}: checking for collisions...`);

      for (let i = 0; i < cluster.length; i++) {
        const a = cluster[i];
        const aX = xMap.get(a.originalIndex) ?? baseX;

        for (let j = i + 1; j < cluster.length; j++) {
          const b = cluster[j];
          const bX = xMap.get(b.originalIndex) ?? baseX;
          const gap = Math.abs(b.step - a.step);

          // skip if already visually separated
          if (bX < aX - offset * 0.9) continue;

          if (gap < 6) {
            const newX = aX - offset;
            xMap.set(b.originalIndex, newX);
            changed = true;
            console.log(`   🔄 Shift: ${b.pitch} (Δstep=${gap}) → x=${newX}`);
          }
        }
      }
    }

    console.log(`✅ Cluster #${ci} stabilized after ${pass} passes`);

    // === Backfill optimization pass (multi-column scan) ===
    console.log(`🎯 Starting backfill optimization for cluster #${ci}`);
    const placed: { x: number; step: number }[] = [];

    for (const n of cluster) {
      const currentStep = n.step;
      let bestX = baseX;

      // Try all possible columns from right to left
      const possibleCols = Array.from({ length: 5 }, (_, k) => baseX - k * offset);
      for (const candidateX of possibleCols) {
        const conflict = placed.some(p => Math.abs(p.step - currentStep) <= 7 && p.x === candidateX);
        if (!conflict) {
          bestX = candidateX;
          break; // rightmost valid column found
        }
      }

      xMap.set(n.originalIndex, bestX);
      placed.push({ x: bestX, step: currentStep });
      console.log(`   🧩 Final optimized placement: ${n.pitch} → x=${bestX}`);
    }
  });

  console.log("✅ Final accidental X map:", Array.from(xMap.entries()).map(([i, x]) => `#${i}: x=${x}`));
  console.log("🔚 Returning final accidental positions:", withIndex.map(v => ({ pitch: v.pitch, accX: xMap.get(v.originalIndex) ?? baseX })));

  return withIndex.map(v => ({ pitch: v.pitch, accX: xMap.get(v.originalIndex) ?? baseX }));
}