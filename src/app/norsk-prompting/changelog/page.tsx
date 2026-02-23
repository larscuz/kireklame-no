import NorskPromptingShell from "../_components/NorskPromptingShell";
import { siteMeta } from "@/lib/seo";
import { absoluteUrl, buildArticleJsonLd, buildBreadcrumbJsonLd } from "@/lib/norsk-prompting/seo";

export const metadata = siteMeta({
  title: "Changelog | Norsk Prompting",
  description: "Løpende endringslogg for regler, termer, maler og eksempelbibliotek i Norsk Prompting.",
  path: "/norsk-prompting/changelog",
});

const changelog = [
  {
    date: "2026-02-23",
    title: "Lansering av Norsk Prompting",
    details: [
      "Ny hub med prompt-utvider, regler, maler, ordforråd og eksempelbibliotek.",
      "Regeldatabase med 40 maskinlesbare regler.",
      "Ordbase med 120 fagtermer på norsk og engelsk.",
      "Eksempelbibliotek med 20 case og forklaringer.",
    ],
  },
];

export default function NorskPromptingChangelogPage() {
  const description = "Transparens på hva som er lagt til i rammeverket over tid.";

  return (
    <NorskPromptingShell
      currentPath="/norsk-prompting/changelog"
      title="Changelog"
      description={description}
      jsonLd={[
        buildArticleJsonLd({
          headline: "Norsk Prompting changelog",
          description,
          path: "/norsk-prompting/changelog",
          dateModified: "2026-02-23",
        }),
        buildBreadcrumbJsonLd([
          { name: "Forside", item: absoluteUrl("/") },
          { name: "Norsk Prompting", item: absoluteUrl("/norsk-prompting") },
          { name: "Changelog", item: absoluteUrl("/norsk-prompting/changelog") },
        ]),
      ]}
    >
      <div className="space-y-4">
        {changelog.map((entry) => (
          <article key={entry.date} className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">{entry.date}</p>
            <h2 className="mt-1 text-xl font-semibold tracking-tight">{entry.title}</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[rgb(var(--fg))]/85">
              {entry.details.map((detail, index) => (
                <li key={`${entry.date}-${index}`}>{detail}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </NorskPromptingShell>
  );
}
