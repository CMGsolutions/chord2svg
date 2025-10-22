"use client";

import React, { useEffect } from "react";
import { renderChordSVG } from "@/lib/svgRender/renderChord";
import { computeXPositions } from "@/lib/checkNoteCollisions";
import { computeAccidentalOffsets } from "@/lib/checkAccidentalCollisions";
import { ACCIDENTAL_BASE_X, ACCIDENTAL_LEFT_OFFSET } from "@/lib/layout";

interface SVGChordRendererProps {
  notes: string[];
  clef: "treble" | "bass" | "alto";
  scale?: number;
  onSVGReady?: (svg: string) => void; // 🆕 callback prop
}

const SVGChordRenderer: React.FC<SVGChordRendererProps> = ({
  notes,
  clef,
  scale = 1,
  onSVGReady,
}) => {
  const notePositions = computeXPositions(notes);
  const accPositions = computeAccidentalOffsets(
    notes,
    ACCIDENTAL_BASE_X,
    ACCIDENTAL_LEFT_OFFSET
  );

  const chordData = notes.map((pitch) => ({
    pitch,
    noteX: notePositions.find((n) => n.pitch === pitch)?.x ?? 90,
    accX: accPositions.find((a) => a.pitch === pitch)?.accX ?? 90,
  }));

  const svgMarkup = renderChordSVG({ clef, notes: chordData });

  // 🆕 send the SVG string to parent
  useEffect(() => {
    if (onSVGReady) onSVGReady(svgMarkup);
  }, [svgMarkup]);

  return (
    <div
      className="flex justify-center items-center"
      style={{
        transform: `scale(${scale})`,
        transformOrigin: "top left",
        width: "200px",
        height: "200px",
      }}
      dangerouslySetInnerHTML={{ __html: svgMarkup }}
    />
  );
};

export default SVGChordRenderer;