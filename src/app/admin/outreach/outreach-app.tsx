"use client";

import React, { useEffect, useMemo, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";

type MarketType = "NORWEGIAN" | "INTERNATIONAL";
type OutreachMode = "CURATED" | "AD_SALES";

type CompanyData = {
  name: string;
  email: string;
  url: string;
  slug?: string;
  coverImage?: string;
};

type EmailState = {
  subject: string;
  body: string;
};

type CompanyRecord = {
  id: string;
  name: string;
  email: string | null;
  website: string | null;
  slug: string | null;
  market: "no" | "intl";
  cover_image: string | null;
};

type AdLeadRecord = {
  id: string;
  name: string;
  email: string | null;
  website: string | null;
  source_url: string | null;
  market: string | null;
  status: string | null;
};

const TEMPLATES: Record<
  MarketType,
  { subject: string; body: (name: string, listingUrl: string) => string }
> = {
  NORWEGIAN: {
    subject: "Din oppføring på KiReklame.no",
    body: (name, listingUrl) => `Hei ${name}

Vi vil gjerne informere om at dere nå er inkludert i den kuraterte oversikten på KiReklame.no.

Lenke til deres side: ${
      listingUrl || "https://kireklame.no/selskap/reimagine-studios"
    } - Selskaper - Hvis du ikke ønsker å klikke på lenken, kan du prøve å skrive inn URL-en manuelt: kireklame . no.

Gi oss gjerne en tilbakemelding på om e-post og lenke stemmer. Dersom dere ønsker nytt cover-bilde eller showreel, send oss en URL til bilde og en til video, så oppdaterer vi.

Kjenner du til andre AI-first selskaper som jobber med kommersielt, visuelt og kreativt arbeid, tar vi gjerne imot tips.

Målet er å samle de beste KI-først aktørene på ett sted, som en ressurs for kunder som søker nettopp dette.

Annonseplass kan bookes gratis for gratis arrangementer. For betalt plassering i en periode, ta kontakt.

Vi håper katalogen gir dere flere leads og økt synlighet.

Med vennlig hilsen
Lars Cuzner, CEO
Cuz Media AS`,
  },
  INTERNATIONAL: {
    subject: "Your feature on KiReklame.no - Norway’s Curated AI-First Directory",
    body: (name, listingUrl) => `Hi ${name},

This is a friendly message to inform you that you have been featured on the curated list at KiReklame.no.

KiReklame is a premier Norwegian directory for AI-first creative production. Even though we are based in Norway, we believe this feature serves as a valuable resource for you to connect with the Scandinavian market and other international AI-first agencies.

You can view your listing here: ${
      listingUrl || "https://kireklame.no/internasjonalt"
    } - If you don’t want to click the link, you can try entering the URL manually: kireklame . no

Please let us know if the email and link are correct. If you would like to update your cover image or showreel, simply send us the URLs for the image and video files.

If you know of other AI-first companies working with commercial, visual, or creative production, we would appreciate any recommendations. Our goal is to consolidate the best AI-first resources for clients in one place.

Ad space is currently free for non-profit events; for commercial placements, please get in touch for rates.

We hope this listing helps generate more leads and visibility for your agency within the AI-first creative ecosystem.

Best regards,
Lars Cuzner, CEO
Cuz Media AS`,
  },
};

const AD_SALES_TEMPLATE = {
  subject: "Samarbeid og synlighet på KiReklame.no",
  body: (name: string) => `Hei ${name},

Jeg tar kontakt for å informere om KiReklame.no – en norsk hub dedikert utelukkende til AI-først bedrifter.

Vi ser at dere gjør spennende arbeid innen AI-feltet i Norge. Besøkende på vår side leter spesifikt etter de aktørene som er i front på nettopp AI-teknologi og implementering.

Vår kuraterte hovedliste er reservert for bedrifter som jobber direkte med kommersiell og kreativ AI-produksjon (bilde, video og visuell kommunikasjon). For alle andre AI-først bedrifter i Norge tilbyr vi nå dedikerte annonseplasser.

Dette er en fin mulighet til å bli synlig for et publikum som allerede er modne for og aktivt leter etter AI-kompetanse.

Dette er kun ment som en kort introduksjon av plattformen som en mulig ressurs for deres synlighet. Ta gjerne en titt på siden, og dersom dere skulle ha spørsmål rundt annonseplassering eller ønsker å høre mer om trafikken på siden, er det bare å svare på denne e-posten.

Med vennlig hilsen,
Lars Cuzner, CEO
Cuz Media AS / KiReklame.no`,
};

function normalizeCompanyName(input: string): string {
  const clean = input
    .replace(/https?:\/\//i, "")
    .replace(/www\./i, "")
    .split(/[\/\?]/)[0]
    .split(":")[0]
    .replace(/\.[a-z]{2,}(\.[a-z]{2,})?$/i, "")
    .replace(/[-_]+/g, " ")
    .trim();
  if (!clean) return "";
  return clean.replace(/\b[a-z]/g, (c) => c.toUpperCase());
}

function extractEmail(text: string): string {
  const match = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  return match ? match[0] : "";
}

function extractUrl(text: string): string {
  const httpMatch = text.match(/https?:\/\/[^\s"')]+/i);
  if (httpMatch) return httpMatch[0].replace(/[),.]+$/g, "");
  const bareMatch = text.match(/\b([A-Z0-9-]+\.)+[A-Z]{2,}\b/i);
  return bareMatch ? `https://${bareMatch[0]}` : "";
}

function extractCompanyInfoLocal(rawText: string): CompanyData {
  const email = extractEmail(rawText);
  const url = extractUrl(rawText);
  const nameFromEmail = email ? email.split("@")[1] : "";
  const name = normalizeCompanyName(url || nameFromEmail);
  return {
    name,
    email,
    url,
  };
}

export default function OutreachApp() {
  const [activeMode, setActiveMode] = useState<OutreachMode>("CURATED");
  const [market, setMarket] = useState<MarketType>("NORWEGIAN");
  const [company, setCompany] = useState<CompanyData>({
    name: "",
    email: "",
    url: "",
    slug: "",
    coverImage: "",
  });
  const [email, setEmail] = useState<EmailState>({
    subject: "",
    body: "",
  });
  const [isExtracting, setIsExtracting] = useState(false);
  const [snippet, setSnippet] = useState("");
  const [companies, setCompanies] = useState<CompanyRecord[]>([]);
  const [companiesLoading, setCompaniesLoading] = useState(false);
  const [companiesError, setCompaniesError] = useState<string | null>(null);
  const [adLeads, setAdLeads] = useState<AdLeadRecord[]>([]);
  const [adLeadsLoading, setAdLeadsLoading] = useState(false);
  const [adLeadsError, setAdLeadsError] = useState<string | null>(null);
  const [companySearch, setCompanySearch] = useState("");
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>("");
  const [contactUrls, setContactUrls] = useState<string[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [sendStatus, setSendStatus] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<"TEXT" | "HTML">("HTML");
  const resendReplyToLabel = (
    process.env.NEXT_PUBLIC_RESEND_REPLY_TO || ""
  ).trim();
  const [sentEmails, setSentEmails] = useState<Set<string>>(new Set());
  const [sentEmailsLoading, setSentEmailsLoading] = useState(false);
  const [sentEmailsError, setSentEmailsError] = useState<string | null>(null);

  const supabase = useMemo(() => supabaseBrowser(), []);
  const hasSupabaseConfig = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const slugify = (value: string) => {
    return value
      .toLowerCase()
      .replace(/https?:\/\/(www\.)?/i, "")
      .replace(/\.[a-z]{2,}(\.[a-z]{2,})?$/i, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const buildListingUrl = (input: string) => {
    const slug = slugify(input);
    if (!slug) return "";
    return `https://kireklame.no/selskap/${slug}`;
  };

  const escapeHtml = (value: string) => {
    return value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#39;");
  };

  const buildEmailHtml = (
    rawText: string,
    coverImageUrl: string,
    listingUrl: string
  ) => {
    const safeText = escapeHtml(rawText.trim());
    const paragraphs = safeText
      .split(/\n{2,}/)
      .map((chunk) => chunk.replace(/\n/g, "<br />"));
    const bodyHtml = paragraphs
      .map((p) => `<p style="margin:0 0 16px 0;">${p}</p>`)
      .join("");
    const safeName = escapeHtml(company.name || "KiReklame");
    const safeListing = listingUrl ? escapeHtml(listingUrl) : "";
    const hero = coverImageUrl
      ? `<tr>
          <td style="padding:0;">
            <img src="${escapeHtml(
              coverImageUrl
            )}" alt="${safeName} cover image" width="600" style="display:block;width:100%;max-width:600px;height:auto;border-radius:16px 16px 0 0;" />
          </td>
        </tr>`
      : "";

    const cta = safeListing
      ? `<tr>
          <td style="padding:0 40px 36px 40px;">
            <a href="${safeListing}" style="display:inline-block;background:#0f172a;color:#ffffff;text-decoration:none;font-weight:700;padding:14px 20px;border-radius:999px;">Se oppføringen</a>
          </td>
        </tr>`
      : "";

    return `
<!DOCTYPE html>
<html lang="no">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${safeName}</title>
  </head>
  <body style="margin:0;padding:0;background:#f5f5f4;font-family: 'Georgia', 'Times New Roman', serif;color:#0f172a;">
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:#f5f5f4;padding:24px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" cellpadding="0" cellspacing="0" width="600" style="width:100%;max-width:600px;background:#ffffff;border-radius:18px;overflow:hidden;border:1px solid #e2e8f0;">
            ${hero}
            <tr>
              <td style="padding:36px 40px 8px 40px;">
                <p style="margin:0 0 10px 0;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#64748b;font-weight:700;">KiReklame Outreach</p>
                <h1 style="margin:0 0 16px 0;font-size:28px;line-height:1.2;color:#0f172a;">${safeName}</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:0 40px 24px 40px;font-size:16px;line-height:1.7;color:#0f172a;">
                ${bodyHtml}
              </td>
            </tr>
            ${cta}
          </table>
          <div style="max-width:600px;margin-top:16px;color:#94a3b8;font-size:12px;text-align:center;">
            KiReklame.no · Oslo, Norge
          </div>
        </td>
      </tr>
    </table>
  </body>
</html>
    `.trim();
  };

  const listingUrl = useMemo(
    () => buildListingUrl(company.slug || company.name),
    [company.name, company.slug]
  );

  const emailHtml = useMemo(
    () => buildEmailHtml(email.body, company.coverImage || "", listingUrl),
    [email.body, company.coverImage, listingUrl, company.name]
  );

  useEffect(() => {
    const nextListing = buildListingUrl(company.slug || company.name);
    if (activeMode === "CURATED") {
      const template = TEMPLATES[market];
      setEmail({
        subject: template.subject,
        body: template.body(company.name || "[Bedriftsnavn]", nextListing),
      });
    } else {
      setEmail({
        subject: AD_SALES_TEMPLATE.subject,
        body: AD_SALES_TEMPLATE.body(company.name || "[Bedriftsnavn]"),
      });
    }
  }, [activeMode, market, company.name, company.slug]);

  useEffect(() => {
    if (!hasSupabaseConfig) {
      setCompanies([]);
      setCompaniesError("Supabase er ikke konfigurert.");
      return;
    }

    const marketCode = market === "NORWEGIAN" ? "no" : "intl";
    setCompaniesLoading(true);
    setCompaniesError(null);

    let active = true;
    (async () => {
      try {
        const { data, error } = await supabase
          .from("companies")
          .select("id,name,email,website,slug,market,cover_image")
          .eq("is_active", true)
          .is("deleted_at", null)
          .eq("market", marketCode)
          .order("name", { ascending: true });

        if (!active) return;
        if (error) {
          setCompaniesError(error.message);
          setCompanies([]);
        } else {
          setCompanies((data || []) as CompanyRecord[]);
        }
      } finally {
        if (active) setCompaniesLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [market, hasSupabaseConfig, supabase]);

  useEffect(() => {
    if (!hasSupabaseConfig) {
      setAdLeads([]);
      setAdLeadsError("Supabase er ikke konfigurert.");
      return;
    }

    if (activeMode !== "AD_SALES") return;

    setAdLeadsLoading(true);
    setAdLeadsError(null);

    let active = true;
    (async () => {
      try {
        const { data, error } = await supabase
          .from("ad_leads")
          .select("id,name,email,website,source_url,market,status")
          .order("name", { ascending: true });

        if (!active) return;
        if (error) {
          setAdLeadsError(error.message);
          setAdLeads([]);
        } else {
          setAdLeads((data || []) as AdLeadRecord[]);
        }
      } finally {
        if (active) setAdLeadsLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [activeMode, hasSupabaseConfig, supabase]);

  useEffect(() => {
    if (!hasSupabaseConfig) {
      setSentEmails(new Set());
      setSentEmailsError("Supabase er ikke konfigurert.");
      return;
    }

    setSentEmailsLoading(true);
    setSentEmailsError(null);

    let active = true;
    (async () => {
      try {
        const { data, error } = await supabase
          .from("outreach_sends")
          .select("recipient_email");

        if (!active) return;
        if (error) {
          setSentEmailsError(error.message);
          setSentEmails(new Set());
        } else {
          const next = new Set<string>();
          (data || []).forEach((row) => {
            if (row.recipient_email) {
              next.add(String(row.recipient_email).toLowerCase());
            }
          });
          setSentEmails(next);
        }
      } finally {
        if (active) setSentEmailsLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [hasSupabaseConfig, supabase]);

  useEffect(() => {
    if (!selectedCompanyId) return;
    const exists =
      activeMode === "AD_SALES"
        ? adLeads.some((c) => c.id === selectedCompanyId)
        : companies.some((c) => c.id === selectedCompanyId);
    if (!exists) {
      setSelectedCompanyId("");
    }
  }, [activeMode, adLeads, companies, selectedCompanyId]);

  const filteredCompanies = useMemo(() => {
    const source = activeMode === "AD_SALES" ? adLeads : companies;
    if (!companySearch.trim()) return source;
    const q = companySearch.trim().toLowerCase();
    return source.filter((c) =>
      [c.name, c.email || "", c.website || ""].some((v) =>
        v.toLowerCase().includes(q)
      )
    );
  }, [activeMode, adLeads, companies, companySearch]);

  const isAlreadySent = useMemo(() => {
    const emailValue = (company.email || "").trim().toLowerCase();
    if (!emailValue) return false;
    return sentEmails.has(emailValue);
  }, [company.email, sentEmails]);

  const handleSelectCompany = (id: string) => {
    setSelectedCompanyId(id);
    const selected =
      activeMode === "AD_SALES"
        ? adLeads.find((c) => c.id === id)
        : companies.find((c) => c.id === id);
    if (!selected) return;
    setCompany({
      name: selected.name || "",
      email: selected.email || "",
      url: selected.website || "",
      slug: activeMode === "AD_SALES" ? "" : (selected as CompanyRecord).slug || "",
      coverImage:
        activeMode === "AD_SALES"
          ? ""
          : (selected as CompanyRecord).cover_image || "",
    });
    setContactUrls([]);
  };

  const handleEmailChange = (field: keyof EmailState, value: string) => {
    setEmail((prev) => ({ ...prev, [field]: value }));
  };

  const handleCompanyChange = (field: keyof CompanyData, value: string) => {
    setCompany((prev) => ({ ...prev, [field]: value }));
  };

  const handleExtract = async () => {
    if (!snippet.trim()) return;
    setIsExtracting(true);
    const data = extractCompanyInfoLocal(snippet);
    if (data) {
      setCompany((prev) => ({
        ...prev,
        name: data.name,
        email: data.email,
        url: data.url,
      }));
      setSnippet("");
    }
    setIsExtracting(false);
  };

  const handleCopyHtml = async () => {
    setSendStatus(null);
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(emailHtml);
      } else {
        const temp = document.createElement("textarea");
        temp.value = emailHtml;
        document.body.appendChild(temp);
        temp.select();
        document.execCommand("copy");
        document.body.removeChild(temp);
      }
      setSendStatus("HTML kopiert til utklippstavle.");
    } catch (error) {
      console.error("Copy failed", error);
      setSendStatus("Kunne ikke kopiere HTML.");
    }
  };

  const handleSendResend = async () => {
    if (!company.email) {
      setSendStatus("Mangler mottaker-e-post.");
      return;
    }
    if (!hasSupabaseConfig) {
      setSendStatus("Supabase er ikke konfigurert.");
      return;
    }

    setIsSending(true);
    setSendStatus(null);

    try {
      const { data, error } = await supabase.functions.invoke(
        "send-outreach-email",
        {
          body: {
            entityType: activeMode,
            entityId: selectedCompanyId || null,
            to: company.email,
            subject: email.subject,
            html: emailHtml,
            text: email.body,
            companyName: company.name || "",
          },
        }
      );
      if (error) {
        const status = (error as { context?: { status?: number } }).context
          ?.status;
        if (status === 409 || error.message.includes("409")) {
          setSendStatus("Allerede sendt til denne mottakeren.");
          return;
        }
        throw new Error(error.message);
      }
      if (data?.error) {
        throw new Error(data.error);
      }
      if (company.email) {
        setSentEmails((prev) => {
          const next = new Set(prev);
          next.add(company.email.toLowerCase());
          return next;
        });
      }
      setSendStatus("E-post sendt via Resend.");
    } catch (error) {
      console.error("Resend send failed", error);
      const message = error instanceof Error ? error.message : "Ukjent feil";
      setSendStatus(`Kunne ikke sende: ${message}`);
    } finally {
      setIsSending(false);
    }
  };

  const handleMailTo = () => {
    const mailtoUrl = `mailto:${company.email}?subject=${encodeURIComponent(
      email.subject
    )}&body=${encodeURIComponent(email.body)}`;
    window.location.href = mailtoUrl;
  };

  const buildContactUrls = (website: string) => {
    if (!website) return [];
    const base = website.startsWith("http") ? website : `https://${website}`;
    const trimmed = base.replace(/\/+$/g, "");
    return [
      `${trimmed}/kontakt`,
      `${trimmed}/contact`,
      `${trimmed}/kontakt-oss`,
      `${trimmed}/contact-us`,
      `${trimmed}/support`,
      `${trimmed}/help`,
      `${trimmed}/om-oss`,
      `${trimmed}/about`,
      trimmed,
    ];
  };

  const handleOpenContactForm = () => {
    const urls = buildContactUrls(company.url);
    const first = urls[0];
    if (first) {
      window.open(first, "_blank", "noopener,noreferrer");
    }
    setContactUrls(urls);
  };

  return (
    <div className="min-h-screen text-slate-900 flex flex-col items-center py-6 px-4">
      <div className="max-w-6xl w-full">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">
              Outreach
            </h1>
            <p className="text-sm text-[rgb(var(--muted))]">
              Send unike, stiliserte e-poster direkte fra admin.
            </p>
          </div>
          <a className="underline text-sm" href="/admin">
            ← Tilbake til admin
          </a>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-10">
          <nav className="inline-flex bg-white p-1 rounded-2xl shadow-sm border border-slate-200">
            <button
              onClick={() => setActiveMode("CURATED")}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeMode === "CURATED"
                  ? "bg-indigo-600 text-white shadow-lg"
                  : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
                />
              </svg>
              Kreativ Outreach
            </button>
            <button
              onClick={() => setActiveMode("AD_SALES")}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeMode === "AD_SALES"
                  ? "bg-indigo-600 text-white shadow-lg"
                  : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Annonsesalg
            </button>
          </nav>
        </div>

        <header className="mb-8 text-center">
          <h2 className="text-4xl font-extrabold text-indigo-950 mb-3 tracking-tight">
            {activeMode === "CURATED"
              ? "Outreach: Kreativ KI"
              : "Outreach: Annonsepartnere"}
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto">
            {activeMode === "CURATED"
              ? "Håndter kommunikasjon med kuraterte video- og bildebyråer på KiReklame.no."
              : "Informer generelle AI-bedrifter om muligheten for annonseplassering hos KiReklame."}
          </p>
        </header>

        {/* Control Panel */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-10">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1 space-y-8">
              <section>
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                  Velg Bedrift
                </h2>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={companySearch}
                    onChange={(e) => setCompanySearch(e.target.value)}
                    placeholder="Søk etter navn, e-post eller URL..."
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all"
                  />
                  <select
                    value={selectedCompanyId}
                    onChange={(e) => handleSelectCompany(e.target.value)}
                    disabled={
                      !hasSupabaseConfig ||
                      (activeMode === "AD_SALES"
                        ? adLeadsLoading
                        : companiesLoading)
                    }
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  >
                    <option value="">
                      {activeMode === "AD_SALES"
                        ? adLeadsLoading
                          ? "Laster bedrifter..."
                          : !hasSupabaseConfig
                          ? "Supabase ikke konfigurert"
                          : `Velg bedrift (${filteredCompanies.length})`
                        : companiesLoading
                        ? "Laster bedrifter..."
                        : !hasSupabaseConfig
                        ? "Supabase ikke konfigurert"
                        : `Velg bedrift (${filteredCompanies.length})`}
                    </option>
                    {filteredCompanies.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                        {c.email && sentEmails.has(c.email.toLowerCase())
                          ? " • Sent"
                          : ""}
                      </option>
                    ))}
                  </select>
                  {activeMode === "AD_SALES"
                    ? adLeadsError && (
                        <p className="text-xs text-red-600">{adLeadsError}</p>
                      )
                    : companiesError && (
                        <p className="text-xs text-red-600">
                          {companiesError}
                        </p>
                      )}
                </div>
              </section>
              {activeMode === "CURATED" && (
                <section>
                  <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                    Marked & Språk
                  </h2>
                  <div className="flex bg-slate-100 p-1 rounded-xl">
                    <button
                      onClick={() => setMarket("NORWEGIAN")}
                      className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all ${
                        market === "NORWEGIAN"
                          ? "bg-white shadow-sm text-indigo-600"
                          : "text-slate-500 hover:text-slate-700"
                      }`}
                    >
                      Norske Bedrifter
                    </button>
                    <button
                      onClick={() => setMarket("INTERNATIONAL")}
                      className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all ${
                        market === "INTERNATIONAL"
                          ? "bg-white shadow-sm text-indigo-600"
                          : "text-slate-500 hover:text-slate-700"
                      }`}
                    >
                      International
                    </button>
                  </div>
                </section>
              )}

              <section className="space-y-5">
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Mottaker Detaljer
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="col-span-full">
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5 ml-1">
                      Bedriftsnavn
                    </label>
                    <input
                      type="text"
                      value={company.name}
                      onChange={(e) =>
                        handleCompanyChange("name", e.target.value)
                      }
                      placeholder="f.eks. OpenAI Norge"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5 ml-1">
                      E-postadresse
                    </label>
                    <input
                      type="email"
                      value={company.email}
                      onChange={(e) =>
                        handleCompanyChange("email", e.target.value)
                      }
                      placeholder="kontakt@domene.no"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5 ml-1">
                      Nettside / URL
                    </label>
                    <input
                      type="text"
                      value={company.url}
                      onChange={(e) =>
                        handleCompanyChange("url", e.target.value)
                      }
                      placeholder="https://..."
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all"
                    />
                  </div>
                  <div className="col-span-full">
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5 ml-1">
                      Cover image URL
                    </label>
                    <input
                      type="text"
                      value={company.coverImage || ""}
                      onChange={(e) =>
                        handleCompanyChange("coverImage", e.target.value)
                      }
                      placeholder="https://.../cover.jpg"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all"
                    />
                  </div>
                </div>
              </section>
            </div>

            <div className="w-full lg:w-96 bg-indigo-50/50 rounded-2xl p-6 border border-indigo-100 flex flex-col">
              <h2 className="text-sm font-bold text-indigo-900 mb-3 flex items-center gap-2">
                <span className="text-xl">✨</span> AI Snippet Hjelper
              </h2>
              <p className="text-xs text-indigo-700/70 mb-5 leading-relaxed">
                Lim inn tekst for å hente e-post og URL automatisk.
              </p>
              <textarea
                value={snippet}
                onChange={(e) => setSnippet(e.target.value)}
                placeholder="Lim inn tekst her..."
                className="w-full flex-1 min-h-[140px] px-4 py-3 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none resize-none mb-4 shadow-inner"
              />
              <button
                onClick={handleExtract}
                disabled={isExtracting || !snippet}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-xl text-sm font-bold transition-all shadow-md flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                {isExtracting ? "Analyserer…" : "Hent Bedriftsinfo (lokalt)"}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
          <div className="flex flex-col space-y-6">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 pl-1">
              <svg
                className="w-5 h-5 text-indigo-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Tilpass Melding
            </h2>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 flex-1 flex flex-col space-y-6">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">
                  E-post Emne
                </label>
                <input
                  type="text"
                  value={email.subject}
                  onChange={(e) => handleEmailChange("subject", e.target.value)}
                  className="w-full px-5 py-3 border border-slate-100 bg-slate-50/50 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none font-medium transition-all"
                />
              </div>
              <div className="flex-1 flex flex-col">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">
                  Meldingstekst
                </label>
                <textarea
                  value={email.body}
                  onChange={(e) => handleEmailChange("body", e.target.value)}
                  className="w-full flex-1 min-h-[450px] px-5 py-4 border border-slate-100 bg-slate-50/50 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none resize-none font-mono text-sm leading-relaxed transition-all"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col space-y-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 pl-1">
                <svg
                  className="w-5 h-5 text-indigo-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                Forhåndsvisning
              </h2>
              <div className="flex bg-slate-100 p-1 rounded-xl">
                <button
                  onClick={() => setPreviewMode("HTML")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    previewMode === "HTML"
                      ? "bg-white shadow-sm text-indigo-600"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  HTML
                </button>
                <button
                  onClick={() => setPreviewMode("TEXT")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    previewMode === "TEXT"
                      ? "bg-white shadow-sm text-indigo-600"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  Tekst
                </button>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col h-full ring-4 ring-slate-100/50">
              <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                <div className="flex gap-2">
                  <div className="w-3.5 h-3.5 rounded-full bg-slate-200"></div>
                  <div className="w-3.5 h-3.5 rounded-full bg-slate-200"></div>
                  <div className="w-3.5 h-3.5 rounded-full bg-slate-200"></div>
                </div>
                <div className="bg-white border border-slate-200 rounded-md px-10 py-0.5 text-[10px] text-slate-400 font-medium">
                  {company.name || "Ny Melding"}
                </div>
                <div className="w-10"></div>
              </div>

              <div className="p-8 flex-1 overflow-auto bg-white custom-scrollbar">
                <div className="mb-6 pb-6 border-b border-slate-100 space-y-2">
                  <p className="text-sm text-slate-500">
                    <span className="font-bold text-slate-800 inline-block w-12">
                      Til:
                    </span>{" "}
                    <span
                      className={
                        company.email
                          ? "text-indigo-600"
                          : "text-rose-400 italic"
                      }
                    >
                      {company.email || "mottaker@domene.no"}
                    </span>
                  </p>
                  <p className="text-sm text-slate-500">
                    <span className="font-bold text-slate-800 inline-block w-12">
                      Emne:
                    </span>{" "}
                    <span className="text-slate-700">{email.subject}</span>
                  </p>
                </div>
                {previewMode === "HTML" ? (
                  <iframe
                    title="HTML Preview"
                    srcDoc={emailHtml}
                    className="w-full h-[520px] border border-slate-200 rounded-xl"
                  />
                ) : (
                  <div className="whitespace-pre-wrap text-sm text-slate-700 leading-relaxed font-sans">
                    {email.body}
                  </div>
                )}
              </div>

              <div className="p-8 bg-slate-50 border-t border-slate-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                  <button
                    onClick={handleSendResend}
                    disabled={
                      !company.email ||
                      !hasSupabaseConfig ||
                      isSending ||
                      isAlreadySent
                    }
                    className={`w-full py-4 flex items-center justify-center gap-3 rounded-2xl text-base font-bold transition-all shadow-xl active:scale-[0.97] ${
                      company.email &&
                      hasSupabaseConfig &&
                      !isSending &&
                      !isAlreadySent
                        ? "bg-slate-900 hover:bg-slate-950 text-white transform hover:-translate-y-1"
                        : "bg-slate-300 text-slate-500 cursor-not-allowed shadow-none"
                    }`}
                  >
                    {isSending ? "Sender…" : "Send via Resend"}
                  </button>
                  <button
                    onClick={handleCopyHtml}
                    className="w-full py-4 flex items-center justify-center gap-3 rounded-2xl text-base font-bold transition-all shadow-lg active:scale-[0.97] bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
                  >
                    Kopier HTML
                  </button>
                </div>
                {sendStatus && (
                  <p className="text-center text-xs text-slate-600 mb-4">
                    {sendStatus}
                  </p>
                )}
                {isAlreadySent && (
                  <p className="text-center text-xs text-amber-600 mb-4">
                    Allerede sendt til denne e-posten.
                  </p>
                )}
                {resendReplyToLabel && (
                  <p className="text-center text-xs text-slate-500 mb-4">
                    Svar går til:{" "}
                    <span className="font-semibold">{resendReplyToLabel}</span>
                  </p>
                )}
                {!hasSupabaseConfig && (
                  <p className="text-center text-xs text-amber-600 mb-4">
                    Supabase er ikke konfigurert. Sett{" "}
                    <span className="font-semibold">
                      NEXT_PUBLIC_SUPABASE_URL
                    </span>{" "}
                    og{" "}
                    <span className="font-semibold">
                      NEXT_PUBLIC_SUPABASE_ANON_KEY
                    </span>{" "}
                    i <span className="font-semibold">.env.local</span>.
                  </p>
                )}
                {sentEmailsError && (
                  <p className="text-center text-xs text-amber-600 mb-4">
                    Kunne ikke hente sendte e-poster: {sentEmailsError}
                  </p>
                )}
                {sentEmailsLoading && (
                  <p className="text-center text-xs text-slate-500 mb-4">
                    Henter sendte e-poster…
                  </p>
                )}
                <button
                  onClick={company.email ? handleMailTo : handleOpenContactForm}
                  disabled={company.email ? false : !company.url}
                  className={`w-full py-5 flex items-center justify-center gap-3 rounded-2xl text-xl font-bold transition-all shadow-xl active:scale-[0.97] ${
                    company.email || company.url
                      ? "bg-indigo-600 hover:bg-indigo-700 text-white transform hover:-translate-y-1"
                      : "bg-slate-300 text-slate-500 cursor-not-allowed shadow-none"
                  }`}
                >
                  <svg
                    className="w-7 h-7"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  {company.email ? "Send i din e-post" : "Åpne kontaktside"}
                </button>
                {!company.email && company.url && contactUrls.length > 1 && (
                  <div className="mt-3 text-xs text-slate-500 space-y-1">
                    <div className="font-semibold text-slate-600">
                      Andre kontaktlenker:
                    </div>
                    {contactUrls.slice(1).map((url) => (
                      <a
                        key={url}
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        className="block text-indigo-600 hover:text-indigo-700 break-all"
                      >
                        {url}
                      </a>
                    ))}
                  </div>
                )}
                {!company.email && !company.url && (
                  <p className="text-center text-xs text-rose-500 mt-3 font-semibold flex items-center justify-center gap-1.5 animate-pulse">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                    Fyll ut nettside for å aktivere knappen
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <footer className="mt-20 text-center text-slate-400 text-sm border-t border-slate-200 pt-10 pb-16">
          <div className="flex items-center justify-center gap-6 mb-4 grayscale opacity-60">
            <img
              src="https://kireklame.no/wp-content/uploads/2024/05/kireklame-logo-negativ-e1715610842426.png"
              className="h-6"
              alt="KiReklame"
            />
          </div>
          <p className="font-medium text-slate-500">
            © {new Date().getFullYear()} KiReklame Outreach System
          </p>
          <p className="mt-1">
            Ett verktøy for profesjonell KI-formidling i det norske markedet.
          </p>
        </footer>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
}
