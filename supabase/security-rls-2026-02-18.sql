-- Security Advisor remediation (report date: 2026-02-15)
-- Fixes RLS-disabled findings for:
-- - public.outreach_sends
-- - public.site_settings
-- - public.ad_leads
-- - public.ads

alter table if exists public.outreach_sends enable row level security;
alter table if exists public.site_settings enable row level security;
alter table if exists public.ad_leads enable row level security;
alter table if exists public.ads enable row level security;

-- Keep ads readable for public pages, but only active rows.
drop policy if exists "public read ads" on public.ads;
drop policy if exists "public read active ads" on public.ads;

create policy "public read active ads"
on public.ads
for select
to anon, authenticated
using (is_active = true);
