import type { PromptTemplate } from "./types";

function blocks(items: Array<[string, string, string]>) {
  return items.map(([id, title, instruction]) => ({ id, title, instruction }));
}

export const promptTemplates: PromptTemplate[] = [
  {
    id: "reklamefilm-15s",
    title: "Reklamefilm 15 sek",
    useCase: "Kampanjevideo med tydelig hook, benefit og CTA.",
    outputType: "video",
    domain: "film-vfx",
    blocks: blocks([
      ["hook", "Hook 0-3s", "Definer visuelt problem eller trigger i første sekund."],
      ["benefit", "Benefit 3-10s", "Vis produkt eller løsning i konkret handling."],
      ["cta", "CTA 10-15s", "Avslutt med tydelig handling og visuell forankring."],
    ]),
    recommendedRules: ["kontinuitet-first-last", "kamera-bevegelsesregel", "produksjon-fremdrift", "konsistens-identitetslas"],
  },
  {
    id: "produkt-demo",
    title: "Produkt-demo",
    useCase: "Nøktern presentasjon av produktfunksjon i realistisk miljø.",
    outputType: "video",
    domain: "produkt",
    blocks: blocks([
      ["context", "Brukssituasjon", "Beskriv hvor og hvorfor produktet brukes."],
      ["interaction", "Interaksjon", "Vis håndgrep, materialrespons og UI-respons."],
      ["proof", "Bevis", "Legg inn konkret effekt eller resultat."],
    ]),
    recommendedRules: ["realisme-materialrespons", "fysikk-kollisjon", "kamera-dybdeskarphet", "produksjon-qa-sjekk"],
  },
  {
    id: "arkitektur-visualisering",
    title: "Arkitektvisualisering",
    useCase: "Utvendig eller innvendig visualisering med materialtrohet og skala.",
    outputType: "image",
    domain: "arkitektur",
    blocks: blocks([
      ["site", "Tomt og orientering", "Definer terreng, himmelretning og urban kontekst."],
      ["material", "Materialitet", "Lås materialvalg og overflaterespons."],
      ["human", "Menneskelig skala", "Legg inn skalaobjekter uten å stjele fokus."],
    ]),
    recommendedRules: ["realisme-materialrespons", "konsistens-scenelas", "komposisjon-lagdeling", "lys-fargetemperatur"],
  },
  {
    id: "historisk-scene",
    title: "Historisk scene",
    useCase: "Historisk motiv med epokekonsistente detaljer.",
    outputType: "image",
    domain: "historisk",
    blocks: blocks([
      ["epoch", "År og sted", "Lås tidsperiode, geografi og sosial kontekst."],
      ["wardrobe", "Kostyme og rekvisitt", "Beskriv tidsriktige klær og materialer."],
      ["atmosphere", "Lys og miljø", "Definer realistisk lyskilde for epoken."],
    ]),
    recommendedRules: ["historisk-epokekontroll", "historisk-materialpalett", "realisme-fysisk-lys", "produksjon-ingen-magi"],
  },
  {
    id: "dokumentar-stil",
    title: "Dokumentar-stil",
    useCase: "Observasjonell stil med troverdig kameraføring.",
    outputType: "video",
    domain: "dokumentar",
    blocks: blocks([
      ["observation", "Observasjon", "Beskriv hva kamera observerer uten iscenesatt overdrivelse."],
      ["movement", "Kameraadferd", "Velg håndholdt eller locked-off med begrunnelse."],
      ["sound", "Lydhint", "Definer miljølyd i stedet for episk musikk."],
    ]),
    recommendedRules: ["kamera-pov", "kamera-bevegelsesregel", "realisme-tyngdekraft", "konsistens-fargepalett"],
  },
  {
    id: "sosiale-medier-variant",
    title: "Sosiale medier-variant",
    useCase: "Hurtig variantproduksjon med tydelig budskap i 9:16.",
    outputType: "video",
    domain: "sosiale-medier",
    blocks: blocks([
      ["message", "Budskap", "Skriv én setning som må oppfattes innen 2 sekunder."],
      ["format", "Format", "Lås 9:16 og sentralt fokusområde."],
      ["variant", "Variantstrategi", "Definer hva som endres mellom A/B/C."],
    ]),
    recommendedRules: ["produksjon-versjonering", "tekst-lesbar-hierarki", "komposisjon-fokuspunkt", "konsistens-seedstrategi"],
  },
  {
    id: "vfx-breakdown",
    title: "VFX breakdown",
    useCase: "Beskrive plate, compositing og postarbeid i promptform.",
    outputType: "text",
    domain: "film-vfx",
    blocks: blocks([
      ["plate", "Platebeskrivelse", "Definer plate, kameradata og lysforhold."],
      ["integration", "Integrasjon", "Beskriv hvordan CG-elementer skal integreres."],
      ["delivery", "Leveranse", "Spesifiser pass, QA og eksportformat."],
    ]),
    recommendedRules: ["tekst-klar-rolle", "tekst-terminologikontroll", "produksjon-briefformat", "produksjon-qa-sjekk"],
  },
  {
    id: "produkt-foto-packshot",
    title: "Produktfoto / packshot",
    useCase: "Presis packshot med materialtrohet og lyskontroll.",
    outputType: "image",
    domain: "produkt",
    blocks: blocks([
      ["setup", "Studio-setup", "Definer bakgrunn, underlag og kamerahøyde."],
      ["light", "Lyssetting", "Beskriv key/fill/rim og reflekskontroll."],
      ["surface", "Overflate", "Lås glans, tekstur og kantdefinisjon."],
    ]),
    recommendedRules: ["realisme-materialrespons", "lys-primarkilde", "lys-kontrastkontroll", "komposisjon-fokuspunkt"],
  },
  {
    id: "arkitekt-konkurranse",
    title: "Arkitektkonkurranse-bilde",
    useCase: "Konseptbilde som viser volum, program og menneskelig bruk.",
    outputType: "image",
    domain: "arkitektur",
    blocks: blocks([
      ["volume", "Volumgrep", "Definer hovedvolum, sekundærvolum og siktlinjer."],
      ["program", "Program", "Forklar funksjonell bruk og bevegelse i rommet."],
      ["climate", "Klima", "Knytt lys, vær og materialvalg til kontekst."],
    ]),
    recommendedRules: ["realisme-fysisk-lys", "realisme-objektproporsjon", "komposisjon-ledende-linjer", "konsistens-scenelas"],
  },
  {
    id: "redaksjonell-forklaring",
    title: "Redaksjonell forklaring",
    useCase: "Forklar et komplekst KI-begrep i norsk fagspråk.",
    outputType: "text",
    domain: "redaksjonell",
    blocks: blocks([
      ["thesis", "Kjernepåstand", "Skriv påstand i én setning uten hypeord."],
      ["mechanism", "Mekanisme", "Forklar hvordan fenomenet faktisk fungerer."],
      ["practice", "Praktisk bruk", "Avslutt med konkret handling eller sjekkliste."],
    ]),
    recommendedRules: ["tekst-klar-rolle", "tekst-terminologikontroll", "produksjon-briefformat", "produksjon-qa-sjekk"],
  },
];

export const templatesById = Object.fromEntries(
  promptTemplates.map((template) => [template.id, template])
);
