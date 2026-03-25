"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type SettingsAction = (formData: FormData) => void | Promise<void>;

type CompanyOption = {
  name: string;
  slug: string;
  is_active: boolean;
};

type SiteSettings = {
  featured_company_slug?: string | null;
  featured_hero_video_url?: string | null;
  featured_hero_poster_url?: string | null;
  companies_featured_company_slug?: string | null;
  companies_hero_video_url?: string | null;
  companies_hero_poster_url?: string | null;
  international_featured_company_slug?: string | null;
  international_hero_video_url?: string | null;
  international_hero_poster_url?: string | null;
} | null;

type HeroMediaSectionProps = {
  sectionTitle: string;
  featuredLabel: string;
  featuredHelp: string;
  featuredName: string;
  featuredDefaultValue: string;
  videoName: string;
  videoDefaultValue: string;
  posterName: string;
  posterDefaultValue: string;
  posterFileStem: string;
  registerGenerator: (name: string, generator: () => Promise<void>) => void;
  activeCompanies: CompanyOption[];
  inactiveCompanies: CompanyOption[];
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

async function buildPosterFromVideoUrl(videoUrl: string, fileStem: string): Promise<File | null> {
  const video = document.createElement("video");
  video.preload = "metadata";
  video.muted = true;
  video.playsInline = true;
  video.crossOrigin = "anonymous";
  video.src = videoUrl;

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

  const ext = blob.type === "image/webp" ? "webp" : "jpg";
  return new File([blob], `${fileStem}-poster.${ext}`, { type: blob.type });
}

async function uploadPosterFile(file: File): Promise<string> {
  const payload = new FormData();
  payload.set("file", file);

  const response = await fetch("/api/admin/ads/upload", {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
    body: payload,
  });

  const data = await response.json().catch(() => null);
  if (!response.ok || !data?.ok || typeof data?.url !== "string") {
    throw new Error(String(data?.error ?? `Opplasting feilet (${response.status}).`));
  }

  return data.url;
}

function HeroMediaSection({
  sectionTitle,
  featuredLabel,
  featuredHelp,
  featuredName,
  featuredDefaultValue,
  videoName,
  videoDefaultValue,
  posterName,
  posterDefaultValue,
  posterFileStem,
  registerGenerator,
  activeCompanies,
  inactiveCompanies,
}: HeroMediaSectionProps) {
  const videoRef = useRef<HTMLInputElement | null>(null);
  const posterRef = useRef<HTMLInputElement | null>(null);
  const [posterPreview, setPosterPreview] = useState(posterDefaultValue);
  const [statusMessage, setStatusMessage] = useState<string | null>(
    posterDefaultValue ? "Poster klar." : null
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const lastResolvedVideoUrlRef = useRef<string | null>(
    videoDefaultValue && posterDefaultValue ? videoDefaultValue : null
  );

  async function maybeGeneratePoster(force = false) {
    const currentVideoUrl = videoRef.current?.value.trim() ?? "";
    const currentPosterUrl = posterRef.current?.value.trim() ?? "";

    if (!currentVideoUrl) {
      return;
    }

    if (!force && currentPosterUrl && lastResolvedVideoUrlRef.current === currentVideoUrl) {
      return;
    }

    setIsGenerating(true);
    setErrorMessage(null);
    setStatusMessage("Lager screenshot fra video...");

    try {
      const posterFile = await buildPosterFromVideoUrl(currentVideoUrl, posterFileStem);
      if (!posterFile) {
        throw new Error("Klarte ikke å hente en frame fra videoen.");
      }

      setStatusMessage("Laster opp screenshot...");
      const uploadedUrl = await uploadPosterFile(posterFile);

      if (posterRef.current) {
        posterRef.current.value = uploadedUrl;
      }
      setPosterPreview(uploadedUrl);
      setStatusMessage("Poster oppdatert automatisk.");
      lastResolvedVideoUrlRef.current = currentVideoUrl;
    } catch (error: any) {
      const message =
        String(error?.message ?? "Klarte ikke lage automatisk poster.")
          || "Klarte ikke lage automatisk poster.";
      setErrorMessage(message);
      setStatusMessage(null);
    } finally {
      setIsGenerating(false);
    }
  }

  useEffect(() => {
    registerGenerator(videoName, () => maybeGeneratePoster(false));
  });

  return (
    <>
      <div className="mt-2 text-sm font-semibold text-[rgb(var(--muted))]">
        {sectionTitle}
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-semibold">{featuredLabel}</label>
        <select
          name={featuredName}
          defaultValue={featuredDefaultValue}
          className="w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-4 py-2"
        >
          <option value="">— Ingen —</option>

          <optgroup label="Aktive">
            {activeCompanies.map((company) => (
              <option key={company.slug} value={company.slug}>
                {company.name} ({company.slug})
              </option>
            ))}
          </optgroup>

          {inactiveCompanies.length ? (
            <optgroup label="Ikke aktive">
              {inactiveCompanies.map((company) => (
                <option key={company.slug} value={company.slug}>
                  {company.name} ({company.slug})
                </option>
              ))}
            </optgroup>
          ) : null}
        </select>
        <p className="text-xs text-[rgb(var(--muted))]">{featuredHelp}</p>
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-semibold">Hero video URL (.mp4)</label>
        <input
          ref={videoRef}
          name={videoName}
          defaultValue={videoDefaultValue}
          placeholder="https://.../video.mp4"
          className="w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-4 py-2"
          onBlur={() => {
            void maybeGeneratePoster(false);
          }}
        />
        <p className="text-xs text-[rgb(var(--muted))]">
          Bruk en direkte .mp4-url. Når feltet endres, forsøker admin å lage en poster automatisk fra første frame.
        </p>
      </div>

      <div className="grid gap-2">
        <div className="flex items-center justify-between gap-3">
          <label className="text-sm font-semibold">Hero poster URL (screenshot)</label>
          <button
            type="button"
            onClick={() => {
              void maybeGeneratePoster(true);
            }}
            disabled={isGenerating}
            className="inline-flex rounded-lg border border-[rgb(var(--border))] px-3 py-1.5 text-xs font-semibold hover:bg-[rgb(var(--bg))] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isGenerating ? "Genererer..." : "Regenerer automatisk"}
          </button>
        </div>
        <input
          ref={posterRef}
          name={posterName}
          defaultValue={posterDefaultValue}
          placeholder="https://.../hero-poster.jpg"
          className="w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-4 py-2"
          onChange={(event) => {
            setPosterPreview(event.currentTarget.value.trim());
          }}
        />
        <p className="text-xs text-[rgb(var(--muted))]">
          Vises mens videoen lastes. Fungerer best når video-URL-en peker til egen CDN/bucket eller annen kilde med CORS aktivert.
        </p>
        {statusMessage ? (
          <p className="text-xs text-emerald-300">{statusMessage}</p>
        ) : null}
        {errorMessage ? (
          <p className="text-xs text-rose-300">{errorMessage}</p>
        ) : null}
        {posterPreview ? (
          <div className="overflow-hidden rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))]/40">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={posterPreview}
              alt=""
              className="block max-h-48 w-full object-cover"
            />
          </div>
        ) : null}
      </div>
    </>
  );
}

export default function AdminSettingsForm({
  action,
  settings,
  companies,
}: {
  action: SettingsAction;
  settings: SiteSettings;
  companies: CompanyOption[];
}) {
  const activeCompanies = useMemo(
    () => companies.filter((company) => company.is_active),
    [companies]
  );
  const inactiveCompanies = useMemo(
    () => companies.filter((company) => !company.is_active),
    [companies]
  );
  const generatorsRef = useRef<Record<string, () => Promise<void>>>({});
  const allowNativeSubmitRef = useRef(false);
  const [isPreparingSubmit, setIsPreparingSubmit] = useState(false);

  function registerGenerator(name: string, generator: () => Promise<void>) {
    generatorsRef.current[name] = generator;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    if (allowNativeSubmitRef.current) {
      allowNativeSubmitRef.current = false;
      return;
    }

    event.preventDefault();
    setIsPreparingSubmit(true);

    try {
      for (const generator of Object.values(generatorsRef.current)) {
        await generator();
      }
    } finally {
      setIsPreparingSubmit(false);
      allowNativeSubmitRef.current = true;
      event.currentTarget.requestSubmit();
    }
  }

  return (
    <form
      action={action}
      onSubmit={handleSubmit}
      className="mt-8 grid gap-4 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-6 shadow-soft"
    >
      <HeroMediaSection
        sectionTitle="Forside"
        featuredLabel="Featured selskap"
        featuredHelp="Vises under søkefeltet på forsiden og lenker til /selskap/[slug]."
        featuredName="featured_company_slug"
        featuredDefaultValue={settings?.featured_company_slug ?? ""}
        videoName="featured_hero_video_url"
        videoDefaultValue={settings?.featured_hero_video_url ?? ""}
        posterName="featured_hero_poster_url"
        posterDefaultValue={settings?.featured_hero_poster_url ?? ""}
        posterFileStem="featured-hero"
        registerGenerator={registerGenerator}
        activeCompanies={activeCompanies}
        inactiveCompanies={inactiveCompanies}
      />

      <HeroMediaSection
        sectionTitle="Selskaper"
        featuredLabel="Featured selskap"
        featuredHelp="Vises i hero-blokken på /selskaper og lenker til /selskap/[slug]."
        featuredName="companies_featured_company_slug"
        featuredDefaultValue={settings?.companies_featured_company_slug ?? ""}
        videoName="companies_hero_video_url"
        videoDefaultValue={settings?.companies_hero_video_url ?? ""}
        posterName="companies_hero_poster_url"
        posterDefaultValue={settings?.companies_hero_poster_url ?? ""}
        posterFileStem="companies-hero"
        registerGenerator={registerGenerator}
        activeCompanies={activeCompanies}
        inactiveCompanies={inactiveCompanies}
      />

      <HeroMediaSection
        sectionTitle="Internasjonalt"
        featuredLabel="Featured selskap"
        featuredHelp="Vises i hero-blokken på /internasjonalt og lenker til /selskap/[slug]."
        featuredName="international_featured_company_slug"
        featuredDefaultValue={settings?.international_featured_company_slug ?? ""}
        videoName="international_hero_video_url"
        videoDefaultValue={settings?.international_hero_video_url ?? ""}
        posterName="international_hero_poster_url"
        posterDefaultValue={settings?.international_hero_poster_url ?? ""}
        posterFileStem="international-hero"
        registerGenerator={registerGenerator}
        activeCompanies={activeCompanies}
        inactiveCompanies={inactiveCompanies}
      />

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isPreparingSubmit}
          className="inline-flex rounded-xl bg-[rgb(var(--fg))] px-4 py-2 text-sm font-semibold text-[rgb(var(--bg))] hover:opacity-90 transition disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPreparingSubmit ? "Lager postere..." : "Lagre"}
        </button>

        <a
          href="/"
          className="inline-flex rounded-xl border border-[rgb(var(--border))] px-4 py-2 text-sm font-semibold hover:bg-[rgb(var(--bg))] transition"
        >
          Åpne forsiden ↗
        </a>
      </div>
    </form>
  );
}
