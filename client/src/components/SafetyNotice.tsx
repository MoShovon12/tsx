import * as React from "react";

export default function SafetyNotice() {
  return (
    <div
      className="card"
      style={{
        padding: "8px 10px",
        borderRadius: 12,
        background: "rgba(16,185,129,0.08)",
        borderColor: "rgba(16,185,129,0.35)",
        fontSize: 12,
        color: "#065f46",
      }}
    >
      Glow supports well-being but isn’t a substitute for a clinician. If you’re in crisis
      or thinking about harming yourself, call your local emergency number. In the UK,
      call <strong>999</strong>, or contact Samaritans at <strong>116 123</strong>.
    </div>
  );
}
