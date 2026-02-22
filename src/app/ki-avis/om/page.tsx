import Link from "next/link";
import { Bodoni_Moda, Manrope, Source_Serif_4 } from "next/font/google";
import { siteMeta } from "@/lib/seo";

const masthead = Bodoni_Moda({
  subsets: ["latin"],
  weight: ["500", "700"],
});

const headline = Source_Serif_4({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const uiSans = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata = siteMeta({
  title: "Om Aivisen | KiR Nyheter",
  description:
    "Hva er en aivis: hvordan KiR Nyheter bruker KI-crawler, sammenfatning og oversettelse med tydelige kilder og disclaimere.",
  path: "/ki-avis/om",
});

export default function KIRAvisOmPage() {
  return (
    <main className={`${uiSans.className} min-h-screen bg-[#f1ede4] text-[#191919]`}>
      <header className="border-y border-black/20 bg-[#f6f2e9]">
        <div className="mx-auto max-w-[1260px] border-b border-black/15 px-3 py-2 text-[10px] uppercase tracking-[0.21em] text-black/65 md:px-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span>KiR Nyheter · Om Aivisen</span>
            <span>AIVISA DRIVES AV CUZ MEDIA AS</span>
          </div>
        </div>

        <div className="mx-auto max-w-[1260px] px-3 py-4 md:px-4 md:py-5">
          <div className="grid items-end gap-3 border-b border-black/20 pb-3 md:grid-cols-[1fr_auto]">
            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-black/55">Nasjonal dekning av KI i markedet</p>
              <h1 className={`${masthead.className} mt-1 text-[clamp(2.2rem,8vw,4.2rem)] leading-[0.95]`}>
                Om Aivisen
              </h1>
              <p className="mt-2 text-[11px] uppercase tracking-[0.17em] text-black/60">
                Hva en aivis er, og hvordan den lages
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-[12px] font-semibold uppercase tracking-[0.14em]">
              <Link href="/ki-opplaring/nyheter" className="underline underline-offset-4 hover:opacity-80">
                Nyhetsfeed
              </Link>
              <Link href="/ki-opplaring" className="underline underline-offset-4 hover:opacity-80">
                KI Opplæring
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1260px] px-3 py-6 md:px-4">
        <section className="mb-4 border border-black/25 bg-[#fff8e8] px-4 py-3 text-[12px] uppercase tracking-[0.12em] text-black/70">
          Denne seksjonen er nå en del av{" "}
          <Link href="/ki-opplaring" className="font-semibold underline underline-offset-4">
            KI Opplæring
          </Link>
          .
        </section>

        <section className="grid gap-4 border-y border-black/20 py-4 lg:grid-cols-[1.25fr_0.9fr]">
          <article className="min-w-0 border-b border-black/15 pb-4 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-6">
            <h2 className={`${headline.className} text-[30px] leading-[1.03] md:text-[40px]`}>Hva er en aivis?</h2>
            <p className="mt-3 text-[16px] leading-relaxed text-black/78">
              KiR Nyheter er en aivis: en redaksjonell publisering som bruker KI i innsamlings- og
              produksjonsflyt, med tydelige kilder og åpen merking når tekst er maskinbehandlet.
              Målet er rask og sporbar dekning av KI-relaterte saker i reklame- og mediemarkedet.
            </p>
            <p className="mt-3 text-[16px] leading-relaxed text-black/78">
              Aivisen henter saker innen KI-reklame, KI-media, KI-markedsføring, KI-byrå og
              tilhørende bransjedebatt. Den fanger både kritikk og satsinger, og strukturerer stoffet
              til lesbar nyhetsform med tydelig lenke til originalkilden.
            </p>
          </article>

          <aside className="min-w-0 border border-black/20 bg-[#f8f4eb] p-4">
            <h2 className={`${masthead.className} text-[28px] sm:text-[32px]`}>Kortversjon</h2>
            <ul className="mt-3 space-y-2 text-[14px] leading-relaxed text-black/78">
              <li>1. KI-crawler henter relevante kilder.</li>
              <li>2. Saker sammenfattes til ingress og redaksjonell tekst.</li>
              <li>3. Internasjonale saker oversettes til norsk bokmål.</li>
              <li>4. Originalkilde oppgis alltid i hver sak.</li>
              <li>5. Disclaimere vises når KI har generert eller oversatt tekst.</li>
            </ul>
          </aside>
        </section>

        <section className="mt-5 grid gap-4 md:grid-cols-2">
          <article className="border border-black/20 bg-[#f8f4eb] p-4">
            <h3 className={`${headline.className} text-[30px] leading-none`}>Metode</h3>
            <p className="mt-3 text-[15px] leading-relaxed text-black/76">
              Kildesøk og crawling skjer maskinelt etter faste temaer. KI brukes til å trekke ut
              hovedpunkter, lage korte sammenfatninger og foreslå redaksjonell struktur. For
              internasjonale tekster brukes maskinoversettelse til norsk bokmål.
            </p>
          </article>

          <article className="border border-black/20 bg-[#f8f4eb] p-4">
            <h3 className={`${headline.className} text-[30px] leading-none`}>Åpenhet</h3>
            <p className="mt-3 text-[15px] leading-relaxed text-black/76">
              Aivisen republiserer ikke fulltekst fra kilder uten rettigheter. Den viser tittel,
              sammenfatning og lenke til originalkilden. Der tekst er oversatt eller generert med KI,
              merkes dette tydelig i saken.
            </p>
          </article>
        </section>

        <section className="mt-5 border border-black/20 bg-[#f8f4eb] p-4">
          <h3 className={`${headline.className} text-[30px] leading-none`}>Disclaimer</h3>
          <p className="mt-3 text-[15px] leading-relaxed text-black/76">
            Denne OM-teksten er skrevet av KI og publisert som del av aivisens egne prinsipper for
            åpenhet om bruk av kunstig intelligens.
          </p>
        </section>
      </div>
    </main>
  );
}
