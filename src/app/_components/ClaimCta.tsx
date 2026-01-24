"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";

type ClaimRow = {
  id: string;
  status: string | null;
};

export default function ClaimCta({
  companyId,
  companySlug,
}: {
  companyId: string;
  companySlug: string;
}) {

  const [loggedIn, setLoggedIn] = useState(false);
  const [claimStatus, setClaimStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    setLoading(true);

    const supabase = supabaseBrowser();

    // 1) Er vi innlogget?
    const { data: sessionRes } = await supabase.auth.getSession();
    const hasSession = !!sessionRes.session;
    setLoggedIn(hasSession);

    if (!hasSession) {
      setClaimStatus(null);
      setLoading(false);
      return;
    }

    // 2) Hvem er brukeren?
    const { data: userRes } = await supabase.auth.getUser();
    const user = userRes.user;

    if (!user) {
      setClaimStatus(null);
      setLoading(false);
      return;
    }

    // 3) Finn claim for denne brukeren + bedriften
    //    Forutsetter at claims-tabellen lar brukeren lese egne rader (RLS).
    const { data: claim } = await supabase
      .from("claims")
      .select("id,status")
      .eq("company_id", companyId)
      .eq("user_id", user.id)
      .maybeSingle<ClaimRow>();

    setClaimStatus(claim?.status ?? null);
    setLoading(false);
  }

  useEffect(() => {
    refresh();

    const supabase = supabaseBrowser();
    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      refresh();
    });

    return () => sub.subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyId]);

  // ✅ Hvis claim er godkjent → vis kun "Rediger profil"
  const isApproved = (claimStatus ?? "").toLowerCase() === "approved";

  return (
    <div className="flex flex-col gap-3">
      {!loggedIn ? (
        <>
          <Link
  href={`/auth?mode=signup&next=${encodeURIComponent(
  `/me?claim=${encodeURIComponent(`/claim/company/${companySlug}`)}`
)}`}


  className="rounded-xl bg-[rgb(var(--fg))] text-[rgb(var(--bg))] px-4 py-2.5 text-sm font-semibold hover:opacity-90 transition text-center"
>
  Opprett konto for å claime
</Link>


          <Link
            href="/admin/submit"
            className="rounded-xl border border-[rgb(var(--border))] px-4 py-2.5 text-sm font-semibold hover:shadow-soft transition text-center"
          >
            Tips oss om endringer
          </Link>
        </>
      ) : loading ? (
        <div className="text-sm text-[rgb(var(--muted))]">Laster…</div>
      ) : isApproved ? (
        // ✅ Her: bare én knapp
        <Link
          href={`/me/company/${companyId}`}
          className="rounded-xl bg-[rgb(var(--fg))] text-[rgb(var(--bg))] px-4 py-2.5 text-sm font-semibold hover:opacity-90 transition text-center"
        >
          Rediger profil
        </Link>
      ) : (
        <>
          <Link
            href={`/claim/company/${companySlug}`}

            className="rounded-xl bg-[rgb(var(--fg))] text-[rgb(var(--bg))] px-4 py-2.5 text-sm font-semibold hover:opacity-90 transition text-center"
          >
            Claim
          </Link>

          <Link
            href="/admin/submit"
            className="rounded-xl border border-[rgb(var(--border))] px-4 py-2.5 text-sm font-semibold hover:shadow-soft transition text-center"
          >
            Tips oss om endringer
          </Link>
        </>
      )}
    </div>
  );
}
