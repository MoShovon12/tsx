import * as React from "react";

type State = {
  username: string;
  password: string;
  remember: boolean;
  busy: boolean;
  error: string | null;
  show: boolean;
};

const init: State = {
  username: "",
  password: "",
  remember: false,
  busy: false,
  error: null,
  show: false,
};

export default function Login() {
  const [s, set] = React.useState(init);

  const valid = s.username.trim().length > 0 && s.password.length >= 6 && !s.busy;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!valid) {
      set((p) => ({ ...p, error: "Enter username and a 6+ char password." }));
      return;
    }
    set((p) => ({ ...p, busy: true, error: null }));
    // TODO: wire to backend later (POST /api/login)
    await new Promise((r) => setTimeout(r, 700));
    alert("Signed in (mock). Replace with real API and navigate to Chat.");
    set((p) => ({ ...p, busy: false }));
  }

  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 18 }}>
      <section className="login-shell">
        {/* dark card that overlaps the split */}
        <div className="login-card">
          <h3 className="login-title">Log In</h3>
          <div className="top-link">
            Don’t have an Account? <a href="#" onClick={(e)=>e.preventDefault()}>Register here…</a>
          </div>

          <form className="login-form" onSubmit={onSubmit} noValidate>
            <div>
              <label className="login-label" htmlFor="user">Username</label>
              <input
                id="user"
                className="login-input"
                placeholder="your.name"
                value={s.username}
                onChange={(e) => set({ ...s, username: e.target.value })}
                autoComplete="username"
              />
            </div>

            <div>
              <label className="login-label" htmlFor="pass">Password</label>
              <div style={{ position: "relative" }}>
                <input
                  id="pass"
                  className="login-input"
                  type={s.show ? "text" : "password"}
                  placeholder="••••••••"
                  value={s.password}
                  onChange={(e) => set({ ...s, password: e.target.value })}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => set({ ...s, show: !s.show })}
                  style={{
                    position: "absolute", right: 6, top: 6, height: 34, padding: "0 10px",
                    background: "rgba(255,255,255,.08)", color: "#fff", border: "1px solid rgba(255,255,255,.18)",
                    borderRadius: 6, cursor: "pointer"
                  }}
                  title={s.show ? "Hide password" : "Show password"}
                >
                  {s.show ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div className="login-row">
              <button className="login-btn" type="submit" disabled={!valid}>
                {s.busy ? "Signing in…" : "Sign in"}
              </button>
              <label className="remember">
                <input
                  type="checkbox"
                  checked={s.remember}
                  onChange={(e) => set({ ...s, remember: e.target.checked })}
                />
                <span>Remember Me</span>
              </label>
            </div>

            {s.error && <div style={{ color: "#ffb4b4", fontSize: 12 }}>{s.error}</div>}
          </form>
        </div>

        {/* right panel */}
        <div />
        <div className="login-hero">
          <div>
            <div className="art" aria-hidden="true" />
            <h1 className="welcome">Welcome</h1>
            <p className="sub">
              Please remember, aim to stay connected, take deep breaths,
              and give yourself compassion as you continue your work.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
