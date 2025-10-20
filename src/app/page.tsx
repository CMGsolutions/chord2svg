"use client";

import { useState } from "react";
import Staff from "@/components/Staff";
import Clef from "@/components/Clef";
import NoteHead from "@/components/NoteHead";

const testChordPitches = ["C4","E4", "G4", "Bb-4"];

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

      <div className="flex justify-center items-center h-[300px]">
        <div className="scale-[1.5] origin-top-left bg-white w-[400px] h-[200px] flex justify-center items-center rounded shadow">
          <svg
            viewBox="0 0 350 120"
            preserveAspectRatio="xMinYMid meet"
            className="w-[350px] h-[100px]"
          >
            <Clef clef={clef} />
            <Staff />

            {testChordPitches.map((pitch, i) => (
              <NoteHead key={i} x={80} pitch={pitch} clef={clef} />
            ))}
          </svg>
        </div>
      </div>
    </main>
  );
}