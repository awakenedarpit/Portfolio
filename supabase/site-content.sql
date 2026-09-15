create table if not exists public.portfolio_site_content (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.portfolio_site_content enable row level security;

create policy "Public can read site content" on public.portfolio_site_content
  for select using (true);

create policy "Authenticated admins can manage site content" on public.portfolio_site_content
  for all to authenticated using (true) with check (true);

insert into public.portfolio_site_content (key, value) values
('identity', '{"hero":"Building ideas into experiences.","bio":"I am Arpit Raj — a BTech AI/ML student, developer, and builder.","tags":["AI/ML","Development","Learning","Building"]}'::jsonb),
('skills', '{"groups":[]}'::jsonb),
('journey', '{"entries":[]}'::jsonb),
('certifications', '{"entries":[]}'::jsonb),
('contact', '{"github":"https://github.com/awakenedarpit","linkedin":"https://www.linkedin.com/in/awakenedarpit/","email":"mailto:awakenedarpit@gmail.com","instagram":"https://www.instagram.com/awakenedarpit/","twitter":"https://x.com/awakenedarpit"}'::jsonb)
on conflict (key) do nothing;
