// src/app/admin/moderate/page.tsx

import Link from "next/link";
import { aiLevelLabel, priceLevelLabel } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { requireUser } from "@/lib/supabase/server";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Moderering – KiReklame",
  description: "Godkjenn og publiser innsendinger.",
};

type SubmissionRow = {
  id: string;
  created_at: string;
  status: string | null;

  company_name: string | null;
  website: string | null;
  location: string | null;

  is_complete: boolean | null;
  phone: string | null;
  long_description: string | null;
  cover_image: string | null;
  video_url: string | null;
  links: any | null;
  user_id: string | null;

  company_type: string | null;
  org_form: string | null;
  ai_level: number | null;
  price_level: number | null;

  tags: string | null;
  notes: string | null;
  contact_email: string | null;

  published_company_id: string | null;
  published_company: { slug: string } | null;
};

function fmtDate(iso: string) {
  try {
    return new Date(iso).toLocaleString("nb-NO", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

function slugify(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[æ]/g, "ae")
    .replace(/[ø]/g, "o")
    .replace(/[å]/g, "a")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function parseTags(tags: string | null) {
  if (!tags) return [];
  return tags
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean)
    .slice(0, 12);
}

function isHttpUrl(x: any) {
  const s = String(x ?? "").trim();
  return /^https?:\/\//i.test(s);
}

// Støtter: string[], [{url,label}], {urls:[...]} eller hva som helst – vi normaliserer til {url,label}[]
function normalizeLinks(raw: any): Array<{ url: string; label?: string }> {
  if (!raw) return [];

  // Hvis det ligger som string i DB (noen ganger skjer det)
  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw);
      return normalizeLinks(parsed);
    } catch {
      // fallback: prøv å splitte på whitespace/komma
      const parts = raw
        .split(/[\s,]+/g)
        .map((s) => s.trim())
        .filter(Boolean);
      return parts
        .filter((u) => isHttpUrl(u))
        .slice(0, 12)
        .map((u) => ({ url: u }));
    }
  }

  // Array: ["https://..."] eller [{url,label}]
  if (Array.isArray(raw)) {
    const items = raw
      .map((x) => {
        if (typeof x === "string" && isHttpUrl(x)) return { url: x };
        if (x && typeof x === "object" && isHttpUrl((x as any).url)) {
          return {
            url: String((x as any).url),
            label: (x as any).label ? String((x as any).label) : undefined,
          };
        }
        return null;
      })
      .filter(Boolean) as Array<{ url: string; label?: string }>;

    return items.slice(0, 12);
  }

  // Object: { urls: [...] }
  if (raw && typeof raw === "object") {
    const urls = (raw as any).urls;
    if (Array.isArray(urls)) return normalizeLinks(urls);
  }

  return [];
}

type AdminDB = ReturnType<typeof supabaseAdmin>;

async function ensureLocation(db: AdminDB, locationNameRaw: string) {
  const name = String(locationNameRaw ?? "").trim();
  if (!name) throw new Error("Location-navn er tomt");

  const slug = slugify(name);

  const { data: existing, error: exErr } = await db
    .from("locations")
    .select("id,slug,name")
    .eq("slug", slug)
    .maybeSingle();

  if (exErr) throw new Error(`Kunne ikke sjekke location: ${exErr.message}`);
  if (existing?.id) return existing;

  const { data: created, error } = await db
    .from("locations")
    .insert({ name, slug, region: null })
    .select("id,slug,name")
    .maybeSingle();

  if (error) throw new Error(`Kunne ikke opprette location: ${error.message}`);
  if (!created) throw new Error("Kunne ikke opprette location (ukjent feil)");
  return created;
}

async function upsertTagsAndJoin(db: AdminDB, companyId: string, tags: string[]) {
  if (tags.length === 0) return;

  const tagRows = tags.map((name) => ({
    name,
    slug: slugify(name),
    kind: "general",
  }));

  const { data: upserted, error: tagErr } = await db
    .from("tags")
    .upsert(tagRows, { onConflict: "slug" })
    .select("id,slug");

  if (tagErr) throw new Error(`Kunne ikke upsert tags: ${tagErr.message}`);

  const joins = (upserted ?? []).map((t: any) => ({
    company_id: companyId,
    tag_id: t.id,
  }));

  if (joins.length) {
    const { error: joinErr } = await db
      .from("company_tags")
      .upsert(joins, { onConflict: "company_id,tag_id" });

    if (joinErr) throw new Error(`Kunne ikke koble tags: ${joinErr.message}`);
  }
}

