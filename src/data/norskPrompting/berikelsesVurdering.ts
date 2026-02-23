export type BerikelsesVurdering = {
  source: "rules" | "glossary";
  incoming: string;
  handling: "forkast" | "sla_sammen" | "berik_eksisterende" | "opprett_ny";
  targetId?: string;
  begrunnelse: string;
};

export const berikelsesVurderinger: BerikelsesVurdering[] = [
  {
    source: "rules",
    incoming: "Spesifiser linse og brennvidde",
    handling: "berik_eksisterende",
    targetId: "spesifiser-linse-brennvidde",
    begrunnelse: "Fantes allerede; nye nyanser ble lagt i konkret-kamera-fremfor-filmatisk.",
  },
  {
    source: "rules",
    incoming: "Spesifiser lysforhold",
    handling: "berik_eksisterende",
    targetId: "definer-lysretning-kvalitet",
    begrunnelse: "Eksisterende regel ble utvidet med lysretning-kvalitet-intensitet.",
  },
  {
    source: "rules",
    incoming: "Spesifiser materialitet",
    handling: "berik_eksisterende",
    targetId: "beskriv-materialitet",
    begrunnelse: "Eksisterende regel dekket fenomenet; ny regel presiserer refleks/glans.",
  },
  {
    source: "rules",
    incoming: "Negativ kontroll",
    handling: "sla_sammen",
    targetId: "bruk-negativ-prompting",
    begrunnelse: "Eksisterende negativregel ble styrket med negativ-kontroll-eksplisitt.",
  },
  {
    source: "glossary",
    incoming: "Fugleperspektiv",
    handling: "berik_eksisterende",
    targetId: "fugleperspektiv-film",
    begrunnelse: "Eksisterte; lagt til presisert variant for 90-graders overhead.",
  },
  {
    source: "glossary",
    incoming: "Froskeperspektiv",
    handling: "berik_eksisterende",
    targetId: "froskeperspektiv-film",
    begrunnelse: "Eksisterte; ny variant tydeliggjør lav vinkel-kontekst.",
  },
  {
    source: "glossary",
    incoming: "AOV / render-pass",
    handling: "berik_eksisterende",
    targetId: "aov-pass-vfx",
    begrunnelse: "Eksisterende term beholdt, ny teknisk variant lagt til for presis bruk.",
  },
  {
    source: "glossary",
    incoming: "Z-dybdepass",
    handling: "berik_eksisterende",
    targetId: "z-dybdepass-vfx",
    begrunnelse: "Eksisterte; nytt gråtonekart-begrep lagt til for operativ tydelighet.",
  },
  {
    source: "glossary",
    incoming: "Konsistenslås",
    handling: "berik_eksisterende",
    targetId: "kontinuitetslas-ai",
    begrunnelse: "Eksisterte med bred definisjon; regelbasert variant utvider praktisk bruk.",
  },
  {
    source: "glossary",
    incoming: "Temporal konsistens",
    handling: "berik_eksisterende",
    targetId: "temporal-konsistens-ai",
    begrunnelse: "Eksisterte; video-spesifikk variant lagt inn for bedre domeneavgrensning.",
  },
];
