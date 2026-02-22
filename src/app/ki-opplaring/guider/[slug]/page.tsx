import type { Metadata } from "next";
import { notFound } from "next/navigation";
import EntryDetailPage from "../../_components/EntryDetailPage";
import { getKiOpplaringEntry, listKiOpplaringByType, listRelatedKiOpplaringEntries } from "@/lib/ki-opplaring/content";
import { buildKiOpplaringEntryMetadata } from "@/lib/ki-opplaring/seo";
import { siteMeta } from "@/lib/seo";

export async function generateStaticParams() {
  const entries = await listKiOpplaringByType("guider");
  return entries.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const entry = await getKiOpplaringEntry("guider", slug);
  if (!entry) {
    return siteMeta({
      title: "Guide ikke funnet | KI Opplæring",
      description: "Guiden finnes ikke eller er ikke publisert.",
      path: `/ki-opplaring/guider/${slug}`,
    });
  }
  return buildKiOpplaringEntryMetadata(entry);
}

export default async function KiOpplaringGuideDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = await getKiOpplaringEntry("guider", slug);
  if (!entry) notFound();

  const related = await listRelatedKiOpplaringEntries(entry, 4);

  return <EntryDetailPage entry={entry} related={related} sectionHref="/ki-opplaring/guider" sectionTitle="Guider" />;
}
