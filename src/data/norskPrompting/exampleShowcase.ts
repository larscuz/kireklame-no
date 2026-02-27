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
    modelName: "Veo 3.1",
    difficulty: "Svært vanskelig",
    challenge: "Lip-sync, blikkretning, refleksjoner og shot-kontinuitet i bevegelse.",
    shortBrief: "8 sek reklamescene i kjørende bil med to karakterer.",
    miniTutorial: [
      "Sceneanker først (bilinteriør, tid, vær).",
      "Lås karakterroller med konsekvent navn/omtale.",
      "Beskriv shot-rekkefolge og kamerabevegelse eksplisitt.",
      "Legg inn hard språklås for tale: valgt språk, ordrett replikk, ingen språkblanding.",
      "Legg inn uttalekontroll (fonemer/prosodi) og stavelsesdeling for krevende ord.",
      "For norsk dialog: prioriter Veo 3.1 for bedre uttale og lip-sync-stabilitet.",
    ],
    terms: ["Shot continuity", "Dialogue timing", "Eye-line match", "Reflections control", "Language lock", "Phonetic precision"],
    prompt: `Model target: Veo 3.1 (Accent Lock Version; transferable to Kling 3.0 and other video models)
Duration: 8 seconds
Language lock: Norwegian (Bokmal, native Oslo region pronunciation)

Scene:
Interior of a moving modern electric car during blue hour in light rain.
City reflections glide naturally across the side windows.
The car moves smoothly through controlled urban traffic.
No sudden braking. No unrealistic motion.

Characters (locked):
- Woman in gray coat driving.
- Man in black jacket in passenger seat.

Speech and articulation lock (strict):
- Both characters are native Norwegian speakers.
- Speech must sound natural, neutral Oslo dialect.
- No foreign accent.
- No anglicized vowel shaping.
- No exaggerated consonants.
- No over-articulation.
- Natural Scandinavian rhythm and melodic intonation.
- Mouth shapes must correspond precisely to Norwegian phonetics.

Dialogue (strict wording, do not alter text):
Woman (calm, natural tone): "Vi er framme om to minutter."
Man (confident, relaxed tone): "Perfekt, da rekker vi presentasjonen."

Dialogue rules:
- Dialogue must be spoken exactly as written.
- No paraphrasing.
- No added words.
- No removed words.
- No hesitation sounds.
- No English phonetic coloring.
- Correct pronunciation targets: "fram-me", "mi-nut-ter", "rek-ker", "pre-sen-ta-sjo-nen".
- Natural Norwegian pacing and vowel length.

Camera choreography:
Start with a balanced medium two-shot from dashboard perspective.
Soft practical dashboard light and cool exterior blue ambience (approx. 6500K outside, 4200K interior fill).
Slow stable push-in toward passenger close-up during his line.
Cut or drift back to driver close-up while maintaining exact eye-line continuity.
No jump cuts. No perspective warping.

Visual realism controls:
Photoreal cinematic advertisement look.
Natural skin micro-texture.
Controlled reflections on windows (no morphing).
Raindrops maintain consistent scale and direction.
Steering wheel geometry remains stable.
Hands remain anatomically consistent across frames.

Guardrails (strict):
No identity drift.
No lip-sync jitter.
No window morphing.
No steering wheel deformation.
No lighting temperature shift mid-shot.
No background traffic duplication artifacts.

Maintain full physical continuity across all 8 seconds.`,
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
    modelName: "Veo 3.1",
    difficulty: "Svært vanskelig",
    challenge: "Ansikt i close-up avdekker alle feil i sync og geometri.",
    shortBrief: "4-6 sek hero close-up for sosial annonse.",
    miniTutorial: [
      "Bruk rolig kamerabevegelse og naturlig portrettperspektiv.",
      "Skriv replikk kort og tydelig med voice-tag.",
      "Legg inn ansikts-guardrails eksplisitt.",
      "Lås bokmål-uttale med eksplisitt forbud mot anglifisert prosodi.",
      "For norsk dialog: prioriter Veo 3.1 for mer naturlig uttale.",
    ],
    terms: ["Lip sync", "Facial stability", "Close-up portrait", "Identity guardrails", "Language lock", "Phonetic precision"],
    prompt: `Scene: Tight portrait close-up, neutral indoor background, soft natural key light.
Character: Same woman from reference image, dark blond hair, green eyes.
Language lock: Norwegian Bokmal with natural neutral Oslo pronunciation.
Dialogue (strict wording): "Vi lanserer i morgen." (confident, calm tone).

Speech rules:
- No foreign accent.
- No anglicized vowels or English prosody.
- No paraphrasing, no filler words, no added/removed words.
- Keep natural Norwegian rhythm, intonation and vowel length.
- Pronunciation targets: "lan-se-rer", "mor-gen".
- Lip-sync must match Norwegian phonetics exactly.

Camera: Very subtle push-in, portrait perspective, no wide-angle distortion.
Constraints: Preserve facial structure, eye spacing, jawline and skin texture exactly.
Guardrails: No lip-sync jitter, no mouth warping, no identity drift.
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
  {
    id: "img-ortografisk-aksjonometri-kjokken",
    title: "Ortografisk eksplodert kjøkkenmodul med målbar geometri",
    outputType: "image",
    modelName: "Google Nano Banana Pro",
    difficulty: "Svært vanskelig",
    challenge: "Kombinere explodert aksjonometri, typografi og materialitet uten geometridrift.",
    shortBrief: "Teknisk reklamebilde av modulært kjøkken med lagvis eksplodert visning.",
    miniTutorial: [
      "Lås først ortografisk projeksjon og geometrilås.",
      "Definer materialitet per lag før lys og stil.",
      "Legg inn typografisk rasterlås for labels og måltekst.",
    ],
    terms: ["Ortografisk projeksjon", "Explodert aksjonometri", "Eksplodert visning", "Geometrilås", "Materialitet", "Typografisk rasterlås"],
    prompt: `Create a technical-advertising image of a modular kitchen island shown in exploded axonometric layers.

