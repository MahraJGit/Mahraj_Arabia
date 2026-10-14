-- Featured flag for homepage service cards (admin checkbox).

alter table public.services
  add column if not exists featured boolean not null default false;

create index if not exists services_featured_idx on public.services (featured)
  where featured = true;
