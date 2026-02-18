-- Showheel CMS (run in Supabase SQL editor)
-- Adds manual showreel management for /ki-reklame.

create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.showreel_entries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  href text not null,
  video_url text not null,
  description text,
  thumbnail_url text,
  eyebrow text,
  cta_label text,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_showreel_entries_sort
  on public.showreel_entries (is_active desc, sort_order asc, created_at asc);

drop trigger if exists trg_showreel_entries_updated_at on public.showreel_entries;
create trigger trg_showreel_entries_updated_at
before update on public.showreel_entries
for each row execute function public.set_updated_at();

alter table public.showreel_entries enable row level security;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'showreel_entries'
      and policyname = 'public read active showreel entries'
  ) then
    create policy "public read active showreel entries"
      on public.showreel_entries
      for select
      using (is_active = true);
  end if;
end $$;

