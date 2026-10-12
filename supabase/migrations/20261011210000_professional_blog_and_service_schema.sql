-- Professional blog + service CMS schema (screenshot-aligned)
-- Applied remotely via Supabase MCP; kept in-repo for documentation.

alter table public.blog_posts
  add column if not exists tags text[] not null default '{}',
  add column if not exists focus_keyword text not null default '',
  add column if not exists faqs jsonb not null default '[]'::jsonb,
  add column if not exists meta_title text not null default '',
  add column if not exists meta_description text not null default '';

update public.blog_posts
set
  meta_title = coalesce(nullif(meta_title, ''), seo_title, ''),
  meta_description = coalesce(nullif(meta_description, ''), seo_description, '');

alter table public.blog_posts drop constraint if exists blog_posts_tags_max;
alter table public.blog_posts
  add constraint blog_posts_tags_max check (cardinality(tags) <= 8);

drop table if exists public.services cascade;

create table public.services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null,
  excerpt text not null default '',
  content jsonb not null default '{}'::jsonb,
  cover_image_id text,
  cover_image_url text not null default '',
  cover_image_alt text not null default '',
  cover_image_filename text not null default '',
  cover_image_width integer,
  cover_image_height integer,
  family_id uuid not null references public.service_families (id) on delete restrict,
  status public.publish_status not null default 'draft',
  tags text[] not null default '{}',
  meta_title text not null default '',
  meta_description text not null default '',
  focus_keyword text not null default '',
  faqs jsonb not null default '[]'::jsonb,
  sort_order integer not null default 10,
  show_in_mega_menu boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint services_slug_unique unique (slug),
  constraint services_title_not_blank check (char_length(trim(title)) > 0),
  constraint services_slug_not_blank check (char_length(trim(slug)) > 0),
  constraint services_tags_max check (cardinality(tags) <= 8)
);

create index services_family_sort_idx on public.services (family_id, sort_order asc);
create index services_status_idx on public.services (status);
create index services_menu_idx on public.services (show_in_mega_menu);

create trigger services_set_updated_at
  before update on public.services
  for each row execute function public.set_updated_at();

alter table public.services enable row level security;

create policy "Public can read published services"
  on public.services
  for select
  to anon, authenticated
  using (status = 'published');

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'cms-media',
  'cms-media',
  true,
  3145728,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;
