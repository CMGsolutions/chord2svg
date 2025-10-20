// Staff Constructor
import React from "react";
import { STAFF_LINE_SPACING, STAFF_TOP_Y } from "@/lib/layout";

const Staff: React.FC = () => {
  const width = 120;

  return (
    <>
      {[0, 1, 2, 3, 4].map((line) => (
        <line
          key={line}
          x1={0}
          x2={width}
          y1={STAFF_TOP_Y + line * STAFF_LINE_SPACING}
          y2={STAFF_TOP_Y + line * STAFF_LINE_SPACING}
          stroke="black"
          strokeWidth={1}
        />
      ))}
    </>
  );
};

export default Staff;