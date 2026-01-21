-- KIREKLAME.NO v1 schema
-- Kjør i Supabase SQL editor.

create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.locations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  region text,
  country text not null default 'Norge',
  created_at timestamptz not null default now()
);

create table if not exists public.tags (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  kind text not null default 'capability',
  created_at timestamptz not null default now()
);

create table if not exists public.companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  short_description text,
  description text,
  ai_level int not null default 2 check (ai_level between 0 and 5),
  price_level int not null default 2 check (price_level between 0 and 4),
  company_type text not null default 'byrå',
  website text,
  email text,
  phone text,
  cover_image text,
  location_id uuid references public.locations(id) on delete set null,
  is_verified boolean not null default false,
  is_placeholder boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trg_companies_updated_at
before update on public.companies
for each row execute function public.set_updated_at();

create table if not exists public.company_tags (
  company_id uuid references public.companies(id) on delete cascade,
  tag_id uuid references public.tags(id) on delete cascade,
  primary key (company_id, tag_id)
);

create table if not exists public.links (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  kind text not null,
  label text,
  url text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trg_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create table if not exists public.claims (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'pending',
  message text,
  created_at timestamptz not null default now(),
  unique (company_id, user_id)
);

create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  company_name text not null,
  website text,
  location text,
  tags text,
  notes text,
  contact_email text,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

alter table public.locations enable row level security;
alter table public.tags enable row level security;
alter table public.companies enable row level security;
alter table public.company_tags enable row level security;
alter table public.links enable row level security;
alter table public.profiles enable row level security;
alter table public.claims enable row level security;
alter table public.submissions enable row level security;

create policy "public read locations" on public.locations
for select using (true);

create policy "public read tags" on public.tags
for select using (true);

create policy "public read companies" on public.companies
for select using (true);

create policy "public read company_tags" on public.company_tags
for select using (true);

create policy "public read links" on public.links
for select using (true);

create policy "read own profile" on public.profiles
for select using (auth.uid() = id);

create policy "upsert own profile" on public.profiles
for insert with check (auth.uid() = id);

create policy "update own profile" on public.profiles
for update using (auth.uid() = id);

create policy "insert claim" on public.claims
for insert with check (auth.uid() = user_id);

create policy "read own claims" on public.claims
for select using (auth.uid() = user_id);

create policy "insert submissions" on public.submissions
for insert with check (true);
