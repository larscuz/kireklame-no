import type { Metadata } from "next";
import { siteMeta } from "@/lib/seo";
import AuthPanel from "@/app/_components/AuthPanel";

export const metadata: Metadata = siteMeta({
  title: "Logg inn – KiReklame.no",
  description: "Logg inn for å claime og oppdatere profiler.",
  path: "/auth",
});

export default async function AuthPage({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = (await searchParams) ?? {};
  const errRaw = sp.error;
  const err =
    typeof errRaw === "string" && errRaw.length > 0
      ? decodeURIComponent(errRaw)
      : null;

        const modeRaw = sp.mode;
const mode = modeRaw === "signup" ? "signup" : "signin";



  return (
    <div className="mx-auto max-w-md px-4 py-14">
      <h1 className="text-3xl font-semibold tracking-tight">
  {mode === "signup" ? "Opprett konto" : "Logg inn"}
</h1>
<p className="mt-2 text-[rgb(var(--muted))]">
  {mode === "signup"
    ? "Opprett konto for å claime bedriften. Du vil få en e-post fra Supabase som du må bekrefte første gang."
    : "Første gang må du bekrefte e-post. Etterpå logger du inn med passord."}
</p>


      {err ? (
        <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {err}
        </div>
      ) : null}

      <div className="mt-6">
        <AuthPanel initialMode={mode} />

      </div>
    </div>
  );
}
