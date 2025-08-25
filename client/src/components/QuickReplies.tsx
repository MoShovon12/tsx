import * as React from "react";

const options = [
  "I feel anxious",
  "I'm stressed",
  "I can't sleep",
  "I'm okay, just checking in",
  "I’m having a panic moment",
];

export default function QuickReplies({ onPick }: { onPick: (text: string) => void }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onPick(opt)}
          style={{
            border: "1px solid var(--border)",
            background: "white",
            padding: "6px 10px",
            borderRadius: 999,
            fontSize: 12,
            cursor: "pointer",
          }}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}
