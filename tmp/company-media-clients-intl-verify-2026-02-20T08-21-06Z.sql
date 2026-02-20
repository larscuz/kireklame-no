-- Verify international media/client link coverage
select
  c.slug,
  c.name,
  c.website,
  max(case when l.kind = 'secondary_media' then l.url end) as secondary_media_url,
  array_remove(array_agg(case when l.kind = 'client' then l.label end), null) as clients
from public.companies c
left join public.links l
  on l.company_id = c.id
 and l.kind in ('secondary_media', 'client')
where c.is_active = true
  and c.market = 'intl'
group by c.slug, c.name, c.website
order by c.name;
