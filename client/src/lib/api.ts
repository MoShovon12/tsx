const TIMEOUT_MS = 10000;

export async function sendToGlow(
  userText: string,
  opts?: { signal?: AbortSignal }
): Promise<string> {
  const base =
    (import.meta as any).env?.VITE_API_URL?.replace(/\/$/, "") ?? "";
  const url = `${base}/api/chat`;

  const ctl = new AbortController();
  const timeout = setTimeout(() => ctl.abort(), TIMEOUT_MS);
  const signal = opts?.signal
    ? mergeSignals(opts.signal, ctl.signal)
    : ctl.signal;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userText }),
      signal,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json().catch(() => ({} as any));
    const reply = typeof (data as any).reply === "string" ? (data as any).reply : null;
    return reply ?? fallbackReply(userText);
  } catch {
    return fallbackReply(userText); // privacy-first offline fallback
  } finally {
    clearTimeout(timeout);
  }
}

function mergeSignals(a: AbortSignal, b: AbortSignal): AbortSignal {
  const ctl = new AbortController();
  const onAbort = () => ctl.abort();
  a.addEventListener("abort", onAbort, { once: true });
  b.addEventListener("abort", onAbort, { once: true });
  return ctl.signal;
}

function fallbackReply(input: string): string {
  const s = input.toLowerCase();
  if (s.includes("panic") || s.includes("breathe"))
    return "I’m with you. Try 4–4–6 breathing and a 5-4-3-2-1 grounding. If you’re in immediate danger, please contact emergency services.";
  if (s.includes("anx") || s.includes("stress"))
    return "Thanks for sharing. Let’s try a 3-minute pause: notice, breathe slowly, choose one tiny next step.";
  if (s.includes("sleep"))
    return "Sleep’s tough with a busy mind. Dim lights, screen-free wind-down, and the 10-3-2-1-0 routine can help. Want a short wind-down?";
  if (s.includes("okay") || s.includes("thanks"))
    return "Noted. I’m here anytime. Would you like a gentle check-in plan for the week?";
  return "Would you like a mood check-in, a breathing exercise, or sleep support?";
}
