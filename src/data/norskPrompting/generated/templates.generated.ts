// AUTO-GENERERT AV Norsk Prompting Data Engine
// Fil: templates.generated.ts
// Ikke rediger manuelt.

import type { PromptTemplate } from "../types";

export const templatesGeneratedRaw = [
  {
    "id": "brand-identitet-01",
    "tags": [
      "domain:reklame",
      "stage:konsept",
      "kanal:web",
      "format:1:1",
      "mal:kjennskap",
      "strenghet:middels",
      "brandLock:ja",
      "textLock:ja",
      "productLock:ja",
      "kategori:brand-identitet"
    ],
    "title": "Brand og identitet 01 (web 1:1)",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "kjennskap. Kanal web. Format 1:1."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "SMB-eier med tidsmangel. Innsikt: Målgruppen velger løsningen som er enklest å forstå på få sekunder."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Bestill demo."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt i aktiv bruk med tydelig håndgrep og stabil geometri"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Realistisk kontor eller hjemmemiljø med kontrollert bakgrunn"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "50mm, halvnært utsnitt, statisk kamera"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Key 45 grader, myk fill, rim for separasjon"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Budskap i øvre tredel, produkt sentralt, CTA i lavere høyre hjørne"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-d-reklame-kvalitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever image med produksjonsklar struktur for web i 1:1."
      }
    ],
    "domain": "design-system",
    "useCase": "Reklamefaglig mal for brand og identitet med fokus på kjennskap og web.",
    "metadata": {
      "taxonomy": {
        "mal": "kjennskap",
        "kanal": "web",
        "stage": "konsept",
        "domain": "reklame",
        "format": "1:1",
        "textLock": true,
        "brandLock": true,
        "strenghet": "middels",
        "productLock": true
      },
      "recommendedNegativePreset": "preset-d-reklame-kvalitet"
    },
    "outputType": "image",
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "brand-identitet-02",
    "tags": [
      "domain:reklame",
      "stage:konsept",
      "kanal:print",
      "format:16:9",
      "mal:kjennskap",
      "strenghet:høy",
      "brandLock:ja",
      "textLock:ja",
      "productLock:ja",
      "kategori:brand-identitet"
    ],
    "title": "Brand og identitet 02 (print 16:9)",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "kjennskap. Kanal print. Format 16:9."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "Markedsleder med høyt tempo. Innsikt: Tydelig produktnytte slår visuell støy i feed."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Prøv gratis."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt i realistisk miljø med synlig funksjon i kontekst"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Nøytral studio-setting med lesbar materialitet"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "35mm, medium shot, rolig dolly-inn"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Hardt key med kontrollert fill og nøytral fargetemperatur"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Produkt i forgrunn, støttebudskap i mellomgrunn, logo i bakgrunn"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-d-reklame-kvalitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever image med produksjonsklar struktur for print i 16:9."
      }
    ],
    "domain": "design-system",
    "useCase": "Reklamefaglig mal for brand og identitet med fokus på kjennskap og print.",
    "metadata": {
      "taxonomy": {
        "mal": "kjennskap",
        "kanal": "print",
        "stage": "konsept",
        "domain": "reklame",
        "format": "16:9",
        "textLock": true,
        "brandLock": true,
        "strenghet": "høy",
        "productLock": true
      },
      "recommendedNegativePreset": "preset-d-reklame-kvalitet"
    },
    "outputType": "image",
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "brand-identitet-03",
    "tags": [
      "domain:reklame",
      "stage:konsept",
      "kanal:DOOH",
      "format:banner",
      "mal:kjennskap",
      "strenghet:middels",
      "brandLock:ja",
      "textLock:ja",
      "productLock:ja",
      "kategori:brand-identitet"
    ],
    "title": "Brand og identitet 03 (DOOH banner)",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "kjennskap. Kanal DOOH. Format banner."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "Innholdsprodusent med publiseringspress. Innsikt: Merkevaren må kjennes igjen før CTA har effekt."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Se løsningen."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt og avsender i samme bilde for klar avsenderidentitet"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Bymiljø med moderat aktivitet uten å stjele fokus"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "85mm, nærbilde, låst horisont"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Naturlig vinduslys med subtil fill og presis skyggekontroll"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Tydelig visuell hierarki: overskrift, produkt, CTA"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-d-reklame-kvalitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever image med produksjonsklar struktur for DOOH i banner."
      }
    ],
    "domain": "design-system",
    "useCase": "Reklamefaglig mal for brand og identitet med fokus på kjennskap og DOOH.",
    "metadata": {
      "taxonomy": {
        "mal": "kjennskap",
        "kanal": "DOOH",
        "stage": "konsept",
        "domain": "reklame",
        "format": "banner",
        "textLock": true,
        "brandLock": true,
        "strenghet": "middels",
        "productLock": true
      },
      "recommendedNegativePreset": "preset-d-reklame-kvalitet"
    },
    "outputType": "image",
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "brand-identitet-04",
    "tags": [
      "domain:reklame",
      "stage:konsept",
      "kanal:web",
      "format:1:1",
      "mal:kjennskap",
      "strenghet:høy",
      "brandLock:ja",
      "textLock:ja",
      "productLock:ja",
      "kategori:brand-identitet"
    ],
    "title": "Brand og identitet 04 (web 1:1)",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "kjennskap. Kanal web. Format 1:1."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "SMB-eier med tidsmangel. Innsikt: Målgruppen velger løsningen som er enklest å forstå på få sekunder."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Kontakt oss."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt i aktiv bruk med tydelig håndgrep og stabil geometri"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Realistisk kontor eller hjemmemiljø med kontrollert bakgrunn"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "50mm, halvnært utsnitt, statisk kamera"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Key 45 grader, myk fill, rim for separasjon"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Budskap i øvre tredel, produkt sentralt, CTA i lavere høyre hjørne"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-d-reklame-kvalitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever image med produksjonsklar struktur for web i 1:1."
      }
    ],
    "domain": "design-system",
    "useCase": "Reklamefaglig mal for brand og identitet med fokus på kjennskap og web.",
    "metadata": {
      "taxonomy": {
        "mal": "kjennskap",
        "kanal": "web",
        "stage": "konsept",
        "domain": "reklame",
        "format": "1:1",
        "textLock": true,
        "brandLock": true,
        "strenghet": "høy",
        "productLock": true
      },
      "recommendedNegativePreset": "preset-d-reklame-kvalitet"
    },
    "outputType": "image",
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "brand-identitet-05",
    "tags": [
      "domain:reklame",
      "stage:konsept",
      "kanal:print",
      "format:16:9",
      "mal:kjennskap",
      "strenghet:middels",
      "brandLock:ja",
      "textLock:ja",
      "productLock:ja",
      "kategori:brand-identitet"
    ],
    "title": "Brand og identitet 05 (print 16:9)",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "kjennskap. Kanal print. Format 16:9."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "Markedsleder med høyt tempo. Innsikt: Tydelig produktnytte slår visuell støy i feed."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Lær mer."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt i realistisk miljø med synlig funksjon i kontekst"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Nøytral studio-setting med lesbar materialitet"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "35mm, medium shot, rolig dolly-inn"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Hardt key med kontrollert fill og nøytral fargetemperatur"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Produkt i forgrunn, støttebudskap i mellomgrunn, logo i bakgrunn"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-d-reklame-kvalitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever image med produksjonsklar struktur for print i 16:9."
      }
    ],
    "domain": "design-system",
    "useCase": "Reklamefaglig mal for brand og identitet med fokus på kjennskap og print.",
    "metadata": {
      "taxonomy": {
        "mal": "kjennskap",
        "kanal": "print",
        "stage": "konsept",
        "domain": "reklame",
        "format": "16:9",
        "textLock": true,
        "brandLock": true,
        "strenghet": "middels",
        "productLock": true
      },
      "recommendedNegativePreset": "preset-d-reklame-kvalitet"
    },
    "outputType": "image",
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "brand-identitet-06",
    "tags": [
      "domain:reklame",
      "stage:konsept",
      "kanal:DOOH",
      "format:banner",
      "mal:kjennskap",
      "strenghet:høy",
      "brandLock:ja",
      "textLock:ja",
      "productLock:ja",
      "kategori:brand-identitet"
    ],
    "title": "Brand og identitet 06 (DOOH banner)",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "kjennskap. Kanal DOOH. Format banner."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "Innholdsprodusent med publiseringspress. Innsikt: Merkevaren må kjennes igjen før CTA har effekt."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Bestill demo."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt og avsender i samme bilde for klar avsenderidentitet"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Bymiljø med moderat aktivitet uten å stjele fokus"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "85mm, nærbilde, låst horisont"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Naturlig vinduslys med subtil fill og presis skyggekontroll"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Tydelig visuell hierarki: overskrift, produkt, CTA"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-d-reklame-kvalitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever image med produksjonsklar struktur for DOOH i banner."
      }
    ],
    "domain": "design-system",
    "useCase": "Reklamefaglig mal for brand og identitet med fokus på kjennskap og DOOH.",
    "metadata": {
      "taxonomy": {
        "mal": "kjennskap",
        "kanal": "DOOH",
        "stage": "konsept",
        "domain": "reklame",
        "format": "banner",
        "textLock": true,
        "brandLock": true,
        "strenghet": "høy",
        "productLock": true
      },
      "recommendedNegativePreset": "preset-d-reklame-kvalitet"
    },
    "outputType": "image",
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "brand-identitet-07",
    "tags": [
      "domain:reklame",
      "stage:konsept",
      "kanal:web",
      "format:1:1",
      "mal:kjennskap",
      "strenghet:middels",
      "brandLock:ja",
      "textLock:ja",
      "productLock:ja",
      "kategori:brand-identitet"
    ],
    "title": "Brand og identitet 07 (web 1:1)",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "kjennskap. Kanal web. Format 1:1."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "SMB-eier med tidsmangel. Innsikt: Målgruppen velger løsningen som er enklest å forstå på få sekunder."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Prøv gratis."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt i aktiv bruk med tydelig håndgrep og stabil geometri"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Realistisk kontor eller hjemmemiljø med kontrollert bakgrunn"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "50mm, halvnært utsnitt, statisk kamera"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Key 45 grader, myk fill, rim for separasjon"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Budskap i øvre tredel, produkt sentralt, CTA i lavere høyre hjørne"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-d-reklame-kvalitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever image med produksjonsklar struktur for web i 1:1."
      }
    ],
    "domain": "design-system",
    "useCase": "Reklamefaglig mal for brand og identitet med fokus på kjennskap og web.",
    "metadata": {
      "taxonomy": {
        "mal": "kjennskap",
        "kanal": "web",
        "stage": "konsept",
        "domain": "reklame",
        "format": "1:1",
        "textLock": true,
        "brandLock": true,
        "strenghet": "middels",
        "productLock": true
      },
      "recommendedNegativePreset": "preset-d-reklame-kvalitet"
    },
    "outputType": "image",
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "brand-identitet-08",
    "tags": [
      "domain:reklame",
      "stage:konsept",
      "kanal:print",
      "format:16:9",
      "mal:kjennskap",
      "strenghet:høy",
      "brandLock:ja",
      "textLock:ja",
      "productLock:ja",
      "kategori:brand-identitet"
    ],
    "title": "Brand og identitet 08 (print 16:9)",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "kjennskap. Kanal print. Format 16:9."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "Markedsleder med høyt tempo. Innsikt: Tydelig produktnytte slår visuell støy i feed."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Se løsningen."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt i realistisk miljø med synlig funksjon i kontekst"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Nøytral studio-setting med lesbar materialitet"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "35mm, medium shot, rolig dolly-inn"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Hardt key med kontrollert fill og nøytral fargetemperatur"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Produkt i forgrunn, støttebudskap i mellomgrunn, logo i bakgrunn"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-d-reklame-kvalitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever image med produksjonsklar struktur for print i 16:9."
      }
    ],
    "domain": "design-system",
    "useCase": "Reklamefaglig mal for brand og identitet med fokus på kjennskap og print.",
    "metadata": {
      "taxonomy": {
        "mal": "kjennskap",
        "kanal": "print",
        "stage": "konsept",
        "domain": "reklame",
        "format": "16:9",
        "textLock": true,
        "brandLock": true,
        "strenghet": "høy",
        "productLock": true
      },
      "recommendedNegativePreset": "preset-d-reklame-kvalitet"
    },
    "outputType": "image",
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "brand-identitet-09",
    "tags": [
      "domain:reklame",
      "stage:konsept",
      "kanal:DOOH",
      "format:banner",
      "mal:kjennskap",
      "strenghet:middels",
      "brandLock:ja",
      "textLock:ja",
      "productLock:ja",
      "kategori:brand-identitet"
    ],
    "title": "Brand og identitet 09 (DOOH banner)",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "kjennskap. Kanal DOOH. Format banner."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "Innholdsprodusent med publiseringspress. Innsikt: Merkevaren må kjennes igjen før CTA har effekt."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Kontakt oss."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt og avsender i samme bilde for klar avsenderidentitet"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Bymiljø med moderat aktivitet uten å stjele fokus"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "85mm, nærbilde, låst horisont"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Naturlig vinduslys med subtil fill og presis skyggekontroll"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Tydelig visuell hierarki: overskrift, produkt, CTA"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-d-reklame-kvalitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever image med produksjonsklar struktur for DOOH i banner."
      }
    ],
    "domain": "design-system",
    "useCase": "Reklamefaglig mal for brand og identitet med fokus på kjennskap og DOOH.",
    "metadata": {
      "taxonomy": {
        "mal": "kjennskap",
        "kanal": "DOOH",
        "stage": "konsept",
        "domain": "reklame",
        "format": "banner",
        "textLock": true,
        "brandLock": true,
        "strenghet": "middels",
        "productLock": true
      },
      "recommendedNegativePreset": "preset-d-reklame-kvalitet"
    },
    "outputType": "image",
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "brand-identitet-10",
    "tags": [
      "domain:reklame",
      "stage:konsept",
      "kanal:web",
      "format:1:1",
      "mal:kjennskap",
      "strenghet:høy",
      "brandLock:ja",
      "textLock:ja",
      "productLock:ja",
      "kategori:brand-identitet"
    ],
    "title": "Brand og identitet 10 (web 1:1)",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "kjennskap. Kanal web. Format 1:1."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "SMB-eier med tidsmangel. Innsikt: Målgruppen velger løsningen som er enklest å forstå på få sekunder."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Lær mer."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt i aktiv bruk med tydelig håndgrep og stabil geometri"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Realistisk kontor eller hjemmemiljø med kontrollert bakgrunn"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "50mm, halvnært utsnitt, statisk kamera"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Key 45 grader, myk fill, rim for separasjon"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Budskap i øvre tredel, produkt sentralt, CTA i lavere høyre hjørne"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-d-reklame-kvalitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever image med produksjonsklar struktur for web i 1:1."
      }
    ],
    "domain": "design-system",
    "useCase": "Reklamefaglig mal for brand og identitet med fokus på kjennskap og web.",
    "metadata": {
      "taxonomy": {
        "mal": "kjennskap",
        "kanal": "web",
        "stage": "konsept",
        "domain": "reklame",
        "format": "1:1",
        "textLock": true,
        "brandLock": true,
        "strenghet": "høy",
        "productLock": true
      },
      "recommendedNegativePreset": "preset-d-reklame-kvalitet"
    },
    "outputType": "image",
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "brand-identitet-11",
    "tags": [
      "domain:reklame",
      "stage:konsept",
      "kanal:print",
      "format:16:9",
      "mal:kjennskap",
      "strenghet:middels",
      "brandLock:ja",
      "textLock:ja",
      "productLock:ja",
      "kategori:brand-identitet"
    ],
    "title": "Brand og identitet 11 (print 16:9)",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "kjennskap. Kanal print. Format 16:9."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "Markedsleder med høyt tempo. Innsikt: Tydelig produktnytte slår visuell støy i feed."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Bestill demo."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt i realistisk miljø med synlig funksjon i kontekst"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Nøytral studio-setting med lesbar materialitet"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "35mm, medium shot, rolig dolly-inn"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Hardt key med kontrollert fill og nøytral fargetemperatur"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Produkt i forgrunn, støttebudskap i mellomgrunn, logo i bakgrunn"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-d-reklame-kvalitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever image med produksjonsklar struktur for print i 16:9."
      }
    ],
    "domain": "design-system",
    "useCase": "Reklamefaglig mal for brand og identitet med fokus på kjennskap og print.",
    "metadata": {
      "taxonomy": {
        "mal": "kjennskap",
        "kanal": "print",
        "stage": "konsept",
        "domain": "reklame",
        "format": "16:9",
        "textLock": true,
        "brandLock": true,
        "strenghet": "middels",
        "productLock": true
      },
      "recommendedNegativePreset": "preset-d-reklame-kvalitet"
    },
    "outputType": "image",
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "brand-identitet-12",
    "tags": [
      "domain:reklame",
      "stage:konsept",
      "kanal:DOOH",
      "format:banner",
      "mal:kjennskap",
      "strenghet:høy",
      "brandLock:ja",
      "textLock:ja",
      "productLock:ja",
      "kategori:brand-identitet"
    ],
    "title": "Brand og identitet 12 (DOOH banner)",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "kjennskap. Kanal DOOH. Format banner."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "Innholdsprodusent med publiseringspress. Innsikt: Merkevaren må kjennes igjen før CTA har effekt."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Prøv gratis."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt og avsender i samme bilde for klar avsenderidentitet"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Bymiljø med moderat aktivitet uten å stjele fokus"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "85mm, nærbilde, låst horisont"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Naturlig vinduslys med subtil fill og presis skyggekontroll"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Tydelig visuell hierarki: overskrift, produkt, CTA"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-d-reklame-kvalitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever image med produksjonsklar struktur for DOOH i banner."
      }
    ],
    "domain": "design-system",
    "useCase": "Reklamefaglig mal for brand og identitet med fokus på kjennskap og DOOH.",
    "metadata": {
      "taxonomy": {
        "mal": "kjennskap",
        "kanal": "DOOH",
        "stage": "konsept",
        "domain": "reklame",
        "format": "banner",
        "textLock": true,
        "brandLock": true,
        "strenghet": "høy",
        "productLock": true
      },
      "recommendedNegativePreset": "preset-d-reklame-kvalitet"
    },
    "outputType": "image",
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "brand-identitet-13",
    "tags": [
      "domain:reklame",
      "stage:konsept",
      "kanal:web",
      "format:1:1",
      "mal:kjennskap",
      "strenghet:middels",
      "brandLock:ja",
      "textLock:ja",
      "productLock:ja",
      "kategori:brand-identitet"
    ],
    "title": "Brand og identitet 13 (web 1:1)",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "kjennskap. Kanal web. Format 1:1."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "SMB-eier med tidsmangel. Innsikt: Målgruppen velger løsningen som er enklest å forstå på få sekunder."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Se løsningen."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt i aktiv bruk med tydelig håndgrep og stabil geometri"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Realistisk kontor eller hjemmemiljø med kontrollert bakgrunn"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "50mm, halvnært utsnitt, statisk kamera"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Key 45 grader, myk fill, rim for separasjon"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Budskap i øvre tredel, produkt sentralt, CTA i lavere høyre hjørne"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-d-reklame-kvalitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever image med produksjonsklar struktur for web i 1:1."
      }
    ],
    "domain": "design-system",
    "useCase": "Reklamefaglig mal for brand og identitet med fokus på kjennskap og web.",
    "metadata": {
      "taxonomy": {
        "mal": "kjennskap",
        "kanal": "web",
        "stage": "konsept",
        "domain": "reklame",
        "format": "1:1",
        "textLock": true,
        "brandLock": true,
        "strenghet": "middels",
        "productLock": true
      },
      "recommendedNegativePreset": "preset-d-reklame-kvalitet"
    },
    "outputType": "image",
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "brand-identitet-14",
    "tags": [
      "domain:reklame",
      "stage:konsept",
      "kanal:print",
      "format:16:9",
      "mal:kjennskap",
      "strenghet:høy",
      "brandLock:ja",
      "textLock:ja",
      "productLock:ja",
      "kategori:brand-identitet"
    ],
    "title": "Brand og identitet 14 (print 16:9)",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "kjennskap. Kanal print. Format 16:9."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "Markedsleder med høyt tempo. Innsikt: Tydelig produktnytte slår visuell støy i feed."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Kontakt oss."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt i realistisk miljø med synlig funksjon i kontekst"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Nøytral studio-setting med lesbar materialitet"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "35mm, medium shot, rolig dolly-inn"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Hardt key med kontrollert fill og nøytral fargetemperatur"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Produkt i forgrunn, støttebudskap i mellomgrunn, logo i bakgrunn"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-d-reklame-kvalitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever image med produksjonsklar struktur for print i 16:9."
      }
    ],
    "domain": "design-system",
    "useCase": "Reklamefaglig mal for brand og identitet med fokus på kjennskap og print.",
    "metadata": {
      "taxonomy": {
        "mal": "kjennskap",
        "kanal": "print",
        "stage": "konsept",
        "domain": "reklame",
        "format": "16:9",
        "textLock": true,
        "brandLock": true,
        "strenghet": "høy",
        "productLock": true
      },
      "recommendedNegativePreset": "preset-d-reklame-kvalitet"
    },
    "outputType": "image",
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "brand-identitet-15",
    "tags": [
      "domain:reklame",
      "stage:konsept",
      "kanal:DOOH",
      "format:banner",
      "mal:kjennskap",
      "strenghet:middels",
      "brandLock:ja",
      "textLock:ja",
      "productLock:ja",
      "kategori:brand-identitet"
    ],
    "title": "Brand og identitet 15 (DOOH banner)",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "kjennskap. Kanal DOOH. Format banner."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "Innholdsprodusent med publiseringspress. Innsikt: Merkevaren må kjennes igjen før CTA har effekt."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Lær mer."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt og avsender i samme bilde for klar avsenderidentitet"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Bymiljø med moderat aktivitet uten å stjele fokus"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "85mm, nærbilde, låst horisont"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Naturlig vinduslys med subtil fill og presis skyggekontroll"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Tydelig visuell hierarki: overskrift, produkt, CTA"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-d-reklame-kvalitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever image med produksjonsklar struktur for DOOH i banner."
      }
    ],
    "domain": "design-system",
    "useCase": "Reklamefaglig mal for brand og identitet med fokus på kjennskap og DOOH.",
    "metadata": {
      "taxonomy": {
        "mal": "kjennskap",
        "kanal": "DOOH",
        "stage": "konsept",
        "domain": "reklame",
        "format": "banner",
        "textLock": true,
        "brandLock": true,
        "strenghet": "middels",
        "productLock": true
      },
      "recommendedNegativePreset": "preset-d-reklame-kvalitet"
    },
    "outputType": "image",
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "brand-identitet-16",
    "tags": [
      "domain:reklame",
      "stage:konsept",
      "kanal:web",
      "format:1:1",
      "mal:kjennskap",
      "strenghet:høy",
      "brandLock:ja",
      "textLock:ja",
      "productLock:ja",
      "kategori:brand-identitet"
    ],
    "title": "Brand og identitet 16 (web 1:1)",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "kjennskap. Kanal web. Format 1:1."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "SMB-eier med tidsmangel. Innsikt: Målgruppen velger løsningen som er enklest å forstå på få sekunder."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Bestill demo."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt i aktiv bruk med tydelig håndgrep og stabil geometri"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Realistisk kontor eller hjemmemiljø med kontrollert bakgrunn"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "50mm, halvnært utsnitt, statisk kamera"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Key 45 grader, myk fill, rim for separasjon"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Budskap i øvre tredel, produkt sentralt, CTA i lavere høyre hjørne"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-d-reklame-kvalitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever image med produksjonsklar struktur for web i 1:1."
      }
    ],
    "domain": "design-system",
    "useCase": "Reklamefaglig mal for brand og identitet med fokus på kjennskap og web.",
    "metadata": {
      "taxonomy": {
        "mal": "kjennskap",
        "kanal": "web",
        "stage": "konsept",
        "domain": "reklame",
        "format": "1:1",
        "textLock": true,
        "brandLock": true,
        "strenghet": "høy",
        "productLock": true
      },
      "recommendedNegativePreset": "preset-d-reklame-kvalitet"
    },
    "outputType": "image",
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "brand-identitet-17",
    "tags": [
      "domain:reklame",
      "stage:konsept",
      "kanal:print",
      "format:16:9",
      "mal:kjennskap",
      "strenghet:middels",
      "brandLock:ja",
      "textLock:ja",
      "productLock:ja",
      "kategori:brand-identitet"
    ],
    "title": "Brand og identitet 17 (print 16:9)",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "kjennskap. Kanal print. Format 16:9."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "Markedsleder med høyt tempo. Innsikt: Tydelig produktnytte slår visuell støy i feed."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Prøv gratis."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt i realistisk miljø med synlig funksjon i kontekst"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Nøytral studio-setting med lesbar materialitet"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "35mm, medium shot, rolig dolly-inn"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Hardt key med kontrollert fill og nøytral fargetemperatur"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Produkt i forgrunn, støttebudskap i mellomgrunn, logo i bakgrunn"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-d-reklame-kvalitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever image med produksjonsklar struktur for print i 16:9."
      }
    ],
    "domain": "design-system",
    "useCase": "Reklamefaglig mal for brand og identitet med fokus på kjennskap og print.",
    "metadata": {
      "taxonomy": {
        "mal": "kjennskap",
        "kanal": "print",
        "stage": "konsept",
        "domain": "reklame",
        "format": "16:9",
        "textLock": true,
        "brandLock": true,
        "strenghet": "middels",
        "productLock": true
      },
      "recommendedNegativePreset": "preset-d-reklame-kvalitet"
    },
    "outputType": "image",
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "brand-identitet-18",
    "tags": [
      "domain:reklame",
      "stage:konsept",
      "kanal:DOOH",
      "format:banner",
      "mal:kjennskap",
      "strenghet:høy",
      "brandLock:ja",
      "textLock:ja",
      "productLock:ja",
      "kategori:brand-identitet"
    ],
    "title": "Brand og identitet 18 (DOOH banner)",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "kjennskap. Kanal DOOH. Format banner."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "Innholdsprodusent med publiseringspress. Innsikt: Merkevaren må kjennes igjen før CTA har effekt."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Se løsningen."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt og avsender i samme bilde for klar avsenderidentitet"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Bymiljø med moderat aktivitet uten å stjele fokus"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "85mm, nærbilde, låst horisont"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Naturlig vinduslys med subtil fill og presis skyggekontroll"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Tydelig visuell hierarki: overskrift, produkt, CTA"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-d-reklame-kvalitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever image med produksjonsklar struktur for DOOH i banner."
      }
    ],
    "domain": "design-system",
    "useCase": "Reklamefaglig mal for brand og identitet med fokus på kjennskap og DOOH.",
    "metadata": {
      "taxonomy": {
        "mal": "kjennskap",
        "kanal": "DOOH",
        "stage": "konsept",
        "domain": "reklame",
        "format": "banner",
        "textLock": true,
        "brandLock": true,
        "strenghet": "høy",
        "productLock": true
      },
      "recommendedNegativePreset": "preset-d-reklame-kvalitet"
    },
    "outputType": "image",
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "brand-identitet-19",
    "tags": [
      "domain:reklame",
      "stage:konsept",
      "kanal:web",
      "format:1:1",
      "mal:kjennskap",
      "strenghet:middels",
      "brandLock:ja",
      "textLock:ja",
      "productLock:ja",
      "kategori:brand-identitet"
    ],
    "title": "Brand og identitet 19 (web 1:1)",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "kjennskap. Kanal web. Format 1:1."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "SMB-eier med tidsmangel. Innsikt: Målgruppen velger løsningen som er enklest å forstå på få sekunder."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Kontakt oss."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt i aktiv bruk med tydelig håndgrep og stabil geometri"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Realistisk kontor eller hjemmemiljø med kontrollert bakgrunn"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "50mm, halvnært utsnitt, statisk kamera"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Key 45 grader, myk fill, rim for separasjon"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Budskap i øvre tredel, produkt sentralt, CTA i lavere høyre hjørne"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-d-reklame-kvalitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever image med produksjonsklar struktur for web i 1:1."
      }
    ],
    "domain": "design-system",
    "useCase": "Reklamefaglig mal for brand og identitet med fokus på kjennskap og web.",
    "metadata": {
      "taxonomy": {
        "mal": "kjennskap",
        "kanal": "web",
        "stage": "konsept",
        "domain": "reklame",
        "format": "1:1",
        "textLock": true,
        "brandLock": true,
        "strenghet": "middels",
        "productLock": true
      },
      "recommendedNegativePreset": "preset-d-reklame-kvalitet"
    },
    "outputType": "image",
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "brand-identitet-20",
    "tags": [
      "domain:reklame",
      "stage:konsept",
      "kanal:print",
      "format:16:9",
      "mal:kjennskap",
      "strenghet:høy",
      "brandLock:ja",
      "textLock:ja",
      "productLock:ja",
      "kategori:brand-identitet"
    ],
    "title": "Brand og identitet 20 (print 16:9)",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "kjennskap. Kanal print. Format 16:9."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "Markedsleder med høyt tempo. Innsikt: Tydelig produktnytte slår visuell støy i feed."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Lær mer."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt i realistisk miljø med synlig funksjon i kontekst"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Nøytral studio-setting med lesbar materialitet"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "35mm, medium shot, rolig dolly-inn"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Hardt key med kontrollert fill og nøytral fargetemperatur"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Produkt i forgrunn, støttebudskap i mellomgrunn, logo i bakgrunn"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-d-reklame-kvalitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever image med produksjonsklar struktur for print i 16:9."
      }
    ],
    "domain": "design-system",
    "useCase": "Reklamefaglig mal for brand og identitet med fokus på kjennskap og print.",
    "metadata": {
      "taxonomy": {
        "mal": "kjennskap",
        "kanal": "print",
        "stage": "konsept",
        "domain": "reklame",
        "format": "16:9",
        "textLock": true,
        "brandLock": true,
        "strenghet": "høy",
        "productLock": true
      },
      "recommendedNegativePreset": "preset-d-reklame-kvalitet"
    },
    "outputType": "image",
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "dooh-plakat-01",
    "tags": [
      "domain:reklame",
      "stage:publisering",
      "kanal:DOOH",
      "format:16:9",
      "mal:kjennskap",
      "strenghet:middels",
      "brandLock:ja",
      "textLock:ja",
      "productLock:ja",
      "kategori:dooh-plakat"
    ],
    "title": "DOOH og plakat 01 (DOOH 16:9)",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "kjennskap. Kanal DOOH. Format 16:9."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "SMB-eier med tidsmangel. Innsikt: Målgruppen velger løsningen som er enklest å forstå på få sekunder."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Bestill demo."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt i aktiv bruk med tydelig håndgrep og stabil geometri"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Realistisk kontor eller hjemmemiljø med kontrollert bakgrunn"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "50mm, halvnært utsnitt, statisk kamera"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Key 45 grader, myk fill, rim for separasjon"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Budskap i øvre tredel, produkt sentralt, CTA i lavere høyre hjørne"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-d-reklame-kvalitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever image med produksjonsklar struktur for DOOH i 16:9."
      }
    ],
    "domain": "redaksjonell",
    "useCase": "Reklamefaglig mal for dooh og plakat med fokus på kjennskap og DOOH.",
    "metadata": {
      "taxonomy": {
        "mal": "kjennskap",
        "kanal": "DOOH",
        "stage": "publisering",
        "domain": "reklame",
        "format": "16:9",
        "textLock": true,
        "brandLock": true,
        "strenghet": "middels",
        "productLock": true
      },
      "recommendedNegativePreset": "preset-d-reklame-kvalitet"
    },
    "outputType": "image",
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "dooh-plakat-02",
    "tags": [
      "domain:reklame",
      "stage:publisering",
      "kanal:print",
      "format:4:5",
      "mal:konvertering",
      "strenghet:høy",
      "brandLock:ja",
      "textLock:ja",
      "productLock:ja",
      "kategori:dooh-plakat"
    ],
    "title": "DOOH og plakat 02 (print 4:5)",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "konvertering. Kanal print. Format 4:5."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "Markedsleder med høyt tempo. Innsikt: Tydelig produktnytte slår visuell støy i feed."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Prøv gratis."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt i realistisk miljø med synlig funksjon i kontekst"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Nøytral studio-setting med lesbar materialitet"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "35mm, medium shot, rolig dolly-inn"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Hardt key med kontrollert fill og nøytral fargetemperatur"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Produkt i forgrunn, støttebudskap i mellomgrunn, logo i bakgrunn"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-d-reklame-kvalitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever image med produksjonsklar struktur for print i 4:5."
      }
    ],
    "domain": "redaksjonell",
    "useCase": "Reklamefaglig mal for dooh og plakat med fokus på konvertering og print.",
    "metadata": {
      "taxonomy": {
        "mal": "konvertering",
        "kanal": "print",
        "stage": "publisering",
        "domain": "reklame",
        "format": "4:5",
        "textLock": true,
        "brandLock": true,
        "strenghet": "høy",
        "productLock": true
      },
      "recommendedNegativePreset": "preset-d-reklame-kvalitet"
    },
    "outputType": "image",
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "dooh-plakat-03",
    "tags": [
      "domain:reklame",
      "stage:publisering",
      "kanal:DOOH",
      "format:banner",
      "mal:kjennskap",
      "strenghet:middels",
      "brandLock:ja",
      "textLock:ja",
      "productLock:ja",
      "kategori:dooh-plakat"
    ],
    "title": "DOOH og plakat 03 (DOOH banner)",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "kjennskap. Kanal DOOH. Format banner."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "Innholdsprodusent med publiseringspress. Innsikt: Merkevaren må kjennes igjen før CTA har effekt."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Se løsningen."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt og avsender i samme bilde for klar avsenderidentitet"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Bymiljø med moderat aktivitet uten å stjele fokus"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "85mm, nærbilde, låst horisont"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Naturlig vinduslys med subtil fill og presis skyggekontroll"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Tydelig visuell hierarki: overskrift, produkt, CTA"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-d-reklame-kvalitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever image med produksjonsklar struktur for DOOH i banner."
      }
    ],
    "domain": "redaksjonell",
    "useCase": "Reklamefaglig mal for dooh og plakat med fokus på kjennskap og DOOH.",
    "metadata": {
      "taxonomy": {
        "mal": "kjennskap",
        "kanal": "DOOH",
        "stage": "publisering",
        "domain": "reklame",
        "format": "banner",
        "textLock": true,
        "brandLock": true,
        "strenghet": "middels",
        "productLock": true
      },
      "recommendedNegativePreset": "preset-d-reklame-kvalitet"
    },
    "outputType": "image",
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "dooh-plakat-04",
    "tags": [
      "domain:reklame",
      "stage:publisering",
      "kanal:print",
      "format:16:9",
      "mal:konvertering",
      "strenghet:høy",
      "brandLock:ja",
      "textLock:ja",
      "productLock:ja",
      "kategori:dooh-plakat"
    ],
    "title": "DOOH og plakat 04 (print 16:9)",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "konvertering. Kanal print. Format 16:9."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "SMB-eier med tidsmangel. Innsikt: Målgruppen velger løsningen som er enklest å forstå på få sekunder."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Kontakt oss."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt i aktiv bruk med tydelig håndgrep og stabil geometri"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Realistisk kontor eller hjemmemiljø med kontrollert bakgrunn"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "50mm, halvnært utsnitt, statisk kamera"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Key 45 grader, myk fill, rim for separasjon"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Budskap i øvre tredel, produkt sentralt, CTA i lavere høyre hjørne"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-d-reklame-kvalitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever image med produksjonsklar struktur for print i 16:9."
      }
    ],
    "domain": "redaksjonell",
    "useCase": "Reklamefaglig mal for dooh og plakat med fokus på konvertering og print.",
    "metadata": {
      "taxonomy": {
        "mal": "konvertering",
        "kanal": "print",
        "stage": "publisering",
        "domain": "reklame",
        "format": "16:9",
        "textLock": true,
        "brandLock": true,
        "strenghet": "høy",
        "productLock": true
      },
      "recommendedNegativePreset": "preset-d-reklame-kvalitet"
    },
    "outputType": "image",
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "dooh-plakat-05",
    "tags": [
      "domain:reklame",
      "stage:publisering",
      "kanal:DOOH",
      "format:4:5",
      "mal:kjennskap",
      "strenghet:middels",
      "brandLock:ja",
      "textLock:ja",
      "productLock:ja",
      "kategori:dooh-plakat"
    ],
    "title": "DOOH og plakat 05 (DOOH 4:5)",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "kjennskap. Kanal DOOH. Format 4:5."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "Markedsleder med høyt tempo. Innsikt: Tydelig produktnytte slår visuell støy i feed."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Lær mer."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt i realistisk miljø med synlig funksjon i kontekst"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Nøytral studio-setting med lesbar materialitet"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "35mm, medium shot, rolig dolly-inn"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Hardt key med kontrollert fill og nøytral fargetemperatur"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Produkt i forgrunn, støttebudskap i mellomgrunn, logo i bakgrunn"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-d-reklame-kvalitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever image med produksjonsklar struktur for DOOH i 4:5."
      }
    ],
    "domain": "redaksjonell",
    "useCase": "Reklamefaglig mal for dooh og plakat med fokus på kjennskap og DOOH.",
    "metadata": {
      "taxonomy": {
        "mal": "kjennskap",
        "kanal": "DOOH",
        "stage": "publisering",
        "domain": "reklame",
        "format": "4:5",
        "textLock": true,
        "brandLock": true,
        "strenghet": "middels",
        "productLock": true
      },
      "recommendedNegativePreset": "preset-d-reklame-kvalitet"
    },
    "outputType": "image",
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "dooh-plakat-06",
    "tags": [
      "domain:reklame",
      "stage:publisering",
      "kanal:print",
      "format:banner",
      "mal:konvertering",
      "strenghet:høy",
      "brandLock:ja",
      "textLock:ja",
      "productLock:ja",
      "kategori:dooh-plakat"
    ],
    "title": "DOOH og plakat 06 (print banner)",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "konvertering. Kanal print. Format banner."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "Innholdsprodusent med publiseringspress. Innsikt: Merkevaren må kjennes igjen før CTA har effekt."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Bestill demo."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt og avsender i samme bilde for klar avsenderidentitet"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Bymiljø med moderat aktivitet uten å stjele fokus"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "85mm, nærbilde, låst horisont"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Naturlig vinduslys med subtil fill og presis skyggekontroll"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Tydelig visuell hierarki: overskrift, produkt, CTA"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-d-reklame-kvalitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever image med produksjonsklar struktur for print i banner."
      }
    ],
    "domain": "redaksjonell",
    "useCase": "Reklamefaglig mal for dooh og plakat med fokus på konvertering og print.",
    "metadata": {
      "taxonomy": {
        "mal": "konvertering",
        "kanal": "print",
        "stage": "publisering",
        "domain": "reklame",
        "format": "banner",
        "textLock": true,
        "brandLock": true,
        "strenghet": "høy",
        "productLock": true
      },
      "recommendedNegativePreset": "preset-d-reklame-kvalitet"
    },
    "outputType": "image",
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "dooh-plakat-07",
    "tags": [
      "domain:reklame",
      "stage:publisering",
      "kanal:DOOH",
      "format:16:9",
      "mal:kjennskap",
      "strenghet:middels",
      "brandLock:ja",
      "textLock:ja",
      "productLock:ja",
      "kategori:dooh-plakat"
    ],
    "title": "DOOH og plakat 07 (DOOH 16:9)",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "kjennskap. Kanal DOOH. Format 16:9."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "SMB-eier med tidsmangel. Innsikt: Målgruppen velger løsningen som er enklest å forstå på få sekunder."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Prøv gratis."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt i aktiv bruk med tydelig håndgrep og stabil geometri"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Realistisk kontor eller hjemmemiljø med kontrollert bakgrunn"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "50mm, halvnært utsnitt, statisk kamera"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Key 45 grader, myk fill, rim for separasjon"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Budskap i øvre tredel, produkt sentralt, CTA i lavere høyre hjørne"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-d-reklame-kvalitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever image med produksjonsklar struktur for DOOH i 16:9."
      }
    ],
    "domain": "redaksjonell",
    "useCase": "Reklamefaglig mal for dooh og plakat med fokus på kjennskap og DOOH.",
    "metadata": {
      "taxonomy": {
        "mal": "kjennskap",
        "kanal": "DOOH",
        "stage": "publisering",
        "domain": "reklame",
        "format": "16:9",
        "textLock": true,
        "brandLock": true,
        "strenghet": "middels",
        "productLock": true
      },
      "recommendedNegativePreset": "preset-d-reklame-kvalitet"
    },
    "outputType": "image",
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "dooh-plakat-08",
    "tags": [
      "domain:reklame",
      "stage:publisering",
      "kanal:print",
      "format:4:5",
      "mal:konvertering",
      "strenghet:høy",
      "brandLock:ja",
      "textLock:ja",
      "productLock:ja",
      "kategori:dooh-plakat"
    ],
    "title": "DOOH og plakat 08 (print 4:5)",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "konvertering. Kanal print. Format 4:5."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "Markedsleder med høyt tempo. Innsikt: Tydelig produktnytte slår visuell støy i feed."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Se løsningen."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt i realistisk miljø med synlig funksjon i kontekst"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Nøytral studio-setting med lesbar materialitet"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "35mm, medium shot, rolig dolly-inn"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Hardt key med kontrollert fill og nøytral fargetemperatur"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Produkt i forgrunn, støttebudskap i mellomgrunn, logo i bakgrunn"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-d-reklame-kvalitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever image med produksjonsklar struktur for print i 4:5."
      }
    ],
    "domain": "redaksjonell",
    "useCase": "Reklamefaglig mal for dooh og plakat med fokus på konvertering og print.",
    "metadata": {
      "taxonomy": {
        "mal": "konvertering",
        "kanal": "print",
        "stage": "publisering",
        "domain": "reklame",
        "format": "4:5",
        "textLock": true,
        "brandLock": true,
        "strenghet": "høy",
        "productLock": true
      },
      "recommendedNegativePreset": "preset-d-reklame-kvalitet"
    },
    "outputType": "image",
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "dooh-plakat-09",
    "tags": [
      "domain:reklame",
      "stage:publisering",
      "kanal:DOOH",
      "format:banner",
      "mal:kjennskap",
      "strenghet:middels",
      "brandLock:ja",
      "textLock:ja",
      "productLock:ja",
      "kategori:dooh-plakat"
    ],
    "title": "DOOH og plakat 09 (DOOH banner)",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "kjennskap. Kanal DOOH. Format banner."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "Innholdsprodusent med publiseringspress. Innsikt: Merkevaren må kjennes igjen før CTA har effekt."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Kontakt oss."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt og avsender i samme bilde for klar avsenderidentitet"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Bymiljø med moderat aktivitet uten å stjele fokus"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "85mm, nærbilde, låst horisont"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Naturlig vinduslys med subtil fill og presis skyggekontroll"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Tydelig visuell hierarki: overskrift, produkt, CTA"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-d-reklame-kvalitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever image med produksjonsklar struktur for DOOH i banner."
      }
    ],
    "domain": "redaksjonell",
    "useCase": "Reklamefaglig mal for dooh og plakat med fokus på kjennskap og DOOH.",
    "metadata": {
      "taxonomy": {
        "mal": "kjennskap",
        "kanal": "DOOH",
        "stage": "publisering",
        "domain": "reklame",
        "format": "banner",
        "textLock": true,
        "brandLock": true,
        "strenghet": "middels",
        "productLock": true
      },
      "recommendedNegativePreset": "preset-d-reklame-kvalitet"
    },
    "outputType": "image",
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "dooh-plakat-10",
    "tags": [
      "domain:reklame",
      "stage:publisering",
      "kanal:print",
      "format:16:9",
      "mal:konvertering",
      "strenghet:høy",
      "brandLock:ja",
      "textLock:ja",
      "productLock:ja",
      "kategori:dooh-plakat"
    ],
    "title": "DOOH og plakat 10 (print 16:9)",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "konvertering. Kanal print. Format 16:9."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "SMB-eier med tidsmangel. Innsikt: Målgruppen velger løsningen som er enklest å forstå på få sekunder."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Lær mer."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt i aktiv bruk med tydelig håndgrep og stabil geometri"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Realistisk kontor eller hjemmemiljø med kontrollert bakgrunn"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "50mm, halvnært utsnitt, statisk kamera"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Key 45 grader, myk fill, rim for separasjon"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Budskap i øvre tredel, produkt sentralt, CTA i lavere høyre hjørne"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-d-reklame-kvalitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever image med produksjonsklar struktur for print i 16:9."
      }
    ],
    "domain": "redaksjonell",
    "useCase": "Reklamefaglig mal for dooh og plakat med fokus på konvertering og print.",
    "metadata": {
      "taxonomy": {
        "mal": "konvertering",
        "kanal": "print",
        "stage": "publisering",
        "domain": "reklame",
        "format": "16:9",
        "textLock": true,
        "brandLock": true,
        "strenghet": "høy",
        "productLock": true
      },
      "recommendedNegativePreset": "preset-d-reklame-kvalitet"
    },
    "outputType": "image",
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "dooh-plakat-11",
    "tags": [
      "domain:reklame",
      "stage:publisering",
      "kanal:DOOH",
      "format:4:5",
      "mal:kjennskap",
      "strenghet:middels",
      "brandLock:ja",
      "textLock:ja",
      "productLock:ja",
      "kategori:dooh-plakat"
    ],
    "title": "DOOH og plakat 11 (DOOH 4:5)",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "kjennskap. Kanal DOOH. Format 4:5."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "Markedsleder med høyt tempo. Innsikt: Tydelig produktnytte slår visuell støy i feed."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Bestill demo."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt i realistisk miljø med synlig funksjon i kontekst"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Nøytral studio-setting med lesbar materialitet"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "35mm, medium shot, rolig dolly-inn"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Hardt key med kontrollert fill og nøytral fargetemperatur"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Produkt i forgrunn, støttebudskap i mellomgrunn, logo i bakgrunn"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-d-reklame-kvalitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever image med produksjonsklar struktur for DOOH i 4:5."
      }
    ],
    "domain": "redaksjonell",
    "useCase": "Reklamefaglig mal for dooh og plakat med fokus på kjennskap og DOOH.",
    "metadata": {
      "taxonomy": {
        "mal": "kjennskap",
        "kanal": "DOOH",
        "stage": "publisering",
        "domain": "reklame",
        "format": "4:5",
        "textLock": true,
        "brandLock": true,
        "strenghet": "middels",
        "productLock": true
      },
      "recommendedNegativePreset": "preset-d-reklame-kvalitet"
    },
    "outputType": "image",
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "dooh-plakat-12",
    "tags": [
      "domain:reklame",
      "stage:publisering",
      "kanal:print",
      "format:banner",
      "mal:konvertering",
      "strenghet:høy",
      "brandLock:ja",
      "textLock:ja",
      "productLock:ja",
      "kategori:dooh-plakat"
    ],
    "title": "DOOH og plakat 12 (print banner)",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "konvertering. Kanal print. Format banner."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "Innholdsprodusent med publiseringspress. Innsikt: Merkevaren må kjennes igjen før CTA har effekt."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Prøv gratis."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt og avsender i samme bilde for klar avsenderidentitet"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Bymiljø med moderat aktivitet uten å stjele fokus"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "85mm, nærbilde, låst horisont"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Naturlig vinduslys med subtil fill og presis skyggekontroll"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Tydelig visuell hierarki: overskrift, produkt, CTA"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-d-reklame-kvalitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever image med produksjonsklar struktur for print i banner."
      }
    ],
    "domain": "redaksjonell",
    "useCase": "Reklamefaglig mal for dooh og plakat med fokus på konvertering og print.",
    "metadata": {
      "taxonomy": {
        "mal": "konvertering",
        "kanal": "print",
        "stage": "publisering",
        "domain": "reklame",
        "format": "banner",
        "textLock": true,
        "brandLock": true,
        "strenghet": "høy",
        "productLock": true
      },
      "recommendedNegativePreset": "preset-d-reklame-kvalitet"
    },
    "outputType": "image",
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "dooh-plakat-13",
    "tags": [
      "domain:reklame",
      "stage:publisering",
      "kanal:DOOH",
      "format:16:9",
      "mal:kjennskap",
      "strenghet:middels",
      "brandLock:ja",
      "textLock:ja",
      "productLock:ja",
      "kategori:dooh-plakat"
    ],
    "title": "DOOH og plakat 13 (DOOH 16:9)",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "kjennskap. Kanal DOOH. Format 16:9."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "SMB-eier med tidsmangel. Innsikt: Målgruppen velger løsningen som er enklest å forstå på få sekunder."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Se løsningen."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt i aktiv bruk med tydelig håndgrep og stabil geometri"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Realistisk kontor eller hjemmemiljø med kontrollert bakgrunn"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "50mm, halvnært utsnitt, statisk kamera"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Key 45 grader, myk fill, rim for separasjon"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Budskap i øvre tredel, produkt sentralt, CTA i lavere høyre hjørne"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-d-reklame-kvalitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever image med produksjonsklar struktur for DOOH i 16:9."
      }
    ],
    "domain": "redaksjonell",
    "useCase": "Reklamefaglig mal for dooh og plakat med fokus på kjennskap og DOOH.",
    "metadata": {
      "taxonomy": {
        "mal": "kjennskap",
        "kanal": "DOOH",
        "stage": "publisering",
        "domain": "reklame",
        "format": "16:9",
        "textLock": true,
        "brandLock": true,
        "strenghet": "middels",
        "productLock": true
      },
      "recommendedNegativePreset": "preset-d-reklame-kvalitet"
    },
    "outputType": "image",
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "dooh-plakat-14",
    "tags": [
      "domain:reklame",
      "stage:publisering",
      "kanal:print",
      "format:4:5",
      "mal:konvertering",
      "strenghet:høy",
      "brandLock:ja",
      "textLock:ja",
      "productLock:ja",
      "kategori:dooh-plakat"
    ],
    "title": "DOOH og plakat 14 (print 4:5)",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "konvertering. Kanal print. Format 4:5."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "Markedsleder med høyt tempo. Innsikt: Tydelig produktnytte slår visuell støy i feed."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Kontakt oss."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt i realistisk miljø med synlig funksjon i kontekst"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Nøytral studio-setting med lesbar materialitet"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "35mm, medium shot, rolig dolly-inn"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Hardt key med kontrollert fill og nøytral fargetemperatur"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Produkt i forgrunn, støttebudskap i mellomgrunn, logo i bakgrunn"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-d-reklame-kvalitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever image med produksjonsklar struktur for print i 4:5."
      }
    ],
    "domain": "redaksjonell",
    "useCase": "Reklamefaglig mal for dooh og plakat med fokus på konvertering og print.",
    "metadata": {
      "taxonomy": {
        "mal": "konvertering",
        "kanal": "print",
        "stage": "publisering",
        "domain": "reklame",
        "format": "4:5",
        "textLock": true,
        "brandLock": true,
        "strenghet": "høy",
        "productLock": true
      },
      "recommendedNegativePreset": "preset-d-reklame-kvalitet"
    },
    "outputType": "image",
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "dooh-plakat-15",
    "tags": [
      "domain:reklame",
      "stage:publisering",
      "kanal:DOOH",
      "format:banner",
      "mal:kjennskap",
      "strenghet:middels",
      "brandLock:ja",
      "textLock:ja",
      "productLock:ja",
      "kategori:dooh-plakat"
    ],
    "title": "DOOH og plakat 15 (DOOH banner)",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "kjennskap. Kanal DOOH. Format banner."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "Innholdsprodusent med publiseringspress. Innsikt: Merkevaren må kjennes igjen før CTA har effekt."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Lær mer."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt og avsender i samme bilde for klar avsenderidentitet"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Bymiljø med moderat aktivitet uten å stjele fokus"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "85mm, nærbilde, låst horisont"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Naturlig vinduslys med subtil fill og presis skyggekontroll"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Tydelig visuell hierarki: overskrift, produkt, CTA"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-d-reklame-kvalitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever image med produksjonsklar struktur for DOOH i banner."
      }
    ],
    "domain": "redaksjonell",
    "useCase": "Reklamefaglig mal for dooh og plakat med fokus på kjennskap og DOOH.",
    "metadata": {
      "taxonomy": {
        "mal": "kjennskap",
        "kanal": "DOOH",
        "stage": "publisering",
        "domain": "reklame",
        "format": "banner",
        "textLock": true,
        "brandLock": true,
        "strenghet": "middels",
        "productLock": true
      },
      "recommendedNegativePreset": "preset-d-reklame-kvalitet"
    },
    "outputType": "image",
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "dooh-plakat-16",
    "tags": [
      "domain:reklame",
      "stage:publisering",
      "kanal:print",
      "format:16:9",
      "mal:konvertering",
      "strenghet:høy",
      "brandLock:ja",
      "textLock:ja",
      "productLock:ja",
      "kategori:dooh-plakat"
    ],
    "title": "DOOH og plakat 16 (print 16:9)",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "konvertering. Kanal print. Format 16:9."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "SMB-eier med tidsmangel. Innsikt: Målgruppen velger løsningen som er enklest å forstå på få sekunder."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Bestill demo."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt i aktiv bruk med tydelig håndgrep og stabil geometri"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Realistisk kontor eller hjemmemiljø med kontrollert bakgrunn"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "50mm, halvnært utsnitt, statisk kamera"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Key 45 grader, myk fill, rim for separasjon"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Budskap i øvre tredel, produkt sentralt, CTA i lavere høyre hjørne"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-d-reklame-kvalitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever image med produksjonsklar struktur for print i 16:9."
      }
    ],
    "domain": "redaksjonell",
    "useCase": "Reklamefaglig mal for dooh og plakat med fokus på konvertering og print.",
    "metadata": {
      "taxonomy": {
        "mal": "konvertering",
        "kanal": "print",
        "stage": "publisering",
        "domain": "reklame",
        "format": "16:9",
        "textLock": true,
        "brandLock": true,
        "strenghet": "høy",
        "productLock": true
      },
      "recommendedNegativePreset": "preset-d-reklame-kvalitet"
    },
    "outputType": "image",
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "dooh-plakat-17",
    "tags": [
      "domain:reklame",
      "stage:publisering",
      "kanal:DOOH",
      "format:4:5",
      "mal:kjennskap",
      "strenghet:middels",
      "brandLock:ja",
      "textLock:ja",
      "productLock:ja",
      "kategori:dooh-plakat"
    ],
    "title": "DOOH og plakat 17 (DOOH 4:5)",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "kjennskap. Kanal DOOH. Format 4:5."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "Markedsleder med høyt tempo. Innsikt: Tydelig produktnytte slår visuell støy i feed."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Prøv gratis."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt i realistisk miljø med synlig funksjon i kontekst"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Nøytral studio-setting med lesbar materialitet"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "35mm, medium shot, rolig dolly-inn"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Hardt key med kontrollert fill og nøytral fargetemperatur"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Produkt i forgrunn, støttebudskap i mellomgrunn, logo i bakgrunn"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-d-reklame-kvalitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever image med produksjonsklar struktur for DOOH i 4:5."
      }
    ],
    "domain": "redaksjonell",
    "useCase": "Reklamefaglig mal for dooh og plakat med fokus på kjennskap og DOOH.",
    "metadata": {
      "taxonomy": {
        "mal": "kjennskap",
        "kanal": "DOOH",
        "stage": "publisering",
        "domain": "reklame",
        "format": "4:5",
        "textLock": true,
        "brandLock": true,
        "strenghet": "middels",
        "productLock": true
      },
      "recommendedNegativePreset": "preset-d-reklame-kvalitet"
    },
    "outputType": "image",
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "dooh-plakat-18",
    "tags": [
      "domain:reklame",
      "stage:publisering",
      "kanal:print",
      "format:banner",
      "mal:konvertering",
      "strenghet:høy",
      "brandLock:ja",
      "textLock:ja",
      "productLock:ja",
      "kategori:dooh-plakat"
    ],
    "title": "DOOH og plakat 18 (print banner)",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "konvertering. Kanal print. Format banner."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "Innholdsprodusent med publiseringspress. Innsikt: Merkevaren må kjennes igjen før CTA har effekt."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Se løsningen."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt og avsender i samme bilde for klar avsenderidentitet"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Bymiljø med moderat aktivitet uten å stjele fokus"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "85mm, nærbilde, låst horisont"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Naturlig vinduslys med subtil fill og presis skyggekontroll"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Tydelig visuell hierarki: overskrift, produkt, CTA"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-d-reklame-kvalitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever image med produksjonsklar struktur for print i banner."
      }
    ],
    "domain": "redaksjonell",
    "useCase": "Reklamefaglig mal for dooh og plakat med fokus på konvertering og print.",
    "metadata": {
      "taxonomy": {
        "mal": "konvertering",
        "kanal": "print",
        "stage": "publisering",
        "domain": "reklame",
        "format": "banner",
        "textLock": true,
        "brandLock": true,
        "strenghet": "høy",
        "productLock": true
      },
      "recommendedNegativePreset": "preset-d-reklame-kvalitet"
    },
    "outputType": "image",
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "dooh-plakat-19",
    "tags": [
      "domain:reklame",
      "stage:publisering",
      "kanal:DOOH",
      "format:16:9",
      "mal:kjennskap",
      "strenghet:middels",
      "brandLock:ja",
      "textLock:ja",
      "productLock:ja",
      "kategori:dooh-plakat"
    ],
    "title": "DOOH og plakat 19 (DOOH 16:9)",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "kjennskap. Kanal DOOH. Format 16:9."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "SMB-eier med tidsmangel. Innsikt: Målgruppen velger løsningen som er enklest å forstå på få sekunder."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Kontakt oss."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt i aktiv bruk med tydelig håndgrep og stabil geometri"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Realistisk kontor eller hjemmemiljø med kontrollert bakgrunn"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "50mm, halvnært utsnitt, statisk kamera"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Key 45 grader, myk fill, rim for separasjon"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Budskap i øvre tredel, produkt sentralt, CTA i lavere høyre hjørne"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-d-reklame-kvalitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever image med produksjonsklar struktur for DOOH i 16:9."
      }
    ],
    "domain": "redaksjonell",
    "useCase": "Reklamefaglig mal for dooh og plakat med fokus på kjennskap og DOOH.",
    "metadata": {
      "taxonomy": {
        "mal": "kjennskap",
        "kanal": "DOOH",
        "stage": "publisering",
        "domain": "reklame",
        "format": "16:9",
        "textLock": true,
        "brandLock": true,
        "strenghet": "middels",
        "productLock": true
      },
      "recommendedNegativePreset": "preset-d-reklame-kvalitet"
    },
    "outputType": "image",
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "dooh-plakat-20",
    "tags": [
      "domain:reklame",
      "stage:publisering",
      "kanal:print",
      "format:4:5",
      "mal:konvertering",
      "strenghet:høy",
      "brandLock:ja",
      "textLock:ja",
      "productLock:ja",
      "kategori:dooh-plakat"
    ],
    "title": "DOOH og plakat 20 (print 4:5)",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "konvertering. Kanal print. Format 4:5."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "Markedsleder med høyt tempo. Innsikt: Tydelig produktnytte slår visuell støy i feed."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Lær mer."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt i realistisk miljø med synlig funksjon i kontekst"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Nøytral studio-setting med lesbar materialitet"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "35mm, medium shot, rolig dolly-inn"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Hardt key med kontrollert fill og nøytral fargetemperatur"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Produkt i forgrunn, støttebudskap i mellomgrunn, logo i bakgrunn"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-d-reklame-kvalitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever image med produksjonsklar struktur for print i 4:5."
      }
    ],
    "domain": "redaksjonell",
    "useCase": "Reklamefaglig mal for dooh og plakat med fokus på konvertering og print.",
    "metadata": {
      "taxonomy": {
        "mal": "konvertering",
        "kanal": "print",
        "stage": "publisering",
        "domain": "reklame",
        "format": "4:5",
        "textLock": true,
        "brandLock": true,
        "strenghet": "høy",
        "productLock": true
      },
      "recommendedNegativePreset": "preset-d-reklame-kvalitet"
    },
    "outputType": "image",
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "produkt-still-01",
    "tags": [
      "domain:reklame",
      "stage:produksjon",
      "kanal:web",
      "format:1:1",
      "mal:kjennskap",
      "strenghet:middels",
      "brandLock:ja",
      "textLock:ja",
      "productLock:ja",
      "kategori:produkt-still"
    ],
    "title": "Produktreklame still 01 (web 1:1)",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "kjennskap. Kanal web. Format 1:1."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "SMB-eier med tidsmangel. Innsikt: Målgruppen velger løsningen som er enklest å forstå på få sekunder."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Bestill demo."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt i aktiv bruk med tydelig håndgrep og stabil geometri"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Realistisk kontor eller hjemmemiljø med kontrollert bakgrunn"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "50mm, halvnært utsnitt, statisk kamera"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Key 45 grader, myk fill, rim for separasjon"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Budskap i øvre tredel, produkt sentralt, CTA i lavere høyre hjørne"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-b-anti-ai-look"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever image med produksjonsklar struktur for web i 1:1."
      }
    ],
    "domain": "produkt",
    "useCase": "Reklamefaglig mal for produktreklame still med fokus på kjennskap og web.",
    "metadata": {
      "taxonomy": {
        "mal": "kjennskap",
        "kanal": "web",
        "stage": "produksjon",
        "domain": "reklame",
        "format": "1:1",
        "textLock": true,
        "brandLock": true,
        "strenghet": "middels",
        "productLock": true
      },
      "recommendedNegativePreset": "preset-b-anti-ai-look"
    },
    "outputType": "image",
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "produkt-still-02",
    "tags": [
      "domain:reklame",
      "stage:produksjon",
      "kanal:print",
      "format:4:5",
      "mal:konvertering",
      "strenghet:høy",
      "brandLock:ja",
      "textLock:ja",
      "productLock:ja",
      "kategori:produkt-still"
    ],
    "title": "Produktreklame still 02 (print 4:5)",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "konvertering. Kanal print. Format 4:5."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "Markedsleder med høyt tempo. Innsikt: Tydelig produktnytte slår visuell støy i feed."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Prøv gratis."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt i realistisk miljø med synlig funksjon i kontekst"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Nøytral studio-setting med lesbar materialitet"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "35mm, medium shot, rolig dolly-inn"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Hardt key med kontrollert fill og nøytral fargetemperatur"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Produkt i forgrunn, støttebudskap i mellomgrunn, logo i bakgrunn"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-b-anti-ai-look"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever image med produksjonsklar struktur for print i 4:5."
      }
    ],
    "domain": "produkt",
    "useCase": "Reklamefaglig mal for produktreklame still med fokus på konvertering og print.",
    "metadata": {
      "taxonomy": {
        "mal": "konvertering",
        "kanal": "print",
        "stage": "produksjon",
        "domain": "reklame",
        "format": "4:5",
        "textLock": true,
        "brandLock": true,
        "strenghet": "høy",
        "productLock": true
      },
      "recommendedNegativePreset": "preset-b-anti-ai-look"
    },
    "outputType": "image",
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "produkt-still-03",
    "tags": [
      "domain:reklame",
      "stage:produksjon",
      "kanal:DOOH",
      "format:16:9",
      "mal:kjennskap",
      "strenghet:middels",
      "brandLock:ja",
      "textLock:ja",
      "productLock:ja",
      "kategori:produkt-still"
    ],
    "title": "Produktreklame still 03 (DOOH 16:9)",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "kjennskap. Kanal DOOH. Format 16:9."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "Innholdsprodusent med publiseringspress. Innsikt: Merkevaren må kjennes igjen før CTA har effekt."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Se løsningen."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt og avsender i samme bilde for klar avsenderidentitet"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Bymiljø med moderat aktivitet uten å stjele fokus"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "85mm, nærbilde, låst horisont"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Naturlig vinduslys med subtil fill og presis skyggekontroll"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Tydelig visuell hierarki: overskrift, produkt, CTA"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-b-anti-ai-look"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever image med produksjonsklar struktur for DOOH i 16:9."
      }
    ],
    "domain": "produkt",
    "useCase": "Reklamefaglig mal for produktreklame still med fokus på kjennskap og DOOH.",
    "metadata": {
      "taxonomy": {
        "mal": "kjennskap",
        "kanal": "DOOH",
        "stage": "produksjon",
        "domain": "reklame",
        "format": "16:9",
        "textLock": true,
        "brandLock": true,
        "strenghet": "middels",
        "productLock": true
      },
      "recommendedNegativePreset": "preset-b-anti-ai-look"
    },
    "outputType": "image",
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "produkt-still-04",
    "tags": [
      "domain:reklame",
      "stage:produksjon",
      "kanal:SoMe",
      "format:banner",
      "mal:konvertering",
      "strenghet:høy",
      "brandLock:ja",
      "textLock:ja",
      "productLock:ja",
      "kategori:produkt-still"
    ],
    "title": "Produktreklame still 04 (SoMe banner)",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "konvertering. Kanal SoMe. Format banner."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "SMB-eier med tidsmangel. Innsikt: Målgruppen velger løsningen som er enklest å forstå på få sekunder."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Kontakt oss."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt i aktiv bruk med tydelig håndgrep og stabil geometri"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Realistisk kontor eller hjemmemiljø med kontrollert bakgrunn"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "50mm, halvnært utsnitt, statisk kamera"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Key 45 grader, myk fill, rim for separasjon"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Budskap i øvre tredel, produkt sentralt, CTA i lavere høyre hjørne"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-b-anti-ai-look"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever image med produksjonsklar struktur for SoMe i banner."
      }
    ],
    "domain": "produkt",
    "useCase": "Reklamefaglig mal for produktreklame still med fokus på konvertering og SoMe.",
    "metadata": {
      "taxonomy": {
        "mal": "konvertering",
        "kanal": "SoMe",
        "stage": "produksjon",
        "domain": "reklame",
        "format": "banner",
        "textLock": true,
        "brandLock": true,
        "strenghet": "høy",
        "productLock": true
      },
      "recommendedNegativePreset": "preset-b-anti-ai-look"
    },
    "outputType": "image",
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "produkt-still-05",
    "tags": [
      "domain:reklame",
      "stage:produksjon",
      "kanal:web",
      "format:1:1",
      "mal:kjennskap",
      "strenghet:middels",
      "brandLock:ja",
      "textLock:ja",
      "productLock:ja",
      "kategori:produkt-still"
    ],
    "title": "Produktreklame still 05 (web 1:1)",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "kjennskap. Kanal web. Format 1:1."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "Markedsleder med høyt tempo. Innsikt: Tydelig produktnytte slår visuell støy i feed."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Lær mer."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt i realistisk miljø med synlig funksjon i kontekst"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Nøytral studio-setting med lesbar materialitet"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "35mm, medium shot, rolig dolly-inn"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Hardt key med kontrollert fill og nøytral fargetemperatur"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Produkt i forgrunn, støttebudskap i mellomgrunn, logo i bakgrunn"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-b-anti-ai-look"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever image med produksjonsklar struktur for web i 1:1."
      }
    ],
    "domain": "produkt",
    "useCase": "Reklamefaglig mal for produktreklame still med fokus på kjennskap og web.",
    "metadata": {
      "taxonomy": {
        "mal": "kjennskap",
        "kanal": "web",
        "stage": "produksjon",
        "domain": "reklame",
        "format": "1:1",
        "textLock": true,
        "brandLock": true,
        "strenghet": "middels",
        "productLock": true
      },
      "recommendedNegativePreset": "preset-b-anti-ai-look"
    },
    "outputType": "image",
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "produkt-still-06",
    "tags": [
      "domain:reklame",
      "stage:produksjon",
      "kanal:print",
      "format:4:5",
      "mal:konvertering",
      "strenghet:høy",
      "brandLock:ja",
      "textLock:ja",
      "productLock:ja",
      "kategori:produkt-still"
    ],
    "title": "Produktreklame still 06 (print 4:5)",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "konvertering. Kanal print. Format 4:5."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "Innholdsprodusent med publiseringspress. Innsikt: Merkevaren må kjennes igjen før CTA har effekt."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Bestill demo."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt og avsender i samme bilde for klar avsenderidentitet"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Bymiljø med moderat aktivitet uten å stjele fokus"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "85mm, nærbilde, låst horisont"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Naturlig vinduslys med subtil fill og presis skyggekontroll"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Tydelig visuell hierarki: overskrift, produkt, CTA"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-b-anti-ai-look"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever image med produksjonsklar struktur for print i 4:5."
      }
    ],
    "domain": "produkt",
    "useCase": "Reklamefaglig mal for produktreklame still med fokus på konvertering og print.",
    "metadata": {
      "taxonomy": {
        "mal": "konvertering",
        "kanal": "print",
        "stage": "produksjon",
        "domain": "reklame",
        "format": "4:5",
        "textLock": true,
        "brandLock": true,
        "strenghet": "høy",
        "productLock": true
      },
      "recommendedNegativePreset": "preset-b-anti-ai-look"
    },
    "outputType": "image",
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "produkt-still-07",
    "tags": [
      "domain:reklame",
      "stage:produksjon",
      "kanal:DOOH",
      "format:16:9",
      "mal:kjennskap",
      "strenghet:middels",
      "brandLock:ja",
      "textLock:ja",
      "productLock:ja",
      "kategori:produkt-still"
    ],
    "title": "Produktreklame still 07 (DOOH 16:9)",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "kjennskap. Kanal DOOH. Format 16:9."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "SMB-eier med tidsmangel. Innsikt: Målgruppen velger løsningen som er enklest å forstå på få sekunder."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Prøv gratis."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt i aktiv bruk med tydelig håndgrep og stabil geometri"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Realistisk kontor eller hjemmemiljø med kontrollert bakgrunn"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "50mm, halvnært utsnitt, statisk kamera"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Key 45 grader, myk fill, rim for separasjon"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Budskap i øvre tredel, produkt sentralt, CTA i lavere høyre hjørne"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-b-anti-ai-look"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever image med produksjonsklar struktur for DOOH i 16:9."
      }
    ],
    "domain": "produkt",
    "useCase": "Reklamefaglig mal for produktreklame still med fokus på kjennskap og DOOH.",
    "metadata": {
      "taxonomy": {
        "mal": "kjennskap",
        "kanal": "DOOH",
        "stage": "produksjon",
        "domain": "reklame",
        "format": "16:9",
        "textLock": true,
        "brandLock": true,
        "strenghet": "middels",
        "productLock": true
      },
      "recommendedNegativePreset": "preset-b-anti-ai-look"
    },
    "outputType": "image",
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "produkt-still-08",
    "tags": [
      "domain:reklame",
      "stage:produksjon",
      "kanal:SoMe",
      "format:banner",
      "mal:konvertering",
      "strenghet:høy",
      "brandLock:ja",
      "textLock:ja",
      "productLock:ja",
      "kategori:produkt-still"
    ],
    "title": "Produktreklame still 08 (SoMe banner)",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "konvertering. Kanal SoMe. Format banner."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "Markedsleder med høyt tempo. Innsikt: Tydelig produktnytte slår visuell støy i feed."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Se løsningen."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt i realistisk miljø med synlig funksjon i kontekst"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Nøytral studio-setting med lesbar materialitet"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "35mm, medium shot, rolig dolly-inn"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Hardt key med kontrollert fill og nøytral fargetemperatur"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Produkt i forgrunn, støttebudskap i mellomgrunn, logo i bakgrunn"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-b-anti-ai-look"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever image med produksjonsklar struktur for SoMe i banner."
      }
    ],
    "domain": "produkt",
    "useCase": "Reklamefaglig mal for produktreklame still med fokus på konvertering og SoMe.",
    "metadata": {
      "taxonomy": {
        "mal": "konvertering",
        "kanal": "SoMe",
        "stage": "produksjon",
        "domain": "reklame",
        "format": "banner",
        "textLock": true,
        "brandLock": true,
        "strenghet": "høy",
        "productLock": true
      },
      "recommendedNegativePreset": "preset-b-anti-ai-look"
    },
    "outputType": "image",
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "produkt-still-09",
    "tags": [
      "domain:reklame",
      "stage:produksjon",
      "kanal:web",
      "format:1:1",
      "mal:kjennskap",
      "strenghet:middels",
      "brandLock:ja",
      "textLock:ja",
      "productLock:ja",
      "kategori:produkt-still"
    ],
    "title": "Produktreklame still 09 (web 1:1)",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "kjennskap. Kanal web. Format 1:1."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "Innholdsprodusent med publiseringspress. Innsikt: Merkevaren må kjennes igjen før CTA har effekt."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Kontakt oss."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt og avsender i samme bilde for klar avsenderidentitet"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Bymiljø med moderat aktivitet uten å stjele fokus"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "85mm, nærbilde, låst horisont"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Naturlig vinduslys med subtil fill og presis skyggekontroll"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Tydelig visuell hierarki: overskrift, produkt, CTA"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-b-anti-ai-look"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever image med produksjonsklar struktur for web i 1:1."
      }
    ],
    "domain": "produkt",
    "useCase": "Reklamefaglig mal for produktreklame still med fokus på kjennskap og web.",
    "metadata": {
      "taxonomy": {
        "mal": "kjennskap",
        "kanal": "web",
        "stage": "produksjon",
        "domain": "reklame",
        "format": "1:1",
        "textLock": true,
        "brandLock": true,
        "strenghet": "middels",
        "productLock": true
      },
      "recommendedNegativePreset": "preset-b-anti-ai-look"
    },
    "outputType": "image",
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "produkt-still-10",
    "tags": [
      "domain:reklame",
      "stage:produksjon",
      "kanal:print",
      "format:4:5",
      "mal:konvertering",
      "strenghet:høy",
      "brandLock:ja",
      "textLock:ja",
      "productLock:ja",
      "kategori:produkt-still"
    ],
    "title": "Produktreklame still 10 (print 4:5)",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "konvertering. Kanal print. Format 4:5."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "SMB-eier med tidsmangel. Innsikt: Målgruppen velger løsningen som er enklest å forstå på få sekunder."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Lær mer."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt i aktiv bruk med tydelig håndgrep og stabil geometri"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Realistisk kontor eller hjemmemiljø med kontrollert bakgrunn"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "50mm, halvnært utsnitt, statisk kamera"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Key 45 grader, myk fill, rim for separasjon"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Budskap i øvre tredel, produkt sentralt, CTA i lavere høyre hjørne"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-b-anti-ai-look"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever image med produksjonsklar struktur for print i 4:5."
      }
    ],
    "domain": "produkt",
    "useCase": "Reklamefaglig mal for produktreklame still med fokus på konvertering og print.",
    "metadata": {
      "taxonomy": {
        "mal": "konvertering",
        "kanal": "print",
        "stage": "produksjon",
        "domain": "reklame",
        "format": "4:5",
        "textLock": true,
        "brandLock": true,
        "strenghet": "høy",
        "productLock": true
      },
      "recommendedNegativePreset": "preset-b-anti-ai-look"
    },
    "outputType": "image",
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "produkt-still-11",
    "tags": [
      "domain:reklame",
      "stage:produksjon",
      "kanal:DOOH",
      "format:16:9",
      "mal:kjennskap",
      "strenghet:middels",
      "brandLock:ja",
      "textLock:ja",
      "productLock:ja",
      "kategori:produkt-still"
    ],
    "title": "Produktreklame still 11 (DOOH 16:9)",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "kjennskap. Kanal DOOH. Format 16:9."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "Markedsleder med høyt tempo. Innsikt: Tydelig produktnytte slår visuell støy i feed."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Bestill demo."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt i realistisk miljø med synlig funksjon i kontekst"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Nøytral studio-setting med lesbar materialitet"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "35mm, medium shot, rolig dolly-inn"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Hardt key med kontrollert fill og nøytral fargetemperatur"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Produkt i forgrunn, støttebudskap i mellomgrunn, logo i bakgrunn"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-b-anti-ai-look"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever image med produksjonsklar struktur for DOOH i 16:9."
      }
    ],
    "domain": "produkt",
    "useCase": "Reklamefaglig mal for produktreklame still med fokus på kjennskap og DOOH.",
    "metadata": {
      "taxonomy": {
        "mal": "kjennskap",
        "kanal": "DOOH",
        "stage": "produksjon",
        "domain": "reklame",
        "format": "16:9",
        "textLock": true,
        "brandLock": true,
        "strenghet": "middels",
        "productLock": true
      },
      "recommendedNegativePreset": "preset-b-anti-ai-look"
    },
    "outputType": "image",
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "produkt-still-12",
    "tags": [
      "domain:reklame",
      "stage:produksjon",
      "kanal:SoMe",
      "format:banner",
      "mal:konvertering",
      "strenghet:høy",
      "brandLock:ja",
      "textLock:ja",
      "productLock:ja",
      "kategori:produkt-still"
    ],
    "title": "Produktreklame still 12 (SoMe banner)",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "konvertering. Kanal SoMe. Format banner."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "Innholdsprodusent med publiseringspress. Innsikt: Merkevaren må kjennes igjen før CTA har effekt."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Prøv gratis."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt og avsender i samme bilde for klar avsenderidentitet"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Bymiljø med moderat aktivitet uten å stjele fokus"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "85mm, nærbilde, låst horisont"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Naturlig vinduslys med subtil fill og presis skyggekontroll"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Tydelig visuell hierarki: overskrift, produkt, CTA"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-b-anti-ai-look"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever image med produksjonsklar struktur for SoMe i banner."
      }
    ],
    "domain": "produkt",
    "useCase": "Reklamefaglig mal for produktreklame still med fokus på konvertering og SoMe.",
    "metadata": {
      "taxonomy": {
        "mal": "konvertering",
        "kanal": "SoMe",
        "stage": "produksjon",
        "domain": "reklame",
        "format": "banner",
        "textLock": true,
        "brandLock": true,
        "strenghet": "høy",
        "productLock": true
      },
      "recommendedNegativePreset": "preset-b-anti-ai-look"
    },
    "outputType": "image",
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "produkt-still-13",
    "tags": [
      "domain:reklame",
      "stage:produksjon",
      "kanal:web",
      "format:1:1",
      "mal:kjennskap",
      "strenghet:middels",
      "brandLock:ja",
      "textLock:ja",
      "productLock:ja",
      "kategori:produkt-still"
    ],
    "title": "Produktreklame still 13 (web 1:1)",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "kjennskap. Kanal web. Format 1:1."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "SMB-eier med tidsmangel. Innsikt: Målgruppen velger løsningen som er enklest å forstå på få sekunder."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Se løsningen."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt i aktiv bruk med tydelig håndgrep og stabil geometri"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Realistisk kontor eller hjemmemiljø med kontrollert bakgrunn"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "50mm, halvnært utsnitt, statisk kamera"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Key 45 grader, myk fill, rim for separasjon"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Budskap i øvre tredel, produkt sentralt, CTA i lavere høyre hjørne"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-b-anti-ai-look"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever image med produksjonsklar struktur for web i 1:1."
      }
    ],
    "domain": "produkt",
    "useCase": "Reklamefaglig mal for produktreklame still med fokus på kjennskap og web.",
    "metadata": {
      "taxonomy": {
        "mal": "kjennskap",
        "kanal": "web",
        "stage": "produksjon",
        "domain": "reklame",
        "format": "1:1",
        "textLock": true,
        "brandLock": true,
        "strenghet": "middels",
        "productLock": true
      },
      "recommendedNegativePreset": "preset-b-anti-ai-look"
    },
    "outputType": "image",
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "produkt-still-14",
    "tags": [
      "domain:reklame",
      "stage:produksjon",
      "kanal:print",
      "format:4:5",
      "mal:konvertering",
      "strenghet:høy",
      "brandLock:ja",
      "textLock:ja",
      "productLock:ja",
      "kategori:produkt-still"
    ],
    "title": "Produktreklame still 14 (print 4:5)",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "konvertering. Kanal print. Format 4:5."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "Markedsleder med høyt tempo. Innsikt: Tydelig produktnytte slår visuell støy i feed."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Kontakt oss."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt i realistisk miljø med synlig funksjon i kontekst"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Nøytral studio-setting med lesbar materialitet"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "35mm, medium shot, rolig dolly-inn"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Hardt key med kontrollert fill og nøytral fargetemperatur"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Produkt i forgrunn, støttebudskap i mellomgrunn, logo i bakgrunn"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-b-anti-ai-look"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever image med produksjonsklar struktur for print i 4:5."
      }
    ],
    "domain": "produkt",
    "useCase": "Reklamefaglig mal for produktreklame still med fokus på konvertering og print.",
    "metadata": {
      "taxonomy": {
        "mal": "konvertering",
        "kanal": "print",
        "stage": "produksjon",
        "domain": "reklame",
        "format": "4:5",
        "textLock": true,
        "brandLock": true,
        "strenghet": "høy",
        "productLock": true
      },
      "recommendedNegativePreset": "preset-b-anti-ai-look"
    },
    "outputType": "image",
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "produkt-still-15",
    "tags": [
      "domain:reklame",
      "stage:produksjon",
      "kanal:DOOH",
      "format:16:9",
      "mal:kjennskap",
      "strenghet:middels",
      "brandLock:ja",
      "textLock:ja",
      "productLock:ja",
      "kategori:produkt-still"
    ],
    "title": "Produktreklame still 15 (DOOH 16:9)",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "kjennskap. Kanal DOOH. Format 16:9."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "Innholdsprodusent med publiseringspress. Innsikt: Merkevaren må kjennes igjen før CTA har effekt."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Lær mer."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt og avsender i samme bilde for klar avsenderidentitet"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Bymiljø med moderat aktivitet uten å stjele fokus"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "85mm, nærbilde, låst horisont"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Naturlig vinduslys med subtil fill og presis skyggekontroll"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Tydelig visuell hierarki: overskrift, produkt, CTA"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-b-anti-ai-look"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever image med produksjonsklar struktur for DOOH i 16:9."
      }
    ],
    "domain": "produkt",
    "useCase": "Reklamefaglig mal for produktreklame still med fokus på kjennskap og DOOH.",
    "metadata": {
      "taxonomy": {
        "mal": "kjennskap",
        "kanal": "DOOH",
        "stage": "produksjon",
        "domain": "reklame",
        "format": "16:9",
        "textLock": true,
        "brandLock": true,
        "strenghet": "middels",
        "productLock": true
      },
      "recommendedNegativePreset": "preset-b-anti-ai-look"
    },
    "outputType": "image",
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "produkt-still-16",
    "tags": [
      "domain:reklame",
      "stage:produksjon",
      "kanal:SoMe",
      "format:banner",
      "mal:konvertering",
      "strenghet:høy",
      "brandLock:ja",
      "textLock:ja",
      "productLock:ja",
      "kategori:produkt-still"
    ],
    "title": "Produktreklame still 16 (SoMe banner)",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "konvertering. Kanal SoMe. Format banner."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "SMB-eier med tidsmangel. Innsikt: Målgruppen velger løsningen som er enklest å forstå på få sekunder."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Bestill demo."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt i aktiv bruk med tydelig håndgrep og stabil geometri"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Realistisk kontor eller hjemmemiljø med kontrollert bakgrunn"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "50mm, halvnært utsnitt, statisk kamera"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Key 45 grader, myk fill, rim for separasjon"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Budskap i øvre tredel, produkt sentralt, CTA i lavere høyre hjørne"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-b-anti-ai-look"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever image med produksjonsklar struktur for SoMe i banner."
      }
    ],
    "domain": "produkt",
    "useCase": "Reklamefaglig mal for produktreklame still med fokus på konvertering og SoMe.",
    "metadata": {
      "taxonomy": {
        "mal": "konvertering",
        "kanal": "SoMe",
        "stage": "produksjon",
        "domain": "reklame",
        "format": "banner",
        "textLock": true,
        "brandLock": true,
        "strenghet": "høy",
        "productLock": true
      },
      "recommendedNegativePreset": "preset-b-anti-ai-look"
    },
    "outputType": "image",
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "produkt-still-17",
    "tags": [
      "domain:reklame",
      "stage:produksjon",
      "kanal:web",
      "format:1:1",
      "mal:kjennskap",
      "strenghet:middels",
      "brandLock:ja",
      "textLock:ja",
      "productLock:ja",
      "kategori:produkt-still"
    ],
    "title": "Produktreklame still 17 (web 1:1)",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "kjennskap. Kanal web. Format 1:1."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "Markedsleder med høyt tempo. Innsikt: Tydelig produktnytte slår visuell støy i feed."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Prøv gratis."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt i realistisk miljø med synlig funksjon i kontekst"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Nøytral studio-setting med lesbar materialitet"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "35mm, medium shot, rolig dolly-inn"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Hardt key med kontrollert fill og nøytral fargetemperatur"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Produkt i forgrunn, støttebudskap i mellomgrunn, logo i bakgrunn"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-b-anti-ai-look"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever image med produksjonsklar struktur for web i 1:1."
      }
    ],
    "domain": "produkt",
    "useCase": "Reklamefaglig mal for produktreklame still med fokus på kjennskap og web.",
    "metadata": {
      "taxonomy": {
        "mal": "kjennskap",
        "kanal": "web",
        "stage": "produksjon",
        "domain": "reklame",
        "format": "1:1",
        "textLock": true,
        "brandLock": true,
        "strenghet": "middels",
        "productLock": true
      },
      "recommendedNegativePreset": "preset-b-anti-ai-look"
    },
    "outputType": "image",
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "produkt-still-18",
    "tags": [
      "domain:reklame",
      "stage:produksjon",
      "kanal:print",
      "format:4:5",
      "mal:konvertering",
      "strenghet:høy",
      "brandLock:ja",
      "textLock:ja",
      "productLock:ja",
      "kategori:produkt-still"
    ],
    "title": "Produktreklame still 18 (print 4:5)",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "konvertering. Kanal print. Format 4:5."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "Innholdsprodusent med publiseringspress. Innsikt: Merkevaren må kjennes igjen før CTA har effekt."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Se løsningen."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt og avsender i samme bilde for klar avsenderidentitet"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Bymiljø med moderat aktivitet uten å stjele fokus"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "85mm, nærbilde, låst horisont"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Naturlig vinduslys med subtil fill og presis skyggekontroll"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Tydelig visuell hierarki: overskrift, produkt, CTA"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-b-anti-ai-look"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever image med produksjonsklar struktur for print i 4:5."
      }
    ],
    "domain": "produkt",
    "useCase": "Reklamefaglig mal for produktreklame still med fokus på konvertering og print.",
    "metadata": {
      "taxonomy": {
        "mal": "konvertering",
        "kanal": "print",
        "stage": "produksjon",
        "domain": "reklame",
        "format": "4:5",
        "textLock": true,
        "brandLock": true,
        "strenghet": "høy",
        "productLock": true
      },
      "recommendedNegativePreset": "preset-b-anti-ai-look"
    },
    "outputType": "image",
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "produkt-still-19",
    "tags": [
      "domain:reklame",
      "stage:produksjon",
      "kanal:DOOH",
      "format:16:9",
      "mal:kjennskap",
      "strenghet:middels",
      "brandLock:ja",
      "textLock:ja",
      "productLock:ja",
      "kategori:produkt-still"
    ],
    "title": "Produktreklame still 19 (DOOH 16:9)",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "kjennskap. Kanal DOOH. Format 16:9."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "SMB-eier med tidsmangel. Innsikt: Målgruppen velger løsningen som er enklest å forstå på få sekunder."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Kontakt oss."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt i aktiv bruk med tydelig håndgrep og stabil geometri"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Realistisk kontor eller hjemmemiljø med kontrollert bakgrunn"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "50mm, halvnært utsnitt, statisk kamera"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Key 45 grader, myk fill, rim for separasjon"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Budskap i øvre tredel, produkt sentralt, CTA i lavere høyre hjørne"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-b-anti-ai-look"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever image med produksjonsklar struktur for DOOH i 16:9."
      }
    ],
    "domain": "produkt",
    "useCase": "Reklamefaglig mal for produktreklame still med fokus på kjennskap og DOOH.",
    "metadata": {
      "taxonomy": {
        "mal": "kjennskap",
        "kanal": "DOOH",
        "stage": "produksjon",
        "domain": "reklame",
        "format": "16:9",
        "textLock": true,
        "brandLock": true,
        "strenghet": "middels",
        "productLock": true
      },
      "recommendedNegativePreset": "preset-b-anti-ai-look"
    },
    "outputType": "image",
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "produkt-still-20",
    "tags": [
      "domain:reklame",
      "stage:produksjon",
      "kanal:SoMe",
      "format:banner",
      "mal:konvertering",
      "strenghet:høy",
      "brandLock:ja",
      "textLock:ja",
      "productLock:ja",
      "kategori:produkt-still"
    ],
    "title": "Produktreklame still 20 (SoMe banner)",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "konvertering. Kanal SoMe. Format banner."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "Markedsleder med høyt tempo. Innsikt: Tydelig produktnytte slår visuell støy i feed."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Lær mer."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt i realistisk miljø med synlig funksjon i kontekst"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Nøytral studio-setting med lesbar materialitet"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "35mm, medium shot, rolig dolly-inn"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Hardt key med kontrollert fill og nøytral fargetemperatur"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Produkt i forgrunn, støttebudskap i mellomgrunn, logo i bakgrunn"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-b-anti-ai-look"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever image med produksjonsklar struktur for SoMe i banner."
      }
    ],
    "domain": "produkt",
    "useCase": "Reklamefaglig mal for produktreklame still med fokus på konvertering og SoMe.",
    "metadata": {
      "taxonomy": {
        "mal": "konvertering",
        "kanal": "SoMe",
        "stage": "produksjon",
        "domain": "reklame",
        "format": "banner",
        "textLock": true,
        "brandLock": true,
        "strenghet": "høy",
        "productLock": true
      },
      "recommendedNegativePreset": "preset-b-anti-ai-look"
    },
    "outputType": "image",
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "produkt-video-01",
    "tags": [
      "domain:reklame",
      "stage:produksjon",
      "kanal:SoMe",
      "format:9:16",
      "mal:engasjement",
      "strenghet:høy",
      "brandLock:ja",
      "textLock:ja",
      "productLock:ja",
      "kategori:produkt-video"
    ],
    "title": "Produktreklame video 01 (SoMe 9:16)",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "engasjement. Kanal SoMe. Format 9:16."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "SMB-eier med tidsmangel. Innsikt: Målgruppen velger løsningen som er enklest å forstå på få sekunder."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Bestill demo."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt i aktiv bruk med tydelig håndgrep og stabil geometri"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Realistisk kontor eller hjemmemiljø med kontrollert bakgrunn"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "50mm, halvnært utsnitt, statisk kamera"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Key 45 grader, myk fill, rim for separasjon"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Budskap i øvre tredel, produkt sentralt, CTA i lavere høyre hjørne"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-c-video-kontinuitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever video med produksjonsklar struktur for SoMe i 9:16."
      }
    ],
    "domain": "film-vfx",
    "useCase": "Reklamefaglig mal for produktreklame video med fokus på engasjement og SoMe.",
    "metadata": {
      "taxonomy": {
        "mal": "engasjement",
        "kanal": "SoMe",
        "stage": "produksjon",
        "domain": "reklame",
        "format": "9:16",
        "textLock": true,
        "brandLock": true,
        "strenghet": "høy",
        "productLock": true
      },
      "recommendedNegativePreset": "preset-c-video-kontinuitet"
    },
    "outputType": "video",
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "produkt-video-02",
    "tags": [
      "domain:reklame",
      "stage:produksjon",
      "kanal:TV",
      "format:16:9",
      "mal:konvertering",
      "strenghet:høy",
      "brandLock:ja",
      "textLock:ja",
      "productLock:ja",
      "kategori:produkt-video"
    ],
    "title": "Produktreklame video 02 (TV 16:9)",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "konvertering. Kanal TV. Format 16:9."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "Markedsleder med høyt tempo. Innsikt: Tydelig produktnytte slår visuell støy i feed."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Prøv gratis."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt i realistisk miljø med synlig funksjon i kontekst"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Nøytral studio-setting med lesbar materialitet"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "35mm, medium shot, rolig dolly-inn"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Hardt key med kontrollert fill og nøytral fargetemperatur"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Produkt i forgrunn, støttebudskap i mellomgrunn, logo i bakgrunn"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-c-video-kontinuitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever video med produksjonsklar struktur for TV i 16:9."
      }
    ],
    "domain": "film-vfx",
    "useCase": "Reklamefaglig mal for produktreklame video med fokus på konvertering og TV.",
    "metadata": {
      "taxonomy": {
        "mal": "konvertering",
        "kanal": "TV",
        "stage": "produksjon",
        "domain": "reklame",
        "format": "16:9",
        "textLock": true,
        "brandLock": true,
        "strenghet": "høy",
        "productLock": true
      },
      "recommendedNegativePreset": "preset-c-video-kontinuitet"
    },
    "outputType": "video",
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "produkt-video-03",
    "tags": [
      "domain:reklame",
      "stage:produksjon",
      "kanal:web",
      "format:1:1",
      "mal:engasjement",
      "strenghet:høy",
      "brandLock:ja",
      "textLock:ja",
      "productLock:ja",
      "kategori:produkt-video"
    ],
    "title": "Produktreklame video 03 (web 1:1)",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "engasjement. Kanal web. Format 1:1."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "Innholdsprodusent med publiseringspress. Innsikt: Merkevaren må kjennes igjen før CTA har effekt."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Se løsningen."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt og avsender i samme bilde for klar avsenderidentitet"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Bymiljø med moderat aktivitet uten å stjele fokus"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "85mm, nærbilde, låst horisont"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Naturlig vinduslys med subtil fill og presis skyggekontroll"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Tydelig visuell hierarki: overskrift, produkt, CTA"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-c-video-kontinuitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever video med produksjonsklar struktur for web i 1:1."
      }
    ],
    "domain": "film-vfx",
    "useCase": "Reklamefaglig mal for produktreklame video med fokus på engasjement og web.",
    "metadata": {
      "taxonomy": {
        "mal": "engasjement",
        "kanal": "web",
        "stage": "produksjon",
        "domain": "reklame",
        "format": "1:1",
        "textLock": true,
        "brandLock": true,
        "strenghet": "høy",
        "productLock": true
      },
      "recommendedNegativePreset": "preset-c-video-kontinuitet"
    },
    "outputType": "video",
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "produkt-video-04",
    "tags": [
      "domain:reklame",
      "stage:produksjon",
      "kanal:SoMe",
      "format:9:16",
      "mal:konvertering",
      "strenghet:høy",
      "brandLock:ja",
      "textLock:ja",
      "productLock:ja",
      "kategori:produkt-video"
    ],
    "title": "Produktreklame video 04 (SoMe 9:16)",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "konvertering. Kanal SoMe. Format 9:16."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "SMB-eier med tidsmangel. Innsikt: Målgruppen velger løsningen som er enklest å forstå på få sekunder."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Kontakt oss."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt i aktiv bruk med tydelig håndgrep og stabil geometri"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Realistisk kontor eller hjemmemiljø med kontrollert bakgrunn"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "50mm, halvnært utsnitt, statisk kamera"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Key 45 grader, myk fill, rim for separasjon"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Budskap i øvre tredel, produkt sentralt, CTA i lavere høyre hjørne"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-c-video-kontinuitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever video med produksjonsklar struktur for SoMe i 9:16."
      }
    ],
    "domain": "film-vfx",
    "useCase": "Reklamefaglig mal for produktreklame video med fokus på konvertering og SoMe.",
    "metadata": {
      "taxonomy": {
        "mal": "konvertering",
        "kanal": "SoMe",
        "stage": "produksjon",
        "domain": "reklame",
        "format": "9:16",
        "textLock": true,
        "brandLock": true,
        "strenghet": "høy",
        "productLock": true
      },
      "recommendedNegativePreset": "preset-c-video-kontinuitet"
    },
    "outputType": "video",
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "produkt-video-05",
    "tags": [
      "domain:reklame",
      "stage:produksjon",
      "kanal:TV",
      "format:16:9",
      "mal:engasjement",
      "strenghet:høy",
      "brandLock:ja",
      "textLock:ja",
      "productLock:ja",
      "kategori:produkt-video"
    ],
    "title": "Produktreklame video 05 (TV 16:9)",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "engasjement. Kanal TV. Format 16:9."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "Markedsleder med høyt tempo. Innsikt: Tydelig produktnytte slår visuell støy i feed."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Lær mer."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt i realistisk miljø med synlig funksjon i kontekst"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Nøytral studio-setting med lesbar materialitet"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "35mm, medium shot, rolig dolly-inn"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Hardt key med kontrollert fill og nøytral fargetemperatur"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Produkt i forgrunn, støttebudskap i mellomgrunn, logo i bakgrunn"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-c-video-kontinuitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever video med produksjonsklar struktur for TV i 16:9."
      }
    ],
    "domain": "film-vfx",
    "useCase": "Reklamefaglig mal for produktreklame video med fokus på engasjement og TV.",
    "metadata": {
      "taxonomy": {
        "mal": "engasjement",
        "kanal": "TV",
        "stage": "produksjon",
        "domain": "reklame",
        "format": "16:9",
        "textLock": true,
        "brandLock": true,
        "strenghet": "høy",
        "productLock": true
      },
      "recommendedNegativePreset": "preset-c-video-kontinuitet"
    },
    "outputType": "video",
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "produkt-video-06",
    "tags": [
      "domain:reklame",
      "stage:produksjon",
      "kanal:web",
      "format:1:1",
      "mal:konvertering",
      "strenghet:høy",
      "brandLock:ja",
      "textLock:ja",
      "productLock:ja",
      "kategori:produkt-video"
    ],
    "title": "Produktreklame video 06 (web 1:1)",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "konvertering. Kanal web. Format 1:1."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "Innholdsprodusent med publiseringspress. Innsikt: Merkevaren må kjennes igjen før CTA har effekt."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Bestill demo."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt og avsender i samme bilde for klar avsenderidentitet"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Bymiljø med moderat aktivitet uten å stjele fokus"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "85mm, nærbilde, låst horisont"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Naturlig vinduslys med subtil fill og presis skyggekontroll"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Tydelig visuell hierarki: overskrift, produkt, CTA"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-c-video-kontinuitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever video med produksjonsklar struktur for web i 1:1."
      }
    ],
    "domain": "film-vfx",
    "useCase": "Reklamefaglig mal for produktreklame video med fokus på konvertering og web.",
    "metadata": {
      "taxonomy": {
        "mal": "konvertering",
        "kanal": "web",
        "stage": "produksjon",
        "domain": "reklame",
        "format": "1:1",
        "textLock": true,
        "brandLock": true,
        "strenghet": "høy",
        "productLock": true
      },
      "recommendedNegativePreset": "preset-c-video-kontinuitet"
    },
    "outputType": "video",
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "produkt-video-07",
    "tags": [
      "domain:reklame",
      "stage:produksjon",
      "kanal:SoMe",
      "format:9:16",
      "mal:engasjement",
      "strenghet:høy",
      "brandLock:ja",
      "textLock:ja",
      "productLock:ja",
      "kategori:produkt-video"
    ],
    "title": "Produktreklame video 07 (SoMe 9:16)",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "engasjement. Kanal SoMe. Format 9:16."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "SMB-eier med tidsmangel. Innsikt: Målgruppen velger løsningen som er enklest å forstå på få sekunder."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Prøv gratis."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt i aktiv bruk med tydelig håndgrep og stabil geometri"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Realistisk kontor eller hjemmemiljø med kontrollert bakgrunn"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "50mm, halvnært utsnitt, statisk kamera"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Key 45 grader, myk fill, rim for separasjon"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Budskap i øvre tredel, produkt sentralt, CTA i lavere høyre hjørne"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-c-video-kontinuitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever video med produksjonsklar struktur for SoMe i 9:16."
      }
    ],
    "domain": "film-vfx",
    "useCase": "Reklamefaglig mal for produktreklame video med fokus på engasjement og SoMe.",
    "metadata": {
      "taxonomy": {
        "mal": "engasjement",
        "kanal": "SoMe",
        "stage": "produksjon",
        "domain": "reklame",
        "format": "9:16",
        "textLock": true,
        "brandLock": true,
        "strenghet": "høy",
        "productLock": true
      },
      "recommendedNegativePreset": "preset-c-video-kontinuitet"
    },
    "outputType": "video",
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "produkt-video-08",
    "tags": [
      "domain:reklame",
      "stage:produksjon",
      "kanal:TV",
      "format:16:9",
      "mal:konvertering",
      "strenghet:høy",
      "brandLock:ja",
      "textLock:ja",
      "productLock:ja",
      "kategori:produkt-video"
    ],
    "title": "Produktreklame video 08 (TV 16:9)",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "konvertering. Kanal TV. Format 16:9."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "Markedsleder med høyt tempo. Innsikt: Tydelig produktnytte slår visuell støy i feed."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Se løsningen."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt i realistisk miljø med synlig funksjon i kontekst"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Nøytral studio-setting med lesbar materialitet"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "35mm, medium shot, rolig dolly-inn"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Hardt key med kontrollert fill og nøytral fargetemperatur"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Produkt i forgrunn, støttebudskap i mellomgrunn, logo i bakgrunn"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-c-video-kontinuitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever video med produksjonsklar struktur for TV i 16:9."
      }
    ],
    "domain": "film-vfx",
    "useCase": "Reklamefaglig mal for produktreklame video med fokus på konvertering og TV.",
    "metadata": {
      "taxonomy": {
        "mal": "konvertering",
        "kanal": "TV",
        "stage": "produksjon",
        "domain": "reklame",
        "format": "16:9",
        "textLock": true,
        "brandLock": true,
        "strenghet": "høy",
        "productLock": true
      },
      "recommendedNegativePreset": "preset-c-video-kontinuitet"
    },
    "outputType": "video",
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "produkt-video-09",
    "tags": [
      "domain:reklame",
      "stage:produksjon",
      "kanal:web",
      "format:1:1",
      "mal:engasjement",
      "strenghet:høy",
      "brandLock:ja",
      "textLock:ja",
      "productLock:ja",
      "kategori:produkt-video"
    ],
    "title": "Produktreklame video 09 (web 1:1)",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "engasjement. Kanal web. Format 1:1."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "Innholdsprodusent med publiseringspress. Innsikt: Merkevaren må kjennes igjen før CTA har effekt."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Kontakt oss."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt og avsender i samme bilde for klar avsenderidentitet"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Bymiljø med moderat aktivitet uten å stjele fokus"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "85mm, nærbilde, låst horisont"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Naturlig vinduslys med subtil fill og presis skyggekontroll"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Tydelig visuell hierarki: overskrift, produkt, CTA"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-c-video-kontinuitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever video med produksjonsklar struktur for web i 1:1."
      }
    ],
    "domain": "film-vfx",
    "useCase": "Reklamefaglig mal for produktreklame video med fokus på engasjement og web.",
    "metadata": {
      "taxonomy": {
        "mal": "engasjement",
        "kanal": "web",
        "stage": "produksjon",
        "domain": "reklame",
        "format": "1:1",
        "textLock": true,
        "brandLock": true,
        "strenghet": "høy",
        "productLock": true
      },
      "recommendedNegativePreset": "preset-c-video-kontinuitet"
    },
    "outputType": "video",
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "produkt-video-10",
    "tags": [
      "domain:reklame",
      "stage:produksjon",
      "kanal:SoMe",
      "format:9:16",
      "mal:konvertering",
      "strenghet:høy",
      "brandLock:ja",
      "textLock:ja",
      "productLock:ja",
      "kategori:produkt-video"
    ],
    "title": "Produktreklame video 10 (SoMe 9:16)",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "konvertering. Kanal SoMe. Format 9:16."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "SMB-eier med tidsmangel. Innsikt: Målgruppen velger løsningen som er enklest å forstå på få sekunder."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Lær mer."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt i aktiv bruk med tydelig håndgrep og stabil geometri"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Realistisk kontor eller hjemmemiljø med kontrollert bakgrunn"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "50mm, halvnært utsnitt, statisk kamera"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Key 45 grader, myk fill, rim for separasjon"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Budskap i øvre tredel, produkt sentralt, CTA i lavere høyre hjørne"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-c-video-kontinuitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever video med produksjonsklar struktur for SoMe i 9:16."
      }
    ],
    "domain": "film-vfx",
    "useCase": "Reklamefaglig mal for produktreklame video med fokus på konvertering og SoMe.",
    "metadata": {
      "taxonomy": {
        "mal": "konvertering",
        "kanal": "SoMe",
        "stage": "produksjon",
        "domain": "reklame",
        "format": "9:16",
        "textLock": true,
        "brandLock": true,
        "strenghet": "høy",
        "productLock": true
      },
      "recommendedNegativePreset": "preset-c-video-kontinuitet"
    },
    "outputType": "video",
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "produkt-video-11",
    "tags": [
      "domain:reklame",
      "stage:produksjon",
      "kanal:TV",
      "format:16:9",
      "mal:engasjement",
      "strenghet:høy",
      "brandLock:ja",
      "textLock:ja",
      "productLock:ja",
      "kategori:produkt-video"
    ],
    "title": "Produktreklame video 11 (TV 16:9)",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "engasjement. Kanal TV. Format 16:9."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "Markedsleder med høyt tempo. Innsikt: Tydelig produktnytte slår visuell støy i feed."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Bestill demo."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt i realistisk miljø med synlig funksjon i kontekst"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Nøytral studio-setting med lesbar materialitet"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "35mm, medium shot, rolig dolly-inn"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Hardt key med kontrollert fill og nøytral fargetemperatur"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Produkt i forgrunn, støttebudskap i mellomgrunn, logo i bakgrunn"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-c-video-kontinuitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever video med produksjonsklar struktur for TV i 16:9."
      }
    ],
    "domain": "film-vfx",
    "useCase": "Reklamefaglig mal for produktreklame video med fokus på engasjement og TV.",
    "metadata": {
      "taxonomy": {
        "mal": "engasjement",
        "kanal": "TV",
        "stage": "produksjon",
        "domain": "reklame",
        "format": "16:9",
        "textLock": true,
        "brandLock": true,
        "strenghet": "høy",
        "productLock": true
      },
      "recommendedNegativePreset": "preset-c-video-kontinuitet"
    },
    "outputType": "video",
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "produkt-video-12",
    "tags": [
      "domain:reklame",
      "stage:produksjon",
      "kanal:web",
      "format:1:1",
      "mal:konvertering",
      "strenghet:høy",
      "brandLock:ja",
      "textLock:ja",
      "productLock:ja",
      "kategori:produkt-video"
    ],
    "title": "Produktreklame video 12 (web 1:1)",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "konvertering. Kanal web. Format 1:1."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "Innholdsprodusent med publiseringspress. Innsikt: Merkevaren må kjennes igjen før CTA har effekt."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Prøv gratis."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt og avsender i samme bilde for klar avsenderidentitet"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Bymiljø med moderat aktivitet uten å stjele fokus"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "85mm, nærbilde, låst horisont"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Naturlig vinduslys med subtil fill og presis skyggekontroll"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Tydelig visuell hierarki: overskrift, produkt, CTA"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-c-video-kontinuitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever video med produksjonsklar struktur for web i 1:1."
      }
    ],
    "domain": "film-vfx",
    "useCase": "Reklamefaglig mal for produktreklame video med fokus på konvertering og web.",
    "metadata": {
      "taxonomy": {
        "mal": "konvertering",
        "kanal": "web",
        "stage": "produksjon",
        "domain": "reklame",
        "format": "1:1",
        "textLock": true,
        "brandLock": true,
        "strenghet": "høy",
        "productLock": true
      },
      "recommendedNegativePreset": "preset-c-video-kontinuitet"
    },
    "outputType": "video",
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "produkt-video-13",
    "tags": [
      "domain:reklame",
      "stage:produksjon",
      "kanal:SoMe",
      "format:9:16",
      "mal:engasjement",
      "strenghet:høy",
      "brandLock:ja",
      "textLock:ja",
      "productLock:ja",
      "kategori:produkt-video"
    ],
    "title": "Produktreklame video 13 (SoMe 9:16)",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "engasjement. Kanal SoMe. Format 9:16."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "SMB-eier med tidsmangel. Innsikt: Målgruppen velger løsningen som er enklest å forstå på få sekunder."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Se løsningen."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt i aktiv bruk med tydelig håndgrep og stabil geometri"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Realistisk kontor eller hjemmemiljø med kontrollert bakgrunn"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "50mm, halvnært utsnitt, statisk kamera"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Key 45 grader, myk fill, rim for separasjon"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Budskap i øvre tredel, produkt sentralt, CTA i lavere høyre hjørne"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-c-video-kontinuitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever video med produksjonsklar struktur for SoMe i 9:16."
      }
    ],
    "domain": "film-vfx",
    "useCase": "Reklamefaglig mal for produktreklame video med fokus på engasjement og SoMe.",
    "metadata": {
      "taxonomy": {
        "mal": "engasjement",
        "kanal": "SoMe",
        "stage": "produksjon",
        "domain": "reklame",
        "format": "9:16",
        "textLock": true,
        "brandLock": true,
        "strenghet": "høy",
        "productLock": true
      },
      "recommendedNegativePreset": "preset-c-video-kontinuitet"
    },
    "outputType": "video",
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "produkt-video-14",
    "tags": [
      "domain:reklame",
      "stage:produksjon",
      "kanal:TV",
      "format:16:9",
      "mal:konvertering",
      "strenghet:høy",
      "brandLock:ja",
      "textLock:ja",
      "productLock:ja",
      "kategori:produkt-video"
    ],
    "title": "Produktreklame video 14 (TV 16:9)",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "konvertering. Kanal TV. Format 16:9."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "Markedsleder med høyt tempo. Innsikt: Tydelig produktnytte slår visuell støy i feed."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Kontakt oss."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt i realistisk miljø med synlig funksjon i kontekst"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Nøytral studio-setting med lesbar materialitet"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "35mm, medium shot, rolig dolly-inn"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Hardt key med kontrollert fill og nøytral fargetemperatur"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Produkt i forgrunn, støttebudskap i mellomgrunn, logo i bakgrunn"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-c-video-kontinuitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever video med produksjonsklar struktur for TV i 16:9."
      }
    ],
    "domain": "film-vfx",
    "useCase": "Reklamefaglig mal for produktreklame video med fokus på konvertering og TV.",
    "metadata": {
      "taxonomy": {
        "mal": "konvertering",
        "kanal": "TV",
        "stage": "produksjon",
        "domain": "reklame",
        "format": "16:9",
        "textLock": true,
        "brandLock": true,
        "strenghet": "høy",
        "productLock": true
      },
      "recommendedNegativePreset": "preset-c-video-kontinuitet"
    },
    "outputType": "video",
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "produkt-video-15",
    "tags": [
      "domain:reklame",
      "stage:produksjon",
      "kanal:web",
      "format:1:1",
      "mal:engasjement",
      "strenghet:høy",
      "brandLock:ja",
      "textLock:ja",
      "productLock:ja",
      "kategori:produkt-video"
    ],
    "title": "Produktreklame video 15 (web 1:1)",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "engasjement. Kanal web. Format 1:1."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "Innholdsprodusent med publiseringspress. Innsikt: Merkevaren må kjennes igjen før CTA har effekt."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Lær mer."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt og avsender i samme bilde for klar avsenderidentitet"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Bymiljø med moderat aktivitet uten å stjele fokus"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "85mm, nærbilde, låst horisont"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Naturlig vinduslys med subtil fill og presis skyggekontroll"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Tydelig visuell hierarki: overskrift, produkt, CTA"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-c-video-kontinuitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever video med produksjonsklar struktur for web i 1:1."
      }
    ],
    "domain": "film-vfx",
    "useCase": "Reklamefaglig mal for produktreklame video med fokus på engasjement og web.",
    "metadata": {
      "taxonomy": {
        "mal": "engasjement",
        "kanal": "web",
        "stage": "produksjon",
        "domain": "reklame",
        "format": "1:1",
        "textLock": true,
        "brandLock": true,
        "strenghet": "høy",
        "productLock": true
      },
      "recommendedNegativePreset": "preset-c-video-kontinuitet"
    },
    "outputType": "video",
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "produkt-video-16",
    "tags": [
      "domain:reklame",
      "stage:produksjon",
      "kanal:SoMe",
      "format:9:16",
      "mal:konvertering",
      "strenghet:høy",
      "brandLock:ja",
      "textLock:ja",
      "productLock:ja",
      "kategori:produkt-video"
    ],
    "title": "Produktreklame video 16 (SoMe 9:16)",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "konvertering. Kanal SoMe. Format 9:16."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "SMB-eier med tidsmangel. Innsikt: Målgruppen velger løsningen som er enklest å forstå på få sekunder."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Bestill demo."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt i aktiv bruk med tydelig håndgrep og stabil geometri"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Realistisk kontor eller hjemmemiljø med kontrollert bakgrunn"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "50mm, halvnært utsnitt, statisk kamera"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Key 45 grader, myk fill, rim for separasjon"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Budskap i øvre tredel, produkt sentralt, CTA i lavere høyre hjørne"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-c-video-kontinuitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever video med produksjonsklar struktur for SoMe i 9:16."
      }
    ],
    "domain": "film-vfx",
    "useCase": "Reklamefaglig mal for produktreklame video med fokus på konvertering og SoMe.",
    "metadata": {
      "taxonomy": {
        "mal": "konvertering",
        "kanal": "SoMe",
        "stage": "produksjon",
        "domain": "reklame",
        "format": "9:16",
        "textLock": true,
        "brandLock": true,
        "strenghet": "høy",
        "productLock": true
      },
      "recommendedNegativePreset": "preset-c-video-kontinuitet"
    },
    "outputType": "video",
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "produkt-video-17",
    "tags": [
      "domain:reklame",
      "stage:produksjon",
      "kanal:TV",
      "format:16:9",
      "mal:engasjement",
      "strenghet:høy",
      "brandLock:ja",
      "textLock:ja",
      "productLock:ja",
      "kategori:produkt-video"
    ],
    "title": "Produktreklame video 17 (TV 16:9)",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "engasjement. Kanal TV. Format 16:9."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "Markedsleder med høyt tempo. Innsikt: Tydelig produktnytte slår visuell støy i feed."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Prøv gratis."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt i realistisk miljø med synlig funksjon i kontekst"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Nøytral studio-setting med lesbar materialitet"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "35mm, medium shot, rolig dolly-inn"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Hardt key med kontrollert fill og nøytral fargetemperatur"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Produkt i forgrunn, støttebudskap i mellomgrunn, logo i bakgrunn"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-c-video-kontinuitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever video med produksjonsklar struktur for TV i 16:9."
      }
    ],
    "domain": "film-vfx",
    "useCase": "Reklamefaglig mal for produktreklame video med fokus på engasjement og TV.",
    "metadata": {
      "taxonomy": {
        "mal": "engasjement",
        "kanal": "TV",
        "stage": "produksjon",
        "domain": "reklame",
        "format": "16:9",
        "textLock": true,
        "brandLock": true,
        "strenghet": "høy",
        "productLock": true
      },
      "recommendedNegativePreset": "preset-c-video-kontinuitet"
    },
    "outputType": "video",
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "produkt-video-18",
    "tags": [
      "domain:reklame",
      "stage:produksjon",
      "kanal:web",
      "format:1:1",
      "mal:konvertering",
      "strenghet:høy",
      "brandLock:ja",
      "textLock:ja",
      "productLock:ja",
      "kategori:produkt-video"
    ],
    "title": "Produktreklame video 18 (web 1:1)",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "konvertering. Kanal web. Format 1:1."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "Innholdsprodusent med publiseringspress. Innsikt: Merkevaren må kjennes igjen før CTA har effekt."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Se løsningen."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt og avsender i samme bilde for klar avsenderidentitet"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Bymiljø med moderat aktivitet uten å stjele fokus"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "85mm, nærbilde, låst horisont"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Naturlig vinduslys med subtil fill og presis skyggekontroll"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Tydelig visuell hierarki: overskrift, produkt, CTA"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-c-video-kontinuitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever video med produksjonsklar struktur for web i 1:1."
      }
    ],
    "domain": "film-vfx",
    "useCase": "Reklamefaglig mal for produktreklame video med fokus på konvertering og web.",
    "metadata": {
      "taxonomy": {
        "mal": "konvertering",
        "kanal": "web",
        "stage": "produksjon",
        "domain": "reklame",
        "format": "1:1",
        "textLock": true,
        "brandLock": true,
        "strenghet": "høy",
        "productLock": true
      },
      "recommendedNegativePreset": "preset-c-video-kontinuitet"
    },
    "outputType": "video",
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "produkt-video-19",
    "tags": [
      "domain:reklame",
      "stage:produksjon",
      "kanal:SoMe",
      "format:9:16",
      "mal:engasjement",
      "strenghet:høy",
      "brandLock:ja",
      "textLock:ja",
      "productLock:ja",
      "kategori:produkt-video"
    ],
    "title": "Produktreklame video 19 (SoMe 9:16)",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "engasjement. Kanal SoMe. Format 9:16."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "SMB-eier med tidsmangel. Innsikt: Målgruppen velger løsningen som er enklest å forstå på få sekunder."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Kontakt oss."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt i aktiv bruk med tydelig håndgrep og stabil geometri"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Realistisk kontor eller hjemmemiljø med kontrollert bakgrunn"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "50mm, halvnært utsnitt, statisk kamera"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Key 45 grader, myk fill, rim for separasjon"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Budskap i øvre tredel, produkt sentralt, CTA i lavere høyre hjørne"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-c-video-kontinuitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever video med produksjonsklar struktur for SoMe i 9:16."
      }
    ],
    "domain": "film-vfx",
    "useCase": "Reklamefaglig mal for produktreklame video med fokus på engasjement og SoMe.",
    "metadata": {
      "taxonomy": {
        "mal": "engasjement",
        "kanal": "SoMe",
        "stage": "produksjon",
        "domain": "reklame",
        "format": "9:16",
        "textLock": true,
        "brandLock": true,
        "strenghet": "høy",
        "productLock": true
      },
      "recommendedNegativePreset": "preset-c-video-kontinuitet"
    },
    "outputType": "video",
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "produkt-video-20",
    "tags": [
      "domain:reklame",
      "stage:produksjon",
      "kanal:TV",
      "format:16:9",
      "mal:konvertering",
      "strenghet:høy",
      "brandLock:ja",
      "textLock:ja",
      "productLock:ja",
      "kategori:produkt-video"
    ],
    "title": "Produktreklame video 20 (TV 16:9)",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "konvertering. Kanal TV. Format 16:9."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "Markedsleder med høyt tempo. Innsikt: Tydelig produktnytte slår visuell støy i feed."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Lær mer."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt i realistisk miljø med synlig funksjon i kontekst"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Nøytral studio-setting med lesbar materialitet"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "35mm, medium shot, rolig dolly-inn"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Hardt key med kontrollert fill og nøytral fargetemperatur"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Produkt i forgrunn, støttebudskap i mellomgrunn, logo i bakgrunn"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-c-video-kontinuitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever video med produksjonsklar struktur for TV i 16:9."
      }
    ],
    "domain": "film-vfx",
    "useCase": "Reklamefaglig mal for produktreklame video med fokus på konvertering og TV.",
    "metadata": {
      "taxonomy": {
        "mal": "konvertering",
        "kanal": "TV",
        "stage": "produksjon",
        "domain": "reklame",
        "format": "16:9",
        "textLock": true,
        "brandLock": true,
        "strenghet": "høy",
        "productLock": true
      },
      "recommendedNegativePreset": "preset-c-video-kontinuitet"
    },
    "outputType": "video",
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "skolepakke-oppgave-01",
    "tags": [
      "domain:reklame",
      "stage:strategi",
      "kanal:SoMe",
      "format:9:16",
      "mal:konvertering",
      "strenghet:høy",
      "brandLock:ja",
      "textLock:ja",
      "productLock:ja",
      "pakke:skolepakke-1-0"
    ],
    "title": "Skolepakke: Produktbrief 9:16",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "konvertering. Kanal SoMe. Format 9:16."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "Student eller junior kreatør. Innsikt: Øvelser med tydelig fasit gir rask læring.."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Løs oppgaven med konkret produksjonskontroll.. CTA: Lever promptutkast."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Oppgaven skal beskrive motiv og produkt med låste elementer."
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Bruk realistisk kontekst tilpasset kanal."
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "Kamera og utsnitt skal støtte budskap og format."
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Lysvalg skal være fysisk plausibelt og konsistent."
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Hierarki: overskrift, produkt, CTA."
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Brand lock, text lock og product lock skal vurderes eksplisitt."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen logo-deformasjon, ingen geometriavvik."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-d-reklame-kvalitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever video med produksjonsklar struktur for SoMe i 9:16."
      }
    ],
    "domain": "sosiale-medier",
    "useCase": "Oppgave: bygg en komplett produktprompt for SoMe-video.",
    "metadata": {
      "taxonomy": {
        "mal": "konvertering",
        "kanal": "SoMe",
        "stage": "strategi",
        "domain": "reklame",
        "format": "9:16",
        "textLock": true,
        "brandLock": true,
        "strenghet": "høy",
        "productLock": true
      },
      "skolepakke": true,
      "recommendedNegativePreset": "preset-d-reklame-kvalitet"
    },
    "outputType": "video",
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-04-definer-budskaphierarki",
      "reklame-standard-15-kameradata-skal-vaere-konkrete",
      "reklame-standard-29-ingen-feil-produktgeometri"
    ]
  },
  {
    "id": "skolepakke-oppgave-02",
    "tags": [
      "domain:reklame",
      "stage:konsept",
      "kanal:web",
      "format:1:1",
      "mal:kjennskap",
      "strenghet:høy",
      "brandLock:ja",
      "textLock:ja",
      "productLock:ja",
      "pakke:skolepakke-1-0"
    ],
    "title": "Skolepakke: Brand lock i kampanjebilde",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "kjennskap. Kanal web. Format 1:1."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "Student eller junior kreatør. Innsikt: Øvelser med tydelig fasit gir rask læring.."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Løs oppgaven med konkret produksjonskontroll.. CTA: Lever promptutkast."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Oppgaven skal beskrive motiv og produkt med låste elementer."
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Bruk realistisk kontekst tilpasset kanal."
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "Kamera og utsnitt skal støtte budskap og format."
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Lysvalg skal være fysisk plausibelt og konsistent."
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Hierarki: overskrift, produkt, CTA."
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Brand lock, text lock og product lock skal vurderes eksplisitt."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen logo-deformasjon, ingen geometriavvik."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-d-reklame-kvalitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever image med produksjonsklar struktur for web i 1:1."
      }
    ],
    "domain": "design-system",
    "useCase": "Oppgave: sikre brand-konsistens i stillbilde.",
    "metadata": {
      "taxonomy": {
        "mal": "kjennskap",
        "kanal": "web",
        "stage": "konsept",
        "domain": "reklame",
        "format": "1:1",
        "textLock": true,
        "brandLock": true,
        "strenghet": "høy",
        "productLock": true
      },
      "skolepakke": true,
      "recommendedNegativePreset": "preset-d-reklame-kvalitet"
    },
    "outputType": "image",
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-04-definer-budskaphierarki",
      "reklame-standard-15-kameradata-skal-vaere-konkrete",
      "reklame-standard-29-ingen-feil-produktgeometri"
    ]
  },
  {
    "id": "skolepakke-oppgave-03",
    "tags": [
      "domain:reklame",
      "stage:publisering",
      "kanal:DOOH",
      "format:16:9",
      "mal:kjennskap",
      "strenghet:høy",
      "brandLock:ja",
      "textLock:ja",
      "productLock:ja",
      "pakke:skolepakke-1-0"
    ],
    "title": "Skolepakke: DOOH lesbarhet",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "kjennskap. Kanal DOOH. Format 16:9."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "Student eller junior kreatør. Innsikt: Øvelser med tydelig fasit gir rask læring.."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Løs oppgaven med konkret produksjonskontroll.. CTA: Lever promptutkast."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Oppgaven skal beskrive motiv og produkt med låste elementer."
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Bruk realistisk kontekst tilpasset kanal."
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "Kamera og utsnitt skal støtte budskap og format."
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Lysvalg skal være fysisk plausibelt og konsistent."
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Hierarki: overskrift, produkt, CTA."
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Brand lock, text lock og product lock skal vurderes eksplisitt."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen logo-deformasjon, ingen geometriavvik."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-d-reklame-kvalitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever image med produksjonsklar struktur for DOOH i 16:9."
      }
    ],
    "domain": "redaksjonell",
    "useCase": "Oppgave: optimaliser teksthierarki for storformat.",
    "metadata": {
      "taxonomy": {
        "mal": "kjennskap",
        "kanal": "DOOH",
        "stage": "publisering",
        "domain": "reklame",
        "format": "16:9",
        "textLock": true,
        "brandLock": true,
        "strenghet": "høy",
        "productLock": true
      },
      "skolepakke": true,
      "recommendedNegativePreset": "preset-d-reklame-kvalitet"
    },
    "outputType": "image",
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-04-definer-budskaphierarki",
      "reklame-standard-15-kameradata-skal-vaere-konkrete",
      "reklame-standard-29-ingen-feil-produktgeometri"
    ]
  },
  {
    "id": "skolepakke-oppgave-04",
    "tags": [
      "domain:reklame",
      "stage:produksjon",
      "kanal:web",
      "format:16:9",
      "mal:engasjement",
      "strenghet:høy",
      "brandLock:ja",
      "textLock:ja",
      "productLock:ja",
      "pakke:skolepakke-1-0"
    ],
    "title": "Skolepakke: Video-kontinuitet 10 sek",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "engasjement. Kanal web. Format 16:9."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "Student eller junior kreatør. Innsikt: Øvelser med tydelig fasit gir rask læring.."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Løs oppgaven med konkret produksjonskontroll.. CTA: Lever promptutkast."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Oppgaven skal beskrive motiv og produkt med låste elementer."
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Bruk realistisk kontekst tilpasset kanal."
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "Kamera og utsnitt skal støtte budskap og format."
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Lysvalg skal være fysisk plausibelt og konsistent."
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Hierarki: overskrift, produkt, CTA."
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Brand lock, text lock og product lock skal vurderes eksplisitt."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen logo-deformasjon, ingen geometriavvik."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-d-reklame-kvalitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever video med produksjonsklar struktur for web i 16:9."
      }
    ],
    "domain": "film-vfx",
    "useCase": "Oppgave: hold identitet, tekst og produkt stabilt i video.",
    "metadata": {
      "taxonomy": {
        "mal": "engasjement",
        "kanal": "web",
        "stage": "produksjon",
        "domain": "reklame",
        "format": "16:9",
        "textLock": true,
        "brandLock": true,
        "strenghet": "høy",
        "productLock": true
      },
      "skolepakke": true,
      "recommendedNegativePreset": "preset-d-reklame-kvalitet"
    },
    "outputType": "video",
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-04-definer-budskaphierarki",
      "reklame-standard-15-kameradata-skal-vaere-konkrete",
      "reklame-standard-29-ingen-feil-produktgeometri"
    ]
  },
  {
    "id": "skolepakke-oppgave-05",
    "tags": [
      "domain:reklame",
      "stage:strategi",
      "kanal:web",
      "format:banner",
      "mal:konvertering",
      "strenghet:høy",
      "brandLock:ja",
      "textLock:ja",
      "productLock:ja",
      "pakke:skolepakke-1-0"
    ],
    "title": "Skolepakke: Copy med friksjonsfri CTA",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "konvertering. Kanal web. Format banner."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "Student eller junior kreatør. Innsikt: Øvelser med tydelig fasit gir rask læring.."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Løs oppgaven med konkret produksjonskontroll.. CTA: Lever promptutkast."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Oppgaven skal beskrive motiv og produkt med låste elementer."
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Bruk realistisk kontekst tilpasset kanal."
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "Kamera og utsnitt skal støtte budskap og format."
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Lysvalg skal være fysisk plausibelt og konsistent."
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Hierarki: overskrift, produkt, CTA."
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Brand lock, text lock og product lock skal vurderes eksplisitt."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen logo-deformasjon, ingen geometriavvik."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-d-reklame-kvalitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever text med produksjonsklar struktur for web i banner."
      }
    ],
    "domain": "redaksjonell",
    "useCase": "Oppgave: skriv prompt for tekstvariant med tydelig CTA.",
    "metadata": {
      "taxonomy": {
        "mal": "konvertering",
        "kanal": "web",
        "stage": "strategi",
        "domain": "reklame",
        "format": "banner",
        "textLock": true,
        "brandLock": true,
        "strenghet": "høy",
        "productLock": true
      },
      "skolepakke": true,
      "recommendedNegativePreset": "preset-d-reklame-kvalitet"
    },
    "outputType": "text",
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-04-definer-budskaphierarki",
      "reklame-standard-15-kameradata-skal-vaere-konkrete",
      "reklame-standard-29-ingen-feil-produktgeometri"
    ]
  },
  {
    "id": "skolepakke-rubrikk-v1",
    "tags": [
      "domain:reklame",
      "stage:publisering",
      "kanal:web",
      "format:16:9",
      "mal:engasjement",
      "strenghet:høy",
      "brandLock:ja",
      "textLock:ja",
      "productLock:ja",
      "pakke:skolepakke-1-0"
    ],
    "title": "Skolepakke: Vurderingsrubrikk",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "engasjement. Kanal web. Format 16:9."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "Student eller junior kreatør. Innsikt: Øvelser med tydelig fasit gir rask læring.."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Løs oppgaven med konkret produksjonskontroll.. CTA: Lever promptutkast."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Oppgaven skal beskrive motiv og produkt med låste elementer."
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Bruk realistisk kontekst tilpasset kanal."
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "Kamera og utsnitt skal støtte budskap og format."
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Lysvalg skal være fysisk plausibelt og konsistent."
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Hierarki: overskrift, produkt, CTA."
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Brand lock, text lock og product lock skal vurderes eksplisitt."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen logo-deformasjon, ingen geometriavvik."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-d-reklame-kvalitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever text med produksjonsklar struktur for web i 16:9."
      }
    ],
    "domain": "redaksjonell",
    "useCase": "Rubrikk for å evaluere mål, budskap, brand-lock og teknisk kontroll i prompt.",
    "metadata": {
      "taxonomy": {
        "mal": "engasjement",
        "kanal": "web",
        "stage": "publisering",
        "domain": "reklame",
        "format": "16:9",
        "textLock": true,
        "brandLock": true,
        "strenghet": "høy",
        "productLock": true
      },
      "skolepakke": true,
      "recommendedNegativePreset": "preset-d-reklame-kvalitet"
    },
    "outputType": "text",
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-04-definer-budskaphierarki",
      "reklame-standard-15-kameradata-skal-vaere-konkrete",
      "reklame-standard-29-ingen-feil-produktgeometri"
    ]
  },
  {
    "id": "some-hook-01",
    "tags": [
      "domain:reklame",
      "stage:produksjon",
      "kanal:SoMe",
      "format:9:16",
      "mal:engasjement",
      "strenghet:høy",
      "brandLock:ja",
      "textLock:ja",
      "productLock:ja",
      "kategori:some-hook"
    ],
    "title": "SoMe hook 01 (SoMe 9:16)",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "engasjement. Kanal SoMe. Format 9:16."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "SMB-eier med tidsmangel. Innsikt: Målgruppen velger løsningen som er enklest å forstå på få sekunder."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Bestill demo."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt i aktiv bruk med tydelig håndgrep og stabil geometri"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Realistisk kontor eller hjemmemiljø med kontrollert bakgrunn"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "50mm, halvnært utsnitt, statisk kamera"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Key 45 grader, myk fill, rim for separasjon"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Budskap i øvre tredel, produkt sentralt, CTA i lavere høyre hjørne"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-c-video-kontinuitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever video med produksjonsklar struktur for SoMe i 9:16."
      }
    ],
    "domain": "sosiale-medier",
    "useCase": "Reklamefaglig mal for some hook med fokus på engasjement og SoMe.",
    "metadata": {
      "taxonomy": {
        "mal": "engasjement",
        "kanal": "SoMe",
        "stage": "produksjon",
        "domain": "reklame",
        "format": "9:16",
        "textLock": true,
        "brandLock": true,
        "strenghet": "høy",
        "productLock": true
      },
      "recommendedNegativePreset": "preset-c-video-kontinuitet"
    },
    "outputType": "video",
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "some-hook-02",
    "tags": [
      "domain:reklame",
      "stage:produksjon",
      "kanal:web",
      "format:1:1",
      "mal:konvertering",
      "strenghet:høy",
      "brandLock:ja",
      "textLock:ja",
      "productLock:ja",
      "kategori:some-hook"
    ],
    "title": "SoMe hook 02 (web 1:1)",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "konvertering. Kanal web. Format 1:1."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "Markedsleder med høyt tempo. Innsikt: Tydelig produktnytte slår visuell støy i feed."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Prøv gratis."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt i realistisk miljø med synlig funksjon i kontekst"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Nøytral studio-setting med lesbar materialitet"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "35mm, medium shot, rolig dolly-inn"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Hardt key med kontrollert fill og nøytral fargetemperatur"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Produkt i forgrunn, støttebudskap i mellomgrunn, logo i bakgrunn"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-c-video-kontinuitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever video med produksjonsklar struktur for web i 1:1."
      }
    ],
    "domain": "sosiale-medier",
    "useCase": "Reklamefaglig mal for some hook med fokus på konvertering og web.",
    "metadata": {
      "taxonomy": {
        "mal": "konvertering",
        "kanal": "web",
        "stage": "produksjon",
        "domain": "reklame",
        "format": "1:1",
        "textLock": true,
        "brandLock": true,
        "strenghet": "høy",
        "productLock": true
      },
      "recommendedNegativePreset": "preset-c-video-kontinuitet"
    },
    "outputType": "video",
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "some-hook-03",
    "tags": [
      "domain:reklame",
      "stage:produksjon",
      "kanal:SoMe",
      "format:4:5",
      "mal:engasjement",
      "strenghet:høy",
      "brandLock:ja",
      "textLock:ja",
      "productLock:ja",
      "kategori:some-hook"
    ],
    "title": "SoMe hook 03 (SoMe 4:5)",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "engasjement. Kanal SoMe. Format 4:5."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "Innholdsprodusent med publiseringspress. Innsikt: Merkevaren må kjennes igjen før CTA har effekt."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Se løsningen."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt og avsender i samme bilde for klar avsenderidentitet"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Bymiljø med moderat aktivitet uten å stjele fokus"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "85mm, nærbilde, låst horisont"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Naturlig vinduslys med subtil fill og presis skyggekontroll"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Tydelig visuell hierarki: overskrift, produkt, CTA"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-c-video-kontinuitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever video med produksjonsklar struktur for SoMe i 4:5."
      }
    ],
    "domain": "sosiale-medier",
    "useCase": "Reklamefaglig mal for some hook med fokus på engasjement og SoMe.",
    "metadata": {
      "taxonomy": {
        "mal": "engasjement",
        "kanal": "SoMe",
        "stage": "produksjon",
        "domain": "reklame",
        "format": "4:5",
        "textLock": true,
        "brandLock": true,
        "strenghet": "høy",
        "productLock": true
      },
      "recommendedNegativePreset": "preset-c-video-kontinuitet"
    },
    "outputType": "video",
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "some-hook-04",
    "tags": [
      "domain:reklame",
      "stage:produksjon",
      "kanal:web",
      "format:9:16",
      "mal:konvertering",
      "strenghet:høy",
      "brandLock:ja",
      "textLock:ja",
      "productLock:ja",
      "kategori:some-hook"
    ],
    "title": "SoMe hook 04 (web 9:16)",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "konvertering. Kanal web. Format 9:16."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "SMB-eier med tidsmangel. Innsikt: Målgruppen velger løsningen som er enklest å forstå på få sekunder."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Kontakt oss."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt i aktiv bruk med tydelig håndgrep og stabil geometri"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Realistisk kontor eller hjemmemiljø med kontrollert bakgrunn"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "50mm, halvnært utsnitt, statisk kamera"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Key 45 grader, myk fill, rim for separasjon"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Budskap i øvre tredel, produkt sentralt, CTA i lavere høyre hjørne"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-c-video-kontinuitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever video med produksjonsklar struktur for web i 9:16."
      }
    ],
    "domain": "sosiale-medier",
    "useCase": "Reklamefaglig mal for some hook med fokus på konvertering og web.",
    "metadata": {
      "taxonomy": {
        "mal": "konvertering",
        "kanal": "web",
        "stage": "produksjon",
        "domain": "reklame",
        "format": "9:16",
        "textLock": true,
        "brandLock": true,
        "strenghet": "høy",
        "productLock": true
      },
      "recommendedNegativePreset": "preset-c-video-kontinuitet"
    },
    "outputType": "video",
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "some-hook-05",
    "tags": [
      "domain:reklame",
      "stage:produksjon",
      "kanal:SoMe",
      "format:1:1",
      "mal:engasjement",
      "strenghet:høy",
      "brandLock:ja",
      "textLock:ja",
      "productLock:ja",
      "kategori:some-hook"
    ],
    "title": "SoMe hook 05 (SoMe 1:1)",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "engasjement. Kanal SoMe. Format 1:1."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "Markedsleder med høyt tempo. Innsikt: Tydelig produktnytte slår visuell støy i feed."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Lær mer."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt i realistisk miljø med synlig funksjon i kontekst"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Nøytral studio-setting med lesbar materialitet"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "35mm, medium shot, rolig dolly-inn"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Hardt key med kontrollert fill og nøytral fargetemperatur"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Produkt i forgrunn, støttebudskap i mellomgrunn, logo i bakgrunn"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-c-video-kontinuitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever video med produksjonsklar struktur for SoMe i 1:1."
      }
    ],
    "domain": "sosiale-medier",
    "useCase": "Reklamefaglig mal for some hook med fokus på engasjement og SoMe.",
    "metadata": {
      "taxonomy": {
        "mal": "engasjement",
        "kanal": "SoMe",
        "stage": "produksjon",
        "domain": "reklame",
        "format": "1:1",
        "textLock": true,
        "brandLock": true,
        "strenghet": "høy",
        "productLock": true
      },
      "recommendedNegativePreset": "preset-c-video-kontinuitet"
    },
    "outputType": "video",
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "some-hook-06",
    "tags": [
      "domain:reklame",
      "stage:produksjon",
      "kanal:web",
      "format:4:5",
      "mal:konvertering",
      "strenghet:høy",
      "brandLock:ja",
      "textLock:ja",
      "productLock:ja",
      "kategori:some-hook"
    ],
    "title": "SoMe hook 06 (web 4:5)",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "konvertering. Kanal web. Format 4:5."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "Innholdsprodusent med publiseringspress. Innsikt: Merkevaren må kjennes igjen før CTA har effekt."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Bestill demo."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt og avsender i samme bilde for klar avsenderidentitet"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Bymiljø med moderat aktivitet uten å stjele fokus"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "85mm, nærbilde, låst horisont"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Naturlig vinduslys med subtil fill og presis skyggekontroll"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Tydelig visuell hierarki: overskrift, produkt, CTA"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-c-video-kontinuitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever video med produksjonsklar struktur for web i 4:5."
      }
    ],
    "domain": "sosiale-medier",
    "useCase": "Reklamefaglig mal for some hook med fokus på konvertering og web.",
    "metadata": {
      "taxonomy": {
        "mal": "konvertering",
        "kanal": "web",
        "stage": "produksjon",
        "domain": "reklame",
        "format": "4:5",
        "textLock": true,
        "brandLock": true,
        "strenghet": "høy",
        "productLock": true
      },
      "recommendedNegativePreset": "preset-c-video-kontinuitet"
    },
    "outputType": "video",
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "some-hook-07",
    "tags": [
      "domain:reklame",
      "stage:produksjon",
      "kanal:SoMe",
      "format:9:16",
      "mal:engasjement",
      "strenghet:høy",
      "brandLock:ja",
      "textLock:ja",
      "productLock:ja",
      "kategori:some-hook"
    ],
    "title": "SoMe hook 07 (SoMe 9:16)",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "engasjement. Kanal SoMe. Format 9:16."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "SMB-eier med tidsmangel. Innsikt: Målgruppen velger løsningen som er enklest å forstå på få sekunder."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Prøv gratis."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt i aktiv bruk med tydelig håndgrep og stabil geometri"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Realistisk kontor eller hjemmemiljø med kontrollert bakgrunn"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "50mm, halvnært utsnitt, statisk kamera"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Key 45 grader, myk fill, rim for separasjon"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Budskap i øvre tredel, produkt sentralt, CTA i lavere høyre hjørne"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-c-video-kontinuitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever video med produksjonsklar struktur for SoMe i 9:16."
      }
    ],
    "domain": "sosiale-medier",
    "useCase": "Reklamefaglig mal for some hook med fokus på engasjement og SoMe.",
    "metadata": {
      "taxonomy": {
        "mal": "engasjement",
        "kanal": "SoMe",
        "stage": "produksjon",
        "domain": "reklame",
        "format": "9:16",
        "textLock": true,
        "brandLock": true,
        "strenghet": "høy",
        "productLock": true
      },
      "recommendedNegativePreset": "preset-c-video-kontinuitet"
    },
    "outputType": "video",
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "some-hook-08",
    "tags": [
      "domain:reklame",
      "stage:produksjon",
      "kanal:web",
      "format:1:1",
      "mal:konvertering",
      "strenghet:høy",
      "brandLock:ja",
      "textLock:ja",
      "productLock:ja",
      "kategori:some-hook"
    ],
    "title": "SoMe hook 08 (web 1:1)",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "konvertering. Kanal web. Format 1:1."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "Markedsleder med høyt tempo. Innsikt: Tydelig produktnytte slår visuell støy i feed."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Se løsningen."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt i realistisk miljø med synlig funksjon i kontekst"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Nøytral studio-setting med lesbar materialitet"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "35mm, medium shot, rolig dolly-inn"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Hardt key med kontrollert fill og nøytral fargetemperatur"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Produkt i forgrunn, støttebudskap i mellomgrunn, logo i bakgrunn"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-c-video-kontinuitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever video med produksjonsklar struktur for web i 1:1."
      }
    ],
    "domain": "sosiale-medier",
    "useCase": "Reklamefaglig mal for some hook med fokus på konvertering og web.",
    "metadata": {
      "taxonomy": {
        "mal": "konvertering",
        "kanal": "web",
        "stage": "produksjon",
        "domain": "reklame",
        "format": "1:1",
        "textLock": true,
        "brandLock": true,
        "strenghet": "høy",
        "productLock": true
      },
      "recommendedNegativePreset": "preset-c-video-kontinuitet"
    },
    "outputType": "video",
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "some-hook-09",
    "tags": [
      "domain:reklame",
      "stage:produksjon",
      "kanal:SoMe",
      "format:4:5",
      "mal:engasjement",
      "strenghet:høy",
      "brandLock:ja",
      "textLock:ja",
      "productLock:ja",
      "kategori:some-hook"
    ],
    "title": "SoMe hook 09 (SoMe 4:5)",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "engasjement. Kanal SoMe. Format 4:5."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "Innholdsprodusent med publiseringspress. Innsikt: Merkevaren må kjennes igjen før CTA har effekt."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Kontakt oss."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt og avsender i samme bilde for klar avsenderidentitet"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Bymiljø med moderat aktivitet uten å stjele fokus"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "85mm, nærbilde, låst horisont"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Naturlig vinduslys med subtil fill og presis skyggekontroll"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Tydelig visuell hierarki: overskrift, produkt, CTA"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-c-video-kontinuitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever video med produksjonsklar struktur for SoMe i 4:5."
      }
    ],
    "domain": "sosiale-medier",
    "useCase": "Reklamefaglig mal for some hook med fokus på engasjement og SoMe.",
    "metadata": {
      "taxonomy": {
        "mal": "engasjement",
        "kanal": "SoMe",
        "stage": "produksjon",
        "domain": "reklame",
        "format": "4:5",
        "textLock": true,
        "brandLock": true,
        "strenghet": "høy",
        "productLock": true
      },
      "recommendedNegativePreset": "preset-c-video-kontinuitet"
    },
    "outputType": "video",
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "some-hook-10",
    "tags": [
      "domain:reklame",
      "stage:produksjon",
      "kanal:web",
      "format:9:16",
      "mal:konvertering",
      "strenghet:høy",
      "brandLock:ja",
      "textLock:ja",
      "productLock:ja",
      "kategori:some-hook"
    ],
    "title": "SoMe hook 10 (web 9:16)",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "konvertering. Kanal web. Format 9:16."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "SMB-eier med tidsmangel. Innsikt: Målgruppen velger løsningen som er enklest å forstå på få sekunder."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Lær mer."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt i aktiv bruk med tydelig håndgrep og stabil geometri"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Realistisk kontor eller hjemmemiljø med kontrollert bakgrunn"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "50mm, halvnært utsnitt, statisk kamera"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Key 45 grader, myk fill, rim for separasjon"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Budskap i øvre tredel, produkt sentralt, CTA i lavere høyre hjørne"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-c-video-kontinuitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever video med produksjonsklar struktur for web i 9:16."
      }
    ],
    "domain": "sosiale-medier",
    "useCase": "Reklamefaglig mal for some hook med fokus på konvertering og web.",
    "metadata": {
      "taxonomy": {
        "mal": "konvertering",
        "kanal": "web",
        "stage": "produksjon",
        "domain": "reklame",
        "format": "9:16",
        "textLock": true,
        "brandLock": true,
        "strenghet": "høy",
        "productLock": true
      },
      "recommendedNegativePreset": "preset-c-video-kontinuitet"
    },
    "outputType": "video",
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "some-hook-11",
    "tags": [
      "domain:reklame",
      "stage:produksjon",
      "kanal:SoMe",
      "format:1:1",
      "mal:engasjement",
      "strenghet:høy",
      "brandLock:ja",
      "textLock:ja",
      "productLock:ja",
      "kategori:some-hook"
    ],
    "title": "SoMe hook 11 (SoMe 1:1)",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "engasjement. Kanal SoMe. Format 1:1."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "Markedsleder med høyt tempo. Innsikt: Tydelig produktnytte slår visuell støy i feed."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Bestill demo."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt i realistisk miljø med synlig funksjon i kontekst"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Nøytral studio-setting med lesbar materialitet"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "35mm, medium shot, rolig dolly-inn"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Hardt key med kontrollert fill og nøytral fargetemperatur"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Produkt i forgrunn, støttebudskap i mellomgrunn, logo i bakgrunn"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-c-video-kontinuitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever video med produksjonsklar struktur for SoMe i 1:1."
      }
    ],
    "domain": "sosiale-medier",
    "useCase": "Reklamefaglig mal for some hook med fokus på engasjement og SoMe.",
    "metadata": {
      "taxonomy": {
        "mal": "engasjement",
        "kanal": "SoMe",
        "stage": "produksjon",
        "domain": "reklame",
        "format": "1:1",
        "textLock": true,
        "brandLock": true,
        "strenghet": "høy",
        "productLock": true
      },
      "recommendedNegativePreset": "preset-c-video-kontinuitet"
    },
    "outputType": "video",
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "some-hook-12",
    "tags": [
      "domain:reklame",
      "stage:produksjon",
      "kanal:web",
      "format:4:5",
      "mal:konvertering",
      "strenghet:høy",
      "brandLock:ja",
      "textLock:ja",
      "productLock:ja",
      "kategori:some-hook"
    ],
    "title": "SoMe hook 12 (web 4:5)",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "konvertering. Kanal web. Format 4:5."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "Innholdsprodusent med publiseringspress. Innsikt: Merkevaren må kjennes igjen før CTA har effekt."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Prøv gratis."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt og avsender i samme bilde for klar avsenderidentitet"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Bymiljø med moderat aktivitet uten å stjele fokus"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "85mm, nærbilde, låst horisont"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Naturlig vinduslys med subtil fill og presis skyggekontroll"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Tydelig visuell hierarki: overskrift, produkt, CTA"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-c-video-kontinuitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever video med produksjonsklar struktur for web i 4:5."
      }
    ],
    "domain": "sosiale-medier",
    "useCase": "Reklamefaglig mal for some hook med fokus på konvertering og web.",
    "metadata": {
      "taxonomy": {
        "mal": "konvertering",
        "kanal": "web",
        "stage": "produksjon",
        "domain": "reklame",
        "format": "4:5",
        "textLock": true,
        "brandLock": true,
        "strenghet": "høy",
        "productLock": true
      },
      "recommendedNegativePreset": "preset-c-video-kontinuitet"
    },
    "outputType": "video",
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "some-hook-13",
    "tags": [
      "domain:reklame",
      "stage:produksjon",
      "kanal:SoMe",
      "format:9:16",
      "mal:engasjement",
      "strenghet:høy",
      "brandLock:ja",
      "textLock:ja",
      "productLock:ja",
      "kategori:some-hook"
    ],
    "title": "SoMe hook 13 (SoMe 9:16)",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "engasjement. Kanal SoMe. Format 9:16."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "SMB-eier med tidsmangel. Innsikt: Målgruppen velger løsningen som er enklest å forstå på få sekunder."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Se løsningen."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt i aktiv bruk med tydelig håndgrep og stabil geometri"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Realistisk kontor eller hjemmemiljø med kontrollert bakgrunn"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "50mm, halvnært utsnitt, statisk kamera"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Key 45 grader, myk fill, rim for separasjon"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Budskap i øvre tredel, produkt sentralt, CTA i lavere høyre hjørne"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-c-video-kontinuitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever video med produksjonsklar struktur for SoMe i 9:16."
      }
    ],
    "domain": "sosiale-medier",
    "useCase": "Reklamefaglig mal for some hook med fokus på engasjement og SoMe.",
    "metadata": {
      "taxonomy": {
        "mal": "engasjement",
        "kanal": "SoMe",
        "stage": "produksjon",
        "domain": "reklame",
        "format": "9:16",
        "textLock": true,
        "brandLock": true,
        "strenghet": "høy",
        "productLock": true
      },
      "recommendedNegativePreset": "preset-c-video-kontinuitet"
    },
    "outputType": "video",
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "some-hook-14",
    "tags": [
      "domain:reklame",
      "stage:produksjon",
      "kanal:web",
      "format:1:1",
      "mal:konvertering",
      "strenghet:høy",
      "brandLock:ja",
      "textLock:ja",
      "productLock:ja",
      "kategori:some-hook"
    ],
    "title": "SoMe hook 14 (web 1:1)",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "konvertering. Kanal web. Format 1:1."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "Markedsleder med høyt tempo. Innsikt: Tydelig produktnytte slår visuell støy i feed."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Kontakt oss."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt i realistisk miljø med synlig funksjon i kontekst"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Nøytral studio-setting med lesbar materialitet"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "35mm, medium shot, rolig dolly-inn"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Hardt key med kontrollert fill og nøytral fargetemperatur"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Produkt i forgrunn, støttebudskap i mellomgrunn, logo i bakgrunn"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-c-video-kontinuitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever video med produksjonsklar struktur for web i 1:1."
      }
    ],
    "domain": "sosiale-medier",
    "useCase": "Reklamefaglig mal for some hook med fokus på konvertering og web.",
    "metadata": {
      "taxonomy": {
        "mal": "konvertering",
        "kanal": "web",
        "stage": "produksjon",
        "domain": "reklame",
        "format": "1:1",
        "textLock": true,
        "brandLock": true,
        "strenghet": "høy",
        "productLock": true
      },
      "recommendedNegativePreset": "preset-c-video-kontinuitet"
    },
    "outputType": "video",
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "some-hook-15",
    "tags": [
      "domain:reklame",
      "stage:produksjon",
      "kanal:SoMe",
      "format:4:5",
      "mal:engasjement",
      "strenghet:høy",
      "brandLock:ja",
      "textLock:ja",
      "productLock:ja",
      "kategori:some-hook"
    ],
    "title": "SoMe hook 15 (SoMe 4:5)",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "engasjement. Kanal SoMe. Format 4:5."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "Innholdsprodusent med publiseringspress. Innsikt: Merkevaren må kjennes igjen før CTA har effekt."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Lær mer."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt og avsender i samme bilde for klar avsenderidentitet"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Bymiljø med moderat aktivitet uten å stjele fokus"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "85mm, nærbilde, låst horisont"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Naturlig vinduslys med subtil fill og presis skyggekontroll"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Tydelig visuell hierarki: overskrift, produkt, CTA"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-c-video-kontinuitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever video med produksjonsklar struktur for SoMe i 4:5."
      }
    ],
    "domain": "sosiale-medier",
    "useCase": "Reklamefaglig mal for some hook med fokus på engasjement og SoMe.",
    "metadata": {
      "taxonomy": {
        "mal": "engasjement",
        "kanal": "SoMe",
        "stage": "produksjon",
        "domain": "reklame",
        "format": "4:5",
        "textLock": true,
        "brandLock": true,
        "strenghet": "høy",
        "productLock": true
      },
      "recommendedNegativePreset": "preset-c-video-kontinuitet"
    },
    "outputType": "video",
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "some-hook-16",
    "tags": [
      "domain:reklame",
      "stage:produksjon",
      "kanal:web",
      "format:9:16",
      "mal:konvertering",
      "strenghet:høy",
      "brandLock:ja",
      "textLock:ja",
      "productLock:ja",
      "kategori:some-hook"
    ],
    "title": "SoMe hook 16 (web 9:16)",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "konvertering. Kanal web. Format 9:16."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "SMB-eier med tidsmangel. Innsikt: Målgruppen velger løsningen som er enklest å forstå på få sekunder."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Bestill demo."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt i aktiv bruk med tydelig håndgrep og stabil geometri"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Realistisk kontor eller hjemmemiljø med kontrollert bakgrunn"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "50mm, halvnært utsnitt, statisk kamera"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Key 45 grader, myk fill, rim for separasjon"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Budskap i øvre tredel, produkt sentralt, CTA i lavere høyre hjørne"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-c-video-kontinuitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever video med produksjonsklar struktur for web i 9:16."
      }
    ],
    "domain": "sosiale-medier",
    "useCase": "Reklamefaglig mal for some hook med fokus på konvertering og web.",
    "metadata": {
      "taxonomy": {
        "mal": "konvertering",
        "kanal": "web",
        "stage": "produksjon",
        "domain": "reklame",
        "format": "9:16",
        "textLock": true,
        "brandLock": true,
        "strenghet": "høy",
        "productLock": true
      },
      "recommendedNegativePreset": "preset-c-video-kontinuitet"
    },
    "outputType": "video",
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "some-hook-17",
    "tags": [
      "domain:reklame",
      "stage:produksjon",
      "kanal:SoMe",
      "format:1:1",
      "mal:engasjement",
      "strenghet:høy",
      "brandLock:ja",
      "textLock:ja",
      "productLock:ja",
      "kategori:some-hook"
    ],
    "title": "SoMe hook 17 (SoMe 1:1)",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "engasjement. Kanal SoMe. Format 1:1."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "Markedsleder med høyt tempo. Innsikt: Tydelig produktnytte slår visuell støy i feed."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Prøv gratis."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt i realistisk miljø med synlig funksjon i kontekst"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Nøytral studio-setting med lesbar materialitet"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "35mm, medium shot, rolig dolly-inn"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Hardt key med kontrollert fill og nøytral fargetemperatur"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Produkt i forgrunn, støttebudskap i mellomgrunn, logo i bakgrunn"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-c-video-kontinuitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever video med produksjonsklar struktur for SoMe i 1:1."
      }
    ],
    "domain": "sosiale-medier",
    "useCase": "Reklamefaglig mal for some hook med fokus på engasjement og SoMe.",
    "metadata": {
      "taxonomy": {
        "mal": "engasjement",
        "kanal": "SoMe",
        "stage": "produksjon",
        "domain": "reklame",
        "format": "1:1",
        "textLock": true,
        "brandLock": true,
        "strenghet": "høy",
        "productLock": true
      },
      "recommendedNegativePreset": "preset-c-video-kontinuitet"
    },
    "outputType": "video",
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "some-hook-18",
    "tags": [
      "domain:reklame",
      "stage:produksjon",
      "kanal:web",
      "format:4:5",
      "mal:konvertering",
      "strenghet:høy",
      "brandLock:ja",
      "textLock:ja",
      "productLock:ja",
      "kategori:some-hook"
    ],
    "title": "SoMe hook 18 (web 4:5)",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "konvertering. Kanal web. Format 4:5."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "Innholdsprodusent med publiseringspress. Innsikt: Merkevaren må kjennes igjen før CTA har effekt."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Se løsningen."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt og avsender i samme bilde for klar avsenderidentitet"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Bymiljø med moderat aktivitet uten å stjele fokus"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "85mm, nærbilde, låst horisont"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Naturlig vinduslys med subtil fill og presis skyggekontroll"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Tydelig visuell hierarki: overskrift, produkt, CTA"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-c-video-kontinuitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever video med produksjonsklar struktur for web i 4:5."
      }
    ],
    "domain": "sosiale-medier",
    "useCase": "Reklamefaglig mal for some hook med fokus på konvertering og web.",
    "metadata": {
      "taxonomy": {
        "mal": "konvertering",
        "kanal": "web",
        "stage": "produksjon",
        "domain": "reklame",
        "format": "4:5",
        "textLock": true,
        "brandLock": true,
        "strenghet": "høy",
        "productLock": true
      },
      "recommendedNegativePreset": "preset-c-video-kontinuitet"
    },
    "outputType": "video",
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "some-hook-19",
    "tags": [
      "domain:reklame",
      "stage:produksjon",
      "kanal:SoMe",
      "format:9:16",
      "mal:engasjement",
      "strenghet:høy",
      "brandLock:ja",
      "textLock:ja",
      "productLock:ja",
      "kategori:some-hook"
    ],
    "title": "SoMe hook 19 (SoMe 9:16)",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "engasjement. Kanal SoMe. Format 9:16."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "SMB-eier med tidsmangel. Innsikt: Målgruppen velger løsningen som er enklest å forstå på få sekunder."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Kontakt oss."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt i aktiv bruk med tydelig håndgrep og stabil geometri"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Realistisk kontor eller hjemmemiljø med kontrollert bakgrunn"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "50mm, halvnært utsnitt, statisk kamera"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Key 45 grader, myk fill, rim for separasjon"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Budskap i øvre tredel, produkt sentralt, CTA i lavere høyre hjørne"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-c-video-kontinuitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever video med produksjonsklar struktur for SoMe i 9:16."
      }
    ],
    "domain": "sosiale-medier",
    "useCase": "Reklamefaglig mal for some hook med fokus på engasjement og SoMe.",
    "metadata": {
      "taxonomy": {
        "mal": "engasjement",
        "kanal": "SoMe",
        "stage": "produksjon",
        "domain": "reklame",
        "format": "9:16",
        "textLock": true,
        "brandLock": true,
        "strenghet": "høy",
        "productLock": true
      },
      "recommendedNegativePreset": "preset-c-video-kontinuitet"
    },
    "outputType": "video",
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "some-hook-20",
    "tags": [
      "domain:reklame",
      "stage:produksjon",
      "kanal:web",
      "format:1:1",
      "mal:konvertering",
      "strenghet:høy",
      "brandLock:ja",
      "textLock:ja",
      "productLock:ja",
      "kategori:some-hook"
    ],
    "title": "SoMe hook 20 (web 1:1)",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "konvertering. Kanal web. Format 1:1."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "Markedsleder med høyt tempo. Innsikt: Tydelig produktnytte slår visuell støy i feed."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Lær mer."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt i realistisk miljø med synlig funksjon i kontekst"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Nøytral studio-setting med lesbar materialitet"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "35mm, medium shot, rolig dolly-inn"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Hardt key med kontrollert fill og nøytral fargetemperatur"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Produkt i forgrunn, støttebudskap i mellomgrunn, logo i bakgrunn"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-c-video-kontinuitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever video med produksjonsklar struktur for web i 1:1."
      }
    ],
    "domain": "sosiale-medier",
    "useCase": "Reklamefaglig mal for some hook med fokus på konvertering og web.",
    "metadata": {
      "taxonomy": {
        "mal": "konvertering",
        "kanal": "web",
        "stage": "produksjon",
        "domain": "reklame",
        "format": "1:1",
        "textLock": true,
        "brandLock": true,
        "strenghet": "høy",
        "productLock": true
      },
      "recommendedNegativePreset": "preset-c-video-kontinuitet"
    },
    "outputType": "video",
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  }
];

