import { rewritePromptWithSyntaxProtocol, type LlmProviderInfo } from "@/lib/ki-opplaring/llm";

export type ImageComparePayload = {
  prompt: string;
  aspectRatio: "1:1" | "16:9";
};

export type VideoComparePayload = {
  prompt: string;
  durationSec?: number;
};

export type RewriteChange = {
  reason: string;
  before: string;
  after: string;
};

export type ImageCompareResult = {
  original_prompt: string;
  improved_prompt: string;
  original_image_url: string;
  improved_image_url: string;
  changes: RewriteChange[];
  why_improved_is_better: string[];
  mock: boolean;
};

export type VideoCompareResult = {
  original_prompt: string;
  improved_prompt: string;
  original_video_url: string;
  improved_video_url: string;
  duration_sec: number;
  changes: RewriteChange[];
  why_improved_is_better: string[];
  mock: boolean;
};

function toText(value: unknown): string {
  return String(value ?? "").trim();
}

function boolFromEnv(value: string | undefined, fallback = false): boolean {
  const normalized = toText(value).toLowerCase();
  if (!normalized) return fallback;
  return normalized === "1" || normalized === "true" || normalized === "yes" || normalized === "on";
}

function mediaEnabled(): boolean {
  return boolFromEnv(process.env.MEDIA_ENABLED, false);
}

function imageCompareEnabled(): boolean {
  return mediaEnabled() && boolFromEnv(process.env.IMAGE_COMPARE_ENABLED, false);
}

function videoCompareEnabled(): boolean {
  return mediaEnabled() && boolFromEnv(process.env.VIDEO_ENABLED, false) && boolFromEnv(process.env.VIDEO_COMPARE_ENABLED, false);
}

function mockImagePair() {
  return {
    original: "/mock/diffuse_noise_original.png",
    improved: "/mock/diffuse_noise_improved.png",
  };
}

function mockVideoPair() {
  return {
    original: "/mock/diffuse_motion_original.gif",
    improved: "/mock/diffuse_motion_improved.gif",
  };
}

function whyList(changes: RewriteChange[]): string[] {
  const base = [
    "Den forbedrede prompten beskriver fysisk lys i stedet for vage ord.",
    "Den forbedrede prompten låser materialrespons og miljøbegrensninger.",
    "Den forbedrede prompten reduserer tolkning og gir mer stabilt output.",
  ];

  if (!changes.length) return base;

  return [
    ...changes.slice(0, 3).map((item) => item.reason),
    ...base,
  ].slice(0, 5);
}

function aspectRatioToSize(aspectRatio: "1:1" | "16:9") {
  if (aspectRatio === "16:9") {
    return { width: 768, height: 432 };
  }

  return { width: 512, height: 512 };
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  return Buffer.from(buffer).toString("base64");
}

function asDataUrl(base64: string, mimeType: string): string {
  const mime = toText(mimeType) || "image/png";
  return `data:${mime};base64,${base64}`;
}

async function runCloudflareImage(prompt: string, aspectRatio: "1:1" | "16:9"): Promise<string> {
  const accountId = toText(process.env.CLOUDFLARE_ACCOUNT_ID);
  const token = toText(process.env.CLOUDFLARE_API_TOKEN);
  const model = toText(process.env.CLOUDFLARE_IMAGE_MODEL) || "@cf/stabilityai/stable-diffusion-xl-base-1.0";

  if (!accountId || !token || !model) {
    throw new Error("Cloudflare image provider er ikke konfigurert");
  }

  const size = aspectRatioToSize(aspectRatio);
  const endpoint = `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${model}`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt,
      width: size.width,
      height: size.height,
      num_steps: 20,
      guidance: 7.5,
    }),
  });

  const contentType = toText(response.headers.get("content-type"));

  if (!response.ok) {
    const errorJson = (await response.json().catch(() => null)) as { errors?: Array<{ message?: string }> } | null;
    throw new Error(errorJson?.errors?.[0]?.message || `Cloudflare image feil (${response.status})`);
  }

  if (contentType.startsWith("image/")) {
    const bytes = await response.arrayBuffer();
    return asDataUrl(arrayBufferToBase64(bytes), contentType);
  }

  const json = (await response.json().catch(() => null)) as
    | {
        result?: { image?: string } | string[];
      }
    | null;

  const fromObject = toText((json?.result as { image?: string } | null)?.image);
  if (fromObject) {
    return asDataUrl(fromObject, "image/png");
  }

  const fromArray = Array.isArray(json?.result) ? toText(json?.result[0]) : "";
  if (fromArray) {
    return asDataUrl(fromArray, "image/png");
  }

  throw new Error("Cloudflare image returnerte ugyldig format");
}

