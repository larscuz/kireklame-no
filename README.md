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

INGEST_API_KEY="change-me-long-random"
REVALIDATE_API_KEY="change-me-too"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
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
   - `REVALIDATE_API_KEY`
   - `NEXT_PUBLIC_SITE_URL` (f.eks. `https://kireklame.no`)

4. Deploy

## 7) Seed-data

Seed-data inneholder minst 20 norske aktører, men **v1 er placeholders** og må verifiseres.
Når du har verifisert: sett `is_placeholder=false` og evt. `is_verified=true`.

## 8) Design (Airbnb-inspirert)

- Sticky topbar
- “Hero” med stor typografi + søkefelt
- Filter chips (single-select toggles)
- Listing-grid med kort (bilde, navn, sted, AI badge)
- Detaljside med store bilder øverst + todelt layout (info venstre, CTA høyre)
- Mikrointeraksjoner (hover, transitions, shadow-lift)
- Lys premium default + dark mode
