// Clef Constructor
import React from "react";
import { STAFF_TOP_Y, STAFF_LINE_SPACING } from "@/lib/layout";

interface ClefProps {
  clef: "treble" | "bass" | "alto";
}

const clefSymbols = {
  treble: "𝄞",
  bass: "𝄢",
  alto: "𝄡",
};

const Clef: React.FC<ClefProps> = ({ clef }) => {
  const fontSize = clef === "treble" ? 95 : clef === "bass" ? 50 : 60;

  // Position the clef so its visual center aligns with the correct line:
  const yOffset =
    clef === "treble"
      ? STAFF_TOP_Y + STAFF_LINE_SPACING * 4.85  // Treble alignment
      : clef === "bass"
      ? STAFF_TOP_Y + STAFF_LINE_SPACING * 3.3  // Bass alignment
      : STAFF_TOP_Y + STAFF_LINE_SPACING * 4; // Alto alignment

  return (
    <>
      <text
        x={10}
        y={yOffset}
        fontSize={fontSize}
        fontFamily="serif"
      >
        {clefSymbols[clef]}
      </text>
    </>
  );
};

export default Clef;