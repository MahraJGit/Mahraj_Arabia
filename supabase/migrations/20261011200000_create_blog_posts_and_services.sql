-- Blog posts and services CMS tables (Supabase)
-- Applied remotely via Supabase MCP; kept in-repo for documentation.

create table if not exists public.blog_posts (
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
  seo_title text not null default '',
  seo_description text not null default '',
  category_id uuid references public.blog_categories (id) on delete set null,
  author text not null default '',
  author_image_id text,
  author_image_url text not null default '',
  author_image_alt text not null default '',
  author_image_filename text not null default '',
  author_image_width integer,
  author_image_height integer,
  read_time text not null default '',
  published_at timestamptz,
  featured boolean not null default false,
  status public.publish_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint blog_posts_slug_unique unique (slug),
  constraint blog_posts_title_not_blank check (char_length(trim(title)) > 0),
  constraint blog_posts_slug_not_blank check (char_length(trim(slug)) > 0)
);

create index if not exists blog_posts_status_idx on public.blog_posts (status);
create index if not exists blog_posts_featured_idx on public.blog_posts (featured);
create index if not exists blog_posts_category_idx on public.blog_posts (category_id);
create index if not exists blog_posts_published_at_idx on public.blog_posts (published_at desc nulls last);

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null,
  parent_id uuid not null references public.service_families (id) on delete restrict,
  excerpt text not null default '',
  image_id text,
  image_url text not null default '',
  image_alt text not null default '',
  image_filename text not null default '',
  image_width integer,
  image_height integer,
  overview_image_id text,
  overview_image_url text not null default '',
  overview_image_alt text not null default '',
  related_service_ids uuid[] not null default '{}',
  sort_order integer not null default 10,
  show_in_mega_menu boolean not null default true,
  detail_ready boolean not null default false,
  hero_title text not null default '',
  hero_description text not null default '',
  overview_title text not null default '',
  overview_description text not null default '',
  guide_title text not null default '',
  guide_description text not null default '',
  applications jsonb not null default '[]'::jsonb,
  show_process boolean not null default true,
  process_title text not null default '',
  process_description text not null default '',
  process_steps jsonb not null default '[]'::jsonb,
  faq_intro text not null default '',
  faqs jsonb not null default '[]'::jsonb,
  seo_title text not null default '',
  seo_description text not null default '',
  status public.publish_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint services_slug_unique unique (slug),
  constraint services_title_not_blank check (char_length(trim(title)) > 0),
  constraint services_slug_not_blank check (char_length(trim(slug)) > 0)
);

create index if not exists services_parent_sort_idx on public.services (parent_id, sort_order asc);
create index if not exists services_status_idx on public.services (status);
create index if not exists services_menu_idx on public.services (show_in_mega_menu);

drop trigger if exists blog_posts_set_updated_at on public.blog_posts;
create trigger blog_posts_set_updated_at
  before update on public.blog_posts
  for each row execute function public.set_updated_at();

drop trigger if exists services_set_updated_at on public.services;
create trigger services_set_updated_at
  before update on public.services
  for each row execute function public.set_updated_at();

alter table public.blog_posts enable row level security;
alter table public.services enable row level security;

drop policy if exists "Public can read published blog posts" on public.blog_posts;
create policy "Public can read published blog posts"
  on public.blog_posts
  for select
  to anon, authenticated
  using (status = 'published');

drop policy if exists "Public can read published services" on public.services;
create policy "Public can read published services"
  on public.services
  for select
  to anon, authenticated
  using (status = 'published');
