"use client";

import { useState } from "react";
import Staff from "@/components/Staff";
import Clef from "@/components/Clef";
import NoteHead from "@/components/NoteHead";
import { computeXPositions } from "@/lib/checkNoteCollisions";
import { computeAccidentalOffsets } from "@/lib/checkAccidentalCollisions";
import { ACCIDENTAL_BASE_X, ACCIDENTAL_LEFT_OFFSET } from "@/lib/layout";


// const testChordPitches = ["C4","E-4", "G4", "Bb-4", "G6", "G2"];
const testChordPitches = ["C5","Bb-4", "A4", "G4", "Db-4", "D#4"];
// const testChordPitches = ["Gb+4", "Ab-4", "Bb-3", "Db-5"];
// const testChordPitches = ["Bb-3", "Ab+4"];
// const testChordPitches = ["E-2","F2","G2","Ab2","A#2","C3","D#3","F3","G#3","Bb3","C4","Db4","E4","F#4","A4"];


const notePositions = computeXPositions(testChordPitches);
const accidentalPositions = computeAccidentalOffsets(
  testChordPitches,
  ACCIDENTAL_BASE_X,
  ACCIDENTAL_LEFT_OFFSET
);

export default function Home() {
  const [clef, setClef] = useState<"treble" | "bass" | "alto">("treble");

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

      <div className="flex justify-center items-center h-[300px] bg-white rounded shadow">
        <div className="scale-[1] origin-top-left w-[200px] h-[200px] flex justify-center items-center">
          <svg
            viewBox="0 0 200 200"
            preserveAspectRatio="xMinYMax meet"
            className="h-auto w-auto overflow-visible"
          >
            <g transform="translate(30, 60)">
              <Clef clef={clef} />
              <Staff />
              {testChordPitches.map((pitch, i) => {
                const note = notePositions.find(n => n.pitch === pitch);
                const acc = accidentalPositions.find(a => a.pitch === pitch);
                if (!note || !acc) return null;
                return <NoteHead key={i} x={note.x} pitch={pitch} clef={clef} accX={acc.accX} />;
              })}
            </g>
          </svg>
        </div>
      </div>
    </main>
  );
}