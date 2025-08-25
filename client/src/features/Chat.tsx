// src/features/Chat.tsx
import * as React from "react";

/** Types */
type Role = "assistant" | "user";
type Message = { id: string; role: Role; text: string; createdAt: number; pending?: boolean };

/** Utils */
const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

/** API with safe fallbacks (no optional chaining, ASCII quotes) */
async function sendToGlow(userText: string): Promise<string> {
  const env: any = (import.meta as any).env;
  const base = env && typeof env.VITE_API_URL === "string" ? env.VITE_API_URL.replace(/\/$/, "") : "";
  const url = base + "/api/chat";

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userText }),
    });
    if (!res.ok) throw new Error("HTTP " + res.status);
    const data: any = await res.json().catch(() => ({}));
    const reply = data && typeof data.reply === "string" ? data.reply : null;
    return reply ?? fallback(userText);
  } catch {
    return fallback(userText);
  }
}

function fallback(input: string): string {
  const s = input.toLowerCase();
  if (s.indexOf("panic") >= 0 || s.indexOf("breathe") >= 0)
    return "I am with you. Try 4-4-6 breathing and a quick 5-4-3-2-1 grounding. If you are in immediate danger, please contact emergency services.";
  if (s.indexOf("anx") >= 0 || s.indexOf("stress") >= 0)
    return "Thanks for sharing. Let us try a 3-minute pause: notice, breathe slowly, choose one small next step.";
  if (s.indexOf("sleep") >= 0)
    return "Sleep is tough with a busy mind. Dim lights, screen-free wind-down, and the 10-3-2-1-0 routine can help. Want a short wind-down?";
  if (s.indexOf("okay") >= 0 || s.indexOf("thanks") >= 0)
    return "Noted. I am here anytime. Would you like a gentle check-in plan for the week?";
  return "Would you like a mood check-in, a breathing exercise, or sleep support?";
}

/** Small inline UI bits (no external imports) */
function GlowLogo({ sizePx = 28 }: { sizePx?: number }) {
  return (
    <div style={{ userSelect: "none", fontWeight: 600, letterSpacing: "0.01em" }}>
      <span
        style={{
          fontSize: sizePx,
          lineHeight: 1.1,
          display: "inline-block",
          backgroundImage: "linear-gradient(90deg, #10b981, #06b6d4, #8b5cf6)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
          textShadow: "0 0 12px rgba(16,185,129,0.35)",
        }}
      >
        Glow
      </span>
    </div>
  );
}

function SafetyNotice() {
  return (
    <div
      style={{
        padding: "8px 10px",
        borderRadius: 12,
        background: "rgba(16,185,129,0.08)",
        border: "1px solid rgba(16,185,129,0.35)",
        fontSize: 12,
        color: "#065f46",
      }}
    >
      Glow supports well-being but is not a substitute for a clinician. If you are in crisis or thinking about harming
      yourself, call your local emergency number. In the UK: 999 or Samaritans 116 123.
    </div>
  );
}

function QuickReplies({ onPick }: { onPick: (t: string) => void }) {
  const options = ["I feel anxious", "I'm stressed", "I can't sleep", "I'm okay, just checking in", "I’m having a panic moment"];
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onPick(opt)}
          style={{
            border: "1px solid #e2e8f0",
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

function MessageBubble({ role, text, pending }: Message) {
  const mine = role === "user";
  const bubble: React.CSSProperties = {
    maxWidth: "80%",
    padding: "8px 12px",
    borderRadius: 14,
    boxShadow: "0 1px 2px rgba(0,0,0,.04)",
    border: "1px solid #e2e8f0",
    background: mine ? "#111827" : "#ffffff",
    color: mine ? "#ffffff" : "#0f172a",
    opacity: pending ? 0.7 : 1,
  };
  return (
    <div style={{ display: "flex", justifyContent: mine ? "flex-end" : "flex-start", gap: 8 }}>
      {!mine && (
        <div
          style={{
            height: 32,
            width: 32,
            borderRadius: 999,
            backgroundImage: "linear-gradient(135deg, #10b981, #06b6d4)",
            color: "white",
            display: "grid",
            placeItems: "center",
            fontSize: 11,
            fontWeight: 700,
          }}
          aria-hidden
        >
          G
        </div>
      )}
      <div style={bubble}>{pending ? "…" : text}</div>
    </div>
  );
}

function Composer({
  value,
  onChange,
  onSend,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
  disabled?: boolean;
}) {
  const taRef = React.useRef<HTMLTextAreaElement | null>(null);
  React.useEffect(() => {
    if (!taRef.current) return;
    taRef.current.style.height = "0px";
    taRef.current.style.height = Math.min(140, taRef.current.scrollHeight) + "px";
  }, [value]);

  return (
    <div style={{ display: "flex", gap: 8 }}>
      <textarea
        ref={taRef}
        rows={1}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            onSend();
          }
        }}
        placeholder="Share what's on your mind… (Enter to send, Shift+Enter = newline)"
        style={{
          flex: 1,
          resize: "vertical",
          padding: 10,
          border: "1px solid #e2e8f0",
          borderRadius: 10,
          fontFamily: "inherit",
          fontSize: 14,
        }}
        disabled={disabled}
      />
      <button
        onClick={onSend}
        disabled={disabled || !value.trim()}
        title="Send"
        style={{
          padding: "10px 14px",
          borderRadius: 10,
          border: "1px solid #0f172a",
          background: "#0f172a",
          color: "white",
          cursor: disabled || !value.trim() ? "not-allowed" : "pointer",
          opacity: disabled ? 0.6 : 1,
        }}
      >
        Send
      </button>
    </div>
  );
}

