import SectionListPage from "../_components/SectionListPage";
import { listKiOpplaringByType } from "@/lib/ki-opplaring/content";
import { siteMeta } from "@/lib/seo";

export const metadata = siteMeta({
  title: "KI Opplæring verktøy | Hva bruke, når og hvorfor",
  description: "Verktøysider for kreativ KI med styrker, svakheter og typisk bruk i produksjon.",
  path: "/ki-opplaring/verktoy",
});

export default async function KiOpplaringVerktoyPage() {
  const entries = await listKiOpplaringByType("verktoy");

  return (
    <SectionListPage
      title="Verktøy"
      description="Praktiske vurderinger av verktøy brukt i kampanjeutvikling, AI-video og kreativ produksjon."
      sectionHref="/ki-opplaring/verktoy"
      entries={entries}
      emptyText="Ingen verktøysider er publisert ennå."
    />
  );
}
