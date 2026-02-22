import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Manrope, Space_Grotesk } from "next/font/google";
import { localizePath } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n.server";
import { siteMeta } from "@/lib/seo";

const headingFont = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const bodyFont = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const pagePalette = {
  "--ads-bg": "#060709",
  "--ads-panel": "#0b0e12",
  "--ads-panel-strong": "#10151c",
  "--ads-border": "#232d3b",
  "--ads-text": "#f3f6fa",
  "--ads-muted": "#9ca8b8",
  "--ads-accent": "#84c9ff",
  "--ads-accent-soft": "rgba(132, 201, 255, 0.14)",
  "--ads-highlight": "rgba(209, 241, 255, 0.08)",
} as CSSProperties;

type PackagePlan = {
  name: string;
  description: string;
  subtitle?: string;
  label?: string;
  features: string[];
  highlighted?: boolean;
};

const packagePlans: PackagePlan[] = [
  {
    name: "Annonsepakke Basis",
    description: "Enkel annonseplass med tydelig synlighet i valgt flate.",
    features: [
      "Visning på avtalt plassering i kategori",
      "Klikkbar lenke til egen nettside",
      "Synlighet i hele avtaleperioden",
      "Mulighet for oppdatert annonsemateriell",
      "Rotasjon med andre annonsører i samme flate",
    ],
  },
  {
    name: "Annonsepakke Fremhevet",
    description: "Premium plassering for høyere synlighet på sentrale flater.",
    subtitle:
      "For selskaper som vil ha sterkere eksponering i relevante kontekster.",
    features: [
      "Fremhevet plassering",
      "\"Verified AI\" badge i annonsevisning",
      "Større visuell eksponering enn Basis",
      "Klikkbar henvisning til egen nettside",
      "Mulighet for oppdatert annonsemateriell",
    ],
    highlighted: true,
  },
  {
    name: "Annonsepakke Partner",
    description: "Kombinert annonsepakke med synlighet på flere flater.",
    label: "Kun 5 plasser",
    features: [
      "Frontpage-rotasjon",
      "Banner i KI Nyheter (1920x200)",
      "Synlighet på flere avtaleflater i samme periode",
      "Klikkbar henvisning til egen nettside",
      "Løpende oppdatering av annonsemateriell",
    ],
  },
];

const visibilitySurfaces = [
  {
    title: "Frontpage placement",
    detail: "Målrettet plassering i katalogens hovedflate.",
    imageSrc:
      "https://pub-b53c56f5af3e471cb8b3610afdc49a36.r2.dev/ki-reklame/ChatGPT%20Image%20Feb%2020%2C%202026%2C%2011_24_40%20AM.png",
    imageAlt: "Eksempel på frontpage placement i KiReklame",
  },
  {
    title: "Company profile page",
    detail: "Profilside med produkt, metode og kontaktpunkt.",
    imageSrc:
      "https://pub-b53c56f5af3e471cb8b3610afdc49a36.r2.dev/ki-reklame/ChatGPT%20Image%20Feb%2020%2C%202026%2C%2011_24_33%20AM.png",
    imageAlt: "Eksempel på company profile page i KiReklame",
  },
  {
    title: "KI Nyheter banner (1920x200)",
    detail: "Toppbanner i nyhetsstrøm med premium synlighet.",
    imageSrc:
      "https://pub-b53c56f5af3e471cb8b3610afdc49a36.r2.dev/ki-reklame/ChatGPT%20Image%20Feb%2020%2C%202026%2C%2011_25_35%20AM.png",
    imageAlt: "Eksempel på KI Nyheter-banner med format 1920x200",
  },
];

export const metadata: Metadata = siteMeta({
  title: "Annonsér på KiReklame – Annonseplass 2026",
  description:
    "Betalt synlighet på definerte annonseflater i 2026 på KiReklame. Se annonsepakker og kontakt oss for konkret tilbud.",
  path: "/annonsere",
});

