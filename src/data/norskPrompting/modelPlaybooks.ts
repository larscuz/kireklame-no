import type { PromptOutputType } from "./types";

export type ModelTemplateCategoryId = "image" | "video" | "audio";

export type ModelPromptField = {
  section: string;
  title: string;
  instruction: string;
};

export type ModelPlaybook = {
  id: string;
  modelName: string;
  status: "documented" | "placeholder";
  summary: string;
  documentationStatus: string;
  bestPracticeBanner?: string;
  optimizedFor: string[];
  promptFieldStructure: ModelPromptField[];
  fieldCompiler?: {
    heading: string;
    steps: Array<{
      section: string;
      title: string;
      fields: string[];
      why: string;
    }>;
    compiledPromptTemplate: string;
  };
  modeTemplates?: Array<{
    id: string;
    title: string;
    purpose: string;
    template: string;
  }>;
  guardrails?: string[];
  documentationPrinciples: string[];
  operationalRules: string[];
  strengths: string[];
  weaknesses: string[];
  typicalErrors: string[];
  optimalPromptStructure: string;
  expanderSeedInput?: string;
  expanderOutputType?: PromptOutputType;
};

export type ModelTemplateCategory = {
  id: ModelTemplateCategoryId;
  title: string;
  description: string;
  models: ModelPlaybook[];
};

const nanoBananaOptimalStructure = `Create a [type image] intended for [purpose and channel].

Main subject:
[Precise physical description, geometry, materials, proportions]

Environment:
[Defined spatial logic, background, surface contact]

Lighting:
[Key direction + Kelvin + fill + rim + intensity]

Camera:
[Focal length + perspective + depth of field + aspect ratio]

Style:
[Photorealistic / editorial / orthographic / etc.]

Technical constraints:
[Preserve geometry / preserve facial identity / do not alter composition]

Resolution: 4K.`;

