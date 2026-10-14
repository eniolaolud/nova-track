-- Grant API access for profiles (run if Profile can't load)
grant usage on schema public to authenticated;
grant select, insert, update on table public.profiles to authenticated;
