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

create policy "Public can read journal" on public.portfolio_journal
  for select using (true);

create policy "Authenticated admins can manage journal" on public.portfolio_journal
  for all to authenticated using (true) with check (true);

insert into public.portfolio_journal (title, excerpt, body, published_at, read_time, tags, featured, sort_order)
select 'Building in public, one experiment at a time', 'Notes on learning, shipping, and keeping the loop close.', 'This is a place for longer notes about the ideas behind the work.', '2026-01-01', '3 min read', array['Building','Learning'], true, 0
where not exists (select 1 from public.portfolio_journal);
