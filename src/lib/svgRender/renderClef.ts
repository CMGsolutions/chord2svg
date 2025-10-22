import { STAFF_TOP_Y, STAFF_LINE_SPACING } from "@/lib/layout";

const clefSymbols: Record<"treble" | "bass" | "alto", string> = {
  treble: "𝄞",
  bass: "𝄢",
  alto: "𝄡",
};

/**
 * Render a clef as an SVG text glyph.
 * @param clef "treble" | "bass" | "alto"
 * @returns SVG string fragment
 */
export function renderClefFragment(clef: "treble" | "bass" | "alto"): string {
  const fontSize = clef === "treble" ? 40 : clef === "bass" ? 40 : 40;
  // Tweak yOffset for better vertical alignment and less cutoff
  const yOffset =
    clef === "treble"
      ? STAFF_TOP_Y + STAFF_LINE_SPACING * 3
      : clef === "bass"
      ? STAFF_TOP_Y + STAFF_LINE_SPACING * 1
      : STAFF_TOP_Y + STAFF_LINE_SPACING * 2;
  // Add fallback fonts, visible fill, and no stroke
  return `<text x="2" y="${yOffset}" font-size="${fontSize}" font-family="Bravura, serif, Arial Unicode MS, serif" fill="#222" stroke="none">${clefSymbols[clef]}</text>`;
}