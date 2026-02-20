-- Update Superside profile: expanded description + media #2
-- Date: 2026-02-20

begin;

with target as (
  select id
  from public.companies
  where slug = 'superside'
  limit 1
)
update public.companies c
set
  short_description = 'Global AI-drevet kreativ partner for design, annonser og video i høyt tempo.',
  description = 'Superside er en global, AI-drevet kreativ partner som hjelper markeds- og inhouse-team med å produsere design, annonser, video, motion og brand-innhold i høy hastighet. Selskapet kombinerer erfarne kreative team med AI-arbeidsflyter for å levere kampanjer raskere, med mer testing og bedre kostnadseffektivitet enn tradisjonelle produksjonsmodeller. Leveransen dekker blant annet performance-kreativer, innhold for sosiale medier, landingssider, illustrasjon, animasjon og videoproduksjon for større virksomheter. Modellen er bygget for kontinuerlig produksjon, tydelige SLA-er og tett samarbeid på tvers av strategi, kreativitet og produksjon.',
  updated_at = now()
from target t
where c.id = t.id;

-- Replace media #2 link (used on company page under long description)
delete from public.links l
using public.companies c
where l.company_id = c.id
  and c.slug = 'superside'
  and l.kind = 'secondary_media';

insert into public.links (company_id, kind, label, url)
select
  c.id,
  'secondary_media',
  'Secondary media',
  'https://www.superside.com/work'
from public.companies c
where c.slug = 'superside';

commit;
