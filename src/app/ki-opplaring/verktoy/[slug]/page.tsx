import type { Metadata } from "next";
import { notFound } from "next/navigation";
import EntryDetailPage from "../../_components/EntryDetailPage";
import { getKiOpplaringEntry, listKiOpplaringByType, listRelatedKiOpplaringEntries } from "@/lib/ki-opplaring/content";
import { buildKiOpplaringEntryMetadata } from "@/lib/ki-opplaring/seo";
import { siteMeta } from "@/lib/seo";

export async function generateStaticParams() {
  const entries = await listKiOpplaringByType("verktoy");
  return entries.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const entry = await getKiOpplaringEntry("verktoy", slug);
  if (!entry) {
    return siteMeta({
      title: "Verktøy-side ikke funnet | KI Opplæring",
      description: "Verktøy-siden finnes ikke eller er ikke publisert.",
      path: `/ki-opplaring/verktoy/${slug}`,
    });
  }
  return buildKiOpplaringEntryMetadata(entry);
}

export default async function KiOpplaringVerktoyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = await getKiOpplaringEntry("verktoy", slug);
  if (!entry) notFound();

  const related = await listRelatedKiOpplaringEntries(entry, 4);

  return <EntryDetailPage entry={entry} related={related} sectionHref="/ki-opplaring/verktoy" sectionTitle="Verktøy" />;
}
