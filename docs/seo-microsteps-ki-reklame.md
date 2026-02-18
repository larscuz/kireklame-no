# KiReklame SEO Microsteps (1-5)

Dato: 2026-02-18

Mål: løfte rangering for høy-intent søk rundt `ki reklame` og relaterte termer.

## 1) Keyword -> side map (unngå kannibalisering)

Bruk dette som fast mapping:

- `ki reklame`, `ki-reklame`, `ai reklame norge` -> `/ki-reklame`
- `ki reklamebyrå`, `ai reklamebyrå norge`, `ki byrå` -> `/ki-reklamebyra`
- `ki byrå oslo`, `digitalbyrå oslo`, lokale by-søk -> `/by/[slug]`
- `ai video produksjon`, `ai reklamefilm` -> `/ai-video`
- `ki markedsføring`, `ai markedsføring` -> `/ki-markedsforing`
- kommersielle søk -> `/annonsere`

## 2) On-page løft for /ki-reklame

Implementert i kode:

- sterk title + description på `/ki-reklame`
- FAQ structured data (`FAQPage`)
- liste structured data (`ItemList`) basert på showheel-items

Anbefalt operasjon:

- hold sidefokus på ett intent-cluster: `ki reklame`
- bruk kun selekterte videos i Showheel CMS (ingen defaults)

## 3) Internlenker med riktig ankertekst

Implementert i kode:

- nav-anker endret fra `Showheel` -> `KI-reklame` (desktop + mobile)
- internlenker til `/ki-reklame` lagt inn på:
  - `/`
  - `/om`
  - `/kontakt`
  - `/ki-reklamebyra`

## 4) CTR-microloop i Search Console (ukentlig)

Kjør hver uke:

1. Filter: `Page = https://kireklame.no/ki-reklame`
2. Sorter queries på høy `Impressions`, lav `CTR`
3. Velg topp 3 queries (typisk `ki reklame`, `ki byrå`, `ai reklame`)
4. Oppdater title/meta på siden med tydeligere value proposition
5. Vent 7-14 dager og mål endring i CTR + posisjon

Mål:

- CTR fra ~2.5% -> 4-6%
- gj.sn. posisjon ned mot <20 først, deretter <10

## 5) Backlink-microloop (hver uke)

Hver uke: få 2-3 relevante lenker til `/ki-reklame`.

Prioriter:

- omtale fra byråer listet i katalogen
- gjesteinnlegg med konkret data (ikke promo)
- faglige oppsummeringer i LinkedIn/post som peker til side

Ankertekst-variasjon:

- `ki reklame`
- `ki-reklame i Norge`
- `ai advertising showreel`
- brand + partial match: `KiReklame ki-reklame`

