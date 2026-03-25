import AlgorithmsWorkbench from "../_components/AlgorithmsWorkbench";
import NorskPromptingShell from "../_components/NorskPromptingShell";
import { siteMeta } from "@/lib/seo";
import { absoluteUrl, buildArticleJsonLd, buildBreadcrumbJsonLd } from "@/lib/norsk-prompting/seo";

export const metadata = siteMeta({
  title: "Algoritmer og kampanjeplanlegging | Norsk Prompting",
  description:
    "Evidensbasert KI-akademiverktøy for sosiale medier: forstå discovery, planlegg kampanjer og diagnoser hvorfor innhold stopper.",
  path: "/norsk-prompting/algoritmer",
});

export default function NorskPromptingAlgoritmerPage() {
  const description =
    "Algoritmer og kampanjeplanlegging er en levende kunnskapsbase for hvordan discovery fungerer i Instagram, YouTube, TikTok, Facebook og LinkedIn. Verktøyet kobler kilder, claims, planlegging og diagnose i én arbeidsflate for elever og lærere.";

  return (
    <NorskPromptingShell
      currentPath="/norsk-prompting/algoritmer"
      title="Algoritmer"
      description={description}
      jsonLd={[
        buildArticleJsonLd({
          headline: "Algoritmer og kampanjeplanlegging i KI-akademi",
          description,
          path: "/norsk-prompting/algoritmer",
          dateModified: "2026-03-10",
        }),
        buildBreadcrumbJsonLd([
          { name: "Forside", item: absoluteUrl("/") },
          { name: "Norsk Prompting", item: absoluteUrl("/norsk-prompting") },
          { name: "Algoritmer", item: absoluteUrl("/norsk-prompting/algoritmer") },
        ]),
      ]}
    >
      <AlgorithmsWorkbench />
    </NorskPromptingShell>
  );
}
