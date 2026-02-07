// src/app/admin/outreach/page.tsx
import { requireAdmin } from "@/lib/supabase/server";
import OutreachApp from "./outreach-app";

export const dynamic = "force-dynamic";

export default async function AdminOutreachPage() {
  await requireAdmin();

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <OutreachApp />
    </main>
  );
}
