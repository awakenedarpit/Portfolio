-- Run this entire file in Supabase Dashboard -> SQL Editor.
-- Safe to run more than once; it does not delete existing project or hackathon data.

create table if not exists public.portfolio_journal (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  excerpt text not null default '',
  body text not null default '',
  published_at date not null default current_date,
  read_time text not null default '3 min read',
  tags text[] not null default '{}',
  featured boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.portfolio_journal enable row level security;
drop policy if exists "Public can read journal" on public.portfolio_journal;
create policy "Public can read journal" on public.portfolio_journal for select to anon, authenticated using (true);
drop policy if exists "Authenticated admins can manage journal" on public.portfolio_journal;
create policy "Authenticated admins can manage journal" on public.portfolio_journal for all to authenticated using (true) with check (true);
grant select on public.portfolio_journal to anon, authenticated;
grant insert, update, delete on public.portfolio_journal to authenticated;

insert into public.portfolio_journal (title, excerpt, body, published_at, read_time, tags, featured, sort_order)
select 'Building in public, one experiment at a time', 'Notes on learning, shipping, and keeping the loop close.', 'This is a place for longer notes about the ideas behind the work.', '2026-01-01', '3 min read', array['Building','Learning'], true, 0
where not exists (select 1 from public.portfolio_journal);

create table if not exists public.portfolio_site_content (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.portfolio_site_content enable row level security;
drop policy if exists "Public can read site content" on public.portfolio_site_content;
create policy "Public can read site content" on public.portfolio_site_content for select to anon, authenticated using (true);
drop policy if exists "Authenticated admins can manage site content" on public.portfolio_site_content;
create policy "Authenticated admins can manage site content" on public.portfolio_site_content for all to authenticated using (true) with check (true);
grant select on public.portfolio_site_content to anon, authenticated;
grant insert, update, delete on public.portfolio_site_content to authenticated;

insert into public.portfolio_site_content (key, value) values
('identity', '{"hero":"Building ideas into experiences.","bio":"I am Arpit Raj — a BTech AI/ML student, developer, and builder.","about":"I am currently building my foundations in AI/ML and web development, while looking for the details that make an experience feel clear, human, and worth returning to.","tags":["AI/ML","Development","Learning","Building","Experimenting"]}'::jsonb),
('skills', '{"groups":[]}'::jsonb),
('journey', '{"entries":[]}'::jsonb),
('certifications', '{"entries":[]}'::jsonb),
('contact', '{"github":"https://github.com/awakenedarpit","linkedin":"https://www.linkedin.com/in/awakenedarpit/","email":"mailto:awakenedarpit@gmail.com","instagram":"https://www.instagram.com/awakenedarpit/","twitter":"https://x.com/awakenedarpit"}'::jsonb)
on conflict (key) do nothing;

notify pgrst, 'reload schema';
