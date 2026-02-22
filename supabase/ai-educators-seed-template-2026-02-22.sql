-- Seed template for public.ai_educators + public.ai_educator_updates
-- Kjør denne etter: supabase/ai-educators-2026-02-22.sql
--
-- Tips:
-- - Start med 10-20 profiler (Nordic + Global)
-- - Hold scorefelter nøkterne; juster etter manuell vurdering
-- - Bruk samme "external_id" fra kildeplattform for idempotent upsert

with educators_seed (
  slug,
  name,
  platform,
  url,
  niche,
  update_frequency,
  free_content_score,
  transparency_score,
  depth_score,
  hype_level,
  commercial_bias_score,
  language,
  region,
  platform_handle,
  notes,
  last_checked,
  is_active
) as (
  values
    -- EKSEMPLER (erstatt/utvid):
    (
      'example-runway-educator',
      'Example Runway Educator',
      'youtube',
      'https://www.youtube.com/@example',
      'video',
      'weekly',
      88,
      82,
      86,
      24,
      36,
      'en',
      'global',
      '@example',
      'Deler konkrete workflows og tester.',
      now(),
      true
    ),
    (
      'example-nordic-linkedin',
      'Example Nordic AI Creative',
      'linkedin',
      'https://www.linkedin.com/in/example',
      'automation',
      'multi_weekly',
      84,
      79,
      80,
      30,
      42,
      'no',
      'nordic',
      null,
      'Fokus på produksjonspipeline i Norden.',
      now(),
      true
    )
)
insert into public.ai_educators (
  slug,
  name,
  platform,
  url,
  niche,
  update_frequency,
  free_content_score,
  transparency_score,
  depth_score,
  hype_level,
  commercial_bias_score,
  language,
  region,
  platform_handle,
  notes,
  last_checked,
  is_active
)
select
  slug,
  name,
  platform,
  url,
  niche,
  update_frequency,
  free_content_score,
  transparency_score,
  depth_score,
  hype_level,
  commercial_bias_score,
  language,
  region,
  platform_handle,
  notes,
  last_checked,
  is_active
from educators_seed
on conflict (slug) do update
set
  name = excluded.name,
  platform = excluded.platform,
  url = excluded.url,
  niche = excluded.niche,
  update_frequency = excluded.update_frequency,
  free_content_score = excluded.free_content_score,
  transparency_score = excluded.transparency_score,
  depth_score = excluded.depth_score,
  hype_level = excluded.hype_level,
  commercial_bias_score = excluded.commercial_bias_score,
  language = excluded.language,
  region = excluded.region,
  platform_handle = excluded.platform_handle,
  notes = excluded.notes,
  last_checked = excluded.last_checked,
  is_active = excluded.is_active,
  updated_at = now();

with updates_seed (
  educator_slug,
  external_id,
  platform,
  content_type,
  title,
  description,
  url,
  published_at,
  view_count,
  like_count,
  comment_count,
  keyword_tags,
  signal_depth,
  signal_hype,
  signal_transparency,
  notes,
  is_active
) as (
  values
    -- EKSEMPEL: oppdateringsrad fra YouTube/LinkedIn/Discord
    (
      'example-runway-educator',
      'yt:abc123',
      'youtube',
      'video',
      'Runway workflow fra brief til leveranse',
      'Stegvis gjennomgang med konkrete promptregler.',
      'https://www.youtube.com/watch?v=abc123',
      '2026-02-22T08:00:00Z'::timestamptz,
      12000,
      830,
      92,
      array['runway','workflow','prompting'],
      84,
      22,
      80,
      'God balanse mellom test og forklaring.',
      true
    )
)
insert into public.ai_educator_updates (
  educator_id,
  external_id,
  platform,
  content_type,
  title,
  description,
  url,
  published_at,
  view_count,
  like_count,
  comment_count,
  keyword_tags,
  signal_depth,
  signal_hype,
  signal_transparency,
  notes,
  is_active
)
select
  e.id,
  s.external_id,
  s.platform,
  s.content_type,
  s.title,
  s.description,
  s.url,
  s.published_at,
  s.view_count,
  s.like_count,
  s.comment_count,
  s.keyword_tags,
  s.signal_depth,
  s.signal_hype,
  s.signal_transparency,
  s.notes,
  s.is_active
from updates_seed s
join public.ai_educators e on e.slug = s.educator_slug
on conflict (educator_id, external_id) do update
set
  platform = excluded.platform,
  content_type = excluded.content_type,
  title = excluded.title,
  description = excluded.description,
  url = excluded.url,
  published_at = excluded.published_at,
  view_count = excluded.view_count,
  like_count = excluded.like_count,
  comment_count = excluded.comment_count,
  keyword_tags = excluded.keyword_tags,
  signal_depth = excluded.signal_depth,
  signal_hype = excluded.signal_hype,
  signal_transparency = excluded.signal_transparency,
  notes = excluded.notes,
  is_active = excluded.is_active;
