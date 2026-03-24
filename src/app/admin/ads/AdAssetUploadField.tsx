"use client";

import { useRef, useState } from "react";

type Props = {
  fieldId: string;
  heading: string;
  description: string;
  disabled?: boolean;
};

type UploadResponse = {
  ok?: boolean;
  url?: string;
  error?: string;
  mode?: "r2" | "forward";
};

async function readJsonSafe(response: Response): Promise<UploadResponse | null> {
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return null;
  return response.json().catch(() => null);
}

export default function AdAssetUploadField({
  fieldId,
  heading,
  description,
  disabled = false,
}: Props) {
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  async function handleUpload() {
    setErrorMessage(null);
    setSuccessMessage(null);

    const file = inputRef.current?.files?.[0] ?? null;

    if (!file) {
      setErrorMessage("Velg en fil først.");
      return;
    }

    setIsUploading(true);

    try {
      const payload = new FormData();
      payload.set("file", file);

      const response = await fetch("/api/admin/ads/upload", {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: payload,
      });

      const data = await readJsonSafe(response);
      if (!response.ok || !data?.ok || !data.url) {
        throw new Error(String(data?.error ?? `Opplasting feilet (${response.status}).`));
      }

      const target = document.getElementById(fieldId);
      if (!(target instanceof HTMLInputElement)) {
        throw new Error("Fant ikke mål-feltet for URL.");
      }

      target.value = data.url;
      target.dispatchEvent(new Event("input", { bubbles: true }));
      target.dispatchEvent(new Event("change", { bubbles: true }));

      if (inputRef.current) {
        inputRef.current.value = "";
      }
      setSuccessMessage("Fil lastet opp. URL-feltet er oppdatert.");
    } catch (error: any) {
      setErrorMessage(String(error?.message ?? "Opplasting feilet."));
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="rounded-xl border border-dashed border-[rgb(var(--border))] bg-[rgb(var(--bg))]/40 p-3">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">
        {heading}
      </p>
      <p className="mt-1 text-[11px] text-[rgb(var(--muted))]">{description}</p>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          disabled={disabled || isUploading}
          className="max-w-full text-xs"
        />
        <button
          type="button"
          onClick={handleUpload}
          disabled={disabled || isUploading}
          className="inline-flex rounded-lg border border-[rgb(var(--border))] px-3 py-1.5 text-sm font-semibold hover:bg-[rgb(var(--bg))] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isUploading ? "Laster opp..." : "Last opp fil"}
        </button>
      </div>
      {successMessage ? (
        <p className="mt-2 text-[11px] text-emerald-400">{successMessage}</p>
      ) : null}
      {errorMessage ? <p className="mt-2 text-[11px] text-rose-400">{errorMessage}</p> : null}
    </div>
  );
}
