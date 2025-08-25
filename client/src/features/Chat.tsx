import * as React from "react";
import GlowLogo from "../components/GlowLogo";
import MessageBubble from "../components/MessageBubble";
import QuickReplies from "../components/QuickReplies";
import SafetyNotice from "../components/SafetyNotice";
import type { Message } from "../types";
import { sendToGlow } from "../lib/api";

const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

export default function Chat() {
  const [messages, setMessages] = React.useState<Message[]>([
    {
      id: uid(),
      role: "assistant",
      text: "Hi, I’m Glow. I can help with gentle check-ins, breathing, and sleep tips. What would support you right now?",
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
        {/* Header */}
        <header style={{ marginBottom: 12, display: "flex", alignItems: "center", gap: 10 }}>
          <GlowLogo />
          <span
            style={{
              marginLeft: 2, padding: "2px 8px", fontSize: 11, borderRadius: 999,
              color: "#065f46", background: "#d1fae5", border: "1px solid rgba(16,185,129,0.35)",
            }}
          >
            mental health chat
          </span>
        </header>

        {/* Safety */}
        <div style={{ marginBottom: 10 }}>
          <SafetyNotice />
        </div>

        {/* Chat card */}
        <div className="card" style={{ overflow: "hidden" }}>
          <div ref={listRef} className="scroll" style={{ height: "62vh", padding: 14, background: "#f9fafb" }}>
            {messages.map((m) => (
              <div key={m.id} style={{ margin: "8px 0" }}>
                <MessageBubble {...m} />
              </div>
            ))}
          </div>

          <div style={{ borderTop: "1px solid var(--border)", padding: 12, background: "rgba(255,255,255,0.95)" }}>
            <div style={{ marginBottom: 8 }}>
              <QuickReplies onPick={(t) => send(t)} />
            </div>
            <Composer value={input} onChange={setInput} onSend={() => send()} disabled={busy} />
            <p style={{ marginTop: 6, fontSize: 11, color: "var(--muted)" }}>
              Your privacy matters. We don’t show any server names here. If a network issue occurs, Glow continues in a private offline mode.
            </p>
          </div>
        </div>

        {/* Footer */}
        <footer style={{ marginTop: 10, textAlign: "center", fontSize: 12, color: "var(--muted)" }}>
          Built with ❤️ — Glow
        </footer>
      </section>
    </main>
  );
}

function Composer({
  value, onChange, onSend, disabled,
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
          flex: 1, resize: "vertical", padding: 10,
          border: "1px solid var(--border)", borderRadius: 10,
          fontFamily: "inherit", fontSize: 14,
        }}
        disabled={disabled}
      />
      <button
        onClick={onSend}
        disabled={disabled || !value.trim()}
        title="Send"
        style={{
          padding: "10px 14px", borderRadius: 10,
          border: "1px solid #0f172a", background: "#0f172a", color: "white",
          cursor: disabled || !value.trim() ? "not-allowed" : "pointer", opacity: disabled ? 0.6 : 1
        }}
      >
        Send
      </button>
    </div>
  );
}
