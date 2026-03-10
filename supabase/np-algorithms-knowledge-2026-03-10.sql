-- Norsk Prompting: Algoritmer kunnskapsmodell
-- Date: 2026-03-10
-- Purpose: Supabase-ready schema for sources/claims/concepts/playbooks/diagnostics

create extension if not exists pgcrypto;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'np_algo_source_type') then
    create type public.np_algo_source_type as enum (
      'official_platform',
      'official_research',
      'academic_paper',
      'editorial'
    );
  end if;

  if not exists (select 1 from pg_type where typname = 'np_algo_platform') then
    create type public.np_algo_platform as enum (
      'instagram',
      'youtube',
      'tiktok',
      'facebook',
      'linkedin',
      'cross-platform'
    );
  end if;

  if not exists (select 1 from pg_type where typname = 'np_algo_source_status') then
    create type public.np_algo_source_status as enum (
      'active',
      'needs_review',
      'archived'
    );
  end if;

  if not exists (select 1 from pg_type where typname = 'np_algo_confidence') then
    create type public.np_algo_confidence as enum (
      'high',
      'medium',
      'low'
    );
  end if;

  if not exists (select 1 from pg_type where typname = 'np_algo_claim_type') then
    create type public.np_algo_claim_type as enum (
      'stable',
      'volatile',
      'myth',
      'interpretation'
    );
  end if;

  if not exists (select 1 from pg_type where typname = 'np_algo_teaching_use') then
    create type public.np_algo_teaching_use as enum (
      'planner',
      'diagnosis',
      'glossary',
      'myth_vs_reality'
    );
  end if;
end
$$;

create table if not exists public.np_algo_sources (
  id text primary key,
  title text not null,
  url text not null,
  source_type public.np_algo_source_type not null,
  platform public.np_algo_platform not null,
  published_at date not null,
  checked_at date not null,
  status public.np_algo_source_status not null default 'active',
  summary text not null default '',
  notes text not null default '',
  confidence public.np_algo_confidence not null default 'medium',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.np_algo_claims (
  id text primary key,
  claim_text text not null,
  plain_language text not null,
  claim_type public.np_algo_claim_type not null,
  platform public.np_algo_platform not null,
  confidence public.np_algo_confidence not null default 'medium',
  last_reviewed_at date not null,
  teaching_use public.np_algo_teaching_use not null,
  source_ids text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.np_algo_concepts (
  id text primary key,
  term text not null,
  definition_plain text not null,
  definition_technical text not null,
  platform_notes text not null default '',
  source_ids text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.np_algo_playbooks (
  id text primary key,
  goal_type text not null,
  audience_stage text not null,
  recommended_formats text[] not null default '{}',
  hook_patterns text[] not null default '{}',
  retention_patterns text[] not null default '{}',
  cta_patterns text[] not null default '{}',
  success_metrics text[] not null default '{}',
  related_claim_ids text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.np_algo_diagnostics (
  id text primary key,
  symptom text not null,
  likely_causes text[] not null default '{}',
  evidence_based_checks text[] not null default '{}',
  recommended_changes text[] not null default '{}',
  related_claim_ids text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_np_algo_sources_platform_status
  on public.np_algo_sources (platform, status, checked_at desc);

create index if not exists idx_np_algo_claims_platform_type
  on public.np_algo_claims (platform, claim_type, teaching_use);

create index if not exists idx_np_algo_claims_source_ids_gin
  on public.np_algo_claims using gin (source_ids);

create index if not exists idx_np_algo_concepts_source_ids_gin
  on public.np_algo_concepts using gin (source_ids);

create index if not exists idx_np_algo_playbooks_related_claim_ids_gin
  on public.np_algo_playbooks using gin (related_claim_ids);

create index if not exists idx_np_algo_diagnostics_related_claim_ids_gin
  on public.np_algo_diagnostics using gin (related_claim_ids);

drop trigger if exists trg_np_algo_sources_updated_at on public.np_algo_sources;
create trigger trg_np_algo_sources_updated_at
before update on public.np_algo_sources
for each row execute function public.set_updated_at();

drop trigger if exists trg_np_algo_claims_updated_at on public.np_algo_claims;
create trigger trg_np_algo_claims_updated_at
before update on public.np_algo_claims
for each row execute function public.set_updated_at();

drop trigger if exists trg_np_algo_concepts_updated_at on public.np_algo_concepts;
create trigger trg_np_algo_concepts_updated_at
before update on public.np_algo_concepts
for each row execute function public.set_updated_at();

drop trigger if exists trg_np_algo_playbooks_updated_at on public.np_algo_playbooks;
create trigger trg_np_algo_playbooks_updated_at
before update on public.np_algo_playbooks
for each row execute function public.set_updated_at();

drop trigger if exists trg_np_algo_diagnostics_updated_at on public.np_algo_diagnostics;
create trigger trg_np_algo_diagnostics_updated_at
before update on public.np_algo_diagnostics
for each row execute function public.set_updated_at();

alter table public.np_algo_sources enable row level security;
alter table public.np_algo_claims enable row level security;
alter table public.np_algo_concepts enable row level security;
alter table public.np_algo_playbooks enable row level security;
alter table public.np_algo_diagnostics enable row level security;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'np_algo_sources'
      and policyname = 'public read np_algo_sources'
  ) then
    create policy "public read np_algo_sources"
      on public.np_algo_sources
      for select
      using (true);
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'np_algo_claims'
      and policyname = 'public read np_algo_claims'
  ) then
    create policy "public read np_algo_claims"
      on public.np_algo_claims
      for select
      using (true);
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'np_algo_concepts'
      and policyname = 'public read np_algo_concepts'
  ) then
    create policy "public read np_algo_concepts"
      on public.np_algo_concepts
      for select
      using (true);
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'np_algo_playbooks'
      and policyname = 'public read np_algo_playbooks'
  ) then
    create policy "public read np_algo_playbooks"
      on public.np_algo_playbooks
      for select
      using (true);
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'np_algo_diagnostics'
      and policyname = 'public read np_algo_diagnostics'
  ) then
    create policy "public read np_algo_diagnostics"
      on public.np_algo_diagnostics
      for select
      using (true);
  end if;
end
$$;
