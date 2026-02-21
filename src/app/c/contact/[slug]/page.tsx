import Link from "next/link";
import type { Metadata } from "next";
import { siteMeta } from "@/lib/seo";
import { getCompanyBySlug } from "@/lib/supabase/server";
import { localizePath } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n.server";

function mapErrorMessage(code: string, locale: "no" | "en"): string {
  if (locale === "en") {
    switch (code) {
      case "missing":
        return "Please fill in all required fields.";
      case "invalid_email":
        return "Please provide a valid email address.";
      case "not_found":
        return "Company not found.";
      case "no_email":
        return "This company has no contact email set up yet.";
      case "config":
        return "Email sending is not configured yet. Please try again later.";
      case "send":
        return "Could not send your message right now. Please try again.";
      default:
        return "Something went wrong. Please try again.";
    }
  }

  switch (code) {
    case "missing":
      return "Fyll inn alle obligatoriske felter.";
    case "invalid_email":
      return "Legg inn en gyldig e-postadresse.";
    case "not_found":
      return "Fant ikke bedriften.";
    case "no_email":
      return "Bedriften har ikke kontakt-e-post satt opp ennå.";
    case "config":
      return "E-postsending er ikke konfigurert ennå. Prøv igjen senere.";
    case "send":
      return "Kunne ikke sende meldingen akkurat nå. Prøv igjen.";
    default:
      return "Noe gikk galt. Prøv igjen.";
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const locale = await getLocale();
  const { slug } = await params;
  const company = await getCompanyBySlug(slug);
  const name = company?.name ?? slug;

  return siteMeta({
    title:
      locale === "en"
        ? `Contact ${name} – KiReklame.no`
        : `Kontakt ${name} – KiReklame.no`,
    description:
      locale === "en"
        ? `Send a message to ${name} directly from KiReklame.`
        : `Send en melding til ${name} direkte fra KiReklame.`,
    path: `/c/contact/${slug}`,
  });
}

export default async function CompanyContactPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ sent?: string | string[]; error?: string | string[] }>;
}) {
  const locale = await getLocale();
  const { slug } = await params;
  const company = await getCompanyBySlug(slug);
  const sp = (await searchParams) ?? {};
  const sent = (Array.isArray(sp.sent) ? sp.sent[0] : sp.sent) === "1";
  const errorCodeRaw = Array.isArray(sp.error) ? sp.error[0] : sp.error;
  const errorCode = String(errorCodeRaw ?? "").trim();
  const companyPath = localizePath(locale, `/selskap/${slug}`);
  const formPath = localizePath(locale, `/c/contact/${slug}`);

  if (!company) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-14">
        <h1 className="text-3xl font-semibold tracking-tight">
          {locale === "en" ? "Company not found" : "Fant ikke bedriften"}
        </h1>
        <p className="mt-3 text-[rgb(var(--muted))]">
          {locale === "en"
            ? "The company profile does not exist or is unpublished."
            : "Bedriftsprofilen finnes ikke eller er ikke publisert."}
        </p>
        <Link
          href={localizePath(locale, "/selskaper")}
          className="mt-6 inline-flex items-center rounded-xl border border-[rgb(var(--border))] px-4 py-2 text-sm font-semibold"
        >
          {locale === "en" ? "Back to directory" : "Tilbake til katalog"}
        </Link>
      </main>
    );
  }

  const hasContactEmail = !!String(company.email ?? "").trim();
  const cover = company.cover_image || "/covers/cover-1.jpg";

  return (
    <main className="relative min-h-[100dvh] overflow-hidden">
      <div className="absolute inset-0">
        <img src={cover} alt={company.name} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-black/75" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(255,255,255,0.20),transparent_40%),radial-gradient(circle_at_80%_75%,rgba(255,255,255,0.14),transparent_45%)]" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[100dvh] w-full max-w-6xl items-start px-4 py-6 md:items-center md:py-8">
        <section className="w-full max-w-xl max-h-[90dvh] overflow-y-auto rounded-3xl border border-white/35 bg-black/20 p-4 text-white shadow-2xl backdrop-blur-xl md:p-6">
          <p className="inline-flex rounded-full border border-white/30 bg-black/25 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/85">
            {locale === "en" ? "Direct company contact" : "Direkte bedriftskontakt"}
          </p>

          <h1 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">
            {locale === "en" ? `Contact ${company.name}` : `Kontakt ${company.name}`}
          </h1>

          <p className="mt-3 text-sm leading-relaxed text-white/85">
            {locale === "en"
              ? `Your message is sent directly to ${company.name}, not to KiReklame support.`
              : `Meldingen sendes direkte til ${company.name}, ikke til KiReklame support.`}
          </p>

          {sent ? (
            <div className="mt-5 rounded-2xl border border-emerald-300/70 bg-emerald-500/20 p-4 text-sm text-emerald-100">
              {locale === "en"
                ? "Message sent. The company can reply directly to your email."
                : "Meldingen er sendt. Bedriften kan svare direkte til e-posten din."}
            </div>
          ) : null}

          {!sent && errorCode ? (
            <div className="mt-5 rounded-2xl border border-rose-300/70 bg-rose-500/20 p-4 text-sm text-rose-100">
              {mapErrorMessage(errorCode, locale)}
            </div>
          ) : null}

          {hasContactEmail ? (
            <form method="post" action="/api/company-contact" className="mt-5 grid gap-3">
              <input type="hidden" name="slug" value={company.slug} />
              <input type="hidden" name="return_to" value={formPath} />

              <div className="grid gap-3 md:grid-cols-2">
                <label className="grid gap-1">
                  <span className="text-sm font-semibold text-white/95">
                    {locale === "en" ? "Your name" : "Navn"}
                  </span>
                  <input
                    name="name"
                    required
                    className="w-full rounded-xl border border-white/35 bg-white/15 px-4 py-2.5 text-sm text-white placeholder:text-white/65 outline-none focus:border-white/65 focus:bg-white/20"
                    placeholder={locale === "en" ? "Your full name" : "Ditt fulle navn"}
                  />
                </label>

                <label className="grid gap-1">
                  <span className="text-sm font-semibold text-white/95">
                    {locale === "en" ? "Your email" : "Din e-post"}
                  </span>
                  <input
                    name="email"
                    type="email"
                    required
                    className="w-full rounded-xl border border-white/35 bg-white/15 px-4 py-2.5 text-sm text-white placeholder:text-white/65 outline-none focus:border-white/65 focus:bg-white/20"
                    placeholder={locale === "en" ? "you@email.com" : "din@epost.no"}
                  />
                </label>
              </div>

              <label className="grid gap-1">
                <span className="text-sm font-semibold text-white/95">
                  {locale === "en" ? "Subject" : "Emne"}
                </span>
                <input
                  name="subject"
                  required
                  defaultValue={
                    locale === "en"
                      ? `Inquiry via KiReklame: ${company.name}`
                      : `Kontakt via KiReklame: ${company.name}`
                  }
                  className="w-full rounded-xl border border-white/35 bg-white/15 px-4 py-2.5 text-sm text-white placeholder:text-white/65 outline-none focus:border-white/65 focus:bg-white/20"
                />
              </label>

              <label className="grid gap-1">
                <span className="text-sm font-semibold text-white">
                  {locale === "en" ? "Message" : "Melding"}
                </span>
                <textarea
                  name="message"
                  required
                  rows={6}
                  className="w-full rounded-xl border border-white/60 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-500 outline-none focus:border-white"
                  placeholder={
                    locale === "en" ? "What do you need help with?" : "Hva trenger du hjelp med?"
                  }
                />
              </label>

              <div className="hidden" aria-hidden>
                <label>
                  Leave this field empty
                  <input name="company" />
                </label>
              </div>

              <div className="mt-1 flex flex-wrap items-center gap-2">
                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-white/90 sm:w-auto"
                >
                  {locale === "en" ? "Send to company" : "Send til bedriften"}
                </button>

                <Link
                  href={localizePath(locale, `/c/email/${slug}`)}
                  className="inline-flex w-full items-center justify-center rounded-xl border border-white/45 bg-black/20 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-black/35 sm:w-auto"
                >
                  {locale === "en" ? "Open email app instead" : "Åpne e-postapp i stedet"}
                </Link>
              </div>
            </form>
          ) : (
            <div className="mt-6 rounded-2xl border border-white/30 bg-black/20 p-5">
              <p className="text-sm text-white/85">
                {locale === "en"
                  ? "This company has no direct contact email listed yet."
                  : "Bedriften har ikke oppgitt direkte kontakt-e-post ennå."}
              </p>
            </div>
          )}

          <div className="mt-6">
            <Link
              href={companyPath}
              className="text-sm font-medium text-white/90 underline underline-offset-4"
            >
              {locale === "en" ? "Back to company profile" : "Tilbake til bedriftsprofil"}
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
