import type { Metadata } from "next";
import { siteMeta } from "@/lib/seo";

export const metadata: Metadata = siteMeta({
  title: "Send inn forslag – KiReklame.no",
  description: "Tips oss om aktører som bruker KI i kommersielt kreativt arbeid.",
  path: "/admin/submit",
});


const inputBase =
  "rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-4 py-3 outline-none focus:ring-2 focus:ring-black/10 dark:focus:ring-white/10";

const helpText = "text-xs text-[rgb(var(--muted))]";

export default function SubmitPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-14">
      <h1 className="text-3xl font-semibold tracking-tight">Send inn forslag</h1>
      <p className="mt-2 text-[rgb(var(--muted))]">
        V1: Skjema som havner i <code className="px-1">submissions</code>-tabellen.
      </p>

      <form action="/api/submit" method="post" className="mt-8 grid gap-5">
        <label className="grid gap-1">
          <span className="text-sm font-medium">Navn på aktør *</span>
          <input
            name="company_name"
            className={inputBase}
            placeholder="F.eks. Eksempel Studio"
            required
          />
        </label>

        <div className="grid gap-5 md:grid-cols-2">
          <label className="grid gap-1">
            <span className="text-sm font-medium">Nettside</span>
            <input name="website" className={inputBase} placeholder="https://" />
          </label>

          <label className="grid gap-1">
            <span className="text-sm font-medium">Sted</span>
            <input name="location" className={inputBase} placeholder="Oslo, Bergen, ..." />
          </label>
        </div>

        {/* TYPE + ORG */}
        <div className="grid gap-5 md:grid-cols-2">
          <label className="grid gap-1">
            <span className="text-sm font-medium">Type</span>
            <select name="company_type" className={inputBase} defaultValue="byrå">
              <option value="byrå">Byrå</option>
              <option value="studio">Studio</option>
              <option value="miljø">Miljø</option>
              <option value="frilans">Frilans</option>
              <option value="ub/sb">UB/SB</option>
            </select>
          </label>

          <label className="grid gap-1">
            <span className="text-sm font-medium">Organisasjonsform</span>
            <select name="org_form" className={inputBase} defaultValue="AS">
              <option value="AS">AS</option>
              <option value="ENK">ENK</option>
              <option value="DA/ANS">DA/ANS</option>
              <option value="UB">UB</option>
              <option value="SB">SB</option>
              <option value="annet">Annet</option>
            </select>
          </label>
        </div>

        {/* AI + PRIS */}
        <div className="grid gap-5 md:grid-cols-2">
          <label className="grid gap-1">
            <span className="text-sm font-medium">AI-nivå</span>
            <select name="ai_level" className={inputBase} defaultValue="3">
              <option value="0">Student</option>
              <option value="1">Lærling</option>
              <option value="2">Avansert</option>
              <option value="3">Expert</option>
              <option value="4">Mester</option>
            </select>
          </label>

          <label className="grid gap-1">
            <span className="text-sm font-medium">Prisnivå</span>
            <select name="price_level" className={inputBase} defaultValue="2">
              <option value="0">Lav</option>
              <option value="1">Rimelig</option>
              <option value="2">Mellom</option>
              <option value="3">Premium</option>
              <option value="4">Enterprise</option>
            </select>
          </label>
        </div>

        <label className="grid gap-1">
          <span className="text-sm font-medium">Tagger</span>
          <input name="tags" className={inputBase} placeholder="generativ-video, 3d, vfx, ..." />
          <span className={helpText}>Tips: skilletegn med komma.</span>
        </label>

        {/* NYTT: telefon */}
        <label className="grid gap-1">
          <span className="text-sm font-medium">Telefon</span>
          <input name="phone" className={inputBase} placeholder="+47 99 99 99 99" />
        </label>

        {/* NYTT: kort/utvidet beskrivelse */}
        <label className="grid gap-1">
          <span className="text-sm font-medium">Lang beskrivelse</span>
          <textarea
            name="long_description"
            className={inputBase}
            rows={6}
            placeholder="Hva leverer dere, type kunder, hvorfor dere bruker KI, prosess, case, osv."
          />
          <span className={helpText}>
            Dette er teksten som gir deg (admin) mer å vurdere før publisering.
          </span>
        </label>

        {/* eksisterende notes beholdes */}
        <label className="grid gap-1">
          <span className="text-sm font-medium">Notater / hvorfor relevant</span>
          <textarea
            name="notes"
            className={inputBase}
            rows={5}
            placeholder="Lenker til case, hva de gjør med KI, hvem som tipser, osv."
          />
        </label>

        {/* NYTT: cover image url */}
        <label className="grid gap-1">
          <span className="text-sm font-medium">Cover image (URL)</span>
          <input
            name="cover_image"
            className={inputBase}
            placeholder="https://... (bildeurl)"
          />
          <span className={helpText}>
            Valgfritt. Kan være link til logo/cover. (Upload kan komme senere.)
          </span>
        </label>

        {/* NYTT: video url */}
        <label className="grid gap-1">
          <span className="text-sm font-medium">Video (URL)</span>
          <input
            name="video_url"
            className={inputBase}
            placeholder="https://www.youtube.com/watch?v=... / https://vimeo.com/... / mp4"
          />
        </label>

        {/* NYTT: links jsonb via enkel textarea */}
        <label className="grid gap-1">
          <span className="text-sm font-medium">Lenker (én per linje)</span>
          <textarea
            name="links"
            className={inputBase}
            rows={5}
            placeholder={`https://...\nhttps://...\nhttps://...`}
          />
          <span className={helpText}>
            Vi lagrer dette som JSONB senere (serveren parser linjene til liste).
          </span>
        </label>

        <label className="grid gap-1">
          <span className="text-sm font-medium">Kontakt-e-post</span>
          <input name="contact_email" className={inputBase} placeholder="navn@firma.no" />
        </label>

        {/* NYTT: is_complete uten JS */}
        <label className="flex items-start gap-3 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-4">
          <input
            type="checkbox"
            name="is_complete"
            value="1"
            className="mt-1 h-4 w-4"
          />
          <span className="text-sm">
            Denne innsendingen er <b>komplett nok</b> til at den kan vurderes for publisering.
            <div className={helpText}>
              (Vi bruker dette som et signal i moderering. Ingen JS.)
            </div>
          </span>
        </label>

        {/* EKSTRA FELT (v1.1) */}
