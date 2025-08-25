// src/components/GlowLogo.ts
import * as React from "react";

type Props = {
  /** Font size in pixels */
  sizePx?: number;
  /** Extra wrapper styles (optional) */
  style?: React.CSSProperties;
};

export default function GlowLogo({ sizePx = 24, style }: Props) {
  const wrapper: React.CSSProperties = {
    userSelect: "none",
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
    fontWeight: 600,
    letterSpacing: "0.01em",
    ...style,
  };

  const text: React.CSSProperties = {
    fontSize: sizePx,
    // gradient text without Tailwind
    backgroundImage: "linear-gradient(90deg, #10b981, #06b6d4, #8b5cf6)",
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    color: "transparent",
    // subtle glow
    textShadow: "0 0 12px rgba(16,185,129,0.35)",
    display: "inline-block",
    lineHeight: 1.1,
  };

  return React.createElement(
    "div",
    { style: wrapper },
    React.createElement("span", { style: text }, "Glow")
  );
}
