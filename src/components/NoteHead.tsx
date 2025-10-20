// Notehead.tsx – Renders individual notehead with optional accidental and ledger lines

import React from "react";
import {
  stepIndexToY,
  pitchNameToStepWithClef,
  pitchNameToAccidental,
} from "@/lib/layout";

interface NoteHeadProps {
  x: number;
  pitch: string; // e.g. "C#4", "Fb+4"
  clef: "treble" | "bass" | "alto";
}

// Unicode-based accidental glyphs with layout tweaks
const accidentalLayout: Record<
  string,
  { glyph: string; dx: number; dy: number; fontSize: number }
> = {
  "quarter-flat":          { glyph: "𝄭", dx: -17, dy: 0, fontSize: 35 },
  "flat":                  { glyph: "♭", dx: -17, dy: 0, fontSize: 35 },
  "three-quarter-flat":    { glyph: "𝄬", dx: -17, dy: 0, fontSize: 35 },

  "half-flat":             { glyph: "𝄯", dx: -17, dy: 0, fontSize: 35 },
  "natural":               { glyph: "♮", dx: -17, dy: 0, fontSize: 35 },
  "half-sharp":            { glyph: "𝄮", dx: -17, dy: 0, fontSize: 35 },

  "quarter-sharp":         { glyph: "𝄱", dx: -17, dy: 0, fontSize: 35 },
  "sharp":                 { glyph: "♯", dx: -17, dy: 0, fontSize: 35 },
  "three-quarter-sharp":   { glyph: "𝄰", dx: -17, dy: 0, fontSize: 35 },
};

const NoteHead: React.FC<NoteHeadProps> = ({ x, pitch, clef }) => {
  const step = pitchNameToStepWithClef(pitch, clef) ?? 0;
  const y = stepIndexToY(step);

  const accType = pitchNameToAccidental(pitch);
  const layout = accType ? accidentalLayout[accType] : null;

  // === Ledger line logic ===
  const ledgerLines: number[] = [];
  if (step < 0) {
    for (let s = step; s < 0; s++) {
      if (s % 2 === 0) ledgerLines.push(stepIndexToY(s));
    }
  } else if (step > 8) {
    for (let s = 9; s <= step; s++) {
      if (s % 2 === 0) ledgerLines.push(stepIndexToY(s));
    }
  }

  return (
    <>
      {/* Render accidental */}
      {layout && accType !== "natural" && (
        <text
          x={x + layout.dx}
          y={y + layout.dy}
          fontSize={layout.fontSize}
          textAnchor="middle"
          fontFamily="Bravura, serif"
        >
          {layout.glyph}
        </text>
      )}

      {/* Render notehead */}
      <ellipse cx={x} cy={y} rx={7} ry={5} fill="black" />

      {/* Render ledger lines */}
      {ledgerLines.map((yLine, i) => (
        <line
          key={i}
          x1={x - 10}
          x2={x + 10}
          y1={yLine}
          y2={yLine}
          stroke="black"
          strokeWidth={1}
        />
      ))}
    </>
  );
};

export default NoteHead;