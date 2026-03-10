import { marketingSkills } from "@/data/norskPrompting/runtime";
import NorskPromptingShell from "../../_components/NorskPromptingShell";
import CampaignAssistentClient from "./_components/CampaignAssistentClient";
import { siteMeta } from "@/lib/seo";
import { absoluteUrl, buildArticleJsonLd, buildBreadcrumbJsonLd } from "@/lib/norsk-prompting/seo";

export const metadata = siteMeta({
  title: "Kampanje-assistent | Marketing Skills",
  description:
    "Beskriv kampanjen din og få KI-drevne anbefalinger for hvilke markedsføringsferdigheter du trenger. Basert på 32 ekspertferdigheter.",
  path: "/norsk-prompting/marketing-skills/kampanje-assistent",
});

export default function KampanjeAssistentPage() {
  const skillLookup = Object.fromEntries(
    marketingSkills.map((skill) => [
      skill.slug,
      {
        slug: skill.slug,
        title_no: skill.title_no,
        name: skill.name,
        category: skill.category,
      },
    ])
  );

  const description =
    "Samtale med en KI-drevet markedsføringsrådgiver. Beskriv kampanjen din og få prioriterte anbefalinger med fokus på gratistiltak, effekt/innsats-matrise og konkrete handlingsplaner.";

  return (
    <NorskPromptingShell
      currentPath="/norsk-prompting/marketing-skills"
      title="Kampanje-assistent"
      description={description}
      jsonLd={[
        buildArticleJsonLd({
          headline: "Kampanje-assistent — KI-drevet markedsføringsrådgivning",
          description,
          path: "/norsk-prompting/marketing-skills/kampanje-assistent",
          dateModified: "2026-03-08",
        }),
        buildBreadcrumbJsonLd([
          { name: "Forside", item: absoluteUrl("/") },
          { name: "Norsk Prompting", item: absoluteUrl("/norsk-prompting") },
          { name: "Marketing Skills", item: absoluteUrl("/norsk-prompting/marketing-skills") },
          {
            name: "Kampanje-assistent",
            item: absoluteUrl("/norsk-prompting/marketing-skills/kampanje-assistent"),
          },
        ]),
      ]}
    >
      <CampaignAssistentClient skillLookup={skillLookup} />
    </NorskPromptingShell>
  );
}
