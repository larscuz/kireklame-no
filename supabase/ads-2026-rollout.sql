-- 2026 ad rollout: 8 event banners, remove expired KI- og mediedagen.
-- Safe to run multiple times (best-effort idempotent inserts by name/title).

-- 1) Remove expired ad lead entry if it exists.
delete from public.ad_leads
where lower(name) in ('ki- og mediedagen 2026', 'ki-og mediedagen 2026');

-- Remove expired ad banner if it exists.
delete from public.ads
where lower(coalesce(title, '')) in ('ki- og mediedagen 2026', 'ki-og mediedagen 2026');

-- 2) Add/update outreach ad leads for 2026 events (8 entries).
with lead_rows (name, website, email, source_url, market, status, description) as (
  values
    (
      'AI+ 2026',
      'https://smartinnovationnorway.com/en/events-2/ai-2025/',
      null,
      'https://smartinnovationnorway.com/en/events-2/ai-2025/',
      'no',
      'new',
      'AI conference (Smart Innovation Norway).'
    ),
    (
      'NORA Arskonferanse 2026',
      'https://www.nora.ai/norsk/nora-arrangementer/annual-conference-2025/',
      null,
      'https://www.nora.ai/norsk/nora-arrangementer/annual-conference-2025/',
      'no',
      'new',
      'NORA annual conference in Oslo (current public page link is 2025).'
    ),
    (
      'Women in AI 2026',
      'https://www.nora.ai/norsk/events/2026/women-in-ai-from-algorithms-to-action-living-in-th.html',
      null,
      'https://www.nora.ai/norsk/events/2026/women-in-ai-from-algorithms-to-action-living-in-th.html',
      'no',
      'new',
      'Women in AI event in Oslo.'
    ),
    (
      'Oslo Tech Show - AI 2026',
      'https://oslotechshow.com/',
      null,
      'https://oslotechshow.com/',
      'no',
      'new',
      'Oslo Tech Show (AI and Big Data).'
    ),
    (
      'NLDB 2026',
      'https://www.ntnu.edu/nldb2026',
      null,
      'https://www.ntnu.edu/nldb2026',
      'no',
      'new',
      'NLDB 2026, Trondheim (NTNU).'
    ),
    (
      'Techpoint 2026',
      'https://techpointconference.no/',
      null,
      'https://techpointconference.no/',
      'no',
      'new',
      'Techpoint, Kristiansand.'
    ),
    (
      'Oslo Innovation Week 2026',
      'https://www.oiw.no/',
      null,
      'https://www.oiw.no/',
      'no',
      'new',
      'Oslo Innovation Week.'
    ),
    (
      'NDC AI 2026',
      'https://ndc-ai.com/',
      null,
      'https://ndc-ai.com/',
      'no',
      'new',
      'NDC AI, Oslo.'
    )
)
update public.ad_leads al
set
  website = lr.website,
  email = lr.email,
  source_url = lr.source_url,
  market = lr.market,
  status = lr.status,
  description = lr.description
from lead_rows lr
where lower(al.name) = lower(lr.name);

