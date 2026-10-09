-- CMS: service families (admin "Families") and blog categories
-- Applied remotely via Supabase MCP; kept in-repo for documentation.

do $$ begin
  create type public.publish_status as enum ('draft', 'published');
exception
  when duplicate_object then null;
end $$;

create table if not exists public.service_families (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null,
  menu_description text not null default '',
  sort_order integer not null default 10,
  show_in_mega_menu boolean not null default true,
  status public.publish_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint service_families_slug_unique unique (slug),
  constraint service_families_title_not_blank check (char_length(trim(title)) > 0),
  constraint service_families_slug_not_blank check (char_length(trim(slug)) > 0)
);

create index if not exists service_families_sort_idx
  on public.service_families (sort_order asc, title asc);

create index if not exists service_families_status_idx
  on public.service_families (status);

create table if not exists public.blog_categories (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null,
  subtitle text not null default '',
  image_id text,
  image_url text not null default '',
  image_alt text not null default '',
  image_filename text not null default '',
  image_width integer,
  image_height integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint blog_categories_slug_unique unique (slug),
  constraint blog_categories_title_not_blank check (char_length(trim(title)) > 0),
  constraint blog_categories_slug_not_blank check (char_length(trim(slug)) > 0)
);

create index if not exists blog_categories_title_idx
  on public.blog_categories (title asc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists service_families_set_updated_at on public.service_families;
create trigger service_families_set_updated_at
  before update on public.service_families
  for each row execute function public.set_updated_at();

drop trigger if exists blog_categories_set_updated_at on public.blog_categories;
create trigger blog_categories_set_updated_at
  before update on public.blog_categories
  for each row execute function public.set_updated_at();

alter table public.service_families enable row level security;
alter table public.blog_categories enable row level security;

drop policy if exists "Public can read published service families" on public.service_families;
create policy "Public can read published service families"
  on public.service_families
  for select
  to anon, authenticated
  using (status = 'published');

drop policy if exists "Public can read blog categories" on public.blog_categories;
create policy "Public can read blog categories"
  on public.blog_categories
  for select
  to anon, authenticated
  using (true);
