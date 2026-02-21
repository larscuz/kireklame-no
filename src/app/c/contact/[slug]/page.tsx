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

  return (
    <main className="mx-auto max-w-3xl px-4 py-14">
      <h1 className="text-3xl font-semibold tracking-tight">
        {locale === "en" ? `Contact ${company.name}` : `Kontakt ${company.name}`}
      </h1>
      <p className="mt-3 text-[rgb(var(--muted))]">
        {locale === "en"
          ? "Send a direct inquiry from the website. The company will receive your message by email."
          : "Send en direkte henvendelse fra nettsiden. Bedriften mottar meldingen på e-post."}
      </p>

      {sent ? (
        <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
          {locale === "en"
            ? "Message sent. The company can reply directly to your email."
            : "Meldingen er sendt. Bedriften kan svare direkte til e-posten din."}
        </div>
      ) : null}

      {!sent && errorCode ? (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {mapErrorMessage(errorCode, locale)}
        </div>
      ) : null}

      {hasContactEmail ? (
        <form
          method="post"
          action="/api/company-contact"
          className="mt-8 grid gap-4 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-6 shadow-soft"
        >
          <input type="hidden" name="slug" value={company.slug} />
          <input type="hidden" name="return_to" value={formPath} />

          <label className="grid gap-1">
            <span className="text-sm font-semibold">{locale === "en" ? "Your name" : "Navn"}</span>
            <input
              name="name"
              required
              className="w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-4 py-3 text-sm outline-none"
              placeholder={locale === "en" ? "Your full name" : "Ditt fulle navn"}
            />
          </label>

          <label className="grid gap-1">
            <span className="text-sm font-semibold">{locale === "en" ? "Your email" : "Din e-post"}</span>
            <input
              name="email"
              type="email"
              required
              className="w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-4 py-3 text-sm outline-none"
              placeholder={locale === "en" ? "you@email.com" : "din@epost.no"}
            />
          </label>

          <label className="grid gap-1">
            <span className="text-sm font-semibold">{locale === "en" ? "Subject" : "Emne"}</span>
            <input
              name="subject"
              required
              defaultValue={locale === "en" ? `Inquiry from KiReklame: ${company.name}` : `Kontakt via KiReklame: ${company.name}`}
              className="w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-4 py-3 text-sm outline-none"
            />
          </label>

          <label className="grid gap-1">
            <span className="text-sm font-semibold">{locale === "en" ? "Message" : "Melding"}</span>
            <textarea
              name="message"
              required
              rows={7}
              className="w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-4 py-3 text-sm outline-none"
              placeholder={
                locale === "en"
                  ? "What do you need help with?"
                  : "Hva trenger du hjelp med?"
              }
            />
          </label>

          <div className="hidden" aria-hidden>
            <label>
              Leave this field empty
              <input name="company" />
            </label>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-xl bg-[rgb(var(--fg))] px-4 py-2.5 text-sm font-semibold text-[rgb(var(--bg))] hover:opacity-90 transition"
            >
              {locale === "en" ? "Send message" : "Send melding"}
            </button>

            <Link
              href={localizePath(locale, `/c/email/${slug}`)}
              className="inline-flex items-center justify-center rounded-xl border border-[rgb(var(--border))] px-4 py-2.5 text-sm font-semibold"
            >
              {locale === "en" ? "Open email app instead" : "Åpne e-postapp i stedet"}
            </Link>
          </div>
        </form>
      ) : (
        <div className="mt-8 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-6">
          <p className="text-sm text-[rgb(var(--muted))]">
            {locale === "en"
              ? "This company has no direct contact email listed yet."
              : "Bedriften har ikke oppgitt direkte kontakt-e-post ennå."}
          </p>
        </div>
      )}

      <div className="mt-6">
        <Link
          href={companyPath}
          className="text-sm font-medium underline underline-offset-4"
        >
          {locale === "en" ? "Back to company profile" : "Tilbake til bedriftsprofil"}
        </Link>
      </div>
    </main>
  );
}
