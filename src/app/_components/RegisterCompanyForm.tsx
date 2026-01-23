// src/app/_components/RegisterCompanyForm.tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";


const AI_LEVELS = [
  { value: "0", label: "0 – Elev" },
  { value: "1", label: "1 – Lærling" },
  { value: "2", label: "2 – Proff" },
  { value: "3", label: "3 – Expert" },
  { value: "4", label: "4 – Mester" },
  { value: "5", label: "5 – Guru" },
];

const PRICE_LEVELS = [
  { value: "0", label: "0 – Lav" },
  { value: "1", label: "1 – Under middels" },
  { value: "2", label: "2 – Middels" },
  { value: "3", label: "3 – Over middels" },
  { value: "4", label: "4 – Premium" },
];

export default function RegisterCompanyForm() {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
const [coverUrl, setCoverUrl] = useState<string>("");
const [coverUploading, setCoverUploading] = useState(false);

    const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  async function uploadCoverNow() {
  if (!coverFile) {
    setErr("Velg et bilde først.");
    return;
  }

  setErr(null);
  setMsg(null);
  setCoverUploading(true);

  try {
    const fd = new FormData();
    fd.set("file", coverFile);

    const res = await fetch("/api/upload/submission-cover", {
      method: "POST",
      body: fd,
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok || !data?.ok) {
      setErr(data?.error || "Kunne ikke laste opp bilde.");
      setCoverUploading(false);
      return;
    }

    setCoverUrl(data.url || "");
    setCoverUploading(false);
  } catch (e: any) {
    setCoverUploading(false);
    setErr(e?.message ?? "Kunne ikke laste opp bilde.");
  }
}



  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsg(null);
    setErr(null);
    setLoading(true);

    const formEl = e.currentTarget;
    const form = new FormData(formEl);

    const company = String(form.get("company_name") ?? "").trim();
    const contactEmail = String(form.get("contact_email") ?? "").trim();
    const password = String(form.get("password") ?? "");
    const password2 = String(form.get("password2") ?? "");


    if (!company) {
      setLoading(false);
      setErr("Bedriftsnavn må fylles inn.");
      return;
    }
    if (!contactEmail) {
      setLoading(false);
      setErr("Kontakt-epost må fylles inn.");
      return;
    }

    if (!password || password.length < 8) {
  setLoading(false);
  setErr("Passord må være minst 8 tegn.");
  return;
}
if (password !== password2) {
  setLoading(false);
  setErr("Passordene matcher ikke.");
  return;
}


    // 1) Opprett konto (eller logg inn hvis konto finnes)
let authErrorMsg: string | null = null;

// Prøv signUp først
{
  const { error } = await supabase.auth.signUp({
  email: contactEmail,
  password,
  options: {
    emailRedirectTo: `${window.location.origin}/auth/callback?next=/me`,
  },
});


  if (error) {
    const msg = (error as any)?.message?.toLowerCase?.() ?? "";

    // Hvis e-post allerede finnes, prøv innlogging i stedet
    const looksLikeExists =
      msg.includes("already") ||
      msg.includes("exists") ||
      msg.includes("registered") ||
      msg.includes("user already") ||
      msg.includes("email") && msg.includes("taken");

    if (looksLikeExists) {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: contactEmail,
        password,
      });

      if (signInError) authErrorMsg = signInError.message;
    } else {
      authErrorMsg = error.message;
    }
  }
}

if (authErrorMsg) {
  setLoading(false);
  setErr(authErrorMsg);
  return;
}

form.delete("password");
form.delete("password2");

const { data: userData } = await supabase.auth.getUser();
const userId = userData?.user?.id;

if (userId) {
  form.set("user_id", userId);
}


