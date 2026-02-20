-- Verify social links inserted by batch

with slugs as (
  select unnest(array[
    '351-studio-ai-video-production',
    'absolutely-ai',
    'aigency-amsterdam',
    'anima-studios',
    'ai-media-agency',
    'oysters-studio',
    'phantom-x',
    'promptr-studios',
    'reimagine-studios',
    'well-told-aigency',
    'synima',
    'superside'
  ]::text[]) as slug
)
select
  c.slug,
  c.name,
  l.kind,
  l.label,
  l.url
from slugs s
join public.companies c on c.slug = s.slug
left join public.links l
  on l.company_id = c.id
 and lower(l.kind) in ('instagram', 'tiktok', 'youtube', 'facebook', 'linkedin')
order by c.slug, l.kind, l.url;
