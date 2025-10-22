      

import { STAFF_LINE_SPACING, STAFF_TOP_Y } from "@/lib/layout";

/**
 * Render the staff as five SVG lines.
 * @param width staff width (default 120)
 * @returns SVG string fragment
 */
export function renderStaffFragment(width: number = 120): string {
  let svg = "";
  for (let line = 0; line < 5; ++line) {
    const y = STAFF_TOP_Y + line * STAFF_LINE_SPACING;
    svg += `<line x1="0" x2="${width}" y1="${y}" y2="${y}" stroke="black" stroke-width="1"/>`;
  }
  return svg;
}