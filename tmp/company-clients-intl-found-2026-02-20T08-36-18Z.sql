-- International clients enrichment (verified from public pages/search snippets)
-- Date: 2026-02-20
--
-- This script updates ONLY kind='client' rows for the listed slugs.
-- secondary_media links are untouched.

begin;

create temporary table _intl_clients (
  slug text primary key,
  client_names text[] not null
) on commit drop;

insert into _intl_clients (slug, client_names)
values
  ('absolutely-ai', array['Modus Brewing', 'NFL', 'Sony', 'ESPN', 'Kayo', 'Optus']::text[]),
  ('aigency-amsterdam', array['KPMG', 'Panasonic', 'TomTom']::text[]),
  ('b-reel-ai', array['Tre', 'HelloFresh', 'Stokke', 'IKEA', 'H&M', 'Save the Children', 'Storytel']::text[]),
  ('clay-global', array['Google', 'Amazon', 'Slack', 'ADP', 'VMware', 'Okta', 'Splunk', 'Stripe']::text[]),
  ('hubstudio', array['age20', '1834 Gin', 'Shiseido', 'RQ PYOLOGY', 'Mexicash', 'HiSense', 'Camper', 'L''infuseur']::text[]),
  ('lemonlight', array['Wayfair', 'Uber', 'Tripadvisor', 'Toyota', 'Verizon Media', 'UCLA', 'Amazon', 'Walmart Connect']::text[]),
  ('neural-fashion', array['Susmies', 'Pronovias', 'Desigual', 'Sepiia', 'Carmen Says', 'Escorpion', 'G·LEM', 'thehub78']::text[]),
  ('radical-point-media', array['Amazon Studios', 'A&E Networks', 'Bell Media', 'Corus Entertainment', 'Entertainment One', 'NBC Universal', 'Vice Media', 'Warner Brothers Studios']::text[]),
  ('secret-level', array['Coca-Cola']::text[]),
  ('synima', array['Zerto', 'J.P. Morgan', 'Honeywell', 'Laowa']::text[]);

with target_companies as (
  select c.id as company_id, c.slug, ic.client_names
  from public.companies c
  join _intl_clients ic on ic.slug = c.slug
  where c.is_active = true
    and c.market = 'intl'
)
-- Remove existing client rows for targeted companies
-- so reruns are idempotent.
delete from public.links l
using target_companies t
where l.company_id = t.company_id
  and l.kind = 'client';

-- Insert fresh client rows
insert into public.links (company_id, kind, label, url)
select
  t.company_id,
  'client',
  c.client_name,
  '#'
from (
  select c.id as company_id, ic.client_names
  from public.companies c
  join _intl_clients ic on ic.slug = c.slug
  where c.is_active = true
    and c.market = 'intl'
) t
cross join lateral (
  select distinct nullif(trim(raw_name), '') as client_name
  from unnest(t.client_names) as raw_name
) c
where c.client_name is not null;

commit;
