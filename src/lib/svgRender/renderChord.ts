import { renderStaffFragment } from "./renderStaff";
import { renderClefFragment } from "./renderClef";
import { renderNoteHeadFragment } from "./renderNoteHead";

export interface RenderNoteEntry {
  pitch: string;
  noteX: number;
  accX: number;
}

/**
 * Renders a full chord (staff + clef + noteheads + accidentals)
 * as a fully-aligned SVG string.
 */
export function renderChordSVG({
  clef,
  notes,
  width = 220,  // Extract to layout
}: {
  clef: "treble" | "bass" | "alto";
  notes: RenderNoteEntry[];
  x?: number;
  width?: number;
}): string {
  const staff = renderStaffFragment(width);
  const clefElement = renderClefFragment(clef);
  const noteElements = notes
    .map((n) =>
      renderNoteHeadFragment({
        x: n.noteX,
        pitch: n.pitch,
        clef,
        accX: n.accX,
      })
    )
    .join("\n");

  return `
<svg
  viewBox="0 0 ${width} 200"
  xmlns="http://www.w3.org/2000/svg"
  preserveAspectRatio="xMinYMin meet"
  style="overflow:visible;"
>
  <g transform="translate(40, 90)">
    ${staff}
    ${clefElement}
    ${noteElements}
  </g>
</svg>
`;
}