Projection and geometry:
Use orthographic projection. Preserve geometry exactly. No perspective drift.

Layers:
Top: brushed stainless worktop.
Middle: frame in powder-coated matte black steel.
Bottom: storage module in untreated oak with visible grain direction.

Typography:
Add clean callout labels in uppercase sans-serif, aligned to a strict typographic grid:
"TOP PLATE", "STRUCTURAL FRAME", "STORAGE CORE".

Lighting:
Neutral 5600K studio setup with controlled soft shadows and clear layer separation.

Style:
Photoreal technical campaign visual. High edge clarity. 4K.`,
    media: {
      kind: "image",
      src: placeholderImage,
      alt: "Placeholder for orthographic exploded kitchen module case.",
      caption: "Bytt med endelig ortografisk aksjonometri-output.",
      isPlaceholder: true,
    },
  },
  {
    id: "img-chiaroscuro-portrett-identitetslas",
    title: "Chiaroscuro-portrett med streng identitetslås",
    outputType: "image",
    modelName: "Google Nano Banana Pro",
    difficulty: "Svært vanskelig",
    challenge: "Lav nøkkel-lys gir ofte ansiktsdrift og tapt hudtekstur.",
    shortBrief: "Dramatisk portrett for redaksjonell kampanje med realistisk huddetalj.",
    miniTutorial: [
      "Bruk identitetslås med konkrete ansiktsankre.",
      "Definer kantlys og lav nøkkel-kontrastdominant eksplisitt.",
      "Skille ekte filmkorn fra filter-look i prompten.",
    ],
    terms: ["Chiaroscuro", "Lav nøkkel-belysning", "Kantlys", "Identitetslås", "Fokusplan-lås", "Filmkorn ekte vs filter"],
    prompt: `Create a dramatic editorial portrait using chiaroscuro lighting.

Subject:
One woman, exact facial identity preserved from reference. Preserve eye spacing, jawline, cheekbone structure and skin texture.

Lighting:
Low-key, contrast-dominant setup.
Single key from camera right at 45 degrees.
Narrow rim light to separate silhouette from background.

Camera:
85mm portrait perspective, eye-level, shallow depth of field with focus plane locked to both eyes.

