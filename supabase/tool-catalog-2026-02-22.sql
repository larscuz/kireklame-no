-- Secondary catalog: KI-verktøy
-- Safe to run multiple times.

create extension if not exists "pgcrypto";

create table if not exists public.tool_catalog_entries (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  website text not null,
  description text,
  category text not null,
  source_url text,
  sort_order integer not null default 100,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint tool_catalog_entries_category_check
    check (category in ('adcreative', 'image_video_tools'))
);

create index if not exists idx_tool_catalog_entries_category_sort
  on public.tool_catalog_entries (category, sort_order, name);

alter table public.tool_catalog_entries enable row level security;

drop policy if exists "public read active tool catalog" on public.tool_catalog_entries;
create policy "public read active tool catalog"
on public.tool_catalog_entries
for select
to anon, authenticated
using (is_active = true);

grant select on public.tool_catalog_entries to anon, authenticated;
grant all on public.tool_catalog_entries to service_role;

insert into public.tool_catalog_entries (
  slug,
  name,
  website,
  description,
  category,
  source_url,
  sort_order,
  is_active
)
values
  (
    'adcreative-ai',
    'AdCreative.ai',
    'https://www.adcreative.ai/',
    'Genererer annonsekreativer og varianter for betalte kampanjer.',
    'adcreative',
    'https://no.adcreative.ai/post/15-powerful-ai-tools-you-need-to-try',
    10,
    true
  ),
  (
    'phrasee',
    'Phrasee',
    'https://phrasee.co/',
    'Optimaliserer annonsetekst og budskap for e-post, SMS og kampanjer.',
    'adcreative',
    'https://no.adcreative.ai/post/15-powerful-ai-tools-you-need-to-try',
    20,
    true
  ),
  (
    'copy-ai',
    'Copy.ai',
    'https://www.copy.ai/',
    'Skriveverktøy for annonsetekst, landingssider og kampanjeutkast.',
    'adcreative',
    'https://no.adcreative.ai/post/15-powerful-ai-tools-you-need-to-try',
    30,
    true
  ),
  (
    'marketmuse',
    'MarketMuse',
    'https://www.marketmuse.com/',
    'Støtter innholdsstrategi og tematisk planlegging for markedsføring.',
    'adcreative',
    'https://no.adcreative.ai/post/15-powerful-ai-tools-you-need-to-try',
    40,
    true
  ),
  (
    'smartwriter-ai',
    'SmartWriter.ai',
    'https://www.smartwriter.ai/',
    'Automatiserer personalisert outreach og salgsrelatert tekst.',
    'adcreative',
    'https://no.adcreative.ai/post/15-powerful-ai-tools-you-need-to-try',
    50,
    true
  ),
  (
    'flick',
    'Flick',
    'https://flick.social/',
    'Planlegging og tekstproduksjon for innhold i sosiale medier.',
    'adcreative',
    'https://no.adcreative.ai/post/15-powerful-ai-tools-you-need-to-try',
    60,
    true
  ),
  (
    'cortex',
    'Cortex',
    'https://meetcortex.com/',
    'Analyseverktøy for kreativ ytelse og innholdsbeslutninger.',
    'adcreative',
    'https://no.adcreative.ai/post/15-powerful-ai-tools-you-need-to-try',
    70,
    true
  ),
  (
    'chatgpt',
    'ChatGPT',
    'https://chatgpt.com/',
    'Generell assistent for idéutvikling, tekst og arbeidsflyt.',
    'adcreative',
    'https://no.adcreative.ai/post/15-powerful-ai-tools-you-need-to-try',
    80,
    true
  ),
  (
    'feathery',
    'Feathery',
    'https://www.feathery.io/',
    'Form- og flytbygger for leadfangst og datainnsamling i kampanjer.',
    'adcreative',
    'https://no.adcreative.ai/post/15-powerful-ai-tools-you-need-to-try',
    90,
    true
  ),
  (
    'boost-ai',
    'Boost.ai',
    'https://www.boost.ai/',
    'Samtalebasert AI for kundedialog og automatisering i kanal.',
    'adcreative',
    'https://no.adcreative.ai/post/15-powerful-ai-tools-you-need-to-try',
    100,
    true
  ),
  (
    'runway',
    'Runway',
    'https://runwayml.com/',
    'Videoverktøy for generering, redigering og raske storyboard-varianter.',
    'image_video_tools',
    'https://aiavisen.no/ai-verktoy/',
    110,
    true
  ),
  (
    'synthesia',
    'Synthesia',
    'https://www.synthesia.io/',
    'Avatarbasert videoproduksjon for opplæring, presentasjoner og kampanjer.',
    'image_video_tools',
    'https://aiavisen.no/ai-verktoy/',
    120,
    true
  ),
  (
    'adobe-firefly',
    'Adobe Firefly',
    'https://www.adobe.com/products/firefly.html',
    'Bilde- og designgenerering med integrasjon mot Adobe-arbeidsflyt.',
    'image_video_tools',
    'https://aiavisen.no/ai-verktoy/',
    130,
    true
  ),
  (
    'canva',
    'Canva',
    'https://www.canva.com/',
    'Designplattform med AI-støtte for bilde, presentasjon og enkle videoer.',
    'image_video_tools',
    'https://aiavisen.no/ai-verktoy/',
    140,
    true
  ),
  (
    'midjourney',
    'Midjourney',
    'https://www.midjourney.com/',
    'Bildegenerator brukt til konseptvisualisering og visuell idétesting.',
    'image_video_tools',
    'https://aiavisen.no/ai-verktoy/',
    150,
    true
  ),
  (
    'dall-e',
    'DALL-E',
    'https://openai.com/dall-e',
    'Bildegenerering fra tekstprompt for skisser og tidlig konseptarbeid.',
    'image_video_tools',
    'https://aiavisen.no/ai-verktoy/',
    160,
    true
  ),
  (
    'stable-diffusion',
    'Stable Diffusion',
    'https://stability.ai/stable-diffusion',
    'Modellfamilie for bildeproduksjon med fleksibel kontroll og varianter.',
    'image_video_tools',
    'https://aiavisen.no/ai-verktoy/',
    170,
    true
  ),
  (
    'kling',
    'Kling',
    'https://klingai.com/',
    'AI-videoverktøy for generering av korte klipp og bevegelig innhold.',
    'image_video_tools',
    'https://aiavisen.no/ai-verktoy/',
    180,
    true
  ),
  (
    'veo',
    'Veo',
    'https://deepmind.google/models/veo/',
    'Videomodell for høyere visuell kvalitet i tekst-til-video-eksperimenter.',
    'image_video_tools',
    'https://aiavisen.no/ai-verktoy/',
    190,
    true
  ),
  (
    'heygen',
    'HeyGen',
    'https://www.heygen.com/',
    'Avatarvideo og flerspråklig presentasjon for markeds- og informasjonsinnhold.',
    'image_video_tools',
    'https://aiavisen.no/ai-verktoy/',
    200,
    true
  )
on conflict (slug) do update
set
  name = excluded.name,
  website = excluded.website,
  description = excluded.description,
  category = excluded.category,
  source_url = excluded.source_url,
  sort_order = excluded.sort_order,
  is_active = excluded.is_active,
  updated_at = now();
