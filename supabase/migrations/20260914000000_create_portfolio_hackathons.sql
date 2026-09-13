create table if not exists public.portfolio_hackathons (
  id uuid primary key default gen_random_uuid(),
  number text not null,
  title text not null,
  project text not null,
  detail text not null default '',
  description text not null default '',
  color text not null default 'violet',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.portfolio_hackathons enable row level security;

drop policy if exists portfolio_hackathons_public_read on public.portfolio_hackathons;
create policy portfolio_hackathons_public_read on public.portfolio_hackathons for select to anon, authenticated using (true);

drop policy if exists portfolio_hackathons_authenticated_write on public.portfolio_hackathons;
create policy portfolio_hackathons_authenticated_write on public.portfolio_hackathons for all to authenticated using (true) with check (true);

grant usage on schema public to anon, authenticated;
grant select on public.portfolio_hackathons to anon, authenticated;
grant insert, update, delete on public.portfolio_hackathons to authenticated;

insert into public.portfolio_hackathons (number, title, project, detail, description, color, sort_order)
select * from (values
  ('01', 'Quantum Flow', 'Focus, habits, momentum', 'A productivity system built for daily progress', 'Quantum Flow is a mobile-first personal productivity system for habits, goals, study planning, focus sessions, quotes, and progress tracking, with local persistence and a PWA foundation.', 'violet', 0),
  ('02', 'COSMOS', 'Academic command center', 'An offline-first operating system for learning', 'COSMOS is an offline-first academic command center for schedules, tasks, syllabus progress, study sessions, goals, roadmaps, analytics, and reflection.', 'blue', 1),
  ('03', 'VOX', 'Interruptible AI voice', 'A prototype focused on recovery and control', 'VOX is an interruptible real-time AI voice assistant prototype focused on interruption and recovery across speech recognition, AI responses, and voice output.', 'mint', 2)
) as seed(number, title, project, detail, description, color, sort_order)
where not exists (select 1 from public.portfolio_hackathons);