export const modelTemplateCategories: ModelTemplateCategory[] = [
  {
    id: "image",
    title: "Bilde",
    description: "Dokumentasjonsbaserte modelloppskrifter for stillbildeproduksjon.",
    models: [
      {
        id: "google-nano-banana-pro",
        modelName: "Google Nano Banana Pro (Gemini 3 Pro Image Preview)",
        status: "documented",
        summary: "Dokumentert playbook for høyoppløselig bildeproduksjon med tekstkontroll, identitetsbevaring og iterativ redigering.",
        documentationStatus: "Dokumentert med operative prinsipper fra modellnotater (oppdatert 26.02.2026).",
        optimizedFor: [
          "Høy oppløsning (opptil 4K)",
          "Presis tekstgjengivelse i bilder",
          "Ansiktskonsistens",
          "Multi-turn iterasjon",
          "Presise redigeringsinstruksjoner",
          "Logisk strukturert narrativ prompting",
        ],
        promptFieldStructure: [
          {
            section: "A",
            title: "Kontekst og formål",
            instruction:
              "Start med hva bildet skal brukes til, kanal (reklame/editorial/produkt/arkitektur/kampanje) og ønsket uttrykk.",
          },
          {
            section: "B",
            title: "Hovedmotiv (fysisk og presis beskrivelse)",
            instruction:
              "Beskriv geometri, materialitet, farger, overflater, proporsjoner og målestokk med unambiguous terms. Unngå vage adjektiver.",
          },
          {
            section: "C",
            title: "Identitetsbevaring (ved mennesker)",
            instruction:
              "Spesifiser ansiktsform, øyefarge, hårfarge, hudtone og særtrekk. Legg inn eksplisitte bevaringskrav for facial geometry ved redigering.",
          },
          {
            section: "D",
            title: "Miljø og romlogikk",
            instruction:
              "Definer arkitektonisk kontekst, dybde, underlag, bakgrunn og avgrensning. Unngå tilfeldig eller udefinert cinematic background.",
          },
          {
            section: "E",
            title: "Lys (operativ og fysisk)",
            instruction:
              "Spesifiser lysretning, Kelvin, lyskildetype, intensitet og skyggekarakter i konkret operativ språk.",
          },
          {
            section: "F",
            title: "Kamera og komposisjon",
            instruction:
              "Sett brennvidde, perspektiv, dybdeskarphet, fokusplan og aspektforhold eksplisitt.",
          },
          {
            section: "G",
            title: "Stil og detaljnivå",
            instruction:
              "Vær eksplisitt om stil (photorealistic, editorial, orthographic, axonometric osv.) og unngå motstridende stilblanding.",
          },
          {
            section: "H",
            title: "Tekst i bilde",
            instruction:
              "Ved tekst: spesifiser ordlyd, typografisk karakter, plassering og kontrast.",
          },
          {
            section: "I",
            title: "Redigeringsinstruksjoner (image-to-image)",
            instruction:
              "Gi presise 'change only'-kommandoer og lås geometri/lys/proporsjoner når eksisterende bilde itereres.",
          },
        ],
        documentationPrinciples: [
          "Sammenhengende og presis scene-beskrivelse gir bedre resultat enn keyword-lister.",
          "Modellen responderer godt på logisk strukturert narrativ prompting med tydelig rekkefølge.",
          "Multi-turn iterasjon er en kjerneegenskap: base -> lys -> uttrykk -> materialitet -> komposisjon.",
          "Thinking mode gir bedre resultat når prompten har logisk struktur og tydelige avhengigheter.",
          "Tekst i bilde blir mest stabil når innhold, plassering og kontrast beskrives eksplisitt.",
          "Presise redigeringsinstruksjoner med bevaringskrav fungerer godt i iterative justeringer.",
        ],
        operationalRules: [
          "Start alltid med kontekst/formål før motivdetaljer.",
          "Bruk fysisk presise begreper for materialitet, lys og kamera.",
          "Bruk Kelvin-verdi og eksplisitt lyslogikk i alle kommersielle oppsett.",
          "Ved mennesker: legg inn identitetslås i første prompt, ikke først i iterasjon 2.",
          "Ved image-to-image: bruk 'Change only ...' + 'Keep ... identical'.",
          "Lås geometri og komposisjon før stilendringer og beautification.",
        ],
        strengths: [
          "Sterk på presis tekstgjengivelse i bilde.",
          "Høy kontroll på materialitet og overflater med fysisk promptspråk.",
          "God ansiktskonsistens ved eksplisitt identitetsbevaring.",
          "Effektiv multi-turn forbedring med presise delkommandoer.",
        ],
        weaknesses: [
          "Kan drifte uttrykk ved vage adjektiver uten fysisk referanse.",
          "Kan gi ustabil scene dersom romlogikk ikke er eksplisitt definert.",
          "Motstridende perspektivkrav gir lett inkonsistent geometri.",
        ],
        typicalErrors: [
          "Keyword-lister uten scene-narrativ.",
          "Udefinert lys uten retning/Kelvin/type.",
          "Manglende romlogikk og underlag.",
          "Blanding av motstridende perspektiv i samme prompt.",
          "Vage adjektiver uten fysisk referanse.",
        ],
        optimalPromptStructure: nanoBananaOptimalStructure,
        expanderSeedInput:
          "Create a high-end commercial product image for a Nordic campaign with precise geometry, materiality and controlled 5600K studio lighting.",
        expanderOutputType: "image",
      },
    ],
  },
  {
    id: "video",
    title: "Video",
    description: "Dokumentasjonsbaserte modelloppskrifter for video, med modusspesifikk promptgrammatikk.",
    models: [
      {
        id: "kling-video-o1",
        modelName: "Kling Video O1",
        status: "documented",
        summary: "Multimodal videomodell som responderer best på narrativ prompting kombinert med references, elements og tydelig modusvalg.",
        documentationStatus: "Dokumentert fra Kling Video O1 User Guide (oppdatert 26.02.2026).",
        optimizedFor: [
          "Multimodal prompting (tekst + bilde + video + elementer)",
          "En-pass kombinerte oppgaver i én generering",
          "Referansebasert karakter- og objektkonsistens",
          "Start/end-frame interpolation",
          "Video reference for kamera eller action",
          "Input-basert edit/transformation uten manuell masking",
        ],
        promptFieldStructure: [
          {
            section: "A",
            title: "Mode picker",
            instruction:
              "Velg modus først: Text-to-Video, Image/Element Reference, Start & End Frames, Video Reference, eller Edit/Transformation.",
          },
          {
            section: "B",
            title: "Intent og mål",
            instruction:
              "Definer tydelig om målet er ny scene, neste shot, motion transfer, eller spesifikk edit i eksisterende video.",
          },
          {
            section: "C",
            title: "Referanser og elementer",
            instruction:
              "Bruk @Image/@Element for identitet og kontinuitet, @Video for bevegelse/kameralogikk, og skill tydelig hva hver referanse styrer.",
          },
          {
            section: "D",
            title: "Handling, timing og kamera",
            instruction:
              "Beskriv handling, rytme, shot-type, lens-look og kamerabevegelse i sammenhengende filmatisk språk.",
          },
          {
            section: "E",
            title: "Miljø, lys og stil",
            instruction:
              "Spesifiser scene, romlig kontekst, lysretning/kontrast og ønsket visuell stil uten motstridende krav.",
          },
          {
            section: "F",
            title: "Identity lock / guardrails",
            instruction:
              "Ved personer: legg inn eksplisitt identitetsbevaring og morfingforbud, særlig når stilendring eller aggressiv motion brukes.",
          },
        ],
        documentationPrinciples: [
          "Kling O1 fungerer som multimodal regissør og responderer best på narrativt språk, ikke keyword-motorikk.",
          "Text-to-Video-struktur: Subject + Movement + Scene + (Cinematic language + Lighting + Atmosphere).",
          "Image/Element Reference-struktur: Elements + Interactions + Environment + Visual directions.",
          "Start/End-modus: lås startframe, lås endframe, beskriv endringer mellom ankerpunktene.",
          "Video Reference-modus: bruk @Video til motion/camera og @Image/@Element til identitet.",
          "Edit-modus: bruk eksplisitte kommandoformer som Remove/Change/Add/Change background/Restyle.",
        ],
        operationalRules: [
          "Velg modus før prompten bygges.",
          "Når Identity Lock er ON: krev minst én karakterreferanse (@Image eller @Element).",
          "Ved identitetskritisk output: bruk referanser, ikke kun tekst.",
          "Unngå motstridende krav (f.eks. ekstrem stylisering + 100% identitetslås).",
          "Ved ansiktsfokus: foretrekk 50-85mm look og stabil kamerabevegelse.",
          "Legg alltid inn bevaringssetninger når eksisterende identitet skal låses.",
        ],
        strengths: [
          "Sterk på multimodal sammenstilling i én pass.",
          "God kontinuitet med elementbibliotek og referanser.",
          "Effektiv for neste-shot, motion transfer og bakgrunn/subject-editing.",
          "Kan kombinere flere endringer i samme prompt.",
        ],
        weaknesses: [
          "Tekst-only prompting gir svakere identitetsstabilitet enn referanseflyt.",
          "Aggressiv stilisering kan øke risiko for identitetsdrift.",
          "Utydelig rollefordeling mellom @Image og @Video gir inkonsistente resultater.",
        ],
        typicalErrors: [
          "Identity Lock aktivert uten referanseinput.",
          "Bruk av @Video for både identitet og motion uten ekstra karakterreferanse.",
          "For brede eller motstridende endringskrav i edit-modus.",
          "Ultra-wide close-up på ansikt som skaper proporsjonsdrift.",
        ],
        optimalPromptStructure: `Mode: [Text-to-Video | Image/Element Reference | StartEnd | VideoReference | Edit]
Intent: [Generate new scene / Next shot / Transfer motion / Edit existing clip]

References:
Character identity: [@Image/@Element]
Motion or camera source: [@Video if needed]
Scene/style references: [optional @Image/@Element]

Core prompt body:
Subject + Movement + Scene + Cinematic language + Lighting + Atmosphere

Identity guardrails (if person):
Maintain the exact same identity and facial structure as the reference.
Keep bone structure, eye spacing, jawline, face shape and proportions unchanged.
No facial morphing, no identity drift, no feature exaggeration.

Edit commands (if edit mode):
Change [specified subject] in [@Video] to [target]
Change background in [@Video] to [target background]
Remove [content] from [@Video]
Change [@Video] to [style/weather]`,
        expanderSeedInput:
          "Generate a next shot using image identity reference and video camera reference, preserving facial structure and avoiding morphing.",
        expanderOutputType: "video",
      },
      {
        id: "kling-3-0",
        modelName: "Kling 3.0",
        status: "documented",
        summary: "Regissørorientert videoplaybook med feltbasert prompt-kompilering, multi-shot maler og guardrails for identitetsstabilitet.",
        documentationStatus: "Dokumentert med operativ kommunikasjonsstil og modusmaler (oppdatert 26.02.2026).",
        bestPracticeBanner:
          "Kling 3.0 responderer best på prompts skrevet som regissør-instruksjoner, ikke keyword-lister. Bruk en tydelig rekkefølge: Scene → Karakter(er) → Handling → Kamera → Lyd/stil.",
        optimizedFor: [
          "Regissørstyrte prompts med tydelig shot-språk",
          "Multi-shot sekvenser med kontinuitet",
          "Start-end frame-overganger",
          "Video reference for kamera eller motion",
          "Edit/transform av eksisterende video",
          "Stabile flerpersonscener med entydige roller",
        ],
        promptFieldStructure: [
          {
            section: "A",
            title: "Scene (kontekstanker)",
            instruction:
              "Definer lokasjon, tid på døgnet, lysforhold og atmosfære før noe begynner å bevege seg.",
          },
          {
            section: "B",
            title: "Karakter(er) og identitetslås",
            instruction:
              "Beskriv roller entydig og konsekvent. Ved identitetskritisk output: Identity Lock ON + referanse + eksplisitt ansiktsbevaring.",
          },
          {
            section: "C",
            title: "Handling (timing og mikrohandlinger)",
            instruction:
              "Beskriv hva som skjer i rekkefølge, tempo og små bevegelser, inkludert person- eller objektinteraksjoner ved behov.",
          },
          {
            section: "D",
            title: "Kamera (shot-språk)",
            instruction:
              "Velg shot type, linsefølelse, kamerabevegelse og stabilitetskrav (jevn, uten forvrengning).",
          },
          {
            section: "E",
            title: "Lyd + dialog + stil",
            instruction:
              "Definer ambience, dialog/voice med anførselstegn + voice tag etter taler, samt grade/stil (cinematic, photoreal, HDR).",
          },
        ],
        fieldCompiler: {
          heading: "Oppskrift (felt → kompilert prompt)",
          steps: [
            {
              section: "A",
              title: "Scene (kontekstanker)",
              fields: [
                "Lokasjon (innendørs/utendørs, type sted)",
                "Tid på døgnet / lysforhold",
                "Atmosfære / vær / stemning",
              ],
              why: "Kling 3.0 blir mer stabil når scenegrunnlaget etableres før bevegelse og shot-logikk.",
            },
            {
              section: "B",
              title: "Karakter(er) og identitetslås",
              fields: [
                "Entydige roller med konsekvent omtale",
                "Identity Lock: ON ved behov",
                "Referansebilde/element i UI",
                "Presisering: identitet/ansikt skal være uendret",
              ],
              why: "Flerpersonscener blir mer konsistente når roller og referanser er tydelige.",
            },
            {
              section: "C",
              title: "Handling (timing og mikrohandlinger)",
              fields: [
                "Handlingsrekkefølge",
                "Tempo",
                "Mikrobevegelser",
                "Interaksjoner mellom personer/objekter",
              ],
              why: "Tydelig timing reduserer hopp, morphing og uklar sceneprogresjon.",
            },
            {
              section: "D",
              title: "Kamera (shot-språk)",
              fields: [
                "Shot type (wide/medium/close)",
                "Linsefølelse",
                "Kamerabevegelse (push-in/tracking/dolly/handheld subtil)",
                "Stabilitet (jevn, uten forvrengning)",
              ],
              why: "Intensjonelt shot language gir bedre kontroll på filmatisk uttrykk og kontinuitet.",
            },
            {
              section: "E",
              title: "Lyd + dialog + stil",
              fields: [
                "Lydmiljø (ambience)",
                "Dialog i anførselstegn",
                "Voice tag etter taler",
                "Stil/grade (cinematic, photoreal, HDR)",
              ],
              why: "Konsistent lyd- og stilretning gir mer troverdig scenehelhet.",
            },
          ],
          compiledPromptTemplate:
            "Scene: {lokasjon, tid, atmosfære}. Karakterer: {rolle 1 med presis beskrivelse} {rolle 2 om relevant}. Handling: {hva skjer, tempo, mikrohandlinger}. Kamera: {shot type, linsefølelse, bevegelse, stabilitet}. Lys og stil: {lyssetting, grading, realisme}. Lyd: {ambience}. Dialog: {Hvem snakker + “…” + voice tag}.",
        },
        modeTemplates: [
          {
            id: "kling3-text-to-video",
            title: "Mal 1: Text-to-Video (Enkeltklipp)",
            purpose: "Generere en scene fra tekst med regissør-struktur.",
            template:
              "Scene: {lokasjon, tid, atmosfære}. Karakterer: {rolle 1 med presis beskrivelse} {rolle 2 om relevant}. Handling: {hva skjer, tempo, mikrohandlinger}. Kamera: {shot type, linsefølelse, bevegelse, stabilitet}. Lys og stil: {lyssetting, grading, realisme}. Lyd: {ambience}. Dialog: {Hvem snakker + “…” + voice tag}.",
          },
          {
            id: "kling3-multi-shot-storyboard",
            title: "Mal 2: Multi-shot / Storyboard",
            purpose: "AI director-stil: flere shots som henger sammen i én sekvens.",
            template:
              "Shot 1: {sceneanker + handling + kamera}. Shot 2: {kontinuitet: samme karakter/setting + ny handling + nytt kamera}. Shot 3: {payoff/avslutning + kamera}. Behold kontinuitet i karakterenes identitet og nøkkelrekvisitter gjennom alle shots.",
          },
          {
            id: "kling3-start-end-frames",
            title: "Mal 3: Start-End Frames",
            purpose: "Stabil overgang mellom to nøkkelbilder med tydelig endemål.",
            template:
              "Start image (@img1): {beskriv hva som er sant i start}. End image (@img2): {beskriv ønsket slutt}. Overgang: {hva endres, hva beveger seg, tempo}. Kamera: {bevegelse/stabilitet}. Bevar karakterens identitet og ansikt uendret gjennom hele overgangen.",
          },
          {
            id: "kling3-video-reference",
            title: "Mal 4: Video Reference / Følg kamerabevegelse",
            purpose: "Bruke motion/kamera fra referansevideo og styre innhold via tekst/referanser.",
            template:
              "Bruk kamerabevegelsen/rytmen fra referansevideoen. I vår scene: {sceneanker}. Karakter: {beskrivelse/identity lock}. Handling: {hva skjer}. Hold kameraet jevnt og filmatisk, uten forvrengning.",
          },
          {
            id: "kling3-edit-transform",
            title: "Mal 5: Edit/Transform",
            purpose: "Endre eksisterende video: bakgrunn, stil, farger eller elementer.",
            template:
              "I den eksisterende videoen: {hva som skal bevares}. Endre: {konkret endring: bakgrunn / outfit / vær / stil}. Behold: {identitet/ansikt, proporsjoner, kontinuitet}. Kamera og bevegelse skal føles naturlig og stabil.",
          },
        ],
        guardrails: [
          "Ingen ansiktsforvrengning.",
          "Ingen identitetsendring.",
          "Ingen morphing.",
          "Naturlige proporsjoner.",
          "Ved dialog: bruk anførselstegn og legg voice tag etter taler.",
        ],
        documentationPrinciples: [
          "Kling 3.0 responderer best på regissør-instruksjoner i fast rekkefølge, ikke keyword-lister.",
          "Scene bør etableres før karakterbevegelse for å redusere ustabilitet.",
          "Entydige roller og konsekvent navngivning stabiliserer flerpersonscener.",
          "Intentional shot language gir tydeligere kamerarespons enn generiske stilord.",
          "Dialog blir mer robust når den skrives i anførselstegn med voice tag etter taler.",
        ],
        operationalRules: [
          "Kompiler alltid felt i rekkefølgen Scene -> Karakter(er) -> Handling -> Kamera -> Lyd/stil.",
          "Ved person i scene: legg på guardrails automatisk.",
          "Ved Identity Lock ON: krev referansebilde/element når tilgjengelig.",
          "Ved video-edit: spesifiser tydelig hva som skal bevares før hva som skal endres.",
          "Ved multi-shot: lås identitet og nøkkelrekvisitter gjennom alle shots.",
        ],
        strengths: [
          "Sterk på filmatisk shot-språk når prompten er strukturert som regiinstruks.",
          "God på sammenhengende sekvenser med tydelige shot-overganger.",
          "Støtter fleksibel transformasjon av eksisterende video med bevaringskrav.",
        ],
        weaknesses: [
          "Keyword-lister gir oftere svake eller uklare resultater.",
          "Manglende sceneanker fører lettere til visuell drift.",
          "Utydelige roller i flerpersonscener reduserer konsistens.",
        ],
        typicalErrors: [
          "Motstridende eller tilfeldig shot-language i samme prompt.",
          "Dialog uten tydelig taler/voice tag.",
          "Identity Lock aktivert uten eksplisitt bevaringssetning.",
          "For lite spesifikk handling (mangler timing/mikrohandling).",
        ],
        optimalPromptStructure: `Scene: {lokasjon, tid, atmosfære}
Karakterer: {entydige roller + identity lock ved behov}
Handling: {rekkefølge, tempo, mikrohandlinger}
Kamera: {shot type, linsefølelse, bevegelse, stabilitet}
Lyd/stil: {ambience, dialog med voice tag, grade/realisme}

Guardrails:
- Ingen ansiktsforvrengning
- Ingen identitetsendring
- Ingen morphing
- Naturlige proporsjoner
- Ved dialog: bruk anførselstegn + voice tag etter taler`,
        expanderSeedInput:
          "Scene i regnfull bygate ved kveld. Kvinnen i grå kåpe går rolig mot kamera, ser til venstre og sier: “Vi må videre nå.” (calm female voice). Slow push-in, medium shot, cinematic grading, naturlige proporsjoner uten identitetsdrift.",
        expanderOutputType: "video",
      },
      {
        id: "veo-video-prompt-recipe-no",
        modelName: "VEO Video Prompt Recipe (NO)",
        status: "documented",
        summary: "Strukturert Veo-oppskrift for stabile videoprompts med lyd, negative prompt og tekniske parametre.",
        documentationStatus: "Dokumentert playbook for Veo 3/3.1-orientert prompting (oppdatert 26.02.2026).",
        bestPracticeBanner:
          "Veo fungerer best når prompten bygges lagvis: Kjerneidé -> Motiv/Kontekst -> Handling -> Stil -> Kamera -> detaljerte valgfelt -> negative prompt -> tekniske parametre.",
        optimizedFor: [
          "Text-to-video med klar kjerneidé",
          "Image-to-video fra startbilde",
          "Første + siste frame-interpolasjon",
          "Video extension med scenekontinuitet",
          "Audio cues (dialog, SFX, ambiens) i Veo 3/3.1",
          "Tekniske valg for aspect ratio, varighet og oppløsning",
        ],
        promptFieldStructure: [
          {
            section: "1",
            title: "Kjerneidé (1 setning)",
            instruction: "Definer hva som skjer, med hvem/hva, hvor - i én kort logline.",
          },
          {
            section: "2",
            title: "Motiv + kontekst",
            instruction: "Beskriv motiv (person/objekt/dyr/scene) og miljø (sted, tid, epoke, vær, omgivelser).",
          },
          {
            section: "3",
            title: "Handling",
            instruction: "Beskriv tydelig aktivitet/bevegelse og tempo (rolig/moderat/energisk).",
          },
          {
            section: "4",
            title: "Stil",
            instruction: "Definer sjanger/stil (noir, sci-fi, dokumentar, 3D cartoon osv.) og look & feel.",
          },
          {
            section: "5",
            title: "Kamera (valgfritt, anbefalt)",
            instruction: "Sett kameraplassering og kamerabevegelse (pan/tilt/dolly/tracking/handheld/drone).",
          },
          {
            section: "6",
            title: "Komposisjon (valgfritt)",
            instruction: "Spesifiser utsnitt (wide/medium/close) og framing (rule of thirds/centered/two-shot).",
          },
          {
            section: "7",
            title: "Fokus + linse (valgfritt)",
            instruction: "Definer fokuskarakter (shallow/deep/soft) og linsetype (wide-angle/macro/telephoto).",
          },
          {
            section: "8",
            title: "Lys + farge + stemning (valgfritt)",
            instruction: "Definer lyskvalitet, fargepalett og emosjonell tone.",
          },
          {
            section: "9",
            title: "Lyd (valgfritt, nyttig i Veo 3/3.1)",
            instruction:
              "Legg inn dialog i anførselstegn med tonefall, samt SFX og ambiens som egne signaler.",
          },
          {
            section: "10",
            title: "Negative prompt",
            instruction:
              "List elementer som skal bort (f.eks. watermark, logo, blurry, extra limbs) uten å bruke ikke/ingen-formulering.",
          },
          {
            section: "11",
            title: "Tekniske valg",
            instruction:
              "Velg aspect ratio (16:9/9:16), varighet (4/6/8 sek) og oppløsning (720p/1080p) der tilgjengelig.",
          },
        ],
        fieldCompiler: {
          heading: "Oppskrift (felt -> kompilert prompt)",
          steps: [
            {
              section: "1",
              title: "Kjerneidé",
              fields: ["Hva skjer", "Med hvem/hva", "Hvor"],
              why: "En presis logline forankrer retning før detaljene bygges.",
            },
            {
              section: "2",
              title: "Motiv + kontekst",
              fields: ["Motiv", "Sted", "Tid på døgnet", "Vær/omgivelser"],
              why: "Tydelig kontekst reduserer uklar sceneoppsett.",
            },
            {
              section: "3",
              title: "Handling",
              fields: ["Aktivitet", "Bevegelse", "Tempo"],
              why: "Klar actionbeskrivelse gir mer kontrollerbar bevegelse.",
            },
            {
              section: "4",
              title: "Stil",
              fields: ["Sjanger", "Look & feel"],
              why: "Stil bør være eksplisitt for å unngå tilfeldig uttrykk.",
            },
            {
              section: "5",
              title: "Kamera",
              fields: ["Kameraplassering", "Kamerabevegelse"],
              why: "Kamerafelt gir bedre regi- og shotkontroll.",
            },
            {
              section: "6",
              title: "Komposisjon",
              fields: ["Utsnitt", "Framing"],
              why: "Komposisjonsvalg gir tydelig visual hierarki.",
            },
            {
              section: "7",
              title: "Fokus + linse",
              fields: ["Fokuskarakter", "Linsetype"],
              why: "Linse/fokus styrer romopplevelse og detaljprioritering.",
            },
            {
              section: "8",
              title: "Lys + farge + stemning",
              fields: ["Lys", "Fargepalett", "Stemning"],
              why: "Lys og farger styrer emosjonell lesning av scenen.",
            },
            {
              section: "9",
              title: "Lyd",
              fields: ["Dialog", "SFX", "Ambiens"],
              why: "Lydcues gjør scenen mer helhetlig i Veo 3/3.1.",
            },
            {
              section: "10",
              title: "Negative prompt",
              fields: ["Elementliste som skal bort"],
              why: "Rydding av uønskede elementer gir mer stabil output.",
            },
            {
              section: "11",
              title: "Tekniske valg",
              fields: ["Aspect ratio", "Varighet", "Oppløsning"],
              why: "Parametre låser leveranseformat tidlig i workflow.",
            },
          ],
          compiledPromptTemplate: `PROMPT:
[Stil/sjanger]. [Utsnitt] av [motiv] i [kontekst]. [Handling], [tempo]. Kamera: [kameraplassering] med [kamerabevegelse]. Linse/fokus: [linse], [fokus]. Lys/farge: [lys], [fargepalett], [stemning]. Lyd: Ambiens: [..]. SFX: [..]. Dialog: "[..]".

NEGATIVE PROMPT:
[liste med ting som skal bort - uten "ikke/ingen"]

PARAMS (om du bruker dem i UI/API):
aspect_ratio=[16:9/9:16], duration=[4/6/8], resolution=[720p/1080p]`,
        },
        modeTemplates: [
          {
            id: "veo-all-in-one",
            title: "Mal: Alt-i-ett prompt",
            purpose: "Klar standardmal for text-to-video med full struktur.",
            template: `PROMPT:
[Stil/sjanger]. [Utsnitt] av [motiv] i [kontekst]. [Handling], [tempo]. Kamera: [kameraplassering] med [kamerabevegelse]. Linse/fokus: [linse], [fokus]. Lys/farge: [lys], [fargepalett], [stemning]. Lyd: Ambiens: [..]. SFX: [..]. Dialog: "[..]".

NEGATIVE PROMPT:
[liste med ting som skal bort - uten "ikke/ingen"]

PARAMS (om du bruker dem i UI/API):
aspect_ratio=[16:9/9:16], duration=[4/6/8], resolution=[720p/1080p]`,
          },
          {
            id: "veo-image-to-video",
            title: "Ekstra mal A: Image-to-Video (startbilde)",
            purpose: "Animering fra et startbilde med styrt bevegelse og stil.",
            template:
              "Startbilde: [beskriv hva bildet viser]. Animer scenen: [handling]. Kamera: [..]. Stil/lys: [..]. Lyd: [..].",
          },
          {
            id: "veo-first-last-frame",
            title: "Ekstra mal B: Første + siste frame (interpolasjon)",
            purpose: "Kontrollert overgang mellom to nøkkelbilder.",
            template:
              "Første frame: [..]. Siste frame: [..]. Overgangen skal være: [smooth/dramatisk], med [kamerabevegelse] og [stemning].",
          },
          {
            id: "veo-video-extension",
            title: "Ekstra mal C: Video extension",
            purpose: "Fortsette handlingen fra siste sekund med kontinuitet.",
            template:
              "Fortsett fra siste sekund: [hva skjer videre]. Behold samme scene, karakterer og stemning. Kamera: [..].",
          },
        ],
        guardrails: [
          "Ved identitetsbevaring: bruk opptil 3 referansebilder av samme person/figur/produkt.",
          "Beskriv person/figur konsekvent med samme klær/attributter gjennom hele prompten.",
          "Unngå motstridende stilkrav når ansikt/identitet skal bevares.",
          "Dialog skal stå i anførselstegn.",
          "Negative prompt skal oppgis som elementliste uten ikke/ingen-formulering.",
        ],
        documentationPrinciples: [
          "Veo-prompts blir mest stabile når de bygges trinnvis fra logline til tekniske parametre.",
          "Audio cues (dialog, SFX, ambiens) er nyttige signaler i Veo 3/3.1.",
          "Negative prompt bør beskrive uønskede elementer som liste i stedet for generell negasjon.",
          "Tekniske valg for format/varighet/oppløsning bør settes eksplisitt for leveransekontroll.",
        ],
        operationalRules: [
          "Start alltid med kjerneidé før stil/kamera.",
          "Legg kamera- og komposisjonsvalg etter handling for bedre shotlogikk.",
          "Bruk dialog i anførselstegn med tonefall når replikk er viktig.",
          "Ved ansiktsbevaring: bruk referanser + konsekvent personbeskrivelse.",
          "Hold params synlige i prompt-output når UI/API støtter dem.",
        ],
        strengths: [
          "God kontroll på helhetlig promptflyt fra idé til teknisk leveranse.",
          "Støtter tydelig kobling mellom kreativ tekst og UI-parametre.",
          "Fungerer godt for både standard text-to-video og avanserte varianter (image-to-video/interpolasjon/extension).",
        ],
        weaknesses: [
          "For lite spesifikk handling gir ofte generisk bevegelse.",
          "Manglende negative prompt kan gi uønskede overlays/artefakter.",
          "Motstridende stilkrav kan redusere ansiktskonsistens.",
        ],
        typicalErrors: [
          "Kjerneidé utelatt eller for vag.",
          "Dialog uten anførselstegn.",
          "Manglende tekniske parametre for målformat.",
          "Negative prompt skrevet som generell negasjon i stedet for konkret liste.",
        ],
        optimalPromptStructure: `PROMPT:
[Stil/sjanger]. [Utsnitt] av [motiv] i [kontekst]. [Handling], [tempo]. Kamera: [kameraplassering] med [kamerabevegelse]. Linse/fokus: [linse], [fokus]. Lys/farge: [lys], [fargepalett], [stemning]. Lyd: Ambiens: [..]. SFX: [..]. Dialog: "[..]".

NEGATIVE PROMPT:
[cartoon, text overlays, logo, watermark, blurry, extra limbs, urban buildings]

PARAMS:
aspect_ratio=[16:9/9:16], duration=[4/6/8], resolution=[720p/1080p]`,
        expanderSeedInput:
          "Cinematic medium shot of a woman in a red raincoat on a coastal pier at blue hour. She walks slowly toward camera, wind in her coat, calm but determined expression. Camera: eye-level with slow dolly-in. Lighting: cold blue palette with soft practical lights. Ambient wind and distant gulls. Dialog: \"Vi drar nå.\" (calm, low voice).",
        expanderOutputType: "video",
      },
      {
        id: "seedance-2-0",
        modelName: "SeeDance 2.0 (placeholder)",
        status: "placeholder",
        summary: "Placeholder for fremtidig videomodell når vi evaluerer en sterkere kandidat enn Kling 3.0.",
        documentationStatus: "Ikke dokumentert ennå. Holdes som placeholder i datasettet.",
        optimizedFor: ["Avventer dokumentasjon"],
        promptFieldStructure: [
          {
            section: "A",
            title: "Mode og mål",
            instruction: "Definer ønsket workflow og outputmål når dokumentasjon er på plass.",
          },
        ],
        documentationPrinciples: ["Legges inn etter modell-evaluering."],
        operationalRules: ["Legges inn etter modell-evaluering."],
        strengths: ["Uavklart"],
        weaknesses: ["Uavklart"],
        typicalErrors: ["Uavklart"],
        optimalPromptStructure: `Kommer senere når modellen er dokumentert.`,
      },
    ],
  },
  {
    id: "audio",
    title: "Lyd",
    description: "Kategori opprettet for modellspesifikke lydmaler.",
    models: [
      {
        id: "audio-model-placeholder",
        modelName: "Lydmodell (placeholder)",
        status: "placeholder",
        summary: "Første struktur for lydprompting er opprettet. Modellvalg og dokumentasjon legges inn i neste iterasjon.",
        documentationStatus: "Ingen modell dokumentert ennå.",
        optimizedFor: ["Voice-over struktur", "Lydmiljø", "Timing", "Miksprioritet"],
        promptFieldStructure: [
          {
            section: "A",
            title: "Format og leveranse",
            instruction: "Definer lengde, format og brukskontekst (reklame, podcast, voice-over).",
          },
          {
            section: "B",
            title: "Lydkilder",
            instruction: "Beskriv stemme, ambience, musikk og effektlag hver for seg.",
          },
          {
            section: "C",
            title: "Temporal struktur",
            instruction: "Tidslinje med intro, hoveddel og avslutning i sekunder.",
          },
          {
            section: "D",
            title: "Miksekrav",
            instruction: "Lås prioritet mellom tale, musikk og effekter.",
          },
          {
            section: "E",
            title: "Bevaringsinstruks",
            instruction: "Definer hva som må forbli uendret mellom iterasjoner.",
          },
        ],
        documentationPrinciples: ["Avventer modellvalg og dokumentasjon."],
        operationalRules: ["Bruk eksplisitt tidslinje.", "Unngå abstrakte ord uten tekniske rammer."],
        strengths: ["Kategori og struktur er klar for rask utfylling."],
        weaknesses: ["Ingen modellspesifikk validering ennå."],
        typicalErrors: ["Utydelig miksbalanse uten eksplisitte nivåprioriteringer."],
        optimalPromptStructure: `Format:
Bruksscenario, lengde og leveranseformat.

Lydlag:
Stemme, ambience, musikk og SFX med rolle.

Tidslinje:
Sekund-for-sekund struktur.

Miks:
Prioritet og dynamikkområde.

Constraints:
Hva som ikke skal endres i neste iterasjon.`,
      },
    ],
  },
];

export const modelPlaybooks = modelTemplateCategories.flatMap((category) => category.models);

export const modelPlaybooksById = Object.fromEntries(modelPlaybooks.map((playbook) => [playbook.id, playbook])) as Record<
  string,
  ModelPlaybook
>;
