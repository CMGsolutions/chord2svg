

import {
  stepIndexToY,
  pitchNameToStepWithClef,
  pitchNameToAccidental,
  ACCIDENTAL_BASE_X,
} from "@/lib/layout";

// Unicode-based accidental glyphs with layout tweaks
const accidentalLayout: Record<
  string,
  { glyph: string; dx: number; dy: number; fontSize: number }
> = {
  "quarter-flat":        { glyph: "𝄭", dx: -17, dy: 0, fontSize: 35 },
  "flat":                { glyph: "♭", dx: -17, dy: 0, fontSize: 35 },
  "three-quarter-flat":  { glyph: "𝄬", dx: -17, dy: 0, fontSize: 35 },
  "half-flat":           { glyph: "𝄯", dx: -17, dy: 0, fontSize: 35 },
  "natural":             { glyph: "♮", dx: -17, dy: 0, fontSize: 35 },
  "half-sharp":          { glyph: "𝄮", dx: -17, dy: 0, fontSize: 35 },
  "quarter-sharp":       { glyph: "𝄱", dx: -17, dy: 0, fontSize: 35 },
  "sharp":               { glyph: "♯", dx: -17, dy: 0, fontSize: 35 },
  "three-quarter-sharp": { glyph: "𝄰", dx: -17, dy: 0, fontSize: 35 },
};

/**
 * Render a notehead (with accidentals and ledger lines) as SVG string.
 * @param x x-position (number)
 * @param pitch e.g. "C#4"
 * @param clef "treble" | "bass" | "alto"
 * @param accX optional override for accidental x-position
 * @returns SVG string fragment
 */
export function renderNoteHeadFragment({
  x,
  pitch,
  clef,
  accX,
}: {
  x: number;
  pitch: string;
  clef: "treble" | "bass" | "alto";
  accX?: number;
}): string {
  const step = pitchNameToStepWithClef(pitch, clef) ?? 0;
  const y = stepIndexToY(step);

  const accType = pitchNameToAccidental(pitch);
  const layout = accType ? accidentalLayout[accType] : null;
  const accidentalX = accX ?? ACCIDENTAL_BASE_X;

  // Ledger lines
  const ledgerLines: number[] = [];
  if (step < 0) {
    for (let s = step; s < 0; s++) if (s % 2 === 0) ledgerLines.push(stepIndexToY(s));
  } else if (step > 8) {
    for (let s = 9; s <= step; s++) if (s % 2 === 0) ledgerLines.push(stepIndexToY(s));
  }

  let svg = "";
  // Accidental (skip natural for visual parity)
  if (layout && accType !== "natural") {
    svg += `<text x="${accidentalX + layout.dx}" y="${y + layout.dy}" font-size="${layout.fontSize}" text-anchor="middle" font-family="Bravura, serif, Arial Unicode MS, serif" fill="#222" stroke="none">${layout.glyph}</text>`;
  }
  // Notehead (ensure visible, add stroke="none", tweak rx/ry)
  svg += `<ellipse cx="${x}" cy="${y}" rx="8" ry="6" fill="#111" stroke="none"/>`;
  // Debug: show notehead center as a small dot (visible)
  // svg += `<circle cx="${x}" cy="${y}" r="1.5" fill="red" />`;
  // Ledger lines
  for (let i = 0; i < ledgerLines.length; ++i) {
    const yLine = ledgerLines[i];
    svg += `<line x1="${x - 12}" x2="${x + 12}" y1="${yLine}" y2="${yLine}" stroke="black" stroke-width="1"/>`;
  }
  return svg;
}