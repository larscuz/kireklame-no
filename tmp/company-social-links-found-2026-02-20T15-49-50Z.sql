-- Social links enrichment (manual discovery batch)
-- Date: 2026-02-20
-- Scope: only targeted slugs below
-- Behavior: replace existing social kinds for those slugs, keep all other link kinds untouched.

begin;

create temporary table _company_social_links (
  slug text not null,
  kind text not null,
  label text not null,
  url text not null,
  primary key (slug, kind)
) on commit drop;

insert into _company_social_links (slug, kind, label, url)
values
  ('351-studio-ai-video-production', 'instagram', 'Instagram', 'https://www.instagram.com/351studio/'),

  ('absolutely-ai', 'instagram', 'Instagram', 'https://www.instagram.com/absolutely.ai/reels/'),
  ('absolutely-ai', 'linkedin', 'LinkedIn', 'https://au.linkedin.com/company/absolutely-ai'),

  ('aigency-amsterdam', 'instagram', 'Instagram', 'https://www.instagram.com/aigency.amsterdam/'),
  ('aigency-amsterdam', 'linkedin', 'LinkedIn', 'https://www.linkedin.com/company/aigency-amsterdam/'),

  ('anima-studios', 'instagram', 'Instagram', 'https://instagram.com/animastudios.ai'),
  ('anima-studios', 'tiktok', 'TikTok', 'https://www.tiktok.com/@anima.journeys'),
  ('anima-studios', 'youtube', 'YouTube', 'https://www.youtube.com/@AnimaStudiosAI'),

  ('ai-media-agency', 'youtube', 'YouTube', 'https://www.youtube.com/@AI-Media-Agency'),

  ('oysters-studio', 'instagram', 'Instagram', 'https://www.instagram.com/oysters_studio/'),
  ('oysters-studio', 'youtube', 'YouTube', 'https://www.youtube.com/@Oysters2024'),
  ('oysters-studio', 'linkedin', 'LinkedIn', 'https://www.linkedin.com/company/oysters-studio/'),

  ('phantom-x', 'instagram', 'Instagram', 'https://www.instagram.com/phantomx.ai/'),

  ('promptr-studios', 'instagram', 'Instagram', 'https://www.instagram.com/promptrstudios'),
  ('promptr-studios', 'tiktok', 'TikTok', 'https://www.tiktok.com/@promptrstudios'),
  ('promptr-studios', 'youtube', 'YouTube', 'https://youtube.com/@promptrstudios'),
  ('promptr-studios', 'linkedin', 'LinkedIn', 'https://www.linkedin.com/company/promptrstudios/'),

  ('reimagine-studios', 'instagram', 'Instagram', 'https://www.instagram.com/reimaginestudios.ai'),
  ('reimagine-studios', 'linkedin', 'LinkedIn', 'https://www.linkedin.com/company/reimaginestudios/'),

  ('well-told-aigency', 'instagram', 'Instagram', 'https://www.instagram.com/welltoldaigency'),
  ('well-told-aigency', 'youtube', 'YouTube', 'https://www.youtube.com/@WellTold-storytelling'),
  ('well-told-aigency', 'facebook', 'Facebook', 'https://www.facebook.com/welltoldaigency'),
  ('well-told-aigency', 'linkedin', 'LinkedIn', 'https://www.linkedin.com/company/well-told-aigency/'),

  ('synima', 'linkedin', 'LinkedIn', 'https://www.linkedin.com/company/synima'),
  ('superside', 'linkedin', 'LinkedIn', 'https://www.linkedin.com/company/superside');

create temporary table _payload as
select
  c.id as company_id,
  lower(trim(s.kind)) as kind,
  s.label,
  trim(s.url) as url
from _company_social_links s
join public.companies c
  on c.slug = s.slug
where nullif(trim(s.url), '') is not null;

-- Replace existing row(s) by company + social kind for this batch.
-- This keeps unrelated link kinds (e.g. secondary_media, client, website).
delete from public.links l
using _payload p
where l.company_id = p.company_id
  and lower(l.kind) = p.kind;

insert into public.links (company_id, kind, label, url)
select distinct
  p.company_id,
  p.kind,
  p.label,
  p.url
from _payload p;

commit;
