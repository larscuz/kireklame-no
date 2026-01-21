// src/app/admin/companies/page.tsx
import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export default async function AdminCompaniesPage() {
  // NB: I dette prosjektet er supabaseAdmin en funksjon som må kalles
  const db = supabaseAdmin();

  // Enkel liste: hent siste 100 bedrifter
  const { data, error } = await db
    .from("companies")
    .select(
      `
      id,
      name,
      slug,
      location_id,
      locations:location_id (
        name,
        slug
      )
    `
    )
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    return (
      <div style={{ padding: 24 }}>
        <h1>Companies</h1>
        <pre style={{ whiteSpace: "pre-wrap" }}>{error.message}</pre>
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>Companies</h1>

      <p style={{ opacity: 0.8 }}>
        Viser siste 100. Klikk “Rediger” for å åpne bedriften.
      </p>

      <div style={{ display: "grid", gap: 12 }}>
        {(data ?? []).map((c: any) => (
          <div
            key={c.id}
            style={{
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: 12,
              padding: 12,
            }}
          >
            <div style={{ fontWeight: 700 }}>{c.name ?? "—"}</div>
            <div style={{ opacity: 0.8, fontSize: 14 }}>
              Location: {c.locations?.name ?? "—"}
            </div>

            <div style={{ marginTop: 8, display: "flex", gap: 12 }}>
              {c.slug ? (
                <Link href={`/selskap/${c.slug}`}>Se offentlig side</Link>

              ) : (
                <span style={{ opacity: 0.6 }}>Ingen offentlig URL</span>
              )}
              <Link href={`/admin/companies/${c.id}`}>Rediger</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