with lead_rows (name, website, email, source_url, market, status, description) as (
  values
    (
      'AI+ 2026',
      'https://smartinnovationnorway.com/en/events-2/ai-2025/',
      null,
      'https://smartinnovationnorway.com/en/events-2/ai-2025/',
      'no',
      'new',
      'AI conference (Smart Innovation Norway).'
    ),
    (
      'NORA Arskonferanse 2026',
      'https://www.nora.ai/norsk/nora-arrangementer/annual-conference-2025/',
      null,
      'https://www.nora.ai/norsk/nora-arrangementer/annual-conference-2025/',
      'no',
      'new',
      'NORA annual conference in Oslo (current public page link is 2025).'
    ),
    (
      'Women in AI 2026',
      'https://www.nora.ai/norsk/events/2026/women-in-ai-from-algorithms-to-action-living-in-th.html',
      null,
      'https://www.nora.ai/norsk/events/2026/women-in-ai-from-algorithms-to-action-living-in-th.html',
      'no',
      'new',
      'Women in AI event in Oslo.'
    ),
    (
      'Oslo Tech Show - AI 2026',
      'https://oslotechshow.com/',
      null,
      'https://oslotechshow.com/',
      'no',
      'new',
      'Oslo Tech Show (AI and Big Data).'
    ),
    (
      'NLDB 2026',
      'https://www.ntnu.edu/nldb2026',
      null,
      'https://www.ntnu.edu/nldb2026',
      'no',
      'new',
      'NLDB 2026, Trondheim (NTNU).'
    ),
    (
      'Techpoint 2026',
      'https://techpointconference.no/',
      null,
      'https://techpointconference.no/',
      'no',
      'new',
      'Techpoint, Kristiansand.'
    ),
    (
      'Oslo Innovation Week 2026',
      'https://www.oiw.no/',
      null,
      'https://www.oiw.no/',
      'no',
      'new',
      'Oslo Innovation Week.'
    ),
    (
      'NDC AI 2026',
      'https://ndc-ai.com/',
      null,
      'https://ndc-ai.com/',
      'no',
      'new',
      'NDC AI, Oslo.'
    )
)
insert into public.ad_leads (
  id,
  name,
  website,
  email,
  source_url,
  market,
  status,
  description
)
select
  gen_random_uuid(),
  lr.name,
  lr.website,
  lr.email,
  lr.source_url,
  lr.market,
  lr.status,
  lr.description
from lead_rows lr
where not exists (
  select 1
  from public.ad_leads al
  where lower(al.name) = lower(lr.name)
);

-- 3) Add/update rotating ads in placement `catalog_grid_banner`.
--    The app now accepts both `catalog_grid_banner` and `catalog_inline_card`.
with ad_rows (
  placement,
  title,
  image_url,
  mobile_image_url,
  href,
  alt,
  label,
  cta_text,
  priority,
  is_active
) as (
  values
    (
      'catalog_grid_banner',
      'AI+ 2026',
      '/ads/ai-plus-2026.png',
      '/ads/ai-plus-2026.png',
      'https://smartinnovationnorway.com/en/events-2/ai-2025/',
      'AI+ 2026 banner',
      'Sponset',
      'Se event ->',
      0,
      true
    ),
    (
      'catalog_grid_banner',
      'NORA Arskonferanse 2026',
      '/ads/nora-arskonferanse-2026.png',
      '/ads/nora-arskonferanse-2026.png',
      'https://www.nora.ai/norsk/nora-arrangementer/annual-conference-2025/',
      'NORA Arskonferanse 2026 banner',
      'Sponset',
      'Se event ->',
      0,
      true
    ),
    (
      'catalog_grid_banner',
      'Women in AI 2026',
      '/ads/women-in-ai-2026.png',
      '/ads/women-in-ai-2026.png',
      'https://www.nora.ai/norsk/events/2026/women-in-ai-from-algorithms-to-action-living-in-th.html',
      'Women in AI 2026 banner',
      'Sponset',
      'Se event ->',
      0,
      true
    ),
    (
      'catalog_grid_banner',
      'Oslo Tech Show AI 2026',
      '/ads/oslo-tech-show-ai-2026.png',
      '/ads/oslo-tech-show-ai-2026.png',
      'https://oslotechshow.com/',
      'Oslo Tech Show AI 2026 banner',
      'Sponset',
      'Se event ->',
      0,
      true
    ),
    (
      'catalog_grid_banner',
      'NLDB 2026',
      '/ads/nldb-2026.png',
      '/ads/nldb-2026.png',
      'https://www.ntnu.edu/nldb2026',
      'NLDB 2026 banner',
      'Sponset',
      'Se event ->',
      0,
      true
    ),
    (
      'catalog_grid_banner',
      'Techpoint 2026',
      '/ads/techpoint-2026.png',
      '/ads/techpoint-2026.png',
      'https://techpointconference.no/',
      'Techpoint 2026 banner',
      'Sponset',
      'Se event ->',
      0,
      true
    ),
    (
      'catalog_grid_banner',
      'Oslo Innovation Week 2026',
      '/ads/oslo-innovation-week-2026.png',
      '/ads/oslo-innovation-week-2026.png',
      'https://www.oiw.no/',
      'Oslo Innovation Week 2026 banner',
      'Sponset',
      'Se event ->',
      0,
      true
    ),
    (
      'catalog_grid_banner',
      'NDC AI 2026',
      '/ads/ndc-ai-2026.png',
      '/ads/ndc-ai-2026.png',
      'https://ndc-ai.com/',
      'NDC AI 2026 banner',
      'Sponset',
      'Se event ->',
      0,
      true
    )
)
update public.ads a
set
  image_url = ar.image_url,
  mobile_image_url = ar.mobile_image_url,
  href = ar.href,
  alt = ar.alt,
  label = ar.label,
  cta_text = ar.cta_text,
  priority = ar.priority,
  is_active = ar.is_active