Look:
Photoreal, subtle true film grain texture (not digital noise filter).
No beauty smoothing, no identity drift, no facial deformation.
Resolution: 4K.`,
    media: {
      kind: "image",
      src: placeholderImage,
      alt: "Placeholder for chiaroscuro portrait identity lock case.",
      caption: "Bytt med ferdig lav-nøkkel portrettframe.",
      isPlaceholder: true,
    },
  },
  {
    id: "img-high-key-skincare-cta-raster",
    title: "Høy nøkkel skincare-packshot med CTA-rasterlås",
    outputType: "image",
    modelName: "Google Nano Banana Pro",
    difficulty: "Vanskelig",
    challenge: "Ren high-key look mister ofte teksthierarki og produktdetalj.",
    shortBrief: "Konverteringsorientert skincare-keyvisual med lesbar tekststruktur.",
    miniTutorial: [
      "Lås høy nøkkel jevn lysflate og produkthero-lys separat.",
      "Bruk CTA-hierarki med tydelig prioritet i tekstblokk.",
      "Hold typografisk rasterlås og negativt rom stabilt.",
    ],
    terms: ["Høy nøkkel-belysning", "Produkthero-lys", "Lyskontrastforhold", "Typografisk rasterlås", "CTA-hierarki", "Negativt rom"],
    prompt: `Create a high-key skincare campaign image with one serum bottle as hero product.

Composition:
Centered product with strict negative space around it for typography.

Lighting:
High-key even light field with soft product-hero highlights to reveal bottle curvature and label relief.

Typography (must be clean and readable):
Headline: "REN HUD. KLAR RETNING."
CTA button text: "PRØV NÅ"
Use strict typographic grid alignment and clear hierarchy.

Style:
Photoreal commercial beauty still, clean white background, no clutter.
No label distortion, no random extra text, no washed-out product edges.
Resolution: 4K.`,
    media: {
      kind: "image",
      src: placeholderImage,
      alt: "Placeholder for high key skincare CTA case.",
      caption: "Bytt med endelig skincare-packshot med CTA.",
      isPlaceholder: true,
    },
  },
  {
    id: "img-overhead-mat-grid-typografi",
    title: "90-graders overhead matoppsett med hierarkisk grid",
    outputType: "image",
    modelName: "Google Nano Banana Pro",
    difficulty: "Vanskelig",
    challenge: "Overhead-komposisjon mister ofte struktur, teksturseparasjon og label-lesbarhet.",
    shortBrief: "Sosial kampanjevisual med tydelig ingrediens-hierarki.",
    miniTutorial: [
      "Definer fugleperspektiv 90-graders overhead og statisk kamera locked-off.",
      "Bygg symmetrisk komposisjon med visuell hierarkilinje.",
      "Presiser teksturseparasjon mellom matte og blanke overflater.",
    ],
    terms: ["Fugleperspektiv 90-graders overhead", "Statisk kamera locked-off", "Symmetrisk komposisjon", "Visuell hierarkilinje", "Teksturseparasjon", "Materialitet"],
    prompt: `Create a 90-degree overhead food campaign still on a neutral stone surface.

Layout:
Symmetric grid layout with one hero plate in center and four supporting ingredient clusters in corners.
Keep strict spacing and visual hierarchy line from top-left to bottom-right.

Camera:
Locked-off overhead camera, no perspective skew.

Texture and materials:
Clear separation between glossy sauce, matte bread crust, metallic cutlery and ceramic plate.

Style:
Photoreal editorial food still, clean and controlled.
No random extra objects, no broken grid alignment.
Resolution: 4K.`,
    media: {
      kind: "image",
      src: placeholderImage,
      alt: "Placeholder for overhead food grid hierarchy case.",
      caption: "Bytt med faktisk overhead-matvisual fra modell.",
      isPlaceholder: true,
    },
  },
  {
    id: "img-persienneskygger-office-brand",
    title: "Office editorial med persienneskygger og romakse-kontroll",
    outputType: "image",
    modelName: "Google Nano Banana Pro",
    difficulty: "Vanskelig",
    challenge: "Persienneskygger gir lett inkonsistent romlogikk og feil lysretning.",
    shortBrief: "Brand-portrait i kontormiljø med filmatisk men kontrollert lys.",
    miniTutorial: [
      "Lås romakse før du beskriver lysretning.",
      "Definer hard/myk skyggekvalitet eksplisitt.",
      "Bruk varm/kald fargetemperatur for separasjon av plan.",
    ],
    terms: ["Persienneskygger", "Romakse", "Lysretning", "Skyggekvalitet hard/myk", "Fargetemperatur varm/kald", "Korrigering vs gradering"],
    prompt: `Create an editorial office portrait scene with Venetian blind shadows across wall and subject.

