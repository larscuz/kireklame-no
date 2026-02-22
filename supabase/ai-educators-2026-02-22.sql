-- AI Educators schema for "AI Creative Intelligence Feed"
-- Safe to run multiple times.

create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.ai_educators (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  platform text not null
    check (platform in ('youtube', 'linkedin', 'discord', 'x', 'newsletter', 'website', 'other')),
  url text not null,
  niche text not null
    check (niche in ('video', 'automation', 'image', 'strategy', 'audio', 'agents', 'prompting', 'general')),
  update_frequency text not null default 'weekly'
    check (update_frequency in ('daily', 'multi_weekly', 'weekly', 'biweekly', 'monthly', 'sporadic', 'unknown')),
  free_content_score int not null default 50
    check (free_content_score between 0 and 100),
  transparency_score int not null default 50
    check (transparency_score between 0 and 100),
  depth_score int not null default 50
    check (depth_score between 0 and 100),
  hype_level int not null default 50
    check (hype_level between 0 and 100),
  commercial_bias_score int not null default 50
    check (commercial_bias_score between 0 and 100),
  language text not null default 'en'
    check (language in ('no', 'en', 'sv', 'da', 'fi', 'de', 'fr', 'es', 'other')),
  region text not null default 'global'
    check (region in ('global', 'nordic', 'norway', 'europe', 'usa', 'other')),
  platform_handle text,
  notes text,
  last_checked timestamptz,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ai_educator_updates (
  id uuid primary key default gen_random_uuid(),
  educator_id uuid not null references public.ai_educators(id) on delete cascade,
  external_id text not null,
  platform text not null
    check (platform in ('youtube', 'linkedin', 'discord', 'x', 'newsletter', 'website', 'other')),
  content_type text not null default 'post'
    check (content_type in ('post', 'video', 'thread', 'message', 'article')),
  title text not null,
  description text,
  url text not null,
  published_at timestamptz,
  captured_at timestamptz not null default now(),
  view_count int,
  like_count int,
  comment_count int,
  keyword_tags text[] not null default '{}',
  signal_depth int not null default 50
    check (signal_depth between 0 and 100),
  signal_hype int not null default 50
    check (signal_hype between 0 and 100),
  signal_transparency int not null default 50
    check (signal_transparency between 0 and 100),
  notes text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (educator_id, external_id)
);

drop trigger if exists trg_ai_educators_updated_at on public.ai_educators;
create trigger trg_ai_educators_updated_at
before update on public.ai_educators
for each row execute function public.set_updated_at();

drop trigger if exists trg_ai_educator_updates_updated_at on public.ai_educator_updates;
create trigger trg_ai_educator_updates_updated_at
before update on public.ai_educator_updates
for each row execute function public.set_updated_at();

create index if not exists idx_ai_educators_platform_niche
  on public.ai_educators (platform, niche, is_active, last_checked desc);

create index if not exists idx_ai_educators_region_language
  on public.ai_educators (region, language, is_active);

create index if not exists idx_ai_educator_updates_educator_published
  on public.ai_educator_updates (educator_id, published_at desc);

create index if not exists idx_ai_educator_updates_platform_published
  on public.ai_educator_updates (platform, published_at desc);

create index if not exists idx_ai_educator_updates_keyword_tags
  on public.ai_educator_updates using gin (keyword_tags);

create or replace view public.ai_educator_rankings as
select
  e.*,
  round(
    (
      e.free_content_score * 0.30 +
      e.transparency_score * 0.25 +
      e.depth_score * 0.25 +
      (100 - e.hype_level) * 0.10 +
      (100 - e.commercial_bias_score) * 0.10
    )::numeric,
    1
  ) as computed_score
from public.ai_educators e
where e.is_active = true;

alter table public.ai_educators enable row level security;
alter table public.ai_educator_updates enable row level security;

drop policy if exists "public read active ai educators" on public.ai_educators;
create policy "public read active ai educators"
on public.ai_educators
for select
to anon, authenticated
using (is_active = true);

drop policy if exists "public read active ai educator updates" on public.ai_educator_updates;
create policy "public read active ai educator updates"
on public.ai_educator_updates
for select
to anon, authenticated
using (
  is_active = true
  and exists (
    select 1
    from public.ai_educators e
    where e.id = educator_id
      and e.is_active = true
  )
);

grant select on public.ai_educators to anon, authenticated;
grant select on public.ai_educator_updates to anon, authenticated;
grant select on public.ai_educator_rankings to anon, authenticated;

grant all on public.ai_educators to service_role;
grant all on public.ai_educator_updates to service_role;
grant select on public.ai_educator_rankings to service_role;