<div className="grid gap-5 md:grid-cols-2">
  <label className="grid gap-1">
    <span className="text-sm font-medium">Telefon</span>
    <input name="phone" className={inputBase} placeholder="+47 ..." />
  </label>

  <label className="grid gap-1">
    <span className="text-sm font-medium">Video (YouTube/Vimeo eller mp4-url)</span>
    <input name="video_url" className={inputBase} placeholder="https://..." />
  </label>
</div>

<label className="grid gap-1">
  <span className="text-sm font-medium">Lang beskrivelse (første versjon)</span>
  <textarea
    name="long_description"
    className={inputBase}
    rows={6}
    placeholder="Hva dere gjør, hva dere leverer, hvordan dere bruker KI, osv."
  />
</label>

<label className="grid gap-1">
  <span className="text-sm font-medium">Lenker (én URL per linje)</span>
  <textarea
    name="links"
    className={inputBase}
    rows={4}
    placeholder={`https://...\nhttps://...\nhttps://...`}
  />
</label>

<label className="grid gap-2">
  <span className="text-sm font-medium">Cover image URL (valgfritt)</span>
  <input name="cover_image" className={inputBase} placeholder="https://..." />
  <span className="text-xs text-[rgb(var(--muted))]">
    Valgfritt. Kan senere erstattes av upload når profilen er publisert.
  </span>
</label>

<label className="flex items-center gap-3 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-4 py-3">
  <input type="checkbox" name="is_complete" value="1" />
  <span className="text-sm">
    Jeg har fylt ut nok info til at dette kan vurderes for publisering
  </span>
</label>


        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="rounded-xl bg-black text-white px-5 py-2.5 text-sm font-semibold hover:opacity-90 transition dark:bg-white dark:text-black"
          >
            Send inn
          </button>
          <a
            href="/selskaper"
            className="rounded-xl border border-[rgb(var(--border))] px-5 py-2.5 text-sm font-semibold hover:shadow-soft transition"
          >
            Avbryt
          </a>
        </div>

        <p className="text-xs text-[rgb(var(--muted))]">
          Ved å sende inn godtar du at info kan bli publisert etter enkel vurdering.
        </p>
      </form>
    </div>
  );
}
