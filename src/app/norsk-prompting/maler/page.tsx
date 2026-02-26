import { modelTemplateCategories } from "@/data/norskPrompting/modelPlaybooks";
import ModelPlaybooksTabs from "../_components/ModelPlaybooksTabs";
import NorskPromptingShell from "../_components/NorskPromptingShell";
import { siteMeta } from "@/lib/seo";
import { absoluteUrl, buildArticleJsonLd, buildBreadcrumbJsonLd } from "@/lib/norsk-prompting/seo";

export const metadata = siteMeta({
  title: "Maler | Norsk Prompting",
  description: "Dokumentasjonsbaserte modellmaler for bilde, video og lyd. Fokus på struktur, regler og modellatferd.",
  path: "/norsk-prompting/maler",
});

export default function NorskPromptingMalerPage() {
  const description =
    "Maler er modellspesifikke oppskrifter basert på dokumentasjon. De beskriver hvordan modellen faktisk skal promptes for kontrollerbar produksjon.";

  return (
    <NorskPromptingShell
      currentPath="/norsk-prompting/maler"
      title="Maler"
      description={description}
      jsonLd={[
        buildArticleJsonLd({
          headline: "Norsk Prompting-maler",
          description,
          path: "/norsk-prompting/maler",
          dateModified: "2026-02-26",
        }),
        buildBreadcrumbJsonLd([
          { name: "Forside", item: absoluteUrl("/") },
          { name: "Norsk Prompting", item: absoluteUrl("/norsk-prompting") },
          { name: "Maler", item: absoluteUrl("/norsk-prompting/maler") },
        ]),
      ]}
    >
      <section className="grid gap-3 lg:grid-cols-2">
        <article className="np-node-surface rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))]/90 p-4 pt-7">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">Formål</p>
          <p className="mt-2 text-sm text-[rgb(var(--fg))]/90">
            Maler skal beskrive modellens operative arbeidsmåte: dokumentasjonsbasert struktur, styrker, svakheter, typiske feil og beste promptsekvens.
          </p>
        </article>
        <article className="np-node-surface rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))]/90 p-4 pt-7">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">Avgrensning</p>
          <p className="mt-2 text-sm text-[rgb(var(--fg))]/90">
            Maler er ikke ferdige prompts. Ferdige prompts med dokumentert resultat ligger under fanen Eksempler.
          </p>
        </article>
      </section>

      <ModelPlaybooksTabs categories={modelTemplateCategories} />
    </NorskPromptingShell>
  );
}
