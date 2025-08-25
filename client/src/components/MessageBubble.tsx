import * as React from "react";
import type { Message } from "../types";

export default function MessageBubble({ role, text, pending }: Message) {
  const mine = role === "user";

  const container: React.CSSProperties = {
    display: "flex",
    justifyContent: mine ? "flex-end" : "flex-start",
    gap: 8,
  };

  const bubble: React.CSSProperties = {
    maxWidth: "80%",
    padding: "8px 12px",
    borderRadius: 14,
    boxShadow: "0 1px 2px rgba(0,0,0,.04)",
    border: "1px solid var(--border)",
    background: mine
      ? "#111827"
      : "#ffffff",
    color: mine ? "#ffffff" : "var(--text)",
    ...(pending ? { opacity: 0.7 } : {})
  };

  // Optional assistant gradient
  const assistantGradient = !mine
    ? {
        backgroundImage:
          "linear-gradient(135deg, rgba(255,255,255,1), rgba(255,255,255,1))",
      }
    : {};

  return (
    <div style={container}>
      {!mine && (
        <div
          style={{
            height: 32, width: 32, borderRadius: 999,
            backgroundImage: "linear-gradient(135deg, var(--accent1), var(--accent2))",
            color: "white", display: "grid", placeItems: "center",
            fontSize: 11, fontWeight: 700
          }}
          aria-hidden
        >
          G
        </div>
      )}
      <div style={{ ...bubble, ...assistantGradient }}>
        {pending ? "…" : text}
      </div>
    </div>
  );
}
