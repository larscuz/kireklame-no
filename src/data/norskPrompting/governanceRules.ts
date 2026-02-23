import type { NorskPromptingGovernanceRule } from "./types";

export const norskPromptingGovernanceRules: NorskPromptingGovernanceRule[] = [
  {
    id: "server_semantisk_duplikatkontroll",
    name: "Semantisk duplikatkontroll og berikelsesfiltrering",
    category: "System / Dataintegritet",
    severity: "critical",
    appliesTo: ["rules", "glossary", "templates", "examples", "representationSwitches"],
    description:
      "Serveren skal aktivt identifisere semantiske duplikater, nær-duplikater og repetisjon med små variasjoner. Ny informasjon skal ikke legges til som egen entry dersom den allerede er dekket i eksisterende struktur. Ny data skal vurderes som identisk (forkast), nær-identisk (slå sammen), delvis overlappende (berik eksisterende), eller ny kategori (opprett ny entry).",
    enforcementLogic:
      "Sammenlign nye entries mot eksisterende på: term_no/name-likhet, definisjonslikhet, promptImpact-overlapp, constraints-likhet og negativ-likhet. Hvis samlet semantisk overlapp er over 80 prosent skal ny entry ikke opprettes, men slås sammen eller forkastes. Ved 40 til 80 prosent overlapp skal eksisterende entry berikes eller kobles via relatedTerms. Under 40 prosent overlapp kan ny entry opprettes. Unngå synonym-eksplosjon der ulike ord dekker samme fenomen.",
    addToPrompt: "",
    negativeAdd: "",
  },
];

export const governanceRulesById = Object.fromEntries(
  norskPromptingGovernanceRules.map((rule) => [rule.id, rule])
);
