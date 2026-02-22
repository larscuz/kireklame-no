import { persistUsageSnapshot } from "@/hooks/ki-opplaring/useUsage";

export type LlmProviderInfo = {
  name: "openrouter" | "mock" | "cloudflare" | "fal" | "pollinations";
  model: string;
  cached: boolean;
};

export type LlmUsage = {
  remaining: number;
  used: number;
  limit: number;
  mode: "anon" | "user";
  status: "ok" | "limited" | "degraded";
};

export type LlmRouteResponse<T> = {
  ok: boolean;
  provider?: LlmProviderInfo;
  usage?: LlmUsage;
  task?: string;
  result?: T;
  data?: T;
  error?: string;
  detail?: string;
};

function saveUsageIfPresent(usage: LlmUsage | undefined) {
  if (!usage) return;
  persistUsageSnapshot(usage);
}

export async function postKiExercise<T>(task: string, payload: Record<string, unknown>): Promise<LlmRouteResponse<T>> {
  const response = await fetch("/api/ki-opplaring/llm", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      task,
      payload,
    }),
  });

  const json = (await response.json().catch(() => null)) as LlmRouteResponse<T> | null;

  if (!response.ok || !json) {
    saveUsageIfPresent(json?.usage);
    return {
      ok: false,
      usage: json?.usage,
      error: json?.error || `Request feilet (${response.status})`,
      detail: json?.detail,
    };
  }

  const data = json.data ?? json.result;
  const normalized: LlmRouteResponse<T> = {
    ...json,
    data,
  };

  saveUsageIfPresent(normalized.usage);
  return normalized;
}

export function downloadTextFile(filename: string, content: string, mimeType = "text/plain;charset=utf-8") {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