async function runPollinationsImage(prompt: string, aspectRatio: "1:1" | "16:9"): Promise<string> {
  const { width, height } = aspectRatioToSize(aspectRatio);
  const model = toText(process.env.POLLINATIONS_IMAGE_MODEL) || "flux";
  const encodedPrompt = encodeURIComponent(prompt);
  return `https://image.pollinations.ai/prompt/${encodedPrompt}?model=${encodeURIComponent(model)}&width=${width}&height=${height}&nologo=true&safe=true`;
}

function getFalUrlFromPayload(payload: unknown): string {
  if (!payload || typeof payload !== "object") return "";

  const node = payload as Record<string, unknown>;

  const directCandidates = [
    node.url,
    node.video_url,
    node.output_url,
    (node.video as Record<string, unknown> | undefined)?.url,
  ];

  for (const candidate of directCandidates) {
    const value = toText(candidate);
    if (value.startsWith("http://") || value.startsWith("https://")) {
      return value;
    }
  }

  if (Array.isArray(node.outputs)) {
    for (const entry of node.outputs) {
      const nested = getFalUrlFromPayload(entry);
      if (nested) return nested;
    }
  }

  if (Array.isArray(node.images)) {
    for (const entry of node.images) {
      const nested = getFalUrlFromPayload(entry);
      if (nested) return nested;
    }
  }

  return "";
}

async function sleep(ms: number) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

async function runFalVideo(prompt: string, durationSec: number): Promise<string> {
  const apiKey = toText(process.env.FAL_API_KEY);
  const model = toText(process.env.FAL_VIDEO_MODEL);
  const baseUrl = toText(process.env.FAL_API_BASE_URL) || "https://fal.run";

  if (!apiKey || !model) {
    throw new Error("Fal video provider er ikke konfigurert");
  }

  const base = baseUrl.replace(/\/+$/, "");
  const endpoint = `${base}/${model}`;

  const requestPayload = {
    prompt,
    duration: Math.min(4, Math.max(1, Math.floor(durationSec))),
    resolution: "480p",
    fps: 24,
    aspect_ratio: "16:9",
    audio: false,
  };

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Key ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestPayload),
  });

  const json = (await response.json().catch(() => null)) as Record<string, unknown> | null;

  if (!response.ok) {
    throw new Error(`Fal video feil (${response.status})`);
  }

  const directUrl = getFalUrlFromPayload(json);
  if (directUrl) {
    return directUrl;
  }

  const requestId = toText(json?.request_id);
  if (!requestId) {
    throw new Error("Fal video returnerte ingen URL eller request_id");
  }

  const statusUrl =
    toText(json?.status_url) || `${base}/${model}/requests/${requestId}`;

  for (let attempt = 0; attempt < 12; attempt += 1) {
    await sleep(1500);

    const statusResponse = await fetch(statusUrl, {
      headers: {
        Authorization: `Key ${apiKey}`,
      },
    });

    const statusJson = (await statusResponse.json().catch(() => null)) as Record<string, unknown> | null;
    const url = getFalUrlFromPayload(statusJson);
    if (url) return url;

    const status = toText(statusJson?.status).toLowerCase();
    if (status === "failed" || status === "cancelled" || status === "error") {
      throw new Error("Fal video-jobben feilet");
    }
  }

  throw new Error("Fal video timed out");
}

