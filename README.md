# KiReklame.no (v1)

Norsk katalog over reklame-/kreativ-/produksjonsbyråer og frilansmiljøer som bruker KI/AI i kommersielt kreativt arbeid.

**Stack**
- Next.js (App Router) + TypeScript
- Tailwind
- Supabase (DB + Auth)
- Deploy: Vercel

## 1) Installer lokalt

```bash
npm install
cp .env.example .env.local
npm run dev
```

Åpne: http://localhost:3000

## 2) Supabase – oppsett

1. Lag et Supabase-prosjekt
2. I Supabase: SQL Editor → kjør `supabase/schema.sql`
3. Kjør `supabase/seed.sql` for demo-data
4. Finn disse verdiene i Supabase Project Settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (server-only)

Legg inn i `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL="https://YOUR_PROJECT.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="YOUR_ANON_KEY"
SUPABASE_SERVICE_ROLE_KEY="YOUR_SERVICE_ROLE_KEY"
CRON_SECRET="long-random-secret-for-vercel-cron"

INGEST_API_KEY="change-me-long-random"
REVALIDATE_API_KEY="change-me-too"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
SERPER_API_KEY="serper-key-for-news-crawl"
```

## 3) Auth (passord)

- Gå til `/auth`
- Skriv inn e-post
- Supabase sender “magic link”
- Etter innlogging kan du trykke “Claim / oppdater profil” på selskapssiden

## 4) Send inn forslag (admin/innsendingsskjema)

- Gå til `/admin/submit`
- Skjemaet skriver til `submissions`-tabellen.

## 5) Ingest API (klar for senere crawling/autofyll)

Endpoint:
- `POST /api/ingest`
- Header: `x-ingest-key: <INGEST_API_KEY>`

Payload:
```json
{
  "companies": [
    {
      "name": "Example",
      "location_slug": "oslo",
      "short_description": "…",
      "description": "…",
      "ai_level": 3,
      "price_level": 2,
      "company_type": "byrå",
      "website": "https://…",
      "cover_image": "/covers/cover-3.jpg",
      "tags": ["generativ-video", "vfx"],
      "links": [{ "kind": "case", "label": "Case", "url": "https://…" }]
    }
  ]
}
```

## 6) Deploy til Vercel

1. Push repo til GitHub
2. Vercel → “New Project” → importer repo
3. Sett Environment Variables i Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `INGEST_API_KEY`
   - `CRON_SECRET`
   - `SERPER_API_KEY`
   - `REVALIDATE_API_KEY`
   - `NEXT_PUBLIC_SITE_URL` (f.eks. `https://kireklame.no`)

4. Deploy

## 7) KI-Avis (nettavis + crawler + CMS)

1. Kjør SQL:
   - `supabase/news-avis.sql` for eksisterende prosjekt
   - eller oppdatert `supabase/schema.sql` for nytt prosjekt.
2. Public side:
   - `/ki-avis` (avisforside)
   - `/ki-avis/[slug]` (artikler)
3. Admin CMS:
   - `/admin/ki-avis`
4. Crawler (Serper + metadata):
   - `POST /api/news/crawl`
   - Header: `x-ingest-key: <INGEST_API_KEY>`
   - Valgfri body:
```json
{
  "dryRun": true,
  "autoPublish": true,
  "maxQueries": 12,
  "maxArticles": 60,
  "resultsPerQuery": 8
}
```
4b. Internasjonal crawler (AI-first/AI-only byra):
   - `POST /api/news/crawl/international`
   - Header: `x-ingest-key: <INGEST_API_KEY>`
   - Valgfri body:
```json
{
  "dryRun": true,
  "autoPublish": true,
  "maxQueries": 36,
  "maxArticles": 180,
  "resultsPerQuery": 10
}
```
5. Worker-ingest (Cloudflare-klargjort):
   - `POST /api/news/ingest`
   - Header: `x-ingest-key: <INGEST_API_KEY>`
   - Body:
```json
{
  "autoPublish": true,
  "articles": [
    {
      "title": "Eksempel sak",
      "source_url": "https://example.no/sak",
      "source_name": "Example",
      "summary": "Kort oppsummering",
      "is_paywalled": false,
      "topic_tags": ["ki_reklame", "kritikk"]
    }
  ]
}
```
6. Daglig norsk crawl til redaksjonell vurdering (ikke auto-publisering):
   - Endpoint: `GET /api/news/crawl/daily`
   - Auth:
     - Vercel Cron: `Authorization: Bearer <CRON_SECRET>` (settes automatisk av Vercel når `CRON_SECRET` er satt)
     - Manuelt kall: `x-ingest-key: <INGEST_API_KEY>`
   - Standardkjøring bruker:
```json
{
  "dryRun": false,
  "autoPublish": false,
  "maxQueries": 12,
  "maxArticles": 60,
  "resultsPerQuery": 8
}
```
   - Resultat: nye saker havner i `draft` og kan vurderes/godkjennes i `/admin/ki-avis` før publisering.
   - Tidsplan ligger i `vercel.json` og kjører daglig (`15 6 * * *`, UTC).

7. Daglig internasjonal crawl til redaksjonell vurdering (ikke auto-publisering):
   - Endpoint: `GET /api/news/crawl/daily/international`
   - Auth:
     - Vercel Cron: `Authorization: Bearer <CRON_SECRET>`
     - Manuelt kall: `x-ingest-key: <INGEST_API_KEY>`
   - Standardkjøring bruker:
```json
{
  "dryRun": false,
  "autoPublish": false,
  "maxQueries": 16,
  "maxArticles": 80,
  "resultsPerQuery": 8
}
```
   - Tidsplan ligger i `vercel.json` og kjører daglig (`45 6 * * *`, UTC).

Cloudflare Worker er derfor ikke nødvendig for daglig crawl så lenge appen kjører på Vercel med cron aktivert.

## 8) Seed-data

Seed-data inneholder minst 20 norske aktører, men **v1 er placeholders** og må verifiseres.
Når du har verifisert: sett `is_placeholder=false` og evt. `is_verified=true`.

## 9) Design (Airbnb-inspirert)

- Sticky topbar
- “Hero” med stor typografi + søkefelt
- Filter chips (single-select toggles)
- Listing-grid med kort (bilde, navn, sted, AI badge)
- Detaljside med store bilder øverst + todelt layout (info venstre, CTA høyre)
- Mikrointeraksjoner (hover, transitions, shadow-lift)
- Lys premium default + dark mode
