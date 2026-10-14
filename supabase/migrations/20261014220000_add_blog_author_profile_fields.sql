-- Author profile fields for blog posts (image + role/title).

alter table public.blog_posts
  add column if not exists author_role text not null default '',
  add column if not exists author_image_id text,
  add column if not exists author_image_url text not null default '',
  add column if not exists author_image_alt text not null default '',
  add column if not exists author_image_filename text not null default '',
  add column if not exists author_image_width integer,
  add column if not exists author_image_height integer;
