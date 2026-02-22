import Link from "next/link";
import Checklist from "@/components/ki-opplaring/mdx/Checklist";
import PromptExercise from "@/components/ki-opplaring/mdx/PromptExercise";
import PromptTransform from "@/components/ki-opplaring/mdx/PromptTransform";
import PromptVsMediaExercise from "@/components/ki-opplaring/mdx/PromptVsMediaExercise";
import Script10sExercise from "@/components/ki-opplaring/mdx/Script10sExercise";
import { siteMeta } from "@/lib/seo";
import ExercisesUsagePanel from "./_components/ExercisesUsagePanel";

export const metadata = siteMeta({
  title: "Øvelser | KI Opplæring",
  description:
    "Praktiske KI-øvelser for byrå, innholdsprodusenter og markedsavdelinger. Skriv, test, kopier og lever.",
  path: "/ki-opplaring/ovelser",
});

export default function KiOpplaringOvelserPage() {
  return (
    <main className="min-h-screen bg-[rgb(var(--bg))] text-[rgb(var(--fg))]">
      <section className="border-b border-[rgb(var(--border))] bg-gradient-to-br from-black/10 via-transparent to-black/5 dark:from-white/5 dark:to-transparent">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[rgb(var(--muted))]">
            KI Opplæring · Øvelser
          </p>
          <h1 className="mt-2 text-[clamp(2rem,4vw,3rem)] font-semibold leading-tight tracking-tight">
            Start en øvelse nå
          </h1>
          <p className="mt-3 max-w-3xl text-base text-[rgb(var(--muted))]">
            Dette er en produksjonsflate. Du skal skrive, teste, få output og levere.
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-4">
            <a
              href="#prompt-vs-media"
              className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-4 hover:shadow-lift"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">1</p>
              <p className="mt-1 text-base font-semibold">Prompt vs media</p>
            </a>
            <a
              href="#forbedre-prompt"
              className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-4 hover:shadow-lift"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">2</p>
              <p className="mt-1 text-base font-semibold">Forbedre prompt</p>
            </a>
            <a
              href="#lag-10s-manus"
              className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-4 hover:shadow-lift"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">3</p>
              <p className="mt-1 text-base font-semibold">Lag 10s manus</p>
            </a>
            <a
              href="#darlig-vs-bra"
              className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-4 hover:shadow-lift"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">4</p>
              <p className="mt-1 text-base font-semibold">Dårlig vs bra prompt</p>
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl space-y-10 px-4 py-8 lg:py-10">
        <ExercisesUsagePanel />

        <article id="prompt-vs-media" className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-4 sm:p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">Økt 1</p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight">Prompt vs media: se forskjellen visuelt</h2>
          <p className="mt-3 text-sm"><strong>Mål:</strong> Etter dette kan du dokumentere hvorfor strukturert prompt gir bedre output.</p>
          <p className="mt-1 text-sm"><strong>Du skal lage:</strong> 1 original + 1 forbedret prompt, med side-by-side media.</p>
          <p className="mt-1 text-sm"><strong>Tidsbruk:</strong> 8-15 min</p>

          <div className="mt-3 rounded-xl border border-[rgb(var(--border))] bg-black/5 p-3 text-sm dark:bg-white/5">
            <p className="font-semibold">Trinn</p>
            <ol className="mt-2 list-decimal space-y-1 pl-5">
              <li>Skriv inn en vag prompt.</li>
              <li>Velg bilde eller video.</li>
              <li>Kjør sammenligning.</li>
              <li>Studer endringer og output side ved side.</li>
              <li>Kopier forbedret prompt til produksjon.</li>
            </ol>
          </div>

          <PromptVsMediaExercise id="ovelse-prompt-vs-media-v1" title="Gjør dette nå: Prompt vs media" />

          <Checklist
            id="checklist-ovelse-prompt-vs-media-v1"
            title="Godt nok når"
            items={[
              "Original og forbedret prompt er synlige side om side",
              "Minst tre konkrete endringer er dokumentert",
              "Lys, materiale og constraints er eksplisitt beskrevet",
              "Forbedret prompt er kopiert til videre test",
            ]}
          />
        </article>

        <article id="forbedre-prompt" className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-4 sm:p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">Økt 2</p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight">Forbedre din prompt (1 klikk)</h2>
          <p className="mt-3 text-sm"><strong>Mål:</strong> Etter dette kan du gjøre en vag prompt produksjonsklar.</p>
          <p className="mt-1 text-sm"><strong>Du skal lage:</strong> 1 forbedret prompt + endringslogg.</p>
          <p className="mt-1 text-sm"><strong>Tidsbruk:</strong> 5-10 min</p>

          <div className="mt-3 rounded-xl border border-[rgb(var(--border))] bg-black/5 p-3 text-sm dark:bg-white/5">
            <p className="font-semibold">Trinn</p>
            <ol className="mt-2 list-decimal space-y-1 pl-5">
              <li>Skriv inn original prompt.</li>
              <li>Trykk "Forbedre prompt".</li>
              <li>Trykk "Forklar forbedringen".</li>
              <li>Kopier forbedret prompt.</li>
              <li>Test i verktøyet ditt.</li>
            </ol>
          </div>

          <PromptTransform id="ovelse-transform-v1" title="Gjør dette nå: Forbedre prompt" context="Kampanjebilde for kommersiell bruk" />

          <Checklist
            id="checklist-ovelse-transform-v1"
            title="Godt nok når"
            items={[
              "Prompten har tydelig målgruppe",
              "Format og kanal er spesifisert",
              "Minst to begrensninger er lagt inn",
              "Prompten er testet minst én gang",
              "Forbedret prompt er lagret/kopiert",
            ]}
          />
        </article>

        <article id="lag-10s-manus" className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-4 sm:p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">Økt 3</p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight">Lag et 10s kampanjevideo-manus</h2>
          <p className="mt-3 text-sm"><strong>Mål:</strong> Etter dette kan du levere et produksjonsklart 10-sekunders manus.</p>
          <p className="mt-1 text-sm"><strong>Du skal lage:</strong> Hook + benefit + CTA + shot list + varianter.</p>
          <p className="mt-1 text-sm"><strong>Tidsbruk:</strong> 7-12 min</p>

          <div className="mt-3 rounded-xl border border-[rgb(var(--border))] bg-black/5 p-3 text-sm dark:bg-white/5">
            <p className="font-semibold">Trinn</p>
            <ol className="mt-2 list-decimal space-y-1 pl-5">
              <li>Fyll ut produkt, målgruppe og benefit.</li>
              <li>Velg format og CTA.</li>
              <li>Trykk "Generer 10s manus".</li>
              <li>Kopier manus og test i videoverktøyet ditt.</li>
              <li>Huk av sjekklisten før produksjon.</li>
            </ol>
          </div>

          <Script10sExercise id="ovelse-script-10s-v1" title="Gjør dette nå: Lag 10s manus" />

          <Checklist
            id="checklist-ovelse-script-10s-v1"
            title="Godt nok når"
            items={[
              "Hook (0-2s) er tydelig",
              "Benefit (2-7s) er konkret",
              "CTA (7-10s) er testbar",
              "Shot list har minst 3 shots",
              "Manuset er eksportert og delt",
            ]}
          />
        </article>

        <article id="darlig-vs-bra" className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-4 sm:p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[rgb(var(--muted))]">Økt 4</p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight">Dårlig prompt vs bra prompt - kampanjebilde</h2>
          <p className="mt-3 text-sm"><strong>Mål:</strong> Etter dette kan du se hvorfor struktur slår vaghet.</p>
          <p className="mt-1 text-sm"><strong>Du skal lage:</strong> 1 sammenligning + 1 forbedret produksjonsprompt.</p>
          <p className="mt-1 text-sm"><strong>Tidsbruk:</strong> 8-15 min</p>

          <div className="mt-3 rounded-xl border border-[rgb(var(--border))] bg-black/5 p-3 text-sm dark:bg-white/5">
            <p className="font-semibold">Trinn</p>
            <ol className="mt-2 list-decimal space-y-1 pl-5">
              <li>Skriv en bevisst vag prompt i venstre felt.</li>
              <li>Skriv en strukturert prompt i høyre felt.</li>
              <li>Trykk "Kjør begge".</li>
              <li>Les forskjell og hvorfor-resultat.</li>
              <li>Eksporter markdown og bruk i intern læring.</li>
            </ol>
          </div>

          <PromptExercise id="ovelse-compare-v1" title="Gjør dette nå: Kjør dårlig vs bra" context="Kampanjebilde for norsk SMB-produkt" />

          <Checklist
            id="checklist-ovelse-compare-v1"
            title="Godt nok når"
            items={[
              "Dårlig prompt viser tydelig vaghet",
              "Bra prompt har format + begrensninger",
              "Forskjeller er dokumentert i minst 2 punkter",
              "Bra prompt er kopiert for videre bruk",
            ]}
          />
        </article>

        <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-4 text-sm text-[rgb(var(--muted))]">
          Neste: Legg disse øvelsene inn i guider du bruker ofte, og følg progresjon på
          <Link href="/ki-opplaring" className="ml-1 underline underline-offset-4">
            KI Opplæring-hub
          </Link>
          .
        </div>
      </section>
    </main>
  );
}
