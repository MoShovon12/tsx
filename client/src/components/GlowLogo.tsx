import * as React from "react";

export default function GlowLogo({ sizePx = 28 }: { sizePx?: number }) {
  return (
    <div style={{ userSelect: "none", fontWeight: 600, letterSpacing: "0.01em" }}>
      <span className="glow-text" style={{ fontSize: sizePx, lineHeight: 1.1, display: "inline-block" }}>
        Glow
      </span>
    </div>
  );
}
