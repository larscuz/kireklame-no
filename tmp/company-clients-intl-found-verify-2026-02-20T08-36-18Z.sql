-- Verify client rows for enriched intl companies
select
  c.slug,
  c.name,
  array_remove(array_agg(case when l.kind = 'client' then l.label end), null) as clients
from public.companies c
left join public.links l
  on l.company_id = c.id
 and l.kind = 'client'
where c.slug in (
  'absolutely-ai',
  'aigency-amsterdam',
  'b-reel-ai',
  'clay-global',
  'hubstudio',
  'lemonlight',
  'neural-fashion',
  'radical-point-media',
  'secret-level',
  'synima'
)
group by c.slug, c.name
order by c.name;
