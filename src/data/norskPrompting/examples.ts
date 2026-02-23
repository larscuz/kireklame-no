import { slugify } from "@/lib/slug";
import type { GlossaryDomain, PromptDomain, PromptExample, PromptOutputType } from "./types";

type ExampleSeed = {
  title: string;
  outputType: PromptOutputType;
  domain: PromptDomain;
  shortInput: string;
  longOutput: string;
  whyWorks: string[];
  ruleIds: string[];
  termRefs: Array<[string, GlossaryDomain]>;
};

function termSlug(termNo: string, domain: GlossaryDomain): string {
  return `${slugify(termNo)}-${domain}`;
}

const seeds: ExampleSeed[] = [
  {
    title: "Kvinne i regnfull togstasjon med mobilrefleksjon",
    outputType: "image",
    domain: "film-vfx",
    shortInput:
      "En kvinne løper gjennom en travel togstasjon i kraftig regn og mister mobilen i en vanndam.",
    longOutput: `1) Mål:
Lag et fysisk plausibelt fotografisk øyeblikk der handling, refleksjon og lys henger sammen.

2) Motiv + handling:
Kvinne (ca. 30 år) i løp. Mobilen glipper fra høyre hånd, 30-50 cm over bakken, naturlig rotasjon.

3) Miljø / setting:
Europeisk togstasjon med vått betonggulv og 0,5-1 cm vannfilm i dammen.

4) Kamera:
35mm, hoftehøyde, lukker 1/500, ingen kunstig bevegelsesuskarphet.

5) Lys:
Fluorescerende taklys rundt 4500K. Regndråper synlige i lyskjegler, ikke som filmatiske streker.

6) Materialer / overflater:
Våt betong med diffus refleksjon. Mobilglass med kontrollert speiling og ikke overdrevet glans.

7) Komposisjon:
Kvinnen i forgrunn, dammen i mellomgrunn, stasjonsarkitektur i bakgrunn.

8) Stil / estetikk:
Nøktern dokumentarisk realisme, ingen blå/oransje grading.

9) Kontinuitet / konsistens:
Lås kroppsretning, mobilens bane, refleksjonsvinkel og kamerageometri.

10) Begrensninger:
Ingen svevende objekter. Ingen dobbel refleksjon uten fysisk kilde.

11) Negativ prompting / unngå:
Unngå filmatisk regn, overmettet neon og perspektivbrudd.

12) Output-spesifikasjon:
1:1 eller 16:9 stillbilde med høy detalj og realistisk eksponering.`,
    whyWorks: [
      "Prompten beskriver fysisk mekanikk i stedet for stemningsord.",
      "Refleksjon, lys og bevegelse er låst med klare grenser.",
      "Negativ listen fjerner vanlige AI-feil i regnscener.",
    ],
    ruleIds: [
      "motiv-for-stil",
      "definer-lysretning-kvalitet",
      "unnga-magisk-objektendring",
      "beskriv-romlig-hierarki",
      "avslutt-med-klare-begrensninger",
    ],
    termRefs: [
      ["Lysretning", "photo"],
      ["Temporal konsistens", "ai"],
      ["Objekt-permanens", "ai"],
      ["Z-dybdepass", "vfx"],
    ],
  },
  {
    title: "Mann med briller som spiser blått eple",
    outputType: "image",
    domain: "produkt",
    shortInput: "Mann med tynne metallbriller tar et bitt av et blått eple.",
    longOutput: `1) Mål:
Lag et realistisk nærbilde med anatomisk og optisk troverdighet.

2) Motiv + handling:
Mann 35-45 år med lett skjeggstubb og klare metallbriller. Midt i bitt av blått eple.

3) Miljø / setting:
Nøytral innendørs vegg, ingen rekvisitter.

4) Kamera:
50mm, øyehøyde, blender f/4, naturlig dybdeskarphet.

5) Lys:
Vinduslys fra venstre, 35 graders innfall, myk skyggeavtrapping på høyre side.

6) Materialer / overflater:
Eple med matt overflate og naturlig mikrostruktur. Brilleglass uten refleks som skjuler øyne.

7) Komposisjon:
Frontalt nærbilde med ansikt og eple som tydelig fokusplan.

8) Stil / estetikk:
Fotografisk og nøktern, ingen glanset skjønnhetsretusj.

9) Kontinuitet / konsistens:
Lås ansiktsform, brillegeometri og eplets proporsjon.

10) Begrensninger:
Ingen fantasigløding. Ingen plastikkhud. Ingen symbolske ekstraelementer.

11) Negativ prompting / unngå:
Unngå overmettet blåfarge, tilfeldig deformert munn og kunstig hudglans.

12) Output-spesifikasjon:
Stillbilde 4:5 med høy detalj i ansikt, bittpunkt og materialrespons.`,
    whyWorks: [
      "Anatomi, lys og materialitet er spesifisert med fysisk språk.",
      "Prompten begrenser modellens frie tolkning av blåfargen.",
      "Kontinuitetslås hindrer glatte stock-bilder uten struktur.",
    ],
    ruleIds: [
      "beskriv-materialitet",
      "spesifiser-linse-brennvidde",
      "definer-dybdeskarphet",
      "presiser-skala-og-proporsjon",
      "bruk-konkrete-fagtermer",
    ],
    termRefs: [
      ["Materialitet", "arch"],
      ["Fokusplan", "photo"],
      ["Dybdeskarphet", "photo"],
      ["Objekt-permanens", "ai"],
    ],
  },
  {
    title: "Arkitektonisk elevasjon av rådhusfasade",
    outputType: "image",
    domain: "arkitektur",
    shortInput: "Konverter foto av rådhus til ren ortografisk fasadevisning.",
    longOutput: `1) Mål:
Produser en teknisk lesbar elevasjon uten perspektivforvrengning.

2) Motiv + handling:
Rådhusfasade med vindusrytme, inngangsparti og gesimslinje.

3) Miljø / setting:
Nøytral bakgrunn uten kontekstobjekter som biler eller mennesker.

4) Kamera:
Ortografisk projeksjon, frontalt utsnitt, ingen linseforvrengning.

5) Lys:
Jevnt nøytralt dagslys for høy materiallesbarhet.

6) Materialer / overflater:
Behold fasademateriale, fuger og overflatetekstur uten stilisering.

7) Komposisjon:
Sentrert fasade med tydelig vertikal og horisontal akse.

8) Stil / estetikk:
Teknisk presentasjon, ikke stemningsbilde.

9) Kontinuitet / konsistens:
Lås geometri og proporsjoner mot originalen.

10) Begrensninger:
Ingen nye vinduer, ingen endret etasjehøyde, ingen reframing.

11) Negativ prompting / unngå:
Unngå perspektiv, dramatisk skygge og kunstneriske filter.

12) Output-spesifikasjon:
Stillbilde 3:2 med målbar geometri og høy kantpresisjon.`,
    whyWorks: [
      "Prompten beskriver representasjonsskift eksplisitt.",
      "Ortografi og geometri er låst med klare avgrensninger.",
      "Teknisk mål hindrer unødvendig stilisering.",
    ],
    ruleIds: [
      "presiser-ortografisk-perspektiv",
      "spesifiser-teknisk-eller-estetisk",
      "unnga-stilisering-ved-teknisk-presisjon",
      "bruk-representasjonsskift-bevisst",
      "avslutt-med-klare-begrensninger",
    ],
    termRefs: [
      ["Ortografisk projeksjon", "arch"],
      ["Aksonometri", "arch"],
      ["Masse og tomrom", "arch"],
      ["Materialitet", "arch"],
    ],
  },
  {
    title: "Film noir i nattregn",
    outputType: "image",
    domain: "film-vfx",
    shortInput: "Detektiv i trenchcoat ved vindu med persienneskygger i nattregn.",
    longOutput: `1) Mål:
Skap en noir-scene med hard lysarkitektur og tydelig moralsk spenning.

2) Motiv + handling:
Detektiv står halvveis i skygge og ser ut mot våt gate.

3) Miljø / setting:
Kontorinteriør med vindu, regn utenfor, svak røyk i baklys.

4) Kamera:
50mm, halvnært utsnitt, statisk kameraposisjon.

5) Lys:
Hardt nøkkellys gjennom persienner, lav nøkkel-belysning, tydelig kantlys.

6) Materialer / overflater:
Våt asfalt med kontrollert refleks, stofftekstur i trenchcoat.

7) Komposisjon:
Asymmetrisk komposisjon med negativt rom på venstre side.

8) Stil / estetikk:
Monokrom sort/hvitt med kornet filmkarakter, uten moderne glanset uttrykk.

9) Kontinuitet / konsistens:
Lås skyggeretning, kontrastnivå og ansiktsgeometri.

10) Begrensninger:
Ingen moderne objekter, ingen fargeinnslag.

11) Negativ prompting / unngå:
Unngå overmettet kontrast og digital plasttekstur.

12) Output-spesifikasjon:
4:5 stillbilde, tydelig skyggetegning i ansikt og bakgrunn.`,
    whyWorks: [
      "Noir-estetikk bygges med lysfysikk, ikke buzzord.",
      "Persienneskygger og lav nøkkel-belysning gir kontrollert tone.",
      "Streng negativliste holder scenen tidsmessig konsistent.",
    ],
    ruleIds: [
      "motiv-for-stil",
      "definer-lysretning-kvalitet",
      "definer-negativt-rom",
      "unnga-overmettet-farge",
      "avslutt-med-klare-begrensninger",
    ],
    termRefs: [
      ["Chiaroscuro", "photo"],
      ["Lav nøkkel-belysning", "photo"],
      ["Persienneskygger", "photo"],
      ["Asymmetrisk komposisjon", "design"],
    ],
  },
  {
    title: "Neo-noir bakgate med neon",
    outputType: "image",
    domain: "film-vfx",
    shortInput: "En ensom figur i regnvåt bakgate med cyan/magenta-neon.",
    longOutput: `1) Mål:
Lag en moderne neo-noir scene med kontrollert fargekontrast.

2) Motiv + handling:
Ensom figur i bakbelyst silhuett, stående i ro.

3) Miljø / setting:
Bakgate med våt asfalt, damp fra kumlokk og urban nattkontekst.

4) Kamera:
85mm for perspektivkompresjon, hoftehøyde, statisk utsnitt.

5) Lys:
Baklys + kantlys med begrenset neonmetning i magenta/cyan.

6) Materialer / overflater:
Våt asfalt og metall med realistisk spekulær respons.

7) Komposisjon:
Figuren i mellomgrunn med ledende linjer inn mot subjekt.

8) Stil / estetikk:
Moderne noir, men uten tegneserieaktig overdrivelse.

9) Kontinuitet / konsistens:
Lås fargebalanse, refleksjonsnivå og silhuettform.

10) Begrensninger:
Ingen overmettet glød, ingen futuristiske fantasy-elementer.

11) Negativ prompting / unngå:
Unngå plastteksturer og overdrevet linseglød.

12) Output-spesifikasjon:
16:9 stillbilde med tydelig separasjon mellom figur og bakgrunn.`,
    whyWorks: [
      "Fargekontrast er kontrollert med konkrete grenser.",
      "Perspektiv og lys er spesifisert før stil.",
      "Negativliste hindrer generisk cyberpunk-uttrykk.",
    ],
    ruleIds: [
      "unnga-vage-stilord",
      "spesifiser-linse-brennvidde",
      "definer-lysretning-kvalitet",
      "unnga-overmettet-farge",
      "bruk-konkrete-fagtermer",
    ],
    termRefs: [
      ["Perspektivkompresjon", "film"],
      ["Anamorfisk flare", "film"],
      ["Kantlys", "photo"],
      ["Lyskontrastforhold", "photo"],
    ],
  },
  {
    title: "Shot-reverse-shot i kontorsamtale",
    outputType: "video",
    domain: "dokumentar",
    shortInput: "To personer diskuterer budsjett i et nøkternt kontormøte.",
    longOutput: `1) Mål:
Lag en tydelig dialogsekvens med stabil romorientering.

2) Motiv + handling:
To personer sitter overfor hverandre og veksler i replikk.

3) Miljø / setting:
Nøytralt møterom med bord, laptop og notatblokk.

4) Kamera:
Shot-reverse-shot, halvnært utsnitt med 50mm, samme kamerahøyde på begge vinkler.

5) Lys:
Jevn kontorbelysning med myk hovedlys-/fylllysbalanse.

6) Materialer / overflater:
Naturlig hud, matte bordflater, ingen glinsende plastikkuttrykk.

7) Komposisjon:
Matchende blikklinje og stabil forgrunn/bakgrunn i begge vinkler.

8) Stil / estetikk:
Dokumentarisk og nøktern, ingen stilisert grading.

9) Kontinuitet / konsistens:
Bevar romakse og identitetslås gjennom hele sekvensen.

10) Begrensninger:
Ingen aksebrudd. Ingen kostyme- eller objektendring mellom klipp.

11) Negativ prompting / unngå:
Unngå hopp i blikkretning og ubalansert hudtone.

12) Output-spesifikasjon:
10 sekunder, 16:9, 24 fps, to tydelige vinkler uten desorientering.`,
    whyWorks: [
      "Dialoggrammatikken er eksplisitt definert.",
      "Romakse og blikklinje er låst for kontinuitet.",
      "Teknisk spesifikasjon gjør sekvensen produksjonsklar.",
    ],
    ruleIds: [
      "bevar-romakse-dialog",
      "las-identitet-kontinuitet",
      "skill-komposisjon-kamerabevegelse",
      "presiser-stillbilde-eller-bevegelse",
      "avslutt-med-klare-begrensninger",
    ],
    termRefs: [
      ["Shot-reverse-shot", "film"],
      ["Romakse", "film"],
      ["Temporal konsistens", "ai"],
      ["Fokusplan", "photo"],
    ],
  },
  {
    title: "Produktdemo 10s av smartflaske",
    outputType: "video",
    domain: "produkt",
    shortInput: "Vis hvordan en smartflaske registrerer væskeinntak i kontormiljø.",
    longOutput: `1) Mål:
Lag en 10-sekunders produktdemo med tydelig funksjonsbevis.

2) Motiv + handling:
Hånd løfter smartflasken, drikker, og appen oppdaterer status.

3) Miljø / setting:
Kontorpult med laptop og notatblokk, ryddig bakgrunn.

4) Kamera:
35mm hovedopptak + ett nærbilde av skjermrespons, kontrollert dolly inn.

5) Lys:
Myk key fra venstre, fill fra front, nøytral 5200K.

6) Materialer / overflater:
Metall og plast med realistisk glans, tydelig fingerkontakt.

7) Komposisjon:
Produkt sentrert i første sekvensdel, grensesnitt-overlegg i høyre tredel mot slutten.

8) Stil / estetikk:
Reklameorientert men nøktern, ingen hyperstiliserte overganger.

9) Kontinuitet / konsistens:
Lås logo, etikettplassering og håndgrep mellom sekvensdeler.

10) Begrensninger:
Ingen nye objekter, ingen svevende UI-elementer uten fysisk kilde.

11) Negativ prompting / unngå:
Unngå tekstfeil i appskjerm og urealistisk væskebevegelse.

12) Output-spesifikasjon:
10 sekunder, 9:16, 24 fps, tre sekvensdeler: åpning, nytte, handling.`,
    whyWorks: [
      "Produktadferd og UI-respons er definert trinn for trinn.",
      "Materialitet og lys gjør demoen troverdig.",
      "Beat-struktur støtter kommersiell bruk i sosiale medier.",
    ],
    ruleIds: [
      "beskriv-materialitet",
      "bevar-tekst-logo",
      "spesifiser-teknisk-eller-estetisk",
      "presiser-stillbilde-eller-bevegelse",
      "avslutt-med-klare-begrensninger",
    ],
    termRefs: [
      ["Materialitet", "arch"],
      ["Lysretning", "photo"],
      ["Kinetisk komposisjon", "design"],
      ["Kontinuitetslås", "ai"],
    ],
  },
  {
    title: "Z-dybdepass for museumsinteriør",
    outputType: "image",
    domain: "film-vfx",
    shortInput: "Lag Z-dybdepass av et museumsrom med tre tydelige dybdelag.",
    longOutput: `1) Mål:
Produser et teknisk Z-dybdepass for videre komposittarbeid.

2) Motiv + handling:
Stille interiørscene med inngang, midtrom og bakvegg.

3) Miljø / setting:
Museumsrom med nøytrale overflater og tydelig romstruktur.

4) Kamera:
Behold eksisterende utsnitt og kamerahøyde fra referansescenen.

5) Lys:
Lysinformasjon brukes kun som dybdestøtte, ikke estetisk effekt.

6) Materialer / overflater:
Materialer skal ikke styliseres; kun dybdegradasjon i gråtoner.

7) Komposisjon:
Forgrunn lysere, mellomgrunn medium, bakgrunn mørkere i jevn overgang.

8) Stil / estetikk:
Teknisk pass, ikke kunstnerisk bilde.

9) Kontinuitet / konsistens:
Geometri og objektplassering må matche original scene 1:1.

10) Begrensninger:
Ingen nye objekter. Ingen endring av linser, utsnitt eller perspektiv.

11) Negativ prompting / unngå:
Unngå fargeinformasjon, støyende banding og feil dybdeordre.

12) Output-spesifikasjon:
16-bit gråtone, samme oppløsning som kildescenen.`,
    whyWorks: [
      "Prompten holder fokus på dataresultat, ikke estetikk.",
      "Representasjonsskift er presist definert.",
      "Strenge begrensninger sikrer match mot originalscene.",
    ],
    ruleIds: [
      "spesifiser-teknisk-eller-estetisk",
      "unnga-stilisering-ved-teknisk-presisjon",
      "bruk-representasjonsskift-bevisst",
      "presiser-ortografisk-perspektiv",
      "avslutt-med-klare-begrensninger",
    ],
    termRefs: [
      ["Z-dybdepass", "vfx"],
      ["AOV-pass", "vfx"],
      ["Matte-kompositt", "vfx"],
      ["Provisuell kompositt", "vfx"],
    ],
  },
  {
    title: "Historisk havnescene i Norge 1890",
    outputType: "image",
    domain: "historisk",
    shortInput: "Havn i Norge rundt 1890 tidlig morgen, troverdig og uten anakronismer.",
    longOutput: `1) Mål:
Skap en historisk troverdig havnescene med riktig epokelogikk.

2) Motiv + handling:
Arbeidere laster varer fra trebåt til brygge i morgentimer.

3) Miljø / setting:
Norsk kysthavn med trebygninger, steinbrygge og perioderiktige klær.

4) Kamera:
35mm, øyehøyde, etableringsbilde med tydelig geografi.

5) Lys:
Lav morgensol fra siden med moderat dis i lufta.

6) Materialer / overflater:
Vått treverk, slitt tauverk og metallbeslag med naturlig patina.

7) Komposisjon:
Forgrunn med tau/last, mellomgrunn med arbeidere, bakgrunn med fartøy.

8) Stil / estetikk:
Historisk presis uten modernisert grading.

9) Kontinuitet / konsistens:
Lås klær, rekvisitter og fartøystyper til perioden.

10) Begrensninger:
Ingen moderne skilt, ingen plastmaterialer, ingen elektriske armaturer.

11) Negativ prompting / unngå:
Unngå anakronismer og overdramatisk filmuttrykk.

12) Output-spesifikasjon:
3:2 stillbilde med dokumentarisk detaljnivå og tydelig epokeidentitet.`,
    whyWorks: [
      "Prompten spesifiserer historiske grenser eksplisitt.",
      "Materialitet og lys forankrer scenen i fysisk tid og sted.",
      "Negativ listen fjerner moderne elementer systematisk.",
    ],
    ruleIds: [
      "spesifiser-teknisk-eller-estetisk",
      "beskriv-materialitet",
      "presiser-skala-og-proporsjon",
      "bruk-konkrete-fagtermer",
      "avslutt-med-klare-begrensninger",
    ],
    termRefs: [
      ["Estableringsbilde", "film"],
      ["Materialitet", "arch"],
      ["Lysretning", "photo"],
      ["Objekt-permanens", "ai"],
    ],
  },
  {
    title: "Norsk Prompting forklart for markedsavdeling",
    outputType: "text",
    domain: "redaksjonell",
    shortInput: "Forklar hvorfor norsk prompting gir bedre produksjonskontroll i byråarbeid.",
    longOutput: `1) Mål:
Skriv en kort, faglig forklaring som kan brukes i intern opplæring.

2) Motiv + handling:
Forklar sammenhengen mellom språkpresisjon, produksjonskontroll og kvalitetsnivå.

3) Miljø / setting:
Målgruppe er markedsavdeling uten tung teknisk bakgrunn.

4) Kamera:
Ikke relevant for tekst. Bruk klar overskriftsstruktur med korte avsnitt.

5) Lys:
Ikke relevant for tekst. Bruk tydelig begrepsforklaring med konkrete eksempler.

6) Materialer / overflater:
Ikke relevant for tekst. Beskriv i stedet arbeidsflyt: inndata -> regler -> resultat.

7) Komposisjon:
Innledning, tre hovedpunkter, avsluttende sjekkliste.

8) Stil / estetikk:
Nøktern, presis og fri for hypeord.

9) Kontinuitet / konsistens:
Bruk samme begreper konsekvent (konsistens, begrensninger, negativ prompting).

10) Begrensninger:
Ingen løfter om garanterte resultater. Ingen modellfanboy-språk.

11) Negativ prompting / unngå:
Unngå vage ord, tomme superlativer og uklar handlingsrådgivning.

12) Output-spesifikasjon:
Lever som norsk fagtekst med punktvis handlingsdel.`,
    whyWorks: [
      "Tekstutgaven følger samme struktur som bilde/video-promter.",
      "Begrepsbruk er konsekvent og målgruppeorientert.",
      "Begrensninger hindrer hype og overloving.",
    ],
    ruleIds: [
      "motiv-for-stil",
      "unnga-vage-stilord",
      "spesifiser-teknisk-eller-estetisk",
      "bruk-konkrete-fagtermer",
      "avslutt-med-klare-begrensninger",
    ],
    termRefs: [
      ["Temporal konsistens", "ai"],
      ["Kontinuitetslås", "ai"],
      ["Negativt rom", "design"],
      ["Materialitet", "arch"],
    ],
  },
  {
    title: "Lærer ved tavle med tydelig klassekontekst",
    outputType: "image",
    domain: "dokumentar",
    shortInput: "En lærer står foran en klasse og peker på tavla.",
    longOutput: `Rolle:
Du er dokumentarfotograf med fokus på pedagogisk tydelighet.

Kontekst:
Klasserom i Norge, dagtid, troverdig skolemiljø uten stylisert reklamepreg.

Negativpakke:
A - Ingen endringer-preset.

Scene:
Lærer foran tavle, elever i mellomgrunn, klasseromsdetaljer i bakgrunn.

Handling:
Læreren peker på tavla med naturlig armstilling, elever følger med.

Begrensninger:
Lås ansikter, klær, tavletekst og møblering.

Hva skal ikke skje:
Ingen ekstra objekter, ingen tekstendring på tavla, ingen ansiktsdrift.

Teknisk spesifikasjon:
Halvtotal, 35mm, øyehøyde, statisk kamera, 4:5-format.

Visuell lås:
Primærlyskilde fra vindu venstre, myk skyggekvalitet, nøytral hvitbalanse.

Konsistenslås:
Identitet, geometri og tavleinnhold skal være uendret i alle varianter.`,
    whyWorks: [
      "Strukturblokkene avklarer mål og låser kritiske elementer tidlig.",
      "Negativpakke A hindrer utilsiktede endringer i klasserommet.",
      "Kamera og lys er konkrete, ikke basert på vage stilord.",
    ],
    ruleIds: [
      "rolle-eksplisitt",
      "hierarkisk-promptstruktur",
      "las-kritiske-elementer-forst",
      "tekst-skilt-eksakt-bevaring",
      "negativ-kontroll-eksplisitt",
    ],
    termRefs: [
      ["Halvtotal", "film"],
      ["Statisk kamera locked-off", "film"],
      ["Lysretning primærkilde", "photo"],
      ["Identitetslås", "ai"],
    ],
  },
  {
    title: "Produkt på bord med dramatisk lys",
    outputType: "image",
    domain: "produkt",
    shortInput: "En reklamefilm-still: produkt på bord, dramatisk lys.",
    longOutput: `Rolle:
Du er reklamefotograf med kontroll på produktmaterialitet.

Kontekst:
Kommersiell still for premium-produkt, fysisk plausibel scene.

Negativpakke:
B - Anti-AI-look-preset.

Scene:
Produkt sentrert på mørkt bord med enkel bakgrunn.

Handling:
Ingen objektbevegelse; fokus på lysform og overflaterespons.

Begrensninger:
Lås produktgeometri, logo, etikett og materialtekstur.

Hva skal ikke skje:
Ingen plast-hud-look på materialer, ingen falske flares, ingen overdrevet skarphet.

Teknisk spesifikasjon:
Nærbilde, 50mm, stativ, 16:9, høy detalj.

Visuell lås:
Hardt topplys kombinert med nøkkellys/fill/kantlys i kontrollert kontrast.

Konsistenslås:
Uendret produktstørrelse, uendret etikettdetalj, stabil skyggeretning.`,
    whyWorks: [
      "Eksempelet prioriterer låsing av produktdetaljer før estetikk.",
      "Anti-AI-look-pakken kutter vanlige artefakter i kommersielle stills.",
      "Lysoppsettet er presist og direkte knyttet til materialrespons.",
    ],
    ruleIds: [
      "mal-eksplisitt",
      "materialitet-refleks-glans",
      "lysretning-kvalitet-intensitet",
      "negativ-kontroll-eksplisitt",
      "kort-prompt-stabilitet",
    ],
    termRefs: [
      ["Nærbilde", "film"],
      ["Hardt topplys", "photo"],
      ["Nøkkellys fill rim-triade", "photo"],
      ["Filmkorn ekte vs filter", "vfx"],
    ],
  },
  {
    title: "Korridorsekvens med stabilitet gjennom hele klippet",
    outputType: "video",
    domain: "film-vfx",
    shortInput: "En person går gjennom en korridor, alt må være stabilt.",
    longOutput: `Rolle:
Du er video-regissør med ansvar for kontinuitet.

Kontekst:
Kort sekvens i realistisk kontorkorridor uten visuelt kaos.

Negativpakke:
C - Video-kontinuitet-preset.

Scene:
Lang korridor med dører, jevn belysning og tydelige linjer.

Handling:
En person går i jevnt tempo fra punkt A til punkt B.

Begrensninger:
Lås vegggeometri, dørplassering, personens klær og kroppsform.

Hva skal ikke skje:
Ingen bakgrunnsmorfing, ingen identitetsdrift, ingen skalahopp.

Teknisk spesifikasjon:
Video 6 sek, 24 fps, 16:9, dolly-inn med lav hastighet.

Visuell lås:
Fast lysretning og konstant eksponering i hele bevegelsen.

Konsistenslås:
Objektpermanens for alle korridorelementer og stabil temporal konsistens.`,
    whyWorks: [
      "Klar video-struktur reduserer risiko for sceneoppløsning.",
      "Preset C låser de mest kritiske kontinuitetsfeilene.",
      "Geometri, lys og identitet er eksplisitt avgrenset.",
    ],
    ruleIds: [
      "video-ingen-magisk-forsvinning",
      "video-scenen-skal-ikke-smelte",
      "video-konsistent-skala",
      "video-konsistent-lysforlop",
      "video-logisk-gradvis-overgang",
    ],
    termRefs: [
      ["Dolly-inn/ut", "film"],
      ["Geometrilås", "ai"],
      ["Objektpermanens", "ai"],
      ["Temporal konsistens video", "ai"],
    ],
  },
  {
    title: "Rolig kafedialog i dokumentarisk tone",
    outputType: "video",
    domain: "dokumentar",
    shortInput: "To personer i dialog på kafé, rolig dokumentarisk.",
    longOutput: `Rolle:
Du er dokumentarfotograf som prioriterer troverdig observasjon.

Kontekst:
Rolig samtale i kafé med naturlig omgivelseslyd.

Negativpakke:
C - Video-kontinuitet-preset.

Scene:
To personer ved bord, bakgrunnsgjester i lav aktivitet.

Handling:
Vekslende replikker med små naturlige kroppsbevegelser.

Begrensninger:
Bevar romakse, blikkretning og bordobjekter mellom klipp.

Hva skal ikke skje:
Ingen aksebrudd, ingen hopp i hudtone, ingen ekstra hender/deformasjoner.

Teknisk spesifikasjon:
Shot-reverse-shot, halvnært utsnitt, 50mm, 24 fps, 12 sek.

Visuell lås:
Mykt nøkkellys fra vindu, stabil fargetemperatur, moderat kontrast.

Konsistenslås:
Identitetslås for begge personer og konsistent komposisjonsbalanse.`,
    whyWorks: [
      "Prompten setter dokumentarisk mål før stil og filtervalg.",
      "Kontinuitetskravene er direkte knyttet til dialoggrammatikk.",
      "Negativpakke C beskytter mot vanlige AI-videoavvik.",
    ],
    ruleIds: [
      "bevar-romakse-dialog",
      "presiser-kamerahoyde",
      "video-logisk-gradvis-overgang",
      "video-konsistent-lysforlop",
      "negativ-kontroll-eksplisitt",
    ],
    termRefs: [
      ["Shot-reverse-shot", "film"],
      ["Romakse", "film"],
      ["Handholdt mikro-jitter", "film"],
      ["Identitetsdrift", "ai"],
    ],
  },
  {
    title: "Bygning som teknisk elevasjon",
    outputType: "image",
    domain: "arkitektur",
    shortInput: "En bygning vist som teknisk elevasjon.",
    longOutput: `Rolle:
Du er arkitektvisualisør med fokus på målbar representasjon.

Kontekst:
Teknisk presentasjon for konkurransegrunnlag.

Negativpakke:
A - Ingen endringer-preset.

Scene:
Fasade i ortografisk projeksjon med komplett vertikal oppbygning.

Handling:
Ingen handling; rent teknisk utsnitt med geometrisk nøyaktighet.

Begrensninger:
Ingen perspektiv, ingen nye elementer, ingen stilisering.

Hva skal ikke skje:
Ingen reframing, ingen dramatisk grading, ingen volumforvrengning.

Teknisk spesifikasjon:
Stillbilde 3:2, ortografisk frontvisning, høy kantpresisjon.

Visuell lås:
Jevn belysning, nøytral materialgjengivelse, tydelige overflategrenser.

Konsistenslås:
Geometrilås på alle etasjelinjer, vindusbånd og inngangspartier.`,
    whyWorks: [
      "Eksempelet prioriterer teknisk leveranse fremfor estetisk uttrykk.",
      "Negativpakke A sikrer at referanselogikk ikke brytes.",
      "Ortografi og geometri er spesifisert som ufravikelige krav.",
    ],
    ruleIds: [
      "teknisk-output-ingen-reframing",
      "presiser-ortografisk-perspektiv",
      "unnga-stilisering-ved-teknisk-presisjon",
      "angi-prioritet-ved-kollisjon",
      "avslutt-med-klare-begrensninger",
    ],
    termRefs: [
      ["Ortografisk projeksjon", "arch"],
      ["Aksonometri", "arch"],
      ["Geometrilås", "ai"],
      ["AOV / render-pass teknisk", "vfx"],
    ],
  },
  {
    title: "Rack focus uten endring av sceneinnhold",
    outputType: "video",
    domain: "film-vfx",
    shortInput: "Samme scene, men kun fokusplanet endres (rack focus).",
    longOutput: `Rolle:
Du er fokusoperatør for narrativt kontrollert kameraskift.

Kontekst:
En statisk scene med to dybdeplan og behov for fokusforflytning.

Negativpakke:
C - Video-kontinuitet-preset.

Scene:
Forgrunnsobjekt nær kamera, person i bakgrunn.

Handling:
Fokus flyttes gradvis fra forgrunn til bakgrunn uten kamerabevegelse.

Begrensninger:
Lås komposisjon, lys og geometri; endre kun fokusplan.

Hva skal ikke skje:
Ingen objektendring, ingen eksponeringshopp, ingen perspektivdrift.

Teknisk spesifikasjon:
Video 5 sek, 24 fps, 50mm, blender f/2.8.

Visuell lås:
Stabil lysretning og konstant skyggekvalitet gjennom hele fokusdraget.

Konsistenslås:
Fokusplan-lås med én definert overgang, ellers uendret scene.`,
    whyWorks: [
      "Prompten isolerer én variabel: fokusplan.",
      "Resten av scenen låses for å unngå sideeffekter.",
      "Kontinuitetskrav hindrer at rack focus blir sceneendring.",
    ],
    ruleIds: [
      "skill-instruksjon-fra-beskrivelse",
      "las-kritiske-elementer-forst",
      "video-kompatibel-start-slutt",
      "video-konsistent-lysforlop",
      "negativ-kontroll-eksplisitt",
    ],
    termRefs: [
      ["Fokusplan-lås", "photo"],
      ["Dybdeskarphet-kontroll", "photo"],
      ["Statisk kamera locked-off", "film"],
      ["Komposisjonsdrift", "ai"],
    ],
  },
  {
    title: "Lang eksponering i bygate med skarp arkitektur",
    outputType: "image",
    domain: "film-vfx",
    shortInput: "Lang eksponering i en gate, statiske elementer skarpe.",
    longOutput: `Rolle:
Du er nattfotograf med kontroll på eksponeringstid.

Kontekst:
Bygate etter regn med stillestående arkitektur og bevegelig trafikk.

Negativpakke:
B - Anti-AI-look-preset.

Scene:
Fast kameraposisjon mot gateperspektiv med lyskilder i dybden.

Handling:
Statiske elementer forblir skarpe, bevegelige lys danner kontrollerte striper.

Begrensninger:
Ingen geometriforskyvning i bygninger, ingen kunstig skarphetsfilter.

Hva skal ikke skje:
Ingen falsk HDR-glød, ingen tilfeldig støyoverlay, ingen dobbeltkonturer.

Teknisk spesifikasjon:
Stillbilde, stativ, lang eksponering, 16:9, lav ISO.

Visuell lås:
Konstant hvitbalanse og konsistent lysretning i hele scenen.

Konsistenslås:
Geometrilås på bygninger og objektpermanens på faste gateelementer.`,
    whyWorks: [
      "Lang eksponering beskrives fysisk, ikke som effektord.",
      "Anti-AI-look-pakken begrenser kunstig støy og glans.",
      "Skille mellom statisk og bevegelig er eksplisitt definert.",
    ],
    ruleIds: [
      "fysisk-plausibel-over-realistisk",
      "format-eksplisitt",
      "materialitet-refleks-glans",
      "negativ-kontroll-eksplisitt",
      "overdetaljering-artefaktrisiko",
    ],
    termRefs: [
      ["Lang eksponering", "photo"],
      ["Lyskontrastforhold", "photo"],
      ["Statisk kamera locked-off", "film"],
      ["Filmkorn ekte vs filter", "vfx"],
    ],
  },
  {
    title: "Hollandsk vinkel med konstant motiv",
    outputType: "image",
    domain: "film-vfx",
    shortInput: "Hollandsk vinkel: samme motiv, bare kamerarull endres.",
    longOutput: `Rolle:
Du er filmfotograf som tester kamerarull som eneste variabel.

Kontekst:
Samme motiv og lysoppsett i to varianter for visuell sammenligning.

Negativpakke:
A - Ingen endringer-preset.

Scene:
Person i urbant miljø med tydelige vertikale linjer i bakgrunn.

Handling:
Kamerarull justeres 12-15 grader; motiv og scene forblir identiske.

Begrensninger:
Ingen endring i brennvidde, avstand, lys eller objekter.

Hva skal ikke skje:
Ingen identitetsdrift, ingen ekstra rekvisitter, ingen perspektivendring.

Teknisk spesifikasjon:
Stillbilde 4:5, 35mm, én referanseversjon + én hollandsk variant.

Visuell lås:
Lik eksponering, lik fargetemperatur og lik skyggekvalitet i begge bilder.

Konsistenslås:
Kun kamerarull endres; alle øvrige parametere låses.`,
    whyWorks: [
      "Eksempelet gjør A/B-sammenligning metodisk og reproduserbar.",
      "Negativpakke A stopper utilsiktede sceneendringer.",
      "Regel om variabelisolasjon reduserer tolkningsstøy.",
    ],
    ruleIds: [
      "angi-prioritet-ved-kollisjon",
      "skill-instruksjon-fra-beskrivelse",
      "perspektiv-og-avstand",
      "negativ-kontroll-eksplisitt",
      "kort-prompt-stabilitet",
    ],
    termRefs: [
      ["Hollandsk vinkel", "film"],
      ["Komposisjonsdrift", "ai"],
      ["Lysretning primærkilde", "photo"],
      ["Statisk kamera locked-off", "film"],
    ],
  },
  {
    title: "Postvis-kompositt med synlige VFX-lag",
    outputType: "text",
    domain: "film-vfx",
    shortInput: "Postvis-kompositt: VFX-lag synlige, romlig korrekt.",
    longOutput: `Rolle:
Du er VFX-supervisor med ansvar for teknisk validering.

Kontekst:
Previs-rapport som skal brukes før endelig compositing.

Negativpakke:
A - Ingen endringer-preset.

Scene:
Hovedplate + CG-elementer + matte-lag med tydelig dybdeseparasjon.

Handling:
Beskriv hvordan hvert lag skal legges, kontrolleres og kvalitetssikres.

Begrensninger:
Ingen reframing, ingen estetisk grading, ingen tilfeldig pass-sammenblanding.

Hva skal ikke skje:
Ingen lagbytte, ingen feil i dybdeordre, ingen udefinert fargeromkonvertering.

Teknisk spesifikasjon:
AOV-pass, Z-dybdekart, matte-lag og LUT-styring dokumenteres punktvis.

Visuell lås:
Samme utsnitt og kameradata i alle pass.

Konsistenslås:
Renderlag og komposittrekkefølge skal være identisk mellom iterasjoner.`,
    whyWorks: [
      "Teksten skiller tydelig mellom teknisk kontroll og kreativ grading.",
      "Negativpakke A holder analysen ren for uønskede sceneendringer.",
      "Lagvis struktur gjør posten reproducerbar i team.",
    ],
    ruleIds: [
      "teknisk-output-ingen-reframing",
      "bruk-representasjonsskift-bevisst",
      "spesifiser-teknisk-eller-estetisk",
      "negativ-kontroll-eksplisitt",
      "avslutt-med-klare-begrensninger",
    ],
    termRefs: [
      ["Postvis (previs-kompositt)", "vfx"],
      ["Kompositt-pipeline", "vfx"],
      ["Matte-lag", "vfx"],
      ["LUT / fargeprofil", "vfx"],
    ],
  },
  {
    title: "Z-dybdepass med fast utsnitt",
    outputType: "image",
    domain: "film-vfx",
    shortInput: "Z-dybdepass: gråtone dybdedata, samme utsnitt.",
    longOutput: `Rolle:
Du er teknisk compositing-artist.

Kontekst:
Dybdeleveranse for etterarbeid uten estetisk behandling.

Negativpakke:
A - Ingen endringer-preset.

Scene:
Original scene i samme frame med tydelig forgrunn, mellomgrunn og bakgrunn.

Handling:
Konverter scenen til gråtone dybdekart der nær = lys og fjern = mørk.

Begrensninger:
Ingen nye objekter, ingen endret kameravinkel, ingen stilisering.

Hva skal ikke skje:
Ingen fargeinformasjon, ingen banding, ingen geometriavvik.

Teknisk spesifikasjon:
16-bit gråtone, samme oppløsning og utsnitt som kildescenen.

Visuell lås:
Lik framing, lik akse og lik perspektivlogikk som referanse.

Konsistenslås:
Geometrilås og objektpermanens gjelder for hele passet.`,
    whyWorks: [
      "Eksempelet er tydelig på at dette er teknisk output, ikke estetisk bilde.",
      "Negativpakke A forhindrer at modellen introduserer nye elementer.",
      "Konverteringsreglene er presise og kompatible med postpipeline.",
    ],
    ruleIds: [
      "teknisk-output-ingen-reframing",
      "presiser-ortografisk-perspektiv",
      "video-kompatibel-start-slutt",
      "negativ-kontroll-eksplisitt",
      "avslutt-med-klare-begrensninger",
    ],
    termRefs: [
      ["Z-dybdepass gråtonekart", "vfx"],
      ["AOV / render-pass teknisk", "vfx"],
      ["Geometrilås", "ai"],
      ["Objektpermanens", "ai"],
    ],
  },
];

export const promptExamples: PromptExample[] = seeds.map((seed) => ({
  slug: slugify(seed.title),
  title: seed.title,
  outputType: seed.outputType,
  domain: seed.domain,
  shortInput: seed.shortInput,
  longOutput: seed.longOutput,
  whyWorks: seed.whyWorks,
  ruleIds: seed.ruleIds,
  termSlugs: seed.termRefs.map(([termNo, domain]) => termSlug(termNo, domain)),
  updatedAt: "2026-02-23",
}));

export const examplesBySlug = Object.fromEntries(
  promptExamples.map((example) => [example.slug, example])
);