Scene:
Modern office, one seated subject near window, clean desk surface, defined room axis.

Lighting:
Primary directional light through blinds from camera left.
Hard shadow pattern on background wall, softer transition on face.
Cool ambient fill and slightly warm key edge separation.

Camera:
50mm lens feel, medium close-up, eye-level.

Style:
Photoreal corporate editorial.
Keep room geometry coherent, preserve shadow direction consistency, avoid random cinematic fog.
Resolution: 4K.`,
    media: {
      kind: "image",
      src: placeholderImage,
      alt: "Placeholder for Venetian blind office portrait case.",
      caption: "Bytt med endelig office-persienneskygge-case.",
      isPlaceholder: true,
    },
  },
  {
    id: "img-liminalt-rom-skala-dissonans",
    title: "Liminalt rom med kontrollert skala-dissonans",
    outputType: "image",
    modelName: "Google Nano Banana Pro",
    difficulty: "Svært vanskelig",
    challenge: "Surreal retning kollapser ofte til tilfeldig kaos uten kontrollankre.",
    shortBrief: "Konseptuell kunstkampanje med streng komposisjonskontroll.",
    miniTutorial: [
      "Start med realistisk romgrunnlag før surreal inngrep.",
      "Beskriv nøyaktig hvilken skala-dissonans som er tillatt.",
      "Hold kontrollert ulogikk og symbolsk komposisjon i samme akse.",
    ],
    terms: ["Liminalt rom", "Skala-dissonans", "Visuell paradoks", "Kontrollert ulogikk", "Symbolsk komposisjon", "Defamiliarisering"],
    prompt: `Create a surreal campaign still set in a liminal corridor that remains physically coherent.

Base reality:
Concrete hallway, overhead fluorescent fixtures, polished floor reflections, accurate perspective lines.

Surreal intervention:
One oversized office chair (3x scale) placed in center while all other objects remain normal scale.

Constraints:
Keep corridor geometry realistic.
Maintain controlled paradox: only the chair scale is dissonant.
No random floating objects, no melting surfaces.

Style:
Photoreal conceptual advertising image.
Resolution: 4K.`,
    media: {
      kind: "image",
      src: placeholderImage,
      alt: "Placeholder for liminal scale dissonance case.",
      caption: "Bytt med endelig liminalt-rom output.",
      isPlaceholder: true,
    },
  },
  {
    id: "img-previs-matte-aov-zdepth",
    title: "Previs-kompositt med matte-lag, AOV og Z-dybde",
    outputType: "image",
    modelName: "Google Nano Banana Pro",
    difficulty: "Svært vanskelig",
    challenge: "VFX-lignende lagdeling krever presise pass og separasjon av elementer.",
    shortBrief: "Postvis-ramme for reklamefilm med tydelig kompositt-pipeline.",
    miniTutorial: [
      "Definer plate, CG-lag og matte-lag eksplisitt.",
      "Be om Z-dybdepass logikk i gråtonekart-mentalitet.",
      "Lås komposisjonen for å unngå pass-drift mellom iterasjoner.",
    ],
    terms: ["Postvis (previs-kompositt)", "Matte-kompositt", "AOV-pass", "Z-dybdepass", "Kompositt-pipeline", "Matte-lag"],
    prompt: `Create a previs-style advertising frame that clearly separates compositing layers.

Foreground:
Actor holding product can.
Midground:
CG holographic UI ribbon.
Background:
Urban night plate with soft depth fog.

Compositing intent:
Design the image so foreground, midground and background are cleanly separable.
Preserve edge clarity suitable for matte extraction.
Maintain coherent depth ordering as if driven by z-depth pass logic.

