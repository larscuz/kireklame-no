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

    // cover image upload
    const file = form.get("cover_image");
    let cover_image: string | null = null;

    if (file && typeof file === "object" && "arrayBuffer" in file) {
      const bucket =
        process.env.SUPABASE_COMPANY_IMAGES_BUCKET || "company-covers";

      const f = file as File;
      const ext = (f.name.split(".").pop() || "jpg")
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "");
      const safeExt = ext || "jpg";

      const key = `submissions/${Date.now()}-${Math.random()
        .toString(16)
        .slice(2)}.${safeExt}`;

      const bytes = Buffer.from(await f.arrayBuffer());

      const { error: upErr } = await db.storage
        .from(bucket)
        .upload(key, bytes, {
          contentType: f.type || "image/jpeg",
          upsert: false,
        });

      if (upErr) {
        return NextResponse.json(
          { error: `Kunne ikke laste opp bilde: ${upErr.message}` },
          { status: 400 }
        );
      }

      const { data: pub } = db.storage.from(bucket).getPublicUrl(key);
      cover_image = pub?.publicUrl ?? null;
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
