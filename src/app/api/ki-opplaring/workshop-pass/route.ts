import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  issueWorkshopPass,
  readWorkshopPassFromRequest,
  resolveQuotaSubject,
  workshopCodeIsValid,
  workshopCodesConfigured,
  WORKSHOP_PASS_COOKIE_NAME,
} from "@/server/ki-opplaring/quota";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const bodySchema = z.object({
  code: z.string().trim().min(4).max(120),
});

function setWorkshopCookie(response: NextResponse, value: string, maxAgeSeconds: number) {
  response.cookies.set({
    name: WORKSHOP_PASS_COOKIE_NAME,
    value,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: maxAgeSeconds,
  });
}

export async function GET(req: NextRequest) {
  const subject = await resolveQuotaSubject(req);
  const pass = subject.tier === "workshop" ? readWorkshopPassFromRequest(req) : null;

  return NextResponse.json({
    ok: true,
    active: Boolean(pass),
    expiresAt: pass ? new Date(pass.expiresAtEpochSeconds * 1000).toISOString() : null,
    tier: subject.tier,
    unlimited: subject.isUnlimited,
  });
}

export async function POST(req: NextRequest) {
  const subject = await resolveQuotaSubject(req);
  if (subject.mode === "user") {
    return NextResponse.json(
      {
        ok: false,
        error: "Workshop-pass er laget for anonyme workshop-deltakere. Innlogget kvote er allerede aktiv.",
      },
      { status: 409 }
    );
  }

  const body = bodySchema.safeParse(await req.json().catch(() => ({})));
  if (!body.success) {
    return NextResponse.json(
      {
        ok: false,
        error: "Ugyldig request. Send { code }.",
      },
      { status: 400 }
    );
  }

  if (!workshopCodesConfigured()) {
    return NextResponse.json(
      {
        ok: false,
        error: "Workshop-pass er ikke konfigurert på serveren.",
      },
      { status: 503 }
    );
  }

  if (!workshopCodeIsValid(body.data.code)) {
    return NextResponse.json(
      {
        ok: false,
        error: "Ugyldig workshop-kode.",
      },
      { status: 401 }
    );
  }

  const pass = issueWorkshopPass();
  const response = NextResponse.json({
    ok: true,
    tier: "workshop",
    expiresAt: new Date(pass.expiresAtEpochSeconds * 1000).toISOString(),
  });
  setWorkshopCookie(response, pass.cookieValue, pass.maxAgeSeconds);
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: WORKSHOP_PASS_COOKIE_NAME,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  return response;
}
