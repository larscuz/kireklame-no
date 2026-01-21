export async function fetchText(url: string, opts?: { timeoutMs?: number }) {
  const timeoutMs = opts?.timeoutMs ?? 12_000;
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "user-agent":
          "KiReklameBot/0.1 (respectful; contact: kireklame.no) Node/Next",
        "accept":
          "text/html,application/xml,text/xml,application/rss+xml,application/json;q=0.9,*/*;q=0.8"
      },
      signal: controller.signal
    });

    const text = await res.text();
    return { ok: res.ok, status: res.status, text };
  } finally {
    clearTimeout(t);
  }
}
