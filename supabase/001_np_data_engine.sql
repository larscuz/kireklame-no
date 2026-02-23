-- Norsk Prompting Data Engine
-- Kjor denne i Supabase SQL editor.

create extension if not exists pgcrypto;
create extension if not exists vector;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'np_item_type') then
    create type np_item_type as enum (
      'rule',
      'term',
      'template',
      'example',
      'negative_preset',
      'representation_switch'
    );
  end if;

  if not exists (select 1 from pg_type where typname = 'np_item_status') then
    create type np_item_status as enum ('active', 'deprecated', 'draft');
  end if;

  if not exists (select 1 from pg_type where typname = 'np_ingest_status') then
    create type np_ingest_status as enum ('pending', 'processed', 'rejected', 'errored');
  end if;

  if not exists (select 1 from pg_type where typname = 'np_change_type') then
    create type np_change_type as enum ('create', 'merge', 'update', 'deprecate');
  end if;

  if not exists (select 1 from pg_type where typname = 'np_dedupe_decision') then
    create type np_dedupe_decision as enum ('reject', 'merge', 'create');
  end if;
end
$$;

create table if not exists np_items (
  id uuid primary key default gen_random_uuid(),
  item_type np_item_type not null,
  slug text not null,
  title text not null,
  content_json jsonb not null,
  language text not null default 'no',
  status np_item_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (item_type, slug)
);

create table if not exists np_item_versions (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null references np_items(id) on delete cascade,
  version int not null,
  change_type np_change_type not null,
  diff_json jsonb not null default '{}'::jsonb,
  source_tag text,
  created_by text not null default 'system',
  created_at timestamptz not null default now()
);

create table if not exists np_ingest_queue (
  id uuid primary key default gen_random_uuid(),
  item_type np_item_type not null,
  raw_text text,
  raw_json jsonb,
  source_tag text,
  language_hint text,
  status np_ingest_status not null default 'pending',
  created_at timestamptz not null default now()
);

create table if not exists np_fingerprints (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null references np_items(id) on delete cascade,
  fingerprint text not null,
  normalized_text text not null,
  embedding vector(1536),
  created_at timestamptz not null default now()
);

create table if not exists np_dedupe_decisions (
  id uuid primary key default gen_random_uuid(),
  ingest_id uuid not null references np_ingest_queue(id) on delete cascade,
  candidate_item_id uuid references np_items(id),
  overlap_score double precision,
  decision np_dedupe_decision not null,
  rationale text,
  created_at timestamptz not null default now()
);

create index if not exists idx_np_items_type_status on np_items(item_type, status);
create index if not exists idx_np_ingest_queue_status_type on np_ingest_queue(status, item_type);
create index if not exists idx_np_fingerprints_item on np_fingerprints(item_id);
create index if not exists idx_np_fingerprints_fingerprint on np_fingerprints(fingerprint);
create index if not exists idx_np_versions_item_version on np_item_versions(item_id, version desc);

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_np_items_updated on np_items;
create trigger trg_np_items_updated
before update on np_items
for each row execute procedure set_updated_at();
