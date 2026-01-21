"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/client";

export default function SignOutButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  return (
    <button
      type="button"
      disabled={loading}
      onClick={async () => {
        setLoading(true);
        const supabase = supabaseBrowser();
        await supabase.auth.signOut();
        setLoading(false);
        router.push("/auth");
        router.refresh();
      }}
      className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-4 py-2 text-sm font-semibold hover:opacity-90 transition disabled:opacity-60"
    >
      {loading ? "Logger ut…" : "Logg ut"}
    </button>
  );
}