export const templatesGenerated: PromptTemplate[] = [
  {
    "id": "brand-identitet-01",
    "title": "Brand og identitet 01 (web 1:1)",
    "useCase": "Reklamefaglig mal for brand og identitet med fokus på kjennskap og web.",
    "outputType": "image",
    "domain": "design-system",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "kjennskap. Kanal web. Format 1:1."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "SMB-eier med tidsmangel. Innsikt: Målgruppen velger løsningen som er enklest å forstå på få sekunder."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Bestill demo."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt i aktiv bruk med tydelig håndgrep og stabil geometri"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Realistisk kontor eller hjemmemiljø med kontrollert bakgrunn"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "50mm, halvnært utsnitt, statisk kamera"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Key 45 grader, myk fill, rim for separasjon"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Budskap i øvre tredel, produkt sentralt, CTA i lavere høyre hjørne"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-d-reklame-kvalitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever image med produksjonsklar struktur for web i 1:1."
      }
    ],
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "brand-identitet-02",
    "title": "Brand og identitet 02 (print 16:9)",
    "useCase": "Reklamefaglig mal for brand og identitet med fokus på kjennskap og print.",
    "outputType": "image",
    "domain": "design-system",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "kjennskap. Kanal print. Format 16:9."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "Markedsleder med høyt tempo. Innsikt: Tydelig produktnytte slår visuell støy i feed."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Prøv gratis."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt i realistisk miljø med synlig funksjon i kontekst"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Nøytral studio-setting med lesbar materialitet"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "35mm, medium shot, rolig dolly-inn"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Hardt key med kontrollert fill og nøytral fargetemperatur"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Produkt i forgrunn, støttebudskap i mellomgrunn, logo i bakgrunn"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-d-reklame-kvalitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever image med produksjonsklar struktur for print i 16:9."
      }
    ],
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "brand-identitet-03",
    "title": "Brand og identitet 03 (DOOH banner)",
    "useCase": "Reklamefaglig mal for brand og identitet med fokus på kjennskap og DOOH.",
    "outputType": "image",
    "domain": "design-system",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "kjennskap. Kanal DOOH. Format banner."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "Innholdsprodusent med publiseringspress. Innsikt: Merkevaren må kjennes igjen før CTA har effekt."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Se løsningen."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt og avsender i samme bilde for klar avsenderidentitet"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Bymiljø med moderat aktivitet uten å stjele fokus"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "85mm, nærbilde, låst horisont"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Naturlig vinduslys med subtil fill og presis skyggekontroll"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Tydelig visuell hierarki: overskrift, produkt, CTA"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-d-reklame-kvalitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever image med produksjonsklar struktur for DOOH i banner."
      }
    ],
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "brand-identitet-04",
    "title": "Brand og identitet 04 (web 1:1)",
    "useCase": "Reklamefaglig mal for brand og identitet med fokus på kjennskap og web.",
    "outputType": "image",
    "domain": "design-system",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "kjennskap. Kanal web. Format 1:1."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "SMB-eier med tidsmangel. Innsikt: Målgruppen velger løsningen som er enklest å forstå på få sekunder."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Kontakt oss."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt i aktiv bruk med tydelig håndgrep og stabil geometri"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Realistisk kontor eller hjemmemiljø med kontrollert bakgrunn"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "50mm, halvnært utsnitt, statisk kamera"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Key 45 grader, myk fill, rim for separasjon"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Budskap i øvre tredel, produkt sentralt, CTA i lavere høyre hjørne"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-d-reklame-kvalitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever image med produksjonsklar struktur for web i 1:1."
      }
    ],
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "brand-identitet-05",
    "title": "Brand og identitet 05 (print 16:9)",
    "useCase": "Reklamefaglig mal for brand og identitet med fokus på kjennskap og print.",
    "outputType": "image",
    "domain": "design-system",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "kjennskap. Kanal print. Format 16:9."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "Markedsleder med høyt tempo. Innsikt: Tydelig produktnytte slår visuell støy i feed."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Lær mer."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt i realistisk miljø med synlig funksjon i kontekst"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Nøytral studio-setting med lesbar materialitet"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "35mm, medium shot, rolig dolly-inn"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Hardt key med kontrollert fill og nøytral fargetemperatur"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Produkt i forgrunn, støttebudskap i mellomgrunn, logo i bakgrunn"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-d-reklame-kvalitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever image med produksjonsklar struktur for print i 16:9."
      }
    ],
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "brand-identitet-06",
    "title": "Brand og identitet 06 (DOOH banner)",
    "useCase": "Reklamefaglig mal for brand og identitet med fokus på kjennskap og DOOH.",
    "outputType": "image",
    "domain": "design-system",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "kjennskap. Kanal DOOH. Format banner."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "Innholdsprodusent med publiseringspress. Innsikt: Merkevaren må kjennes igjen før CTA har effekt."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Bestill demo."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt og avsender i samme bilde for klar avsenderidentitet"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Bymiljø med moderat aktivitet uten å stjele fokus"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "85mm, nærbilde, låst horisont"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Naturlig vinduslys med subtil fill og presis skyggekontroll"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Tydelig visuell hierarki: overskrift, produkt, CTA"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-d-reklame-kvalitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever image med produksjonsklar struktur for DOOH i banner."
      }
    ],
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "brand-identitet-07",
    "title": "Brand og identitet 07 (web 1:1)",
    "useCase": "Reklamefaglig mal for brand og identitet med fokus på kjennskap og web.",
    "outputType": "image",
    "domain": "design-system",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "kjennskap. Kanal web. Format 1:1."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "SMB-eier med tidsmangel. Innsikt: Målgruppen velger løsningen som er enklest å forstå på få sekunder."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Prøv gratis."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt i aktiv bruk med tydelig håndgrep og stabil geometri"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Realistisk kontor eller hjemmemiljø med kontrollert bakgrunn"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "50mm, halvnært utsnitt, statisk kamera"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Key 45 grader, myk fill, rim for separasjon"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Budskap i øvre tredel, produkt sentralt, CTA i lavere høyre hjørne"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-d-reklame-kvalitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever image med produksjonsklar struktur for web i 1:1."
      }
    ],
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "brand-identitet-08",
    "title": "Brand og identitet 08 (print 16:9)",
    "useCase": "Reklamefaglig mal for brand og identitet med fokus på kjennskap og print.",
    "outputType": "image",
    "domain": "design-system",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "kjennskap. Kanal print. Format 16:9."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "Markedsleder med høyt tempo. Innsikt: Tydelig produktnytte slår visuell støy i feed."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Se løsningen."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt i realistisk miljø med synlig funksjon i kontekst"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Nøytral studio-setting med lesbar materialitet"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "35mm, medium shot, rolig dolly-inn"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Hardt key med kontrollert fill og nøytral fargetemperatur"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Produkt i forgrunn, støttebudskap i mellomgrunn, logo i bakgrunn"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-d-reklame-kvalitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever image med produksjonsklar struktur for print i 16:9."
      }
    ],
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "brand-identitet-09",
    "title": "Brand og identitet 09 (DOOH banner)",
    "useCase": "Reklamefaglig mal for brand og identitet med fokus på kjennskap og DOOH.",
    "outputType": "image",
    "domain": "design-system",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "kjennskap. Kanal DOOH. Format banner."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "Innholdsprodusent med publiseringspress. Innsikt: Merkevaren må kjennes igjen før CTA har effekt."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Kontakt oss."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt og avsender i samme bilde for klar avsenderidentitet"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Bymiljø med moderat aktivitet uten å stjele fokus"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "85mm, nærbilde, låst horisont"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Naturlig vinduslys med subtil fill og presis skyggekontroll"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Tydelig visuell hierarki: overskrift, produkt, CTA"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-d-reklame-kvalitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever image med produksjonsklar struktur for DOOH i banner."
      }
    ],
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "brand-identitet-10",
    "title": "Brand og identitet 10 (web 1:1)",
    "useCase": "Reklamefaglig mal for brand og identitet med fokus på kjennskap og web.",
    "outputType": "image",
    "domain": "design-system",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "kjennskap. Kanal web. Format 1:1."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "SMB-eier med tidsmangel. Innsikt: Målgruppen velger løsningen som er enklest å forstå på få sekunder."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Lær mer."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt i aktiv bruk med tydelig håndgrep og stabil geometri"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Realistisk kontor eller hjemmemiljø med kontrollert bakgrunn"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "50mm, halvnært utsnitt, statisk kamera"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Key 45 grader, myk fill, rim for separasjon"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Budskap i øvre tredel, produkt sentralt, CTA i lavere høyre hjørne"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-d-reklame-kvalitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever image med produksjonsklar struktur for web i 1:1."
      }
    ],
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "brand-identitet-11",
    "title": "Brand og identitet 11 (print 16:9)",
    "useCase": "Reklamefaglig mal for brand og identitet med fokus på kjennskap og print.",
    "outputType": "image",
    "domain": "design-system",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "kjennskap. Kanal print. Format 16:9."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "Markedsleder med høyt tempo. Innsikt: Tydelig produktnytte slår visuell støy i feed."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Bestill demo."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt i realistisk miljø med synlig funksjon i kontekst"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Nøytral studio-setting med lesbar materialitet"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "35mm, medium shot, rolig dolly-inn"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Hardt key med kontrollert fill og nøytral fargetemperatur"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Produkt i forgrunn, støttebudskap i mellomgrunn, logo i bakgrunn"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-d-reklame-kvalitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever image med produksjonsklar struktur for print i 16:9."
      }
    ],
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "brand-identitet-12",
    "title": "Brand og identitet 12 (DOOH banner)",
    "useCase": "Reklamefaglig mal for brand og identitet med fokus på kjennskap og DOOH.",
    "outputType": "image",
    "domain": "design-system",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "kjennskap. Kanal DOOH. Format banner."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "Innholdsprodusent med publiseringspress. Innsikt: Merkevaren må kjennes igjen før CTA har effekt."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Prøv gratis."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt og avsender i samme bilde for klar avsenderidentitet"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Bymiljø med moderat aktivitet uten å stjele fokus"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "85mm, nærbilde, låst horisont"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Naturlig vinduslys med subtil fill og presis skyggekontroll"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Tydelig visuell hierarki: overskrift, produkt, CTA"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-d-reklame-kvalitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever image med produksjonsklar struktur for DOOH i banner."
      }
    ],
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "brand-identitet-13",
    "title": "Brand og identitet 13 (web 1:1)",
    "useCase": "Reklamefaglig mal for brand og identitet med fokus på kjennskap og web.",
    "outputType": "image",
    "domain": "design-system",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "kjennskap. Kanal web. Format 1:1."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "SMB-eier med tidsmangel. Innsikt: Målgruppen velger løsningen som er enklest å forstå på få sekunder."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Se løsningen."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt i aktiv bruk med tydelig håndgrep og stabil geometri"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Realistisk kontor eller hjemmemiljø med kontrollert bakgrunn"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "50mm, halvnært utsnitt, statisk kamera"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Key 45 grader, myk fill, rim for separasjon"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Budskap i øvre tredel, produkt sentralt, CTA i lavere høyre hjørne"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-d-reklame-kvalitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever image med produksjonsklar struktur for web i 1:1."
      }
    ],
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "brand-identitet-14",
    "title": "Brand og identitet 14 (print 16:9)",
    "useCase": "Reklamefaglig mal for brand og identitet med fokus på kjennskap og print.",
    "outputType": "image",
    "domain": "design-system",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "kjennskap. Kanal print. Format 16:9."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "Markedsleder med høyt tempo. Innsikt: Tydelig produktnytte slår visuell støy i feed."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Kontakt oss."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt i realistisk miljø med synlig funksjon i kontekst"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Nøytral studio-setting med lesbar materialitet"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "35mm, medium shot, rolig dolly-inn"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Hardt key med kontrollert fill og nøytral fargetemperatur"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Produkt i forgrunn, støttebudskap i mellomgrunn, logo i bakgrunn"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-d-reklame-kvalitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever image med produksjonsklar struktur for print i 16:9."
      }
    ],
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "brand-identitet-15",
    "title": "Brand og identitet 15 (DOOH banner)",
    "useCase": "Reklamefaglig mal for brand og identitet med fokus på kjennskap og DOOH.",
    "outputType": "image",
    "domain": "design-system",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "kjennskap. Kanal DOOH. Format banner."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "Innholdsprodusent med publiseringspress. Innsikt: Merkevaren må kjennes igjen før CTA har effekt."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Lær mer."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt og avsender i samme bilde for klar avsenderidentitet"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Bymiljø med moderat aktivitet uten å stjele fokus"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "85mm, nærbilde, låst horisont"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Naturlig vinduslys med subtil fill og presis skyggekontroll"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Tydelig visuell hierarki: overskrift, produkt, CTA"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-d-reklame-kvalitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever image med produksjonsklar struktur for DOOH i banner."
      }
    ],
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "brand-identitet-16",
    "title": "Brand og identitet 16 (web 1:1)",
    "useCase": "Reklamefaglig mal for brand og identitet med fokus på kjennskap og web.",
    "outputType": "image",
    "domain": "design-system",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "kjennskap. Kanal web. Format 1:1."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "SMB-eier med tidsmangel. Innsikt: Målgruppen velger løsningen som er enklest å forstå på få sekunder."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Bestill demo."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt i aktiv bruk med tydelig håndgrep og stabil geometri"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Realistisk kontor eller hjemmemiljø med kontrollert bakgrunn"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "50mm, halvnært utsnitt, statisk kamera"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Key 45 grader, myk fill, rim for separasjon"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Budskap i øvre tredel, produkt sentralt, CTA i lavere høyre hjørne"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-d-reklame-kvalitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever image med produksjonsklar struktur for web i 1:1."
      }
    ],
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "brand-identitet-17",
    "title": "Brand og identitet 17 (print 16:9)",
    "useCase": "Reklamefaglig mal for brand og identitet med fokus på kjennskap og print.",
    "outputType": "image",
    "domain": "design-system",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "kjennskap. Kanal print. Format 16:9."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "Markedsleder med høyt tempo. Innsikt: Tydelig produktnytte slår visuell støy i feed."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Prøv gratis."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt i realistisk miljø med synlig funksjon i kontekst"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Nøytral studio-setting med lesbar materialitet"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "35mm, medium shot, rolig dolly-inn"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Hardt key med kontrollert fill og nøytral fargetemperatur"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Produkt i forgrunn, støttebudskap i mellomgrunn, logo i bakgrunn"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-d-reklame-kvalitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever image med produksjonsklar struktur for print i 16:9."
      }
    ],
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "brand-identitet-18",
    "title": "Brand og identitet 18 (DOOH banner)",
    "useCase": "Reklamefaglig mal for brand og identitet med fokus på kjennskap og DOOH.",
    "outputType": "image",
    "domain": "design-system",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "kjennskap. Kanal DOOH. Format banner."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "Innholdsprodusent med publiseringspress. Innsikt: Merkevaren må kjennes igjen før CTA har effekt."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Se løsningen."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt og avsender i samme bilde for klar avsenderidentitet"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Bymiljø med moderat aktivitet uten å stjele fokus"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "85mm, nærbilde, låst horisont"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Naturlig vinduslys med subtil fill og presis skyggekontroll"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Tydelig visuell hierarki: overskrift, produkt, CTA"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-d-reklame-kvalitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever image med produksjonsklar struktur for DOOH i banner."
      }
    ],
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "brand-identitet-19",
    "title": "Brand og identitet 19 (web 1:1)",
    "useCase": "Reklamefaglig mal for brand og identitet med fokus på kjennskap og web.",
    "outputType": "image",
    "domain": "design-system",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "kjennskap. Kanal web. Format 1:1."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "SMB-eier med tidsmangel. Innsikt: Målgruppen velger løsningen som er enklest å forstå på få sekunder."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Kontakt oss."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt i aktiv bruk med tydelig håndgrep og stabil geometri"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Realistisk kontor eller hjemmemiljø med kontrollert bakgrunn"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "50mm, halvnært utsnitt, statisk kamera"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Key 45 grader, myk fill, rim for separasjon"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Budskap i øvre tredel, produkt sentralt, CTA i lavere høyre hjørne"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-d-reklame-kvalitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever image med produksjonsklar struktur for web i 1:1."
      }
    ],
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "brand-identitet-20",
    "title": "Brand og identitet 20 (print 16:9)",
    "useCase": "Reklamefaglig mal for brand og identitet med fokus på kjennskap og print.",
    "outputType": "image",
    "domain": "design-system",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "kjennskap. Kanal print. Format 16:9."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "Markedsleder med høyt tempo. Innsikt: Tydelig produktnytte slår visuell støy i feed."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Lær mer."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt i realistisk miljø med synlig funksjon i kontekst"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Nøytral studio-setting med lesbar materialitet"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "35mm, medium shot, rolig dolly-inn"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Hardt key med kontrollert fill og nøytral fargetemperatur"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Produkt i forgrunn, støttebudskap i mellomgrunn, logo i bakgrunn"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-d-reklame-kvalitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever image med produksjonsklar struktur for print i 16:9."
      }
    ],
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "dooh-plakat-01",
    "title": "DOOH og plakat 01 (DOOH 16:9)",
    "useCase": "Reklamefaglig mal for dooh og plakat med fokus på kjennskap og DOOH.",
    "outputType": "image",
    "domain": "redaksjonell",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "kjennskap. Kanal DOOH. Format 16:9."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "SMB-eier med tidsmangel. Innsikt: Målgruppen velger løsningen som er enklest å forstå på få sekunder."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Bestill demo."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt i aktiv bruk med tydelig håndgrep og stabil geometri"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Realistisk kontor eller hjemmemiljø med kontrollert bakgrunn"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "50mm, halvnært utsnitt, statisk kamera"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Key 45 grader, myk fill, rim for separasjon"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Budskap i øvre tredel, produkt sentralt, CTA i lavere høyre hjørne"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-d-reklame-kvalitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever image med produksjonsklar struktur for DOOH i 16:9."
      }
    ],
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "dooh-plakat-02",
    "title": "DOOH og plakat 02 (print 4:5)",
    "useCase": "Reklamefaglig mal for dooh og plakat med fokus på konvertering og print.",
    "outputType": "image",
    "domain": "redaksjonell",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "konvertering. Kanal print. Format 4:5."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "Markedsleder med høyt tempo. Innsikt: Tydelig produktnytte slår visuell støy i feed."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Prøv gratis."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt i realistisk miljø med synlig funksjon i kontekst"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Nøytral studio-setting med lesbar materialitet"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "35mm, medium shot, rolig dolly-inn"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Hardt key med kontrollert fill og nøytral fargetemperatur"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Produkt i forgrunn, støttebudskap i mellomgrunn, logo i bakgrunn"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-d-reklame-kvalitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever image med produksjonsklar struktur for print i 4:5."
      }
    ],
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "dooh-plakat-03",
    "title": "DOOH og plakat 03 (DOOH banner)",
    "useCase": "Reklamefaglig mal for dooh og plakat med fokus på kjennskap og DOOH.",
    "outputType": "image",
    "domain": "redaksjonell",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "kjennskap. Kanal DOOH. Format banner."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "Innholdsprodusent med publiseringspress. Innsikt: Merkevaren må kjennes igjen før CTA har effekt."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Se løsningen."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt og avsender i samme bilde for klar avsenderidentitet"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Bymiljø med moderat aktivitet uten å stjele fokus"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "85mm, nærbilde, låst horisont"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Naturlig vinduslys med subtil fill og presis skyggekontroll"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Tydelig visuell hierarki: overskrift, produkt, CTA"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-d-reklame-kvalitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever image med produksjonsklar struktur for DOOH i banner."
      }
    ],
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "dooh-plakat-04",
    "title": "DOOH og plakat 04 (print 16:9)",
    "useCase": "Reklamefaglig mal for dooh og plakat med fokus på konvertering og print.",
    "outputType": "image",
    "domain": "redaksjonell",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "konvertering. Kanal print. Format 16:9."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "SMB-eier med tidsmangel. Innsikt: Målgruppen velger løsningen som er enklest å forstå på få sekunder."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Kontakt oss."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt i aktiv bruk med tydelig håndgrep og stabil geometri"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Realistisk kontor eller hjemmemiljø med kontrollert bakgrunn"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "50mm, halvnært utsnitt, statisk kamera"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Key 45 grader, myk fill, rim for separasjon"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Budskap i øvre tredel, produkt sentralt, CTA i lavere høyre hjørne"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-d-reklame-kvalitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever image med produksjonsklar struktur for print i 16:9."
      }
    ],
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "dooh-plakat-05",
    "title": "DOOH og plakat 05 (DOOH 4:5)",
    "useCase": "Reklamefaglig mal for dooh og plakat med fokus på kjennskap og DOOH.",
    "outputType": "image",
    "domain": "redaksjonell",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "kjennskap. Kanal DOOH. Format 4:5."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "Markedsleder med høyt tempo. Innsikt: Tydelig produktnytte slår visuell støy i feed."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Lær mer."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt i realistisk miljø med synlig funksjon i kontekst"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Nøytral studio-setting med lesbar materialitet"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "35mm, medium shot, rolig dolly-inn"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Hardt key med kontrollert fill og nøytral fargetemperatur"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Produkt i forgrunn, støttebudskap i mellomgrunn, logo i bakgrunn"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-d-reklame-kvalitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever image med produksjonsklar struktur for DOOH i 4:5."
      }
    ],
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "dooh-plakat-06",
    "title": "DOOH og plakat 06 (print banner)",
    "useCase": "Reklamefaglig mal for dooh og plakat med fokus på konvertering og print.",
    "outputType": "image",
    "domain": "redaksjonell",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "konvertering. Kanal print. Format banner."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "Innholdsprodusent med publiseringspress. Innsikt: Merkevaren må kjennes igjen før CTA har effekt."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Bestill demo."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt og avsender i samme bilde for klar avsenderidentitet"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Bymiljø med moderat aktivitet uten å stjele fokus"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "85mm, nærbilde, låst horisont"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Naturlig vinduslys med subtil fill og presis skyggekontroll"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Tydelig visuell hierarki: overskrift, produkt, CTA"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-d-reklame-kvalitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever image med produksjonsklar struktur for print i banner."
      }
    ],
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "dooh-plakat-07",
    "title": "DOOH og plakat 07 (DOOH 16:9)",
    "useCase": "Reklamefaglig mal for dooh og plakat med fokus på kjennskap og DOOH.",
    "outputType": "image",
    "domain": "redaksjonell",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "kjennskap. Kanal DOOH. Format 16:9."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "SMB-eier med tidsmangel. Innsikt: Målgruppen velger løsningen som er enklest å forstå på få sekunder."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Prøv gratis."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt i aktiv bruk med tydelig håndgrep og stabil geometri"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Realistisk kontor eller hjemmemiljø med kontrollert bakgrunn"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "50mm, halvnært utsnitt, statisk kamera"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Key 45 grader, myk fill, rim for separasjon"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Budskap i øvre tredel, produkt sentralt, CTA i lavere høyre hjørne"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-d-reklame-kvalitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever image med produksjonsklar struktur for DOOH i 16:9."
      }
    ],
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "dooh-plakat-08",
    "title": "DOOH og plakat 08 (print 4:5)",
    "useCase": "Reklamefaglig mal for dooh og plakat med fokus på konvertering og print.",
    "outputType": "image",
    "domain": "redaksjonell",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "konvertering. Kanal print. Format 4:5."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "Markedsleder med høyt tempo. Innsikt: Tydelig produktnytte slår visuell støy i feed."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Se løsningen."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt i realistisk miljø med synlig funksjon i kontekst"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Nøytral studio-setting med lesbar materialitet"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "35mm, medium shot, rolig dolly-inn"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Hardt key med kontrollert fill og nøytral fargetemperatur"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Produkt i forgrunn, støttebudskap i mellomgrunn, logo i bakgrunn"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-d-reklame-kvalitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever image med produksjonsklar struktur for print i 4:5."
      }
    ],
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "dooh-plakat-09",
    "title": "DOOH og plakat 09 (DOOH banner)",
    "useCase": "Reklamefaglig mal for dooh og plakat med fokus på kjennskap og DOOH.",
    "outputType": "image",
    "domain": "redaksjonell",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "kjennskap. Kanal DOOH. Format banner."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "Innholdsprodusent med publiseringspress. Innsikt: Merkevaren må kjennes igjen før CTA har effekt."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Kontakt oss."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt og avsender i samme bilde for klar avsenderidentitet"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Bymiljø med moderat aktivitet uten å stjele fokus"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "85mm, nærbilde, låst horisont"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Naturlig vinduslys med subtil fill og presis skyggekontroll"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Tydelig visuell hierarki: overskrift, produkt, CTA"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-d-reklame-kvalitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever image med produksjonsklar struktur for DOOH i banner."
      }
    ],
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "dooh-plakat-10",
    "title": "DOOH og plakat 10 (print 16:9)",
    "useCase": "Reklamefaglig mal for dooh og plakat med fokus på konvertering og print.",
    "outputType": "image",
    "domain": "redaksjonell",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "konvertering. Kanal print. Format 16:9."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "SMB-eier med tidsmangel. Innsikt: Målgruppen velger løsningen som er enklest å forstå på få sekunder."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Lær mer."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt i aktiv bruk med tydelig håndgrep og stabil geometri"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Realistisk kontor eller hjemmemiljø med kontrollert bakgrunn"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "50mm, halvnært utsnitt, statisk kamera"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Key 45 grader, myk fill, rim for separasjon"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Budskap i øvre tredel, produkt sentralt, CTA i lavere høyre hjørne"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-d-reklame-kvalitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever image med produksjonsklar struktur for print i 16:9."
      }
    ],
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "dooh-plakat-11",
    "title": "DOOH og plakat 11 (DOOH 4:5)",
    "useCase": "Reklamefaglig mal for dooh og plakat med fokus på kjennskap og DOOH.",
    "outputType": "image",
    "domain": "redaksjonell",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "kjennskap. Kanal DOOH. Format 4:5."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "Markedsleder med høyt tempo. Innsikt: Tydelig produktnytte slår visuell støy i feed."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Bestill demo."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt i realistisk miljø med synlig funksjon i kontekst"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Nøytral studio-setting med lesbar materialitet"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "35mm, medium shot, rolig dolly-inn"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Hardt key med kontrollert fill og nøytral fargetemperatur"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Produkt i forgrunn, støttebudskap i mellomgrunn, logo i bakgrunn"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-d-reklame-kvalitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever image med produksjonsklar struktur for DOOH i 4:5."
      }
    ],
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "dooh-plakat-12",
    "title": "DOOH og plakat 12 (print banner)",
    "useCase": "Reklamefaglig mal for dooh og plakat med fokus på konvertering og print.",
    "outputType": "image",
    "domain": "redaksjonell",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "konvertering. Kanal print. Format banner."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "Innholdsprodusent med publiseringspress. Innsikt: Merkevaren må kjennes igjen før CTA har effekt."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Prøv gratis."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt og avsender i samme bilde for klar avsenderidentitet"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Bymiljø med moderat aktivitet uten å stjele fokus"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "85mm, nærbilde, låst horisont"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Naturlig vinduslys med subtil fill og presis skyggekontroll"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Tydelig visuell hierarki: overskrift, produkt, CTA"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-d-reklame-kvalitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever image med produksjonsklar struktur for print i banner."
      }
    ],
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "dooh-plakat-13",
    "title": "DOOH og plakat 13 (DOOH 16:9)",
    "useCase": "Reklamefaglig mal for dooh og plakat med fokus på kjennskap og DOOH.",
    "outputType": "image",
    "domain": "redaksjonell",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "kjennskap. Kanal DOOH. Format 16:9."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "SMB-eier med tidsmangel. Innsikt: Målgruppen velger løsningen som er enklest å forstå på få sekunder."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Se løsningen."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt i aktiv bruk med tydelig håndgrep og stabil geometri"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Realistisk kontor eller hjemmemiljø med kontrollert bakgrunn"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "50mm, halvnært utsnitt, statisk kamera"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Key 45 grader, myk fill, rim for separasjon"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Budskap i øvre tredel, produkt sentralt, CTA i lavere høyre hjørne"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-d-reklame-kvalitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever image med produksjonsklar struktur for DOOH i 16:9."
      }
    ],
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "dooh-plakat-14",
    "title": "DOOH og plakat 14 (print 4:5)",
    "useCase": "Reklamefaglig mal for dooh og plakat med fokus på konvertering og print.",
    "outputType": "image",
    "domain": "redaksjonell",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "konvertering. Kanal print. Format 4:5."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "Markedsleder med høyt tempo. Innsikt: Tydelig produktnytte slår visuell støy i feed."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Kontakt oss."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt i realistisk miljø med synlig funksjon i kontekst"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Nøytral studio-setting med lesbar materialitet"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "35mm, medium shot, rolig dolly-inn"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Hardt key med kontrollert fill og nøytral fargetemperatur"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Produkt i forgrunn, støttebudskap i mellomgrunn, logo i bakgrunn"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-d-reklame-kvalitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever image med produksjonsklar struktur for print i 4:5."
      }
    ],
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "dooh-plakat-15",
    "title": "DOOH og plakat 15 (DOOH banner)",
    "useCase": "Reklamefaglig mal for dooh og plakat med fokus på kjennskap og DOOH.",
    "outputType": "image",
    "domain": "redaksjonell",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "kjennskap. Kanal DOOH. Format banner."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "Innholdsprodusent med publiseringspress. Innsikt: Merkevaren må kjennes igjen før CTA har effekt."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Lær mer."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt og avsender i samme bilde for klar avsenderidentitet"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Bymiljø med moderat aktivitet uten å stjele fokus"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "85mm, nærbilde, låst horisont"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Naturlig vinduslys med subtil fill og presis skyggekontroll"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Tydelig visuell hierarki: overskrift, produkt, CTA"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-d-reklame-kvalitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever image med produksjonsklar struktur for DOOH i banner."
      }
    ],
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "dooh-plakat-16",
    "title": "DOOH og plakat 16 (print 16:9)",
    "useCase": "Reklamefaglig mal for dooh og plakat med fokus på konvertering og print.",
    "outputType": "image",
    "domain": "redaksjonell",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "konvertering. Kanal print. Format 16:9."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "SMB-eier med tidsmangel. Innsikt: Målgruppen velger løsningen som er enklest å forstå på få sekunder."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Bestill demo."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt i aktiv bruk med tydelig håndgrep og stabil geometri"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Realistisk kontor eller hjemmemiljø med kontrollert bakgrunn"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "50mm, halvnært utsnitt, statisk kamera"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Key 45 grader, myk fill, rim for separasjon"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Budskap i øvre tredel, produkt sentralt, CTA i lavere høyre hjørne"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-d-reklame-kvalitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever image med produksjonsklar struktur for print i 16:9."
      }
    ],
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "dooh-plakat-17",
    "title": "DOOH og plakat 17 (DOOH 4:5)",
    "useCase": "Reklamefaglig mal for dooh og plakat med fokus på kjennskap og DOOH.",
    "outputType": "image",
    "domain": "redaksjonell",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "kjennskap. Kanal DOOH. Format 4:5."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "Markedsleder med høyt tempo. Innsikt: Tydelig produktnytte slår visuell støy i feed."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Prøv gratis."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt i realistisk miljø med synlig funksjon i kontekst"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Nøytral studio-setting med lesbar materialitet"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "35mm, medium shot, rolig dolly-inn"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Hardt key med kontrollert fill og nøytral fargetemperatur"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Produkt i forgrunn, støttebudskap i mellomgrunn, logo i bakgrunn"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-d-reklame-kvalitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever image med produksjonsklar struktur for DOOH i 4:5."
      }
    ],
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "dooh-plakat-18",
    "title": "DOOH og plakat 18 (print banner)",
    "useCase": "Reklamefaglig mal for dooh og plakat med fokus på konvertering og print.",
    "outputType": "image",
    "domain": "redaksjonell",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "konvertering. Kanal print. Format banner."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "Innholdsprodusent med publiseringspress. Innsikt: Merkevaren må kjennes igjen før CTA har effekt."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Se løsningen."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt og avsender i samme bilde for klar avsenderidentitet"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Bymiljø med moderat aktivitet uten å stjele fokus"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "85mm, nærbilde, låst horisont"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Naturlig vinduslys med subtil fill og presis skyggekontroll"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Tydelig visuell hierarki: overskrift, produkt, CTA"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-d-reklame-kvalitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever image med produksjonsklar struktur for print i banner."
      }
    ],
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "dooh-plakat-19",
    "title": "DOOH og plakat 19 (DOOH 16:9)",
    "useCase": "Reklamefaglig mal for dooh og plakat med fokus på kjennskap og DOOH.",
    "outputType": "image",
    "domain": "redaksjonell",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "kjennskap. Kanal DOOH. Format 16:9."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "SMB-eier med tidsmangel. Innsikt: Målgruppen velger løsningen som er enklest å forstå på få sekunder."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Kontakt oss."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt i aktiv bruk med tydelig håndgrep og stabil geometri"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Realistisk kontor eller hjemmemiljø med kontrollert bakgrunn"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "50mm, halvnært utsnitt, statisk kamera"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Key 45 grader, myk fill, rim for separasjon"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Budskap i øvre tredel, produkt sentralt, CTA i lavere høyre hjørne"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-d-reklame-kvalitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever image med produksjonsklar struktur for DOOH i 16:9."
      }
    ],
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "dooh-plakat-20",
    "title": "DOOH og plakat 20 (print 4:5)",
    "useCase": "Reklamefaglig mal for dooh og plakat med fokus på konvertering og print.",
    "outputType": "image",
    "domain": "redaksjonell",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "konvertering. Kanal print. Format 4:5."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "Markedsleder med høyt tempo. Innsikt: Tydelig produktnytte slår visuell støy i feed."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Lær mer."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt i realistisk miljø med synlig funksjon i kontekst"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Nøytral studio-setting med lesbar materialitet"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "35mm, medium shot, rolig dolly-inn"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Hardt key med kontrollert fill og nøytral fargetemperatur"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Produkt i forgrunn, støttebudskap i mellomgrunn, logo i bakgrunn"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-d-reklame-kvalitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever image med produksjonsklar struktur for print i 4:5."
      }
    ],
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "produkt-still-01",
    "title": "Produktreklame still 01 (web 1:1)",
    "useCase": "Reklamefaglig mal for produktreklame still med fokus på kjennskap og web.",
    "outputType": "image",
    "domain": "produkt",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "kjennskap. Kanal web. Format 1:1."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "SMB-eier med tidsmangel. Innsikt: Målgruppen velger løsningen som er enklest å forstå på få sekunder."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Bestill demo."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt i aktiv bruk med tydelig håndgrep og stabil geometri"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Realistisk kontor eller hjemmemiljø med kontrollert bakgrunn"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "50mm, halvnært utsnitt, statisk kamera"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Key 45 grader, myk fill, rim for separasjon"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Budskap i øvre tredel, produkt sentralt, CTA i lavere høyre hjørne"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-b-anti-ai-look"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever image med produksjonsklar struktur for web i 1:1."
      }
    ],
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "produkt-still-02",
    "title": "Produktreklame still 02 (print 4:5)",
    "useCase": "Reklamefaglig mal for produktreklame still med fokus på konvertering og print.",
    "outputType": "image",
    "domain": "produkt",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "konvertering. Kanal print. Format 4:5."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "Markedsleder med høyt tempo. Innsikt: Tydelig produktnytte slår visuell støy i feed."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Prøv gratis."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt i realistisk miljø med synlig funksjon i kontekst"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Nøytral studio-setting med lesbar materialitet"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "35mm, medium shot, rolig dolly-inn"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Hardt key med kontrollert fill og nøytral fargetemperatur"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Produkt i forgrunn, støttebudskap i mellomgrunn, logo i bakgrunn"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-b-anti-ai-look"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever image med produksjonsklar struktur for print i 4:5."
      }
    ],
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "produkt-still-03",
    "title": "Produktreklame still 03 (DOOH 16:9)",
    "useCase": "Reklamefaglig mal for produktreklame still med fokus på kjennskap og DOOH.",
    "outputType": "image",
    "domain": "produkt",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "kjennskap. Kanal DOOH. Format 16:9."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "Innholdsprodusent med publiseringspress. Innsikt: Merkevaren må kjennes igjen før CTA har effekt."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Se løsningen."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt og avsender i samme bilde for klar avsenderidentitet"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Bymiljø med moderat aktivitet uten å stjele fokus"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "85mm, nærbilde, låst horisont"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Naturlig vinduslys med subtil fill og presis skyggekontroll"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Tydelig visuell hierarki: overskrift, produkt, CTA"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-b-anti-ai-look"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever image med produksjonsklar struktur for DOOH i 16:9."
      }
    ],
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "produkt-still-04",
    "title": "Produktreklame still 04 (SoMe banner)",
    "useCase": "Reklamefaglig mal for produktreklame still med fokus på konvertering og SoMe.",
    "outputType": "image",
    "domain": "produkt",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "konvertering. Kanal SoMe. Format banner."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "SMB-eier med tidsmangel. Innsikt: Målgruppen velger løsningen som er enklest å forstå på få sekunder."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Kontakt oss."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt i aktiv bruk med tydelig håndgrep og stabil geometri"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Realistisk kontor eller hjemmemiljø med kontrollert bakgrunn"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "50mm, halvnært utsnitt, statisk kamera"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Key 45 grader, myk fill, rim for separasjon"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Budskap i øvre tredel, produkt sentralt, CTA i lavere høyre hjørne"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-b-anti-ai-look"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever image med produksjonsklar struktur for SoMe i banner."
      }
    ],
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "produkt-still-05",
    "title": "Produktreklame still 05 (web 1:1)",
    "useCase": "Reklamefaglig mal for produktreklame still med fokus på kjennskap og web.",
    "outputType": "image",
    "domain": "produkt",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "kjennskap. Kanal web. Format 1:1."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "Markedsleder med høyt tempo. Innsikt: Tydelig produktnytte slår visuell støy i feed."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Lær mer."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt i realistisk miljø med synlig funksjon i kontekst"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Nøytral studio-setting med lesbar materialitet"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "35mm, medium shot, rolig dolly-inn"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Hardt key med kontrollert fill og nøytral fargetemperatur"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Produkt i forgrunn, støttebudskap i mellomgrunn, logo i bakgrunn"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-b-anti-ai-look"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever image med produksjonsklar struktur for web i 1:1."
      }
    ],
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "produkt-still-06",
    "title": "Produktreklame still 06 (print 4:5)",
    "useCase": "Reklamefaglig mal for produktreklame still med fokus på konvertering og print.",
    "outputType": "image",
    "domain": "produkt",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "konvertering. Kanal print. Format 4:5."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "Innholdsprodusent med publiseringspress. Innsikt: Merkevaren må kjennes igjen før CTA har effekt."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Bestill demo."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt og avsender i samme bilde for klar avsenderidentitet"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Bymiljø med moderat aktivitet uten å stjele fokus"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "85mm, nærbilde, låst horisont"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Naturlig vinduslys med subtil fill og presis skyggekontroll"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Tydelig visuell hierarki: overskrift, produkt, CTA"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-b-anti-ai-look"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever image med produksjonsklar struktur for print i 4:5."
      }
    ],
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "produkt-still-07",
    "title": "Produktreklame still 07 (DOOH 16:9)",
    "useCase": "Reklamefaglig mal for produktreklame still med fokus på kjennskap og DOOH.",
    "outputType": "image",
    "domain": "produkt",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "kjennskap. Kanal DOOH. Format 16:9."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "SMB-eier med tidsmangel. Innsikt: Målgruppen velger løsningen som er enklest å forstå på få sekunder."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Prøv gratis."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt i aktiv bruk med tydelig håndgrep og stabil geometri"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Realistisk kontor eller hjemmemiljø med kontrollert bakgrunn"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "50mm, halvnært utsnitt, statisk kamera"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Key 45 grader, myk fill, rim for separasjon"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Budskap i øvre tredel, produkt sentralt, CTA i lavere høyre hjørne"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-b-anti-ai-look"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever image med produksjonsklar struktur for DOOH i 16:9."
      }
    ],
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "produkt-still-08",
    "title": "Produktreklame still 08 (SoMe banner)",
    "useCase": "Reklamefaglig mal for produktreklame still med fokus på konvertering og SoMe.",
    "outputType": "image",
    "domain": "produkt",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "konvertering. Kanal SoMe. Format banner."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "Markedsleder med høyt tempo. Innsikt: Tydelig produktnytte slår visuell støy i feed."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Se løsningen."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt i realistisk miljø med synlig funksjon i kontekst"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Nøytral studio-setting med lesbar materialitet"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "35mm, medium shot, rolig dolly-inn"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Hardt key med kontrollert fill og nøytral fargetemperatur"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Produkt i forgrunn, støttebudskap i mellomgrunn, logo i bakgrunn"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-b-anti-ai-look"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever image med produksjonsklar struktur for SoMe i banner."
      }
    ],
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "produkt-still-09",
    "title": "Produktreklame still 09 (web 1:1)",
    "useCase": "Reklamefaglig mal for produktreklame still med fokus på kjennskap og web.",
    "outputType": "image",
    "domain": "produkt",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "kjennskap. Kanal web. Format 1:1."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "Innholdsprodusent med publiseringspress. Innsikt: Merkevaren må kjennes igjen før CTA har effekt."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Kontakt oss."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt og avsender i samme bilde for klar avsenderidentitet"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Bymiljø med moderat aktivitet uten å stjele fokus"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "85mm, nærbilde, låst horisont"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Naturlig vinduslys med subtil fill og presis skyggekontroll"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Tydelig visuell hierarki: overskrift, produkt, CTA"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-b-anti-ai-look"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever image med produksjonsklar struktur for web i 1:1."
      }
    ],
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "produkt-still-10",
    "title": "Produktreklame still 10 (print 4:5)",
    "useCase": "Reklamefaglig mal for produktreklame still med fokus på konvertering og print.",
    "outputType": "image",
    "domain": "produkt",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "konvertering. Kanal print. Format 4:5."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "SMB-eier med tidsmangel. Innsikt: Målgruppen velger løsningen som er enklest å forstå på få sekunder."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Lær mer."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt i aktiv bruk med tydelig håndgrep og stabil geometri"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Realistisk kontor eller hjemmemiljø med kontrollert bakgrunn"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "50mm, halvnært utsnitt, statisk kamera"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Key 45 grader, myk fill, rim for separasjon"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Budskap i øvre tredel, produkt sentralt, CTA i lavere høyre hjørne"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-b-anti-ai-look"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever image med produksjonsklar struktur for print i 4:5."
      }
    ],
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "produkt-still-11",
    "title": "Produktreklame still 11 (DOOH 16:9)",
    "useCase": "Reklamefaglig mal for produktreklame still med fokus på kjennskap og DOOH.",
    "outputType": "image",
    "domain": "produkt",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "kjennskap. Kanal DOOH. Format 16:9."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "Markedsleder med høyt tempo. Innsikt: Tydelig produktnytte slår visuell støy i feed."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Bestill demo."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt i realistisk miljø med synlig funksjon i kontekst"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Nøytral studio-setting med lesbar materialitet"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "35mm, medium shot, rolig dolly-inn"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Hardt key med kontrollert fill og nøytral fargetemperatur"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Produkt i forgrunn, støttebudskap i mellomgrunn, logo i bakgrunn"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-b-anti-ai-look"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever image med produksjonsklar struktur for DOOH i 16:9."
      }
    ],
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "produkt-still-12",
    "title": "Produktreklame still 12 (SoMe banner)",
    "useCase": "Reklamefaglig mal for produktreklame still med fokus på konvertering og SoMe.",
    "outputType": "image",
    "domain": "produkt",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "konvertering. Kanal SoMe. Format banner."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "Innholdsprodusent med publiseringspress. Innsikt: Merkevaren må kjennes igjen før CTA har effekt."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Prøv gratis."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt og avsender i samme bilde for klar avsenderidentitet"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Bymiljø med moderat aktivitet uten å stjele fokus"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "85mm, nærbilde, låst horisont"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Naturlig vinduslys med subtil fill og presis skyggekontroll"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Tydelig visuell hierarki: overskrift, produkt, CTA"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-b-anti-ai-look"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever image med produksjonsklar struktur for SoMe i banner."
      }
    ],
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "produkt-still-13",
    "title": "Produktreklame still 13 (web 1:1)",
    "useCase": "Reklamefaglig mal for produktreklame still med fokus på kjennskap og web.",
    "outputType": "image",
    "domain": "produkt",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "kjennskap. Kanal web. Format 1:1."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "SMB-eier med tidsmangel. Innsikt: Målgruppen velger løsningen som er enklest å forstå på få sekunder."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Se løsningen."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt i aktiv bruk med tydelig håndgrep og stabil geometri"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Realistisk kontor eller hjemmemiljø med kontrollert bakgrunn"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "50mm, halvnært utsnitt, statisk kamera"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Key 45 grader, myk fill, rim for separasjon"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Budskap i øvre tredel, produkt sentralt, CTA i lavere høyre hjørne"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-b-anti-ai-look"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever image med produksjonsklar struktur for web i 1:1."
      }
    ],
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "produkt-still-14",
    "title": "Produktreklame still 14 (print 4:5)",
    "useCase": "Reklamefaglig mal for produktreklame still med fokus på konvertering og print.",
    "outputType": "image",
    "domain": "produkt",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "konvertering. Kanal print. Format 4:5."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "Markedsleder med høyt tempo. Innsikt: Tydelig produktnytte slår visuell støy i feed."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Kontakt oss."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt i realistisk miljø med synlig funksjon i kontekst"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Nøytral studio-setting med lesbar materialitet"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "35mm, medium shot, rolig dolly-inn"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Hardt key med kontrollert fill og nøytral fargetemperatur"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Produkt i forgrunn, støttebudskap i mellomgrunn, logo i bakgrunn"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-b-anti-ai-look"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever image med produksjonsklar struktur for print i 4:5."
      }
    ],
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "produkt-still-15",
    "title": "Produktreklame still 15 (DOOH 16:9)",
    "useCase": "Reklamefaglig mal for produktreklame still med fokus på kjennskap og DOOH.",
    "outputType": "image",
    "domain": "produkt",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "kjennskap. Kanal DOOH. Format 16:9."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "Innholdsprodusent med publiseringspress. Innsikt: Merkevaren må kjennes igjen før CTA har effekt."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Lær mer."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt og avsender i samme bilde for klar avsenderidentitet"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Bymiljø med moderat aktivitet uten å stjele fokus"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "85mm, nærbilde, låst horisont"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Naturlig vinduslys med subtil fill og presis skyggekontroll"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Tydelig visuell hierarki: overskrift, produkt, CTA"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-b-anti-ai-look"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever image med produksjonsklar struktur for DOOH i 16:9."
      }
    ],
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "produkt-still-16",
    "title": "Produktreklame still 16 (SoMe banner)",
    "useCase": "Reklamefaglig mal for produktreklame still med fokus på konvertering og SoMe.",
    "outputType": "image",
    "domain": "produkt",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "konvertering. Kanal SoMe. Format banner."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "SMB-eier med tidsmangel. Innsikt: Målgruppen velger løsningen som er enklest å forstå på få sekunder."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Bestill demo."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt i aktiv bruk med tydelig håndgrep og stabil geometri"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Realistisk kontor eller hjemmemiljø med kontrollert bakgrunn"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "50mm, halvnært utsnitt, statisk kamera"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Key 45 grader, myk fill, rim for separasjon"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Budskap i øvre tredel, produkt sentralt, CTA i lavere høyre hjørne"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-b-anti-ai-look"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever image med produksjonsklar struktur for SoMe i banner."
      }
    ],
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "produkt-still-17",
    "title": "Produktreklame still 17 (web 1:1)",
    "useCase": "Reklamefaglig mal for produktreklame still med fokus på kjennskap og web.",
    "outputType": "image",
    "domain": "produkt",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "kjennskap. Kanal web. Format 1:1."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "Markedsleder med høyt tempo. Innsikt: Tydelig produktnytte slår visuell støy i feed."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Prøv gratis."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt i realistisk miljø med synlig funksjon i kontekst"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Nøytral studio-setting med lesbar materialitet"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "35mm, medium shot, rolig dolly-inn"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Hardt key med kontrollert fill og nøytral fargetemperatur"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Produkt i forgrunn, støttebudskap i mellomgrunn, logo i bakgrunn"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-b-anti-ai-look"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever image med produksjonsklar struktur for web i 1:1."
      }
    ],
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "produkt-still-18",
    "title": "Produktreklame still 18 (print 4:5)",
    "useCase": "Reklamefaglig mal for produktreklame still med fokus på konvertering og print.",
    "outputType": "image",
    "domain": "produkt",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "konvertering. Kanal print. Format 4:5."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "Innholdsprodusent med publiseringspress. Innsikt: Merkevaren må kjennes igjen før CTA har effekt."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Se løsningen."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt og avsender i samme bilde for klar avsenderidentitet"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Bymiljø med moderat aktivitet uten å stjele fokus"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "85mm, nærbilde, låst horisont"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Naturlig vinduslys med subtil fill og presis skyggekontroll"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Tydelig visuell hierarki: overskrift, produkt, CTA"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-b-anti-ai-look"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever image med produksjonsklar struktur for print i 4:5."
      }
    ],
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "produkt-still-19",
    "title": "Produktreklame still 19 (DOOH 16:9)",
    "useCase": "Reklamefaglig mal for produktreklame still med fokus på kjennskap og DOOH.",
    "outputType": "image",
    "domain": "produkt",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "kjennskap. Kanal DOOH. Format 16:9."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "SMB-eier med tidsmangel. Innsikt: Målgruppen velger løsningen som er enklest å forstå på få sekunder."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Kontakt oss."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt i aktiv bruk med tydelig håndgrep og stabil geometri"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Realistisk kontor eller hjemmemiljø med kontrollert bakgrunn"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "50mm, halvnært utsnitt, statisk kamera"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Key 45 grader, myk fill, rim for separasjon"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Budskap i øvre tredel, produkt sentralt, CTA i lavere høyre hjørne"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-b-anti-ai-look"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever image med produksjonsklar struktur for DOOH i 16:9."
      }
    ],
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "produkt-still-20",
    "title": "Produktreklame still 20 (SoMe banner)",
    "useCase": "Reklamefaglig mal for produktreklame still med fokus på konvertering og SoMe.",
    "outputType": "image",
    "domain": "produkt",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "konvertering. Kanal SoMe. Format banner."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "Markedsleder med høyt tempo. Innsikt: Tydelig produktnytte slår visuell støy i feed."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Lær mer."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt i realistisk miljø med synlig funksjon i kontekst"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Nøytral studio-setting med lesbar materialitet"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "35mm, medium shot, rolig dolly-inn"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Hardt key med kontrollert fill og nøytral fargetemperatur"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Produkt i forgrunn, støttebudskap i mellomgrunn, logo i bakgrunn"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-b-anti-ai-look"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever image med produksjonsklar struktur for SoMe i banner."
      }
    ],
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "produkt-video-01",
    "title": "Produktreklame video 01 (SoMe 9:16)",
    "useCase": "Reklamefaglig mal for produktreklame video med fokus på engasjement og SoMe.",
    "outputType": "video",
    "domain": "film-vfx",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "engasjement. Kanal SoMe. Format 9:16."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "SMB-eier med tidsmangel. Innsikt: Målgruppen velger løsningen som er enklest å forstå på få sekunder."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Bestill demo."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt i aktiv bruk med tydelig håndgrep og stabil geometri"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Realistisk kontor eller hjemmemiljø med kontrollert bakgrunn"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "50mm, halvnært utsnitt, statisk kamera"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Key 45 grader, myk fill, rim for separasjon"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Budskap i øvre tredel, produkt sentralt, CTA i lavere høyre hjørne"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-c-video-kontinuitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever video med produksjonsklar struktur for SoMe i 9:16."
      }
    ],
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "produkt-video-02",
    "title": "Produktreklame video 02 (TV 16:9)",
    "useCase": "Reklamefaglig mal for produktreklame video med fokus på konvertering og TV.",
    "outputType": "video",
    "domain": "film-vfx",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "konvertering. Kanal TV. Format 16:9."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "Markedsleder med høyt tempo. Innsikt: Tydelig produktnytte slår visuell støy i feed."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Prøv gratis."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt i realistisk miljø med synlig funksjon i kontekst"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Nøytral studio-setting med lesbar materialitet"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "35mm, medium shot, rolig dolly-inn"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Hardt key med kontrollert fill og nøytral fargetemperatur"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Produkt i forgrunn, støttebudskap i mellomgrunn, logo i bakgrunn"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-c-video-kontinuitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever video med produksjonsklar struktur for TV i 16:9."
      }
    ],
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "produkt-video-03",
    "title": "Produktreklame video 03 (web 1:1)",
    "useCase": "Reklamefaglig mal for produktreklame video med fokus på engasjement og web.",
    "outputType": "video",
    "domain": "film-vfx",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "engasjement. Kanal web. Format 1:1."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "Innholdsprodusent med publiseringspress. Innsikt: Merkevaren må kjennes igjen før CTA har effekt."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Se løsningen."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt og avsender i samme bilde for klar avsenderidentitet"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Bymiljø med moderat aktivitet uten å stjele fokus"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "85mm, nærbilde, låst horisont"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Naturlig vinduslys med subtil fill og presis skyggekontroll"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Tydelig visuell hierarki: overskrift, produkt, CTA"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-c-video-kontinuitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever video med produksjonsklar struktur for web i 1:1."
      }
    ],
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "produkt-video-04",
    "title": "Produktreklame video 04 (SoMe 9:16)",
    "useCase": "Reklamefaglig mal for produktreklame video med fokus på konvertering og SoMe.",
    "outputType": "video",
    "domain": "film-vfx",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "konvertering. Kanal SoMe. Format 9:16."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "SMB-eier med tidsmangel. Innsikt: Målgruppen velger løsningen som er enklest å forstå på få sekunder."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Kontakt oss."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt i aktiv bruk med tydelig håndgrep og stabil geometri"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Realistisk kontor eller hjemmemiljø med kontrollert bakgrunn"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "50mm, halvnært utsnitt, statisk kamera"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Key 45 grader, myk fill, rim for separasjon"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Budskap i øvre tredel, produkt sentralt, CTA i lavere høyre hjørne"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-c-video-kontinuitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever video med produksjonsklar struktur for SoMe i 9:16."
      }
    ],
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "produkt-video-05",
    "title": "Produktreklame video 05 (TV 16:9)",
    "useCase": "Reklamefaglig mal for produktreklame video med fokus på engasjement og TV.",
    "outputType": "video",
    "domain": "film-vfx",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "engasjement. Kanal TV. Format 16:9."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "Markedsleder med høyt tempo. Innsikt: Tydelig produktnytte slår visuell støy i feed."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Lær mer."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt i realistisk miljø med synlig funksjon i kontekst"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Nøytral studio-setting med lesbar materialitet"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "35mm, medium shot, rolig dolly-inn"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Hardt key med kontrollert fill og nøytral fargetemperatur"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Produkt i forgrunn, støttebudskap i mellomgrunn, logo i bakgrunn"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-c-video-kontinuitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever video med produksjonsklar struktur for TV i 16:9."
      }
    ],
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "produkt-video-06",
    "title": "Produktreklame video 06 (web 1:1)",
    "useCase": "Reklamefaglig mal for produktreklame video med fokus på konvertering og web.",
    "outputType": "video",
    "domain": "film-vfx",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "konvertering. Kanal web. Format 1:1."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "Innholdsprodusent med publiseringspress. Innsikt: Merkevaren må kjennes igjen før CTA har effekt."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Bestill demo."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt og avsender i samme bilde for klar avsenderidentitet"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Bymiljø med moderat aktivitet uten å stjele fokus"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "85mm, nærbilde, låst horisont"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Naturlig vinduslys med subtil fill og presis skyggekontroll"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Tydelig visuell hierarki: overskrift, produkt, CTA"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-c-video-kontinuitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever video med produksjonsklar struktur for web i 1:1."
      }
    ],
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "produkt-video-07",
    "title": "Produktreklame video 07 (SoMe 9:16)",
    "useCase": "Reklamefaglig mal for produktreklame video med fokus på engasjement og SoMe.",
    "outputType": "video",
    "domain": "film-vfx",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "engasjement. Kanal SoMe. Format 9:16."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "SMB-eier med tidsmangel. Innsikt: Målgruppen velger løsningen som er enklest å forstå på få sekunder."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Prøv gratis."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt i aktiv bruk med tydelig håndgrep og stabil geometri"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Realistisk kontor eller hjemmemiljø med kontrollert bakgrunn"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "50mm, halvnært utsnitt, statisk kamera"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Key 45 grader, myk fill, rim for separasjon"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Budskap i øvre tredel, produkt sentralt, CTA i lavere høyre hjørne"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-c-video-kontinuitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever video med produksjonsklar struktur for SoMe i 9:16."
      }
    ],
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "produkt-video-08",
    "title": "Produktreklame video 08 (TV 16:9)",
    "useCase": "Reklamefaglig mal for produktreklame video med fokus på konvertering og TV.",
    "outputType": "video",
    "domain": "film-vfx",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "konvertering. Kanal TV. Format 16:9."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "Markedsleder med høyt tempo. Innsikt: Tydelig produktnytte slår visuell støy i feed."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Se løsningen."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt i realistisk miljø med synlig funksjon i kontekst"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Nøytral studio-setting med lesbar materialitet"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "35mm, medium shot, rolig dolly-inn"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Hardt key med kontrollert fill og nøytral fargetemperatur"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Produkt i forgrunn, støttebudskap i mellomgrunn, logo i bakgrunn"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-c-video-kontinuitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever video med produksjonsklar struktur for TV i 16:9."
      }
    ],
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "produkt-video-09",
    "title": "Produktreklame video 09 (web 1:1)",
    "useCase": "Reklamefaglig mal for produktreklame video med fokus på engasjement og web.",
    "outputType": "video",
    "domain": "film-vfx",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "engasjement. Kanal web. Format 1:1."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "Innholdsprodusent med publiseringspress. Innsikt: Merkevaren må kjennes igjen før CTA har effekt."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Kontakt oss."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt og avsender i samme bilde for klar avsenderidentitet"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Bymiljø med moderat aktivitet uten å stjele fokus"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "85mm, nærbilde, låst horisont"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Naturlig vinduslys med subtil fill og presis skyggekontroll"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Tydelig visuell hierarki: overskrift, produkt, CTA"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-c-video-kontinuitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever video med produksjonsklar struktur for web i 1:1."
      }
    ],
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "produkt-video-10",
    "title": "Produktreklame video 10 (SoMe 9:16)",
    "useCase": "Reklamefaglig mal for produktreklame video med fokus på konvertering og SoMe.",
    "outputType": "video",
    "domain": "film-vfx",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "konvertering. Kanal SoMe. Format 9:16."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "SMB-eier med tidsmangel. Innsikt: Målgruppen velger løsningen som er enklest å forstå på få sekunder."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Lær mer."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt i aktiv bruk med tydelig håndgrep og stabil geometri"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Realistisk kontor eller hjemmemiljø med kontrollert bakgrunn"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "50mm, halvnært utsnitt, statisk kamera"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Key 45 grader, myk fill, rim for separasjon"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Budskap i øvre tredel, produkt sentralt, CTA i lavere høyre hjørne"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-c-video-kontinuitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever video med produksjonsklar struktur for SoMe i 9:16."
      }
    ],
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "produkt-video-11",
    "title": "Produktreklame video 11 (TV 16:9)",
    "useCase": "Reklamefaglig mal for produktreklame video med fokus på engasjement og TV.",
    "outputType": "video",
    "domain": "film-vfx",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "engasjement. Kanal TV. Format 16:9."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "Markedsleder med høyt tempo. Innsikt: Tydelig produktnytte slår visuell støy i feed."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Bestill demo."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt i realistisk miljø med synlig funksjon i kontekst"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Nøytral studio-setting med lesbar materialitet"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "35mm, medium shot, rolig dolly-inn"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Hardt key med kontrollert fill og nøytral fargetemperatur"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Produkt i forgrunn, støttebudskap i mellomgrunn, logo i bakgrunn"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-c-video-kontinuitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever video med produksjonsklar struktur for TV i 16:9."
      }
    ],
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "produkt-video-12",
    "title": "Produktreklame video 12 (web 1:1)",
    "useCase": "Reklamefaglig mal for produktreklame video med fokus på konvertering og web.",
    "outputType": "video",
    "domain": "film-vfx",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "konvertering. Kanal web. Format 1:1."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "Innholdsprodusent med publiseringspress. Innsikt: Merkevaren må kjennes igjen før CTA har effekt."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Prøv gratis."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt og avsender i samme bilde for klar avsenderidentitet"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Bymiljø med moderat aktivitet uten å stjele fokus"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "85mm, nærbilde, låst horisont"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Naturlig vinduslys med subtil fill og presis skyggekontroll"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Tydelig visuell hierarki: overskrift, produkt, CTA"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-c-video-kontinuitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever video med produksjonsklar struktur for web i 1:1."
      }
    ],
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "produkt-video-13",
    "title": "Produktreklame video 13 (SoMe 9:16)",
    "useCase": "Reklamefaglig mal for produktreklame video med fokus på engasjement og SoMe.",
    "outputType": "video",
    "domain": "film-vfx",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "engasjement. Kanal SoMe. Format 9:16."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "SMB-eier med tidsmangel. Innsikt: Målgruppen velger løsningen som er enklest å forstå på få sekunder."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Se løsningen."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt i aktiv bruk med tydelig håndgrep og stabil geometri"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Realistisk kontor eller hjemmemiljø med kontrollert bakgrunn"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "50mm, halvnært utsnitt, statisk kamera"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Key 45 grader, myk fill, rim for separasjon"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Budskap i øvre tredel, produkt sentralt, CTA i lavere høyre hjørne"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-c-video-kontinuitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever video med produksjonsklar struktur for SoMe i 9:16."
      }
    ],
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "produkt-video-14",
    "title": "Produktreklame video 14 (TV 16:9)",
    "useCase": "Reklamefaglig mal for produktreklame video med fokus på konvertering og TV.",
    "outputType": "video",
    "domain": "film-vfx",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "konvertering. Kanal TV. Format 16:9."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "Markedsleder med høyt tempo. Innsikt: Tydelig produktnytte slår visuell støy i feed."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Kontakt oss."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt i realistisk miljø med synlig funksjon i kontekst"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Nøytral studio-setting med lesbar materialitet"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "35mm, medium shot, rolig dolly-inn"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Hardt key med kontrollert fill og nøytral fargetemperatur"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Produkt i forgrunn, støttebudskap i mellomgrunn, logo i bakgrunn"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-c-video-kontinuitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever video med produksjonsklar struktur for TV i 16:9."
      }
    ],
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "produkt-video-15",
    "title": "Produktreklame video 15 (web 1:1)",
    "useCase": "Reklamefaglig mal for produktreklame video med fokus på engasjement og web.",
    "outputType": "video",
    "domain": "film-vfx",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "engasjement. Kanal web. Format 1:1."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "Innholdsprodusent med publiseringspress. Innsikt: Merkevaren må kjennes igjen før CTA har effekt."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Lær mer."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt og avsender i samme bilde for klar avsenderidentitet"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Bymiljø med moderat aktivitet uten å stjele fokus"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "85mm, nærbilde, låst horisont"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Naturlig vinduslys med subtil fill og presis skyggekontroll"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Tydelig visuell hierarki: overskrift, produkt, CTA"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-c-video-kontinuitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever video med produksjonsklar struktur for web i 1:1."
      }
    ],
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "produkt-video-16",
    "title": "Produktreklame video 16 (SoMe 9:16)",
    "useCase": "Reklamefaglig mal for produktreklame video med fokus på konvertering og SoMe.",
    "outputType": "video",
    "domain": "film-vfx",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "konvertering. Kanal SoMe. Format 9:16."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "SMB-eier med tidsmangel. Innsikt: Målgruppen velger løsningen som er enklest å forstå på få sekunder."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Bestill demo."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt i aktiv bruk med tydelig håndgrep og stabil geometri"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Realistisk kontor eller hjemmemiljø med kontrollert bakgrunn"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "50mm, halvnært utsnitt, statisk kamera"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Key 45 grader, myk fill, rim for separasjon"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Budskap i øvre tredel, produkt sentralt, CTA i lavere høyre hjørne"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-c-video-kontinuitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever video med produksjonsklar struktur for SoMe i 9:16."
      }
    ],
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "produkt-video-17",
    "title": "Produktreklame video 17 (TV 16:9)",
    "useCase": "Reklamefaglig mal for produktreklame video med fokus på engasjement og TV.",
    "outputType": "video",
    "domain": "film-vfx",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "engasjement. Kanal TV. Format 16:9."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "Markedsleder med høyt tempo. Innsikt: Tydelig produktnytte slår visuell støy i feed."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Prøv gratis."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt i realistisk miljø med synlig funksjon i kontekst"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Nøytral studio-setting med lesbar materialitet"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "35mm, medium shot, rolig dolly-inn"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Hardt key med kontrollert fill og nøytral fargetemperatur"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Produkt i forgrunn, støttebudskap i mellomgrunn, logo i bakgrunn"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-c-video-kontinuitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever video med produksjonsklar struktur for TV i 16:9."
      }
    ],
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "produkt-video-18",
    "title": "Produktreklame video 18 (web 1:1)",
    "useCase": "Reklamefaglig mal for produktreklame video med fokus på konvertering og web.",
    "outputType": "video",
    "domain": "film-vfx",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "konvertering. Kanal web. Format 1:1."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "Innholdsprodusent med publiseringspress. Innsikt: Merkevaren må kjennes igjen før CTA har effekt."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Se løsningen."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt og avsender i samme bilde for klar avsenderidentitet"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Bymiljø med moderat aktivitet uten å stjele fokus"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "85mm, nærbilde, låst horisont"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Naturlig vinduslys med subtil fill og presis skyggekontroll"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Tydelig visuell hierarki: overskrift, produkt, CTA"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-c-video-kontinuitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever video med produksjonsklar struktur for web i 1:1."
      }
    ],
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "produkt-video-19",
    "title": "Produktreklame video 19 (SoMe 9:16)",
    "useCase": "Reklamefaglig mal for produktreklame video med fokus på engasjement og SoMe.",
    "outputType": "video",
    "domain": "film-vfx",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "engasjement. Kanal SoMe. Format 9:16."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "SMB-eier med tidsmangel. Innsikt: Målgruppen velger løsningen som er enklest å forstå på få sekunder."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Kontakt oss."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt i aktiv bruk med tydelig håndgrep og stabil geometri"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Realistisk kontor eller hjemmemiljø med kontrollert bakgrunn"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "50mm, halvnært utsnitt, statisk kamera"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Key 45 grader, myk fill, rim for separasjon"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Budskap i øvre tredel, produkt sentralt, CTA i lavere høyre hjørne"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-c-video-kontinuitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever video med produksjonsklar struktur for SoMe i 9:16."
      }
    ],
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "produkt-video-20",
    "title": "Produktreklame video 20 (TV 16:9)",
    "useCase": "Reklamefaglig mal for produktreklame video med fokus på konvertering og TV.",
    "outputType": "video",
    "domain": "film-vfx",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "konvertering. Kanal TV. Format 16:9."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "Markedsleder med høyt tempo. Innsikt: Tydelig produktnytte slår visuell støy i feed."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Lær mer."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt i realistisk miljø med synlig funksjon i kontekst"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Nøytral studio-setting med lesbar materialitet"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "35mm, medium shot, rolig dolly-inn"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Hardt key med kontrollert fill og nøytral fargetemperatur"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Produkt i forgrunn, støttebudskap i mellomgrunn, logo i bakgrunn"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-c-video-kontinuitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever video med produksjonsklar struktur for TV i 16:9."
      }
    ],
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "skolepakke-oppgave-01",
    "title": "Skolepakke: Produktbrief 9:16",
    "useCase": "Oppgave: bygg en komplett produktprompt for SoMe-video.",
    "outputType": "video",
    "domain": "sosiale-medier",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "konvertering. Kanal SoMe. Format 9:16."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "Student eller junior kreatør. Innsikt: Øvelser med tydelig fasit gir rask læring.."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Løs oppgaven med konkret produksjonskontroll.. CTA: Lever promptutkast."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Oppgaven skal beskrive motiv og produkt med låste elementer."
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Bruk realistisk kontekst tilpasset kanal."
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "Kamera og utsnitt skal støtte budskap og format."
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Lysvalg skal være fysisk plausibelt og konsistent."
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Hierarki: overskrift, produkt, CTA."
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Brand lock, text lock og product lock skal vurderes eksplisitt."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen logo-deformasjon, ingen geometriavvik."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-d-reklame-kvalitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever video med produksjonsklar struktur for SoMe i 9:16."
      }
    ],
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-04-definer-budskaphierarki",
      "reklame-standard-15-kameradata-skal-vaere-konkrete",
      "reklame-standard-29-ingen-feil-produktgeometri"
    ]
  },
  {
    "id": "skolepakke-oppgave-02",
    "title": "Skolepakke: Brand lock i kampanjebilde",
    "useCase": "Oppgave: sikre brand-konsistens i stillbilde.",
    "outputType": "image",
    "domain": "design-system",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "kjennskap. Kanal web. Format 1:1."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "Student eller junior kreatør. Innsikt: Øvelser med tydelig fasit gir rask læring.."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Løs oppgaven med konkret produksjonskontroll.. CTA: Lever promptutkast."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Oppgaven skal beskrive motiv og produkt med låste elementer."
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Bruk realistisk kontekst tilpasset kanal."
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "Kamera og utsnitt skal støtte budskap og format."
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Lysvalg skal være fysisk plausibelt og konsistent."
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Hierarki: overskrift, produkt, CTA."
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Brand lock, text lock og product lock skal vurderes eksplisitt."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen logo-deformasjon, ingen geometriavvik."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-d-reklame-kvalitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever image med produksjonsklar struktur for web i 1:1."
      }
    ],
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-04-definer-budskaphierarki",
      "reklame-standard-15-kameradata-skal-vaere-konkrete",
      "reklame-standard-29-ingen-feil-produktgeometri"
    ]
  },
  {
    "id": "skolepakke-oppgave-03",
    "title": "Skolepakke: DOOH lesbarhet",
    "useCase": "Oppgave: optimaliser teksthierarki for storformat.",
    "outputType": "image",
    "domain": "redaksjonell",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "kjennskap. Kanal DOOH. Format 16:9."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "Student eller junior kreatør. Innsikt: Øvelser med tydelig fasit gir rask læring.."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Løs oppgaven med konkret produksjonskontroll.. CTA: Lever promptutkast."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Oppgaven skal beskrive motiv og produkt med låste elementer."
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Bruk realistisk kontekst tilpasset kanal."
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "Kamera og utsnitt skal støtte budskap og format."
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Lysvalg skal være fysisk plausibelt og konsistent."
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Hierarki: overskrift, produkt, CTA."
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Brand lock, text lock og product lock skal vurderes eksplisitt."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen logo-deformasjon, ingen geometriavvik."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-d-reklame-kvalitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever image med produksjonsklar struktur for DOOH i 16:9."
      }
    ],
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-04-definer-budskaphierarki",
      "reklame-standard-15-kameradata-skal-vaere-konkrete",
      "reklame-standard-29-ingen-feil-produktgeometri"
    ]
  },
  {
    "id": "skolepakke-oppgave-04",
    "title": "Skolepakke: Video-kontinuitet 10 sek",
    "useCase": "Oppgave: hold identitet, tekst og produkt stabilt i video.",
    "outputType": "video",
    "domain": "film-vfx",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "engasjement. Kanal web. Format 16:9."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "Student eller junior kreatør. Innsikt: Øvelser med tydelig fasit gir rask læring.."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Løs oppgaven med konkret produksjonskontroll.. CTA: Lever promptutkast."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Oppgaven skal beskrive motiv og produkt med låste elementer."
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Bruk realistisk kontekst tilpasset kanal."
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "Kamera og utsnitt skal støtte budskap og format."
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Lysvalg skal være fysisk plausibelt og konsistent."
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Hierarki: overskrift, produkt, CTA."
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Brand lock, text lock og product lock skal vurderes eksplisitt."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen logo-deformasjon, ingen geometriavvik."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-d-reklame-kvalitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever video med produksjonsklar struktur for web i 16:9."
      }
    ],
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-04-definer-budskaphierarki",
      "reklame-standard-15-kameradata-skal-vaere-konkrete",
      "reklame-standard-29-ingen-feil-produktgeometri"
    ]
  },
  {
    "id": "skolepakke-oppgave-05",
    "title": "Skolepakke: Copy med friksjonsfri CTA",
    "useCase": "Oppgave: skriv prompt for tekstvariant med tydelig CTA.",
    "outputType": "text",
    "domain": "redaksjonell",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "konvertering. Kanal web. Format banner."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "Student eller junior kreatør. Innsikt: Øvelser med tydelig fasit gir rask læring.."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Løs oppgaven med konkret produksjonskontroll.. CTA: Lever promptutkast."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Oppgaven skal beskrive motiv og produkt med låste elementer."
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Bruk realistisk kontekst tilpasset kanal."
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "Kamera og utsnitt skal støtte budskap og format."
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Lysvalg skal være fysisk plausibelt og konsistent."
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Hierarki: overskrift, produkt, CTA."
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Brand lock, text lock og product lock skal vurderes eksplisitt."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen logo-deformasjon, ingen geometriavvik."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-d-reklame-kvalitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever text med produksjonsklar struktur for web i banner."
      }
    ],
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-04-definer-budskaphierarki",
      "reklame-standard-15-kameradata-skal-vaere-konkrete",
      "reklame-standard-29-ingen-feil-produktgeometri"
    ]
  },
  {
    "id": "skolepakke-rubrikk-v1",
    "title": "Skolepakke: Vurderingsrubrikk",
    "useCase": "Rubrikk for å evaluere mål, budskap, brand-lock og teknisk kontroll i prompt.",
    "outputType": "text",
    "domain": "redaksjonell",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "engasjement. Kanal web. Format 16:9."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "Student eller junior kreatør. Innsikt: Øvelser med tydelig fasit gir rask læring.."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Løs oppgaven med konkret produksjonskontroll.. CTA: Lever promptutkast."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Oppgaven skal beskrive motiv og produkt med låste elementer."
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Bruk realistisk kontekst tilpasset kanal."
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "Kamera og utsnitt skal støtte budskap og format."
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Lysvalg skal være fysisk plausibelt og konsistent."
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Hierarki: overskrift, produkt, CTA."
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Brand lock, text lock og product lock skal vurderes eksplisitt."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen logo-deformasjon, ingen geometriavvik."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-d-reklame-kvalitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever text med produksjonsklar struktur for web i 16:9."
      }
    ],
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-04-definer-budskaphierarki",
      "reklame-standard-15-kameradata-skal-vaere-konkrete",
      "reklame-standard-29-ingen-feil-produktgeometri"
    ]
  },
  {
    "id": "some-hook-01",
    "title": "SoMe hook 01 (SoMe 9:16)",
    "useCase": "Reklamefaglig mal for some hook med fokus på engasjement og SoMe.",
    "outputType": "video",
    "domain": "sosiale-medier",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "engasjement. Kanal SoMe. Format 9:16."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "SMB-eier med tidsmangel. Innsikt: Målgruppen velger løsningen som er enklest å forstå på få sekunder."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Bestill demo."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt i aktiv bruk med tydelig håndgrep og stabil geometri"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Realistisk kontor eller hjemmemiljø med kontrollert bakgrunn"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "50mm, halvnært utsnitt, statisk kamera"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Key 45 grader, myk fill, rim for separasjon"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Budskap i øvre tredel, produkt sentralt, CTA i lavere høyre hjørne"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-c-video-kontinuitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever video med produksjonsklar struktur for SoMe i 9:16."
      }
    ],
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "some-hook-02",
    "title": "SoMe hook 02 (web 1:1)",
    "useCase": "Reklamefaglig mal for some hook med fokus på konvertering og web.",
    "outputType": "video",
    "domain": "sosiale-medier",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "konvertering. Kanal web. Format 1:1."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "Markedsleder med høyt tempo. Innsikt: Tydelig produktnytte slår visuell støy i feed."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Prøv gratis."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt i realistisk miljø med synlig funksjon i kontekst"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Nøytral studio-setting med lesbar materialitet"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "35mm, medium shot, rolig dolly-inn"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Hardt key med kontrollert fill og nøytral fargetemperatur"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Produkt i forgrunn, støttebudskap i mellomgrunn, logo i bakgrunn"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-c-video-kontinuitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever video med produksjonsklar struktur for web i 1:1."
      }
    ],
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "some-hook-03",
    "title": "SoMe hook 03 (SoMe 4:5)",
    "useCase": "Reklamefaglig mal for some hook med fokus på engasjement og SoMe.",
    "outputType": "video",
    "domain": "sosiale-medier",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "engasjement. Kanal SoMe. Format 4:5."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "Innholdsprodusent med publiseringspress. Innsikt: Merkevaren må kjennes igjen før CTA har effekt."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Se løsningen."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt og avsender i samme bilde for klar avsenderidentitet"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Bymiljø med moderat aktivitet uten å stjele fokus"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "85mm, nærbilde, låst horisont"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Naturlig vinduslys med subtil fill og presis skyggekontroll"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Tydelig visuell hierarki: overskrift, produkt, CTA"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-c-video-kontinuitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever video med produksjonsklar struktur for SoMe i 4:5."
      }
    ],
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "some-hook-04",
    "title": "SoMe hook 04 (web 9:16)",
    "useCase": "Reklamefaglig mal for some hook med fokus på konvertering og web.",
    "outputType": "video",
    "domain": "sosiale-medier",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "konvertering. Kanal web. Format 9:16."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "SMB-eier med tidsmangel. Innsikt: Målgruppen velger løsningen som er enklest å forstå på få sekunder."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Kontakt oss."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt i aktiv bruk med tydelig håndgrep og stabil geometri"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Realistisk kontor eller hjemmemiljø med kontrollert bakgrunn"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "50mm, halvnært utsnitt, statisk kamera"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Key 45 grader, myk fill, rim for separasjon"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Budskap i øvre tredel, produkt sentralt, CTA i lavere høyre hjørne"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-c-video-kontinuitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever video med produksjonsklar struktur for web i 9:16."
      }
    ],
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "some-hook-05",
    "title": "SoMe hook 05 (SoMe 1:1)",
    "useCase": "Reklamefaglig mal for some hook med fokus på engasjement og SoMe.",
    "outputType": "video",
    "domain": "sosiale-medier",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "engasjement. Kanal SoMe. Format 1:1."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "Markedsleder med høyt tempo. Innsikt: Tydelig produktnytte slår visuell støy i feed."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Lær mer."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt i realistisk miljø med synlig funksjon i kontekst"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Nøytral studio-setting med lesbar materialitet"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "35mm, medium shot, rolig dolly-inn"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Hardt key med kontrollert fill og nøytral fargetemperatur"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Produkt i forgrunn, støttebudskap i mellomgrunn, logo i bakgrunn"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-c-video-kontinuitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever video med produksjonsklar struktur for SoMe i 1:1."
      }
    ],
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "some-hook-06",
    "title": "SoMe hook 06 (web 4:5)",
    "useCase": "Reklamefaglig mal for some hook med fokus på konvertering og web.",
    "outputType": "video",
    "domain": "sosiale-medier",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "konvertering. Kanal web. Format 4:5."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "Innholdsprodusent med publiseringspress. Innsikt: Merkevaren må kjennes igjen før CTA har effekt."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Bestill demo."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt og avsender i samme bilde for klar avsenderidentitet"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Bymiljø med moderat aktivitet uten å stjele fokus"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "85mm, nærbilde, låst horisont"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Naturlig vinduslys med subtil fill og presis skyggekontroll"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Tydelig visuell hierarki: overskrift, produkt, CTA"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-c-video-kontinuitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever video med produksjonsklar struktur for web i 4:5."
      }
    ],
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "some-hook-07",
    "title": "SoMe hook 07 (SoMe 9:16)",
    "useCase": "Reklamefaglig mal for some hook med fokus på engasjement og SoMe.",
    "outputType": "video",
    "domain": "sosiale-medier",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "engasjement. Kanal SoMe. Format 9:16."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "SMB-eier med tidsmangel. Innsikt: Målgruppen velger løsningen som er enklest å forstå på få sekunder."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Prøv gratis."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt i aktiv bruk med tydelig håndgrep og stabil geometri"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Realistisk kontor eller hjemmemiljø med kontrollert bakgrunn"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "50mm, halvnært utsnitt, statisk kamera"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Key 45 grader, myk fill, rim for separasjon"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Budskap i øvre tredel, produkt sentralt, CTA i lavere høyre hjørne"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-c-video-kontinuitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever video med produksjonsklar struktur for SoMe i 9:16."
      }
    ],
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "some-hook-08",
    "title": "SoMe hook 08 (web 1:1)",
    "useCase": "Reklamefaglig mal for some hook med fokus på konvertering og web.",
    "outputType": "video",
    "domain": "sosiale-medier",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "konvertering. Kanal web. Format 1:1."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "Markedsleder med høyt tempo. Innsikt: Tydelig produktnytte slår visuell støy i feed."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Se løsningen."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt i realistisk miljø med synlig funksjon i kontekst"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Nøytral studio-setting med lesbar materialitet"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "35mm, medium shot, rolig dolly-inn"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Hardt key med kontrollert fill og nøytral fargetemperatur"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Produkt i forgrunn, støttebudskap i mellomgrunn, logo i bakgrunn"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-c-video-kontinuitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever video med produksjonsklar struktur for web i 1:1."
      }
    ],
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "some-hook-09",
    "title": "SoMe hook 09 (SoMe 4:5)",
    "useCase": "Reklamefaglig mal for some hook med fokus på engasjement og SoMe.",
    "outputType": "video",
    "domain": "sosiale-medier",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "engasjement. Kanal SoMe. Format 4:5."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "Innholdsprodusent med publiseringspress. Innsikt: Merkevaren må kjennes igjen før CTA har effekt."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Kontakt oss."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt og avsender i samme bilde for klar avsenderidentitet"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Bymiljø med moderat aktivitet uten å stjele fokus"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "85mm, nærbilde, låst horisont"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Naturlig vinduslys med subtil fill og presis skyggekontroll"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Tydelig visuell hierarki: overskrift, produkt, CTA"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-c-video-kontinuitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever video med produksjonsklar struktur for SoMe i 4:5."
      }
    ],
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "some-hook-10",
    "title": "SoMe hook 10 (web 9:16)",
    "useCase": "Reklamefaglig mal for some hook med fokus på konvertering og web.",
    "outputType": "video",
    "domain": "sosiale-medier",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "konvertering. Kanal web. Format 9:16."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "SMB-eier med tidsmangel. Innsikt: Målgruppen velger løsningen som er enklest å forstå på få sekunder."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Lær mer."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt i aktiv bruk med tydelig håndgrep og stabil geometri"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Realistisk kontor eller hjemmemiljø med kontrollert bakgrunn"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "50mm, halvnært utsnitt, statisk kamera"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Key 45 grader, myk fill, rim for separasjon"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Budskap i øvre tredel, produkt sentralt, CTA i lavere høyre hjørne"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-c-video-kontinuitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever video med produksjonsklar struktur for web i 9:16."
      }
    ],
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "some-hook-11",
    "title": "SoMe hook 11 (SoMe 1:1)",
    "useCase": "Reklamefaglig mal for some hook med fokus på engasjement og SoMe.",
    "outputType": "video",
    "domain": "sosiale-medier",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "engasjement. Kanal SoMe. Format 1:1."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "Markedsleder med høyt tempo. Innsikt: Tydelig produktnytte slår visuell støy i feed."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Bestill demo."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt i realistisk miljø med synlig funksjon i kontekst"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Nøytral studio-setting med lesbar materialitet"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "35mm, medium shot, rolig dolly-inn"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Hardt key med kontrollert fill og nøytral fargetemperatur"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Produkt i forgrunn, støttebudskap i mellomgrunn, logo i bakgrunn"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-c-video-kontinuitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever video med produksjonsklar struktur for SoMe i 1:1."
      }
    ],
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "some-hook-12",
    "title": "SoMe hook 12 (web 4:5)",
    "useCase": "Reklamefaglig mal for some hook med fokus på konvertering og web.",
    "outputType": "video",
    "domain": "sosiale-medier",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "konvertering. Kanal web. Format 4:5."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "Innholdsprodusent med publiseringspress. Innsikt: Merkevaren må kjennes igjen før CTA har effekt."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Prøv gratis."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt og avsender i samme bilde for klar avsenderidentitet"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Bymiljø med moderat aktivitet uten å stjele fokus"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "85mm, nærbilde, låst horisont"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Naturlig vinduslys med subtil fill og presis skyggekontroll"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Tydelig visuell hierarki: overskrift, produkt, CTA"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-c-video-kontinuitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever video med produksjonsklar struktur for web i 4:5."
      }
    ],
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "some-hook-13",
    "title": "SoMe hook 13 (SoMe 9:16)",
    "useCase": "Reklamefaglig mal for some hook med fokus på engasjement og SoMe.",
    "outputType": "video",
    "domain": "sosiale-medier",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "engasjement. Kanal SoMe. Format 9:16."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "SMB-eier med tidsmangel. Innsikt: Målgruppen velger løsningen som er enklest å forstå på få sekunder."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Se løsningen."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt i aktiv bruk med tydelig håndgrep og stabil geometri"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Realistisk kontor eller hjemmemiljø med kontrollert bakgrunn"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "50mm, halvnært utsnitt, statisk kamera"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Key 45 grader, myk fill, rim for separasjon"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Budskap i øvre tredel, produkt sentralt, CTA i lavere høyre hjørne"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-c-video-kontinuitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever video med produksjonsklar struktur for SoMe i 9:16."
      }
    ],
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "some-hook-14",
    "title": "SoMe hook 14 (web 1:1)",
    "useCase": "Reklamefaglig mal for some hook med fokus på konvertering og web.",
    "outputType": "video",
    "domain": "sosiale-medier",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "konvertering. Kanal web. Format 1:1."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "Markedsleder med høyt tempo. Innsikt: Tydelig produktnytte slår visuell støy i feed."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Kontakt oss."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt i realistisk miljø med synlig funksjon i kontekst"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Nøytral studio-setting med lesbar materialitet"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "35mm, medium shot, rolig dolly-inn"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Hardt key med kontrollert fill og nøytral fargetemperatur"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Produkt i forgrunn, støttebudskap i mellomgrunn, logo i bakgrunn"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-c-video-kontinuitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever video med produksjonsklar struktur for web i 1:1."
      }
    ],
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "some-hook-15",
    "title": "SoMe hook 15 (SoMe 4:5)",
    "useCase": "Reklamefaglig mal for some hook med fokus på engasjement og SoMe.",
    "outputType": "video",
    "domain": "sosiale-medier",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "engasjement. Kanal SoMe. Format 4:5."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "Innholdsprodusent med publiseringspress. Innsikt: Merkevaren må kjennes igjen før CTA har effekt."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Lær mer."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt og avsender i samme bilde for klar avsenderidentitet"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Bymiljø med moderat aktivitet uten å stjele fokus"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "85mm, nærbilde, låst horisont"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Naturlig vinduslys med subtil fill og presis skyggekontroll"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Tydelig visuell hierarki: overskrift, produkt, CTA"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-c-video-kontinuitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever video med produksjonsklar struktur for SoMe i 4:5."
      }
    ],
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "some-hook-16",
    "title": "SoMe hook 16 (web 9:16)",
    "useCase": "Reklamefaglig mal for some hook med fokus på konvertering og web.",
    "outputType": "video",
    "domain": "sosiale-medier",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "konvertering. Kanal web. Format 9:16."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "SMB-eier med tidsmangel. Innsikt: Målgruppen velger løsningen som er enklest å forstå på få sekunder."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Bestill demo."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt i aktiv bruk med tydelig håndgrep og stabil geometri"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Realistisk kontor eller hjemmemiljø med kontrollert bakgrunn"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "50mm, halvnært utsnitt, statisk kamera"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Key 45 grader, myk fill, rim for separasjon"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Budskap i øvre tredel, produkt sentralt, CTA i lavere høyre hjørne"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-c-video-kontinuitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever video med produksjonsklar struktur for web i 9:16."
      }
    ],
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "some-hook-17",
    "title": "SoMe hook 17 (SoMe 1:1)",
    "useCase": "Reklamefaglig mal for some hook med fokus på engasjement og SoMe.",
    "outputType": "video",
    "domain": "sosiale-medier",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "engasjement. Kanal SoMe. Format 1:1."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "Markedsleder med høyt tempo. Innsikt: Tydelig produktnytte slår visuell støy i feed."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Prøv gratis."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt i realistisk miljø med synlig funksjon i kontekst"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Nøytral studio-setting med lesbar materialitet"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "35mm, medium shot, rolig dolly-inn"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Hardt key med kontrollert fill og nøytral fargetemperatur"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Produkt i forgrunn, støttebudskap i mellomgrunn, logo i bakgrunn"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-c-video-kontinuitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever video med produksjonsklar struktur for SoMe i 1:1."
      }
    ],
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "some-hook-18",
    "title": "SoMe hook 18 (web 4:5)",
    "useCase": "Reklamefaglig mal for some hook med fokus på konvertering og web.",
    "outputType": "video",
    "domain": "sosiale-medier",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "konvertering. Kanal web. Format 4:5."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "Innholdsprodusent med publiseringspress. Innsikt: Merkevaren må kjennes igjen før CTA har effekt."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Se løsningen."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt og avsender i samme bilde for klar avsenderidentitet"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Bymiljø med moderat aktivitet uten å stjele fokus"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "85mm, nærbilde, låst horisont"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Naturlig vinduslys med subtil fill og presis skyggekontroll"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Tydelig visuell hierarki: overskrift, produkt, CTA"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-c-video-kontinuitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever video med produksjonsklar struktur for web i 4:5."
      }
    ],
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "some-hook-19",
    "title": "SoMe hook 19 (SoMe 9:16)",
    "useCase": "Reklamefaglig mal for some hook med fokus på engasjement og SoMe.",
    "outputType": "video",
    "domain": "sosiale-medier",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "engasjement. Kanal SoMe. Format 9:16."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "SMB-eier med tidsmangel. Innsikt: Målgruppen velger løsningen som er enklest å forstå på få sekunder."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Kontakt oss."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt i aktiv bruk med tydelig håndgrep og stabil geometri"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Realistisk kontor eller hjemmemiljø med kontrollert bakgrunn"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "50mm, halvnært utsnitt, statisk kamera"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Key 45 grader, myk fill, rim for separasjon"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Budskap i øvre tredel, produkt sentralt, CTA i lavere høyre hjørne"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-c-video-kontinuitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever video med produksjonsklar struktur for SoMe i 9:16."
      }
    ],
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  },
  {
    "id": "some-hook-20",
    "title": "SoMe hook 20 (web 1:1)",
    "useCase": "Reklamefaglig mal for some hook med fokus på konvertering og web.",
    "outputType": "video",
    "domain": "sosiale-medier",
    "blocks": [
      {
        "id": "mal",
        "title": "Mål (effekt + kanal + format)",
        "instruction": "konvertering. Kanal web. Format 1:1."
      },
      {
        "id": "malgruppe",
        "title": "Målgruppe / Innsikt",
        "instruction": "Markedsleder med høyt tempo. Innsikt: Tydelig produktnytte slår visuell støy i feed."
      },
      {
        "id": "budskap",
        "title": "Kjernebudskap + CTA",
        "instruction": "Produktet løser en konkret friksjon raskt og tydelig.. CTA: Lær mer."
      },
      {
        "id": "motiv",
        "title": "Motiv og produkt (låste elementer)",
        "instruction": "Produkt i realistisk miljø med synlig funksjon i kontekst"
      },
      {
        "id": "miljo",
        "title": "Miljø / kontekst",
        "instruction": "Nøytral studio-setting med lesbar materialitet"
      },
      {
        "id": "kamera",
        "title": "Kamera (linse, utsnitt, bevegelse)",
        "instruction": "35mm, medium shot, rolig dolly-inn"
      },
      {
        "id": "lys",
        "title": "Lys (key/fill/rim, kvalitet, retning)",
        "instruction": "Hardt key med kontrollert fill og nøytral fargetemperatur"
      },
      {
        "id": "komposisjon",
        "title": "Komposisjon / hierarki",
        "instruction": "Produkt i forgrunn, støttebudskap i mellomgrunn, logo i bakgrunn"
      },
      {
        "id": "brand-locks",
        "title": "Brand locks (logo, typografi, farger, DME)",
        "instruction": "Logo, farger og typografi er låst. Distinktive merkevareelementer skal være konsekvente i alle varianter."
      },
      {
        "id": "begrensninger",
        "title": "Begrensninger",
        "instruction": "Ingen feilskrift, ingen deformert logo, ingen feil produktgeometri, ingen nye objekter utenfor brief."
      },
      {
        "id": "negativ",
        "title": "Negativ preset",
        "instruction": "preset-c-video-kontinuitet"
      },
      {
        "id": "output",
        "title": "Output-spesifikasjon",
        "instruction": "Lever video med produksjonsklar struktur for web i 1:1."
      }
    ],
    "recommendedRules": [
      "reklame-standard-01-definer-malgruppe-eksplisitt",
      "reklame-standard-03-definer-kanal-og-format-forst",
      "reklame-standard-07-logo-lock-uten-deformasjon",
      "reklame-standard-30-stramhet-skal-justeres-etter-kanal"
    ]
  }
];

export const templatesGeneratedById = Object.fromEntries(templatesGenerated.map((entry) => [entry.id, entry]));
