-- Autofill bulk update for company page media + clients
-- Generated from local crawl output: tmp/company-description-crawl-2026-02-20T07-26-22-679Z.user-list.json
-- Date: 2026-02-20
--
-- Notes:
-- - secondary_media_url is set to a best-effort “more to see” URL per company
-- - client_names is only set where client names were explicitly observed

begin;

create temporary table _company_media_clients (
  slug text primary key,
  secondary_media_url text,
  client_names text[]
) on commit drop;

insert into _company_media_clients (slug, secondary_media_url, client_names)
values
  ('aiaiai', 'https://aiaiai.as/', array[]::text[]),
  ('alf-gundersen', 'https://alfgundersen.no/tjenester/', array[]::text[]),
  ('avia-produksjon', 'https://www.aviaprod.no/tjenester/reklamefilm', array[]::text[]),
  ('chimney-ai-studio', 'https://www.chimney.se/ourwork', array['Cartier', 'LVMH', 'Nissan', 'Range Rover', 'Unilever', 'Coca-Cola', 'Community Fibre']::text[]),
  ('cuz-media', 'https://cuzmedia.no/', array[]::text[]),
  ('edmond-yang', 'https://www.instagram.com/edmondyang/', array[]::text[]),
  ('ellevill-produksjon', 'https://www.ellevillprod.no/projects/viral-kampanjefilm-om-adhd', array['ADHD Norge']::text[]),
  ('good-morning', 'https://www.goodmorning.no/tjenester', array[]::text[]),
  ('gullhaien', 'https://gullhaien.no/', array[]::text[]),
  ('headspin', 'https://www.headspin.no/tjenester/', array[]::text[]),
  ('intelligenspartiet', 'https://www.intelligenspartiet.no/', array[]::text[]),
  ('involve', 'https://www.involve.no/', array[]::text[]),
  ('kreativ-ki', 'https://www.kreativki.no/tjenester', array[]::text[]),
  ('manuela-hofer', 'https://www.manuelahofer.com/work-1', array[]::text[]),
  ('native', 'https://native.no/', array[]::text[]),
  ('noa-anorak', 'https://www.anorak.no/', array[]::text[]),
  ('reimagine-studios', 'https://reimagine.no/services', array[]::text[]),
  ('tenk-byra', 'https://www.tenkbyra.no/tjenester/', array[]::text[]),
  ('trim-media', 'https://trimmedia.no', array[]::text[]),
  ('well-told-aigency', 'https://www.welltold.no/', array['Tpluss']::text[]);

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
delete from links l
using targets t
where l.company_id = t.company_id
  and l.kind in ('secondary_media', 'client');

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
