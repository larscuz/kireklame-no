-- KI Opplæring: daglig kvotesporing og atomisk consume-RPC

create table if not exists public.ki_usage_daily (
  id uuid primary key default gen_random_uuid(),
  day date not null,
  subject_type text not null check (subject_type in ('anon', 'user')),
  subject_id text not null,
  count int not null default 0,
  last_request_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (day, subject_type, subject_id)
);

create index if not exists idx_ki_usage_daily_lookup
  on public.ki_usage_daily (day, subject_type, subject_id);

alter table public.ki_usage_daily enable row level security;

drop policy if exists ki_usage_daily_select_own_user on public.ki_usage_daily;
create policy ki_usage_daily_select_own_user
  on public.ki_usage_daily
  for select
  to authenticated
  using (
    subject_type = 'user'
    and subject_id = auth.uid()::text
  );

create or replace function public.ki_try_consume_quota(
  p_subject_type text,
  p_subject_id text,
  p_limit int
)
returns table (
  allowed boolean,
  remaining int,
  used int,
  quota_limit int
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_day date;
  v_used int;
begin
  if p_subject_type not in ('anon', 'user') then
    raise exception 'Invalid subject_type: %', p_subject_type;
  end if;

  if p_subject_id is null or length(trim(p_subject_id)) = 0 then
    raise exception 'subject_id is required';
  end if;

  if p_limit is null or p_limit < 1 then
    raise exception 'limit must be >= 1';
  end if;

  v_day := (timezone('utc', now()))::date;

  insert into public.ki_usage_daily (day, subject_type, subject_id, count, last_request_at)
  values (v_day, p_subject_type, p_subject_id, 0, now())
  on conflict (day, subject_type, subject_id) do nothing;

  update public.ki_usage_daily
  set
    count = count + 1,
    last_request_at = now(),
    updated_at = now()
  where day = v_day
    and subject_type = p_subject_type
    and subject_id = p_subject_id
    and count < p_limit
  returning count into v_used;

  if found then
    allowed := true;
  else
    allowed := false;
    select count
      into v_used
    from public.ki_usage_daily
    where day = v_day
      and subject_type = p_subject_type
      and subject_id = p_subject_id
    limit 1;
  end if;

  used := coalesce(v_used, 0);
  quota_limit := p_limit;
  remaining := greatest(p_limit - used, 0);

  return next;
end;
$$;

revoke all on function public.ki_try_consume_quota(text, text, int) from public;
grant execute on function public.ki_try_consume_quota(text, text, int) to service_role;