// 2) lagre submission (inkl. bilde) via API
const res = await fetch("/api/submit", { method: "POST", body: form });
const data = await res.json().catch(() => ({}));


    setLoading(false);

    if (!res.ok) {
      setErr(data?.error || "Kunne ikke sende inn. Prøv igjen.");
      return;
    }

    // ✅ Viktig: Vi oppretter IKKE konto her.
    // Konto/innlogging skjer først ved godkjenning (recovery-link i godkjenningsmail).
    setMsg(
      "Takk! Kontoen din er opprettet, og innsendingen er mottatt. Vi godkjenner alle innsendinger før publisering. Du får e-post når bedriften er godkjent og profilen er publisert."
    );

    formEl.reset();
  }

  return (
    <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-6 md:p-8 shadow-soft">
      <div className="flex items-start justify-between gap-4">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
          Registrer bedrift
        </h1>
        <Link href="/" className="text-sm text-[rgb(var(--muted))] hover:underline">
          ← Til katalog
        </Link>
      </div>

      <p className="mt-4 text-[rgb(var(--muted))] leading-relaxed">
      Opprett konto ved å velge passord, og send inn bedriften til godkjenning. Vi godkjenner alle innsendinger før publisering.
      Du får e-post når bedriften er godkjent og profilen er publisert.
    </p>


      <form onSubmit={onSubmit} className="mt-6 grid gap-4">
        <label className="grid gap-2">
          <span className="text-sm font-semibold">Bedriftsnavn *</span>
          <input
            name="company_name"
            required
            className="w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-4 py-3 outline-none"
            placeholder="F.eks. Rose Project"
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-semibold">Nettside</span>
          <input
            name="website"
            className="w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-4 py-3 outline-none"
            placeholder="https://... (valgfritt)"
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-semibold">Sted</span>
          <input
            name="location"
            className="w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-4 py-3 outline-none"
            placeholder="F.eks. Oslo (valgfritt)"
          />
        </label>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2">
            <span className="text-sm font-semibold">AI-nivå</span>
            <select
              name="ai_level"
              defaultValue="3"
              className="w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-4 py-3 outline-none"
            >
              {AI_LEVELS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-semibold">Prisnivå</span>
            <select
              name="price_level"
              defaultValue="2"
              className="w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-4 py-3 outline-none"
            >
              {PRICE_LEVELS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="grid gap-2">
  <span className="text-sm font-semibold">Bilde (logo/cover)</span>

  <input
    name="cover_image"
    type="file"
    accept="image/*"
    className="w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-4 py-3 outline-none"
    onChange={(e) => {
      const f = e.currentTarget.files?.[0] || null;
      setCoverFile(f);
      setCoverUrl("");
    }}
  />

  <div className="flex items-center gap-3">
    <button
      type="button"
      onClick={uploadCoverNow}
      disabled={!coverFile || coverUploading}
      className="inline-flex items-center justify-center rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-4 py-3 font-semibold hover:opacity-90 transition disabled:opacity-60"
    >
      {coverUploading ? "Laster opp…" : "Last opp cover"}
    </button>

    {coverUrl ? <span className="text-xs text-[rgb(var(--muted))]">✅ Opplastet</span> : null}
  </div>

  {coverUrl ? (
    <div className="mt-3 grid gap-2">
      <img
        src={coverUrl}
        alt="Cover preview"
        className="w-full max-h-64 object-cover rounded-2xl border border-[rgb(var(--border))]"
      />
      <div className="text-xs text-[rgb(var(--muted))] break-all">{coverUrl}</div>
    </div>
  ) : null}

  {/* Sendes til /api/submit */}
  <input type="hidden" name="cover_image_url" value={coverUrl} />

  <span className="text-xs text-[rgb(var(--muted))]">
    PNG/JPG/WebP. Valgfritt, men anbefalt.
  </span>
</label>


        <label className="grid gap-2">
          <span className="text-sm font-semibold">Kort beskrivelse</span>
          <textarea
            name="notes"
            rows={4}
            className="w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-4 py-3 outline-none"
            placeholder="Hva gjør dere, og hvordan bruker dere KI?"
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-semibold">Tags (kommaseparert)</span>
          <input
            name="tags"
            className="w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-4 py-3 outline-none"
            placeholder="f.eks. video, annonser, 3D, sosiale medier"
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-semibold">Kontakt-epost *</span>
          <input
            name="contact_email"
            type="email"
            required
            className="w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-4 py-3 outline-none"
            placeholder="deg@firma.no"
          />
          <span className="text-xs text-[rgb(var(--muted))]">
            Du får e-post ved godkjenning og publisering.
          </span>
        </label>

        <div className="grid gap-4 md:grid-cols-2">
  <label className="grid gap-2">
    <span className="text-sm font-semibold">Velg passord *</span>
    <input
      name="password"
      type="password"
      required
      minLength={8}
      className="w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-4 py-3 outline-none"
      placeholder="Minst 8 tegn"
      autoComplete="new-password"
    />
  </label>

  <label className="grid gap-2">
    <span className="text-sm font-semibold">Gjenta passord *</span>
    <input
      name="password2"
      type="password"
      required
      minLength={8}
      className="w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-4 py-3 outline-none"
      placeholder="Skriv passordet igjen"
      autoComplete="new-password"
    />
  </label>
</div>

<p className="text-xs text-[rgb(var(--muted))]">
  Passordet brukes for å opprette kontoen din. Du kan logge inn senere og redigere profilen.
</p>


        <button
          type="submit"
          disabled={loading}
          className="mt-2 inline-flex items-center justify-center rounded-2xl bg-[rgb(var(--fg))] text-[rgb(var(--bg))] px-6 py-4 font-semibold shadow-soft hover:opacity-90 transition disabled:opacity-60"
        >
          {loading ? "Sender…" : "Send inn"}
        </button>

        {err ? <p className="text-sm text-red-600">{err}</p> : null}

        {msg ? (
          <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] p-5">
            <div className="text-base font-semibold">Takk for henvendelsen</div>
            <p className="mt-3 text-sm text-[rgb(var(--muted))]">{msg}</p>
          </div>
        ) : (
          <p className="text-xs text-[rgb(var(--muted))]">
            Etter innsending: vi vurderer forespørselen og gir beskjed på e-post ved godkjenning.
          </p>
        )}
      </form>
    </div>
  );
}
