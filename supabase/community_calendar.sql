-- Community + Google Calendar tables
-- Run in Supabase SQL Editor (new snippet)

-- =========================
-- POSTS
-- =========================
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  content text not null,
  streak_badge text,
  claps_count integer not null default 0,
  comments_count integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.posts enable row level security;

-- Everyone logged in can read the community feed
create policy "Authenticated users can read posts"
  on public.posts for select
  to authenticated
  using (true);

create policy "Users can create own posts"
  on public.posts for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update own posts"
  on public.posts for update
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can delete own posts"
  on public.posts for delete
  to authenticated
  using (auth.uid() = user_id);

-- =========================
-- POST CLAPS (one clap per user per post)
-- =========================
create table if not exists public.post_claps (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts on delete cascade,
  user_id uuid not null references auth.users on delete cascade,
  created_at timestamptz not null default now(),
  unique (post_id, user_id)
);

alter table public.post_claps enable row level security;

create policy "Authenticated users can read claps"
  on public.post_claps for select
  to authenticated
  using (true);

create policy "Users can clap"
  on public.post_claps for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can remove own clap"
  on public.post_claps for delete
  to authenticated
  using (auth.uid() = user_id);

-- =========================
-- COMMENTS
-- =========================
create table if not exists public.post_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts on delete cascade,
  user_id uuid not null references auth.users on delete cascade,
  content text not null,
  created_at timestamptz not null default now()
);

alter table public.post_comments enable row level security;

create policy "Authenticated users can read comments"
  on public.post_comments for select
  to authenticated
  using (true);

create policy "Users can create comments"
  on public.post_comments for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can delete own comments"
  on public.post_comments for delete
  to authenticated
  using (auth.uid() = user_id);

-- =========================
-- GOOGLE CALENDAR TOKENS
-- =========================
create table if not exists public.google_calendar_tokens (
  user_id uuid primary key references auth.users on delete cascade,
  access_token text not null,
  refresh_token text,
  expiry_date bigint,
  email text,
  updated_at timestamptz not null default now()
);

alter table public.google_calendar_tokens enable row level security;

create policy "Users manage own google tokens"
  on public.google_calendar_tokens for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Add calendar event tracking on todos
alter table public.todos
  add column if not exists google_event_id text;

alter table public.todos
  add column if not exists google_calendar_id text;

-- Community needs to read other users' usernames
drop policy if exists "Authenticated users can read profiles" on public.profiles;
create policy "Authenticated users can read profiles"
  on public.profiles for select
  to authenticated
  using (true);

-- Permissions for API roles
grant usage on schema public to authenticated;
grant select on table public.profiles to authenticated;
grant select, insert, update, delete on table public.posts to authenticated;
grant select, insert, delete on table public.post_claps to authenticated;
grant select, insert, delete on table public.post_comments to authenticated;
grant select, insert, update, delete on table public.google_calendar_tokens to authenticated;
