import { slugify } from "@/lib/slug";
import type { GlossaryDomain, GlossaryTerm } from "./types";

type Seed = {
  term_no: string;
  term_en: string;
  domain: GlossaryDomain;
  definition_no: string;
  promptImpact: string;
};

const seeds: Seed[] = [
  {
    term_no: "Ortografisk projeksjon",
    term_en: "Orthographic projection",
    domain: "arch",
    definition_no: "Representasjon uten perspektivforvrengning der målforhold holdes flate og teknisk lesbare.",
    promptImpact: "Fjerner perspektivfeil og gjør geometri målbar i arkitektur- og produktskisser.",
  },
  {
    term_no: "Aksonometri",
    term_en: "Axonometric view",
    domain: "arch",
    definition_no: "Parallellprojeksjon som viser volum og struktur uten klassisk perspektivkonvergens.",
    promptImpact: "Bevarer målforhold mellom flater og gjør romforståelse tydelig i tekniske visualiseringer.",
  },
  {
    term_no: "Arkitektonisk elevasjon",
    term_en: "Architectural elevation",
    domain: "arch",
    definition_no: "Ortografisk fasadevisning der vertikale og horisontale målforhold holdes presise.",
    promptImpact: "Låser fasadegeometri og hindrer perspektivdrift i tekniske leveranser.",
  },
  {
    term_no: "Eksplodert visning",
    term_en: "Exploded view",
    domain: "design",
    definition_no: "Komponenter separeres i lag for å vise oppbygging og sammenheng mellom deler.",
    promptImpact: "Synliggjør struktur og monteringslogikk i komplekse produkter og systemer.",
  },
  {
    term_no: "Explodert aksjonometri",
    term_en: "Exploded axonometric",
    domain: "arch",
    definition_no: "Aksonometrisk visning der bygningsdeler trekkes fra hverandre for å vise lag, konstruksjon og sammenheng.",
    promptImpact: "Gjør romlig lagdeling og byggelogikk tydelig uten å miste målbarhet.",
  },
  {
    term_no: "Assembly-Forward",
    term_en: "Assembly-forward",
    domain: "vfx",
    definition_no: "Produksjonsstrategi der lag og pass settes opp for sammensetting tidlig, slik at endringer håndteres i kompositt i stedet for re-render.",
    promptImpact: "Gir mer robust pipeline ved iterasjon, med færre kostbare endringer sent i løpet.",
  },
  {
    term_no: "Perspektivkompresjon",
    term_en: "Telephoto compression",
    domain: "film",
    definition_no: "Fenomen der lang brennvidde oppleves å redusere avstand mellom forgrunn og bakgrunn.",
    promptImpact: "Gir tettere romopplevelse og tydeligere fokus på subjektet i visuelle narrativer.",
  },
  {
    term_no: "Chiaroscuro",
    term_en: "Chiaroscuro",
    domain: "photo",
    definition_no: "Lyssetting med markant kontrast mellom lyse og mørke partier.",
    promptImpact: "Skaper dramatikk og formlesbarhet i ansikt, materialer og rom.",
  },
  {
    term_no: "Lav nøkkel-belysning",
    term_en: "Low-key lighting",
    domain: "photo",
    definition_no: "Lysoppsett dominert av skygger og lav gjennomsnittlig eksponering.",
    promptImpact: "Forsterker spenning, dybde og dramatisk tone.",
  },
  {
    term_no: "Høy nøkkel-belysning",
    term_en: "High-key lighting",
    domain: "photo",
    definition_no: "Lysoppsett med jevn eksponering og få harde skygger.",
    promptImpact: "Gir ren, kommersiell og lettlest visuell stil.",
  },
  {
    term_no: "Kantlys",
    term_en: "Rim light",
    domain: "photo",
    definition_no: "Lys bak eller fra siden som fremhever konturen til motivet.",
    promptImpact: "Skiller motivet fra bakgrunnen og gir tydelig silhuettkontroll.",
  },
  {
    term_no: "Volumetrisk lys",
    term_en: "Volumetric light",
    domain: "photo",
    definition_no: "Synlige lysstråler i partikler som tåke, støv eller regn.",
    promptImpact: "Forsterker romdybde og retning i scener med atmosfære.",
  },
  {
    term_no: "Negativt rom",
    term_en: "Negative space",
    domain: "design",
    definition_no: "Tomrom rundt motivet som brukes aktivt i komposisjonen.",
    promptImpact: "Styrer fokus og skaper tydelig visuell rytme.",
  },
  {
    term_no: "Romakse",
    term_en: "Axis of action",
    domain: "film",
    definition_no: "Tenkt linje som holder romlig orientering stabil i klipp og kameravinkler.",
    promptImpact: "Hindrer forvirring i dialog og bevegelsessekvenser.",
  },
  {
    term_no: "Temporal konsistens",
    term_en: "Temporal coherence",
    domain: "ai",
    definition_no: "Stabilitet i identitet, geometri og lys over flere frames i video.",
    promptImpact: "Reduserer flimring og objektmutasjon i AI-generert video.",
  },
  {
    term_no: "Objekt-permanens",
    term_en: "Object permanence",
    domain: "ai",
    definition_no: "Regel om at objekter beholder form, størrelse og posisjon gjennom sekvensen.",
    promptImpact: "Gir mer pålitelig kontinuitet i komplekse scener.",
  },
  {
    term_no: "Kontinuitetslås",
    term_en: "Consistency lock",
    domain: "ai",
    definition_no: "Eksplisitt låsing av hva som ikke skal endres i genereringen.",
    promptImpact: "Reduserer uønskede endringer i motiv, miljø og merkeelementer.",
  },
  {
    term_no: "Z-dybdepass",
    term_en: "Z-depth pass",
    domain: "vfx",
    definition_no: "Gråtonekart som beskriver avstand fra kamera i scenen.",
    promptImpact: "Gir presis kontroll på dybdeeffekter og kompositt i post.",
  },
  {
    term_no: "AOV-pass",
    term_en: "AOV pass",
    domain: "vfx",
    definition_no: "Separate render-lag for lys, refleksjon, skygger og andre komponenter.",
    promptImpact: "Forenkler målrettet etterarbeid uten full re-render.",
  },
  {
    term_no: "Matte-kompositt",
    term_en: "Matte composite",
    domain: "vfx",
    definition_no: "Sammensetting med masker som styrer hvilke områder som påvirkes.",
    promptImpact: "Gir lokal kontroll i VFX-arbeid og begrenser artefakter.",
  },
  {
    term_no: "Overeksponering",
    term_en: "Overexposure",
    domain: "photo",
    definition_no: "Når høylys blir for lyse og mister detaljinformasjon.",
    promptImpact: "Kan brukes bevisst som stilgrep, men må styres for å unngå detaljtap.",
  },
  {
    term_no: "Undereksponering",
    term_en: "Underexposure",
    domain: "photo",
    definition_no: "Når bildet er for mørkt og detaljer forsvinner i skygger.",
    promptImpact: "Skaper dramatikk, men krever kontrollert kontrast for lesbarhet.",
  },
  {
    term_no: "Dybdeskarphet",
    term_en: "Depth of field",
    domain: "photo",
    definition_no: "Området i bildet som fremstår i fokus.",
    promptImpact: "Styrer hva seeren skal prioritere visuelt.",
  },
  {
    term_no: "Bokeh",
    term_en: "Bokeh",
    domain: "photo",
    definition_no: "Kvaliteten på uskarpe lysområder utenfor fokusplanet.",
    promptImpact: "Påvirker estetisk karakter i bakgrunnen uten å endre hovedmotiv.",
  },
  {
    term_no: "Anamorfisk flare",
    term_en: "Anamorphic flare",
    domain: "film",
    definition_no: "Horisontale lysstriper som oppstår med anamorfisk optikk.",
    promptImpact: "Gir filmisk signatur når det brukes kontrollert.",
  },
  {
    term_no: "Hollandsk vinkel",
    term_en: "Dutch angle",
    domain: "film",
    definition_no: "Skjev kamerahorisont som skaper uro eller psykologisk spenning.",
    promptImpact: "Kommuniserer destabilisering og konflikt i scenen.",
  },
  {
    term_no: "Fugleperspektiv",
    term_en: "Bird's-eye view",
    domain: "film",
    definition_no: "Kameravinkel ovenfra som viser helhet og romlig struktur.",
    promptImpact: "Gir oversikt og tydelig geografisk orientering.",
  },
  {
    term_no: "Froskeperspektiv",
    term_en: "Low angle",
    domain: "film",
    definition_no: "Kameravinkel nedenfra som gir motivet mer tyngde eller dominans.",
    promptImpact: "Forsterker skala og maktinntrykk i subjektet.",
  },
  {
    term_no: "Silhuett",
    term_en: "Silhouette",
    domain: "photo",
    definition_no: "Visuell framstilling der formen leses mot lys bakfra, med få innvendige detaljer.",
    promptImpact: "Forenkler motivet til tydelig kontur og form.",
  },
  {
    term_no: "Kinetisk komposisjon",
    term_en: "Kinetic composition",
    domain: "design",
    definition_no: "Komposisjon som antyder bevegelse og retning selv i stillbilde.",
    promptImpact: "Gir energi og fremdrift uten faktisk kamerabevegelse.",
  },
  {
    term_no: "Statisk komposisjon",
    term_en: "Static composition",
    domain: "design",
    definition_no: "Komposisjon med visuell ro, balanse og lav bevegelsesimpuls.",
    promptImpact: "Skaper stabilitet og varighet i budskapet.",
  },
  {
    term_no: "Estableringsbilde",
    term_en: "Establishing shot",
    domain: "film",
    definition_no: "Innledende bilde som forklarer sted, tid og rom før detaljhandling.",
    promptImpact: "Gir seeren kontekst før nærbilder og dramatisk utvikling.",
  },
  {
    term_no: "Shot-reverse-shot",
    term_en: "Shot-reverse-shot",
    domain: "film",
    definition_no: "Dialogstruktur med vekselvis utsnitt av to personer i samme romakse.",
    promptImpact: "Gir tydelig samtaleflyt og romlig kontinuitet.",
  },
  {
    term_no: "Fokusplan",
    term_en: "Focus plane",
    domain: "photo",
    definition_no: "Planet i bildet der detaljer er skarpest.",
    promptImpact: "Presiserer hvor modellen skal prioritere skarphet.",
  },
  {
    term_no: "Lysretning",
    term_en: "Light direction",
    domain: "photo",
    definition_no: "Retningen lyset treffer motivet fra, inkludert innfallsvinkel.",
    promptImpact: "Styrer volum, skyggefall og opplevd realisme.",
  },
  {
    term_no: "Materialitet",
    term_en: "Materiality",
    domain: "arch",
    definition_no: "Hvordan materialer fremstår gjennom tekstur, glans, ruhet og respons på lys.",
    promptImpact: "Løfter resultatet fra generisk stil til fysisk troverdig overflateadferd.",
  },
  {
    term_no: "Fargegradering",
    term_en: "Color grading",
    domain: "vfx",
    definition_no: "Systematisk justering av farger og kontrast for ønsket tone.",
    promptImpact: "Samler visuell identitet på tvers av klipp og scener.",
  },
  {
    term_no: "Lyskontrastforhold",
    term_en: "Lighting contrast ratio",
    domain: "photo",
    definition_no: "Forholdet mellom lyseste og mørkeste områder i scenen.",
    promptImpact: "Bestemmer dramatisk intensitet og detaljbevaring.",
  },
  {
    term_no: "Masse og tomrom",
    term_en: "Mass and void",
    domain: "arch",
    definition_no: "Arkitektonisk forhold mellom bygde volum og åpne rom.",
    promptImpact: "Gir tydelig romlig logikk i arkitektur- og byromsbeskrivelser.",
  },
  {
    term_no: "Symmetrisk komposisjon",
    term_en: "Symmetrical composition",
    domain: "design",
    definition_no: "Komposisjon med balanse rundt en sentral akse.",
    promptImpact: "Skaper orden, kontroll og høy visuell stabilitet.",
  },
  {
    term_no: "Asymmetrisk komposisjon",
    term_en: "Asymmetrical composition",
    domain: "design",
    definition_no: "Komposisjon med bevisst ubalanse som likevel oppleves harmonisk.",
    promptImpact: "Skaper dynamikk og spenning uten å miste lesbarhet.",
  },
  {
    term_no: "Provisuell kompositt",
    term_en: "Previsual composite",
    domain: "vfx",
    definition_no: "Tidlig sammensatt testbilde for å validere shotlogikk før endelig produksjon.",
    promptImpact: "Avdekker feil tidlig og reduserer risiko i leveransefasen.",
  },
  {
    term_no: "Persienneskygger",
    term_en: "Venetian blind shadows",
    domain: "photo",
    definition_no: "Stripete skygger fra persienner som gir tydelig retning og mønster i lyssetting.",
    promptImpact: "Gir kontrollert noir-estetikk med klar geometri i lys og skygge.",
  },
  {
    term_no: "Ekstrem nærbilde",
    term_en: "Extreme close-up",
    domain: "film",
    definition_no: "Utsnitt som isolerer et lite detaljområde av motivet.",
    promptImpact: "Øker fokus og emosjonell intensitet ved å fjerne visuell støy.",
  },
  {
    term_no: "Nærbilde",
    term_en: "Close-up",
    domain: "film",
    definition_no: "Utsnitt som prioriterer ansikt eller objekt i detalj.",
    promptImpact: "Gjør uttrykk, tekstur og mikrohandlinger mer lesbare.",
  },
  {
    term_no: "Halvtotal",
    term_en: "Medium long shot",
    domain: "film",
    definition_no: "Utsnitt som viser kropp og miljø i balanse.",
    promptImpact: "Knytter handling til rommet uten å miste motivfokus.",
  },
  {
    term_no: "Totalbilde",
    term_en: "Wide shot",
    domain: "film",
    definition_no: "Utsnitt som viser hele miljøet med motiv i kontekst.",
    promptImpact: "Forankrer geografien før nærmere utsnitt og detaljhandling.",
  },
  {
    term_no: "Fugleperspektiv 90-graders overhead",
    term_en: "True 90-degree overhead",
    domain: "film",
    definition_no: "Toppvinkel der kamera peker rett ned mot scenen.",
    promptImpact: "Gir tydelig planforståelse og kontrollert romgeometri.",
  },
  {
    term_no: "Froskeperspektiv lav vinkel",
    term_en: "Low-angle perspective",
    domain: "film",
    definition_no: "Kameravinkel fra lav posisjon opp mot motivet.",
    promptImpact: "Forsterker skala, tyngde og dramatisk maktinntrykk.",
  },
  {
    term_no: "Statisk kamera locked-off",
    term_en: "Locked-off camera",
    domain: "film",
    definition_no: "Fastlåst kamera uten pan, tilt eller dolly-bevegelse.",
    promptImpact: "Øker kontinuitet og reduserer geometri- og perspektivdrift.",
  },
  {
    term_no: "Handholdt mikro-jitter",
    term_en: "Handheld micro-jitter",
    domain: "film",
    definition_no: "Små, kontrollerte håndholdte vibrasjoner i kameraføringen.",
    promptImpact: "Gir dokumentarisk nærvær uten å bli kaotisk eller ustabilt.",
  },
  {
    term_no: "Dolly-inn/ut",
    term_en: "Dolly in/out",
    domain: "film",
    definition_no: "Lineær kamerabevegelse mot eller bort fra motivet.",
    promptImpact: "Styrer oppmerksomhet og rytme med fysisk plausibel bevegelse.",
  },
  {
    term_no: "Panorering og tilt",
    term_en: "Pan and tilt",
    domain: "film",
    definition_no: "Rotasjon av kamera horisontalt (pan) og vertikalt (tilt).",
    promptImpact: "Gir kontrollert blikkføring uten å endre kameraposisjon.",
  },
  {
    term_no: "Hardt topplys",
    term_en: "Hard top light",
    domain: "photo",
    definition_no: "Konsentrert lyskilde ovenfra som gir markerte skygger.",
    promptImpact: "Fremhever volum og ansiktsstruktur med høy kontrast.",
  },
  {
    term_no: "Nøkkellys fill rim-triade",
    term_en: "Key fill rim triad",
    domain: "photo",
    definition_no: "Trekomponents lysoppsett med hovedlys, utfyllingslys og kantlys.",
    promptImpact: "Gir robust kontroll på separasjon, dybde og lesbarhet.",
  },
  {
    term_no: "Lav nøkkel kontrastdominant",
    term_en: "Low-key contrast dominant",
    domain: "photo",
    definition_no: "Lysstil med stort skyggevolum og begrenset utfylling.",
    promptImpact: "Skaper dramatisk tone samtidig som fokus holdes på nøkkelformer.",
  },
  {
    term_no: "Høy nøkkel jevn lysflate",
    term_en: "High-key even lighting",
    domain: "photo",
    definition_no: "Lysstil med høy eksponering og myke kontraster.",
    promptImpact: "Gir ren og kommersiell look med høy lesbarhet.",
  },
  {
    term_no: "Lysretning primærkilde",
    term_en: "Primary light direction",
    domain: "photo",
    definition_no: "Definisjon av hovedlysets retning og innfallsvinkel.",
    promptImpact: "Stabiliserer skyggeforløp og reduserer visuelt kaos.",
  },
  {
    term_no: "Skyggekvalitet hard/myk",
    term_en: "Shadow hardness/softness",
    domain: "photo",
    definition_no: "Beskriver om skyggekanten er skarp eller diffus.",
    promptImpact: "Kontrollerer opplevd materialitet og atmosfære i scenen.",
  },
  {
    term_no: "Fargetemperatur varm/kald",
    term_en: "Warm/cool color temperature",
    domain: "photo",
    definition_no: "Angir om lyskilden ligger mot varme eller kalde Kelvin-verdier.",
    promptImpact: "Gir konsistent fargetone og hindrer utilsiktet fargedrift.",
  },
  {
    term_no: "Dybdeskarphet-kontroll",
    term_en: "Depth of field control",
    domain: "photo",
    definition_no: "Presis styring av hvor mye av bildet som skal være i fokus.",
    promptImpact: "Reduserer fokusdrift og tydeliggjør motivhierarki.",
  },
  {
    term_no: "Fokusplan-lås",
    term_en: "Focus plane lock",
    domain: "photo",
    definition_no: "Låsing av skarphetsplanet gjennom sekvens eller serie.",
    promptImpact: "Gir stabil lesbarhet mellom varianter og frames.",
  },
  {
    term_no: "Lang eksponering",
    term_en: "Long exposure",
    domain: "photo",
    definition_no: "Lukkerteknikk som samler lys over tid i ett bilde.",
    promptImpact: "Skiller statiske elementer fra bevegelsesstriper på kontrollert måte.",
  },
  {
    term_no: "Postvis (previs-kompositt)",
    term_en: "Previs composite",
    domain: "vfx",
    definition_no: "Tidlig sammensatt test av scene, lag og kameralogikk.",
    promptImpact: "Avslører tekniske kollisjoner før kostbar sluttproduksjon.",
  },
  {
    term_no: "Kompositt-pipeline",
    term_en: "Compositing pipeline",
    domain: "vfx",
    definition_no: "Arbeidsflyt for å sette sammen flere visuelle lag til ett bilde.",
    promptImpact: "Gir forutsigbar levering med tydelig lagstruktur og QA.",
  },
  {
    term_no: "Matte-lag",
    term_en: "Matte layer",
    domain: "vfx",
    definition_no: "Maskelag som styrer hvilke områder som påvirkes i post.",
    promptImpact: "Reduserer lekkasje mellom elementer og øker presisjon.",
  },
  {
    term_no: "Rotoskopering (roto)",
    term_en: "Rotoscoping",
    domain: "vfx",
    definition_no: "Manuell eller semi-automatisk frilegging av motiv over tid.",
    promptImpact: "Sikrer ren separasjon av motiv ved komplekse bevegelser.",
  },
  {
    term_no: "AOV / render-pass teknisk",
    term_en: "Technical AOV render pass",
    domain: "vfx",
    definition_no: "Separate renderkanaler for lys, skygge, refleksjon og materialdata.",
    promptImpact: "Gir målrettet etterbehandling uten full re-render.",
  },
  {
    term_no: "Z-dybdepass gråtonekart",
    term_en: "Z-depth grayscale map",
    domain: "vfx",
    definition_no: "Gråtonekart som representerer avstand fra kamera.",
    promptImpact: "Forbedrer kontroll på dybdeeffekter og fokus i post.",
  },
  {
    term_no: "Optisk bevegelsesuskarphet",
    term_en: "Optical motion blur",
    domain: "vfx",
    definition_no: "Bevegelsesuskarphet som følger fysisk bevegelsesretning og hastighet.",
    promptImpact: "Gir mer troverdig bevegelse enn tilfeldig uskarphetsfilter.",
  },
  {
    term_no: "Filmkorn ekte vs filter",
    term_en: "Film grain real vs overlay",
    domain: "vfx",
    definition_no: "Skille mellom organisk kornintegrasjon og pålagt filterkorn.",
    promptImpact: "Hindrer kunstig digital støy og gir mer naturlig tekstur.",
  },
  {
    term_no: "LUT / fargeprofil",
    term_en: "LUT / color profile",
    domain: "vfx",
    definition_no: "Fargestyringsoppsett som standardiserer tone og kontrast.",
    promptImpact: "Sikrer fargekonsistens på tvers av klipp og leveranser.",
  },
  {
    term_no: "Korrigering vs gradering",
    term_en: "Correction vs grading",
    domain: "vfx",
    definition_no: "Skiller teknisk fargekorrigering fra kreativ fargegradering.",
    promptImpact: "Reduserer feilprioritering i postarbeid og forbedrer kontroll.",
  },
  {
    term_no: "Konsistenslås regelbasert",
    term_en: "Rule-based consistency lock",
    domain: "ai",
    definition_no: "Konsistenslås med eksplisitte regler for hva som skal være konstant.",
    promptImpact: "Stabiliserer output ved å begrense modellens frie variasjon.",
  },
  {
    term_no: "Identitetslås",
    term_en: "Identity lock",
    domain: "ai",
    definition_no: "Låsing av ansikt, klær og kjennetegn over flere genereringer.",
    promptImpact: "Forebygger identitetsdrift i serier og videosekvenser.",
  },
  {
    term_no: "Geometrilås",
    term_en: "Geometry lock",
    domain: "ai",
    definition_no: "Låsing av form, perspektiv og romstruktur i scenen.",
    promptImpact: "Reduserer deformasjon og bakgrunnsmorfing.",
  },
  {
    term_no: "Objektpermanens",
    term_en: "Object permanence",
    domain: "ai",
    definition_no: "Prinsipp om at objekter beholder identitet og plassering over tid.",
    promptImpact: "Hindrer at objekter forsvinner eller muterer mellom frames.",
  },
  {
    term_no: "Temporal konsistens video",
    term_en: "Temporal consistency video",
    domain: "ai",
    definition_no: "Kontinuitet i lys, geometri og identitet på tvers av videoframes.",
    promptImpact: "Minimerer flimring og tidsmessig ustabilitet.",
  },
  {
    term_no: "Instruksjonsdominans",
    term_en: "Instruction dominance",
    domain: "ai",
    definition_no: "Prioritering av eksplisitte instruksjoner over stilistisk støy.",
    promptImpact: "Gir mer deterministisk output i komplekse prompts.",
  },
  {
    term_no: "Kontekstoverstyring",
    term_en: "Context override",
    domain: "ai",
    definition_no: "Når ny kontekst i prompten overstyrer tidligere låste elementer.",
    promptImpact: "Synliggjør behov for tydelig prioritet og separasjon mellom blokkene.",
  },
  {
    term_no: "Modellhallusinasjon",
    term_en: "Model hallucination",
    domain: "ai",
    definition_no: "Feilaktig generering av detaljer som ikke er instruert eller plausible.",
    promptImpact: "Gjør det lettere å definere forebyggende negativkontroll.",
  },
  {
    term_no: "Identitetsdrift",
    term_en: "Identity drift",
    domain: "ai",
    definition_no: "Gradvis endring av person- eller objektidentitet mellom iterasjoner.",
    promptImpact: "Krever identitetslås for stabil serieproduksjon.",
  },
  {
    term_no: "Komposisjonsdrift",
    term_en: "Composition drift",
    domain: "ai",
    definition_no: "Uønsket endring av utsnitt, balanse og fokus mellom versjoner.",
    promptImpact: "Håndteres med geometri- og komposisjonslås i prompten.",
  },
];