async function approveAndPublish(formData: FormData) {
  "use server";

  const submissionId = String(formData.get("id") ?? "");
  if (!submissionId) throw new Error("Mangler id");

  const db = supabaseAdmin();

  const { data: s, error: sErr } = await db
    .from("submissions")
    .select("*")
    .eq("id", submissionId)
    .maybeSingle();

  if (sErr) throw new Error(`Kunne ikke hente submission: ${sErr.message}`);
  if (!s) throw new Error("Fant ikke submission");
  if (!s.company_name) throw new Error("Submission mangler company_name");

  // Idempotent: allerede publisert
  if (s.published_company_id) {
    revalidatePath("/admin/moderate");
    revalidatePath("/selskaper");
    return;
  }

  // 1) location (valgfritt)
  let locationId: string | null = null;
  const locationName = String((s as any).location ?? "").trim();
  if (locationName) {
    const loc = await ensureLocation(db, locationName);
    locationId = loc.id;
  }

  // 2) unik slug
  const baseSlug = slugify(String(s.company_name));
  let slug = baseSlug || `company-${submissionId.slice(0, 8)}`;

  const { data: existingCompany, error: exCoErr } = await db
    .from("companies")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();

  if (exCoErr) throw new Error(`Kunne ikke sjekke company slug: ${exCoErr.message}`);
  if (existingCompany?.id) slug = `${slug}-${submissionId.slice(0, 6)}`;

  // 3) insert company
  const insertPayload: any = {
    name: String(s.company_name),
    slug,
    short_description: s.notes ? String(s.notes).slice(0, 160) : null,
    description: s.notes ? String(s.notes) : null,
    ai_level: s.ai_level ?? 3,
    price_level: s.price_level ?? 2,
    company_type: s.company_type ?? "byrå",
    website: s.website ?? null,

    // fallback eierskap via epost
    email: s.contact_email ?? null,

    cover_image: "/covers/cover-1.jpg",
    location_id: locationId,
    is_verified: false,
    is_placeholder: false,
  };

  const { data: company, error: cErr } = await db
    .from("companies")
    .insert(insertPayload)
    .select("id,slug")
    .maybeSingle();

  if (cErr) throw new Error(`Kunne ikke opprette company: ${cErr.message}`);
  if (!company) throw new Error("Kunne ikke opprette company (ukjent feil)");

  // 4) tags + join
  const tags = parseTags(s.tags ?? null);
  await upsertTagsAndJoin(db, company.id, tags);

  // 5) website link (valgfritt)
  if (s.website) {
    const { error: linkErr } = await db.from("links").insert({
      company_id: company.id,
      kind: "website",
      label: "Nettside",
      url: s.website,
    });
    if (linkErr) throw new Error(`Kunne ikke opprette link: ${linkErr.message}`);
  }

  // 6) oppdater submission
  const { error: uErr } = await db
    .from("submissions")
    .update({ status: "approved", published_company_id: company.id })
    .eq("id", submissionId);

  if (uErr) throw new Error(`Kunne ikke oppdatere submission: ${uErr.message}`);

  // 7) Auto-approve claim (best effort)
  try {
    const submitterUserId = ((s as any).user_id as string | null) ?? null;

    if (submitterUserId) {
      const { error: claimErr } = await db
        .from("claims")
        .upsert(
          {
            company_id: company.id,
            user_id: submitterUserId,
            status: "approved",
            message: "Auto-approved ved publisering",
          },
          { onConflict: "company_id,user_id" }
        );

      if (claimErr) {
        console.error("Auto-approve claim feilet:", claimErr.message);
      }
    } else {
      console.warn(
        "Submission mangler user_id – hopper over auto-claim. Bruker email-match i companies.email."
      );
    }
  } catch (e) {
    console.error("Auto-approve claim crashed (ignored):", e);
  }

  // 8) E-post til innsender om publisering + "sett passord" (best effort)
  // Viktig: Vi gjør ALL auth først NÅ (ved godkjenning), ikke ved submit.
  try {
    const to = String(s.contact_email ?? "").trim();

    if (!to) {
      console.warn("PUBLISH MAIL SKIP: contact_email mangler", submissionId);
    } else if (!process.env.RESEND_API_KEY) {
      console.warn("PUBLISH MAIL SKIP: RESEND_API_KEY mangler");
    } else {
      const { notifySubmitter } = await import("@/lib/email/notifySubmitter");

      const site = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/+$/, "");
      const companyUrl = `${site}/selskap/${company.slug}`;

      // Når de klikker lenken: callback setter session og sender dem til reset-siden.
      const redirectTo = `${site}/auth/callback?type=recovery&next=${encodeURIComponent("/auth/set-password")}`;



      // ✅ 8A) Sørg for at user finnes og er "email_confirmed" (best effort)
      // Dette triggere IKKE supabase-mail.
      try {
        await db.auth.admin.createUser({
          email: to,
          email_confirm: true,
        });
      } catch {
        // ignore (user exists)
      }

      // ✅ 8B) Lag recovery-link (samme som "Glemt passord")
      let actionUrl = `${site}/auth?next=${encodeURIComponent("/auth/set-password")}`;


            // Brukeren har allerede valgt passord ved registrering.
      // Derfor skal publish-mail peke til vanlig innlogging /me (ikke recovery/set-password).
      actionUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/auth?next=/me`;


      await notifySubmitter({
        to,
        subject: "Bedriften din er godkjent og publisert – KiReklame",
        title: "Bedriften din er godkjent og publisert",
        lines: [
          "Takk for henvendelsen.",
          "Bedriften din er nå godkjent og publisert i KiReklame.",
          "",
          `Navn: ${String(s.company_name ?? "—")}`,
          `Nettside: ${String(s.website ?? "—")}`,
          `Sted: ${String((s as any).location ?? "—")}`,
          "",
"Neste steg: Logg inn for å redigere profilen din.",
"Du bruker e-post og passordet du valgte da du registrerte bedriften.",

        ],
        actionText: "Logg inn og rediger profilen",
        actionUrl,
      });

      console.log("PUBLISH MAIL OK", { to, submissionId, companyUrl });
    }
  } catch (e) {
    console.error("PUBLISH MAIL FAILED (ignored):", e);
  }

  revalidatePath("/admin/moderate");
  revalidatePath("/selskaper");
  revalidatePath(`/selskap/${company.slug}`);
}

async function rejectSubmission(formData: FormData) {
  "use server";

  const submissionId = String(formData.get("id") ?? "");
  if (!submissionId) throw new Error("Mangler id");

  const db = supabaseAdmin();

  // 1) Hent submission først
  const { data: s, error: sErr } = await db
    .from("submissions")
    .select("id, company_name, website, location, contact_email")
    .eq("id", submissionId)
    .maybeSingle();

  if (sErr) throw new Error(`Kunne ikke hente submission: ${sErr.message}`);
  if (!s) throw new Error("Fant ikke submission");

  // 2) Oppdater status → rejected
  const { error } = await db
    .from("submissions")
    .update({ status: "rejected" })
    .eq("id", submissionId);

  if (error) throw new Error(`Kunne ikke avvise submission: ${error.message}`);

  // 3) E-post til innsender (best effort)
  try {
    const to = String(s.contact_email ?? "").trim();
    if (process.env.RESEND_API_KEY && to) {
      const { notifySubmitter } = await import("@/lib/email/notifySubmitter");

      const site = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/+$/, "");

      await notifySubmitter({
        to,
        subject: "Innsending ikke godkjent – KiReklame",
        title: "Innsendingen din ble ikke godkjent",
        lines: [
          `Navn: ${s.company_name ?? "—"}`,
          `Nettside: ${s.website ?? "—"}`,
          `Sted: ${s.location ?? "—"}`,
          "",
          "Dette betyr ikke nødvendigvis at noe er feil –",
          "du kan sende inn på nytt med justeringer.",
        ],
        actionText: "Send inn på nytt",
        actionUrl: `${site}/submit`,
      });

      console.log("REJECT MAIL OK", { to, submissionId });
    }
  } catch (e) {
    console.error("notifySubmitter(rejected) failed:", e);
  }

  revalidatePath("/admin/moderate");
}

export default async function ModeratePage({
  searchParams,
}: {
  searchParams?: Promise<{ open?: string }>;
}) {
  const sp = (await searchParams) ?? {};
  const openId = sp.open ? String(sp.open) : "";

  const nextUrl = openId
    ? `/admin/moderate?open=${encodeURIComponent(openId)}`
    : "/admin/moderate";

  // 1) Må være innlogget – redirect i stedet for 500
  let user: any;
  try {
    user = await requireUser();
  } catch {
    redirect(`/auth?next=${encodeURIComponent(nextUrl)}`);
  }

  // 2) Må være admin (email whitelist)
  const allowed = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

  const email = (user.email ?? "").toLowerCase();

  if (!email || !allowed.includes(email)) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10">
        <h1 className="text-2xl font-semibold tracking-tight">Ikke tilgang</h1>
        <p className="mt-2 text-[rgb(var(--muted))]">
          Du er logget inn som <code className="px-1">{user.email ?? "ukjent"}</code>, men har ikke
          admin-tilgang.
        </p>
        <div className="mt-6 text-sm">
          <Link className="underline" href="/auth">
            Gå til innlogging
          </Link>
        </div>
      </div>
    );
  }

  // 3) OK → hent data med service role
  const db = supabaseAdmin();

  const { data, error } = await db
    .from("submissions")
    .select(
      `
      id,created_at,status,
      company_name,website,location,
      company_type,org_form,ai_level,price_level,
      tags,notes,contact_email,
      user_id,is_complete,phone,long_description,cover_image,video_url,links,
      published_company_id,
      published_company:companies!submissions_published_company_id_fkey ( slug )
    `
    )
    .order("created_at", { ascending: false })
    .limit(200);

  const rows: SubmissionRow[] = (data ?? []) as any;

  const sortedRows = [...rows].sort((a, b) => {
    const aDone = !!a.is_complete;
    const bDone = !!b.is_complete;

    // "mangler info" først
    if (aDone !== bDone) return aDone ? 1 : -1;

    // nyeste først
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Moderering</h1>
          <p className="mt-2 text-[rgb(var(--muted))]">
            Godkjenn publiserer til <code className="px-1">companies</code> + oppretter{" "}
            <code className="px-1">location</code> og <code className="px-1">tags</code> ved behov.
          </p>
        </div>

        <div className="text-sm">
          <Link className="underline" href="/admin/submit">
            Send inn (skjema)
          </Link>
        </div>
      </div>

      {error && (
        <div className="mt-6 rounded-2xl border border-red-300/40 bg-red-50 p-4 text-sm text-red-900 dark:bg-red-950/30 dark:text-red-200">
          Klarte ikke å hente submissions: {error.message}
        </div>
      )}

      <div className="mt-8 overflow-hidden rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))]">
        <div className="grid grid-cols-12 gap-3 border-b border-[rgb(var(--border))] px-4 py-3 text-xs font-semibold text-[rgb(var(--muted))]">
          <div className="col-span-3">Navn</div>
          <div className="col-span-2">Sted</div>
          <div className="col-span-2">Type / Org</div>
          <div className="col-span-2">AI / Pris</div>
          <div className="col-span-3">Dato / Status</div>
        </div>

        {sortedRows.length === 0 ? (
          <div className="px-4 py-10 text-sm text-[rgb(var(--muted))]">Ingen innsendte forslag ennå.</div>
        ) : (
          <div className="divide-y divide-[rgb(var(--border))]">
            {sortedRows.map((r) => {
              const links = normalizeLinks(r.links);
              const hasMedia = Boolean(
                String(r.cover_image ?? "").trim() || String(r.video_url ?? "").trim()
              );
              const hasLong = Boolean(String(r.long_description ?? "").trim());
              const hasPhone = Boolean(String(r.phone ?? "").trim());
              const hasLinks = links.length > 0;

              return (
                <details key={r.id} id={r.id} open={openId === r.id} className="group">
                  <summary className="grid cursor-pointer grid-cols-12 gap-3 px-4 py-4 text-sm hover:bg-black/5 dark:hover:bg-white/5">
                    <div className="col-span-3">
                      <div className="font-semibold">{r.company_name ?? "—"}</div>
                      <div className="text-xs text-[rgb(var(--muted))] truncate">
                        {r.website ? (
                          <a className="underline" href={r.website} target="_blank" rel="noreferrer">
                            {r.website}
                          </a>
                        ) : (
                          "—"
                        )}
                      </div>
                    </div>

                    <div className="col-span-2 text-[rgb(var(--muted))]">{r.location ?? "—"}</div>

                    <div className="col-span-2 text-[rgb(var(--muted))]">
                      {(r.company_type ?? "—") + " / " + (r.org_form ?? "—")}
                    </div>

                    <div className="col-span-2 text-[rgb(var(--muted))]">
                      {(r.ai_level == null ? "—" : aiLevelLabel(r.ai_level)) +
                        " / " +
                        (r.price_level == null ? "—" : priceLevelLabel(r.price_level))}
                    </div>

                    <div className="col-span-3 text-[rgb(var(--muted))] flex items-center justify-between gap-3">
                      <span>{fmtDate(r.created_at)}</span>

                      <div className="flex items-center gap-2">
                        <span className="rounded-full border border-[rgb(var(--border))] px-2 py-0.5 text-xs">
                          {r.status ?? "pending"}
                        </span>

                        <span
                          className={`rounded-full border px-2 py-0.5 text-xs ${
                            r.is_complete
                              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-200"
                              : "border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-200"
                          }`}
                          title={r.is_complete ? "Innsending er komplett" : "Innsending mangler info"}
                        >
                          {r.is_complete ? "komplett" : "mangler info"}
                        </span>
                      </div>
                    </div>
                  </summary>

                  <div className="px-4 pb-5 text-sm">
                    <div className="grid gap-3 md:grid-cols-2">
                      {/* DETALJER */}
                      <div className="md:col-span-2 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] p-3">
                        <div className="text-xs font-semibold text-[rgb(var(--muted))]">Detaljer</div>
                        <div className="mt-2 grid gap-1 text-sm">
                          <div>
                            <span className="text-[rgb(var(--muted))]">Sted:</span>{" "}
                            <span className="font-medium">{r.location ?? "—"}</span>
                          </div>
                          <div>
                            <span className="text-[rgb(var(--muted))]">Type:</span>{" "}
                            <span className="font-medium">{r.company_type ?? "—"}</span>
                            <span className="text-[rgb(var(--muted))]">{" "} / Org:</span>{" "}
                            <span className="font-medium">{r.org_form ?? "—"}</span>
                          </div>
                          <div>
                            <span className="text-[rgb(var(--muted))]">AI-nivå:</span>{" "}
                            <span className="font-medium">
                              {r.ai_level == null ? "—" : aiLevelLabel(r.ai_level)}
                            </span>
                            <span className="text-[rgb(var(--muted))]">{" "} / Prisnivå:</span>{" "}
                            <span className="font-medium">
                              {r.price_level == null ? "—" : priceLevelLabel(r.price_level)}
                            </span>
                          </div>
                          <div>
                            <span className="text-[rgb(var(--muted))]">Submitter (user_id):</span>{" "}
                            <span className="font-medium">{r.user_id ?? "—"}</span>
                          </div>
                        </div>
                      </div>

                      {/* TAGGER */}
                      <div className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] p-3">
                        <div className="text-xs font-semibold text-[rgb(var(--muted))]">Tagger</div>
                        <div className="mt-1">{r.tags ?? "—"}</div>
                      </div>

                      {/* KONTAKT */}
                      <div className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] p-3">
                        <div className="text-xs font-semibold text-[rgb(var(--muted))]">Kontakt</div>
                        <div className="mt-1 grid gap-1">
                          <div>{r.contact_email ?? "—"}</div>
                          <div className="text-xs text-[rgb(var(--muted))]">Telefon: {r.phone ?? "—"}</div>
                        </div>
                      </div>

                      {/* E: LANG BESKRIVELSE */}
                      <div className="md:col-span-2 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] p-3">
                        <div className="flex items-center justify-between gap-3">
                          <div className="text-xs font-semibold text-[rgb(var(--muted))]">Lang beskrivelse</div>
                          <div className="text-xs text-[rgb(var(--muted))]">{hasLong ? "✓" : "—"}</div>
                        </div>
                        <div className="mt-1 whitespace-pre-wrap text-[rgb(var(--muted))]">{r.long_description ?? "—"}</div>
                      </div>

                      {/* E: LENKER */}
                      <div className="md:col-span-2 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] p-3">
                        <div className="flex items-center justify-between gap-3">
                          <div className="text-xs font-semibold text-[rgb(var(--muted))]">Lenker</div>
                          <div className="text-xs text-[rgb(var(--muted))]">{hasLinks ? `${links.length} stk` : "—"}</div>
                        </div>

                        <div className="mt-2 grid gap-2">
                          {links.length ? (
                            links.map((x, i) => (
                              <a
                                key={`${r.id}-link-${i}`}
                                href={x.url}
                                target="_blank"
                                rel="noreferrer"
                                className="underline text-sm"
                                title={x.url}
                              >
                                {x.label ? x.label : x.url}
                              </a>
                            ))
                          ) : (
                            <span className="text-sm text-[rgb(var(--muted))]">—</span>
                          )}
                        </div>
                      </div>

                      {/* E: MEDIA */}
                      <div className="md:col-span-2 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] p-3">
                        <div className="flex items-center justify-between gap-3">
                          <div className="text-xs font-semibold text-[rgb(var(--muted))]">Media</div>
                          <div className="text-xs text-[rgb(var(--muted))]">{hasMedia ? "✓" : "—"}</div>
                        </div>

                        <div className="mt-2 grid gap-2 text-sm">
                          <div>
                            <span className="text-[rgb(var(--muted))]">Cover:</span>{" "}
                            {r.cover_image ? (
                              <a className="underline" href={r.cover_image} target="_blank" rel="noreferrer">
                                Åpne ↗
                              </a>
                            ) : (
                              "—"
                            )}
                          </div>

                          <div>
                            <span className="text-[rgb(var(--muted))]">Video:</span>{" "}
                            {r.video_url ? (
                              <a className="underline" href={r.video_url} target="_blank" rel="noreferrer">
                                Åpne ↗
                              </a>
                            ) : (
                              "—"
                            )}
                          </div>
                        </div>
                      </div>

                      {/* NOTATER */}
                      <div className="md:col-span-2 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] p-3">
                        <div className="text-xs font-semibold text-[rgb(var(--muted))]">Notater</div>
                        <div className="mt-1 whitespace-pre-wrap text-[rgb(var(--muted))]">{r.notes ?? "—"}</div>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      <form action={approveAndPublish}>
                        <input type="hidden" name="id" value={r.id} />
                        <button
                          type="submit"
                          className="rounded-xl border border-[rgb(var(--border))] bg-black text-white px-4 py-2 text-sm hover:opacity-90 disabled:opacity-50"
                          disabled={!!r.published_company_id}
                          title={r.published_company_id ? "Allerede publisert" : "Publiser til companies"}
                        >
                          Godkjenn → Publiser
                        </button>
                      </form>

                      <form action={rejectSubmission}>
                        <input type="hidden" name="id" value={r.id} />
                        <button
                          type="submit"
                          className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-4 py-2 text-sm hover:shadow-soft"
                        >
                          Avvis
                        </button>
                      </form>

                      {r.published_company?.slug ? (
                        <Link
                          href={`/selskap/${r.published_company.slug}`}
                          className="text-xs underline text-[rgb(var(--muted))] hover:opacity-80"
                        >
                          Åpne publisert side ↗
                        </Link>
                      ) : r.published_company_id ? (
                        <span className="text-xs text-[rgb(var(--muted))]">Publisert ✓</span>
                      ) : null}

                      <span className="ml-auto text-xs text-[rgb(var(--muted))]">
                        ID: <code className="px-1">{r.id}</code>
                      </span>
                    </div>

                    {/* liten “kvalitetslinje” for admin */}
                    <div className="mt-3 text-xs text-[rgb(var(--muted))]">
                      Komplett: <b>{r.is_complete ? "ja" : "nei"}</b> · Lang beskrivelse: <b>{hasLong ? "ja" : "nei"}</b>{" "}
                      · Telefon: <b>{hasPhone ? "ja" : "nei"}</b> · Lenker: <b>{hasLinks ? "ja" : "nei"}</b>
                    </div>
                  </div>
                </details>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
