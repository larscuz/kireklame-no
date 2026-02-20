-- Bulk update for company page:
-- 1) media slot under long description (kind = 'secondary_media')
-- 2) client chips at bottom (kind = 'client')
--
-- How to use:
-- - Fill secondary_media_url and client_names for each slug.
-- - Keep NULL / empty array to skip that company.
-- - Script only updates rows where at least one value is provided.
-- - Run in Supabase SQL Editor.

begin;

create temporary table _company_media_clients (
  slug text primary key,
  secondary_media_url text,
  client_names text[]
) on commit drop;

insert into _company_media_clients (slug, secondary_media_url, client_names)
values
  ('aiaiai', null, array[]::text[]),
  ('alf-gundersen', null, array[]::text[]),
  ('avia-produksjon', null, array[]::text[]),
  ('chimney-ai-studio', null, array[]::text[]),
  ('cuz-media', null, array[]::text[]),
  ('edmond-yang', null, array[]::text[]),
  ('ellevill-produksjon', null, array[]::text[]),
  ('good-morning', null, array[]::text[]),
  ('gullhaien', null, array[]::text[]),
  ('headspin', null, array[]::text[]),
  ('intelligenspartiet', null, array[]::text[]),
  ('involve', null, array[]::text[]),
  ('kreativ-ki', null, array[]::text[]),
  ('manuela-hofer', null, array[]::text[]),
  ('native', null, array[]::text[]),
  ('noa-anorak', null, array[]::text[]),
  ('reimagine-studios', null, array[]::text[]),
  ('tenk-byra', null, array[]::text[]),
  ('trim-media', null, array[]::text[]),
  ('well-told-aigency', null, array[]::text[]);

with targets as (
  select
    c.id as company_id,
    nullif(trim(s.secondary_media_url), '') as secondary_media_url,
    coalesce(s.client_names, array[]::text[]) as client_names
  from _company_media_clients s
  join companies c on c.slug = s.slug
  where
    nullif(trim(s.secondary_media_url), '') is not null
    or coalesce(array_length(s.client_names, 1), 0) > 0
)
-- Remove old managed rows only for targeted companies
-- (safe/idempotent: rerun will replace values for those rows)
delete from links l
using targets t
where l.company_id = t.company_id
  and l.kind in ('secondary_media', 'client');

-- Insert secondary media url
insert into links (company_id, kind, label, url)
select
  t.company_id,
  'secondary_media',
  'Secondary media',
  t.secondary_media_url
from (
  select
    c.id as company_id,
    nullif(trim(s.secondary_media_url), '') as secondary_media_url,
    coalesce(s.client_names, array[]::text[]) as client_names
  from _company_media_clients s
  join companies c on c.slug = s.slug
  where
    nullif(trim(s.secondary_media_url), '') is not null
    or coalesce(array_length(s.client_names, 1), 0) > 0
) t
where t.secondary_media_url is not null;

-- Insert clients (unique + trimmed per company)
insert into links (company_id, kind, label, url)
select
  t.company_id,
  'client',
  u.client_name,
  '#'
from (
  select
    c.id as company_id,
    nullif(trim(s.secondary_media_url), '') as secondary_media_url,
    coalesce(s.client_names, array[]::text[]) as client_names
  from _company_media_clients s
  join companies c on c.slug = s.slug
  where
    nullif(trim(s.secondary_media_url), '') is not null
    or coalesce(array_length(s.client_names, 1), 0) > 0
) t
cross join lateral (
  select distinct nullif(trim(raw_name), '') as client_name
  from unnest(t.client_names) as raw_name
) u
where u.client_name is not null;

commit;
