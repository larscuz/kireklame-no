import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { supabaseServerClient, getCompanyBySlug, createClaim } from "@/lib/supabase/server";
import { notifyAdmin } from "@/lib/email/notifyAdmin";


export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const slug = String(body?.slug ?? "").trim();
    const message = typeof body?.message === "string" ? body.message.trim() : "";

    if (!slug) {
      return NextResponse.json({ ok: false, error: "Missing slug" }, { status: 400 });
    }

    // Må være innlogget
    const supabase = await supabaseServerClient();
    const { data: userRes, error: userErr } = await supabase.auth.getUser();

    if (userErr || !userRes.user) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    // Finn bedrift via slug (du har denne funksjonen allerede)
    const company = await getCompanyBySlug(slug);
    if (!company) {
      return NextResponse.json({ ok: false, error: "Company not found" }, { status: 404 });
    }

    // Blokker hvis bedriften allerede er claimet av noen andre (pending/approved)
    // (Dette hindrer at flere "låser" samme bedrift.)
    const db = supabaseAdmin();
    const { data: existing, error: existingErr } = await db
      .from("claims")
      .select("id,user_id,status")
      .eq("company_id", company.id)
      .in("status", ["pending", "approved"])
      .maybeSingle();

    if (existingErr) {
      return NextResponse.json({ ok: false, error: existingErr.message }, { status: 500 });
    }

    if (existing && existing.user_id !== userRes.user.id) {
      return NextResponse.json(
        { ok: false, error: "Already claimed", code: "ALREADY_CLAIMED" },
        { status: 409 }
      );
    }

    // Opprett claim (idempotent for samme company+user)
    const res = await createClaim({
      companyId: company.id,
      userId: userRes.user.id,
      message: message || undefined,
    });

        if (!res.ok) {
      return NextResponse.json({ ok: false, error: res.error ?? "Unknown error" }, { status: 500 });
    }

    // ✅ Admin mail ved claim (best-effort)
    try {
      await notifyAdmin({
        subject: "Ny claim sendt inn (pending) – KiReklame",
        title: "Ny claim",
        lines: [
          `Bedrift: ${company.name ?? slug}`,
          `Slug: ${company.slug ?? slug}`,
          company.website ? `Nettside: ${company.website}` : "Nettside: (ikke oppgitt)",
          `Fra bruker: ${userRes.user.email ?? "(ukjent e-post)"}`,
          message ? `Melding: ${message}` : "Melding: (ingen)",
          "",
          "Neste steg: Godkjenn/avslå i admin.",
        ],
        actionText: "Åpne claims",
        actionPath: "/admin/claims",
      });
    } catch (e) {
      console.warn("CLAIM ADMIN MAIL FAILED (ignored):", e);
    }

    return NextResponse.json({ ok: true });

  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? "Server error" }, { status: 500 });
  }
}
