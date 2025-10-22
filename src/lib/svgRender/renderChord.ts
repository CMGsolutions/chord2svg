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
  x = 0,
  width = 220,
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
  viewBox="0 0 ${width + 80} 200"
  xmlns="http://www.w3.org/2000/svg"
  preserveAspectRatio="xMinYMin meet"
>
  <g transform="translate(40, 90)">
    ${staff}
    ${clefElement}
    ${noteElements}
  </g>
</svg>
`;
}