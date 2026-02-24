// AUTO-GENERERT AV Norsk Prompting Data Engine
// Fil: negativePresets.generated.ts
// Ikke rediger manuelt.

export type NegativePresetGenerated = {
  id: string;
  title: string;
  description: string;
  items: string[];
};

export const negativePresetsGeneratedRaw = [
  {
    "id": "preset-a-ingen-endringer",
    "tags": [
      "domain:reklame",
      "stage:produksjon",
      "kanal:web",
      "format:16:9",
      "mal:kjennskap",
      "strenghet:høy",
      "brandLock:ja",
      "textLock:ja",
      "productLock:ja",
      "pakke:negative-presets",
      "policy:text-output-only"
    ],
    "items": [
      "Ikke legg til objekter",
      "Ikke fjern objekter",
      "Ikke endre ansikt",
      "Ikke endre tekst",
      "Ikke endre bakgrunn",
      "Ikke endre arkitektur",
      "Ikke moderniser",
      "Ingen stilfilter",
      "Ingen ekstra effekter",
      "Ingen hallusinerte detaljer"
    ],
    "title": "Ingen endringer",
    "metadata": {
      "taxonomy": {
        "mal": "kjennskap",
        "kanal": "web",
        "stage": "produksjon",
        "domain": "reklame",
        "format": "16:9",
        "textLock": true,
        "brandLock": true,
        "strenghet": "høy",
        "productLock": true
      },
      "outputPolicy": "text-only",
      "mediaGeneration": false
    },
    "description": "For referanselåste jobber der scene, identitet og geometri skal bevares."
  },
  {
    "id": "preset-b-anti-ai-look",
    "tags": [
      "domain:reklame",
      "stage:post",
      "kanal:web",
      "format:4:5",
      "mal:kjennskap",
      "strenghet:høy",
      "brandLock:ja",
      "textLock:ja",
      "productLock:ja",
      "pakke:negative-presets",
      "policy:text-output-only"
    ],
    "items": [
      "Ingen plast-hud",
      "Ingen beauty filter",
      "Ingen overdrevet skarphet",
      "Ingen falske flares",
      "Ingen falsk filmkorn-overlay",
      "Ingen CGI-look",
      "Ingen anime-stil",
      "Ingen watercolor-stil",
      "Ingen illustrative filter"
    ],
    "title": "Anti-AI-look",
    "metadata": {
      "taxonomy": {
        "mal": "kjennskap",
        "kanal": "web",
        "stage": "post",
        "domain": "reklame",
        "format": "4:5",
        "textLock": true,
        "brandLock": true,
        "strenghet": "høy",
        "productLock": true
      },
      "outputPolicy": "text-only",
      "mediaGeneration": false
    },
    "description": "For profesjonell output uten plastisk eller overprosessert preg."
  },
  {
    "id": "preset-c-video-kontinuitet",
    "tags": [
      "domain:film",
      "stage:produksjon",
      "kanal:SoMe",
      "format:9:16",
      "mal:engasjement",
      "strenghet:høy",
      "brandLock:ja",
      "textLock:ja",
      "productLock:ja",
      "pakke:negative-presets",
      "policy:text-output-only"
    ],
    "items": [
      "Ingen magisk forsvinning",
      "Ingen spontan materialendring",
      "Ingen skala-hopp",
      "Ingen lys-hopp",
      "Ingen bakgrunnsmorfing",
      "Ingen ekstra lemmer",
      "Ingen deformerte hender",
      "Ingen identitetsdrift"
    ],
    "title": "Video-kontinuitet",
    "metadata": {
      "taxonomy": {
        "mal": "engasjement",
        "kanal": "SoMe",
        "stage": "produksjon",
        "domain": "film",
        "format": "9:16",
        "textLock": true,
        "brandLock": true,
        "strenghet": "høy",
        "productLock": true
      },
      "outputPolicy": "text-only",
      "mediaGeneration": false
    },
    "description": "For sekvenser der temporal stabilitet og fysisk logikk er kritisk."
  },
  {
    "id": "preset-d-reklame-kvalitet",
    "tags": [
      "domain:reklame",
      "stage:publisering",
      "kanal:DOOH",
      "format:banner",
      "mal:konvertering",
      "strenghet:høy",
      "brandLock:ja",
      "textLock:ja",
      "productLock:ja",
      "pakke:negative-presets",
      "policy:text-output-only"
    ],
    "items": [
      "Ingen feilskrift i overskrift eller CTA",
      "Ingen deformert logo",
      "Ingen feil produktgeometri",
      "Ingen feil merkefarger",
      "Ingen uleselig tekst",
      "Ingen tilfeldig språkblanding",
      "Ingen uforankret claims"
    ],
    "title": "Reklame-kvalitet",
    "metadata": {
      "taxonomy": {
        "mal": "konvertering",
        "kanal": "DOOH",
        "stage": "publisering",
        "domain": "reklame",
        "format": "banner",
        "textLock": true,
        "brandLock": true,
        "strenghet": "høy",
        "productLock": true
      },
      "outputPolicy": "text-only",
      "mediaGeneration": false
    },
    "description": "For kommersiell kvalitetssikring av tekst, logo og produkt."
  },
  {
    "id": "preset-e-audio-konsistens",
    "tags": [
      "domain:reklame",
      "stage:post",
      "kanal:SoMe",
      "format:9:16",
      "mal:engasjement",
      "strenghet:høy",
      "brandLock:ja",
      "textLock:ja",
      "productLock:nei",
      "pakke:negative-presets",
      "policy:text-output-only"
    ],
    "items": [
      "Ingen utydelig språkblanding i voiceover",
      "Ingen tilfeldig tempoendring uten beat-overgang",
      "Ingen clipping eller forvrengning",
      "Ingen masking av CTA med musikknivå",
      "Ingen tilfeldig romklang mellom takes",
      "Ingen manglende hook i åpning",
      "Ingen SFX som kolliderer med hovedbudskap",
      "Ingen udefinert BPM i musikkprompt"
    ],
    "title": "Audio-konsistens",
    "metadata": {
      "taxonomy": {
        "mal": "engasjement",
        "kanal": "SoMe",
        "stage": "post",
        "domain": "reklame",
        "format": "9:16",
        "textLock": true,
        "brandLock": true,
        "strenghet": "høy",
        "productLock": false
      },
      "outputPolicy": "text-only",
      "mediaGeneration": false
    },
    "description": "For voice, musikk og SFX der timing, nivå og tydelighet må være stabilt."
  }
];

