-- International bulk update for company page media + clients
-- Date: 2026-02-20
--
-- What this does:
-- 1) For all active international companies (market='intl'):
--    - sets secondary media (kind='secondary_media') from companies.website
-- 2) Clears/rebuilds managed link kinds ('secondary_media','client') for those companies
--
-- Why clients are empty here:
-- - We only populate explicit client names when verified from source text.
-- - This script focuses on guaranteed-safe autofill (media slot) first.

begin;

create temporary table _payload on commit drop as
with intl_companies as (
  select
    c.id as company_id,
    c.slug,
    nullif(trim(c.website), '') as secondary_media_url
  from public.companies c
  where c.is_active = true
    and c.market = 'intl'
),
manual_clients as (
  -- Add verified client names here when available, e.g.:
  -- select 'some-slug'::text as slug, array['Client A','Client B']::text[] as client_names
  select null::text as slug, array[]::text[] as client_names
  where false
)
select
  i.company_id,
  i.slug,
  i.secondary_media_url,
  coalesce(mc.client_names, array[]::text[]) as client_names
from intl_companies i
left join manual_clients mc on mc.slug = i.slug
where i.secondary_media_url is not null
   or coalesce(array_length(mc.client_names, 1), 0) > 0;

-- Remove old managed rows only for targeted companies
delete from public.links l
using _payload p
where l.company_id = p.company_id
  and l.kind in ('secondary_media', 'client');

-- Insert secondary media URLs
insert into public.links (company_id, kind, label, url)
select
  p.company_id,
  'secondary_media',
  'Secondary media',
  p.secondary_media_url
from _payload p
where p.secondary_media_url is not null;

-- Insert clients (if any in manual_clients)
insert into public.links (company_id, kind, label, url)
select
  p.company_id,
  'client',
  c.client_name,
  '#'
from _payload p
cross join lateral (
  select distinct nullif(trim(raw_name), '') as client_name
  from unnest(p.client_names) as raw_name
) c
where c.client_name is not null;

commit;
