create table if not exists public.site_settings (
  id integer primary key default 1,
  featured_company_slug text,
  featured_hero_video_url text,
  companies_featured_company_slug text,
  companies_hero_video_url text,
  international_featured_company_slug text,
  international_hero_video_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table if exists public.site_settings
  add column if not exists featured_hero_poster_url text,
  add column if not exists companies_hero_poster_url text,
  add column if not exists international_hero_poster_url text,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

insert into public.site_settings (id)
values (1)
on conflict (id) do nothing;

drop trigger if exists trg_site_settings_updated_at on public.site_settings;
create trigger trg_site_settings_updated_at
before update on public.site_settings
for each row execute function public.set_updated_at();

alter table if exists public.site_settings enable row level security;