export const negativePresetsGenerated: NegativePresetGenerated[] = [
  {
    "id": "preset-a-ingen-endringer",
    "title": "Ingen endringer",
    "description": "For referanselåste jobber der scene, identitet og geometri skal bevares.",
    "items": [
      "Ikke legg til objekter",
      "Ikke fjern objekter",
      "Ikke endre ansikt",
      "Ikke endre tekst",
      "Ikke endre bakgrunn",
      "Ikke endre arkitektur",
      "Ikke moderniser",
      "Ingen stilfilter",
      "Ingen ekstra effekter",
      "Ingen hallusinerte detaljer"
    ]
  },
  {
    "id": "preset-b-anti-ai-look",
    "title": "Anti-AI-look",
    "description": "For profesjonell output uten plastisk eller overprosessert preg.",
    "items": [
      "Ingen plast-hud",
      "Ingen beauty filter",
      "Ingen overdrevet skarphet",
      "Ingen falske flares",
      "Ingen falsk filmkorn-overlay",
      "Ingen CGI-look",
      "Ingen anime-stil",
      "Ingen watercolor-stil",
      "Ingen illustrative filter"
    ]
  },
  {
    "id": "preset-c-video-kontinuitet",
    "title": "Video-kontinuitet",
    "description": "For sekvenser der temporal stabilitet og fysisk logikk er kritisk.",
    "items": [
      "Ingen magisk forsvinning",
      "Ingen spontan materialendring",
      "Ingen skala-hopp",
      "Ingen lys-hopp",
      "Ingen bakgrunnsmorfing",
      "Ingen ekstra lemmer",
      "Ingen deformerte hender",
      "Ingen identitetsdrift"
    ]
  },
  {
    "id": "preset-d-reklame-kvalitet",
    "title": "Reklame-kvalitet",
    "description": "For kommersiell kvalitetssikring av tekst, logo og produkt.",
    "items": [
      "Ingen feilskrift i overskrift eller CTA",
      "Ingen deformert logo",
      "Ingen feil produktgeometri",
      "Ingen feil merkefarger",
      "Ingen uleselig tekst",
      "Ingen tilfeldig språkblanding",
      "Ingen uforankret claims"
    ]
  },
  {
    "id": "preset-e-audio-konsistens",
    "title": "Audio-konsistens",
    "description": "For voice, musikk og SFX der timing, nivå og tydelighet må være stabilt.",
    "items": [
      "Ingen utydelig språkblanding i voiceover",
      "Ingen tilfeldig tempoendring uten beat-overgang",
      "Ingen clipping eller forvrengning",
      "Ingen masking av CTA med musikknivå",
      "Ingen tilfeldig romklang mellom takes",
      "Ingen manglende hook i åpning",
      "Ingen SFX som kolliderer med hovedbudskap",
      "Ingen udefinert BPM i musikkprompt"
    ]
  }
];

export const negativePresetsGeneratedById = Object.fromEntries(negativePresetsGenerated.map((entry) => [entry.id, entry]));
