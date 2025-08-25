// src/App.tsx
import React from "react";
import Chat from "./features/Chat";

console.log("APP LOGIN GATE ACTIVE:", import.meta.url);

export default function App() {
  const [authed, setAuthed] = React.useState(false);

  if (authed) {
    return (
      <div>
        <div style={{ padding: 8, textAlign: "right" }}>
          <button
            onClick={() => setAuthed(false)}
            style={{
              padding: "6px 10px",
              borderRadius: 8,
              border: "1px solid var(--border)",
              background: "#fff",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </div>
        <Chat />
      </div>
    );
  }

  return <LoginForm onAuthed={() => setAuthed(true)} />;
}

function LoginForm({ onAuthed }: { onAuthed: () => void }) {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const ok = username.trim().toLowerCase() === "shovon" && password === "123";
    if (!ok) {
      setError("Invalid credentials. Use username: shovon, password: 123");
      return;
    }
    setBusy(true);
    await new Promise((r) => setTimeout(r, 300));
    onAuthed();
  }

  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 16 }}>
      <section className="card" style={{ width: "min(480px, 92vw)", padding: 22, borderRadius: 12 }}>
        <header style={{ marginBottom: 12 }}>
          <div style={{ userSelect: "none", fontWeight: 700, letterSpacing: "0.01em" }}>
            <span className="glow-text" style={{ fontSize: 28, lineHeight: 1.1, display: "inline-block" }}>
              Glow
            </span>
          </div>
          <div style={{ fontSize: 13, color: "var(--muted)" }}>Sign in to continue</div>
        </header>

        <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
          <div style={{ display: "grid", gap: 6 }}>
            <label style={{ fontSize: 12, color: "var(--muted)" }} htmlFor="user">Username</label>
            <input
              id="user"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="shovon"
              autoComplete="username"
              style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid var(--border)", background: "#fff", font: "inherit" }}
            />
          </div>

          <div style={{ display: "grid", gap: 6 }}>
            <label style={{ fontSize: 12, color: "var(--muted)" }} htmlFor="pass">Password</label>
            <input
              id="pass"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="123"
              autoComplete="current-password"
              style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid var(--border)", background: "#fff", font: "inherit" }}
            />
          </div>

          {error && <div style={{ color: "#b91c1c", fontSize: 12 }}>{error}</div>}

          <button
            type="submit"
            disabled={busy || !username || !password}
            style={{
              padding: "10px 14px",
              borderRadius: 10,
              border: "1px solid #0f172a",
              background: "#0f172a",
              color: "#fff",
              fontWeight: 600,
              cursor: busy || !username || !password ? "not-allowed" : "pointer",
              opacity: busy ? 0.7 : 1,
            }}
          >
            {busy ? "Signing in…" : "Sign in"}
          </button>

          <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>
            Tip: username <strong>shovon</strong>, password <strong>123</strong>.
          </p>
        </form>
      </section>
    </main>
  );
}