from ad_rows ar
where lower(coalesce(a.title, '')) = lower(ar.title)
  and a.placement in ('catalog_grid_banner', 'catalog_inline_card');

with ad_rows (
  placement,
  title,
  image_url,
  mobile_image_url,
  href,
  alt,
  label,
  cta_text,
  priority,
  is_active
) as (
  values
    (
      'catalog_grid_banner',
      'AI+ 2026',
      '/ads/ai-plus-2026.png',
      '/ads/ai-plus-2026.png',
      'https://smartinnovationnorway.com/en/events-2/ai-2025/',
      'AI+ 2026 banner',
      'Sponset',
      'Se event ->',
      0,
      true
    ),
    (
      'catalog_grid_banner',
      'NORA Arskonferanse 2026',
      '/ads/nora-arskonferanse-2026.png',
      '/ads/nora-arskonferanse-2026.png',
      'https://www.nora.ai/norsk/nora-arrangementer/annual-conference-2025/',
      'NORA Arskonferanse 2026 banner',
      'Sponset',
      'Se event ->',
      0,
      true
    ),
    (
      'catalog_grid_banner',
      'Women in AI 2026',
      '/ads/women-in-ai-2026.png',
      '/ads/women-in-ai-2026.png',
      'https://www.nora.ai/norsk/events/2026/women-in-ai-from-algorithms-to-action-living-in-th.html',
      'Women in AI 2026 banner',
      'Sponset',
      'Se event ->',
      0,
      true
    ),
    (
      'catalog_grid_banner',
      'Oslo Tech Show AI 2026',
      '/ads/oslo-tech-show-ai-2026.png',
      '/ads/oslo-tech-show-ai-2026.png',
      'https://oslotechshow.com/',
      'Oslo Tech Show AI 2026 banner',
      'Sponset',
      'Se event ->',
      0,
      true
    ),
    (
      'catalog_grid_banner',
      'NLDB 2026',
      '/ads/nldb-2026.png',
      '/ads/nldb-2026.png',
      'https://www.ntnu.edu/nldb2026',
      'NLDB 2026 banner',
      'Sponset',
      'Se event ->',
      0,
      true
    ),
    (
      'catalog_grid_banner',
      'Techpoint 2026',
      '/ads/techpoint-2026.png',
      '/ads/techpoint-2026.png',
      'https://techpointconference.no/',
      'Techpoint 2026 banner',
      'Sponset',
      'Se event ->',
      0,
      true
    ),
    (
      'catalog_grid_banner',
      'Oslo Innovation Week 2026',
      '/ads/oslo-innovation-week-2026.png',
      '/ads/oslo-innovation-week-2026.png',
      'https://www.oiw.no/',
      'Oslo Innovation Week 2026 banner',
      'Sponset',
      'Se event ->',
      0,
      true
    ),
    (
      'catalog_grid_banner',
      'NDC AI 2026',
      '/ads/ndc-ai-2026.png',
      '/ads/ndc-ai-2026.png',
      'https://ndc-ai.com/',
      'NDC AI 2026 banner',
      'Sponset',
      'Se event ->',
      0,
      true
    )
)
insert into public.ads (
  placement,
  title,
  image_url,
  mobile_image_url,
  href,
  alt,
  label,
  cta_text,
  priority,
  is_active
)
select
  ar.placement,
  ar.title,
  ar.image_url,
  ar.mobile_image_url,
  ar.href,
  ar.alt,
  ar.label,
  ar.cta_text,
  ar.priority,
  ar.is_active
from ad_rows ar
where not exists (
  select 1
  from public.ads a
  where a.placement = ar.placement
    and lower(coalesce(a.title, '')) = lower(ar.title)
);
