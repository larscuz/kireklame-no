import type { CinematicGenre } from "./types";

export const cinematicGenres: CinematicGenre[] = [
  {
    id: "film-noir-1940",
    navn: "Film noir (1940-tallets kriminalestetikk)",
    effekt: "Hardt nøkkellys, sterke kontraster, moralsk tvetydighet og skyggearkitektur.",
    promptStruktur: {
      mal: `Mål: Skap en film noir-inspirert scene.

Motiv:
Detektiv i trenchcoat, halvveis i skygge.

Lys:
Hardt nøkkellys gjennom persienner, stripete skygger over ansikt.
Sterk chiaroscuro, lav nøkkel-eksponering.

Miljø:
Våt asfalt utenfor vindu, nattregn, røyk synlig i motlys.

Kamera:
50mm linse, grunn dybdeskarphet, klassisk studiokomposisjon.

Atmosfære:
Kornet 35mm filmtekstur, monokrom sort/hvitt, urban melankoli.

Begrensninger:
Ingen moderne elementer, ingen fargeinnslag, ingen glanset uttrykk.`,
    },
    sterkeBegreper: [
      "chiaroscuro",
      "lav nøkkel-belysning",
      "kantlys (rim light)",
      "35mm filmkorn",
      "persienneskygger",
    ],
  },
  {
    id: "neo-noir",
    navn: "Neo-noir (moderne urban isolasjon)",
    effekt: "Neonrefleksjoner, regn og moralsk gråsone med teknologisk kulde.",
    promptStruktur: {
      mal: `Mål: Moderne neo-noir nattestetikk.

Motiv:
Ensom figur i bakbelyst silhuett.

Miljø:
Regnvåt bakgate, neon i magenta og cyan, damp fra kumlokk.

Lys:
Baklys med kanteffekt, anamorfisk linseglød, høy dynamisk kontrast.

Kamera:
85mm kompresjon, grunn dybdeskarphet.

Atmosfære:
Urban isolasjon, kald teknologi-estetikk.

Begrensninger:
Ingen tegneserieuttrykk, ingen overmettet neon.`,
    },
    sterkeBegreper: [
      "anamorfiske flares",
      "natteksponering med høy dynamikk",
      "fargekontrast magenta/cyan",
      "bakbelyst silhuett",
    ],
  },
  {
    id: "arkitektonisk-elevasjon",
    navn: "Arkitektonisk elevasjon (ortografisk fasade)",
    effekt: "Perspektiv fjernes for å gjøre relasjoner flate, målbare og tekniske.",
    representasjonsskift: "Foto til ortografisk fasade",
    promptStruktur: {
      mal: `Mål: Lag en arkitektonisk elevasjon fra referansen.

Representasjon:
Ortografisk projeksjon, ingen perspektivforvrengning.

Struktur:
Flat fasade, korrekt proporsjon, målbar geometri.

Lys:
Nøytralt, jevnt, ingen dramatisk skygge.

Begrensninger:
Ingen stilisering, ingen ekstra elementer, ingen reframing.`,
    },
    sterkeBegreper: [
      "ortografisk projeksjon",
      "målbar geometri",
      "fasadesnitt",
      "flat projeksjon",
    ],
  },
  {
    id: "z-depth-pass",
    navn: "Z-dybdepass (romlig data)",
    effekt: "Viser dybde i gråtoner for komposittkontroll, ikke estetisk stil.",
    representasjonsskift: "Scene til dybdedata",
    promptStruktur: {
      mal: `Mål: Generer et Z-dybdepass fra scenen.

Format:
Gråtonegradient der lys = nær og mørk = langt unna.

Kamera:
Behold original kameravinkel og utsnitt.

Begrensninger:
Ingen nye objekter.
Ingen stilisering.
Ingen endring av komposisjon.`,
    },
    sterkeBegreper: ["depth map", "gråtonedybde", "romlig lagdeling", "kamera-akse-lås"],
  },
  {
    id: "shot-reverse-shot",
    navn: "Shot-reverse-shot",
    effekt: "Dialoggrammatikk i to vinkler med stabil romakse.",
    representasjonsskift: "Enkeltbilde til dialogstruktur",
    promptStruktur: {
      mal: `Mål: Konverter scenen til shot-reverse-shot-oppsett.

Struktur:
To komplementære utsnitt.
Matchende blikkretning.
Bevar romakse.

Kamera:
Halvnært utsnitt, 50mm.

Begrensninger:
Ingen romlig forvirring.
Ingen aksebrudd.`,
    },
    sterkeBegreper: ["romakse", "matchende blikklinje", "dialoggrammatikk", "halvnært utsnitt"],
  },
  {
    id: "aov-breakdown",
    navn: "AOV-nedbrytning (renderlag)",
    effekt: "Teknisk dekomponering av lyskomponenter for etterarbeid i VFX.",
    representasjonsskift: "Scene til renderlag",
    promptStruktur: {
      mal: `Mål: Produser AOV-nedbrytning.

Pass:
Diffuse
Specular
Reflections
Shadows
Ambient

Kamera:
Behold posisjon og framing.

Begrensninger:
Ingen stilisering.
Ingen nye objekter.
Ingen reframing.`,
    },
    sterkeBegreper: ["diffuspass", "spekulærpass", "renderlag", "komposittvennlig resultat"],
  },
];

export const cinematicGenresById = Object.fromEntries(
  cinematicGenres.map((entry) => [entry.id, entry])
);
