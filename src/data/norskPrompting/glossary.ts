import { slugify } from "@/lib/slug";
import type { GlossaryDomain, GlossaryTerm } from "./types";

type Seed = {
  no: string;
  en: string;
  focus: string;
};

const seedByDomain: Record<GlossaryDomain, Seed[]> = {
  arch: [
    { no: "plan", en: "plan", focus: "romlig organisering" },
    { no: "snitt", en: "section", focus: "vertikal lesbarhet" },
    { no: "volum", en: "mass", focus: "formhierarki" },
    { no: "materialitet", en: "materiality", focus: "overflaterespons" },
    { no: "modul", en: "module", focus: "rytme og repetisjon" },
    { no: "akse", en: "axis", focus: "romlig retning" },
    { no: "siktlinje", en: "sightline", focus: "visuell flyt" },
    { no: "skala", en: "scale", focus: "menneskelig proporsjon" },
    { no: "fasade", en: "facade", focus: "utvendig lesbarhet" },
    { no: "atrium", en: "atrium", focus: "vertikal romfølelse" },
    { no: "bæresystem", en: "structural system", focus: "konstruktiv logikk" },
    { no: "takfall", en: "roof pitch", focus: "vannavrenning" },
    { no: "sokkel", en: "plinth", focus: "forankring mot terreng" },
    { no: "parametrisk", en: "parametric", focus: "regelstyrt geometri" },
    { no: "brutalisme", en: "brutalism", focus: "massiv materialkarakter" },
    { no: "program", en: "program", focus: "funksjonell bruk" },
    { no: "transparens", en: "transparency", focus: "visuell porøsitet" },
    { no: "kjerne", en: "core", focus: "vertikal logistikk" },
    { no: "forplass", en: "forecourt", focus: "ankomstsekvens" },
    { no: "tetthet", en: "density", focus: "urban kapasitet" },
  ],
  film: [
    { no: "etableringsbilde", en: "establishing shot", focus: "romlig orientering" },
    { no: "nærbilde", en: "close-up", focus: "emosjonell vekt" },
    { no: "halvnær", en: "medium close-up", focus: "ansikt og gest" },
    { no: "over skulder", en: "over the shoulder", focus: "dialoggeografi" },
    { no: "POV", en: "point of view", focus: "subjektivt blikk" },
    { no: "dolly", en: "dolly", focus: "kontrollert fremdrift" },
    { no: "tracking", en: "tracking", focus: "bevegelsesfølging" },
    { no: "locked-off", en: "locked-off", focus: "stabil komposisjon" },
    { no: "håndholdt", en: "handheld", focus: "taktil realisme" },
    { no: "rack focus", en: "rack focus", focus: "fokusovergang" },
    { no: "parallax", en: "parallax", focus: "dybdeopplevelse" },
    { no: "180-gradersregel", en: "180-degree rule", focus: "aksestabilitet" },
    { no: "shot reverse shot", en: "shot reverse shot", focus: "dialogrytme" },
    { no: "motivert bevegelse", en: "motivated movement", focus: "narrativ funksjon" },
    { no: "master shot", en: "master shot", focus: "dekningsgrunnlag" },
    { no: "insert", en: "insert", focus: "detaljinformasjon" },
    { no: "cutaway", en: "cutaway", focus: "rytme og kontekst" },
    { no: "bildelinje", en: "eye line", focus: "blikkontinuitet" },
    { no: "frame rate", en: "frame rate", focus: "bevegelseskarakter" },
    { no: "lukkertid", en: "shutter speed", focus: "motion blur-kontroll" },
  ],
  vfx: [
    { no: "compositing", en: "compositing", focus: "lagbasert sammensetting" },
    { no: "roto", en: "rotoscoping", focus: "maskering av motiv" },
    { no: "matte painting", en: "matte painting", focus: "utvidelse av miljø" },
    { no: "z-depth", en: "z-depth", focus: "dybdedata" },
    { no: "AOV", en: "arbitrary output variables", focus: "render-separasjon" },
    { no: "keying", en: "keying", focus: "bakgrunnsutskilling" },
    { no: "spill suppression", en: "spill suppression", focus: "fargelekkasje-kontroll" },
    { no: "tracking marker", en: "tracking marker", focus: "kamerasporing" },
    { no: "camera solve", en: "camera solve", focus: "3D-kamerarekonstruksjon" },
    { no: "grain matching", en: "grain matching", focus: "teksturintegrasjon" },
    { no: "plate", en: "plate", focus: "kildemateriale" },
    { no: "clean plate", en: "clean plate", focus: "bakgrunn uten motiv" },
    { no: "paint-out", en: "paint-out", focus: "fjerning av elementer" },
    { no: "deep compositing", en: "deep compositing", focus: "dybdeinformert sammenstilling" },
    { no: "LUT", en: "look-up table", focus: "fargekonsistens" },
    { no: "ACES", en: "ACES", focus: "fargestyring" },
    { no: "motion vector", en: "motion vector", focus: "bevegelsesdata" },
    { no: "denoise", en: "denoise", focus: "støyreduksjon" },
    { no: "render pass", en: "render pass", focus: "kontrollerbar etterbehandling" },
    { no: "relighting", en: "relighting", focus: "lysendring i post" },
  ],
  ai: [
    { no: "consistency lock", en: "consistency lock", focus: "stabil struktur" },
    { no: "negative prompt", en: "negative prompt", focus: "uønsket innhold" },
    { no: "seed", en: "seed", focus: "reproduserbarhet" },
    { no: "temporal coherence", en: "temporal coherence", focus: "stabil video over tid" },
    { no: "object permanence", en: "object permanence", focus: "objektkontinuitet" },
    { no: "prompt chaining", en: "prompt chaining", focus: "sekvensiell kontroll" },
    { no: "inpainting", en: "inpainting", focus: "lokal redigering" },
    { no: "outpainting", en: "outpainting", focus: "utvidelse av lerret" },
    { no: "control map", en: "control map", focus: "strukturell styring" },
    { no: "latentrom", en: "latent space", focus: "modellens representasjon" },
    { no: "token-presisjon", en: "token precision", focus: "språklig styring" },
    { no: "hallusinasjon", en: "hallucination", focus: "faktabrudd og detaljfeil" },
    { no: "styrkeparameter", en: "strength", focus: "transformasjonsgrad" },
    { no: "samplingssteg", en: "sampling steps", focus: "iterasjonsdybde" },
    { no: "guidance scale", en: "guidance scale", focus: "prompt-lojalitet" },
    { no: "adapter", en: "adapter", focus: "stil- og karakterkontroll" },
    { no: "referansebilde", en: "reference image", focus: "visuell forankring" },
    { no: "identitetsanker", en: "identity anchor", focus: "karakterstabilitet" },
    { no: "regel-lås", en: "rule lock", focus: "rammeverksstyring" },
    { no: "prompt-arkitektur", en: "prompt architecture", focus: "seksjonsstruktur" },
  ],
  photo: [
    { no: "key light", en: "key light", focus: "primærmodellering" },
    { no: "fill light", en: "fill light", focus: "skyggeløft" },
    { no: "rim light", en: "rim light", focus: "separasjon fra bakgrunn" },
    { no: "softbox", en: "softbox", focus: "myk lysflate" },
    { no: "hard light", en: "hard light", focus: "kontrast og skyggekant" },
    { no: "volumetrisk lys", en: "volumetric light", focus: "lys i partikler" },
    { no: "fargetemperatur", en: "color temperature", focus: "lyskonsistens" },
    { no: "hvitbalanse", en: "white balance", focus: "fargenøytralitet" },
    { no: "eksponering", en: "exposure", focus: "tonal kontroll" },
    { no: "dynamisk område", en: "dynamic range", focus: "detalj i høylys/skygge" },
    { no: "ISO", en: "ISO", focus: "støy og sensitivitet" },
    { no: "blender", en: "aperture", focus: "dybdeskarphet" },
    { no: "bokeh", en: "bokeh", focus: "bakgrunnskarakter" },
    { no: "polariseringsfilter", en: "polarizing filter", focus: "reflekskontroll" },
    { no: "ND-filter", en: "ND filter", focus: "lysreduksjon" },
    { no: "chiaroscuro", en: "chiaroscuro", focus: "dramaturgisk lyskontrast" },
    { no: "specular highlight", en: "specular highlight", focus: "glanspunkt" },
    { no: "diffus refleksjon", en: "diffuse reflection", focus: "matte overflater" },
    { no: "motlys", en: "backlight", focus: "silhuett og separasjon" },
    { no: "fargegjengivelse", en: "color rendering", focus: "materialtrohet" },
  ],
  design: [
    { no: "gridsystem", en: "grid system", focus: "layoutkontroll" },
    { no: "hierarki", en: "visual hierarchy", focus: "informasjonsrekkefølge" },
    { no: "mikrointeraksjon", en: "microinteraction", focus: "brukerrespons" },
    { no: "motion curve", en: "motion curve", focus: "animasjonskarakter" },
    { no: "easing", en: "easing", focus: "tidsopplevelse" },
    { no: "design token", en: "design token", focus: "konsistent styling" },
    { no: "kontrastforhold", en: "contrast ratio", focus: "lesbarhet" },
    { no: "whitespace", en: "whitespace", focus: "luft og rytme" },
    { no: "komponenttilstand", en: "component state", focus: "interaksjonslogikk" },
    { no: "responsivt bruddpunkt", en: "responsive breakpoint", focus: "skalerbarhet" },
    { no: "navigasjonsdybde", en: "navigation depth", focus: "finnbarhet" },
    { no: "scenehierarki", en: "scene hierarchy", focus: "lagstruktur i motion" },
    { no: "maskering", en: "masking", focus: "kontrollert avdekking" },
    { no: "timing", en: "timing", focus: "narrativ rytme" },
    { no: "staging", en: "staging", focus: "fokus på handling" },
    { no: "kognitiv last", en: "cognitive load", focus: "mental belastning" },
    { no: "interaksjonsmønster", en: "interaction pattern", focus: "forutsigbar adferd" },
    { no: "sekvenskart", en: "sequence map", focus: "trinnstyring" },
    { no: "tilbakemeldingssløyfe", en: "feedback loop", focus: "forståelig respons" },
    { no: "systemtone", en: "system voice", focus: "språklig konsistens" },
  ],
};

