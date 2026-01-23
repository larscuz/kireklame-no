// src/app/api/submit/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { notifyAdmin } from "@/lib/email/notifyAdmin";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function hostOfWebsite(input: string) {
  try {
    const withScheme = input.startsWith("http") ? input : `https://${input}`;
    const u = new URL(withScheme);
    return u.hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return "";
  }
}

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const cover_image_url =
  String(form.get("cover_image_url") ?? "").trim() || null;


    const company_name = String(form.get("company_name") ?? "").trim() || null;
    const website = String(form.get("website") ?? "").trim() || null;
    const location = String(form.get("location") ?? "").trim() || null;
    const tags = String(form.get("tags") ?? "").trim() || null;
    const notes = String(form.get("notes") ?? "").trim() || null;
    const contact_email =
      String(form.get("contact_email") ?? "").trim() || null;

    const ai_level_raw = String(form.get("ai_level") ?? "").trim();
    const price_level_raw = String(form.get("price_level") ?? "").trim();
    const ai_level = ai_level_raw !== "" ? Number(ai_level_raw) : null;
    const price_level = price_level_raw !== "" ? Number(price_level_raw) : null;

    if (!company_name) {
      return NextResponse.json({ error: "Bedriftsnavn mangler." }, { status: 400 });
    }
    if (!contact_email) {
      return NextResponse.json({ error: "Kontakt-epost mangler." }, { status: 400 });
    }

    const website_host = website ? hostOfWebsite(website) : null;

    // Hvis innlogget: lagre submitter user_id på submission
    let user_id: string | null = null;
    try {
      const cookieStore = await cookies();
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
  getAll() {
    return cookieStore.getAll();
  },
  setAll(
  cookiesToSet: Array<{
    name: string;
    value: string;
    options?: Parameters<typeof cookieStore.set>[2];
  }>
) {
  try {
    cookiesToSet.forEach((c) => {
      cookieStore.set(c.name, c.value, c.options);
    });
  } catch {
    // Hvis vi er i en context som ikke tillater set (f.eks. enkelte edge/stream cases),
    // så ignorerer vi. Best-effort.
  }
},

},

        }
      );
      const { data } = await supabase.auth.getUser();
      user_id = data.user?.id ?? null;
    } catch {
      user_id = null;
    }

    const db = supabaseAdmin();

    // cover image (prefer URL from "Last opp cover" button)
const file = form.get("cover_image");
let cover_image: string | null = cover_image_url;

function assertEnv(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}

function safeExtFromFile(f: File) {
  const name = (f.name || "").toLowerCase();
  const byName = name.split(".").pop();
  if (byName && byName.length <= 5) return byName;

  const type = (f.type || "").toLowerCase();
  if (type.includes("jpeg")) return "jpg";
  if (type.includes("png")) return "png";
  if (type.includes("webp")) return "webp";
  return "png";
}

// Fallback: if user selected a file but didn't click "Last opp cover"
if (!cover_image && file instanceof File && file.size > 0) {
  const ext = safeExtFromFile(file);
  const allowed = new Set(["png", "jpg", "jpeg", "webp"]);
  if (!allowed.has(ext)) {
    return NextResponse.json(
      { error: "Kun png/jpg/webp er støttet." },
      { status: 415 }
    );
  }

  const uploadUrl = assertEnv("ONECOM_UPLOAD_URL");
  const token = assertEnv("ONECOM_UPLOAD_TOKEN");

  const submissionId =
    globalThis.crypto?.randomUUID?.() ??
    `${Date.now()}-${Math.random().toString(16).slice(2)}`;

  const forward = new FormData();
  forward.set("kind", "cover");
  forward.set("scope", "submissions");
  forward.set("companyId", submissionId);
  forward.set("file", file);

  const upRes = await fetch(uploadUrl, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: forward,
  });

  const text = await upRes.text();
  let payload: any = null;
  try {
    payload = JSON.parse(text);
  } catch {}

  if (!upRes.ok || !payload?.ok || !payload?.url) {
    return NextResponse.json(
      { error: "Kunne ikke laste opp bilde.", status: upRes.status, response: payload ?? text },
      { status: 502 }
    );
  }

  cover_image = payload.url;
}


    // Insert submission
    const { data: inserted, error } = await db
      .from("submissions")
      .insert({
        status: "pending",
        company_name,
        website,
        website_host,
        location,
        tags,
        notes,
        contact_email,
        ai_level,
        price_level,
        cover_image,
        user_id,
      })
      .select("id")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // 1) Admin mail
    await notifyAdmin({
      subject: "Ny bedrift sendt inn (pending)",
      title: "Ny innsending",
      lines: [
        `Bedrift: ${company_name}`,
        website ? `Nettside: ${website}` : "Nettside: (ikke oppgitt)",
        location ? `Sted: ${location}` : "Sted: (ikke oppgitt)",
        `E-post: ${contact_email}`,
        user_id ? `user_id: ${user_id}` : "user_id: (ikke innlogget)",
      ],
      actionText: "Åpne i moderering",
      actionPath: `/admin/moderate?open=${encodeURIComponent(inserted.id)}`,
    });

    // 2) Autoresponder til bruker (ingen lenke – kun bekreftelse)
    // Best-effort: skal aldri stoppe submit.
    try {
      const to = contact_email;
      const hasResend = !!process.env.RESEND_API_KEY;

      if (to && hasResend) {
        const { notifySubmitter } = await import("@/lib/email/notifySubmitter");

        await notifySubmitter({
          to,
          subject: "KiReklame har mottatt innsendingen din –",
          title: "Takk for henvendelsen",
          lines: [
  
  "Innsendingen er mottatt og vil bli gjennomgått.",
  "Du får en ny e-post når bedriften er godkjent og profilen er publisert.",
  "",
  `Bedrift: ${company_name ?? "—"}`,
  website ? `Nettside: ${website}` : "Nettside: —",
  location ? `Sted: ${location}` : "Sted: —",
].filter(Boolean),

          // ingen actionText/actionUrl
        });
      }
    } catch (e) {
      console.error("AUTOREPLY MAIL FAILED (ignored):", e);
    }

    return NextResponse.json({ ok: true, id: inserted.id });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Ukjent feil" },
      { status: 500 }
    );
  }
}