Style:
Photoreal hybrid plate + CG look, production-ready composition discipline.
Resolution: 4K.`,
    media: {
      kind: "image",
      src: placeholderImage,
      alt: "Placeholder for previs matte AOV z-depth case.",
      caption: "Bytt med ferdig postvis-kompositt bilde.",
      isPlaceholder: true,
    },
  },
  {
    id: "img-billboard-typografi-cta",
    title: "Billboard mockup med typografisk rasterlås og CTA-hierarki",
    outputType: "image",
    modelName: "Google Nano Banana Pro",
    difficulty: "Vanskelig",
    challenge: "Tekst i storformat blir ofte deformert eller mister hierarki.",
    shortBrief: "Outdoor kampanjemockup med høy lesbarhet på avstand.",
    miniTutorial: [
      "Skriv headline og CTA ordrett i prompten.",
      "Presiser visuell hierarkilinje og avstand mellom tekstblokker.",
      "Lås perspektiv for å redusere typografisk drift.",
    ],
    terms: ["Typografisk rasterlås", "Visuell hierarkilinje", "CTA-hierarki", "Instruksjonsprioritet", "Begrepslås", "Perspektivkompresjon"],
    prompt: `Create a realistic outdoor billboard campaign mockup viewed from street level.

Billboard text (exact):
Headline: "BYGG KLARHET"
Subline: "Fra idé til kampanje på én arbeidsflate"
CTA: "START NÅ"

Typography constraints:
Use strict typographic grid lock, maintain clear hierarchy and spacing.
No warped letters, no random extra copy.

Camera:
Slight telephoto compression to keep billboard plane readable.

Style:
Photoreal urban evening scene, clean brand-safe output.
Resolution: 4K.`,
    media: {
      kind: "image",
      src: placeholderImage,
      alt: "Placeholder for billboard typography hierarchy case.",
      caption: "Bytt med endelig billboard-typografi case.",
      isPlaceholder: true,
    },
  },
  {
    id: "vid-shot-reverse-shot-intervju",
    title: "Shot-reverse-shot intervju med streng kontinuitetslås",
    outputType: "video",
    modelName: "Veo 3.1",
    difficulty: "Svært vanskelig",
    challenge: "Eyeline, lysretning og ansiktskonsistens bryter lett mellom vekslende shots.",
    shortBrief: "Kort intervju-sekvens med tydelig samtalestruktur.",
    miniTutorial: [
      "Start med etableringsbilde som romanker.",
      "Definer shot-reverse-shot og romakse eksplisitt.",
      "Krev kontinuitetslås på klær, blikkretning og bakgrunnselementer.",
      "Legg inn språkregel: bokmål, ordrett replikk, ingen fyllord og ingen anglifisert uttale.",
      "For norsk tale: prioriter Veo 3.1 for tydeligere språkføring.",
    ],
    terms: ["Estableringsbilde", "Shot-reverse-shot", "Romakse", "Kontinuitetslås", "Temporal konsistens video", "Fokusplan-lås", "Language lock"],
    prompt: `Shot 1 (establishing): Two people seated across a small table in a quiet studio office.
Shot 2: Medium close-up on person A speaking.
Shot 3: Reverse medium close-up on person B responding.
Shot 4: Return to person A.

Dialogue:
Person A: "Hva er viktigst i en kampanje?"
Person B: "Klar retning og konsekvent språk."

Language and articulation lock:
- Spoken language: Norwegian Bokmal with natural Oslo-region pronunciation.
- Dialogue must be spoken exactly as written. No paraphrasing, no extra words, no removed words.
- No foreign accent, no English phonetic coloring, no over-articulation.
- Natural Norwegian pacing and melodic intonation.
- Lip-sync must match Norwegian phonetics in both close-ups.

Constraints:
Preserve eyeline match across all reverse shots.
Keep room axis, lighting direction, wardrobe and tabletop props unchanged.
No identity drift, no background swap, no lip-sync jitter.

Style:
Photoreal documentary-interview aesthetic.
Duration: 8s.`,
    media: {
      kind: "video",
      posterSrc: placeholderImage,
      thumbnailSrc: placeholderImage,
      alt: "Placeholder for shot reverse shot interview case.",
      caption: "Bytt med endelig intervju-klipp.",
      isPlaceholder: true,
    },
  },
  {
    id: "vid-jcut-lcut-lydbro-kontor",
    title: "Kontorsekvens med J-kutt, L-kutt og lydbro",
    outputType: "video",
    modelName: "Kling 3.0",
    difficulty: "Svært vanskelig",
    challenge: "Audiovisuell overgang mister ofte synk mellom lyd og bilde.",
    shortBrief: "Tre korte shots med tydelig narrativ overgang gjennom lyd.",
    miniTutorial: [
      "Beskriv beat-ark før shotlisten.",
      "Marker hvor J-kutt og L-kutt skal skje.",
      "Legg lydbro i samme prompt for kontinuitet.",
    ],
    terms: ["Shotliste", "Beat-ark", "J-kutt", "L-kutt", "Lydbro", "VO-tonekart"],
    prompt: `Beat structure:
