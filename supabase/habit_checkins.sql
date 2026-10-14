-- Habit daily check-ins
-- Run once in Supabase SQL Editor (new snippet)

alter table public.habits
  add column if not exists last_checked_at date;
