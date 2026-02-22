import SectionListPage from "../_components/SectionListPage";
import { listKiOpplaringByType } from "@/lib/ki-opplaring/content";
import { siteMeta } from "@/lib/seo";

export const metadata = siteMeta({
  title: "KI Opplæring tema | Læringshuber for kreativ KI",
  description: "Tema-huber med strukturert læringssti for markedsføring, video, prompting og workflow.",
  path: "/ki-opplaring/tema",
});

export default async function KiOpplaringTemaPage() {
  const entries = await listKiOpplaringByType("tema");

  return (
    <SectionListPage
      title="Tema"
      description="Læringshuber som samler guider, verktøy og ordliste i anbefalt progresjon."
      sectionHref="/ki-opplaring/tema"
      entries={entries}
      emptyText="Ingen tema-huber er publisert ennå."
    />
  );
}