function termSlug(term: Seed): string {
  return `${slugify(term.term_no)}-${term.domain}`;
}

const domainGroups = seeds.reduce<Record<GlossaryDomain, string[]>>(
  (acc, term) => {
    if (!acc[term.domain]) acc[term.domain] = [];
    acc[term.domain].push(termSlug(term));
    return acc;
  },
  { arch: [], film: [], vfx: [], ai: [], photo: [], design: [] }
);

const relatedLookup = new Map<string, string[]>();

for (const [domain, slugs] of Object.entries(domainGroups)) {
  const domainKey = domain as GlossaryDomain;
  slugs.forEach((slug, index) => {
    const neighbours = [slugs[index - 1], slugs[index + 1], slugs[index + 2]].filter(Boolean) as string[];
    relatedLookup.set(`${slug}:${domainKey}`, neighbours);
  });
}

export const glossaryTerms: GlossaryTerm[] = seeds
  .map((term) => {
    const slug = termSlug(term);

    return {
      slug,
      term_no: term.term_no,
      term_en: term.term_en,
      domain: term.domain,
      definition_no: term.definition_no,
      promptImpact: term.promptImpact,
      examples: [
        `Bruk ${term.term_no.toLowerCase()} eksplisitt i egen linje i prompten.`,
        `Hold resten av prompten stabil og test variant A/B med kun ${term.term_no.toLowerCase()}.`,
      ],
      relatedTerms: relatedLookup.get(`${slug}:${term.domain}`) ?? [],
    };
  })
  .sort((a, b) => a.term_no.localeCompare(b.term_no, "nb-NO"));

export const glossaryBySlug = Object.fromEntries(
  glossaryTerms.map((entry) => [entry.slug, entry])
);

export const glossaryDomains = Array.from(new Set(glossaryTerms.map((entry) => entry.domain)));
