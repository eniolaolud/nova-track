-- Apple Calendar (.ics) subscribe feed
-- Run once in Supabase SQL Editor (new snippet)

alter table public.profiles
  add column if not exists ics_feed_token text unique;

-- Public feed lookup (token in URL; no login cookies in Apple Calendar)
create or replace function public.todos_for_ics_token(p_token text)
returns table (
  id uuid,
  title text,
  due_date text,
  due_time text,
  completed boolean
)
language sql
security definer
set search_path = public
as $$
  select t.id, t.title, t.due_date, t.due_time, t.completed
  from public.todos t
  join public.profiles p on p.id = t.user_id
  where p.ics_feed_token is not null
    and p.ics_feed_token = p_token
    and coalesce(t.completed, false) = false
  order by t.created_at desc;
$$;

grant execute on function public.todos_for_ics_token(text) to anon, authenticated;
