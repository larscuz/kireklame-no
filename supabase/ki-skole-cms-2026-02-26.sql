-- KI-skole CMS for /norsk-prompting/eksempler
-- Date: 2026-02-26

create table if not exists public.ki_skole_examples (
  id uuid primary key default gen_random_uuid(),
  example_key text not null unique,
  title text not null,
  output_type text not null check (output_type in ('image', 'video')),
  model_name text not null,
  difficulty text not null check (difficulty in ('Vanskelig', 'Svært vanskelig')),
  challenge text not null,
  short_brief text not null,
  mini_tutorial jsonb not null default '[]'::jsonb,
  prompt_text text not null,
  terms jsonb not null default '[]'::jsonb,
  media_kind text not null check (media_kind in ('image', 'video')),
  media_src text,
  media_thumbnail_src text,
  media_poster_src text,
  media_alt text not null,
  media_caption text not null,
  is_placeholder boolean not null default true,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_ki_skole_examples_sort
  on public.ki_skole_examples (is_active desc, sort_order asc, created_at asc);

create index if not exists idx_ki_skole_examples_key
  on public.ki_skole_examples (example_key);

drop trigger if exists trg_ki_skole_examples_updated_at on public.ki_skole_examples;
create trigger trg_ki_skole_examples_updated_at
before update on public.ki_skole_examples
for each row execute function public.set_updated_at();

alter table public.ki_skole_examples enable row level security;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'ki_skole_examples'
      and policyname = 'public read active ki skole examples'
  ) then
    create policy "public read active ki skole examples"
      on public.ki_skole_examples
      for select
      using (is_active = true);
  end if;
end $$;