export async function runImageCompareGenerate(payload: ImageComparePayload): Promise<{ result: ImageCompareResult; provider: LlmProviderInfo }> {
  const prompt = toText(payload.prompt);
  const aspectRatio = payload.aspectRatio === "16:9" ? "16:9" : "1:1";

  const rewrite = await rewritePromptWithSyntaxProtocol(prompt, "Image prompt rewrite for side-by-side pedagogical comparison");
  const changes = rewrite.data.changes;
  const base = {
    original_prompt: prompt,
    improved_prompt: rewrite.data.improved_prompt,
    changes,
    why_improved_is_better: whyList(changes),
  };

  if (!imageCompareEnabled()) {
    const mock = mockImagePair();
    return {
      result: {
        ...base,
        original_image_url: mock.original,
        improved_image_url: mock.improved,
        mock: true,
      },
      provider: {
        name: "mock",
        model: "image-mock-v1",
        cached: false,
      },
    };
  }

  const provider = toText(process.env.IMAGE_PROVIDER).toLowerCase() || "pollinations";

  if (provider !== "cloudflare" && provider !== "pollinations") {
    const mock = mockImagePair();
    return {
      result: {
        ...base,
        original_image_url: mock.original,
        improved_image_url: mock.improved,
        mock: true,
      },
      provider: {
        name: "mock",
        model: "image-provider-disabled",
        cached: false,
      },
    };
  }

  try {
    const imageRunner = provider === "pollinations" ? runPollinationsImage : runCloudflareImage;
    const [originalImage, improvedImage] = await Promise.all([
      imageRunner(prompt, aspectRatio),
      imageRunner(rewrite.data.improved_prompt, aspectRatio),
    ]);

    const providerModel =
      provider === "pollinations"
        ? toText(process.env.POLLINATIONS_IMAGE_MODEL) || "flux"
        : toText(process.env.CLOUDFLARE_IMAGE_MODEL) || "@cf/stabilityai/stable-diffusion-xl-base-1.0";

    return {
      result: {
        ...base,
        original_image_url: originalImage,
        improved_image_url: improvedImage,
        mock: false,
      },
      provider: {
        name: provider as "cloudflare" | "pollinations",
        model: providerModel,
        cached: false,
      },
    };
  } catch {
    const mock = mockImagePair();
    return {
      result: {
        ...base,
        original_image_url: mock.original,
        improved_image_url: mock.improved,
        mock: true,
      },
      provider: {
        name: "mock",
        model: "image-mock-v1",
        cached: false,
      },
    };
  }
}

export async function runVideoCompareGenerate(payload: VideoComparePayload): Promise<{ result: VideoCompareResult; provider: LlmProviderInfo }> {
  const prompt = toText(payload.prompt);
  const durationSec = Math.min(4, Math.max(1, Math.floor(Number(payload.durationSec ?? 4))));

  const rewrite = await rewritePromptWithSyntaxProtocol(prompt, "Video prompt rewrite for side-by-side pedagogical comparison");
  const changes = rewrite.data.changes;

  const base = {
    original_prompt: prompt,
    improved_prompt: rewrite.data.improved_prompt,
    duration_sec: durationSec,
    changes,
    why_improved_is_better: whyList(changes),
  };

  if (!videoCompareEnabled()) {
    const mock = mockVideoPair();
    return {
      result: {
        ...base,
        original_video_url: mock.original,
        improved_video_url: mock.improved,
        mock: true,
      },
      provider: {
        name: "mock",
        model: "video-mock-v1",
        cached: false,
      },
    };
  }

  const provider = toText(process.env.VIDEO_PROVIDER).toLowerCase() || "fal";

  if (provider !== "fal") {
    const mock = mockVideoPair();
    return {
      result: {
        ...base,
        original_video_url: mock.original,
        improved_video_url: mock.improved,
        mock: true,
      },
      provider: {
        name: "mock",
        model: "video-provider-disabled",
        cached: false,
      },
    };
  }

  try {
    const [originalVideo, improvedVideo] = await Promise.all([
      runFalVideo(prompt, durationSec),
      runFalVideo(rewrite.data.improved_prompt, durationSec),
    ]);

    return {
      result: {
        ...base,
        original_video_url: originalVideo,
        improved_video_url: improvedVideo,
        mock: false,
      },
      provider: {
        name: "fal",
        model: toText(process.env.FAL_VIDEO_MODEL) || "fal-video-model",
        cached: false,
      },
    };
  } catch {
    const mock = mockVideoPair();
    return {
      result: {
        ...base,
        original_video_url: mock.original,
        improved_video_url: mock.improved,
        mock: true,
      },
      provider: {
        name: "mock",
        model: "video-mock-v1",
        cached: false,
      },
    };
  }
}
