# KiR Nyheter SEO Masterplan (Q1)

Dette dokumentet er laget for ett hovedmal:
- Drive organisk trafikk til `kireklame.no` via `ki-avis`
- Konvertere trafikk til annonseinntekter og B2B-leads

## 1) Forretningsmal og KPI-er

### North star
- Organisk trafikk til `ki-avis` som skaper:
1. Klikk videre til katalogen (`/selskaper`, profilsider, relaterte sider)
2. Inngaende foresporsler pa annonseplass

### KPI-er (ukentlig + manedlig)
- Organiske sessions til `/ki-avis/*`
- Andel sessions fra ikke-brand sok
- CTR fra SERP (Search Console)
- Antall sider i Google-indeks
- Klikk fra avis -> katalog
- Antall annonse-leads (skjema, e-post, CTA-klikk)
- Estimert annonsevisningsvolum per plassering

### 90-dagers mal
1. 3x organisk trafikk til `ki-avis`
2. Minst 20 prioriterte sokefraser i topp 10
3. Minst 10 kvalifiserte annonsehenvendelser per maned

## 2) SEO-strategi (topical authority)

Bygg autoritet med tydelige innholds-clustere:
1. Kritikk av KI i markedsforing
2. Satsinger og omstilling i byra/markedsavdelinger
3. Regelverk, merking og etikk
4. Operative guider (hvordan bruke KI riktig i reklame)
5. Case: resultater, kostnadskutt, kvalitet, risiko

### Prioriterte emneord (starter)
- ki reklame
- ai reklame
- ki markedsforing
- ai markedsforing
- ki byra
- ai byra
- merking av ki-reklame
- kritikk av kunstig intelligens i markedsforing
- agentisk ki i markedsforing
- ai-first markedsstrategi

## 3) Informasjonsarkitektur

## Sidehierarki
1. `https://kireklame.no/ki-avis` (forside)
2. `https://kireklame.no/ki-avis/[slug]` (artikler)
3. Nye landingssider (bygges):
   - `/ki-avis/emne/[tag]`
   - `/ki-avis/kilde/[source]`
   - `/ki-avis/tema/kritikk`
   - `/ki-avis/tema/satsing`
   - `/ki-avis/tema/analyse`

### Interne lenker (viktig)
- Fra hver artikkel:
1. Lenke til 3-5 relaterte artikler
2. Lenke til relevante katalogsider (`/selskaper?...`)
3. Lenke til annonse-side (`/annonsere/ki-nyheter`)

## 4) On-page krav per artikkeltemplate

For hver sak:
1. Unik `<title>` med primarfrase tidlig
2. Sterk meta description (problem + verdi + handling)
3. H1 som matcher sokeintensjon
4. Ingress pa 40-70 ord med sokeord naturlig
5. Minst ett relevant bilde med god alt-tekst
6. Kilde, publisert-dato, oppdatert-dato, redaksjon
7. Strukturert data (`NewsArticle`)

### CTR-forbedring i SERP
- Bruk tydelige vinkler i titler:
1. "Kritikk:"
2. "Slik..."
3. "Ny rapport:"
4. "Dette betyr for..."

## 5) Teknisk SEO backlog

## M0 (must-have)
1. Egen news-sitemap (`/news-sitemap.xml`) med bare `ki-avis`-sider
2. JSON-LD:
   - `Organization` (publisher: Cuz Media AS)
   - `NewsArticle` pa artikkelsider
   - `BreadcrumbList`
3. Canonical URL pa alle nyhetssider
4. RSS-feed for KiR Nyheter (`/ki-avis/rss.xml`)
5. Forbedre intern linking-komponent (relaterte saker + tema)

## M1 (next)
1. Emne- og kildesider med indekserbart innhold
2. Autogenererte introduksjonstekster pa emnesider
3. "Last updated" logikk for evergreen-saker
4. Forsterket bildeoptimalisering og lazy loading tuning

## 6) Distribusjon og autoritet

1. Sett opp Google Search Console egenskaper for produksjon
2. Send inn sitemap + news-sitemap
3. Lag redaksjonell "Om KiR Nyheter" side med kontakt/publisher-info
4. Ukentlig outreach:
   - Del saker med kilder som omtales
   - Foresla gjensidig lenking der det er naturlig
5. Ukentlig intern lenkebygging fra katalogartikler -> KiR Nyheter

## 7) Kommersiell plan (annonse)

## Ny kommersiell side (bygges)
- `https://kireklame.no/annonsere/ki-nyheter`

### Innhold pa siden
1. Malsegment (reklame, byra, martech, AI-verktoy)
2. Tilgjengelige annonseplasseringer med specs
3. Forventet eksponering (visninger, plasseringer, format)
4. Prispakker (testpakke / manedspakke / sponsorpakke)
5. Kontakt-CTA + enkelt lead-skjema

### Tracking
1. Event: klikk pa annonseplassering
2. Event: klikk pa "Annonsere her"
3. Event: sendt annonse-skjema
4. UTM-krav pa alle kampanjelenker

## 8) Operativ redaksjonsrytme

Daglig:
1. Crawl nye saker (morgen + ettermiddag)
2. Publiser 3-8 relevante saker
3. Legg manuell oppsummering pa betalingsmur-saker

Ukentlig:
1. 1 dyp analyse-artikkel (evergreen)
2. Oppdater 3 eldre saker med ny kontekst og interne lenker
3. Rapport pa KPI-er + taper/vinner-sider

## 9) 14-dagers gjennomforingsplan

## Dag 1-3
1. Ferdigstille SEO-template for artikkelsider (schema/canonical/meta)
2. Legge inn news-sitemap og RSS
3. Implementere relaterte saker + tema-lenker

## Dag 4-7
1. Emnesider (`/ki-avis/emne/[tag]`)
2. Kildesider (`/ki-avis/kilde/[source]`)
3. Kommersiell landingsside for annonseplass

## Dag 8-14
1. Search Console baseline + dashboard
2. Title/description A/B iterasjon pa topp 20 sider
3. Intern lenkeoptimalisering mot katalogen

## 10) Risiko og tiltak

Risiko:
1. Mange korte/like saker -> tynn kvalitet
2. For mye nyhetsstoy uten evergreen-innhold
3. Hoy andel betalingsmur uten verdi i sammendrag

Tiltak:
1. Minstekrav til publisering (ingress + kontekst + relaterte lenker)
2. Ukentlig evergreen-produksjon
3. Manuell kvalitetskontroll pa paywall-saker med tydelig redaksjonell verdi

## 11) "I morgen"-prioritet (rekkefolge)

1. News sitemap + RSS + schema
2. Relaterte saker + intern lenking til katalog + annonse-side
3. Emnesider for kritikk/satsing/analyse
4. Kommersiell side for annonseplass
5. Search Console oppsett og baseline-rapport

