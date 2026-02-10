import Link from "next/link";
import type { Metadata } from "next";
import { Bodoni_Moda, Manrope, Source_Serif_4 } from "next/font/google";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  FRONT_LEAD_OVERRIDE_TAG,
  FRONT_NOW_OVERRIDE_TAGS,
  listNewsForAdmin,
} from "@/lib/news/articles";
import {
  FRONT_LAYOUT_TAGS,
  type FrontLayoutTag,
  applyFrontLayoutAssignments,
  readFrontLayoutAssignmentsFromRows,
} from "@/lib/news/frontLayout";
import { isLikelyInternationalDeskArticle } from "@/lib/news/international";
import { requireAdmin } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import type { NewsArticle } from "@/lib/news/types";

const masthead = Bodoni_Moda({
  subsets: ["latin"],
  weight: ["500", "700"],
});

const headline = Source_Serif_4({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const uiSans = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const FIELD_CLASS =
  "w-full border border-black/20 bg-[#fcf8ef] px-3 py-2 text-sm text-[#191919] outline-none focus:border-black/45";
const PRIMARY_BUTTON_CLASS =
  "border border-black bg-black px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-white hover:bg-black/90";
const SECONDARY_BUTTON_CLASS =
  "border border-black/30 bg-[#f8f4eb] px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-black hover:bg-[#f1ede4]";

type LayoutNoticeKey = "layout_saved" | "slot_saved";

const NOTICE_TEXT: Record<LayoutNoticeKey, string> = {
  layout_saved: "Forside-layout lagret.",
  slot_saved: "Slot oppdatert.",
};

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "KiR Nyheter Layout – Admin",
  description: "Kompakt layoutstyring for forside-posisjoner i KiR Nyheter.",
};

function hasImage(url: string | null): boolean {
  return /^https?:\/\//i.test(String(url ?? "").trim());
}

function firstSearchParam(
  value: string | string[] | undefined
): string | null {
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
}

function resolveNotice(value: string | string[] | undefined) {
  const key = firstSearchParam(value);
  if (!key) return null;
  if (!(key in NOTICE_TEXT)) return null;
  const typed = key as LayoutNoticeKey;
  return { key: typed, text: NOTICE_TEXT[typed] };
}

function layoutNoticeUrl(notice: LayoutNoticeKey, itemId?: string | null, q?: string) {
  const params = new URLSearchParams({ notice });
  if (itemId) params.set("item", itemId);
  if (q) params.set("q", q);
  const hash = itemId ? `#article-${itemId}` : "";
  return `/admin/ki-avis/layout?${params.toString()}${hash}`;
}

function revalidateNewsSurfaces() {
  revalidatePath("/ki-avis");
  revalidatePath("/admin/ki-avis");
  revalidatePath("/admin/ki-avis/layout");
  revalidatePath("/sitemap.xml");
  revalidatePath("/news-sitemap.xml");
  revalidatePath("/ki-avis/rss.xml");
}

async function setFrontLayoutFromPanel(formData: FormData) {
  "use server";
  await requireAdmin("/admin/ki-avis/layout");

  const q = String(formData.get("q") ?? "").trim();
  const leadId = String(formData.get("lead_article_id") ?? "").trim() || null;
  const frontNow1 = String(formData.get("front_now_1_id") ?? "").trim() || null;
  const frontNow2 = String(formData.get("front_now_2_id") ?? "").trim() || null;
  const frontNow3 = String(formData.get("front_now_3_id") ?? "").trim() || null;

  await applyFrontLayoutAssignments({
    [FRONT_LEAD_OVERRIDE_TAG]: leadId,
    [FRONT_NOW_OVERRIDE_TAGS[0]]: frontNow1,
    [FRONT_NOW_OVERRIDE_TAGS[1]]: frontNow2,
    [FRONT_NOW_OVERRIDE_TAGS[2]]: frontNow3,
  });

  revalidateNewsSurfaces();
  redirect(layoutNoticeUrl("layout_saved", leadId, q || undefined));
}

async function setSingleSlot(formData: FormData) {
  "use server";
  await requireAdmin("/admin/ki-avis/layout");

  const articleId = String(formData.get("id") ?? "").trim();
  const slotTag = String(formData.get("slot_tag") ?? "").trim();
  const q = String(formData.get("q") ?? "").trim();
  if (!articleId) throw new Error("Mangler artikkel-id");
  if (!FRONT_LAYOUT_TAGS.includes(slotTag as FrontLayoutTag)) {
    throw new Error("Ugyldig slot");
  }
  const slot = slotTag as FrontLayoutTag;

  const db = supabaseAdmin();
  const { data: rows, error } = await db
    .from("news_articles")
    .select("id, topic_tags")
    .eq("status", "published")
    .limit(1000);
  if (error) throw new Error(error.message);

  const current = readFrontLayoutAssignmentsFromRows(
    (rows ?? []) as Array<{ id: string; topic_tags: string[] | null }>
  );
  current[slot] = articleId;
  for (const tag of FRONT_LAYOUT_TAGS) {
    if (tag !== slot && current[tag] === articleId) current[tag] = null;
  }

  await applyFrontLayoutAssignments(current);
  revalidateNewsSurfaces();
  redirect(layoutNoticeUrl("slot_saved", articleId, q || undefined));
}

async function clearSlotsFromArticle(formData: FormData) {
  "use server";
  await requireAdmin("/admin/ki-avis/layout");

  const articleId = String(formData.get("id") ?? "").trim();
  const q = String(formData.get("q") ?? "").trim();
  if (!articleId) throw new Error("Mangler artikkel-id");

  const db = supabaseAdmin();
  const { data: rows, error } = await db
    .from("news_articles")
    .select("id, topic_tags")
    .eq("status", "published")
    .limit(1000);
  if (error) throw new Error(error.message);

  const current = readFrontLayoutAssignmentsFromRows(
    (rows ?? []) as Array<{ id: string; topic_tags: string[] | null }>
  );
  for (const tag of FRONT_LAYOUT_TAGS) {
    if (current[tag] === articleId) current[tag] = null;
  }

  await applyFrontLayoutAssignments(current);
  revalidateNewsSurfaces();
  redirect(layoutNoticeUrl("slot_saved", articleId, q || undefined));
}

function assignmentForTag(
  rows: NewsArticle[],
  tag: (typeof FRONT_LAYOUT_TAGS)[number]
): NewsArticle | null {
  return rows.find((row) =>
    (row.topic_tags ?? []).some((item) => String(item ?? "").toLowerCase() === tag)
  ) ?? null;
}

export default async function KIAvisLayoutPage({
  searchParams,
}: {
  searchParams?: Promise<{ notice?: string | string[]; item?: string | string[]; q?: string | string[] }>;
}) {
  await requireAdmin("/admin/ki-avis/layout");

  const sp = (await searchParams) ?? {};
  const notice = resolveNotice(sp.notice);
  const noticeItemId = firstSearchParam(sp.item);
  const query = String(firstSearchParam(sp.q) ?? "").trim().toLowerCase();

  const rows = await listNewsForAdmin(280);
  const layoutCandidates = rows.filter(
    (row) =>
      row.status === "published" &&
      hasImage(row.hero_image_url) &&
      !isLikelyInternationalDeskArticle(row)
  );

  const activeLead = assignmentForTag(layoutCandidates, FRONT_LEAD_OVERRIDE_TAG);
  const activeFrontNow = FRONT_NOW_OVERRIDE_TAGS.map((tag) =>
    assignmentForTag(layoutCandidates, tag)
  );

  const filtered = query
    ? layoutCandidates.filter((row) => {
        const haystack = `${row.title} ${row.source_name} ${(row.topic_tags ?? []).join(" ")}`.toLowerCase();
        return haystack.includes(query);
      })
    : layoutCandidates;

  const quickList = filtered.slice(0, 36);

  return (
    <main className={`${uiSans.className} min-h-screen bg-[#f1ede4] text-[#191919]`}>
      <div className="mx-auto max-w-[1280px] px-3 py-5 md:px-4 md:py-6">
        <header className="border-y border-black/20 bg-[#f6f2e9]">
          <div className="border-b border-black/15 px-3 py-2 text-[10px] uppercase tracking-[0.21em] text-black/65 md:px-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span>Layout-utgave · KiR Nyheter</span>
              <span>AIVISA DRIVES AV CUZ MEDIA AS</span>
            </div>
          </div>
          <div className="px-3 py-4 md:px-4">
            <div className="flex flex-wrap items-end justify-between gap-3 border-b border-black/20 pb-3">
              <div>
                <h1 className={`${masthead.className} text-[34px] leading-none sm:text-[42px]`}>
                  Forside-layout
                </h1>
                <p className="mt-1 text-sm text-black/68">
                  Plasser saker i faste slots uten å scrolle hele CMS.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-[12px] font-semibold uppercase tracking-[0.14em]">
                <Link href="/admin/ki-avis" className="underline underline-offset-4 hover:opacity-80">
                  Tilbake til CMS
                </Link>
                <Link href="/ki-avis" className="underline underline-offset-4 hover:opacity-80">
                  Åpne aivis
                </Link>
              </div>
            </div>
          </div>
        </header>

        {notice ? (
          <section className="mt-4 border border-emerald-800/30 bg-emerald-100/60 px-4 py-3 text-sm text-emerald-900">
            <p className="font-semibold">{notice.text}</p>
          </section>
        ) : null}

        <section className="mt-4 border border-black/20 bg-[#f8f4eb] p-4">
          <h2 className={`${headline.className} text-[30px] leading-[1.02] md:text-[36px]`}>
            Aktive slots
          </h2>

          <form action={setFrontLayoutFromPanel} className="mt-3">
            <input type="hidden" name="q" value={query} />
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              <label className="grid gap-1">
                <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-black/60">
                  Hovedsak
                </span>
                <select
                  name="lead_article_id"
                  defaultValue={activeLead?.id ?? ""}
                  className={FIELD_CLASS}
                >
                  <option value="">Automatisk</option>
                  {layoutCandidates.map((row) => (
                    <option key={`lead-${row.id}`} value={row.id}>
                      {row.title} ({row.source_name})
                    </option>
                  ))}
                </select>
              </label>

              {FRONT_NOW_OVERRIDE_TAGS.map((tag, idx) => (
                <label key={tag} className="grid gap-1">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-black/60">
                    Forside nå #{idx + 1}
                  </span>
                  <select
                    name={`front_now_${idx + 1}_id`}
                    defaultValue={activeFrontNow[idx]?.id ?? ""}
                    className={FIELD_CLASS}
                  >
                    <option value="">Automatisk</option>
                    {layoutCandidates.map((row) => (
                      <option key={`${tag}-${row.id}`} value={row.id}>
                        {row.title} ({row.source_name})
                      </option>
                    ))}
                  </select>
                </label>
              ))}
            </div>

            <div className="mt-3">
              <button className={PRIMARY_BUTTON_CLASS}>Lagre layout</button>
            </div>
          </form>

          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {[activeLead, ...activeFrontNow].map((article, idx) => (
              <article key={`slot-preview-${idx}`} className="border border-black/15 bg-[#fcf8ef] p-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.17em] text-black/58">
                  {idx === 0 ? "Hovedsak" : `Forside nå #${idx}`}
                </p>
                {hasImage(article?.hero_image_url ?? null) ? (
                  <img
                    src={article?.hero_image_url ?? ""}
                    alt={article?.title ?? "Slot preview"}
                    className="mt-2 h-24 w-full border border-black/15 object-cover"
                  />
                ) : null}
                <p className="mt-2 text-sm font-semibold leading-snug text-black/85">
                  {article?.title ?? "Automatisk"}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-4 border border-black/20 bg-[#f8f4eb] p-4">
          <form className="grid gap-2 sm:grid-cols-[1fr_auto]">
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="Søk i publiserte kandidater…"
              className={FIELD_CLASS}
            />
            <button className={SECONDARY_BUTTON_CLASS}>Søk</button>
          </form>
          <p className="mt-2 text-xs text-black/60">
            Viser {quickList.length} av {filtered.length} kandidater.
            {filtered.length > quickList.length ? " Bruk søk for å snevre inn." : ""}
          </p>
        </section>

        <section className="mt-4 border-y border-black/20 bg-[#f8f4eb]">
          {quickList.map((row) => (
            <article
              key={row.id}
              id={`article-${row.id}`}
              className={`border-b border-black/15 px-3 py-3 md:px-4 ${
                noticeItemId === row.id ? "bg-emerald-50/40" : ""
              }`}
            >
              <div className="grid gap-3 md:grid-cols-[116px_1fr_auto] md:items-center">
                <div>
                  {hasImage(row.hero_image_url) ? (
                    <img
                      src={row.hero_image_url ?? ""}
                      alt={row.title}
                      className="aspect-[16/10] w-full border border-black/20 object-cover"
                    />
                  ) : null}
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-[0.16em] text-black/58">
                    {row.source_name} · {row.perspective}
                  </p>
                  <p className={`${headline.className} mt-1 text-[24px] leading-[1.02]`}>
                    {row.title}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <form action={setSingleSlot}>
                    <input type="hidden" name="q" value={query} />
                    <input type="hidden" name="id" value={row.id} />
                    <input type="hidden" name="slot_tag" value={FRONT_LEAD_OVERRIDE_TAG} />
                    <button className={SECONDARY_BUTTON_CLASS}>Hovedsak</button>
                  </form>
                  {FRONT_NOW_OVERRIDE_TAGS.map((tag, idx) => (
                    <form key={`${row.id}-${tag}`} action={setSingleSlot}>
                      <input type="hidden" name="q" value={query} />
                      <input type="hidden" name="id" value={row.id} />
                      <input type="hidden" name="slot_tag" value={tag} />
                      <button className={SECONDARY_BUTTON_CLASS}>Forside #{idx + 1}</button>
                    </form>
                  ))}
                  <form action={clearSlotsFromArticle}>
                    <input type="hidden" name="q" value={query} />
                    <input type="hidden" name="id" value={row.id} />
                    <button className={SECONDARY_BUTTON_CLASS}>Fjern slots</button>
                  </form>
                </div>
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
