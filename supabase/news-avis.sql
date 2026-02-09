-- Kjør denne i Supabase SQL editor for å aktivere KI-Avis CMS/crawler.

create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.news_articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  source_name text not null,
  source_url text not null unique,
  source_domain text,
  language text not null default 'no',
  published_at timestamptz,
  discovered_at timestamptz not null default now(),
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  perspective text not null default 'neutral' check (perspective in ('critical', 'adoption', 'neutral')),
  topic_tags text[] not null default '{}',
  is_paywalled boolean not null default false,
  paywall_note text,
  excerpt text,
  summary text,
  body text,
  hero_image_url text,
  crawl_run_id text,
  crawl_query text,
  cloudflare_worker_hint text,
  evidence jsonb,
  editor_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_news_articles_updated_at on public.news_articles;
create trigger trg_news_articles_updated_at
before update on public.news_articles
for each row execute function public.set_updated_at();

create index if not exists idx_news_articles_status_published_at
  on public.news_articles(status, published_at desc);

create index if not exists idx_news_articles_topic_tags
  on public.news_articles using gin(topic_tags);

alter table public.news_articles enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'news_articles'
      and policyname = 'public read published news'
  ) then
    create policy "public read published news" on public.news_articles
      for select using (status = 'published');
  end if;
end $$;