Beat 1 setup, beat 2 escalation, beat 3 resolve.

Shot 1:
Office desk close-up, fingers typing quickly.
Shot 2:
Medium shot of same person standing and answering phone.
Shot 3:
Wide shot as person walks into meeting room.

Audio transition rules:
Use J-cut from Shot 1 keyboard audio into start of Shot 2.
Use L-cut of phone voice from Shot 2 into first second of Shot 3.
Maintain one continuous ambient office room tone as audio bridge.

Style:
Photoreal branded corporate sequence.
Duration: 8s.`,
    media: {
      kind: "video",
      posterSrc: placeholderImage,
      thumbnailSrc: placeholderImage,
      alt: "Placeholder for J-cut L-cut audio bridge case.",
      caption: "Bytt med ferdig lydbro-sekvens.",
      isPlaceholder: true,
    },
  },
  {
    id: "vid-matchmove-billboard-lock",
    title: "Matchmove-lås: mobilskjerm til billboard i samme motion",
    outputType: "video",
    modelName: "Kling 3.0",
    difficulty: "Svært vanskelig",
    challenge: "Komposisjon, tracking og objektpermanens kollapser ved transformasjon mellom flater.",
    shortBrief: "Reklameovergang der app-UI ‘flyttes’ fra telefon til byskjerm.",
    miniTutorial: [
      "Lås kamerabanen med eksplisitt matchmove-lås.",
      "Hold samme UI-komposisjon i begge flater.",
      "Bruk plate clean-up guardrail mot artefakter i overgangen.",
    ],
    terms: ["Matchmove-lås", "Objekt-permanens", "Plate clean-up", "Geometrilås", "Temporal konsistens", "Instruksjonsdominans"],
    prompt: `Scene:
Evening street, one person holding a smartphone while walking toward a large digital billboard.

Action:
Camera tracks with person.
Phone screen shows campaign UI.
At midpoint, the same UI expands onto billboard while preserving layout and typography.

Constraints:
Match camera movement exactly through the transition.
Keep UI geometry, alignment and colors stable from phone to billboard.
No background warp, no object popping, no hand deformation.

Style:
Photoreal ad-tech sequence with clean compositing feel.
Duration: 8s.`,
    media: {
      kind: "video",
      posterSrc: placeholderImage,
      thumbnailSrc: placeholderImage,
      alt: "Placeholder for matchmove phone to billboard case.",
      caption: "Bytt med endelig matchmove-overgang.",
      isPlaceholder: true,
    },
  },
  {
    id: "vid-lockoff-produkthero-cta",
    title: "Locked-off produkthero-video med typografisk CTA-lås",
    outputType: "video",
    modelName: "Veo 3.1",
    difficulty: "Vanskelig",
    challenge: "Tekst og produkt må være 100% stabilt gjennom hele klippet.",
    shortBrief: "Landing page hero-video med rolig bevegelse i bakgrunnen.",
    miniTutorial: [
      "Bruk statisk kamera locked-off som hovedregel.",
      "Lås CTA-hierarki og tekstplassering eksplisitt.",
      "Gi produkthero-lys uten å overeksponere etiketten.",
    ],
    terms: ["Statisk kamera locked-off", "Produkthero-lys", "Typografisk rasterlås", "CTA-hierarki", "Objektpermanens", "Lyskontrastforhold"],
    prompt: `Create a 6-second locked-off product hero video for a premium water bottle.

Composition:
Bottle centered. Background has subtle moving light gradients only.

Text overlay (must stay fixed and readable):
Headline: "REN ENERGI"
CTA: "KJØP NÅ"

Constraints:
No camera movement.
No text drift, no typography warping, no bottle geometry wobble.
Keep label readable at all times.