function PricingCard({ plan, ctaHref }: { plan: PackagePlan; ctaHref: string }) {
  return (
    <article
      className={`rounded-3xl border p-6 sm:p-7 ${
        plan.highlighted
          ? "border-[var(--ads-accent)]/60 bg-[var(--ads-panel-strong)] shadow-[0_0_0_1px_rgba(132,201,255,0.18)]"
          : "border-[var(--ads-border)] bg-[var(--ads-panel)]"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className={`${headingFont.className} text-xl font-semibold tracking-tight`}>{plan.name}</h3>
          <p className="mt-2 text-sm text-[var(--ads-muted)]">{plan.description}</p>
        </div>
        {plan.label ? (
          <span className="rounded-full border border-[var(--ads-accent)]/55 bg-[var(--ads-accent-soft)] px-3 py-1 text-xs font-semibold text-[var(--ads-text)]">
            {plan.label}
          </span>
        ) : null}
      </div>

      {plan.subtitle ? <p className="mt-3 text-xs text-[var(--ads-muted)]">{plan.subtitle}</p> : null}

      <div className="mt-6 rounded-2xl border border-[var(--ads-border)] bg-black/20 p-4">
        <div className="text-xs uppercase tracking-[0.14em] text-[var(--ads-muted)]">
          Pris og tilgjengelighet
        </div>
        <p className="mt-2 text-sm text-[var(--ads-muted)]">
          Kontakt oss for konkret tilbud basert på plassering, varighet og kapasitet.
        </p>
        <Link
          href={ctaHref}
          className="mt-4 inline-flex items-center rounded-xl border border-[var(--ads-accent)]/60 bg-[var(--ads-accent-soft)] px-3 py-1.5 text-xs font-semibold text-[var(--ads-text)] transition hover:bg-[var(--ads-highlight)]"
        >
          Kontakt for tilbud
        </Link>
      </div>

      <ul className="mt-6 space-y-2 text-sm text-[var(--ads-text)]/92">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2">
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[var(--ads-accent)]" aria-hidden="true" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <Link
        href={ctaHref}
        className="mt-7 inline-flex w-full items-center justify-center rounded-2xl border border-[var(--ads-border)] bg-[var(--ads-panel-strong)] px-4 py-3 text-sm font-semibold transition hover:border-[var(--ads-accent)]/50 hover:bg-[var(--ads-highlight)]"
      >
        Be om annonseforslag
      </Link>
    </article>
  );
}

function SurfaceBlock({
  title,
  detail,
  imageSrc,
  imageAlt,
}: {
  title: string;
  detail: string;
  imageSrc: string;
  imageAlt: string;
}) {
  return (
    <article className="rounded-3xl border border-[var(--ads-border)] bg-[var(--ads-panel)] p-6">
      <div className={`${headingFont.className} text-lg font-semibold tracking-tight`}>{title}</div>
      <p className="mt-2 text-sm text-[var(--ads-muted)]">{detail}</p>

      <div className="mt-5 overflow-hidden rounded-2xl border border-[var(--ads-border)] bg-[var(--ads-panel-strong)]">
        <img src={imageSrc} alt={imageAlt} loading="lazy" decoding="async" className="h-auto w-full" />
      </div>
    </article>
  );
}

export default async function AdvertisingPage() {
  const locale = await getLocale();
  const contactPath = localizePath(locale, "/kontakt");
  const ctaHref = `${contactPath}?topic=${encodeURIComponent("annonsering")}`;

  return (
    <div style={pagePalette} className={`${bodyFont.className} bg-[var(--ads-bg)] text-[var(--ads-text)]`}>
      <div className="mx-auto max-w-6xl px-4 py-8 sm:py-12 lg:py-14">
        <section className="relative overflow-hidden rounded-[2rem] border border-[var(--ads-border)] bg-[var(--ads-panel)] px-4 py-3 sm:px-6 sm:py-4 lg:px-8">
          <div
            className="pointer-events-none absolute inset-0 opacity-30 [background-image:linear-gradient(to_right,rgba(156,168,184,0.15)_1px,transparent_1px),linear-gradient(to_bottom,rgba(156,168,184,0.15)_1px,transparent_1px)] [background-size:46px_46px] animate-[pulse_12s_ease-in-out_infinite]"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -right-10 top-3 h-24 w-24 rounded-full border border-[var(--ads-border)]"
            aria-hidden="true"
          />

          <div className="relative flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[var(--ads-muted)]">
                KiReklame 2026
              </p>
              <h1 className={`${headingFont.className} mt-1 text-2xl font-semibold tracking-tight sm:text-3xl`}>
                Annonsér på KiReklame
              </h1>
              <p className="mt-1.5 max-w-lg text-sm text-[var(--ads-muted)] sm:text-[15px]">
                Betalt synlighet på definerte flater i 2026. Begrenset kapasitet.
              </p>
            </div>
            <Link
              href={ctaHref}
              className="inline-flex w-fit items-center rounded-xl border border-[var(--ads-accent)]/60 bg-[var(--ads-accent-soft)] px-4 py-1.5 text-xs font-semibold text-[var(--ads-text)] transition hover:bg-[var(--ads-highlight)] sm:text-sm md:shrink-0"
            >
              Be om annonseforslag
            </Link>
          </div>
        </section>

        <section className="mt-16">
          <h2 className={`${headingFont.className} text-3xl font-semibold tracking-tight sm:text-4xl`}>
            Annonsepakker 2026
          </h2>
          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {packagePlans.map((plan) => (
              <PricingCard key={plan.name} plan={plan} ctaHref={ctaHref} />
            ))}
          </div>
        </section>

        <section className="mt-12 rounded-3xl border border-[var(--ads-border)] bg-[var(--ads-panel)] px-6 py-8 sm:px-8">
          <h2 className={`${headingFont.className} text-2xl font-semibold tracking-tight`}>
            Hva innebærer annonsering på KiReklame?
          </h2>
          <p className="mt-4 max-w-4xl text-base leading-relaxed text-[var(--ads-muted)]">
            Annonsering gir betalt synlighet på definerte flater på kireklame.no.
          </p>
          <ul className="mt-5 space-y-2 text-sm text-[var(--ads-text)]/92">
            {[
              "Visning på avtalt plassering (forside, kategori eller KI Nyheter)",
              "Klikkbar henvisning til egen nettside",
              "Synlighet i hele avtaleperioden",
              "Mulighet for oppdatert annonsemateriell ved behov",
              "Rotasjon eller plassbegrensning avtales per annonseflate",
              "Tilbud og kapasitet for 2026 avtales ved kontakt",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[var(--ads-accent)]" aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <div className="mt-6 rounded-2xl border border-[var(--ads-border)] bg-black/20 px-4 py-3 text-sm text-[var(--ads-muted)]">
            KiReklame tilbyr eksponering og bransjesynlighet. Vi garanterer ikke antall visninger, klikk eller leads.
            Endelig tilbud og vilkår fastsettes ved bestilling.
          </div>
        </section>

        <section className="mt-16">
          <h2 className={`${headingFont.className} text-3xl font-semibold tracking-tight sm:text-4xl`}>
            Hvor blir dere synlige?
          </h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {visibilitySurfaces.map((surface) => (
              <SurfaceBlock
                key={surface.title}
                title={surface.title}
                detail={surface.detail}
                imageSrc={surface.imageSrc}
                imageAlt={surface.imageAlt}
              />
            ))}
          </div>
        </section>

        <section className="mt-16 rounded-3xl border border-[var(--ads-border)] bg-[var(--ads-panel)] px-6 py-8 sm:px-8">
          <h2 className={`${headingFont.className} text-2xl font-semibold tracking-tight`}>
            Avgrensning mellom katalog og annonse
          </h2>
          <p className="mt-4 max-w-4xl text-base leading-relaxed text-[var(--ads-muted)]">
            Denne siden gjelder kun betalt annonseplass. Katalogoppføring og eventuelle redaksjonelle vurderinger
            håndteres separat og inngår ikke automatisk i annonsepakker.
          </p>
        </section>

        <section className="mt-16 rounded-[2rem] border border-[var(--ads-border)] bg-[var(--ads-panel)] px-6 py-12 text-center sm:px-10">
          <h2 className={`${headingFont.className} text-3xl font-semibold tracking-tight sm:text-4xl`}>
            Vil dere være blant de første?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-[var(--ads-muted)]">
            Kapasiteten er begrenset i 2026.
          </p>
          <Link
            href={ctaHref}
            className="mt-8 inline-flex items-center rounded-2xl border border-[var(--ads-accent)]/60 bg-[var(--ads-accent-soft)] px-7 py-3.5 text-sm font-semibold text-[var(--ads-text)] transition hover:bg-[var(--ads-highlight)]"
          >
            Be om konkret annonseforslag
          </Link>
        </section>
      </div>
    </div>
  );
}
