import SectionListPage from "../_components/SectionListPage";
import { listKiOpplaringByType } from "@/lib/ki-opplaring/content";
import { siteMeta } from "@/lib/seo";

export const metadata = siteMeta({
  title: "KI Opplæring ordliste | Begreper forklart enkelt",
  description: "Kort og presis ordliste for begreper i kreativ og kommersiell KI-produksjon.",
  path: "/ki-opplaring/ordliste",
});

export default async function KiOpplaringOrdlistePage() {
  const entries = await listKiOpplaringByType("ordliste");

  return (
    <SectionListPage
      title="Ordliste"
      description="Fagbegreper forklart kort, med internlenking til guider og verktøy."
      sectionHref="/ki-opplaring/ordliste"
      entries={entries}
      emptyText="Ingen ordliste-innslag er publisert ennå."
    />
  );
}