Style:
Photoreal minimal commercial loop.
Duration: 6s.`,
    media: {
      kind: "video",
      posterSrc: placeholderImage,
      thumbnailSrc: placeholderImage,
      alt: "Placeholder for locked-off product CTA video case.",
      caption: "Bytt med ferdig produkthero-loop.",
      isPlaceholder: true,
    },
  },
  {
    id: "vid-handholdt-jitter-runner",
    title: "Handholdt mikro-jitter løpesekvens med temporal kontroll",
    outputType: "video",
    modelName: "Kling 3.0",
    difficulty: "Svært vanskelig",
    challenge: "Organisk kamera uten at motiv og bakgrunn begynner å morphes.",
    shortBrief: "Energetisk sportsreklame med kontrollert håndholdt følelse.",
    miniTutorial: [
      "Definer handholdt mikro-jitter som subtil, ikke kaotisk.",
      "Angi optisk bevegelsesuskarphet i stedet for AI-smear.",
      "Lås objektpermanens på klær og sko under raske steg.",
    ],
    terms: ["Handholdt mikro-jitter", "Optisk bevegelsesuskarphet", "Temporal konsistens video", "Objektpermanens", "Fokusplan", "Kontinuitetslås"],
    prompt: `Scene:
Urban running track at sunrise, one runner in black windbreaker and red shoes.

Action:
Runner accelerates from jog to sprint over 8 seconds.

Camera:
Handheld micro-jitter feel from side-front angle, but controlled and readable.
Use natural optical motion blur on limbs only.

Constraints:
Preserve runner identity, outfit colors and shoe details through fast motion.
No body warping, no background morphing, no frame-to-frame texture flicker.

Style:
Photoreal athletic commercial sequence.
Duration: 8s.`,
    media: {
      kind: "video",
      posterSrc: placeholderImage,
      thumbnailSrc: placeholderImage,
      alt: "Placeholder for handheld micro jitter runner case.",
      caption: "Bytt med endelig sportssekvens.",
      isPlaceholder: true,
    },
  },
  {
    id: "vid-hollandsk-vinkel-paradoks",
    title: "Hollandsk vinkel + visuell paradoks uten kaos",
    outputType: "video",
    modelName: "Kling 3.0",
    difficulty: "Svært vanskelig",
    challenge: "Sterk stilisering gir ofte ukontrollert geometri og narrativ kollaps.",
    shortBrief: "Konseptuell annonse med kontrollert ulogikk i kort format.",
    miniTutorial: [
      "Hold én tydelig paradoksregel for hele scenen.",
      "Bruk hollandsk vinkel med fast grad, ikke tilfeldig tilt.",
      "Kombiner narrativ friksjon med lesbar kinetisk komposisjon.",
    ],
    terms: ["Hollandsk vinkel", "Visuell paradoks", "Kontrollert ulogikk", "Narrativ friksjon", "Kinetisk komposisjon", "Komposisjonsdrift"],
    prompt: `Scene:
Corporate hallway where gravity appears slightly tilted but architecture remains intact.

Camera:
Dutch angle locked at 18 degrees through entire clip.

Action:
One person walks straight while hanging lights sway subtly in opposite direction, creating controlled visual paradox.

Constraints:
Keep hallway geometry stable.
No random shape warping.
Maintain one consistent paradox rule only.

Style:
Photoreal conceptual ad mood, sharp details, coherent motion.
Duration: 8s.`,
    media: {
      kind: "video",
      posterSrc: placeholderImage,
      thumbnailSrc: placeholderImage,
      alt: "Placeholder for Dutch angle controlled paradox case.",
      caption: "Bytt med endelig paradoks-klipp.",
      isPlaceholder: true,
    },
  },
  {
    id: "vid-dyp-fokus-crowd-stage",
    title: "Dyp fokus scene med crowd og stage-kontinuitet",
    outputType: "video",
    modelName: "Kling 3.0",
    difficulty: "Svært vanskelig",
    challenge: "Dyp fokus i komplekse scener skaper ofte bakgrunnsartefakter og identitetsbytte.",
    shortBrief: "Eventfilm med både forgrunn, mellomgrunn og bakgrunn i fokus.",
    miniTutorial: [
      "Definer dyp fokus som eksplisitt kvalitetskrav.",
      "Bruk etableringsbilde som romanker i første sekund.",
      "Lås objektpermanens på sceneelementer og hovedperson.",
    ],
    terms: ["Dyp fokus", "Estableringsbilde", "Romakse", "Objektpermanens", "Temporal konsistens video", "Kontinuitetslås"],
    prompt: `Scene:
Indoor launch event, stage in background, audience in foreground, presenter in midground.

Camera plan:
Start with wide establishing frame for 1 second.
Slow push toward presenter while keeping deep focus across all depth layers.

Constraints:
Presenter identity remains constant.
Stage screen graphics remain consistent.
Audience silhouettes should not morph between frames.

Style:
Photoreal event commercial.
No focus pumping, no background swap, no crowd flicker.
Duration: 8s.`,
    media: {
      kind: "video",
      posterSrc: placeholderImage,
      thumbnailSrc: placeholderImage,
      alt: "Placeholder for deep focus crowd stage case.",
      caption: "Bytt med ferdig eventsekvens i dyp fokus.",
      isPlaceholder: true,
    },
  },
  {
    id: "vid-cel-shading-animasjon-reklame",
    title: "Cel shading reklameklipp med ren silhuettlesbarhet",
    outputType: "video",
    modelName: "Kling 3.0",
    difficulty: "Vanskelig",
    challenge: "Stilisert animasjon mister ofte timing, inbetweening og silhuettklarhet.",
    shortBrief: "Kort karakteranimasjon for SoMe-annonse i stylized look.",
    miniTutorial: [
      "Lås stilanker: cel shading + linjeart.",
      "Beskriv nøkkelposeringer før inbetweening.",
      "Legg inn ease in / ease out for troverdig timing.",
    ],
    terms: ["Cel shading", "Linjeart", "Nøkkelposering", "Inbetweening", "Ease in / ease out", "Silhuettlesbarhet"],
    prompt: `Create a stylized cel-shaded ad clip featuring one mascot character presenting a product box.

Animation structure:
Key pose 1: Mascot points to product.
Key pose 2: Mascot steps forward and lifts box.
Key pose 3: Mascot nods and presents CTA gesture.

Motion:
Use clean inbetweening and clear ease in/ease out.
Maintain silhouette readability in every key pose.

Visual style:
Bold line art, flat color regions, controlled highlights.
No frame jitter, no anatomy warping.

Duration: 6s.`,
    media: {
      kind: "video",
      posterSrc: placeholderImage,
      thumbnailSrc: placeholderImage,
      alt: "Placeholder for cel shading animation ad case.",
      caption: "Bytt med endelig cel-shading klipp.",
      isPlaceholder: true,
    },
  },
  {
    id: "vid-temporal-denoise-night-drive",
    title: "Nattkjøring med temporal denoise uten ghosting",
    outputType: "video",
    modelName: "Veo 3.1",
    difficulty: "Svært vanskelig",
    challenge: "Mørke scener med lysglimt gir lett støy, ghosting og detaljtap.",
    shortBrief: "Automotive nattsekvens med høy visuell stabilitet.",
    miniTutorial: [
      "Definer lav nøkkel-kontrast med kontrollerte høylys.",
      "Be om temporal denoise uten å smøre teksturer.",
      "Lås panelgeometri og reflekskontinuitet gjennom klippet.",
    ],
    terms: ["Lav nøkkel kontrastdominant", "Temporal denoise", "Optisk bevegelsesuskarphet", "Objektpermanens", "Materialitet", "Temporal konsistens video"],
    prompt: `Create an 8-second night driving commercial shot of a dark sedan on wet asphalt.

Lighting:
Low-key contrast dominant, with passing streetlight highlights and controlled reflections on body panels.

Camera:
Side tracking shot at moderate speed, smooth stabilized movement.
Natural optical motion blur only.

Quality constraints:
Apply temporal noise stability while preserving fine texture in paint and road surface.
No ghost trails, no panel warping, no light streak artifacts.

Style:
Photoreal automotive commercial grade.
Duration: 8s.`,
    media: {
      kind: "video",
      posterSrc: placeholderImage,
      thumbnailSrc: placeholderImage,
      alt: "Placeholder for temporal denoise night drive case.",
      caption: "Bytt med ferdig nattkjøring-klipp.",
      isPlaceholder: true,
    },
  },
];