const domainLabel: Record<GlossaryDomain, string> = {
  arch: "arkitektur og rom",
  film: "film og kamera",
  vfx: "VFX og post",
  ai: "AI-produksjon",
  photo: "lys og foto",
  design: "design og UX",
};

const termsDraft: GlossaryTerm[] = Object.entries(seedByDomain).flatMap(([domain, entries]) => {
  const domainKey = domain as GlossaryDomain;

  return entries.map((entry, index) => {
    const slug = `${slugify(entry.no)}-${domainKey}`;

    return {
      slug,
      term_no: entry.no,
      term_en: entry.en,
      domain: domainKey,
      definition_no: `${entry.no} er et begrep i ${domainLabel[domainKey]} som brukes for å styre ${entry.focus} presist i prompten.`,
      promptImpact: `Når du bruker ${entry.no} eksplisitt får modellen tydeligere kontroll på ${entry.focus}, med mindre tilfeldig AI-look.`,
      examples: [
        `Legg inn ${entry.no} som eget punkt i prompt-strukturen før constraints.`,
        `Bruk ${entry.no} sammen med konkret miljø og kameraregler for mer stabil output.`,
        `Test variant A/B der kun ${entry.no} endres, og hold resten låst.`,
      ],
      relatedTerms: [],
    };
  });
});

const relatedLookup = new Map<string, string[]>();

for (const [domain, entries] of Object.entries(seedByDomain)) {
  const domainKey = domain as GlossaryDomain;
  const slugs = entries.map((entry) => `${slugify(entry.no)}-${domainKey}`);

  slugs.forEach((slug, index) => {
    relatedLookup.set(
      slug,
      [slugs[index - 1], slugs[index + 1], slugs[index + 2]].filter(Boolean) as string[]
    );
  });
}

export const glossaryTerms: GlossaryTerm[] = termsDraft
  .map((entry) => ({
    ...entry,
    relatedTerms: relatedLookup.get(entry.slug) ?? [],
  }))
  .sort((a, b) => a.term_no.localeCompare(b.term_no, "nb-NO"));

export const glossaryBySlug = Object.fromEntries(
  glossaryTerms.map((entry) => [entry.slug, entry])
);

export const glossaryDomains = Array.from(new Set(glossaryTerms.map((entry) => entry.domain)));
