import SectionListPage from "../_components/SectionListPage";
import { listKiOpplaringByType } from "@/lib/ki-opplaring/content";
import { siteMeta } from "@/lib/seo";

export const metadata = siteMeta({
  title: "KI Opplæring guider | Praktisk bruk av kreativ KI",
  description: "Praktiske guider for AI-drevet reklame, innholdsproduksjon, briefing og workflow.",
  path: "/ki-opplaring/guider",
});

export default async function KiOpplaringGuiderPage() {
  const entries = await listKiOpplaringByType("guider");

  return (
    <SectionListPage
      title="Guider"
      description="Konkrete gjennomganger for produksjon, prompting, brief og kvalitetssikring i kommersiell KI-arbeid."
      sectionHref="/ki-opplaring/guider"
      entries={entries}
      emptyText="Ingen guider er publisert ennå."
    />
  );
}
