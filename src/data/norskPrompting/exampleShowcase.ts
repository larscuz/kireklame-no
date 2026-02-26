import type { PromptOutputType } from "./types";

export type ExampleShowcaseMedia =
  | {
      kind: "image";
      src: string;
      thumbnailSrc?: string;
      alt: string;
      caption: string;
      isPlaceholder?: boolean;
    }
  | {
      kind: "video";
      src?: string;
      thumbnailSrc?: string;
      posterSrc?: string;
      alt: string;
      caption: string;
      isPlaceholder?: boolean;
    };

export type ExampleShowcaseItem = {
  id: string;
  title: string;
  outputType: PromptOutputType;
  modelName: string;
  difficulty: "Vanskelig" | "Svært vanskelig";
  challenge: string;
  shortBrief: string;
  miniTutorial: string[];
  prompt: string;
  terms: string[];
  media: ExampleShowcaseMedia;
};

const placeholderImage = "/norsk-prompting/examples/eksempel-01-arkitektur.svg";

export const exampleShowcaseItems: ExampleShowcaseItem[] = [
  {
    id: "img-identity-fashion-multishot",
    title: "Ansiktskonsistens i fashion-kampanje over fire bilder",
    outputType: "image",
    modelName: "Google Nano Banana Pro",
    difficulty: "Svært vanskelig",
    challenge: "Samme person, samme proporsjoner, nytt lys og styling uten identitetsdrift.",
    shortBrief: "Editorial serie med fire bilder der identiteten skal være 1:1 stabil.",
    miniTutorial: [
      "Lås identitet først: ansiktsform, øyeavstand, kjeve og hudtone.",
      "Endre kun ett kontrollfelt per iterasjon: lys eller styling, aldri begge samtidig.",
      "Legg inn eksplisitt bevaringsblokk i hver oppfølgingsprompt.",
    ],
    terms: ["Identity lock", "50mm portrait perspective", "5600K key light", "Preserve facial geometry"],
    prompt: `Create a four-image editorial campaign sequence with the exact same female model in each frame.
Frame order:
1) Neutral studio portrait.
2) Street fashion shot at dusk.
3) Interior luxury close-up.
4) Full-body campaign key visual.

Identity constraints (apply to all frames):
Preserve facial structure, eye distance, jawline, cheekbone geometry, skin tone and proportions exactly.
No identity drift. No facial morphing. No beauty filter deformation.

Lighting per frame:
Frame 1: 5600K soft key from camera left, neutral fill.
Frame 2: Cool ambient dusk + warm storefront bounce.
Frame 3: Controlled softbox + subtle rim.
Frame 4: High-end commercial key light with clean separation.

Camera:
Natural portrait perspective equivalent (50mm to 85mm). No wide-angle face distortion.

Style:
Photorealistic editorial campaign, high detail, realistic skin texture.

Resolution: 4K each frame.`,
    media: {
      kind: "image",
      src: placeholderImage,
      alt: "Placeholder for fashion identity-lock campaign.",
      caption: "Bytt med faktisk seriebilde etter opplasting til Cloudflare.",
      isPlaceholder: true,
    },
  },
  {
    id: "img-glass-bottle-caustics-text",
    title: "Transparent glass + væske + lesbar etiketttekst",
    outputType: "image",
    modelName: "Google Nano Banana Pro",
    difficulty: "Svært vanskelig",
    challenge: "Glass, væske, refleksjoner og tekst i samme shot uten artefakter.",
    shortBrief: "Premium produktbilde av parfymeflaske med presis materialrespons.",
    miniTutorial: [
      "Start med geometri og materialitet før stilord.",
      "Definer lys med retning + Kelvin + intensitet.",
      "Skriv etiketttekst ordrett og lås plassering.",
    ],
    terms: ["Caustics", "Specular highlights", "Label legibility", "Product hero shot"],
    prompt: `Create a premium studio product hero image of a transparent glass perfume bottle with visible liquid level and crisp label text.

Main subject:
Rectangular clear glass bottle, brushed aluminum cap, pale amber liquid at 62% fill height.
Label text must read exactly: "NORDIC / 02" in uppercase sans-serif, centered, black on warm-white label.

Environment:
Minimal studio sweep background, subtle reflected surface, realistic contact shadow.

Lighting:
Key light 5400K from back-left at 40 degrees.
Controlled front fill at 25% intensity.
Narrow rim light from back-right to define bottle edges.
Clean caustic light behavior through glass and liquid.

Camera:
80mm product lens look, eye-level, shallow depth of field but full label in focus.

Constraints:
Keep text fully readable, no warped letters.
No fake droplets, no fantasy distortion.
Photorealistic commercial finish, 4K.`,
    media: {
      kind: "image",
      src: placeholderImage,
      alt: "Placeholder for glass bottle text fidelity case.",
      caption: "Bytt med endelig produktbilde fra modelloutput.",
      isPlaceholder: true,
    },
  },
  {
    id: "img-architectural-night-day-match",
    title: "Dag-til-kveld arkitektur uten geometriendring",
    outputType: "image",
    modelName: "Google Nano Banana Pro",
    difficulty: "Vanskelig",
    challenge: "Bytte lysforhold uten at byggets geometri eller kameravinkel flytter seg.",
    shortBrief: "Før/etter visualisering av samme bygg, samme komposisjon.",
    miniTutorial: [
      "Første generering: lås basegeometri og komposisjon.",
      "Andre generering: endre bare lys, himmel og vindusglow.",
      "Legg inn setningen 'Preserve original composition exactly'.",
    ],
    terms: ["Architectural elevation", "Composition lock", "Blue-hour lighting", "Window glow"],
    prompt: `Create a two-state architectural marketing visualization of the exact same modern residential building.
State A: overcast daylight.
State B: blue-hour evening with warm interior window glow.

Fixed constraints for both states:
Do not alter geometry, facade module spacing, or camera position.
Preserve original composition exactly.
Preserve perspective, lens behavior and all major shadow shapes relative to structure.

Lighting shift logic:
State A uses neutral 6000K ambient daylight.
State B uses deep blue ambient sky with warm 3000K interior practicals.

Style:
Photorealistic architectural advertising render, clean materials, no surreal artifacts.
Resolution: 4K.`,
    media: {
      kind: "image",
      src: placeholderImage,
      alt: "Placeholder for architecture day-night consistency case.",
      caption: "Bytt med faktisk before/after-par fra opplastet media.",
      isPlaceholder: true,
    },
  },
  {
    id: "img-historical-accuracy-street-scene",
    title: "Historisk gatebilde uten anakronismer",
    outputType: "image",
    modelName: "Google Nano Banana Pro",
    difficulty: "Svært vanskelig",
    challenge: "Historisk presisjon i klær, skilt, rekvisitter og bymiljø samtidig.",
    shortBrief: "Dokumentarisk gatebilde satt til Oslo sent 1930-tall.",
    miniTutorial: [
      "Definer eksakt tidsperiode og sted først.",
      "List eksplisitt hva som er forbudt (moderne elementer).",
      "Bruk objektive material- og klesbegreper, ikke romantisk stilspråk.",
    ],
    terms: ["Period accuracy", "Prop discipline", "Documentary realism", "No anachronisms"],
    prompt: `Create a documentary-style street photo scene set in Oslo, late 1930s.

Scene requirements:
Cobblestone street, period storefront signage in Norwegian, tram tracks, era-appropriate coats, hats and leather shoes.
Weathered painted wood facades and practical street lighting relevant to period infrastructure.

Strict exclusions:
No modern cars, no LED lighting, no modern logos, no synthetic sportswear, no modern road markings.

Camera:
Natural 35mm documentary photo feel, eye-level human perspective.

Style:
Photorealistic historical reconstruction, restrained color palette, realistic grain.

Priority:
Historical plausibility over cinematic dramatization.`,
    media: {
      kind: "image",
      src: placeholderImage,
      alt: "Placeholder for historical street scene accuracy case.",
      caption: "Bytt med endelig historisk casebilde.",
      isPlaceholder: true,
    },
  },
  {
    id: "img-technical-cutaway-product",
    title: "Teknisk cutaway med lesbar callout-typografi",
    outputType: "image",
    modelName: "Google Nano Banana Pro",
    difficulty: "Vanskelig",
    challenge: "Cutaway-geometri + annotasjoner uten tilfeldige tekstfeil.",
    shortBrief: "Produktforklaring for reklame/launch med semi-teknisk uttrykk.",
    miniTutorial: [
      "Lås ortografisk eller semiteknisk perspektiv.",
      "Hold callouts korte med tydelig plassering.",
      "Be modellen bevare linework, spacing og labels mellom iterasjoner.",
    ],
    terms: ["Cutaway", "Orthographic discipline", "Callout labels", "Geometry lock"],
    prompt: `Create a clean technical cutaway marketing image of a wireless headphone.

Visual goal:
Half of the headphone shown as intact exterior, half shown as internal exploded cutaway.

Materials:
Matte black polymer shell, brushed aluminum arm, visible copper coil and battery module.

Text callouts (must be readable and exact):
"Driver Unit", "Battery Cell", "Bluetooth Module", "Acoustic Chamber".
Place callouts with thin neutral leader lines and avoid overlap.

Camera/style:
Orthographic-leaning product diagram look, high detail, neutral white-gray background.
No random extra labels.
Preserve technical geometry.
Resolution: 4K.`,
    media: {
      kind: "image",
      src: placeholderImage,
      alt: "Placeholder for technical cutaway prompt case.",
      caption: "Bytt med ferdig cutaway-output etter mediaopplasting.",
      isPlaceholder: true,
    },
  },
  {
    id: "img-food-macro-splash",
    title: "Macro matsplash med fysisk plausibel væskedynamikk",
    outputType: "image",
    modelName: "Google Nano Banana Pro",
    difficulty: "Vanskelig",
    challenge: "Skarp makro med splash og tekstur uten CGI-look.",
    shortBrief: "High-end reklameframe for drikkeprodukt med freeze action.",
    miniTutorial: [
      "Definer makrolinse og fokusplan tidlig.",
      "Skriv hvilken del av splash som skal være knivskarp.",
      "Be om naturlig væskefysikk og ekte mikrotekstur.",
    ],
    terms: ["Macro", "Freeze action", "Liquid dynamics", "Micro texture"],
    prompt: `Create a macro advertising still of a citrus beverage splash around a glass bottle.

Action:
Capture freeze-action splash with physically plausible arc and droplet breakup.

Camera:
100mm macro lens look, ultra-shallow depth of field, focus on front bottle label and nearest droplet cluster.

Lighting:
Backlit high-contrast setup with controlled edge highlights.
Neutral to slightly warm commercial color grading.

Style constraints:
Photoreal, no plastic CGI look, realistic micro-bubbles and liquid thickness.
Keep bottle branding area clean and readable.
Resolution: 4K.`,
    media: {
      kind: "image",
      src: placeholderImage,
      alt: "Placeholder for macro splash case.",
      caption: "Bytt med faktisk macro-resultatbilde.",
      isPlaceholder: true,
    },
  },
  {
    id: "vid-dialog-car-interior",
    title: "Tosidig dialog i bilinteriør med kontinuitet",
    outputType: "video",
    modelName: "Kling 3.0",
    difficulty: "Svært vanskelig",
    challenge: "Lip-sync, blikkretning, refleksjoner og shot-kontinuitet i bevegelse.",
    shortBrief: "8 sek reklamescene i kjørende bil med to karakterer.",
    miniTutorial: [
      "Sceneanker først (bilinteriør, tid, vær).",
      "Lås karakterroller med konsekvent navn/omtale.",
      "Beskriv shot-rekkefolge og kamerabevegelse eksplisitt.",
    ],
    terms: ["Shot continuity", "Dialogue timing", "Eye-line match", "Reflections control"],
    prompt: `Scene: Interior of a moving electric car at blue hour in light rain, city reflections passing through side windows.
Characters: Woman in gray coat driving, man in black jacket in passenger seat.
Action: They exchange a short focused dialogue while the car moves smoothly through traffic.
Dialogue: Woman says "Vi er fremme om to minutter." (calm voice). Man answers "Perfekt, da rekker vi presentasjonen." (confident voice).
Camera: Start on medium two-shot, then slow push to passenger close-up, then back to driver close-up. Keep continuity in hand positions and gaze direction.
Style: Photoreal cinematic ad look, natural skin detail, controlled reflections.
Guardrails: No identity drift, no lip-sync jitter, no window morphing, no steering wheel deformation.
Duration: 8s.`,
    media: {
      kind: "video",
      posterSrc: placeholderImage,
      thumbnailSrc: placeholderImage,
      alt: "Placeholder for car dialogue continuity video.",
      caption: "Last opp endelig video-URL for hover-autoplay.",
      isPlaceholder: true,
    },
  },
  {
    id: "vid-single-take-warehouse",
    title: "Single-take warehouse tracking med objektpermanens",
    outputType: "video",
    modelName: "Kling 3.0",
    difficulty: "Svært vanskelig",
    challenge: "Lang kamerabevegelse med mange occlusions uten morphing.",
    shortBrief: "6-8 sek actionish reklamebevegelse i industrihall.",
    miniTutorial: [
      "Definer fysisk romlogikk med faste landemerker.",
      "Beskriv kamerarute stegvis (start-mid-slutt).",
      "Legg inn eksplisitt 'no morphing/no topology shift'.",
    ],
    terms: ["Single take", "Object permanence", "Occlusion handling", "Spatial continuity"],
    prompt: `Scene: Large warehouse with concrete floor, steel columns, parked pallets, and one red forklift near the back wall.
Character: One courier in dark workwear carrying a small parcel.
Action: Single-take tracking shot follows courier walking fast, passing behind two columns, then crossing in front of forklift, ending near loading dock door.
Camera: Smooth gimbal tracking from medium rear angle to side angle, then slight front reveal at the end.
Continuity constraints: Keep forklift position fixed, preserve pallet stack layout, preserve character identity and outfit details through occlusions.
Style: Photoreal industrial commercial look.
Guardrails: No morphing, no warping, no sudden background swaps.
Duration: 8s.`,
    media: {
      kind: "video",
      posterSrc: placeholderImage,
      thumbnailSrc: placeholderImage,
      alt: "Placeholder for warehouse single-take video.",
      caption: "Last opp mp4/webm for hover-autoplay.",
      isPlaceholder: true,
    },
  },
  {
    id: "vid-start-end-transform",
    title: "Start-End overgang uten ansiktsmorphing",
    outputType: "video",
    modelName: "Kling 3.0",
    difficulty: "Vanskelig",
    challenge: "Ren transformasjon fra frame A til B med kontrollert overgang.",
    shortBrief: "Produktperson fra kontorlook til eventlook i ett flytende klipp.",
    miniTutorial: [
      "Beskriv hva som skal være konstant mellom start/slutt.",
      "Definer nøyaktig hva som får endre seg.",
      "Sett tempo og kamerastabilitet i samme setning.",
    ],
    terms: ["Start-end interpolation", "Identity preservation", "Motion continuity"],
    prompt: `Start frame: A woman in a gray blazer standing in a minimal office, neutral expression, eye-level framing.
End frame: Same woman, same face and proportions, now in elegant evening outfit on a small stage with warm practical lights.
Transition: Smooth 8-second visual transformation of clothing and environment while identity stays exact.
Camera: Stable slow push-in, no sudden shake.
Constraints: Preserve facial geometry, eye distance, jawline and skin tone. No facial morphing, no body proportion drift.
Style: Photoreal cinematic commercial transition.
Duration: 8s.`,
    media: {
      kind: "video",
      posterSrc: placeholderImage,
      thumbnailSrc: placeholderImage,
      alt: "Placeholder for start-end transformation video.",
      caption: "Legg inn faktisk videofil når den er klar.",
      isPlaceholder: true,
    },
  },
  {
    id: "vid-product-spin-reflections",
    title: "Produkt spin med stabile refleksjoner og tekst",
    outputType: "video",
    modelName: "Veo 3.1",
    difficulty: "Vanskelig",
    challenge: "Rotasjon av blankt produkt med konsistent geometri og etikett.",
    shortBrief: "6 sek produktfilm for landing page hero.",
    miniTutorial: [
      "Lås produktgeometri og etiketttekst først.",
      "Beskriv rotasjonshastighet og aksen eksplisitt.",
      "Unngå motstridende lysbeskrivelser i samme prompt.",
    ],
    terms: ["Product spin", "Reflection continuity", "Label fidelity", "Hero animation"],
    prompt: `Create a 6-second product hero video of a matte-black smart speaker rotating 220 degrees on a clean reflective surface.

Product constraints:
Cylinder geometry must remain stable.
Front label text "AURUM ONE" must remain readable and undistorted.

Camera:
Locked-off camera, slight telephoto look, centered framing.

Lighting:
Soft top key with controlled side rim highlights.
Reflections must stay physically coherent through rotation.

Style:
Photoreal premium ad film.
No geometry wobble. No text deformation.
Duration: 6s.`,
    media: {
      kind: "video",
      posterSrc: placeholderImage,
      thumbnailSrc: placeholderImage,
      alt: "Placeholder for product spin video case.",
      caption: "Bytt med opplastet produktvideo for live preview.",
      isPlaceholder: true,
    },
  },
  {
    id: "vid-street-tracking-protagonist",
    title: "Traveling shot i folkemengde med låst protagonist",
    outputType: "video",
    modelName: "Kling 3.0",
    difficulty: "Svært vanskelig",
    challenge: "Holde riktig person gjennom tett crowd og kryssende bevegelser.",
    shortBrief: "Urban reklamesekvens der protagonist skal holdes i fokus.",
    miniTutorial: [
      "Gi protagonist en entydig visuell identitet (klær/farger).",
      "Beskriv crowd-bevegelse relativt til protagonist.",
      "Sett guardrail mot bytte av hovedperson.",
    ],
    terms: ["Protagonist lock", "Crowd choreography", "Tracking shot", "Occlusion continuity"],
    prompt: `Scene: Busy pedestrian street at noon.
Main character: Woman in cobalt blue coat and white sneakers, carrying a yellow folder.
Action: Camera tracks backward in front of her as she walks through a dense crowd crossing left and right.
Camera: Smooth tracking at chest height, medium shot, keep protagonist centered while background people pass close to lens.
Continuity: Do not switch main character. Preserve blue coat, white sneakers, yellow folder in all frames.
Style: Photoreal commercial city sequence, natural motion blur.
Guardrails: No identity swap, no crowd morphing, no background teleporting.
Duration: 8s.`,
    media: {
      kind: "video",
      posterSrc: placeholderImage,
      thumbnailSrc: placeholderImage,
      alt: "Placeholder for crowd protagonist-lock video.",
      caption: "Upload endelig crowd-tracking video til Cloudflare.",
      isPlaceholder: true,
    },
  },
  {
    id: "vid-phone-screen-legibility",
    title: "Hånd + mobilskjerm med lesbar UI i bevegelse",
    outputType: "video",
    modelName: "Veo 3.1",
    difficulty: "Vanskelig",
    challenge: "Skjerminnhold blir ofte uleselig ved hand-motion og fokusendring.",
    shortBrief: "App-demo-klipp med håndinteraksjon og tydelig skjermtekst.",
    miniTutorial: [
      "Definer ordlyd/UI-tekst ordrett.",
      "Beskriv fokusplan mellom hånd og skjerm.",
      "Hold kamerabevegelse rolig for lesbarhet.",
    ],
    terms: ["UI legibility", "Hand interaction", "Focus pull", "Close-up control"],
    prompt: `Create a 6-second close-up video of a hand using a smartphone app interface.

UI text must be readable and exact:
Top title: "Kampanjeoversikt"
Primary button: "Publiser"
Secondary button: "Forhåndsvis"

Action:
Thumb taps "Forhåndsvis", scrolls slightly, then taps "Publiser".

Camera:
Stable close-up, slight handheld realism but minimal shake.
Focus priority on screen text readability.

Style:
Photoreal product-demo aesthetic.
Guardrails: No warped fingers, no floating UI artifacts, no unreadable text.
Duration: 6s.`,
    media: {
      kind: "video",
      posterSrc: placeholderImage,
      thumbnailSrc: placeholderImage,
      alt: "Placeholder for mobile UI legibility video.",
      caption: "Sett faktisk video-src for hover-autoplay.",
      isPlaceholder: true,
    },
  },
  {
    id: "img-car-paint-reflection-studio",
    title: "Billakk og reflekskontroll i studio",
    outputType: "image",
    modelName: "Google Nano Banana Pro",
    difficulty: "Vanskelig",
    challenge: "Ren billakk med kontrollerte highlights uten deformerte paneler.",
    shortBrief: "Automotive reklameframe med fokus på overflatekvalitet.",
    miniTutorial: [
      "Definer karosserivinkler og panelinndeling tydelig.",
      "Beskriv reflekskilder som soft strips, ikke 'cinematic glow'.",
      "Legg inn 'no panel warping' i constraints.",
    ],
    terms: ["Automotive lighting", "Panel continuity", "Specular control", "Studio strips"],
    prompt: `Create a high-end automotive studio image of a metallic dark-green coupe, 3/4 front angle.

Surface quality goal:
Crisp paint reflections, clean panel lines, realistic clear-coat response.

Lighting:
Long soft strip lights above and side strips to define body curvature.
Controlled black flags for contrast.

Camera:
70mm equivalent, low eye-level, minimal perspective distortion.

Constraints:
No panel warping, no wheel geometry errors, no random badges.
Photoreal commercial finish, 4K.`,
    media: {
      kind: "image",
      src: placeholderImage,
      alt: "Placeholder for automotive reflection control case.",
      caption: "Bytt med faktisk automotive output.",
      isPlaceholder: true,
    },
  },
  {
    id: "img-jewelry-macro-metal-gem",
    title: "Smykkemakro med metall + sten uten fake glitter",
    outputType: "image",
    modelName: "Google Nano Banana Pro",
    difficulty: "Vanskelig",
    challenge: "Ekte metall/sten-respons i makro uten kunstig sparkle-noise.",
    shortBrief: "Luksus close-up for smykkekampanje.",
    miniTutorial: [
      "Spesifiser sten-type og klostruktur.",
      "Definer reflekterende miljø med nøytrale flagg.",
      "Unngå vage ord som 'blingy', bruk materialterminologi.",
    ],
    terms: ["Jewelry macro", "Gem facet response", "Metal polish", "Controlled sparkle"],
    prompt: `Create a macro luxury campaign image of a platinum ring with one oval sapphire center stone.

Detail constraints:
Visible prong structure, realistic metal polish, physically plausible gemstone facet reflections.
No exaggerated fantasy sparkle particles.

Lighting:
Soft top diffusion + narrow side highlights for facet definition.

Camera:
Macro lens look, shallow depth of field with center stone and front prong in critical focus.

Style:
Photoreal luxury still, neutral dark background, high micro-detail.
Resolution: 4K.`,
    media: {
      kind: "image",
      src: placeholderImage,
      alt: "Placeholder for jewelry macro fidelity case.",
      caption: "Bytt med faktisk smykkebilde fra modell.",
      isPlaceholder: true,
    },
  },
  {
    id: "vid-lipsync-closeup-identity",
    title: "Nærbildedialog med lip-sync og identitetslås",
    outputType: "video",
    modelName: "Kling 3.0",
    difficulty: "Svært vanskelig",
    challenge: "Ansikt i close-up avdekker alle feil i sync og geometri.",
    shortBrief: "4-6 sek hero close-up for sosial annonse.",
    miniTutorial: [
      "Bruk rolig kamerabevegelse og naturlig portrettperspektiv.",
      "Skriv replikk kort og tydelig med voice-tag.",
      "Legg inn ansikts-guardrails eksplisitt.",
    ],
    terms: ["Lip sync", "Facial stability", "Close-up portrait", "Identity guardrails"],
    prompt: `Scene: Tight portrait close-up, neutral indoor background, soft natural key light.
Character: Same woman from reference image, dark blond hair, green eyes.
Dialogue: "Vi lanserer i morgen." (confident, calm tone).
Camera: Very subtle push-in, portrait perspective, no wide-angle distortion.
Constraints: Preserve facial structure, eye spacing, jawline and skin texture exactly.
No lip-sync jitter, no mouth warping, no identity drift.
Style: Photoreal ad close-up.
Duration: 6s.`,
    media: {
      kind: "video",
      posterSrc: placeholderImage,
      thumbnailSrc: placeholderImage,
      alt: "Placeholder for lipsync close-up identity-lock video.",
      caption: "Bytt med endelig close-up video.",
      isPlaceholder: true,
    },
  },
  {
    id: "vid-multi-shot-mini-storyboard",
    title: "Tre-shot mini storyboard med kontinuitet",
    outputType: "video",
    modelName: "Kling 3.0",
    difficulty: "Vanskelig",
    challenge: "Flere shot i ett klipp uten continuity-brudd.",
    shortBrief: "Kampanjefortelling med setup, handling og payoff.",
    miniTutorial: [
      "Del prompten i Shot 1/2/3 med klare overganger.",
      "Repeter karakter- og propankre i hvert shot.",
      "Definer kameraatferd for hvert shot separat.",
    ],
    terms: ["Multi-shot", "Storyboard logic", "Prop continuity", "Shot language"],
    prompt: `Shot 1 (Setup): Early morning bakery interior, baker places fresh bread on counter. Wide shot, gentle dolly in.
Shot 2 (Action): Same baker wraps one loaf in branded paper while customer approaches from right. Medium shot, side tracking.
Shot 3 (Payoff): Customer exits smiling with bag, baker visible in background waving. Close-to-medium shot, slight handheld warmth.
Continuity constraints: Same baker identity, same apron, same branded paper design through all shots.
Style: Photoreal commercial narrative.
Duration: 8s.`,
    media: {
      kind: "video",
      posterSrc: placeholderImage,
      thumbnailSrc: placeholderImage,
      alt: "Placeholder for multi-shot storyboard video case.",
      caption: "Upload final storyboard clip for preview.",
      isPlaceholder: true,
    },
  },
];