/** Main Chat */
export default function Chat() {
  const [messages, setMessages] = React.useState<Message[]>([
    {
      id: uid(),
      role: "assistant",
      text: "Hi, I am Glow. I can help with gentle check-ins, breathing, and sleep tips. What would support you right now?",
      createdAt: Date.now(),
    },
  ]);
  const [input, setInput] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const listRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight + 1000;
  }, [messages]);

  async function send(textFromUser?: string) {
    const text = (textFromUser ?? input).trim();
    if (!text || busy) return;
    setInput("");

    const user: Message = { id: uid(), role: "user", text, createdAt: Date.now() };
    const typing: Message = { id: uid(), role: "assistant", text: "", createdAt: Date.now(), pending: true };
    setMessages((m) => [...m, user, typing]);
    setBusy(true);

    const reply = await sendToGlow(text);

    setMessages((m) => {
      const copy = [...m];
      const i = copy.findIndex((x) => x.pending);
      if (i !== -1) copy[i] = { ...copy[i], pending: false, text: reply };
      return copy;
    });
    setBusy(false);
  }

  return (
    <main style={{ minHeight: "100vh", padding: 16, display: "grid", placeItems: "start center" }}>
      <section style={{ width: "min(860px, 94vw)" }}>
        <header style={{ marginBottom: 12, display: "flex", alignItems: "center", gap: 10 }}>
          <GlowLogo />
          <span
            style={{
              marginLeft: 2,
              padding: "2px 8px",
              fontSize: 11,
              borderRadius: 999,
              color: "#065f46",
              background: "#d1fae5",
              border: "1px solid rgba(16,185,129,0.35)",
            }}
          >
            mental health chat
          </span>
        </header>

        <div style={{ marginBottom: 10 }}>
          <SafetyNotice />
        </div>

        <div style={{ background: "rgba(255,255,255,0.92)", border: "1px solid #e2e8f0", borderRadius: 20, boxShadow: "0 8px 24px rgba(0,0,0,.04)", overflow: "hidden" }}>
          <div ref={listRef} style={{ height: "62vh", padding: 14, background: "#f9fafb", overflow: "auto" }}>
            {messages.map((m) => (
              <div key={m.id} style={{ margin: "8px 0" }}>
                <MessageBubble {...m} />
              </div>
            ))}
          </div>

          <div style={{ borderTop: "1px solid #e2e8f0", padding: 12, background: "rgba(255,255,255,0.96)" }}>
            <div style={{ marginBottom: 8 }}>
              <QuickReplies onPick={(t) => send(t)} />
            </div>
            <Composer value={input} onChange={setInput} onSend={() => send()} disabled={busy} />
            <p style={{ marginTop: 6, fontSize: 11, color: "#64748b" }}>
              Your privacy matters. We do not show any server names here. If a network issue occurs, Glow continues in a private offline mode.
            </p>
          </div>
        </div>

        <footer style={{ marginTop: 10, textAlign: "center", fontSize: 12, color: "#64748b" }}>
          Built with love — Glow
        </footer>
      </section>
    </main>
  );
}
