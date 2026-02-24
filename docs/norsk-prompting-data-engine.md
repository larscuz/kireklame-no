# Norsk Prompting Data Engine (MVP)

Dette er et additivt system ved siden av appen. Det endrer ikke eksisterende UI/ruter/prompt-utvider.

## Hva motoren gjør

1. Lagrer innhold i SQL (`np_*` tabeller)
2. Tar inn batcher i staging (`np_ingest_queue`)
3. Kjorer semantisk duplikatkontroll
4. Beriker/normaliserer innhold pa norsk
5. Merger eller oppretter kanoniske entries
6. Logger audit trail (`np_item_versions`, `np_dedupe_decisions`)
7. Eksporterer aktive data til generated TypeScript-filer

## SQL migrasjon

Kjor i Supabase SQL Editor:

- `/supabase/001_np_data_engine.sql`

## Miljo-variabler (server)

Kreves:

- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_URL` eller `NEXT_PUBLIC_SUPABASE_URL`

Valgfritt for LLM-berikelse:

- `OPENROUTER_API_KEY`
- `NP_ENRICHER_MODEL` (default: `qwen/qwen2.5-14b-instruct:free`)
- `NP_ENRICHER_REFERER`

Hvis LLM-key mangler, brukes lokal normalisering.

## Scripts

- `npm run np:ingest -- --file <path> --item-type <rule|term|template|example|negative_preset|representation_switch> --source-tag <tag>`
- `npm run np:seed:templates -- --count 100`
- `npm run np:build:reklame-seed` (bygger reklamefaglig seed-batch til JSON)
- `npm run np:build:xml-terms -- --input <fil.xml> [--input <fil2.xml>]` (bygger kuratert term-batch fra XML)
- `npm run np:ingest:reklame-seed` (ingester seed-batch med blandede item-typer)
- `npm run np:ingest:xml-terms` (ingester XML-termbatch)
- `npm run np:reklame:pipeline` (build + ingest + prosess + eksport)
- `npm run np:xml-terms:pipeline` (XML-build + ingest + prosess + eksport)
- `npm run np:process -- --limit 200`
- `npm run np:export`
- `npm run np:pipeline` (prosess + eksport)

## Reklamefaglig seed-batch

Bygger filen:

- `/data/norskPrompting/engine-seeds/reklame-batch-v1.json`

Batchen inneholder:

- `rules`: Reklame Standard + Debugger + Anti-AI-look
- `terms`: reklame/foto/film/copy impact-termer
- `templates`: prompt-bibliotek + skolepakke
- `examples`: reklameeksempler + anti-ai-look + skolepakke-fasit
- `negativePresets`: standard + reklamekvalitet

Taksonomi legges i `tags` og `metadata.taxonomy` med nøkler:

- `domain`
- `stage`
- `kanal`
- `format`
- `mal`
- `strenghet`
- `brandLock`
- `textLock`
- `productLock`

Kjør rekkefølge:

1. `npm run np:build:reklame-seed`
2. `npm run np:ingest:reklame-seed`
3. `npm run np:process -- --limit 500`
4. `npm run np:export`

### XML term-import

Bygger filer:

- `/data/norskPrompting/engine-seeds/xml-terms-batch-v1.json`
- `/data/norskPrompting/engine-seeds/xml-terms-batch-v1.report.json`

Eksempel:

1. `npm run np:build:xml-terms -- --input /Users/<deg>/Downloads/High_Impact_Prompt_Terms_100.xml --input /Users/<deg>/Downloads/Prompt_Engine_Terms_300.xml`
2. `npm run np:ingest:xml-terms`
3. `npm run np:process -- --limit 500`
4. `npm run np:export`

Filterregler i build-script:

- Forkaster generiske placeholder-termer (f.eks. `High Impact Term 11`).
- Erstatter placeholder-oversettelser (`Norsk oversettelse av ...`) med auto-oversatt norsk term; hvis ukjent brukes `(ION) Ikke oversatt til norsk`.
- Dedupliserer på slug og hopper over eksisterende termer i lokal ordliste/generated som standard.

### Dry-run

- `npm run np:ingest -- --file /tmp/inndata.json --item-type rule --dry-run`
- `npm run np:seed:templates -- --dry-run`
- `npm run np:build:reklame-seed -- --out /tmp/reklame.json`
- `npm run np:process -- --limit 20 --dry-run`

Merk: `np:process --dry-run` leser fortsatt pending-kø fra DB.

## Eksportfiler

Genereres til:

- `/src/data/norskPrompting/generated/glossary.generated.ts`
- `/src/data/norskPrompting/generated/rules.generated.ts`
- `/src/data/norskPrompting/generated/templates.generated.ts`
- `/src/data/norskPrompting/generated/examples.generated.ts`
- `/src/data/norskPrompting/generated/negativePresets.generated.ts`
- `/src/data/norskPrompting/generated/representationSwitches.generated.ts`

Appen er ikke byttet over til generated-filer ennå. Eksisterende imports forblir urort.
