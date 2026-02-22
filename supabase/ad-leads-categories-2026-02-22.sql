-- Add category support for /andre-ki-tjenester listings.
-- Safe to run multiple times.

do $$
begin
  if to_regclass('public.ad_leads') is null then
    raise notice 'public.ad_leads does not exist; skipping category migration.';
    return;
  end if;

  alter table public.ad_leads
    add column if not exists category text;

  update public.ad_leads
  set category = 'ai_first_business'
  where category is null
     or btrim(category) = '';

  alter table public.ad_leads
    alter column category set default 'ai_first_business';

  alter table public.ad_leads
    alter column category set not null;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'ad_leads_category_check'
      and conrelid = 'public.ad_leads'::regclass
  ) then
    alter table public.ad_leads
      add constraint ad_leads_category_check
      check (
        category in (
          'ai_first_business',
          'ai_conference',
          'ai_education'
        )
      );
  end if;
end $$;

create index if not exists idx_ad_leads_market_category_name
  on public.ad_leads (market, category, name);
