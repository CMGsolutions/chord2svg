"use client";

import { useState, useMemo } from "react";
import SVGChordRenderer from "@/components/SVGChordRenderer";
import { computeXPositions } from "@/lib/checkNoteCollisions";
import { computeAccidentalOffsets } from "@/lib/checkAccidentalCollisions";
import { ACCIDENTAL_BASE_X, ACCIDENTAL_LEFT_OFFSET } from "@/lib/layout";

// === Example test chords ===
// const testChordPitches = ["C4", "E-4", "G4", "Bb-4", "G6", "G2"];
// const testChordPitches = ["Gb+4", "Ab-4", "Bb-3", "Db-5"];
// const testChordPitches = ["Bb-3", "Ab+4"];
const testChordPitches = ["E-2", "F2", "G2", "Ab2", "A#2", "C3", "D#3", "F3", "G#3", "Bb3", "C4", "Db4", "E4", "F#4", "A4"];
// const testChordPitches = ["C5", "Bb-4", "A4", "G4", "Db-4", "D#4"];

export default function Home() {
  const [clef, setClef] = useState<"treble" | "bass" | "alto">("treble");
  const [svgContent, setSvgContent] = useState<string>("");

  const { notePositions, accidentalPositions } = useMemo(() => {
    const notePositions = computeXPositions(testChordPitches);
    const accidentalPositions = computeAccidentalOffsets(
      testChordPitches,
      ACCIDENTAL_BASE_X,
      ACCIDENTAL_LEFT_OFFSET
    );
    return { notePositions, accidentalPositions };
  }, [testChordPitches]);

  // function to trigger download
  const downloadSVG = () => {
    if (!svgContent) return;
    const blob = new Blob([svgContent], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `chord_${clef}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="flex flex-col items-center gap-8 p-12">
      <label className="text-lg">
        Select Clef:
        <select
          className="ml-2 p-1 border rounded"
          value={clef}
          onChange={(e) => setClef(e.target.value as any)}
        >
          <option value="treble">Treble</option>
          <option value="bass">Bass</option>
          <option value="alto">Alto</option>
        </select>
      </label>

      {/* SVG preview */}
      <div className="flex justify-center items-center h-[300px] bg-white rounded shadow overflow-visible">
        <div className="w-[400px] h-[300px] flex justify-center items-center overflow-visible">
          <SVGChordRenderer
            notes={testChordPitches}
            clef={clef}
            scale={1}
            onSVGReady={setSvgContent} // receive SVG data
          />
        </div>
      </div>

      {/* Download button */}
      <button
        onClick={downloadSVG}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Download SVG
      </button>
    </main>
  );
}