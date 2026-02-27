"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";

type MediaKind = "image" | "video";

type Props = {
  exampleId: string;
  mediaKind: MediaKind;
};

function once(target: EventTarget, eventName: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const onSuccess = () => {
      cleanup();
      resolve();
    };

    const onError = () => {
      cleanup();
      reject(new Error(`Kunne ikke lese ${eventName}.`));
    };

    const cleanup = () => {
      target.removeEventListener(eventName, onSuccess);
      target.removeEventListener("error", onError);
    };

    target.addEventListener(eventName, onSuccess, { once: true });
    target.addEventListener("error", onError, { once: true });
  });
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob | null> {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), type, quality);
  });
}

async function buildPosterFromVideo(file: File): Promise<File | null> {
  const url = URL.createObjectURL(file);

  try {
    const video = document.createElement("video");
    video.preload = "metadata";
    video.muted = true;
    video.playsInline = true;
    video.src = url;

    if (video.readyState < HTMLMediaElement.HAVE_METADATA) {
      await once(video, "loadedmetadata");
    }

    const targetTime = Number.isFinite(video.duration) && video.duration > 0.12 ? 0.12 : 0;
    if (targetTime > 0) {
      video.currentTime = targetTime;
      await once(video, "seeked");
    }

    if (video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
      await once(video, "loadeddata");
    }

    const width = video.videoWidth;
    const height = video.videoHeight;
    if (!width || !height) return null;

    const maxWidth = 1280;
    const renderWidth = width > maxWidth ? maxWidth : width;
    const renderHeight = width > maxWidth ? Math.round((height * maxWidth) / width) : height;

    const canvas = document.createElement("canvas");
    canvas.width = renderWidth;
    canvas.height = renderHeight;
    const context = canvas.getContext("2d");
    if (!context) return null;
    context.drawImage(video, 0, 0, renderWidth, renderHeight);

    const webpBlob = await canvasToBlob(canvas, "image/webp", 0.9);
    const blob = webpBlob ?? (await canvasToBlob(canvas, "image/jpeg", 0.9));
    if (!blob) return null;

    const fileStem = file.name.replace(/\.[^.]+$/, "") || "video";
    const ext = blob.type === "image/webp" ? "webp" : "jpg";
    return new File([blob], `${fileStem}-poster.${ext}`, { type: blob.type });
  } finally {
    URL.revokeObjectURL(url);
  }
}

export default function KISkoleMediaUploadForm({ exampleId, mediaKind }: Props) {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const accept = useMemo(
    () => (mediaKind === "video" ? "video/mp4,video/webm,video/quicktime" : "image/png,image/jpeg,image/webp"),
    [mediaKind]
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);

    const form = event.currentTarget;
    const fileInput = form.elements.namedItem("file") as HTMLInputElement | null;
    const selectedFile = fileInput?.files?.[0] ?? null;

    if (!selectedFile) {
      setErrorMessage("Velg en fil først.");
      return;
    }

    setIsUploading(true);

    try {
      const payload = new FormData();
      payload.set("example_id", exampleId);
      payload.set("media_kind", mediaKind);
      payload.set("file", selectedFile);

      if (mediaKind === "video") {
        try {
          const poster = await buildPosterFromVideo(selectedFile);
          if (poster) {
            payload.set("poster_file", poster);
          }
        } catch (error) {
          console.warn("Klarte ikke å lage automatisk poster fra video. Fortsetter med videoupload.", error);
        }
      }

      const response = await fetch("/api/admin/ki-skole-media", {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: payload,
      });

      const contentType = response.headers.get("content-type") ?? "";
      if (!response.ok) {
        if (contentType.includes("application/json")) {
          const data = await response.json().catch(() => null);
          throw new Error(String(data?.error ?? `Opplasting feilet (${response.status}).`));
        }
        throw new Error(`Opplasting feilet (${response.status}).`);
      }

      form.reset();
      router.refresh();
    } catch (error: any) {
      setErrorMessage(String(error?.message ?? "Opplasting feilet."));
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-3 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))]/60 p-3">
      <input type="hidden" name="example_id" value={exampleId} />
      <input type="hidden" name="media_kind" value={mediaKind} />
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">Cloudflare-opplasting</p>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <input type="file" name="file" accept={accept} required disabled={isUploading} className="max-w-full text-xs" />
        <button
          type="submit"
          disabled={isUploading}
          className="inline-flex rounded-lg border border-[rgb(var(--border))] px-3 py-1.5 text-sm font-semibold hover:bg-[rgb(var(--bg))] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isUploading ? "Laster opp..." : "Last opp fil"}
        </button>
      </div>
      <p className="mt-1 text-[11px] text-[rgb(var(--muted))]">
        {mediaKind === "video"
          ? "Ved video lages poster/thumbnail automatisk fra første frame."
          : "Oppdaterer media-feltene automatisk for dette kortet."}
      </p>
      {errorMessage ? <p className="mt-1 text-[11px] text-rose-300">{errorMessage}</p> : null}
    </form>
  );
}
