import { siteMeta } from "@/lib/seo";
import { toEntryKey } from "@/lib/ki-opplaring/keys";
import {
  getKiOpplaringCounts,
  listAllKiOpplaringEntries,
  listKiOpplaringTopicCards,
} from "@/lib/ki-opplaring/content";
import TrainingWorkspace from "./_components/TrainingWorkspace";

export const metadata = siteMeta({
  title: "KI Opplæring | Praktiske guider for kreativ og kommersiell KI",
  description:
    "Strukturert opplæring i kreativ KI for byrå, markedsavdelinger, innholdsprodusenter, SMB og offentlig kommunikasjon.",
  path: "/ki-opplaring",
});

export default async function KiOpplaringHubPage() {
  let counts = { total: 0, guider: 0, tema: 0, verktoy: 0, ordliste: 0 };
  let allEntries = [] as Awaited<ReturnType<typeof listAllKiOpplaringEntries>>;
  let topicCards = [] as Awaited<ReturnType<typeof listKiOpplaringTopicCards>>;

  try {
    [counts, allEntries, topicCards] = await Promise.all([
      getKiOpplaringCounts(),
      listAllKiOpplaringEntries(),
      listKiOpplaringTopicCards(),
    ]);
  } catch (error) {
    console.error("[ki-opplaring] Hub fallback aktivert pga innlastingsfeil", error);
  }

  const entries = allEntries.map((entry) => ({
    id: toEntryKey(entry.type, entry.slug),
    entryKey: toEntryKey(entry.type, entry.slug),
    slug: entry.slug,
    title: entry.title,
    description: entry.description,
    url: entry.url,
    type: entry.type,
    topics: entry.topics,
    tools: entry.tools,
    audience: entry.audience,
    level: entry.level,
    updatedAt: entry.updatedAt,
    readingTimeMinutes: entry.readingTimeMinutes,
    exercises: entry.exercises,
    estimatedMinutes: entry.estimatedMinutes,
    templates: entry.templates,
  }));

  return <TrainingWorkspace counts={counts} entries={entries} topicCards={topicCards} />;
}
