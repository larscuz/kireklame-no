-- Verify Superside description + media #2
select
  c.slug,
  c.name,
  c.short_description,
  c.description,
  max(case when l.kind = 'secondary_media' then l.url end) as secondary_media_url
from public.companies c
left join public.links l
  on l.company_id = c.id
 and l.kind = 'secondary_media'
where c.slug = 'superside'
group by c.slug, c.name, c.short_description, c.description;
